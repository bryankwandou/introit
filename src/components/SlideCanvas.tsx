"use client";

import type { CSSProperties } from "react";
import type { Theme } from "@/lib/types";

interface Props {
  text: string | null;
  theme: Theme;
  /** Painted behind the text; an object URL for a media asset. */
  backgroundUrl?: string;
  ticker?: string;
  blackout?: boolean;
  className?: string;
}

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
  ticker,
  blackout,
  className,
}: Props) {
  const shadow = theme.shadow
    ? `0 ${theme.shadow * 0.06}cqh ${theme.shadow * 0.14}cqh rgba(0,0,0,.72)`
    : undefined;

  const textStyle: CSSProperties = {
    color: theme.color,
    fontFamily: `"${theme.fontFamily}", system-ui, sans-serif`,
    fontSize: `${theme.fontSize}cqh`,
    fontWeight: theme.fontWeight,
    lineHeight: theme.lineHeight,
    textAlign: theme.align,
    textTransform: theme.uppercase ? "uppercase" : "none",
    textShadow: shadow,
    WebkitTextStroke: theme.outline
      ? `${theme.outline * 0.05}cqh rgba(0,0,0,.85)`
      : undefined,
    whiteSpace: "pre-wrap",
    textWrap: "balance",
  };

  return (
    <div
      className={`relative overflow-hidden ${className ?? ""}`}
      style={{ containerType: "size", background: theme.background }}
    >
      {backgroundUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundUrl})` }}
        />
      )}
      {backgroundUrl && theme.backgroundScrim > 0 && (
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
        {text !== null && <div style={textStyle}>{text}</div>}
      </div>

      {ticker && (
        <div
          className="absolute inset-x-0 bottom-0 truncate bg-black/55 px-[2cqw] py-[1.4cqh] backdrop-blur-sm"
          style={{
            color: theme.color,
            fontFamily: `"${theme.fontFamily}", system-ui, sans-serif`,
            fontSize: `${Math.max(theme.fontSize * 0.34, 2.4)}cqh`,
          }}
        >
          {ticker}
        </div>
      )}

      {blackout && <div className="absolute inset-0 bg-black" />}
    </div>
  );
}
