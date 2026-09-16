import { FadeUp, TextReveal } from "./motion";

export default function About() {
  return (
    <section id="about" className="scroll-mt-20 bg-white py-28 md:py-40">
      <div className="container-page">
        <div className="grid gap-16 md:grid-cols-[0.9fr_1.3fr] md:gap-20">
          <div className="md:sticky md:top-28 md:self-start">
            <FadeUp>
              <p className="eyebrow mb-4">About Us</p>
              <TextReveal
                as="h2"
                lines={["テクノロジーではなく、", "人と人とのつながりから。"]}
                className="text-3xl font-bold leading-snug text-primary md:text-6xl md:leading-[1.2]"
              />
            </FadeUp>
          </div>

          <div className="relative">
            <div
              className="pointer-events-none absolute -inset-x-6 -inset-y-10 hidden opacity-60 md:block"
              style={{
                backgroundImage: "linear-gradient(to bottom, #eef3f8 1px, transparent 1px)",
                backgroundSize: "100% 3rem",
              }}
              aria-hidden="true"
            />
            <FadeUp delay={0.1} className="relative max-w-xl space-y-6 text-base leading-loose text-primary/70 md:text-lg">
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

            <FadeUp delay={0.2} className="relative mt-20 flex items-end justify-between border-t border-line pt-8">
              <span className="text-xs font-semibold uppercase tracking-wides text-primary/40">
                What We Do
              </span>
              <span className="text-xs font-semibold uppercase tracking-wides text-primary/40">01 / 06</span>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
