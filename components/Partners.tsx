import { partners } from "@/data/partners";
import Reveal from "./Reveal";

const typeLabel: Record<string, string> = {
  partner: "提携先",
  collaboration: "連携・協力実績",
  support: "後援・協賛",
};

export default function Partners() {
  const grouped = partners.reduce<Record<string, typeof partners>>((acc, p) => {
    (acc[p.type] ||= []).push(p);
    return acc;
  }, {});

  return (
    <section id="partners" className="scroll-mt-20 bg-white py-24 md:py-32">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow mb-4">Partners</p>
          <h2 className="text-3xl font-bold leading-snug text-primary md:text-4xl">
            地域とともに、
            <br />
            新しい機会をつくる。
          </h2>
        </Reveal>

        {partners.length === 0 ? (
          <Reveal delay={0.1}>
            <div className="mt-16 rounded-2xl border border-dashed border-primary/20 bg-bg-soft px-8 py-20 text-center">
              <p className="text-base text-primary/60">提携先・連携実績は確定次第、掲載いたします。</p>
            </div>
          </Reveal>
        ) : (
          <div className="mt-16 space-y-14">
            {Object.entries(grouped).map(([type, list]) => (
              <div key={type}>
                <p className="text-sm font-semibold text-primary/50">{typeLabel[type] ?? type}</p>
                <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
                  {list.map((p) => (
                    <div
                      key={p.id}
                      className="flex h-24 items-center justify-center rounded-lg border border-primary/10 bg-bg-soft px-4"
                    >
                      <span className="text-center text-sm font-medium text-primary/70">{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
