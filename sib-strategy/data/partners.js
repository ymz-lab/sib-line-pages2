/* ============================================================
   SIB 連携・実績
   kind は関係の性質を正確に区別するために使います。
     "co-host"      共催
     "guest"        ゲスト登壇
     "public"       行政・自治体との活動
     "venue"        会場・拠点
     "partner"      正式提携（契約があるものだけ）
   ※「イベントに参加した」と「正式提携」を混同しないこと。
     確認できない関係は追加しないでください。
   ============================================================ */

window.SIB_PARTNERS = {

  /* 確認できている連携 */
  confirmed: [
    { kind: "co-host", name: "HERO'ZZ",        detail: "共催イベント（2025年9月27日 / 浜松町PREX）" },
    { kind: "co-host", name: "湘南U-PORT",     detail: "湘南交流会 共催（2026年6月7日 予定 / 藤沢市辻堂神台）" },
    { kind: "guest",   name: "VAMBI 氏",        detail: "共催イベント ゲスト登壇" },
    { kind: "guest",   name: "水畑 裕貴 氏",    detail: "共催イベント ゲスト登壇（元 REALVALUE MAFIA）" },
    { kind: "guest",   name: "林 尚弘 氏",      detail: "経営者トークセッション 登壇" },
    { kind: "guest",   name: "株式会社Wiz 山崎 俊 氏", detail: "経営者トークセッション 登壇" },
    { kind: "public",  name: "大磯町",          detail: "町長との地域活性化に向けた会議・町長を囲む会" },
    { kind: "venue",   name: "会議室FOREST（新宿）", detail: "第一回ピッチコンテスト 会場" },
    { kind: "venue",   name: "浜松町PREX",      detail: "共催イベント 会場" }
  ],

  /* 正式提携（契約ベース）— 確認できたものだけ追加してください */
  formalPartners: [],

  /* スポンサー企業（第一回ピッチコンテストで10社。社名は未整理） */
  sponsorsNote: "第一回ピッチコンテストのスポンサー企業10社。社名の掲載可否を確認のうえ整理する。"
};
