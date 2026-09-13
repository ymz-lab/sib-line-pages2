export type EventCategory =
  | "経営者交流会"
  | "学生イベント"
  | "勉強会"
  | "ビジネスイベント"
  | "地域イベント";

export type EventItem = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  location: string;
  category: EventCategory;
  summary: string;
  image?: string;
  detailUrl?: string;
};

// 実在するイベント情報が確定次第、ここに追加してください。
// 架空のイベントは掲載しないこと。
export const events: EventItem[] = [];
