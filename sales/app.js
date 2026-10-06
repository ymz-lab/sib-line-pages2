(() => {
  'use strict';

  const STORAGE_KEY = 'relay-sales-v1';
  const storage = (() => {
    try {
      const testKey = '__relay_storage_test__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      return localStorage;
    } catch (error) {
      const memory = new Map();
      console.info('localStorageが利用できないため、プレビュー中はメモリに保存します。');
      return { getItem:key => memory.get(key) ?? null, setItem:(key,value) => memory.set(key,value) };
    }
  })();
  const STATUS = {
    active: 'フォロー中', pending: '保留', replied: '返信あり', meeting: '商談化',
    won: '成約', unsubscribed: '配信停止', bounced: 'バウンス', completed: '完了'
  };
  const STEP = { 0: 'D0 初回', 1: 'D3 リマインド1', 2: 'D7 最終' };
  const STOP_STATUSES = ['replied', 'meeting', 'won', 'unsubscribed', 'bounced', 'completed'];
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const pad = n => String(n).padStart(2, '0');
  const localDate = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const today = () => localDate(new Date());
  const parseLocal = value => { const [y, m, d] = value.split('-').map(Number); return new Date(y, m - 1, d); };
  const addBusinessDays = (value, days) => {
    const date = parseLocal(value);
    let remaining = days;
    while (remaining > 0) {
      date.setDate(date.getDate() + 1);
      if (![0, 6].includes(date.getDay())) remaining--;
    }
    while ([0, 6].includes(date.getDay())) date.setDate(date.getDate() + 1);
    return localDate(date);
  };
  const addDaysAvoidWeekend = (value, days) => {
    const date = parseLocal(value); date.setDate(date.getDate() + days);
    while ([0, 6].includes(date.getDay())) date.setDate(date.getDate() + 1);
    return localDate(date);
  };
  const dateLabel = value => {
    if (!value) return '—';
    const date = parseLocal(value);
    return `${date.getMonth() + 1}/${date.getDate()} (${['日','月','火','水','木','金','土'][date.getDay()]})`;
  };
  const longDate = date => `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（${['日','月','火','水','木','金','土'][date.getDay()]}）`;
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const initials = value => String(value || 'R').replace(/[^A-Za-z0-9ぁ-んァ-ヶ一-龠]/g, '').slice(0, 2).toUpperCase();
  const uid = () => `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const percent = (part, total) => total ? Math.round(part / total * 100) : 0;

  function seedData() {
    const now = today();
    const past = days => { const d = new Date(); d.setDate(d.getDate() - days); return localDate(d); };
    const future = days => addDaysAvoidWeekend(now, days);
    return {
      contacts: [
        {id:'demo-1',company:'湘南テック株式会社',person:'佐藤 美咲',email:'misaki@s-tech.example',industry:'IT・SaaS',area:'神奈川',segment:'新規開拓',score:86,sourceUrl:'https://example.jp/news',personalNote:'採用DXの新サービス発表を拝見しました',template:'A：課題起点',status:'active',nextAction:now,replyType:'',meetingDate:'',meetingResult:'',owner:'青木',memo:'',step:0,createdAt:past(1),lastSent:'',delivered:true,replyStep:null},
        {id:'demo-2',company:'合同会社Knot Works',person:'田中 健',email:'tanaka@knot.example',industry:'コンサルティング',area:'東京',segment:'紹介',score:78,sourceUrl:'https://example.jp/about',personalNote:'地域企業向けプロジェクトの記事を拝見しました',template:'C：紹介起点',status:'active',nextAction:now,replyType:'',meetingDate:'',meetingResult:'',owner:'山田',memo:'',step:1,createdAt:past(5),lastSent:past(3),delivered:true,replyStep:null},
        {id:'demo-3',company:'Green Harbor株式会社',person:'鈴木 彩',email:'suzuki@green.example',industry:'環境・エネルギー',area:'神奈川',segment:'イベント',score:72,sourceUrl:'https://example.jp/event',personalNote:'先日の地域共創イベントでのお話が印象的でした',template:'B：事例起点',status:'active',nextAction:now,replyType:'',meetingDate:'',meetingResult:'',owner:'青木',memo:'',step:2,createdAt:past(10),lastSent:past(4),delivered:true,replyStep:null},
        {id:'demo-4',company:'株式会社ノーススター',person:'高橋 涼',email:'takahashi@north.example',industry:'人材',area:'東京',segment:'新規開拓',score:67,sourceUrl:'',personalNote:'若手育成プログラムについて伺いたいです',template:'A：課題起点',status:'replied',nextAction:'',replyType:'前向き',meetingDate:'',meetingResult:'日程候補を確認中',owner:'山田',memo:'資料送付済み',step:1,createdAt:past(12),lastSent:past(8),delivered:true,replyStep:1},
        {id:'demo-5',company:'湘南フーズ株式会社',person:'伊藤 真',email:'ito@foods.example',industry:'食品',area:'神奈川',segment:'過去接点',score:91,sourceUrl:'',personalNote:'新店舗のオープンおめでとうございます',template:'B：事例起点',status:'meeting',nextAction:'',replyType:'前向き',meetingDate:future(5),meetingResult:'初回ヒアリング予定',owner:'青木',memo:'決裁者同席予定',step:0,createdAt:past(18),lastSent:past(16),delivered:true,replyStep:0},
        {id:'demo-6',company:'Blue Peak Studio',person:'小林 奈々',email:'kobayashi@blue.example',industry:'デザイン',area:'東京',segment:'イベント',score:74,sourceUrl:'',personalNote:'展示ブースで伺ったブランドのお話について',template:'C：紹介起点',status:'won',nextAction:'',replyType:'前向き',meetingDate:past(7),meetingResult:'ライトプランで成約',owner:'山田',memo:'オンボーディングへ引継ぎ',step:1,createdAt:past(34),lastSent:past(29),delivered:true,replyStep:1},
        {id:'demo-7',company:'株式会社みなと企画',person:'渡辺 潤',email:'watanabe@minato.example',industry:'イベント',area:'神奈川',segment:'新規開拓',score:45,sourceUrl:'',personalNote:'',template:'A：課題起点',status:'pending',nextAction:addDaysAvoidWeekend(now, 90),replyType:'時期尚早',meetingDate:'',meetingResult:'',owner:'青木',memo:'次期予算策定時に再連絡',step:1,createdAt:past(14),lastSent:past(11),delivered:true,replyStep:1},
        {id:'demo-8',company:'East Field合同会社',person:'山本 誠',email:'yamamoto@east.example',industry:'不動産',area:'千葉',segment:'新規開拓',score:38,sourceUrl:'',personalNote:'',template:'A：課題起点',status:'bounced',nextAction:'',replyType:'',meetingDate:'',meetingResult:'',owner:'山田',memo:'メールアドレス要確認',step:0,createdAt:past(6),lastSent:past(6),delivered:false,replyStep:null},
        {id:'demo-9',company:'Circlo株式会社',person:'井上 歩',email:'inoue@circlo.example',industry:'小売',area:'神奈川',segment:'紹介',score:63,sourceUrl:'',personalNote:'共通の知人からご活躍を伺いました',template:'C：紹介起点',status:'active',nextAction:future(2),replyType:'',meetingDate:'',meetingResult:'',owner:'青木',memo:'',step:1,createdAt:past(2),lastSent:past(1),delivered:true,replyStep:null},
        {id:'demo-10',company:'株式会社Orca',person:'松本 葵',email:'matsumoto@orca.example',industry:'教育',area:'神奈川',segment:'イベント',score:59,sourceUrl:'',personalNote:'',template:'B：事例起点',status:'unsubscribed',nextAction:'',replyType:'お断り',meetingDate:'',meetingResult:'',owner:'山田',memo:'配信停止希望',step:0,createdAt:past(22),lastSent:past(22),delivered:true,replyStep:0}
      ],
      activities: [
        {id:'a1',text:'湘南フーズ株式会社を商談化しました',at:new Date(Date.now()-38*60*1000).toISOString(),type:'meeting'},
        {id:'a2',text:'株式会社ノーススターから返信がありました',at:new Date(Date.now()-2.5*60*60*1000).toISOString(),type:'reply'},
        {id:'a3',text:'Blue Peak Studioを成約に更新しました',at:new Date(Date.now()-24*60*60*1000).toISOString(),type:'won'}
      ],
      todayCompleted: { date: now, count: 0 }
    };
  }

  function loadState() {
    try {
      const saved = JSON.parse(storage.getItem(STORAGE_KEY));
      if (saved && Array.isArray(saved.contacts)) return saved;
    } catch (error) { console.warn('Relayの保存データを読み込めませんでした。', error); }
    const seeded = seedData();
    storage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  let state = loadState();
  if (!state.todayCompleted || state.todayCompleted.date !== today()) state.todayCompleted = {date: today(), count: 0};
  let activeView = 'home';

  function saveState() {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  function addActivity(text, type = 'update') {
    state.activities = state.activities || [];
    state.activities.unshift({id:uid(), text, type, at:new Date().toISOString()});
    state.activities = state.activities.slice(0, 30);
  }
  function showToast(message) {
    const toast = $('#toast'); toast.textContent = message; toast.classList.add('show');
    clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600);
  }
  function dueContacts() {
    return state.contacts.filter(c => ['active','pending'].includes(c.status) && c.nextAction && c.nextAction <= today()).sort((a,b) => b.score - a.score);
  }
  function sentContacts() { return state.contacts.filter(c => c.lastSent); }
  function repliedContacts() { return state.contacts.filter(c => c.replyType || ['replied','meeting','won'].includes(c.status)); }
  function meetingContacts() { return state.contacts.filter(c => ['meeting','won'].includes(c.status) || c.meetingDate); }
  function statusBadge(status) { return `<span class="status-badge status-${escapeHtml(status)}">${escapeHtml(STATUS[status] || status)}</span>`; }
  function metricCard(label, value, note, icon = '↗') {
    return `<article class="metric-card"><div class="metric-head"><span>${escapeHtml(label)}</span><i class="metric-icon">${icon}</i></div><strong>${escapeHtml(value)}</strong><small>${note}</small></article>`;
  }

  function renderHome() {
    const due = dueContacts();
    const sent = sentContacts();
    const replies = repliedContacts();
    const meetings = meetingContacts();
    const month = today().slice(0, 7);
    const monthlyMeetings = state.contacts.filter(c => c.meetingDate?.startsWith(month)).length;
    $('#dueCount').textContent = due.length;
    $('#duePill').textContent = `${due.length}件`;
    const done = state.todayCompleted.count || 0;
    const progress = percent(done, done + due.length);
    $('#progressPercent').textContent = `${progress}%`;
    $('#progressRing').style.strokeDashoffset = 264 - 264 * progress / 100;
    $('#homeMetrics').innerHTML = [
      metricCard('返信率', `${percent(replies.length, sent.length)}%`, `${replies.length} / ${sent.length}件`, '↩'),
      metricCard('商談化率', `${percent(meetings.length, sent.length)}%`, `${meetings.length}件が商談へ`, '◇'),
      metricCard('今月の商談数', `${monthlyMeetings}件`, '商談日ベース', '▣'),
      metricCard('アクティブ', `${state.contacts.filter(c => c.status === 'active').length}件`, 'フォロー進行中', '◎')
    ].join('');
    $('#dueList').innerHTML = due.length ? due.map(contact => `
      <article class="due-item">
        <div class="due-contact"><span class="company-avatar">${escapeHtml(initials(contact.company))}</span><span><b>${escapeHtml(contact.company)}</b><small>${escapeHtml(contact.person)} ・ ${escapeHtml(contact.email)}</small></span></div>
        <span class="step-badge step-d${[0,3,7][contact.step]}">${escapeHtml(STEP[contact.step] || '完了')}</span>
        <span class="owner-cell"><i class="owner-dot">${escapeHtml(initials(contact.owner))}</i>${escapeHtml(contact.owner)}</span>
        <span class="personal-line"><span>個別メモ</span>${escapeHtml(contact.personalNote || '個別の一言は未登録')}</span>
        <div class="row-actions">
          <button class="btn btn-primary btn-small" data-action="sent" data-id="${contact.id}">送信を記録</button>
          ${moreMenu(contact.id)}
        </div>
      </article>`).join('') : '<div class="empty-state"><strong>今日のフォローは完了です</strong>次のアクション日になると、ここに自動で表示されます。</div>';
    renderActivities();
    renderStatusOverview();
  }

  function moreMenu(id) {
    return `<div class="more-menu-wrap"><button class="more-btn" data-menu="${id}" aria-label="対応メニュー">•••</button><div class="more-menu" data-menu-panel="${id}">
      <button data-action="reply" data-id="${id}">↩ 返信を記録</button><button data-action="meeting" data-id="${id}">◇ 商談化を記録</button><button data-action="pending" data-id="${id}">◷ 90日保留</button><button data-action="unsubscribed" data-id="${id}">⊘ 配信停止</button><button data-action="bounced" data-id="${id}">! バウンス</button>
    </div></div>`;
  }
  function renderActivities() {
    const icons = {sent:'→',reply:'↩',meeting:'◇',won:'✓',update:'•'};
    $('#activityList').innerHTML = (state.activities || []).slice(0, 5).map(item => {
      const elapsed = Math.max(1, Math.round((Date.now() - new Date(item.at)) / 60000));
      const time = elapsed < 60 ? `${elapsed}分前` : elapsed < 1440 ? `${Math.round(elapsed / 60)}時間前` : `${Math.round(elapsed / 1440)}日前`;
      return `<div class="activity-item"><span class="activity-icon">${icons[item.type] || '•'}</span><span><p>${escapeHtml(item.text)}</p><time>${time}</time></span></div>`;
    }).join('') || '<div class="empty-state">更新履歴はまだありません。</div>';
  }
  function renderStatusOverview() {
    const groups = ['active','pending','replied','meeting','won'];
    const max = Math.max(1, ...groups.map(s => state.contacts.filter(c => c.status === s).length));
    $('#statusOverview').innerHTML = `<div class="status-overview">${groups.map(status => {
      const count = state.contacts.filter(c => c.status === status).length;
      return `<div class="status-row"><span>${STATUS[status]}</span><span class="status-track"><i style="width:${percent(count,max)}%"></i></span><b>${count}</b></div>`;
    }).join('')}</div>`;
  }

  function renderContacts() {
    const query = $('#searchInput').value.trim().toLowerCase();
    const filter = $('#statusFilter').value;
    const filtered = state.contacts.filter(c => {
      const haystack = [c.company,c.person,c.email,c.industry,c.area,c.segment].join(' ').toLowerCase();
      return (!query || haystack.includes(query)) && (filter === 'all' || c.status === filter);
    }).sort((a,b) => (a.nextAction || '9999').localeCompare(b.nextAction || '9999'));
    $('#contactsBody').innerHTML = filtered.map(c => `<tr>
      <td><div class="contact-primary"><span class="company-avatar">${escapeHtml(initials(c.company))}</span><span><b>${escapeHtml(c.company)}</b><small>${escapeHtml(c.person)} ・ ${escapeHtml(c.email)}</small></span></div></td>
      <td>${escapeHtml(c.segment)}</td><td><span class="score"><b>${Number(c.score) || 0}</b><i class="score-track"><i style="width:${Math.min(100,Number(c.score)||0)}%"></i></i></span></td>
      <td>${statusBadge(c.status)}</td><td>${c.nextAction ? dateLabel(c.nextAction) : '—'}${c.status==='active' ? `<br><small>${escapeHtml(STEP[c.step] || '')}</small>` : ''}</td>
      <td><span class="owner-cell"><i class="owner-dot">${escapeHtml(initials(c.owner))}</i>${escapeHtml(c.owner)}</span></td>
      <td><button class="more-btn" data-edit="${c.id}" aria-label="編集">•••</button></td>
    </tr>`).join('');
    $('#contactsEmpty').classList.toggle('hidden', filtered.length > 0);
    $('#contactsEmpty').innerHTML = '<strong>該当するコンタクトがありません</strong>検索条件を変えてお試しください。';
    $('#contactCount').textContent = `${filtered.length} / ${state.contacts.length}件`;
  }

  function renderReports() {
    const sent = sentContacts(), replies = repliedContacts(), meetings = meetingContacts();
    const delivered = sent.filter(c => c.delivered !== false);
    const positive = replies.filter(c => c.replyType === '前向き');
    const won = state.contacts.filter(c => c.status === 'won');
    const unsub = state.contacts.filter(c => c.status === 'unsubscribed');
    $('#reportMetrics').innerHTML = [
      metricCard('送達率',`${percent(delivered.length,sent.length)}%`,`${delivered.length} / ${sent.length}件`,'✓'),
      metricCard('返信率',`${percent(replies.length,delivered.length)}%`,`${replies.length}件`,'↩'),
      metricCard('前向き返信率',`${percent(positive.length,delivered.length)}%`,`${positive.length}件`,'＋'),
      metricCard('商談化率',`${percent(meetings.length,delivered.length)}%`,`${meetings.length}件`,'◇'),
      metricCard('成約率',`${percent(won.length,delivered.length)}%`,`${won.length}件`,'★'),
      metricCard('配信停止率',`${percent(unsub.length,delivered.length)}%`,`${unsub.length}件`,'⊘')
    ].join('');
    const stepCounts = [0,1,2].map(step => replies.filter(c => Number(c.replyStep) === step).length);
    const maxStep = Math.max(1,...stepCounts);
    $('#stepChart').innerHTML = stepCounts.map((count,index) => `<div class="bar-column"><b>${count}件</b><i class="bar" style="height:${Math.max(4,percent(count,maxStep))}%"></i><span>${['D0 初回','D3 リマインド1','D7 最終'][index]}</span></div>`).join('');
    const funnel = [
      ['送達',delivered.length],['返信',replies.length],['前向き',positive.length],['商談',meetings.length],['成約',won.length]
    ];
    const funnelBase = Math.max(1,delivered.length);
    $('#funnelChart').innerHTML = funnel.map(([label,count]) => `<div class="funnel-row"><span>${label}</span><i class="funnel-bar" style="width:${Math.max(12,percent(count,funnelBase))}%">${percent(count,funnelBase)}%</i><b>${count}</b></div>`).join('');
    const segments = [...new Set(state.contacts.map(c => c.segment || '未設定'))];
    $('#segmentBody').innerHTML = segments.map(segment => {
      const all = state.contacts.filter(c => (c.segment || '未設定') === segment);
      const segmentReplies = all.filter(c => c.replyType || ['replied','meeting','won'].includes(c.status));
      const segmentMeetings = all.filter(c => ['meeting','won'].includes(c.status) || c.meetingDate);
      return `<tr><td><b>${escapeHtml(segment)}</b></td><td>${all.length}</td><td>${segmentReplies.length}</td><td>${percent(segmentReplies.length,all.length)}%</td><td>${segmentMeetings.length}</td><td>${percent(segmentMeetings.length,all.length)}%</td></tr>`;
    }).join('');
  }

  function renderAll() { renderHome(); renderContacts(); renderReports(); }
  function switchView(view) {
    activeView = view;
    $$('.view').forEach(el => el.classList.toggle('active', el.id === `view-${view}`));
    $$('.nav-item[data-view]').forEach(el => el.classList.toggle('active', el.dataset.view === view));
    const titles = {home:'おはようございます',contacts:'コンタクト管理',reports:'レポート'};
    $('#pageTitle').textContent = titles[view];
    if (view === 'contacts') renderContacts();
    if (view === 'reports') renderReports();
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function openContact(contact = null) {
    const form = $('#contactForm'); form.reset();
    $('#dialogTitle').textContent = contact ? 'コンタクトを編集' : 'コンタクトを追加';
    if (contact) Object.entries(contact).forEach(([key,value]) => { if (form.elements[key]) form.elements[key].value = value ?? ''; });
    else { form.elements.id.value = ''; form.elements.nextAction.value = today(); form.elements.status.value = 'active'; form.elements.score.value = 50; }
    $('#contactDialog').showModal();
  }
  function submitContact(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const existing = state.contacts.find(c => c.id === data.id);
    const contact = {
      ...(existing || {}), ...data, id:data.id || uid(), score:Number(data.score)||0,
      step:existing?.step ?? 0, createdAt:existing?.createdAt || today(), lastSent:existing?.lastSent || '',
      delivered:existing?.delivered ?? true, replyStep:existing?.replyStep ?? null
    };
    if (STOP_STATUSES.includes(contact.status)) contact.nextAction = '';
    if (contact.status === 'pending' && (!contact.nextAction || contact.nextAction <= today())) contact.nextAction = addDaysAvoidWeekend(today(),90);
    if (existing) state.contacts[state.contacts.indexOf(existing)] = contact; else state.contacts.unshift(contact);
    addActivity(`${contact.company}を${existing ? '更新' : '追加'}しました`);
    saveState(); $('#contactDialog').close(); renderAll(); showToast(existing ? 'コンタクトを更新しました' : 'コンタクトを追加しました');
  }

  function openAction(id, action) {
    const contact = state.contacts.find(c => c.id === id); if (!contact) return;
    const titles = {sent:'送信を記録',reply:'返信を記録',meeting:'商談化を記録',pending:'90日保留にする',unsubscribed:'配信停止を記録',bounced:'バウンスを記録'};
    const help = {
      sent:`${STEP[contact.step]}の送信記録を残します。実際のメール送信は行いません。`,
      reply:'返信区分を選ぶと、自動フォローを停止します。',meeting:'商談日を記録し、自動フォローを停止します。',
      pending:'次回アクションを90日後（土日を避けた日）に設定します。',unsubscribed:'配信停止として記録し、今後のフォローを停止します。',bounced:'未送達として記録し、今後のフォローを停止します。'
    };
    $('#actionTitle').textContent = `${titles[action]}｜${contact.company}`;
    let extra = '';
    if (action === 'reply') extra = '<label class="stack-label"><span>返信区分</span><select name="quickReplyType"><option>前向き</option><option>情報収集</option><option>時期尚早</option><option>お断り</option></select></label>';
    if (action === 'meeting') extra = `<label class="stack-label"><span>商談日</span><input name="quickMeetingDate" type="date" value="${addBusinessDays(today(),1)}"></label>`;
    $('#actionHelp').innerHTML = `<p>${escapeHtml(help[action])}</p>${extra}`;
    const form = $('#actionForm'); form.elements.contactId.value = id; form.elements.actionType.value = action; form.elements.actionMemo.value = '';
    $('#actionDialog').showModal();
  }
  function submitAction(event) {
    event.preventDefault(); const form = event.currentTarget;
    const contact = state.contacts.find(c => c.id === form.elements.contactId.value); if (!contact) return;
    const action = form.elements.actionType.value, memo = form.elements.actionMemo.value.trim();
    if (action === 'sent') {
      const sentStep = contact.step;
      contact.lastSent = today(); contact.delivered = true;
      contact.status = 'active';
      if (contact.step === 0) { contact.step = 1; contact.nextAction = addBusinessDays(today(),3); }
      else if (contact.step === 1) { contact.step = 2; contact.nextAction = addBusinessDays(today(),4); }
      else { contact.status = 'completed'; contact.nextAction = ''; }
      state.todayCompleted.count = (state.todayCompleted.count || 0) + 1;
      addActivity(`${contact.company}の${STEP[sentStep] || 'フォロー'}送信を記録しました`,'sent');
    } else if (action === 'reply') {
      contact.status = 'replied'; contact.replyType = $('[name="quickReplyType"]',form)?.value || '前向き'; contact.replyStep = contact.step; contact.nextAction = '';
      addActivity(`${contact.company}からの返信を記録しました`,'reply');
    } else if (action === 'meeting') {
      contact.status = 'meeting'; contact.replyType = contact.replyType || '前向き'; contact.replyStep = contact.replyStep ?? contact.step; contact.meetingDate = $('[name="quickMeetingDate"]',form)?.value || today(); contact.nextAction = '';
      addActivity(`${contact.company}を商談化しました`,'meeting');
    } else if (action === 'pending') {
      contact.status = 'pending'; contact.nextAction = addDaysAvoidWeekend(today(),90); addActivity(`${contact.company}を90日保留にしました`);
    } else if (action === 'unsubscribed') {
      contact.status = 'unsubscribed'; contact.nextAction = ''; addActivity(`${contact.company}を配信停止にしました`);
    } else if (action === 'bounced') {
      contact.status = 'bounced'; contact.delivered = false; contact.nextAction = ''; addActivity(`${contact.company}のバウンスを記録しました`);
    }
    if (memo) contact.memo = [contact.memo,memo].filter(Boolean).join('\n');
    saveState(); $('#actionDialog').close(); renderAll(); showToast('対応結果を記録しました');
  }

  const CSV_FIELDS = [
    ['company','会社名'],['person','担当者'],['email','メール'],['industry','業種'],['area','エリア'],['segment','セグメント'],['score','スコア'],['sourceUrl','公表元URL'],['personalNote','個別の一言'],['template','文面バージョン'],['status','状態'],['nextAction','次回アクション日'],['replyType','返信区分'],['meetingDate','商談日'],['meetingResult','結果'],['owner','担当'],['memo','メモ'],['step','ステップ'],['lastSent','最終送信日']
  ];
  const csvCell = value => `"${String(value ?? '').replace(/"/g,'""')}"`;
  let preparedCsv = '';
  function exportCsv() {
    const rows = [CSV_FIELDS.map(([,label]) => csvCell(label)).join(','), ...state.contacts.map(c => CSV_FIELDS.map(([key]) => csvCell(key === 'status' ? STATUS[c[key]] || c[key] : c[key])).join(','))];
    preparedCsv = rows.join('\r\n');
    $('#exportFilename').textContent = `relay-contacts-${today()}.csv（${state.contacts.length}件）`;
    $('#csvPreview').value = preparedCsv;
    $('#exportDialog').showModal();
  }
  function downloadCsv() {
    const blob = new Blob(['\ufeff' + preparedCsv], {type:'text/csv;charset=utf-8'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob); link.download = `relay-contacts-${today()}.csv`;
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    showToast('CSVのダウンロードを開始しました');
  }
  async function copyCsv() {
    const preview = $('#csvPreview');
    let copied = false;
    try { await navigator.clipboard.writeText(preparedCsv); copied = true; } catch (error) {
      preview.focus(); preview.select(); copied = document.execCommand('copy');
    }
    showToast(copied ? 'CSVをコピーしました' : 'コピーできませんでした。CSV欄を選択してコピーしてください');
  }
  function parseCsv(text) {
    const rows=[]; let row=[],cell='',quoted=false;
    for(let i=0;i<text.length;i++){const ch=text[i],next=text[i+1];if(ch==='"'&&quoted&&next==='"'){cell+='"';i++;}else if(ch==='"'){quoted=!quoted;}else if(ch===','&&!quoted){row.push(cell);cell='';}else if((ch==='\n'||ch==='\r')&&!quoted){if(ch==='\r'&&next==='\n')i++;row.push(cell);if(row.some(v=>v.trim()))rows.push(row);row=[];cell='';}else cell+=ch;}
    row.push(cell);if(row.some(v=>v.trim()))rows.push(row);return rows;
  }
  function importCsv(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const rows = parseCsv(String(reader.result).replace(/^\ufeff/,'')); if (rows.length < 2) throw new Error('データ行がありません');
        const headers = rows[0].map(h=>h.trim());
        const keyMap = headers.map(header => CSV_FIELDS.find(([key,label]) => header === key || header === label)?.[0] || header);
        let count=0;
        rows.slice(1).forEach(row => {
          const raw={}; keyMap.forEach((key,index)=>raw[key]=(row[index]||'').trim());
          if (!raw.company || !raw.email) return;
          const statusKey = Object.entries(STATUS).find(([,label])=>label===raw.status)?.[0] || raw.status;
          state.contacts.push({id:uid(),company:raw.company,person:raw.person||'',email:raw.email,industry:raw.industry||'',area:raw.area||'',segment:raw.segment||'その他',score:Number(raw.score)||50,sourceUrl:raw.sourceUrl||'',personalNote:raw.personalNote||'',template:raw.template||'A：課題起点',status:STATUS[statusKey]?statusKey:'active',nextAction:raw.nextAction||today(),replyType:raw.replyType||'',meetingDate:raw.meetingDate||'',meetingResult:raw.meetingResult||'',owner:raw.owner||'青木',memo:raw.memo||'',step:Math.min(2,Math.max(0,Number(raw.step)||0)),createdAt:today(),lastSent:raw.lastSent||'',delivered:true,replyStep:null}); count++;
        });
        if (!count) throw new Error('会社名とメールを含む有効な行がありません');
        addActivity(`CSVから${count}件を取り込みました`); saveState(); renderAll(); showToast(`${count}件を取り込みました`);
      } catch(error) { showToast(`CSVを取り込めませんでした：${error.message}`); }
      $('#csvInput').value='';
    };
    reader.readAsText(file,'UTF-8');
  }

  document.addEventListener('click', event => {
    const nav = event.target.closest('[data-view]'); if (nav) switchView(nav.dataset.view);
    const edit = event.target.closest('[data-edit]'); if (edit) openContact(state.contacts.find(c => c.id === edit.dataset.edit));
    const action = event.target.closest('[data-action]'); if (action) openAction(action.dataset.id,action.dataset.action);
    const menu = event.target.closest('[data-menu]');
    if (menu) { event.stopPropagation(); const panel=$(`[data-menu-panel="${menu.dataset.menu}"]`); $$('.more-menu').forEach(el=>{if(el!==panel)el.classList.remove('open')}); panel.classList.toggle('open'); }
    else if (!event.target.closest('.more-menu')) $$('.more-menu').forEach(el=>el.classList.remove('open'));
  });
  $('#openAddBtn').addEventListener('click',()=>openContact());
  $$('.close-dialog').forEach(button=>button.addEventListener('click',()=>$('#contactDialog').close()));
  $$('.close-action').forEach(button=>button.addEventListener('click',()=>$('#actionDialog').close()));
  $$('.close-export').forEach(button=>button.addEventListener('click',()=>$('#exportDialog').close()));
  $('#downloadCsvBtn').addEventListener('click',downloadCsv); $('#copyCsvBtn').addEventListener('click',copyCsv);
  $('#contactForm').addEventListener('submit',submitContact); $('#actionForm').addEventListener('submit',submitAction);
  $('#searchInput').addEventListener('input',renderContacts); $('#statusFilter').addEventListener('change',renderContacts);
  $('#exportBtn').addEventListener('click',exportCsv); $('#csvInput').addEventListener('change',event=>{if(event.target.files[0])importCsv(event.target.files[0]);});
  $('#todayLabel').textContent = longDate(new Date());
  renderAll();
})();
