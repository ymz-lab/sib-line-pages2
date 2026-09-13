import { events } from "@/data/events";
import Reveal from "./Reveal";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function Events() {
  return (
    <section id="events" className="scroll-mt-20 bg-bg-soft py-24 md:py-32">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow mb-4">Events</p>
          <h2 className="text-3xl font-bold leading-snug text-primary md:text-4xl">
            人と企業が出会う場所をつくる。
          </h2>
        </Reveal>

        {events.length === 0 ? (
          <Reveal delay={0.1}>
            <div className="mt-16 rounded-2xl border border-dashed border-primary/20 bg-white px-8 py-20 text-center">
              <p className="text-base text-primary/60">イベント情報は順次公開予定です。</p>
            </div>
          </Reveal>
        ) : (
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, i) => (
              <Reveal key={event.id} delay={0.05 * i}>
                <article className="flex h-full flex-col overflow-hidden rounded-xl border border-primary/10 bg-white">
                  <div className="aspect-[4/3] bg-bg-mist" />
                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-xs font-semibold uppercase tracking-wides text-blue">
                      {event.category}
                    </span>
                    <h3 className="mt-2 text-lg font-bold text-primary">{event.title}</h3>
                    <p className="mt-3 text-sm text-primary/60">
                      {formatDate(event.date)} ／ {event.location}
                    </p>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-primary/70">{event.summary}</p>
                    {event.detailUrl && (
                      <a
                        href={event.detailUrl}
                        className="mt-4 inline-flex items-center text-sm font-semibold text-blue hover:underline"
                      >
                        詳細を見る →
                      </a>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
