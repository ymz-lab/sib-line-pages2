import Link from "next/link";
import Reveal from "./Reveal";

const flow = ["ヒアリング", "課題整理", "接点設計", "個別紹介", "フォロー"];

const activities = [
  "経営者交流",
  "少人数会",
  "テーマ別会",
  "課題相談",
  "企業紹介",
  "協業相談",
  "情報共有",
];

export default function Community() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow mb-4">Community</p>
          <h2 className="max-w-2xl text-2xl font-bold leading-snug text-primary md:text-3xl">
            人脈を探す場所ではなく、
            <br />
            必要な接点が生まれる場所。
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-16 md:grid-cols-2">
          <Reveal delay={0.05}>
            <div>
              <p className="text-sm font-semibold text-primary/50">Flow</p>
              <ol className="mt-6 space-y-5">
                {flow.map((step, i) => (
                  <li key={step} className="flex items-center gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/20 text-sm font-semibold text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-base font-medium text-primary">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              <p className="text-sm font-semibold text-primary/50">Activities</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {activities.map((a) => (
                  <span
                    key={a}
                    className="rounded-full border border-primary/15 px-4 py-2 text-sm text-primary/70"
                  >
                    {a}
                  </span>
                ))}
              </div>

              <Link
                href="/contact"
                className="mt-10 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue"
              >
                コミュニティについて相談する
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
