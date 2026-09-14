import Link from "next/link";
import NetworkGraphic from "./NetworkGraphic";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-16 md:pt-24">
      <div className="container-page grid items-center gap-12 pb-20 md:grid-cols-2 md:pb-28">
        <div>
          <p className="eyebrow mb-6">BaseAI</p>
          <h1 className="text-3xl font-bold leading-[1.4] tracking-tight text-primary sm:text-5xl md:text-[3.4rem] md:leading-[1.3]">
            人と企業をつなぎ、
            <br />
            新しい挑戦を生み出す。
          </h1>
          <p className="mt-8 max-w-md text-base leading-loose text-primary/70 md:text-lg">
            BaseAIは、経営者コミュニティ、学生コミュニティ、
            企業向け実行支援を通じて、
            人・企業・地域の挑戦を支援する会社です。
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/#about"
              className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue"
            >
              BaseAIについて
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-full border border-primary/20 px-8 py-3.5 text-sm font-semibold text-primary transition-colors hover:border-blue hover:text-blue"
            >
              サービスを見る
            </Link>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <NetworkGraphic className="w-full max-w-md text-primary" />
        </div>
      </div>
    </section>
  );
}
