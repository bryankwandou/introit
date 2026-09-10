"use client";

import { useEffect, useState } from "react";
import { formatClock, useRemaining } from "@/components/Countdown";
import { DEFAULT_THEMES } from "@/lib/seed";
import { useStageState } from "@/lib/stage";
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
 * The monitor that faces the musicians and the lector.
 *
 * It is not the projector: it deliberately shows what the congregation cannot see —
 * the slide after this one, the title of the piece, and a wall clock — in plain type
 * that reads from across a sanctuary. Nothing here can change what is on the screen.
 */
export default function StagePage() {
  const state = useStageState() ?? IDLE;
  const [clock, setClock] = useState("");
  const remaining = useRemaining(state.countdownTo);

  useEffect(() => {
    document.title = "Introit — Monitor Panggung";
  }, []);

  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    tick();
    const t = setInterval(tick, 10_000);
    return () => clearInterval(t);
  }, []);

  const cleared = state.blackout || state.text === null;

  return (
    <main className="flex h-dvh flex-col bg-black p-[2vh] text-white">
      <header className="flex shrink-0 items-baseline gap-4 border-b border-white/15 pb-[1.5vh]">
        <span className="truncate font-mono text-[2.2vh] tracking-wide text-white/60 uppercase">
          {state.nowTitle ?? "belum ada yang tayang"}
        </span>
        {state.nowTag && (
          <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[1.8vh] text-white/80">
            {state.nowTag}
          </span>
        )}
        <span className="ml-auto shrink-0 font-mono text-[2.4vh] tabular-nums text-white/70">
          {remaining !== null ? formatClock(remaining) : clock}
        </span>
      </header>

      <section className="flex min-h-0 flex-[3] items-center justify-center py-[2vh]">
        {cleared ? (
          <p className="font-mono text-[3vh] tracking-widest text-white/25 uppercase">
            {state.blackout ? "layar digelapkan" : "layar bersih"}
          </p>
        ) : (
          <p className="text-center text-[6.4vh] leading-[1.22] font-semibold whitespace-pre-wrap">
            {state.text}
          </p>
        )}
      </section>

      <section className="flex min-h-0 flex-[2] flex-col border-t border-white/15 pt-[1.5vh]">
        <span className="shrink-0 font-mono text-[1.8vh] tracking-[0.2em] text-white/35 uppercase">
          Berikutnya
        </span>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          {state.nextText ? (
            <p className="text-center text-[4vh] leading-[1.24] whitespace-pre-wrap text-white/55">
              {state.nextText}
            </p>
          ) : (
            <p className="font-mono text-[2.2vh] text-white/25">
              akhir dari butir ini
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
