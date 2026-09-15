import Link from "next/link";
import { events, type EventItem } from "@/data/events";
import Reveal from "./Reveal";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function EventCard({ event, delay = 0 }: { event: EventItem; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-primary/10 bg-white">
        <div className="aspect-[4/3] bg-bg-mist" />
        <div className="flex flex-1 flex-col p-6">
          <span className="text-xs font-semibold uppercase tracking-wides text-blue">{event.category}</span>
          <h3 className="mt-2 text-lg font-bold text-primary">{event.title}</h3>
          <p className="mt-3 text-sm text-primary/60">
            {formatDate(event.date)} ／ {event.location}
          </p>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-primary/70">{event.summary}</p>
          <Link
            href={`/events/${event.id}`}
            className="mt-4 inline-flex items-center text-sm font-semibold text-blue hover:underline"
          >
            詳細を見る →
          </Link>
        </div>
      </article>
    </Reveal>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="mt-16 rounded-2xl border border-dashed border-primary/20 bg-white px-8 py-20 text-center">
      <p className="text-base text-primary/60">{message}</p>
    </div>
  );
}

type EventsProps = {
  variant?: "summary" | "full";
};

export default function Events({ variant = "full" }: EventsProps) {
  if (variant === "summary") {
    const latest = [...events]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);

    return (
      <section className="bg-bg-soft py-24 md:py-32">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Reveal>
              <p className="eyebrow mb-4">Events</p>
              <h2 className="text-3xl font-bold leading-snug text-primary md:text-4xl">
                人と企業が出会う場所をつくる。
              </h2>
            </Reveal>
            <Link href="/events" className="text-sm font-semibold text-blue hover:underline">
              イベント一覧を見る →
            </Link>
          </div>

          {latest.length === 0 ? (
            <EmptyState message="イベント情報は順次公開予定です。" />
          ) : (
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((event, i) => (
                <EventCard key={event.id} event={event} delay={0.05 * i} />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  const now = Date.now();
  const upcoming = events
    .filter((e) => new Date(e.date).getTime() >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = events
    .filter((e) => new Date(e.date).getTime() < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <section className="bg-bg-soft py-20 md:py-28">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow mb-4">Upcoming</p>
          <h2 className="text-2xl font-bold leading-snug text-primary md:text-3xl">開催予定イベント</h2>
        </Reveal>

        {upcoming.length === 0 ? (
          <EmptyState message="現在公開中のイベントはありません。イベント情報は順次公開予定です。" />
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event, i) => (
              <EventCard key={event.id} event={event} delay={0.05 * i} />
            ))}
          </div>
        )}

        {past.length > 0 && (
          <div className="mt-24 border-t border-primary/10 pt-16">
            <Reveal>
              <p className="eyebrow mb-4">Past Events</p>
              <h2 className="text-2xl font-bold leading-snug text-primary md:text-3xl">過去イベント</h2>
            </Reveal>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((event, i) => (
                <EventCard key={event.id} event={event} delay={0.05 * i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
