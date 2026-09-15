import Link from "next/link";
import { services } from "@/data/services";
import Reveal from "./Reveal";

type ServiceOverviewProps = {
  serviceId: string;
};

export default function ServiceOverview({ serviceId }: ServiceOverviewProps) {
  const service = services.find((s) => s.id === serviceId);
  if (!service) return null;

  return (
    <>
      <section className="bg-white py-20 md:py-28">
        <div className="container-page grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
          <Reveal>
            <p className="eyebrow mb-4">Overview</p>
            <h2 className="text-2xl font-bold leading-snug text-primary md:text-3xl">概要</h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-base leading-loose text-primary/70">{service.description}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-bg-soft py-20 md:py-28">
        <div className="container-page grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
          <Reveal>
            <p className="eyebrow mb-4">What We Offer</p>
            <h2 className="text-2xl font-bold leading-snug text-primary md:text-3xl">主な内容</h2>
          </Reveal>

          <div className="space-y-8">
            {service.points.map((point, i) => (
              <Reveal key={point} delay={0.05 * i}>
                <div className="flex gap-6 border-t border-primary/10 pt-6">
                  <span className="text-lg font-bold text-blue">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-base leading-relaxed text-primary/70">{point}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 text-center md:py-28">
        <div className="container-page">
          <Reveal>
            <p className="text-base leading-loose text-primary/70">
              {service.title}について、詳しくはお気軽にご相談ください。
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue"
            >
              お問い合わせ
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
