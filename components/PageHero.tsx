import { FadeUp } from "./motion";
import BaseGraphic from "./BaseGraphic";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export default function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-white pb-16 pt-28 md:pb-20 md:pt-36">
      <BaseGraphic className="pointer-events-none absolute -right-4 top-8 hidden h-20 w-32 text-primary opacity-50 sm:block" />
      <div className="container-page relative">
        <FadeUp>
          <p className="eyebrow mb-5">{eyebrow}</p>
          <h1 className="text-[clamp(2.25rem,5.5vw,3.75rem)] font-bold leading-[1.15] tracking-tight text-primary">
            {title}
          </h1>
          {description && (
            <p className="mt-6 max-w-xl text-base leading-loose text-primary/70">{description}</p>
          )}
        </FadeUp>
      </div>
      <div className="brand-line mt-10 md:mt-14" />
    </section>
  );
}
