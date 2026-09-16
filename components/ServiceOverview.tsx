import Link from "next/link";
import { services } from "@/data/services";
import { FadeUp } from "./motion";

type ServiceOverviewProps = {
  serviceId: string;
};

export default function ServiceOverview({ serviceId }: ServiceOverviewProps) {
  const service = services.find((s) => s.id === serviceId);
  if (!service) return null;

  return (
    <>
      <section className="bg-white py-24 md:py-32">
        <div className="container-page">
          <FadeUp>
            <p className="eyebrow mb-6">Overview</p>
            <h2 className="text-[clamp(1.6rem,3.6vw,2.75rem)] font-bold leading-snug text-primary">概要</h2>
          </FadeUp>

          <FadeUp delay={0.1} className="mt-8 max-w-2xl text-base leading-loose text-primary/70 md:text-lg">
            <p>{service.description}</p>
          </FadeUp>
        </div>
      </section>

      <section className="bg-bg-soft py-24 md:py-32">
        <div className="container-page">
          <FadeUp>
            <p className="eyebrow mb-6">What We Offer</p>
            <h2 className="text-[clamp(1.6rem,3.6vw,2.75rem)] font-bold leading-snug text-primary">主な内容</h2>
          </FadeUp>

          <div className="mt-10 max-w-2xl space-y-8">
            {service.points.map((point, i) => (
              <FadeUp key={point} delay={0.05 * i}>
                <div className="flex gap-6 border-t border-line pt-6">
                  <span className="text-lg font-bold text-blue">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-base leading-relaxed text-primary/70">{point}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white py-24 md:py-32">
        <div className="container-page">
          <FadeUp>
            <p className="text-base leading-loose text-primary/70">
              {service.title}について、詳しくはお気軽にご相談ください。
            </p>
            <Link href="/contact" className="arrow-link mt-8">
              お問い合わせ
              <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
