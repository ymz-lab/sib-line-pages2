import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ServiceOverview from "@/components/ServiceOverview";
import Community from "@/components/Community";

export const metadata: Metadata = {
  title: "経営者コミュニティ",
  description:
    "経営者・企業がつながり、経営課題の相談、情報交換、企業紹介、協業などを行うコミュニティです。BaseAIが各企業の課題を把握し、必要な接点づくりを支援します。",
};

export default function ExecutiveCommunityPage() {
  return (
    <>
      <PageHero
        eyebrow="Executive Community"
        title="経営者コミュニティ"
        description="交流で終わる関係を、事業が動く関係へ。"
      />
      <ServiceOverview serviceId="executive-community" />
      <Community />
    </>
  );
}
