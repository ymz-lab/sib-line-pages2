import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="about" className="scroll-mt-20 bg-bg-soft py-24 md:py-32">
      <div className="container-page grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
        <Reveal>
          <p className="eyebrow mb-4">About</p>
          <h2 className="text-3xl font-bold leading-snug text-primary md:text-4xl">
            テクノロジーと、
            <br />
            リアルなつながりを。
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="space-y-6 text-base leading-loose text-primary/70 md:text-lg">
            <p>
              企業や地域の課題は、情報やツールが不足しているだけではありません。
              必要な人、企業、知見、機会と出会えていないことで、前に進まない課題も存在します。
            </p>
            <p>
              BaseAIは、コミュニティを起点に企業の課題を理解し、必要な接点をつくり、
              必要に応じて実行まで支援します。
            </p>
            <p>技術だけではなく、人と人の関係性を価値へ変えることを目指します。</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
