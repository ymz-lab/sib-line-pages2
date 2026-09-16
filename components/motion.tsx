"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

type FadeUpProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

/** Generic fade + rise on scroll into view. The default section-entry animation. */
export function FadeUp({ children, delay = 0, className }: FadeUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type TextRevealProps = {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p";
};

const lineVariant = {
  hidden: { y: "110%", opacity: 0 },
  show: { y: "0%", opacity: 1, transition: { duration: 0.8, ease: EASE } },
};

/**
 * Reveals a headline line by line: each line rises from below a clipped
 * boundary, staggered. Used for the Hero headline and other large titles.
 *
 * A single motion.div on the outside observes the viewport and drives all
 * lines via variant propagation — independent whileInView per line is not
 * used here, since sibling observers registering in the same tick can fail
 * to fire in this Framer Motion version.
 */
export function TextReveal({ lines, className, lineClassName, delay = 0, as = "h2" }: TextRevealProps) {
  const Tag = as;
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: delay } } }}
    >
      <Tag className={className}>
        {lines.map((line) => (
          <span key={line} className="block overflow-hidden">
            <motion.span variants={lineVariant} className={`block ${lineClassName ?? ""}`}>
              {line}
            </motion.span>
          </span>
        ))}
      </Tag>
    </motion.div>
  );
}

type ImageRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/** Reveals a photo/graphic by wiping a clip-path open, rather than a plain fade. */
export function ImageReveal({ children, className, delay = 0.15 }: ImageRevealProps) {
  return (
    <motion.div
      initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
      whileInView={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type StaggerGroupProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
};

const staggerContainer = (stagger: number, delay: number) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/** Wrap a list of items to stagger their entrance as a group (e.g. numbered rows). */
export function StaggerGroup({ children, className, stagger = 0.08, delay = 0 }: StaggerGroupProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer(stagger, delay)}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}
