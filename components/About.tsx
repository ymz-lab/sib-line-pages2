import { FadeUp, TextReveal } from "./motion";

export default function About() {
  return (
    <section id="about" className="scroll-mt-20 bg-white py-28 md:py-40">
      <div className="container-page">
        <div className="border-t border-line pt-10 md:pt-14" />
        <div className="grid gap-12 md:grid-cols-[1fr_1.3fr] md:gap-20">
          <FadeUp>
            <p className="eyebrow mb-4">About Us</p>
            <TextReveal
              as="h2"
              lines={["テクノロジーではなく、", "人と人とのつながりから。"]}
              className="text-3xl font-bold leading-snug text-primary md:text-5xl md:leading-[1.25]"
            />
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="max-w-xl space-y-6 text-base leading-loose text-primary/70 md:text-lg">
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
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
