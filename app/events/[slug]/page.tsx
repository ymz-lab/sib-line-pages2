import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { events } from "@/data/events";

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.id }));
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export function generateMetadata({ params }: Props): Metadata {
  const event = events.find((e) => e.id === params.slug);
  if (!event) return {};
  return {
    title: event.title,
    description: event.summary,
  };
}

export default function EventDetailPage({ params }: Props) {
  const event = events.find((e) => e.id === params.slug);
  if (!event) notFound();

  return (
    <>
      <PageHero eyebrow={event.category} title={event.title} description={event.summary} />

      <section className="bg-white pb-20 pt-4 md:pb-28">
        <div className="container-page">
          <Reveal>
            <div className="aspect-[16/9] w-full max-w-3xl rounded-xl bg-bg-mist" />
            <dl className="mt-10 max-w-3xl space-y-4 border-t border-primary/10 pt-8">
              <div className="flex gap-6">
                <dt className="w-24 shrink-0 text-sm font-semibold text-primary/50">開催日</dt>
                <dd className="text-sm text-primary">{formatDate(event.date)}</dd>
              </div>
              <div className="flex gap-6">
                <dt className="w-24 shrink-0 text-sm font-semibold text-primary/50">開催場所</dt>
                <dd className="text-sm text-primary">{event.location}</dd>
              </div>
              <div className="flex gap-6">
                <dt className="w-24 shrink-0 text-sm font-semibold text-primary/50">カテゴリー</dt>
                <dd className="text-sm text-primary">{event.category}</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>
    </>
  );
}
