const APP_NAME = '社内ツールポータル';
const DATABASE_PROPERTY = 'INTERNAL_TOOLS_DATABASE_ID';
const SHEETS = {
  users: ['Email', 'Name', 'Role', 'Enabled', 'Tools', 'UpdatedAt'],
  tools: ['Id', 'Name', 'Description', 'Route', 'Url', 'Icon', 'Enabled', 'Sort', 'UpdatedAt'],
  contacts: ['Id', 'Company', 'Person', 'Email', 'Industry', 'Area', 'Segment', 'Score', 'SourceUrl', 'PersonalNote', 'Template', 'Status', 'NextAction', 'ReplyType', 'MeetingDate', 'MeetingResult', 'Owner', 'Memo', 'Step', 'CreatedAt', 'LastSent', 'Delivered', 'ReplyStep', 'UpdatedAt', 'UpdatedBy'],
  activities: ['Id', 'ToolId', 'ContactId', 'Text', 'Type', 'At', 'UserEmail']
};

function doGet(e) {
  const params = (e && e.parameter) || {};
  const route = String(params.tool || 'portal').toLowerCase();
  const template = HtmlService.createTemplateFromFile('Index');
  try {
    template.bootstrapJson = safeJson_(buildBootstrap_(route));
  } catch (error) {
    template.bootstrapJson = safeJson_({ok:false, route:'error', error:error.message || String(error)});
  }
  return template.evaluate()
    .setTitle(route === 'relay' ? 'Relay｜社内ツールポータル' : APP_NAME)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function setupInternalTools() {
  const properties = PropertiesService.getScriptProperties();
  let databaseId = properties.getProperty(DATABASE_PROPERTY);
  let spreadsheet;
  if (databaseId) {
    spreadsheet = SpreadsheetApp.openById(databaseId);
  } else {
    spreadsheet = SpreadsheetApp.create(APP_NAME + ' データ');
    databaseId = spreadsheet.getId();
    properties.setProperty(DATABASE_PROPERTY, databaseId);
  }
  ensureSchema_(spreadsheet);
  const email = normalizeEmail_(Session.getEffectiveUser().getEmail());
  if (!email) throw new Error('初期管理者のGoogleアカウントを取得できません。');
  seedAdmin_(spreadsheet, email);
  seedTools_(spreadsheet);
  seedContacts_(spreadsheet);
  return {databaseId:databaseId, databaseUrl:spreadsheet.getUrl(), adminEmail:email};
}

function getPortalData() {
  return buildBootstrap_('portal');
}

function getRelayData() {
  const context = authorize_('relay');
  return {ok:true, user:context.user, contacts:listContacts_(), activities:listActivities_('relay', 30)};
}

function saveContact(input) {
  const context = authorize_('relay');
  const contact = sanitizeContact_(input || {});
  if (!contact.company || !contact.person || !contact.email) throw new Error('会社名、担当者名、メールアドレスは必須です。');
  if (!/^\S+@\S+\.\S+$/.test(contact.email)) throw new Error('メールアドレスの形式を確認してください。');
  return withLock_(function() {
    const sheet = getDatabase_().getSheetByName('Contacts');
    const records = readObjects_(sheet);
    const existingIndex = records.findIndex(function(row) { return row.id === contact.id; });
    const now = timestamp_();
    if (existingIndex >= 0) {
      const existing = records[existingIndex];
      contact.createdAt = existing.createdAt;
      contact.lastSent = contact.lastSent || existing.lastSent;
      contact.delivered = contact.delivered === '' ? existing.delivered : contact.delivered;
      contact.replyStep = contact.replyStep === '' ? existing.replyStep : contact.replyStep;
      contact.updatedAt = now;
      contact.updatedBy = context.email;
      writeObjectRow_(sheet, existingIndex + 2, contact, SHEETS.contacts);
      addActivity_('relay', contact.id, contact.company + 'を更新しました', 'update', context.email);
    } else {
      contact.id = contact.id || Utilities.getUuid();
      contact.createdAt = contact.createdAt || dateString_(new Date());
      contact.updatedAt = now;
      contact.updatedBy = context.email;
      appendObject_(sheet, contact, SHEETS.contacts);
      addActivity_('relay', contact.id, contact.company + 'を追加しました', 'update', context.email);
    }
    return {ok:true, contact:contact};
  });
}

function recordContactAction(contactId, action, details) {
  const context = authorize_('relay');
  return withLock_(function() {
    const sheet = getDatabase_().getSheetByName('Contacts');
    const records = readObjects_(sheet);
    const index = records.findIndex(function(row) { return row.id === String(contactId); });
    if (index < 0) throw new Error('対象のコンタクトが見つかりません。');
    const contact = records[index];
    const today = dateString_(new Date());
    const memo = details && String(details.memo || '').trim();
    let activity = '';
    let type = 'update';
    if (action === 'sent') {
      const sentStep = Number(contact.step || 0);
      contact.lastSent = today;
      contact.delivered = true;
      contact.status = 'active';
      if (sentStep === 0) { contact.step = 1; contact.nextAction = addBusinessDays_(today, 3); }
      else if (sentStep === 1) { contact.step = 2; contact.nextAction = addBusinessDays_(today, 4); }
      else { contact.status = 'completed'; contact.nextAction = ''; }
      activity = contact.company + 'の' + ['D0初回', 'D3リマインド1', 'D7最終'][sentStep] + '送信を記録しました';
      type = 'sent';
    } else if (action === 'reply') {
      contact.status = 'replied';
      contact.replyType = String((details && details.replyType) || '前向き');
      contact.replyStep = Number(contact.step || 0);
      contact.nextAction = '';
      activity = contact.company + 'からの返信を記録しました'; type = 'reply';
    } else if (action === 'meeting') {
      contact.status = 'meeting'; contact.replyType = contact.replyType || '前向き';
      contact.replyStep = contact.replyStep === '' ? Number(contact.step || 0) : contact.replyStep;
      contact.meetingDate = String((details && details.meetingDate) || today); contact.nextAction = '';
      activity = contact.company + 'を商談化しました'; type = 'meeting';
    } else if (action === 'pending') {
      contact.status = 'pending'; contact.nextAction = addDaysAvoidWeekend_(today, 90);
      activity = contact.company + 'を90日保留にしました';
    } else if (action === 'unsubscribed') {
      contact.status = 'unsubscribed'; contact.nextAction = '';
      activity = contact.company + 'を配信停止にしました';
    } else if (action === 'bounced') {
      contact.status = 'bounced'; contact.delivered = false; contact.nextAction = '';
      activity = contact.company + 'のバウンスを記録しました';
    } else {
      throw new Error('対応種別が不正です。');
    }
    if (memo) contact.memo = [contact.memo, memo].filter(Boolean).join('\n');
    contact.updatedAt = timestamp_(); contact.updatedBy = context.email;
    writeObjectRow_(sheet, index + 2, contact, SHEETS.contacts);
    addActivity_('relay', contact.id, activity, type, context.email);
    return {ok:true, contact:contact};
  });
}

function importContacts(rows) {
  const context = authorize_('relay');
  if (!Array.isArray(rows) || !rows.length) throw new Error('取込対象がありません。');
  if (rows.length > 1000) throw new Error('一度に取り込めるのは1000件までです。');
  return withLock_(function() {
    const sheet = getDatabase_().getSheetByName('Contacts');
    let count = 0;
    rows.forEach(function(input) {
      const contact = sanitizeContact_(input || {});
      if (!contact.company || !contact.email) return;
      contact.id = Utilities.getUuid(); contact.createdAt = dateString_(new Date());
      contact.updatedAt = timestamp_(); contact.updatedBy = context.email;
      appendObject_(sheet, contact, SHEETS.contacts); count++;
    });
    addActivity_('relay', '', 'CSVから' + count + '件を取り込みました', 'import', context.email);
    return {ok:true, count:count};
  });
}

function listAdminData() {
  const context = authorize_('', 'admin');
  return {ok:true, user:context.user, users:readObjects_(getDatabase_().getSheetByName('Users')), tools:readObjects_(getDatabase_().getSheetByName('Tools'))};
}

function savePortalUser(input) {
  const context = authorize_('', 'admin');
  const email = normalizeEmail_(input && input.email);
  if (!email) throw new Error('メールアドレスを入力してください。');
  return withLock_(function() {
    const sheet = getDatabase_().getSheetByName('Users');
    const rows = readObjects_(sheet); const index = rows.findIndex(function(row) { return row.email === email; });
    const user = {email:email, name:String(input.name || ''), role:input.role === 'admin' ? 'admin' : 'member', enabled:input.enabled !== false, tools:String(input.tools || '*'), updatedAt:timestamp_()};
    if (index >= 0) writeObjectRow_(sheet, index + 2, user, SHEETS.users); else appendObject_(sheet, user, SHEETS.users);
    addActivity_('portal', '', context.email + 'が利用者 ' + email + ' を更新しました', 'admin', context.email);
    return {ok:true, user:user};
  });
}

function savePortalTool(input) {
  const context = authorize_('', 'admin');
  const id = String(input && input.id || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  if (!id || !input.name) throw new Error('ツールIDと名称を入力してください。');
  return withLock_(function() {
    const sheet = getDatabase_().getSheetByName('Tools'); const rows = readObjects_(sheet);
    const index = rows.findIndex(function(row) { return row.id === id; });
    const tool = {id:id, name:String(input.name), description:String(input.description || ''), route:String(input.route || id), url:String(input.url || ''), icon:String(input.icon || '◇'), enabled:input.enabled !== false, sort:Number(input.sort || 100), updatedAt:timestamp_()};
    if (index >= 0) writeObjectRow_(sheet, index + 2, tool, SHEETS.tools); else appendObject_(sheet, tool, SHEETS.tools);
    addActivity_('portal', '', context.email + 'がツール ' + id + ' を更新しました', 'admin', context.email);
    return {ok:true, tool:tool};
  });
}

function buildBootstrap_(route) {
  const context = authorize_(route === 'relay' ? 'relay' : '');
  const tools = allowedTools_(context.user);
  if (route !== 'portal' && !tools.some(function(tool) { return tool.id === route || tool.route === route; })) throw new Error('このツールを利用する権限がありません。');
  const result = {ok:true, route:route, user:context.user, tools:tools, webAppUrl:ScriptApp.getService().getUrl() || ''};
  if (route === 'relay') { result.contacts = listContacts_(); result.activities = listActivities_('relay', 30); }
  if (context.user.role === 'admin') result.isAdmin = true;
  return result;
}

function authorize_(toolId, requiredRole) {
  const email = normalizeEmail_(Session.getActiveUser().getEmail());
  if (!email) throw new Error('Google Workspaceアカウントを確認できません。組織アカウントでログインしてください。');
  const users = readObjects_(getDatabase_().getSheetByName('Users'));
  const user = users.find(function(row) { return row.email === email; });
  if (!user || !toBoolean_(user.enabled)) throw new Error('このポータルを利用する権限がありません。管理者へ連絡してください。');
  if (requiredRole === 'admin' && user.role !== 'admin') throw new Error('管理者権限が必要です。');
  if (toolId && user.role !== 'admin') {
    const allowed = String(user.tools || '').split(',').map(function(value) { return value.trim(); });
    if (allowed.indexOf('*') < 0 && allowed.indexOf(toolId) < 0) throw new Error('このツールを利用する権限がありません。');
  }
  return {email:email, user:user};
}

function allowedTools_(user) {
  const allowed = String(user.tools || '').split(',').map(function(value) { return value.trim(); });
  return readObjects_(getDatabase_().getSheetByName('Tools'))
    .filter(function(tool) { return toBoolean_(tool.enabled) && (user.role === 'admin' || allowed.indexOf('*') >= 0 || allowed.indexOf(tool.id) >= 0); })
    .sort(function(a, b) { return Number(a.sort || 100) - Number(b.sort || 100); });
}

function getDatabase_() {
  const id = PropertiesService.getScriptProperties().getProperty(DATABASE_PROPERTY);
  if (!id) throw new Error('初期設定が完了していません。管理者が setupInternalTools() を一度実行してください。');
  return SpreadsheetApp.openById(id);
}

function ensureSchema_(spreadsheet) {
  Object.keys(SHEETS).forEach(function(key) {
    const name = key.charAt(0).toUpperCase() + key.slice(1);
    let sheet = spreadsheet.getSheetByName(name);
    if (!sheet) sheet = spreadsheet.insertSheet(name);
    const headers = SHEETS[key];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  });
  const defaultSheet = spreadsheet.getSheetByName('Sheet1');
  if (defaultSheet && spreadsheet.getSheets().length > Object.keys(SHEETS).length) spreadsheet.deleteSheet(defaultSheet);
}

function seedAdmin_(spreadsheet, email) {
  const sheet = spreadsheet.getSheetByName('Users'); const rows = readObjects_(sheet);
  if (!rows.some(function(row) { return row.email === email; })) appendObject_(sheet, {email:email, name:'管理者', role:'admin', enabled:true, tools:'*', updatedAt:timestamp_()}, SHEETS.users);
}

function seedTools_(spreadsheet) {
  const sheet = spreadsheet.getSheetByName('Tools');
  if (sheet.getLastRow() > 1) return;
  appendObject_(sheet, {id:'relay', name:'Relay', description:'営業フォローと商談進捗を管理', route:'relay', url:'', icon:'R', enabled:true, sort:10, updatedAt:timestamp_()}, SHEETS.tools);
}

function seedContacts_(spreadsheet) {
  const sheet = spreadsheet.getSheetByName('Contacts'); if (sheet.getLastRow() > 1) return;
  const today = dateString_(new Date());
  const samples = [
    {company:'湘南テック株式会社', person:'佐藤 美咲', email:'misaki@example.jp', industry:'IT・SaaS', area:'神奈川', segment:'新規開拓', score:86, personalNote:'採用DXの新サービス発表を拝見しました', template:'A：課題起点', status:'active', nextAction:today, owner:'担当A', step:0},
    {company:'合同会社Knot Works', person:'田中 健', email:'tanaka@example.jp', industry:'コンサルティング', area:'東京', segment:'紹介', score:78, personalNote:'地域企業向けプロジェクトの記事を拝見しました', template:'C：紹介起点', status:'active', nextAction:today, owner:'担当B', step:1},
    {company:'Green Harbor株式会社', person:'鈴木 彩', email:'suzuki@example.jp', industry:'環境・エネルギー', area:'神奈川', segment:'イベント', score:72, personalNote:'地域共創イベントでのお話が印象的でした', template:'B：事例起点', status:'active', nextAction:today, owner:'担当A', step:2}
  ];
  samples.forEach(function(sample) {
    const contact = sanitizeContact_(sample); contact.id = Utilities.getUuid(); contact.createdAt = today; contact.updatedAt = timestamp_(); contact.updatedBy = 'setup'; appendObject_(sheet, contact, SHEETS.contacts);
  });
}

function sanitizeContact_(input) {
  const status = ['active','pending','replied','meeting','won','unsubscribed','bounced','completed'].indexOf(input.status) >= 0 ? input.status : 'active';
  return {
    id:String(input.id || ''), company:String(input.company || '').trim(), person:String(input.person || '').trim(), email:normalizeEmail_(input.email), industry:String(input.industry || ''), area:String(input.area || ''), segment:String(input.segment || 'その他'), score:Math.max(0, Math.min(100, Number(input.score || 50))), sourceUrl:String(input.sourceUrl || ''), personalNote:String(input.personalNote || ''), template:String(input.template || 'A：課題起点'), status:status, nextAction:String(input.nextAction || (status === 'active' ? dateString_(new Date()) : '')), replyType:String(input.replyType || ''), meetingDate:String(input.meetingDate || ''), meetingResult:String(input.meetingResult || ''), owner:String(input.owner || ''), memo:String(input.memo || ''), step:Math.max(0, Math.min(2, Number(input.step || 0))), createdAt:String(input.createdAt || ''), lastSent:String(input.lastSent || ''), delivered:input.delivered === false ? false : true, replyStep:input.replyStep === null || input.replyStep === undefined ? '' : input.replyStep, updatedAt:String(input.updatedAt || ''), updatedBy:String(input.updatedBy || '')
  };
}

function listContacts_() { return readObjects_(getDatabase_().getSheetByName('Contacts')); }
function listActivities_(toolId, limit) { return readObjects_(getDatabase_().getSheetByName('Activities')).filter(function(row) { return row.toolId === toolId; }).sort(function(a,b) { return String(b.at).localeCompare(String(a.at)); }).slice(0, limit || 30); }
function addActivity_(toolId, contactId, text, type, email) { appendObject_(getDatabase_().getSheetByName('Activities'), {id:Utilities.getUuid(), toolId:toolId, contactId:contactId, text:text, type:type, at:timestamp_(), userEmail:email}, SHEETS.activities); }

function readObjects_(sheet) {
  const values = sheet.getDataRange().getValues(); if (values.length < 2) return [];
  const keys = values[0].map(toKey_);
  return values.slice(1).filter(function(row) { return row.some(function(value) { return value !== ''; }); }).map(function(row) { const item={}; keys.forEach(function(key,index) { let value=row[index]; if (value instanceof Date) value=Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd'); item[key]=value; }); return item; });
}
function appendObject_(sheet, object, headers) { sheet.appendRow(headers.map(function(header) { return object[toKey_(header)] === undefined ? '' : object[toKey_(header)]; })); }
function writeObjectRow_(sheet, row, object, headers) { sheet.getRange(row, 1, 1, headers.length).setValues([headers.map(function(header) { return object[toKey_(header)] === undefined ? '' : object[toKey_(header)]; })]); }
function toKey_(header) { return String(header).charAt(0).toLowerCase() + String(header).slice(1); }
function normalizeEmail_(email) { return String(email || '').trim().toLowerCase(); }
function safeJson_(value) { return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026'); }
function toBoolean_(value) { return value === true || String(value).toLowerCase() === 'true' || String(value) === '1'; }
function timestamp_() { return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd'T'HH:mm:ssXXX"); }
function dateString_(date) { return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd'); }
function parseDate_(value) { const parts=String(value).split('-').map(Number); return new Date(parts[0], parts[1]-1, parts[2]); }
function addBusinessDays_(value, days) { const date=parseDate_(value); let left=days; while(left>0){date.setDate(date.getDate()+1);if(date.getDay()!==0&&date.getDay()!==6)left--;} return dateString_(date); }
function addDaysAvoidWeekend_(value, days) { const date=parseDate_(value);date.setDate(date.getDate()+days);while(date.getDay()===0||date.getDay()===6)date.setDate(date.getDate()+1);return dateString_(date); }
function withLock_(callback) { const lock=LockService.getScriptLock();lock.waitLock(30000);try{return callback();}finally{lock.releaseLock();} }
