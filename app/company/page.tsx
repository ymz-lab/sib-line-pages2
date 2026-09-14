import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Company from "@/components/Company";
import Reveal from "@/components/Reveal";
import ContactCTA from "@/components/ContactCTA";

export const metadata: Metadata = {
  title: "会社概要",
  description:
    "株式会社BaseAIの会社概要です。神奈川県藤沢市を拠点に、経営者コミュニティ、学生コミュニティSIB、企業向け実行支援を運営しています。",
};

const features = [
  "神奈川・藤沢を拠点に、地域の経営者・企業と近い距離で関わっています。",
  "技術ありきではなく、企業や地域が抱える課題の理解から着手します。",
  "納品や紹介で終わらせず、運用や改善まで継続的に伴走します。",
];

export default function CompanyPage() {
  return (
    <>
      <PageHero eyebrow="Company" title="会社概要" description="株式会社BaseAIについて。" />

      <Company />

      <section className="bg-bg-soft py-20 md:py-28">
        <div className="container-page grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
          <Reveal>
            <p className="eyebrow mb-4">About</p>
            <h2 className="text-2xl font-bold leading-snug text-primary md:text-3xl">
              BaseAIについて
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-6 text-base leading-loose text-primary/70">
              <p>
                BaseAIは、コミュニティを起点に企業の課題を理解し、必要な人・企業・情報との接点をつくり、
                必要に応じて実行まで支援する会社です。
              </p>
              <p>
                経営者コミュニティ、学生コミュニティSIB、企業向け実行支援という3つの事業を通じて、
                人と企業、そして地域をつなぐことを目指しています。
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow mb-4">Our Approach</p>
            <h2 className="text-2xl font-bold leading-snug text-primary md:text-3xl">会社の特徴</h2>
          </Reveal>

          <div className="mt-12 space-y-8">
            {features.map((f, i) => (
              <Reveal key={f} delay={0.05 * i}>
                <div className="flex gap-6 border-t border-primary/10 pt-6">
                  <span className="text-lg font-bold text-blue">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-base leading-relaxed text-primary/70">{f}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <p className="mt-10 text-sm leading-relaxed text-primary/50">
              BaseAIは立ち上げ期の会社であり、実績はこれからつくっていく段階です。
              私たちの考え方や大切にしている価値観については、企業理念ページで詳しくご紹介しています。
            </p>
            <Link
              href="/philosophy"
              className="mt-4 inline-flex items-center text-sm font-semibold text-blue hover:underline"
            >
              企業理念を見る →
            </Link>
          </Reveal>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
