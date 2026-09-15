"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TextReveal } from "./motion";
import HeroPhoto from "./HeroPhoto";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-28 md:pt-36">
      <div className="container-page grid items-center gap-16 pb-24 md:pb-32 lg:grid-cols-[1.3fr_0.7fr] lg:gap-10">
        <div>
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
            className="text-[2.5rem] font-bold leading-[1.3] tracking-tight text-primary sm:text-5xl md:text-6xl md:leading-[1.2]"
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
            className="mt-8 text-xs font-medium uppercase tracking-wides text-primary/50 md:text-sm"
          >
            Connecting people, businesses and communities.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
            className="mt-6 max-w-md text-base leading-loose text-primary/70 md:text-lg"
          >
            BaseAIは、経営者コミュニティ、学生コミュニティ、企業向け実行支援を通じて、
            人・企業・地域の挑戦を支援する会社です。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
            className="mt-12 flex flex-wrap gap-x-10 gap-y-4"
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

        <HeroPhoto />
      </div>
    </section>
  );
}
