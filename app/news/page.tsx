import type { Metadata } from "next";
import { news } from "@/data/news";
import { NewsRow } from "@/components/News";
import { FadeUp } from "@/components/motion";

export const metadata: Metadata = {
  title: "News",
  description: "株式会社BaseAIからのお知らせ一覧です。",
};

export default function NewsPage() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-page max-w-3xl">
        <p className="eyebrow mb-4">News</p>
        <h1 className="text-3xl font-bold leading-snug text-primary md:text-5xl">お知らせ</h1>

        {news.length === 0 ? (
          <div className="mt-16 border border-line bg-bg-soft px-8 py-20 text-center">
            <p className="text-base text-primary/60">お知らせは準備中です。</p>
          </div>
        ) : (
          <div className="mt-14 border-t border-line">
            {news.map((item, i) => (
              <FadeUp key={item.id} delay={0.03 * i}>
                <NewsRow item={item} />
              </FadeUp>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
