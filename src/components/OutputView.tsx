"use client";

import { useEffect, useState } from "react";
import { SlideCanvas } from "@/components/SlideCanvas";
import { useMediaUrl } from "@/lib/media";
import { useStageState } from "@/lib/stage";
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
 *
 * With `keyColor` it becomes a broadcast key feed: the same words on a flat colour that
 * OBS or vMix removes, so they sit over the camera on the livestream.
 */
export function OutputView({ keyColor }: { keyColor?: string }) {
  const state = useStageState() ?? IDLE;
  const [showHint, setShowHint] = useState(true);
  // The frame carries only the theme; the bytes are read straight from the same
  // IndexedDB, so a 40 MB loop never crosses BroadcastChannel.
  const background = useMediaUrl(state.theme.backgroundMediaId);

  useEffect(() => {
    document.body.style.cursor = "none";
    document.body.style.background = keyColor ?? "#000";
    document.documentElement.style.background = keyColor ?? "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [keyColor]);

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
    <main
      className="fixed inset-0 bg-black"
      style={keyColor ? { background: keyColor } : undefined}
      onDoubleClick={enterFullscreen}
    >
      <SlideCanvas
        text={state.visible ? state.text : null}
        theme={state.theme}
        backgroundUrl={background.url}
        backgroundMime={background.mime}
        playBackground
        animate
        countdown={
          state.countdownTo
            ? { target: state.countdownTo, label: state.countdownLabel }
            : undefined
        }
        ticker={state.ticker}
        blackout={state.blackout}
        keyColor={keyColor}
        className="h-full w-full"
      />

      {/* OBS would capture the hint into the stream, so the key feed never shows it. */}
      {showHint && !keyColor && (
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
