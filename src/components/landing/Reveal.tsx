"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Scroll-in for editorial blocks. Deliberately short and small in travel — a landing
 * page for a church volunteer should feel calm, not like a product launch keynote.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
