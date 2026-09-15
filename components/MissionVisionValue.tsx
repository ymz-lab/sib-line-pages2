import Link from "next/link";
import { FadeUp } from "./motion";

export const values = [
  {
    number: "01",
    en: "Trust",
    ja: "信頼",
    copy: "約束を守り、継続的な関係を築く。",
  },
  {
    number: "02",
    en: "Dialogue",
    ja: "対話",
    copy: "相手の課題を理解し、本質的な接点をつくる。",
  },
  {
    number: "03",
    en: "Execution",
    ja: "実行",
    copy: "アイデアで終わらせず、形にして価値へ変える。",
  },
  {
    number: "04",
    en: "Growth",
    ja: "成長",
    copy: "人・企業・地域がともに前進できる状態をつくる。",
  },
];

type MissionVisionValueProps = {
  variant?: "summary" | "full";
};

export default function MissionVisionValue({ variant = "full" }: MissionVisionValueProps) {
  if (variant === "summary") {
    return (
      <section className="bg-bg-soft py-28 md:py-40">
        <div className="container-page">
          <FadeUp>
            <p className="eyebrow mb-4">Our Philosophy</p>
          </FadeUp>

          <div className="mt-10 space-y-10">
            <FadeUp delay={0.05}>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wides text-blue">Mission</p>
                <p className="mt-3 max-w-2xl text-xl font-bold leading-relaxed text-primary md:text-2xl">
                  人・企業・地域をつなぎ、新しい挑戦と事業機会が循環する環境をつくる。
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wides text-blue">Vision</p>
                <p className="mt-3 max-w-2xl text-xl font-bold leading-relaxed text-primary md:text-2xl">
                  テクノロジーと人のつながりで、神奈川から新しい経済のかたちをつくる。
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wides text-blue">Value</p>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                  {values.map((v, i) => (
                    <span key={v.number} className="text-sm font-medium text-primary/80">
                      {v.en} / {v.ja}
                      {i < values.length - 1 && <span className="ml-6 text-primary/20">・</span>}
                    </span>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>

          <FadeUp delay={0.2}>
            <Link href="/company" className="arrow-link mt-14">
              私たちの考え方
              <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </FadeUp>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-28 md:py-40">
      <div className="container-page">
        <FadeUp>
          <p className="eyebrow mb-4">Mission</p>
          <h2 className="max-w-3xl text-3xl font-bold leading-[1.5] tracking-tight text-primary md:text-5xl md:leading-[1.35]">
            人・企業・地域をつなぎ、
            <br />
            新しい挑戦と事業機会が
            <br />
            循環する環境をつくる。
          </h2>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="mt-24 border-t border-line pt-16 md:mt-32">
            <p className="eyebrow mb-4">Vision</p>
            <h3 className="max-w-3xl text-2xl font-bold leading-[1.6] tracking-tight text-primary md:text-3xl">
              テクノロジーと人のつながりで、
              <br />
              神奈川から新しい経済のかたちをつくる。
            </h3>
          </div>
        </FadeUp>

        <div className="mt-24 border-t border-line pt-16 md:mt-32">
          <FadeUp>
            <p className="eyebrow mb-4">Value</p>
          </FadeUp>
          <div className="mt-8 grid gap-x-10 gap-y-14 sm:grid-cols-2">
            {values.map((v, i) => (
              <FadeUp key={v.number} delay={0.05 * i}>
                <div className="border-t border-line pt-6">
                  <span className="text-sm font-semibold text-blue">{v.number}</span>
                  <h4 className="mt-2 text-xl font-bold text-primary">
                    {v.en} <span className="text-primary/50">/ {v.ja}</span>
                  </h4>
                  <p className="mt-3 text-base leading-relaxed text-primary/70">{v.copy}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
