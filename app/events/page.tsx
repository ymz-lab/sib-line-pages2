import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Events from "@/components/Events";

export const metadata: Metadata = {
  title: "イベント",
  description: "株式会社BaseAIが主催・関わるイベント情報です。経営者交流会、学生イベント、勉強会などを掲載しています。",
};

export default function EventsPage() {
  return (
    <>
      <PageHero
        eyebrow="Events"
        title="イベント情報"
        description="人と企業が出会う場所をつくる。BaseAIが主催・関わるイベントをご紹介します。"
      />
      <Events variant="full" />
    </>
  );
}
