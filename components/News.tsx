import Link from "next/link";
import { news } from "@/data/news";
import Reveal from "./Reveal";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function News() {
  const latest = news.slice(0, 3);

  return (
    <section className="bg-bg-soft py-24 md:py-32">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal>
            <p className="eyebrow mb-4">News</p>
            <h2 className="text-3xl font-bold leading-snug text-primary md:text-4xl">お知らせ</h2>
          </Reveal>
          <Link href="/news" className="text-sm font-semibold text-blue hover:underline">
            すべて見る →
          </Link>
        </div>

        {latest.length === 0 ? (
          <Reveal delay={0.1}>
            <div className="mt-16 rounded-2xl border border-dashed border-primary/20 bg-white px-8 py-20 text-center">
              <p className="text-base text-primary/60">お知らせは準備中です。</p>
            </div>
          </Reveal>
        ) : (
          <ul className="mt-12 divide-y divide-primary/10 border-t border-primary/10">
            {latest.map((item, i) => (
              <Reveal key={item.id} delay={0.05 * i}>
                <li className="flex flex-col gap-2 py-6 sm:flex-row sm:items-center sm:gap-8">
                  <span className="text-sm text-primary/50">{formatDate(item.date)}</span>
                  <span className="inline-flex w-fit rounded-full bg-bg-mist px-3 py-1 text-xs font-semibold text-primary/60">
                    {item.category}
                  </span>
                  <span className="text-base font-medium text-primary">{item.title}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
