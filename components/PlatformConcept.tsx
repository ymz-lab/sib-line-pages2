import { FadeUp } from "./motion";

const items = ["メンバー", "イベント", "求人", "プロジェクト", "企業課題", "相談", "マッチング", "限定コンテンツ"];

export default function PlatformConcept() {
  return (
    <section className="bg-primary py-28 text-white md:py-40">
      <div className="container-page">
        <FadeUp>
          <div className="flex flex-wrap items-center gap-3">
            <p className="eyebrow !text-blue-light mb-0">Community Platform</p>
            <span className="border border-white/30 px-3 py-1 text-xs font-semibold tracking-wide text-white/80">
              Future Concept ／ 構想段階
            </span>
          </div>
          <h2 className="mt-6 max-w-2xl text-2xl font-bold leading-snug md:text-4xl">
            単発の出会いを、
            <br />
            継続的な関係と事業機会へ。
          </h2>
          <p className="mt-6 max-w-xl text-base leading-loose text-white/70">
            将来的に、メンバー・イベント・求人・プロジェクト・企業課題・相談・マッチング・限定コンテンツなどを
            一元管理するプラットフォームを構想しています。現時点では構想段階であり、提供中のサービスではありません。
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="mt-14 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/15 pt-10">
            {items.map((item, i) => (
              <span key={item} className="text-sm text-white/80">
                {item}
                {i < items.length - 1 && <span className="ml-6 text-white/25">・</span>}
              </span>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
