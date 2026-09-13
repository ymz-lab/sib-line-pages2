import Reveal from "./Reveal";

const steps = [
  "企業の課題",
  "コミュニティで発見",
  "必要な接点",
  "実行支援",
  "新しい事業機会",
  "コミュニティへ還元",
];

export default function BusinessCycle() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow mb-4">Business Cycle</p>
          <h2 className="max-w-2xl text-2xl font-bold leading-snug text-primary md:text-3xl">
            接点 → 実行 → 成長を、
            <br />
            ひとつの循環へ。
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-16 rounded-2xl border border-primary/10 bg-bg-soft p-8 md:p-14">
            <div className="grid gap-10 md:grid-cols-[1fr_auto_1fr] md:items-center">
              <div className="flex flex-col items-center gap-3 md:items-end">
                <span className="text-sm font-semibold text-primary/50">経営者コミュニティ</span>
              </div>

              <div className="flex flex-col items-center gap-2 rounded-full border-2 border-primary bg-white px-10 py-6 text-center">
                <span className="text-lg font-bold text-primary">BaseAI</span>
              </div>

              <div className="flex flex-col items-center gap-3 md:items-start">
                <span className="text-sm font-semibold text-primary/50">学生コミュニティ SIB</span>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <span className="text-sm font-semibold text-primary/50">企業向け実行支援</span>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-3 gap-y-4 border-t border-primary/10 pt-10">
              {steps.map((step, i) => (
                <span key={step} className="flex items-center gap-3">
                  <span className="whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-medium text-primary shadow-sm">
                    {step}
                  </span>
                  {i < steps.length - 1 && (
                    <span aria-hidden="true" className="text-primary/30">
                      →
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
