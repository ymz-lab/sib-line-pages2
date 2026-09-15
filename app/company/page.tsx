import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import MissionVisionValue from "@/components/MissionVisionValue";
import Company from "@/components/Company";
import WhyBaseAI from "@/components/WhyBaseAI";
import Partners from "@/components/Partners";
import PlatformConcept from "@/components/PlatformConcept";
import ContactCTA from "@/components/ContactCTA";

export const metadata: Metadata = {
  title: "会社概要",
  description:
    "株式会社BaseAIの会社概要です。神奈川県藤沢市を拠点に、経営者コミュニティ、学生コミュニティSIB、企業向け実行支援を運営しています。",
};

export default function CompanyPage() {
  return (
    <>
      <PageHero eyebrow="Company" title="会社概要" description="株式会社BaseAIについて。" />

      <section className="bg-white pb-24 pt-6 md:pb-32">
        <div className="container-page grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
          <Reveal>
            <p className="eyebrow mb-4">About Company</p>
            <h2 className="text-2xl font-bold leading-snug text-primary md:text-4xl">BaseAIについて</h2>
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

      <MissionVisionValue variant="full" />

      <section className="bg-bg-soft py-24 md:py-32">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow mb-4">Team</p>
            <h2 className="text-2xl font-bold leading-snug text-primary md:text-4xl">代表・チーム</h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 border border-dashed border-primary/25 bg-white px-8 py-16 text-center">
              <p className="text-base text-primary/60">
                代表・チームの紹介は準備中です。確定次第、掲載いたします。
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <Company />

      <WhyBaseAI variant="full" />

      <section className="bg-white pb-6 pt-24 md:pt-32">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow mb-4">Partners</p>
            <h2 className="text-2xl font-bold leading-snug text-primary md:text-4xl">
              PARTNERS / COLLABORATION
            </h2>
          </Reveal>
        </div>
      </section>
      <Partners variant="full" />

      <PlatformConcept />

      <ContactCTA />
    </>
  );
}
