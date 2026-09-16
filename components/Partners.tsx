import Link from "next/link";
import { partners } from "@/data/partners";
import { FadeUp } from "./motion";

const typeLabel: Record<string, { en: string; ja: string }> = {
  partner: { en: "Partner", ja: "正式提携" },
  collaboration: { en: "Collaboration", ja: "連携・協力" },
  support: { en: "Support", ja: "後援・協賛" },
};

function PartnerLogo({ name }: { name: string }) {
  return (
    <div className="flex h-24 items-center justify-center border border-line bg-bg-soft px-4">
      <span className="text-center text-sm font-medium text-primary/70">{name}</span>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="mt-16 border border-dashed border-primary/25 bg-bg-soft px-8 py-20 text-center">
      <p className="text-base text-primary/60">{message}</p>
    </div>
  );
}

type PartnersProps = {
  variant?: "summary" | "full";
};

export default function Partners({ variant = "full" }: PartnersProps) {
  if (variant === "summary") {
    const sample = partners.slice(0, 8);

    return (
      <section className="bg-white py-28 md:py-40">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <FadeUp>
              <p className="eyebrow mb-4">Partners</p>
              <h2 className="text-3xl font-bold leading-snug text-primary md:text-5xl">
                地域とともに、
                <br />
                新しい機会をつくる。
              </h2>
            </FadeUp>
            <Link href="/company" className="arrow-link">
              提携・連携について
              <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>

          {sample.length === 0 ? (
            <EmptyState message="提携先・連携実績は確定次第、掲載いたします。" />
          ) : (
            <FadeUp delay={0.1}>
              <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
                {sample.map((p) => (
                  <PartnerLogo key={p.id} name={p.name} />
                ))}
              </div>
            </FadeUp>
          )}
        </div>
      </section>
    );
  }

  const grouped = partners.reduce<Record<string, typeof partners>>((acc, p) => {
    (acc[p.type] ||= []).push(p);
    return acc;
  }, {});

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container-page">
        {partners.length === 0 ? (
          <EmptyState message="提携先・連携実績は確定次第、掲載いたします。" />
        ) : (
          <div className="space-y-16">
            {Object.entries(grouped).map(([type, list], gi) => (
              <FadeUp key={type} delay={0.05 * gi}>
                <div>
                  <p className="text-sm font-semibold text-primary/50">
                    {typeLabel[type]?.en ?? type}
                    <span className="ml-2 text-primary/40">／ {typeLabel[type]?.ja ?? ""}</span>
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
                    {list.map((p) => (
                      <PartnerLogo key={p.id} name={p.name} />
                    ))}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
