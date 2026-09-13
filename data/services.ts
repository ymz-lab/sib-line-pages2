export type Service = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  copy: string;
  description: string;
  points: string[];
};

export const services: Service[] = [
  {
    id: "executive-community",
    number: "01",
    title: "経営者コミュニティ",
    subtitle: "Executive Community",
    copy: "交流で終わる関係を、\n事業が動く関係へ。",
    description:
      "経営者・企業がつながり、経営課題の相談、情報交換、企業紹介、協業などを行うコミュニティです。BaseAIが各企業の課題を把握し、必要な企業・人・情報との接点づくりを支援します。",
    points: ["経営相談・情報交換", "企業紹介・協業マッチング", "少人数会・テーマ別会の運営"],
  },
  {
    id: "student-community",
    number: "02",
    title: "学生コミュニティ SIB",
    subtitle: "Student Community",
    copy: "学ぶ。実践する。つながる。",
    description:
      "学生が、AI・SNS・ビジネス・営業などを学び、企業や経営者との接点の中で実践経験を積むコミュニティです。学習だけで終わらせず、プロジェクトや企業との接点につなげていきます。",
    points: ["AI・SNS・ビジネスの学習機会", "企業との実践プロジェクト", "経営者との接点づくり"],
  },
  {
    id: "execution-support",
    number: "03",
    title: "企業向け実行支援",
    subtitle: "Execution Support",
    copy: "やりたいけど、\n手が回らないを前へ。",
    description:
      "LP・HP・SNS・LINE・資料制作・動画・リサーチ・業務改善・AI活用など、企業内で後回しになりやすい業務を支援します。企画だけではなく、制作・運用・改善まで対応します。",
    points: ["Web・SNS・LINE運用支援", "資料・動画制作", "業務改善・AI活用支援"],
  },
];
