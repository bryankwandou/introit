"use client";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Megaphone,
  MonitorOff,
  Palette,
  SquareSlash,
  Timer,
} from "lucide-react";
import { SlideCanvas } from "@/components/SlideCanvas";
import { Button, Kbd, PaneTitle, cn } from "@/components/ui";
import { useThemes } from "@/lib/hooks";
import { usePresenter } from "@/lib/store";
import type { ResolvedSlide } from "@/lib/slides";
import type { Theme } from "@/lib/types";

interface Props {
  theme: Theme;
  background: { url?: string; mime?: string };
  live: ResolvedSlide | null;
  next: ResolvedSlide | null;
  position: { index: number; total: number } | null;
  /** Set when the live piece carries its own theme, overriding the picker below. */
  override?: string;
  /** Picking a theme also writes it onto the rundown, so it survives a reload. */
  onPickTheme: (id: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function LiveRail({
  theme,
  background,
  live,
  next,
  position,
  override,
  onPickTheme,
  onPrev,
  onNext,
}: Props) {
  const {
    blackout,
    toggleBlackout,
    logoBlank,
    toggleLogoBlank,
    clear,
    liveIndex,
    themeId,
    setEditingTheme,
    ticker,
    tickerOn,
    setTicker,
    toggleTicker,
    countdownTo,
    countdownLabel,
    startCountdown,
    stopCountdown,
    setCountdownLabel,
  } = usePresenter();
  const themes = useThemes();

  const cleared = liveIndex < 0 || !live;

  return (
    <div className="flex h-full flex-col">
      <PaneTitle
        right={
          position && (
            <span className="font-mono text-[11px] text-muted">
              {position.index + 1} / {position.total}
            </span>
          )
        }
      >
        <span className="flex items-center gap-2">
          <span
            className={cn(
              "size-2 rounded-full",
              cleared || blackout ? "bg-line" : "animate-pulse bg-live",
            )}
          />
          Tayang
        </span>
      </PaneTitle>

      <div className="space-y-2 p-3">
        <div
          className={cn(
            "overflow-hidden rounded-lg border",
            cleared || blackout ? "border-line" : "border-live/60",
          )}
        >
          <SlideCanvas
            text={cleared ? null : live.text}
            theme={theme}
            backgroundUrl={background.url}
            backgroundMime={background.mime}
            playBackground
            countdown={
              countdownTo ? { target: countdownTo, label: countdownLabel } : undefined
            }
            ticker={tickerOn ? ticker : undefined}
            blackout={blackout}
            className="aspect-video w-full"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onPrev}
            title="Salindia sebelumnya"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={onNext}
            title="Salindia berikutnya"
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            variant={blackout ? "live" : "outline"}
            onClick={toggleBlackout}
            title="Gelapkan layar (B)"
          >
            <MonitorOff className="size-4" />
          </Button>
          <Button
            variant={logoBlank ? "solid" : "outline"}
            onClick={toggleLogoBlank}
            title="Kosongkan teks, sisakan latar (L)"
          >
            <SquareSlash className="size-4" />
          </Button>
          <Button variant="outline" onClick={clear} title="Bersihkan layar (C)">
            <Eye className="size-4" />
          </Button>
        </div>
      </div>

      <div className="border-t border-line">
        <PaneTitle>Berikutnya</PaneTitle>
        <div className="p-3">
          <div className="overflow-hidden rounded-lg border border-line/70">
            <SlideCanvas
              text={next?.text ?? null}
              theme={theme}
              backgroundUrl={background.url}
              backgroundMime={background.mime}
              className="aspect-video w-full opacity-80"
            />
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto border-t border-line p-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-muted uppercase">
              <Palette className="size-3" /> Tema
            </span>
            <button
              onClick={() => setEditingTheme(theme.id)}
              className="cursor-pointer font-mono text-[10px] text-gold hover:text-gold-bright"
            >
              sunting
            </button>
          </div>

          {override && (
            <p className="rounded-md border border-line bg-ink px-2 py-1.5 font-mono text-[10px] leading-relaxed text-muted">
              butir yang tayang memakai temanya sendiri:{" "}
              <span className="text-gold">{override}</span>. pilihan di bawah
              berlaku untuk butir lain.
            </p>
          )}
          <div className="grid grid-cols-3 gap-1.5">
            {(themes ?? []).map((t) => (
              <button
                key={t.id}
                onClick={() => onPickTheme(t.id)}
                title={t.name}
                className={cn(
                  "cursor-pointer overflow-hidden rounded-md border transition-all",
                  themeId === t.id
                    ? "border-gold ring-1 ring-gold/40"
                    : "border-line hover:border-muted",
                )}
              >
                <SlideCanvas
                  text="Aa"
                  theme={t}
                  className="aspect-video w-full"
                />
                <span className="block truncate px-1 py-1 text-[10px] text-muted">
                  {t.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-muted uppercase">
              <Timer className="size-3" /> Hitung mundur
            </span>
            {countdownTo && (
              <button
                onClick={stopCountdown}
                className="cursor-pointer font-mono text-[10px] text-live hover:brightness-125"
              >
                hentikan
              </button>
            )}
          </div>
          <div className="flex gap-1.5">
            {[5, 10, 15, 30].map((m) => (
              <button
                key={m}
                onClick={() => startCountdown(m)}
                className="flex-1 cursor-pointer rounded-md border border-line py-1.5 font-mono text-[11px] text-muted transition-colors hover:border-gold hover:text-gold"
              >
                {m}m
              </button>
            ))}
          </div>
          <input
            value={countdownLabel}
            onChange={(e) => setCountdownLabel(e.target.value)}
            placeholder="Keterangan di bawah angka"
            className="w-full rounded-lg border border-line bg-ink px-3 py-2 text-xs text-fg placeholder:text-muted/70 focus:border-gold focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-muted uppercase">
              <Megaphone className="size-3" /> Warta berjalan
            </span>
            <button
              onClick={toggleTicker}
              className={cn(
                "cursor-pointer font-mono text-[10px]",
                tickerOn ? "text-gold" : "text-muted hover:text-fg",
              )}
            >
              {tickerOn ? "tampil" : "sembunyi"}
            </button>
          </div>
          <textarea
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            rows={2}
            placeholder="Misal: Kolekte kedua untuk pembangunan kapel stasi."
            className="w-full resize-none rounded-lg border border-line bg-ink px-3 py-2 text-xs text-fg placeholder:text-muted/70 focus:border-gold focus:outline-none"
          />
        </div>

        <div className="space-y-1 border-t border-line pt-3 font-mono text-[10px] text-muted">
          <p className="flex items-center justify-between">
            <span>maju</span>
            <span className="flex gap-1">
              <Kbd>Spasi</Kbd>
              <Kbd>→</Kbd>
            </span>
          </p>
          <p className="flex items-center justify-between">
            <span>tayangkan salindia terpilih</span>
            <Kbd>Enter</Kbd>
          </p>
          <p className="flex items-center justify-between">
            <span>gelap / bersih</span>
            <span className="flex gap-1">
              <Kbd>B</Kbd>
              <Kbd>C</Kbd>
            </span>
          </p>
          <p className="flex items-center justify-between">
            <span>daftar pintasan</span>
            <Kbd>?</Kbd>
          </p>
        </div>
      </div>
    </div>
  );
}
