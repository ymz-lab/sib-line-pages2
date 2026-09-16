import Link from "next/link";
import { FadeUp, TextReveal } from "./motion";
import BaseGraphic from "./BaseGraphic";

export default function ContactCTA() {
  return (
    <section className="relative overflow-hidden border-t border-line bg-white py-28 md:py-40">
      <BaseGraphic className="pointer-events-none absolute -right-8 top-10 hidden h-32 w-52 text-primary opacity-60 md:block" />

      <div className="container-page relative">
        <FadeUp>
          <p className="eyebrow mb-6">Contact</p>
        </FadeUp>

        <Link href="/contact" className="group block">
          <TextReveal
            as="h2"
            lines={["まずは、お気軽に", "ご相談ください。"]}
            className="text-[clamp(2.5rem,6.5vw,5.5rem)] font-bold leading-[1.15] tracking-tight text-primary transition-colors group-hover:text-blue"
          />
          <FadeUp delay={0.3}>
            <span className="mt-10 inline-flex items-center gap-3 text-base font-semibold text-primary transition-colors group-hover:text-blue">
              お問い合わせフォームへ
              <span className="inline-block transition-transform group-hover:translate-x-2" aria-hidden="true">
                →
              </span>
            </span>
          </FadeUp>
        </Link>

        <FadeUp delay={0.15}>
          <p className="mt-14 max-w-lg text-sm leading-loose text-primary/60">
            経営者コミュニティ、企業向け実行支援、SIB、イベント、協業・提携など、
            内容を問わずお気軽にお問い合わせください。
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
