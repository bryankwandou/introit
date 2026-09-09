"use client";

import { useEffect, useRef } from "react";
import { LayoutGrid, Pencil, Rows3 } from "lucide-react";
import { SlideCanvas } from "@/components/SlideCanvas";
import { Button, Empty, PaneTitle, cn } from "@/components/ui";
import { resolveSlides } from "@/lib/slides";
import { usePresenter } from "@/lib/store";
import type { LibraryItem, Theme } from "@/lib/types";
import { useState } from "react";

interface Props {
  item?: LibraryItem;
  theme: Theme;
  /** Slide index that is on the projector, or -1 when this item is not live. */
  liveIndex: number;
  onGoLive: (index: number) => void;
}

export function SlideDeck({ item, theme, liveIndex, onGoLive }: Props) {
  const { cursor, setCursor, setEditing } = usePresenter();
  const [dense, setDense] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const slides = item ? resolveSlides(item) : [];

  // Keep the cursor visible when the operator arrows past the fold — the alternative
  // is a volunteer scrolling with a mouse while the congregation waits.
  useEffect(() => {
    const el = scrollRef.current?.querySelector(`[data-slide="${cursor}"]`);
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [cursor]);

  if (!item) {
    return (
      <div className="flex h-full flex-col">
        <PaneTitle>Salindia</PaneTitle>
        <Empty
          title="Pilih sesuatu untuk ditayangkan"
          body="Butir dari tata ibadat atau pustaka akan terurai menjadi salindia di sini."
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <PaneTitle
        right={
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              className="px-2 py-1.5"
              title={dense ? "Tampilan kisi" : "Tampilan baris"}
              onClick={() => setDense((d) => !d)}
            >
              {dense ? (
                <LayoutGrid className="size-4" />
              ) : (
                <Rows3 className="size-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              className="px-2 py-1.5"
              title="Sunting butir"
              onClick={() => setEditing(item.id)}
            >
              <Pencil className="size-4" />
            </Button>
          </div>
        }
      >
        <span className="text-fg normal-case">{item.title}</span>
        {item.attribution && (
          <span className="ml-2 tracking-normal normal-case">
            {item.attribution}
          </span>
        )}
      </PaneTitle>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto p-3">
        <div
          className={cn(
            "grid gap-3",
            dense
              ? "grid-cols-1"
              : "grid-cols-[repeat(auto-fill,minmax(200px,1fr))]",
          )}
        >
          {slides.map((slide, i) => {
            const isLive = liveIndex === i;
            const isCursor = cursor === i;
            return (
              <button
                key={slide.key}
                data-slide={i}
                onClick={() => setCursor(i)}
                onDoubleClick={() => onGoLive(i)}
                className={cn(
                  "group relative cursor-pointer overflow-hidden rounded-lg border text-left transition-all",
                  isLive
                    ? "border-live ring-2 ring-live/40"
                    : isCursor
                      ? "border-gold"
                      : "border-line hover:border-muted",
                  dense && "flex items-stretch gap-3",
                )}
              >
                <SlideCanvas
                  text={slide.text}
                  theme={theme}
                  className={cn(
                    dense ? "aspect-video w-40 shrink-0" : "aspect-video w-full",
                  )}
                />
                {dense && (
                  <span className="flex-1 self-center py-2 pr-3 text-sm whitespace-pre-wrap text-fg/80">
                    {slide.text}
                  </span>
                )}
                <span
                  className={cn(
                    "absolute top-1.5 left-1.5 rounded px-1.5 py-0.5 font-mono text-[10px] backdrop-blur-sm",
                    isLive
                      ? "bg-live text-white"
                      : "bg-black/60 text-white/70",
                  )}
                >
                  {slide.tag}
                  {slide.sectionSlideCount > 1 &&
                    ` ${slide.indexInSection + 1}/${slide.sectionSlideCount}`}
                </span>
                <span className="absolute right-1.5 bottom-1.5 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10px] text-white/50 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  klik ganda → tayang
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
