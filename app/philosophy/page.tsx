import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import MissionVisionValue from "@/components/MissionVisionValue";

export const metadata: Metadata = {
  title: "Mission・Vision・Value",
  description: "株式会社BaseAIの企業理念です。私たちが大切にしているMission・Vision・Valueをご紹介します。",
};

export default function PhilosophyPage() {
  return (
    <>
      <PageHero eyebrow="Philosophy" title="企業理念" description="BaseAIが大切にしている考え方。" />
      <MissionVisionValue variant="full" />
    </>
  );
}
