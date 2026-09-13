export type NewsCategory = "COMPANY" | "EVENT" | "COMMUNITY" | "SERVICE" | "SIB";

export type NewsItem = {
  id: string;
  date: string; // YYYY-MM-DD
  category: NewsCategory;
  title: string;
  body?: string;
  url?: string;
};

// 実際に確定した情報のみを掲載してください。架空のニュースは追加しないこと。
export const news: NewsItem[] = [];
