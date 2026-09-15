import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Business from "@/components/Business";
import BusinessCycle from "@/components/BusinessCycle";
import ContactCTA from "@/components/ContactCTA";

export const metadata: Metadata = {
  title: "事業・サービス",
  description:
    "株式会社BaseAIの事業内容です。経営者コミュニティ、学生コミュニティSIB、企業向け実行支援の3つの事業を通じて、人・企業・地域の挑戦を支援します。",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="BaseAIの事業"
        description="経営者コミュニティ、学生コミュニティSIB、企業向け実行支援。3つの事業を通じて、人と企業、地域をつなぎます。"
      />

      <Business variant="full" />
      <BusinessCycle />
      <ContactCTA />
    </>
  );
}
