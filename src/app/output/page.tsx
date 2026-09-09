"use client";

import { useEffect, useRef, useState } from "react";
import { SlideCanvas } from "@/components/SlideCanvas";
import { StageLink } from "@/lib/stage";
import { DEFAULT_THEMES } from "@/lib/seed";
import type { StageState } from "@/lib/types";

const IDLE: StageState = {
  revision: 0,
  visible: true,
  text: null,
  theme: DEFAULT_THEMES[0],
  blackout: false,
  logoBlank: false,
};

/**
 * What the congregation sees. Deliberately inert: no chrome, no shortcuts that could
 * fire by accident, no network. It listens and it paints.
 */
export default function OutputPage() {
  const [state, setState] = useState<StageState>(IDLE);
  const [showHint, setShowHint] = useState(true);
  const linkRef = useRef<StageLink | null>(null);

  useEffect(() => {
    const link = new StageLink();
    linkRef.current = link;

    const snap = link.readSnapshot();
    if (snap) setState(snap);

    const off = link.subscribe(setState);
    link.requestSnapshot();

    document.title = "Introit — Layar";
    document.body.style.cursor = "none";
    document.body.style.background = "#000";

    return () => {
      off();
      link.close();
      document.body.style.cursor = "";
    };
  }, []);

  // The hint tells a volunteer they opened the right window; it must not linger
  // into the service, so it retires on its own.
  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 6000);
    return () => clearTimeout(t);
  }, []);

  const enterFullscreen = () => {
    document.documentElement.requestFullscreen?.().catch(() => {});
    setShowHint(false);
  };

  return (
    <main className="fixed inset-0 bg-black" onDoubleClick={enterFullscreen}>
      <SlideCanvas
        text={state.visible ? state.text : null}
        theme={state.theme}
        ticker={state.ticker}
        blackout={state.blackout}
        className="h-full w-full"
      />

      {showHint && (
        <button
          onClick={enterFullscreen}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 cursor-pointer rounded-full border border-white/15 bg-black/70 px-5 py-2.5 font-mono text-xs tracking-wide text-white/70 backdrop-blur transition hover:border-white/30 hover:text-white"
        >
          Layar keluaran siap — klik untuk layar penuh
        </button>
      )}
    </main>
  );
}
