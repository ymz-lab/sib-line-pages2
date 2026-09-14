import Reveal from "./Reveal";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export default function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="bg-white pb-16 pt-20 md:pb-20 md:pt-28">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow mb-5">{eyebrow}</p>
          <h1 className="text-3xl font-bold leading-snug tracking-tight text-primary md:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-6 max-w-xl text-base leading-loose text-primary/70">{description}</p>
          )}
          <div className="mt-10 h-px w-16 bg-blue" />
        </Reveal>
      </div>
    </section>
  );
}
