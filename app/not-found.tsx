import Link from "next/link";

export default function NotFound() {
  return (
    <section className="py-28 md:py-44">
      <div className="container-page text-center">
        <p className="eyebrow mb-4">404</p>
        <h1 className="text-3xl font-bold leading-snug text-primary md:text-5xl">
          ページが見つかりませんでした。
        </h1>
        <p className="mt-6 text-base leading-loose text-primary/70">
          お探しのページは移動または削除された可能性があります。
        </p>
        <Link href="/" className="arrow-link mt-10 justify-center">
          トップページへ戻る
          <span className="arrow" aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
