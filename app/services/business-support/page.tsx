import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ServiceOverview from "@/components/ServiceOverview";

export const metadata: Metadata = {
  title: "企業向け実行支援",
  description:
    "LP・HP・SNS・LINE・資料制作・動画・リサーチ・業務改善・AI活用など、企業内で後回しになりやすい業務を支援します。",
};

export default function BusinessSupportPage() {
  return (
    <>
      <PageHero
        eyebrow="Execution Support"
        title="企業向け実行支援"
        description="やりたいけど、手が回らないを前へ。"
      />
      <ServiceOverview serviceId="business-support" />
    </>
  );
}
