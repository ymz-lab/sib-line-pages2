import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ServiceOverview from "@/components/ServiceOverview";

export const metadata: Metadata = {
  title: "学生コミュニティ SIB",
  description:
    "学生が、AI・SNS・ビジネス・営業などを学び、企業や経営者との接点の中で実践経験を積むコミュニティです。",
};

export default function SibPage() {
  return (
    <>
      <PageHero eyebrow="Student Community" title="学生コミュニティ SIB" description="学ぶ。実践する。つながる。" />
      <ServiceOverview serviceId="sib" />
    </>
  );
}
