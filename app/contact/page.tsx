import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { FadeUp } from "@/components/motion";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "株式会社BaseAIへのお問い合わせはこちらから。経営者コミュニティ、企業向け実行支援、SIB、イベント、協業・提携等、お気軽にご連絡ください。",
};

export default function ContactPage() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-page max-w-2xl">
        <FadeUp>
          <p className="eyebrow mb-4">Contact</p>
          <h1 className="text-4xl font-bold leading-snug text-primary md:text-6xl">
            まずは、お気軽にご相談ください。
          </h1>
          <p className="mt-6 text-base leading-loose text-primary/70">
            内容を確認のうえ、担当者よりご連絡いたします。
          </p>
        </FadeUp>

        <FadeUp delay={0.1} className="mt-16">
          <ContactForm />
        </FadeUp>
      </div>
    </section>
  );
}
