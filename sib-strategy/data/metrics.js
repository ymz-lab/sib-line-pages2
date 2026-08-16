/* ============================================================
   SIB 指標データ
   ここだけ書き換えれば、資料内のグラフ・KPIがすべて更新されます。

   status の意味
     "actual"  実績（確認できた数値のみ）
     "target"  目標値（自分たちで決める数値）
     "pending" 未入力（グラフは「入力待ち」表示になります）

   ※ 実績が確認できていない項目に、推測値を入れないでください。
      入れる場合は必ず status を "target" にしてください。
   ============================================================ */

window.SIB_METRICS = {

  /* 現時点で確認できている実績 ------------------------------ */
  actuals: [
    { key: "students",  label: "累計参加学生",     value: 300, unit: "名",  prefix: "", suffix: "以上" },
    { key: "offline",   label: "オフラインイベント", value: 7,   unit: "回",  prefix: "", suffix: "" },
    { key: "online",    label: "オンラインイベント", value: 10,  unit: "回",  prefix: "", suffix: "以上" },
    { key: "companies", label: "協力企業",         value: 10,  unit: "社",  prefix: "", suffix: "以上" },
    { key: "members",   label: "運営メンバー",      value: 20,  unit: "名",  prefix: "", suffix: "以上" }
  ],

  /* 期の定義 ------------------------------------------------ */
  phases: [
    { id: "p1", label: "1期", theme: "証明する" },
    { id: "p2", label: "2期", theme: "型化する" },
    { id: "p3", label: "3期", theme: "拡大する" }
  ],

  /* 推移データ ---------------------------------------------- *
     values は [1期, 2期, 3期] の順。
     数値が決まっていない箇所は null のままにしてください。      */
  series: [
    {
      key: "revenue",
      label: "売上",
      unit: "円",
      status: "pending",
      note: "継続収益（企業コミュニティ会費）＋ 案件収益",
      values: [null, null, null]
    },
    {
      key: "companyMembers",
      label: "企業会員数",
      unit: "社",
      status: "pending",
      note: "月額の企業コミュニティ会員",
      values: [null, null, null]
    },
    {
      key: "community",
      label: "学生コミュニティ規模",
      unit: "名",
      status: "pending",
      note: "累計参加学生は300名以上（実績）。継続的に関わる人数は集計中",
      values: [null, null, null]
    },
    {
      key: "projectReady",
      label: "Project Ready 学生数",
      unit: "名",
      status: "pending",
      note: "企業プロジェクトにアサインできる状態の学生",
      values: [null, null, null]
    },
    {
      key: "projects",
      label: "企業プロジェクト件数",
      unit: "件",
      status: "pending",
      note: "有料で実行した案件数",
      values: [null, null, null]
    }
  ],

  /* KPI 一覧（実績と目標を並べて管理） ----------------------- */
  kpi: [
    { label: "累計参加学生",         actual: "300名以上", target: null },
    { label: "協力企業",             actual: "10社以上",  target: null },
    { label: "企業会員数（月額）",    actual: null,        target: null },
    { label: "有料案件数",           actual: null,        target: null },
    { label: "Project Ready 学生",   actual: null,        target: null },
    { label: "コミュニティ継続率",    actual: null,        target: null },
    { label: "紹介による新規企業",    actual: null,        target: null },
    { label: "売上",                 actual: null,        target: null }
  ],

  /* 価格（確定しているもの） -------------------------------- */
  pricing: {
    membershipMonthly: 20000,
    membershipQuarterly: 60000,
    membershipQuarterlyStatus: "仮説"
  }
};
