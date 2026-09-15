import Link from "next/link";
import { services } from "@/data/services";
import { FadeUp, StaggerGroup, StaggerItem } from "./motion";

type BusinessProps = {
  variant?: "summary" | "full";
};

export default function Business({ variant = "full" }: BusinessProps) {
  const isSummary = variant === "summary";

  return (
    <section className={`py-28 md:py-40 ${isSummary ? "bg-white" : "bg-bg-soft"}`}>
      <div className="container-page">
        <FadeUp>
          <p className="eyebrow mb-4">{isSummary ? "What We Do" : "Business"}</p>
          <h2 className="text-3xl font-bold leading-snug text-primary md:text-5xl">
            BaseAIが取り組む3つの事業
          </h2>
        </FadeUp>

        {isSummary ? (
          <>
            <StaggerGroup className="mt-16 grid gap-10 border-t border-line pt-10 sm:grid-cols-3">
              {services.map((service) => (
                <StaggerItem key={service.id}>
                  <span className="block text-sm font-semibold text-blue">{service.number}</span>
                  <h3 className="mt-3 text-lg font-bold text-primary">{service.title}</h3>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-primary/70">
                    {service.copy}
                  </p>
                </StaggerItem>
              ))}
            </StaggerGroup>
            <FadeUp delay={0.15}>
              <Link href="/services" className="arrow-link mt-14">
                サービスを詳しく見る
                <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </FadeUp>
          </>
        ) : (
          <div className="mt-16 border-t border-line">
            {services.map((service, i) => (
              <FadeUp key={service.id} delay={0.05 * i}>
                <Link
                  href={`/services/${service.id}`}
                  className="group grid gap-4 border-b border-line py-12 transition-colors hover:bg-white/60 md:grid-cols-[120px_1fr_1.5fr] md:gap-10 md:py-16"
                >
                  <span className="text-3xl font-bold text-blue md:text-4xl">{service.number}</span>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wides text-primary/40">
                      {service.subtitle}
                    </p>
                    <h3 className="mt-2 text-xl font-bold text-primary md:text-2xl">{service.title}</h3>
                    <p className="mt-4 whitespace-pre-line text-lg font-semibold leading-relaxed text-primary">
                      {service.copy}
                    </p>
                  </div>

                  <div>
                    <p className="text-base leading-loose text-primary/70">{service.description}</p>
                    <ul className="mt-5 space-y-2">
                      {service.points.map((point) => (
                        <li key={point} className="flex items-start gap-3 text-sm text-primary/60">
                          <span className="mt-2.5 h-px w-3 shrink-0 bg-primary/30" />
                          {point}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors group-hover:text-blue">
                      VIEW MORE
                      <span className="inline-block transition-transform group-hover:translate-x-1.5" aria-hidden="true">
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
