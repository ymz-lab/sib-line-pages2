import Reveal from "./Reveal";

const points = [
  { number: "01", title: "地域との近い接点", body: "神奈川・藤沢を拠点に、地域の経営者・企業と近い距離で関わっています。" },
  { number: "02", title: "企業課題から始める", body: "技術ありきではなく、企業や地域が抱える課題の理解から着手します。" },
  { number: "03", title: "若い世代の柔軟な発想", body: "学生コミュニティとの接点から生まれる、新しい視点を取り入れています。" },
  { number: "04", title: "小さく試せる実行力", body: "大きな計画から始めず、まず小さく形にして試すことを重視しています。" },
  { number: "05", title: "制作して終わらず、改善まで伴走", body: "納品後も継続的に関わり、運用や改善を一緒に進めます。" },
];

export default function WhyBaseAI() {
  return (
    <section className="bg-bg-soft py-24 md:py-32">
      <div className="container-page grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
        <Reveal>
          <p className="eyebrow mb-4">Why BaseAI</p>
          <h2 className="text-3xl font-bold leading-[1.5] text-primary md:text-4xl md:leading-[1.5]">
            大規模な専門会社ではなく、
            地域の関係性を起点に、
            小さく実行へ進める伴走役。
          </h2>
          <p className="mt-8 text-sm leading-loose text-primary/60">
            BaseAIは立ち上げ期の会社であり、実績はこれからつくっていく段階です。
            専門領域によっては、専門特化した企業の方が適している場合もあります。
            その前提のうえで、私たちにできることをお伝えします。
          </p>
        </Reveal>

        <div className="space-y-10">
          {points.map((p, i) => (
            <Reveal key={p.number} delay={0.05 * i}>
              <div className="flex gap-6 border-t border-primary/10 pt-6">
                <span className="text-lg font-bold text-blue">{p.number}</span>
                <div>
                  <h3 className="text-lg font-bold text-primary">{p.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-primary/70">{p.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
