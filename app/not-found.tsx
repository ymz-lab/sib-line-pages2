import Link from "next/link";

export default function NotFound() {
  return (
    <section className="py-28 md:py-40">
      <div className="container-page text-center">
        <p className="eyebrow mb-4">404</p>
        <h1 className="text-3xl font-bold leading-snug text-primary md:text-4xl">
          ページが見つかりませんでした。
        </h1>
        <p className="mt-6 text-base leading-loose text-primary/70">
          お探しのページは移動または削除された可能性があります。
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue"
        >
          トップページへ戻る
        </Link>
      </div>
    </section>
  );
}
