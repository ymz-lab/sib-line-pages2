import Link from "next/link";
import Reveal from "./Reveal";

export default function ContactCTA() {
  return (
    <section className="bg-bg-mist py-24 md:py-32">
      <div className="container-page text-center">
        <Reveal>
          <p className="eyebrow mb-4">Contact</p>
          <h2 className="text-3xl font-bold leading-snug text-primary md:text-4xl">
            まずは、お気軽にご相談ください。
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base leading-loose text-primary/70">
            経営者コミュニティ、企業向け実行支援、SIB、イベント、協業・提携など、
            内容を問わずお気軽にお問い合わせください。
          </p>
          <Link
            href="/contact"
            className="mt-10 inline-flex items-center justify-center rounded-full bg-primary px-10 py-4 text-sm font-semibold text-white transition-colors hover:bg-blue"
          >
            お問い合わせフォームへ
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
