import Reveal from "./Reveal";

const items = ["メンバー", "イベント", "求人", "プロジェクト", "企業課題", "相談", "マッチング", "限定コンテンツ"];

export default function PlatformConcept() {
  return (
    <section className="bg-primary py-24 text-white md:py-32">
      <div className="container-page">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <p className="eyebrow !text-blue-light mb-0">Community Platform</p>
            <span className="rounded-full border border-white/30 px-3 py-1 text-xs font-semibold tracking-wide text-white/80">
              Future Concept ／ 構想段階
            </span>
          </div>
          <h2 className="mt-6 max-w-2xl text-2xl font-bold leading-snug md:text-3xl">
            単発の出会いを、
            <br />
            継続的な関係と事業機会へ。
          </h2>
          <p className="mt-6 max-w-xl text-base leading-loose text-white/70">
            将来的に、メンバー・イベント・求人・プロジェクト・企業課題・相談・マッチング・限定コンテンツなどを
            一元管理するプラットフォームを構想しています。現時点では構想段階であり、提供中のサービスではありません。
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-wrap gap-3">
            {items.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/80"
              >
                {item}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
