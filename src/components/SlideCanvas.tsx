"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type { Theme } from "@/lib/types";
import { Countdown } from "./Countdown";

interface Props {
  text: string | null;
  theme: Theme;
  /** Painted behind the text; an object URL for a media asset. */
  backgroundUrl?: string;
  /** Mime of the asset above, so a video loops instead of failing to paint. */
  backgroundMime?: string;
  /** Thumbnails leave video paused; only the projector and live pane play it. */
  playBackground?: boolean;
  ticker?: string;
  blackout?: boolean;
  /** Replaces the slide text with a pre-service clock while it is running. */
  countdown?: { target: number; label?: string };
  /** Cross-fade text changes. Off in thumbnails, on wherever the slide is watched. */
  animate?: boolean;
  /**
   * Broadcast key: paint this flat colour instead of the theme's background so OBS or
   * vMix can chroma-key it away and lay the words over the camera.
   */
  keyColor?: string;
  className?: string;
}

/** Default cross-fade for themes saved before the setting existed. */
export const DEFAULT_TRANSITION = 220;

const justify = {
  top: "flex-start",
  middle: "center",
  bottom: "flex-end",
} as const;

/**
 * The single renderer for a slide, shared by the projector, the preview, the live pane,
 * and the thumbnails in the grid.
 *
 * Sizes are expressed in `cqh` — percentages of the container's own height — so one
 * theme renders identically in a 120px thumbnail and on a 4K projector without a
 * scale-factor prop to get wrong. This is why the operator's preview is trustworthy.
 */
export function SlideCanvas({
  text,
  theme,
  backgroundUrl,
  backgroundMime,
  playBackground,
  ticker,
  blackout,
  countdown,
  animate,
  keyColor,
  className,
}: Props) {
  const isVideo = backgroundMime?.startsWith("video/") ?? false;
  const fade = animate ? (theme.transition ?? DEFAULT_TRANSITION) : 0;

  /**
   * Keeps the outgoing line on screen for the length of the fade.
   *
   * A hard cut reads as a flicker from the back of a nave, so both lines are painted
   * at once and the old one thins out under the new. The previous text is captured
   * while rendering, which is the only moment its value is still known.
   */
  const [shown, setShown] = useState(text);
  const [leaving, setLeaving] = useState<{ id: number; text: string } | null>(null);

  if (shown !== text) {
    setShown(text);
    setLeaving(
      fade && shown !== null
        ? { id: (leaving?.id ?? 0) + 1, text: shown }
        : null,
    );
  }

  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(() => setLeaving(null), fade);
    return () => clearTimeout(t);
  }, [leaving, fade]);

  const shadow = theme.shadow
    ? `0 ${theme.shadow * 0.06}cqh ${theme.shadow * 0.14}cqh rgba(0,0,0,.72)`
    : undefined;

  // A keyer needs hard edges. A soft shadow blends into the key colour and leaves a
  // tinted halo round every letter, so the key feed swaps it for a solid outline
  // painted behind the glyph, which keeps the letters their full weight.
  // Full stroke width in cqh; half sits under the glyph, so about 0.28cqh shows,
  // roughly 3px on a 1080p feed — enough to hold over a bright camera picture.
  const keyStroke = Math.max(theme.outline, 2) * 0.28;

  const textStyle: CSSProperties = {
    color: theme.color,
    fontFamily: `"${theme.fontFamily}", system-ui, sans-serif`,
    fontSize: `${theme.fontSize}cqh`,
    fontWeight: theme.fontWeight,
    lineHeight: theme.lineHeight,
    textAlign: theme.align,
    textTransform: theme.uppercase ? "uppercase" : "none",
    textShadow: keyColor ? undefined : shadow,
    WebkitTextStroke: keyColor
      ? `${keyStroke}cqh #000`
      : theme.outline
        ? `${theme.outline * 0.05}cqh rgba(0,0,0,.85)`
        : undefined,
    paintOrder: keyColor ? "stroke fill" : undefined,
    whiteSpace: "pre-wrap",
    textWrap: "balance",
  };

  return (
    <div
      className={`relative overflow-hidden ${className ?? ""}`}
      style={{ containerType: "size", background: keyColor ?? theme.background }}
    >
      {/* A keyed feed carries words only: a photo behind them would cover the camera. */}
      {backgroundUrl && !keyColor && isVideo && (
        <video
          key={backgroundUrl}
          src={backgroundUrl}
          className="absolute inset-0 size-full object-cover"
          autoPlay={playBackground}
          loop
          muted
          playsInline
        />
      )}
      {backgroundUrl && !keyColor && !isVideo && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundUrl})` }}
        />
      )}
      {backgroundUrl && !keyColor && theme.backgroundScrim > 0 && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: theme.backgroundScrim / 100 }}
        />
      )}

      <div
        className="absolute inset-0 flex"
        style={{
          padding: `${theme.padding}cqh ${theme.padding * 0.9}cqw`,
          alignItems: justify[theme.verticalAlign],
          justifyContent: "center",
        }}
      >
        {countdown ? (
          <Countdown
            target={countdown.target}
            label={countdown.label}
            theme={theme}
          />
        ) : (
          <>
            {leaving && (
              <div
                key={leaving.id}
                aria-hidden
                style={{
                  ...textStyle,
                  position: "absolute",
                  inset: `${theme.padding}cqh ${theme.padding * 0.9}cqw`,
                  display: "flex",
                  alignItems: justify[theme.verticalAlign],
                  justifyContent: "center",
                  flexDirection: "column",
                  animation: `introit-leave ${fade}ms ease-out both`,
                }}
              >
                {leaving.text}
              </div>
            )}
            {text !== null && (
              <div
                key={text}
                style={{
                  ...textStyle,
                  animation: fade
                    ? `introit-enter ${fade}ms ease-out both`
                    : undefined,
                }}
              >
                {text}
              </div>
            )}
          </>
        )}
      </div>

      {ticker && (
        <div
          // A see-through bar would mix with the key colour and leave a tinted band.
          className={`absolute inset-x-0 bottom-0 truncate px-[2cqw] py-[1.4cqh] ${keyColor ? "bg-black" : "bg-black/55 backdrop-blur-sm"}`}
          style={{
            color: theme.color,
            fontFamily: `"${theme.fontFamily}", system-ui, sans-serif`,
            fontSize: `${Math.max(theme.fontSize * 0.34, 2.4)}cqh`,
          }}
        >
          {ticker}
        </div>
      )}

      {/* On a keyed feed, "blackout" must clear the overlay, not black out the stream. */}
      {blackout && (
        <div
          className="absolute inset-0 bg-black"
          style={keyColor ? { background: keyColor } : undefined}
        />
      )}
    </div>
  );
}
