import { FadeUp, TextReveal } from "./motion";

export default function About() {
  return (
    <section id="about" className="scroll-mt-20 bg-white py-28 md:py-40">
      <div className="container-page">
        <FadeUp>
          <p className="eyebrow mb-6">About Us</p>
        </FadeUp>

        <TextReveal
          as="h2"
          lines={["テクノロジーではなく、", "人と人とのつながりから。"]}
          className="max-w-4xl text-[clamp(1.7rem,5.2vw,4.25rem)] font-bold leading-[1.4] text-primary"
        />

        <FadeUp delay={0.15} className="mt-12 max-w-2xl space-y-6 text-base leading-loose text-primary/70 md:text-lg">
          <p>
            企業や地域の課題は、情報やツールが不足しているだけではありません。
            必要な人、企業、知見、機会と出会えていないことで、前に進まない課題も存在します。
          </p>
          <p>
            BaseAIは、コミュニティを起点に企業の課題を理解し、必要な接点をつくり、
            必要に応じて実行まで支援します。
          </p>
          <p>技術だけではなく、人と人の関係性を価値へ変えることを目指します。</p>
        </FadeUp>

        <FadeUp delay={0.25} className="mt-20 flex items-end justify-between border-t border-line pt-8">
          <span className="text-xs font-semibold uppercase tracking-wides text-primary/40">What We Do</span>
          <span className="text-xs font-semibold uppercase tracking-wides text-primary/40">01 / 06</span>
        </FadeUp>
      </div>
    </section>
  );
}
