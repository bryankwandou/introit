"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MonitorOff } from "lucide-react";
import { SlideCanvas } from "@/components/SlideCanvas";
import { DEFAULT_THEMES } from "@/lib/seed";
import { cn } from "@/components/ui";

const RUNDOWN = [
  {
    title: "Tanda Salib dan Salam",
    tag: "L1",
    themeIndex: 0,
    slides: [
      "Dalam nama Bapa dan Putra\ndan Roh Kudus.",
      "Rahmat Tuhan kita Yesus Kristus,\ncinta kasih Allah,\ndan persekutuan Roh Kudus\nbersamamu.",
    ],
  },
  {
    title: "Tuhan Kasihanilah Kami",
    tag: "L2",
    themeIndex: 2,
    slides: [
      "Tuhan, kasihanilah kami.\nTuhan, kasihanilah kami.",
      "Kristus, kasihanilah kami.\nKristus, kasihanilah kami.",
    ],
  },
  {
    title: "Malam Kudus",
    tag: "V1",
    themeIndex: 1,
    slides: [
      "Malam kudus, sunyi senyap\nDunia terlelap",
      "Hanya dua berjaga terus\nAyah bunda mesra dan kudus",
    ],
  },
];

const FLAT = RUNDOWN.flatMap((entry, entryIndex) =>
  entry.slides.map((text, slideIndex) => ({
    text,
    entryIndex,
    slideIndex,
    themeIndex: entry.themeIndex,
  })),
);

export function HeroStage() {
  const [at, setAt] = useState(0);
  const [blackout, setBlackout] = useState(false);
  const [manual, setManual] = useState(false);

  // Runs on its own so the page shows the product working, and stops the moment a
  // visitor takes the controls.
  useEffect(() => {
    if (manual) return;
    const t = setInterval(() => setAt((i) => (i + 1) % FLAT.length), 3600);
    return () => clearInterval(t);
  }, [manual]);

  const step = (delta: number) => {
    setManual(true);
    setAt((i) => (i + delta + FLAT.length) % FLAT.length);
  };

  const current = FLAT[at];
  const theme = DEFAULT_THEMES[current.themeIndex];

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-panel shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]">
      <div className="flex h-9 items-center gap-2 border-b border-line px-3">
        <span className="size-2 rounded-full bg-line" />
        <span className="size-2 rounded-full bg-line" />
        <span className="size-2 rounded-full bg-line" />
        <span className="ml-2 font-mono text-[10px] text-muted">
          introit — meja operator
        </span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-muted">
          <span
            className={cn(
              "size-1.5 rounded-full",
              blackout ? "bg-line" : "animate-pulse bg-live",
            )}
          />
          {blackout ? "gelap" : "tayang"}
        </span>
      </div>

      <div className="grid grid-cols-[minmax(0,150px)_1fr] sm:grid-cols-[minmax(0,190px)_1fr]">
        <div className="space-y-0.5 border-r border-line p-2">
          {RUNDOWN.map((entry, i) => (
            <button
              key={entry.title}
              onClick={() => {
                setManual(true);
                setAt(FLAT.findIndex((s) => s.entryIndex === i));
              }}
              className={cn(
                "flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors",
                current.entryIndex === i
                  ? "bg-raised"
                  : "hover:bg-raised/60",
              )}
            >
              <span
                className={cn(
                  "font-mono text-[9px]",
                  current.entryIndex === i ? "text-live" : "text-muted",
                )}
              >
                {i + 1}
              </span>
              <span className="truncate text-[11px] text-fg/90">
                {entry.title}
              </span>
            </button>
          ))}
          <p className="px-2 pt-3 font-mono text-[9px] leading-relaxed text-muted">
            urutan ibadat
            <br />
            tersimpan di perangkat
          </p>
        </div>

        <div className="p-3">
          <div className="relative overflow-hidden rounded-lg border border-live/50">
            <AnimatePresence mode="wait">
              <motion.div
                key={at}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <SlideCanvas
                  text={current.text}
                  theme={theme}
                  blackout={blackout}
                  className="aspect-video w-full"
                />
              </motion.div>
            </AnimatePresence>
            <span className="absolute top-2 left-2 rounded bg-live px-1.5 py-0.5 font-mono text-[9px] text-white">
              {RUNDOWN[current.entryIndex].tag}
              {current.slideIndex + 1}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-1.5">
            <button
              onClick={() => step(-1)}
              className="cursor-pointer rounded-md border border-line px-2 py-1.5 text-muted transition-colors hover:border-muted hover:text-fg"
              aria-label="Salindia sebelumnya"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <button
              onClick={() => step(1)}
              className="cursor-pointer rounded-md border border-line px-2 py-1.5 text-muted transition-colors hover:border-muted hover:text-fg"
              aria-label="Salindia berikutnya"
            >
              <ChevronRight className="size-3.5" />
            </button>
            <button
              onClick={() => {
                setManual(true);
                setBlackout((b) => !b);
              }}
              className={cn(
                "cursor-pointer rounded-md border px-2 py-1.5 transition-colors",
                blackout
                  ? "border-live bg-live text-white"
                  : "border-line text-muted hover:border-muted hover:text-fg",
              )}
              aria-label="Gelapkan layar"
            >
              <MonitorOff className="size-3.5" />
            </button>
            <span className="ml-auto font-mono text-[9px] text-muted">
              {at + 1} / {FLAT.length} · silakan dicoba
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
