import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Partners from "@/components/Partners";

export const metadata: Metadata = {
  title: "提携・連携",
  description: "株式会社BaseAIの提携先・連携実績です。正式な業務提携と、イベント等での連携・協力実績を分けて掲載しています。",
};

export default function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Partners"
        title="提携・連携"
        description="地域とともに、新しい機会をつくる。BaseAIの提携先・連携実績をご紹介します。"
      />
      <Partners variant="full" />
    </>
  );
}
