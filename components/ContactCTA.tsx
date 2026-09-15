import Link from "next/link";
import { FadeUp, TextReveal } from "./motion";

export default function ContactCTA() {
  return (
    <section className="border-t border-line bg-white py-28 md:py-40">
      <div className="container-page">
        <FadeUp>
          <p className="eyebrow mb-6">Contact</p>
        </FadeUp>

        <Link href="/contact" className="group block">
          <TextReveal
            as="h2"
            lines={["まずは、お気軽に", "ご相談ください。"]}
            className="text-4xl font-bold leading-[1.2] tracking-tight text-primary transition-colors group-hover:text-blue sm:text-6xl md:text-display"
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
