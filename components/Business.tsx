import Link from "next/link";
import { services } from "@/data/services";
import { FadeUp, StaggerGroup, StaggerItem } from "./motion";
import PhotoPlaceholder from "./PhotoPlaceholder";

type BusinessProps = {
  variant?: "summary" | "full";
};

export default function Business({ variant = "full" }: BusinessProps) {
  const isSummary = variant === "summary";

  return (
    <section className={`py-28 md:py-40 ${isSummary ? "bg-white" : "bg-bg-soft"}`}>
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <FadeUp>
            <p className="eyebrow mb-4">{isSummary ? "What We Do" : "Business"}</p>
            <h2 className="text-[clamp(1.9rem,4.6vw,3.75rem)] font-bold leading-snug text-primary">
              BaseAIが取り組む3つの事業
            </h2>
          </FadeUp>
          {!isSummary && (
            <FadeUp delay={0.1}>
              <span className="text-xs font-semibold uppercase tracking-wides text-primary/40">
                01 — 03
              </span>
            </FadeUp>
          )}
        </div>

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
                  className="group block overflow-hidden border-b border-line py-12 transition-colors hover:bg-white md:py-16"
                >
                  <div className="grid gap-4 md:grid-cols-[120px_1fr_1.5fr] md:gap-10">
                    <span className="text-3xl font-bold text-blue transition-transform duration-300 group-hover:translate-x-1 md:text-4xl">
                      {service.number}
                    </span>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wides text-primary/40">
                        {service.subtitle}
                      </p>
                      <h3 className="mt-2 text-2xl font-bold text-primary transition-transform duration-300 group-hover:translate-x-1 md:text-3xl lg:text-4xl">
                        {service.title}
                      </h3>
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
                        <span
                          className="inline-block transition-transform group-hover:translate-x-1.5"
                          aria-hidden="true"
                        >
                          →
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="grid max-h-0 grid-cols-[120px_1fr] gap-10 opacity-0 transition-all duration-500 ease-out group-hover:mt-8 group-hover:max-h-52 group-hover:opacity-100 md:grid-cols-[120px_1fr_1.5fr]">
                    <span aria-hidden="true" />
                    <PhotoPlaceholder
                      label="PHOTO"
                      className="col-span-1 aspect-[16/7] w-full md:col-span-2"
                    />
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
