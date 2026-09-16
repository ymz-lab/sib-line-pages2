"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TextReveal } from "./motion";
import BaseGraphic from "./BaseGraphic";
import HeroPhoto from "./HeroPhoto";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section className="relative flex min-h-[88vh] flex-col justify-center overflow-hidden bg-white pb-20 pt-28 md:min-h-[90vh] md:pb-24 md:pt-32">
      {/* Photo bleeds off the viewport's right edge on desktop, overlapping
          the top of the headline area rather than sitting in a clean second
          column. */}
      <div className="pointer-events-none absolute right-0 top-[8%] hidden h-[62%] w-[34vw] max-w-[520px] lg:block">
        <HeroPhoto className="h-full w-full" />
      </div>
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
        className="pointer-events-none absolute right-[30vw] top-[4%] hidden lg:block"
      >
        <BaseGraphic className="h-20 w-32 text-primary" />
      </motion.div>

      <div className="container-page relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="eyebrow mb-8"
        >
          BaseAI
        </motion.p>

        <TextReveal
          as="h1"
          lines={["人と企業をつなぎ、", "新しい挑戦を生み出す。"]}
          className="max-w-[15em] text-[clamp(1.85rem,8vw,5.5rem)] font-bold leading-[1.3] tracking-tight text-primary lg:max-w-[1040px] lg:leading-[1.25]"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
          className="mt-8 text-xs font-medium uppercase tracking-wides text-primary/50 md:text-sm"
        >
          Connecting people, businesses and communities.
        </motion.p>
      </div>

      <div className="brand-line relative z-10 mt-10 md:mt-14" />

      <div className="container-page relative z-10 mt-10 md:mt-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.34fr]">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
            className="max-w-md text-base leading-loose text-primary/70 md:text-lg"
          >
            BaseAIは、経営者コミュニティ、学生コミュニティ、企業向け実行支援を通じて、
            人・企業・地域の挑戦を支援する会社です。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
            className="flex flex-wrap items-start gap-x-10 gap-y-4 lg:justify-end"
          >
            <Link href="/#about" className="arrow-link">
              BaseAIについて
              <span className="arrow" aria-hidden="true">→</span>
            </Link>
            <Link href="/services" className="arrow-link">
              サービスを見る
              <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>

        {/* Mobile / tablet: the photo drops below the copy, full-bleed. */}
        <HeroPhoto className="mt-14 aspect-[4/5] w-full lg:hidden" />
      </div>
    </section>
  );
}
