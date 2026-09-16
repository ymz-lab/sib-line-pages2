import Link from "next/link";
import { news, type NewsItem } from "@/data/news";
import { FadeUp } from "./motion";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export function NewsRow({ item }: { item: NewsItem }) {
  const content = (
    <div className="group grid grid-cols-1 items-baseline gap-2 px-4 py-6 transition-all duration-300 hover:translate-x-1.5 hover:bg-white sm:grid-cols-[110px_130px_1fr_auto] sm:items-center sm:gap-6 sm:px-6">
      <span className="text-sm text-primary/45">{formatDate(item.date)}</span>
      <span className="text-xs font-semibold uppercase tracking-wides text-blue">{item.category}</span>
      <span className="text-base font-medium text-primary transition-colors group-hover:text-blue">
        {item.title}
      </span>
      {item.url && (
        <span className="hidden text-sm font-semibold text-primary transition-transform group-hover:translate-x-1.5 sm:inline-block">
          →
        </span>
      )}
    </div>
  );

  if (item.url) {
    return (
      <Link href={item.url} className="-mx-4 block border-b border-line sm:-mx-6">
        {content}
      </Link>
    );
  }

  return <div className="-mx-4 border-b border-line sm:-mx-6">{content}</div>;
}

export default function News() {
  const latest = news.slice(0, 3);

  return (
    <section className="bg-bg-soft py-28 md:py-40">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <FadeUp>
            <p className="eyebrow mb-4">News</p>
            <h2 className="text-3xl font-bold leading-snug text-primary md:text-5xl">お知らせ</h2>
          </FadeUp>
          <Link href="/news" className="arrow-link">
            すべて見る
            <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>

        {latest.length === 0 ? (
          <FadeUp delay={0.1}>
            <div className="mt-16 border border-line bg-white px-8 py-20 text-center">
              <p className="text-base text-primary/60">お知らせは準備中です。</p>
            </div>
          </FadeUp>
        ) : (
          <div className="mt-12 border-t border-line">
            {latest.map((item, i) => (
              <FadeUp key={item.id} delay={0.05 * i}>
                <NewsRow item={item} />
              </FadeUp>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
