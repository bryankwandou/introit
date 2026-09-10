"use client";

import { useEffect, useState } from "react";
import type { Theme } from "@/lib/types";

/** Ticks once a second and stops at zero rather than counting into the negative. */
export function useRemaining(target?: number) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!target) return;
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [target]);

  if (!target) return null;
  return Math.max(0, Math.round((target - now) / 1000));
}

export const formatClock = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

/**
 * The pre-service clock. It borrows the theme's colours so a parish that has tuned
 * its lyric slides does not get a stark white timer between them.
 */
export function Countdown({
  target,
  label,
  theme,
}: {
  target: number;
  label?: string;
  theme: Theme;
}) {
  const remaining = useRemaining(target) ?? 0;

  return (
    <div
      className="flex size-full flex-col items-center justify-center gap-[2cqh]"
      style={{ color: theme.color }}
    >
      <span
        style={{
          fontFamily: `"${theme.fontFamily}", system-ui, sans-serif`,
          fontSize: `${theme.fontSize * 2.1}cqh`,
          fontWeight: theme.fontWeight,
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1,
          textShadow: theme.shadow
            ? `0 ${theme.shadow * 0.06}cqh ${theme.shadow * 0.14}cqh rgba(0,0,0,.72)`
            : undefined,
        }}
      >
        {formatClock(remaining)}
      </span>
      {label && (
        <span
          style={{
            fontFamily: `"${theme.fontFamily}", system-ui, sans-serif`,
            fontSize: `${Math.max(theme.fontSize * 0.42, 2.6)}cqh`,
            opacity: 0.8,
            letterSpacing: "0.04em",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
