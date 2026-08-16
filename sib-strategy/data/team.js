/* ============================================================
   SIB 体制
   name / photo が空欄の箇所は、資料上「入力待ち」と表示されます。
   確認できていない実名・写真は入れないでください。
   photo は assets からの相対パス（例: "../assets/images/xxx.jpg"）。
   ============================================================ */

window.SIB_TEAM = {

  /* 責任領域（役職ではなく、何に責任を持つかで定義） */
  roles: [
    {
      position: "Business｜事業・営業",
      mission: "企業売上をつくる",
      responsibility: "企業開拓 / 価格 / サービス設計 / パートナー",
      proof: "企業は月額を払うか",
      name: "",
      photo: ""
    },
    {
      position: "Community｜企業コミュニティ",
      mission: "企業との関係を続ける",
      responsibility: "3ヶ月サイクル運営 / 企業体験設計 / 継続・紹介",
      proof: "企業は何を評価し、続けたいと思うか",
      name: "",
      photo: ""
    },
    {
      position: "Community｜学生コミュニティ",
      mission: "任せられる学生を増やす",
      responsibility: "募集 / 選抜 / 育成 / 部門運営",
      proof: "質の高い学生が集まるか",
      name: "",
      photo: ""
    },
    {
      position: "Service｜プロジェクト・サービス",
      mission: "案件を成果まで届ける",
      responsibility: "課題整理 / 学生アサイン / 進行 / 品質管理",
      proof: "コミュニティから案件が生まれるか",
      name: "",
      photo: ""
    },
    {
      position: "Growth｜SNS・広報・イベント",
      mission: "SIBを知られる状態にする",
      responsibility: "発信 / 事例化 / イベント設計 / 認知拡大",
      proof: "紹介以外の入口ができるか",
      name: "",
      photo: ""
    }
  ],

  /* 学生側の実行部門（student ページで公開している構成） */
  departments: [
    { name: "ビジネス部門",     summary: "企業との接点づくり・提案・企画の実装" },
    { name: "イベント運営部門", summary: "交流会・ピッチ・勉強会の企画と運営" },
    { name: "広報部門",         summary: "SNS運用・クリエイティブ・広報戦略" },
    { name: "SIB Media",        summary: "学生・企業・地域の挑戦を発信するメディア" }
  ]
};
