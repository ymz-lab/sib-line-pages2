import type { Metadata } from "next";
import { news } from "@/data/news";

export const metadata: Metadata = {
  title: "News",
  description: "株式会社BaseAIからのお知らせ一覧です。",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function NewsPage() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-page max-w-3xl">
        <p className="eyebrow mb-4">News</p>
        <h1 className="text-3xl font-bold leading-snug text-primary md:text-4xl">お知らせ</h1>

        {news.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-dashed border-primary/20 bg-bg-soft px-8 py-20 text-center">
            <p className="text-base text-primary/60">お知らせは準備中です。</p>
          </div>
        ) : (
          <ul className="mt-14 divide-y divide-primary/10 border-t border-primary/10">
            {news.map((item) => (
              <li key={item.id} className="flex flex-col gap-2 py-6 sm:flex-row sm:items-center sm:gap-8">
                <span className="text-sm text-primary/50">{formatDate(item.date)}</span>
                <span className="inline-flex w-fit rounded-full bg-bg-mist px-3 py-1 text-xs font-semibold text-primary/60">
                  {item.category}
                </span>
                <span className="text-base font-medium text-primary">{item.title}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
