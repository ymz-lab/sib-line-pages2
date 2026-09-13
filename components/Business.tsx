import { services } from "@/data/services";
import Reveal from "./Reveal";

export default function Business() {
  return (
    <section id="business" className="scroll-mt-20 bg-bg-soft py-24 md:py-32">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow mb-4">Business</p>
          <h2 className="text-3xl font-bold leading-snug text-primary md:text-4xl">
            BaseAIが取り組む3つの事業
          </h2>
        </Reveal>

        <div className="mt-16 divide-y divide-primary/10 border-t border-primary/10">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={0.05 * i}>
              <div className="grid gap-6 py-12 md:grid-cols-[100px_1fr_1.4fr] md:gap-10">
                <span className="text-2xl font-bold text-blue">{service.number}</span>

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
                      <li key={point} className="flex items-start gap-2 text-sm text-primary/60">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-blue" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
