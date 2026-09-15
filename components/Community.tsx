import Link from "next/link";
import { FadeUp } from "./motion";

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
    <section className="bg-white py-28 md:py-40">
      <div className="container-page">
        <FadeUp>
          <p className="eyebrow mb-4">Community</p>
          <h2 className="max-w-2xl text-2xl font-bold leading-snug text-primary md:text-4xl">
            人脈を探す場所ではなく、
            <br />
            必要な接点が生まれる場所。
          </h2>
        </FadeUp>

        <div className="mt-16 grid gap-16 md:grid-cols-2">
          <FadeUp delay={0.05}>
            <div>
              <p className="text-sm font-semibold text-primary/50">Flow</p>
              <ol className="mt-6 space-y-5">
                {flow.map((step, i) => (
                  <li key={step} className="flex items-center gap-4 border-t border-line pt-5 first:border-t-0 first:pt-0">
                    <span className="text-sm font-semibold text-blue">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-base font-medium text-primary">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div>
              <p className="text-sm font-semibold text-primary/50">Activities</p>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                {activities.map((a, i) => (
                  <span key={a} className="text-sm text-primary/70">
                    {a}
                    {i < activities.length - 1 && <span className="ml-5 text-primary/20">・</span>}
                  </span>
                ))}
              </div>

              <Link href="/contact" className="arrow-link mt-10">
                コミュニティについて相談する
                <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
