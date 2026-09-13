import Reveal from "./Reveal";

const values = [
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

export default function MissionVisionValue() {
  return (
    <section id="mission" className="scroll-mt-20 bg-white py-24 md:py-32">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow mb-4">Mission</p>
          <h2 className="max-w-3xl text-3xl font-bold leading-[1.5] tracking-tight text-primary md:text-4xl md:leading-[1.5]">
            人・企業・地域をつなぎ、
            <br />
            新しい挑戦と事業機会が
            <br />
            循環する環境をつくる。
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-24 border-t border-primary/10 pt-16 md:mt-32">
            <p className="eyebrow mb-4">Vision</p>
            <h3 className="max-w-3xl text-2xl font-bold leading-[1.6] tracking-tight text-primary md:text-3xl">
              テクノロジーと人のつながりで、
              <br />
              神奈川から新しい経済のかたちをつくる。
            </h3>
          </div>
        </Reveal>

        <div className="mt-24 border-t border-primary/10 pt-16 md:mt-32">
          <Reveal>
            <p className="eyebrow mb-4">Value</p>
          </Reveal>
          <div className="mt-8 grid gap-x-10 gap-y-14 sm:grid-cols-2">
            {values.map((v, i) => (
              <Reveal key={v.number} delay={0.05 * i}>
                <div className="border-t border-primary/10 pt-6">
                  <span className="text-sm font-semibold text-blue">{v.number}</span>
                  <h4 className="mt-2 text-xl font-bold text-primary">
                    {v.en} <span className="text-primary/50">/ {v.ja}</span>
                  </h4>
                  <p className="mt-3 text-base leading-relaxed text-primary/70">{v.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
