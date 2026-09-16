"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import PhotoPlaceholder from "./PhotoPlaceholder";

type HeroPhotoProps = {
  className?: string;
};

/** The Hero's media panel — bleeds to the viewport edge on desktop, drifts
 * very slightly on scroll, and opens with a scale + clip-path reveal. */
export default function HeroPhoto({ className }: HeroPhotoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={{ y }}
        initial={{ clipPath: "inset(0 0 0 12%)", opacity: 0, scale: 1.08, x: 28 }}
        animate={{ clipPath: "inset(0 0 0 0%)", opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 1.1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="h-full w-full"
      >
        <PhotoPlaceholder label="PHOTO" className="h-full w-full" />
      </motion.div>
    </div>
  );
}
