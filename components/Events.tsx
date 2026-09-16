import Link from "next/link";
import { events, type EventItem } from "@/data/events";
import { FadeUp } from "./motion";
import PhotoPlaceholder from "./PhotoPlaceholder";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function EventCard({
  event,
  delay = 0,
  featured = false,
}: {
  event: EventItem;
  delay?: number;
  featured?: boolean;
}) {
  return (
    <FadeUp delay={delay} className={featured ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""}>
      <Link href={`/events/${event.id}`} className="group block h-full">
        <div className="overflow-hidden">
          <PhotoPlaceholder
            label="EVENT PHOTO"
            className={`w-full transition-transform duration-500 ease-out group-hover:scale-[1.03] ${
              featured ? "aspect-[16/10]" : "aspect-[4/3]"
            }`}
          />
        </div>
        <div className="mt-5">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wides text-primary/45">
            <span>{formatDate(event.date)}</span>
            <span className="text-primary/20">/</span>
            <span>{event.category}</span>
          </div>
          <h3
            className={`mt-2 font-bold text-primary transition-colors group-hover:text-blue ${
              featured ? "text-2xl md:text-3xl" : "text-lg"
            }`}
          >
            {event.title}
          </h3>
          <p className="mt-1 text-sm text-primary/60">{event.location}</p>
        </div>
      </Link>
    </FadeUp>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="mt-16 border border-line px-8 py-20 text-center">
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
      <section className="bg-white py-28 md:py-40">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <FadeUp>
              <p className="eyebrow mb-4">Events</p>
              <h2 className="text-3xl font-bold leading-snug text-primary md:text-5xl">
                人と企業が出会う場所をつくる。
              </h2>
            </FadeUp>
            <Link href="/events" className="arrow-link">
              イベント一覧を見る
              <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>

          {latest.length === 0 ? (
            <EmptyState message="イベント情報は順次公開予定です。" />
          ) : (
            <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((event, i) => (
                <EventCard key={event.id} event={event} delay={0.05 * i} featured={i === 0} />
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
    <section className="bg-white py-20 md:py-28">
      <div className="container-page">
        <FadeUp>
          <p className="eyebrow mb-4">Upcoming</p>
          <h2 className="text-2xl font-bold leading-snug text-primary md:text-3xl">開催予定イベント</h2>
        </FadeUp>

        {upcoming.length === 0 ? (
          <EmptyState message="現在公開中のイベントはありません。イベント情報は順次公開予定です。" />
        ) : (
          <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event, i) => (
              <EventCard key={event.id} event={event} delay={0.05 * i} featured={i === 0} />
            ))}
          </div>
        )}

        {past.length > 0 && (
          <div className="mt-24 border-t border-line pt-16">
            <FadeUp>
              <p className="eyebrow mb-4">Past Events</p>
              <h2 className="text-2xl font-bold leading-snug text-primary md:text-3xl">過去イベント</h2>
            </FadeUp>
            <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
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
