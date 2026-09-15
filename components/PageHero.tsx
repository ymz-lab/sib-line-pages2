import { FadeUp } from "./motion";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export default function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="bg-white pb-16 pt-28 md:pb-20 md:pt-36">
      <div className="container-page">
        <FadeUp>
          <p className="eyebrow mb-5">{eyebrow}</p>
          <h1 className="text-4xl font-bold leading-snug tracking-tight text-primary md:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="mt-6 max-w-xl text-base leading-loose text-primary/70">{description}</p>
          )}
          <div className="mt-10 h-px w-16 bg-blue" />
        </FadeUp>
      </div>
    </section>
  );
}
