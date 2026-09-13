import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "株式会社BaseAIのプライバシーポリシーです。",
};

export default function PrivacyPage() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-page max-w-2xl">
        <p className="eyebrow mb-4">Privacy Policy</p>
        <h1 className="text-3xl font-bold leading-snug text-primary md:text-4xl">
          プライバシーポリシー
        </h1>

        <div className="mt-10 space-y-8 text-sm leading-loose text-primary/70">
          <p>
            株式会社BaseAI（以下「当社」といいます）は、お問い合わせいただいた個人情報を、
            お問い合わせへの対応及び関連するご連絡の目的にのみ利用し、
            ご本人の同意なく第三者に提供することはありません。
          </p>
          <p>
            本ポリシーは今後の事業内容の確定にあわせて随時見直し・更新を行います。
            詳細な取り扱いについては、お問い合わせ窓口までご連絡ください。
          </p>
          <p className="text-xs text-primary/40">最終更新日：準備中</p>
        </div>
      </div>
    </section>
  );
}
