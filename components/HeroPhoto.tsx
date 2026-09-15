"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import PhotoPlaceholder from "./PhotoPlaceholder";
import BaseGraphic from "./BaseGraphic";

export default function HeroPhoto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // A very weak parallax: photo drifts ~18px over the hero's scroll range.
  const y = useTransform(scrollYProgress, [0, 1], [0, 18]);

  return (
    <div ref={ref} className="relative">
      <BaseGraphic className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 text-primary md:-left-16 md:-top-16 md:h-56 md:w-56" />
      <motion.div
        style={{ y }}
        initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
        animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <PhotoPlaceholder
          label="経営者交流会の様子（写真差し替え予定）"
          clip
          className="aspect-[4/5] w-full md:aspect-[5/6]"
        />
      </motion.div>
    </div>
  );
}
