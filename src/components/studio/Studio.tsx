"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Database,
  ExternalLink,
  ImageIcon,
  Keyboard,
  Library,
  ListMusic,
  MonitorPlay,
  MonitorSpeaker,
  Save,
} from "lucide-react";
import { db, uid } from "@/lib/db";
import { download, exportBackup, importBackup } from "@/lib/io";
import { useItem, useSeeded, useSetlist, useSetlists, useThemes } from "@/lib/hooks";
import { useMediaUrl } from "@/lib/media";
import { DEFAULT_THEMES } from "@/lib/seed";
import { resolveSlides } from "@/lib/slides";
import { StageLink, openOutputWindow } from "@/lib/stage";
import { usePresenter } from "@/lib/store";
import type { LibraryItem, StageState, Theme } from "@/lib/types";
import { Button, cn } from "@/components/ui";
import { ItemEditor } from "./ItemEditor";
import { LibraryPane } from "./LibraryPane";
import { LiveRail } from "./LiveRail";
import { MediaPane } from "./MediaPane";
import { SetlistPane } from "./SetlistPane";
import { ShortcutsOverlay } from "./ShortcutsOverlay";
import { SlideDeck } from "./SlideDeck";
import { ThemeEditor } from "./ThemeEditor";

export function Studio() {
  const ready = useSeeded();
  const state = usePresenter();
  const {
    tab,
    setTab,
    activeSetlistId,
    openSetlist,
    activeItemId,
    liveItemId,
    liveIndex,
    cursor,
    setCursor,
    goLive,
    setLiveIndex,
    themeId,
    setTheme,
    blackout,
    logoBlank,
    ticker,
    tickerOn,
    countdownTo,
    countdownLabel,
    editing,
    editingTheme,
    toggleBlackout,
    toggleLogoBlank,
    clear,
    toggleShortcuts,
    setEditing,
    setEditingTheme,
  } = state;

  const setlists = useSetlists();
  const themes = useThemes();
  const setlist = useSetlist(activeSetlistId ?? setlists?.[0]?.id);
  const activeItem = useItem(activeItemId);
  const liveItem = useItem(liveItemId);
  const backupRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<StageLink | null>(null);
  const revision = useRef(0);

  // The first setlist becomes the working one so a volunteer who just opened the
  // laptop is one click from going live, not two.
  useEffect(() => {
    if (!activeSetlistId && setlists?.length) openSetlist(setlists[0].id);
  }, [activeSetlistId, setlists, openSetlist]);

  useEffect(() => {
    if (themes?.length && !themes.some((t) => t.id === themeId)) {
      setTheme(themes[0].id);
    }
  }, [themes, themeId, setTheme]);

  const theme: Theme =
    themes?.find((t) => t.id === themeId) ?? DEFAULT_THEMES[0];
  const background = useMediaUrl(theme.backgroundMediaId);

  const activeSlides = useMemo(
    () => (activeItem ? resolveSlides(activeItem) : []),
    [activeItem],
  );
  const liveSlides = useMemo(
    () => (liveItem ? resolveSlides(liveItem) : []),
    [liveItem],
  );

  const liveSlide =
    liveIndex >= 0 && liveIndex < liveSlides.length ? liveSlides[liveIndex] : null;
  const nextSlide =
    liveIndex >= 0 && liveIndex + 1 < liveSlides.length
      ? liveSlides[liveIndex + 1]
      : null;

  /* ------------------------------------------------------------ publishing */

  useEffect(() => {
    const link = new StageLink();
    linkRef.current = link;
    return () => {
      link.close();
      linkRef.current = null;
    };
  }, []);

  useEffect(() => {
    const text = logoBlank ? null : (liveSlide?.text ?? null);
    const frame: StageState = {
      revision: ++revision.current,
      visible: true,
      text,
      theme,
      ticker: tickerOn && ticker.trim() ? ticker.trim() : undefined,
      blackout,
      logoBlank,
      countdownTo,
      countdownLabel,
      nowTitle: liveItem?.title,
      nowTag: liveSlide?.tag,
      nextText: nextSlide?.text ?? null,
    };
    linkRef.current?.send(frame);
  }, [
    liveSlide,
    nextSlide,
    liveItem,
    theme,
    ticker,
    tickerOn,
    blackout,
    logoBlank,
    countdownTo,
    countdownLabel,
  ]);

  /* -------------------------------------------------------------- commands */

  const addToSetlist = useCallback(
    async (item: LibraryItem) => {
      if (!setlist) return;
      await db.setlists.put({
        ...setlist,
        entries: [...setlist.entries, { id: uid(), itemId: item.id }],
        updatedAt: Date.now(),
      });
      setTab("setlist");
    },
    [setlist, setTab],
  );

  const goLiveHere = useCallback(
    (index: number) => {
      if (!activeItem) return;
      goLive(activeItem.id, index);
    },
    [activeItem, goLive],
  );

  /** Walks past the end of an item into the next entry of the rundown. */
  const advance = useCallback(
    (delta: number) => {
      if (!liveItem) {
        if (activeItem) goLive(activeItem.id, Math.max(0, cursor));
        return;
      }
      const target = liveIndex + delta;
      if (target >= 0 && target < liveSlides.length) {
        setLiveIndex(target);
        return;
      }
      if (!setlist) return;
      const pos = setlist.entries.findIndex((e) => e.itemId === liveItem.id);
      if (pos < 0) return;
      const neighbour = setlist.entries[pos + (delta > 0 ? 1 : -1)];
      if (!neighbour) return;
      void db.items.get(neighbour.itemId).then((item) => {
        if (!item) return;
        const slides = resolveSlides(item);
        if (!slides.length) return;
        usePresenter.getState().openItem(item.id);
        goLive(item.id, delta > 0 ? 0 : slides.length - 1);
      });
    },
    [liveItem, liveIndex, liveSlides.length, setlist, activeItem, cursor, goLive, setLiveIndex],
  );

  /* ------------------------------------------------------------- shortcuts */

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing =
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.tagName === "SELECT" ||
          el.isContentEditable);

      if (e.key === "Escape") {
        if (editing) return setEditing(undefined);
        if (editingTheme) return setEditingTheme(undefined);
        if (state.showShortcuts) return toggleShortcuts();
        (document.activeElement as HTMLElement | null)?.blur();
        return;
      }

      if (typing || editing || editingTheme) return;

      switch (e.key) {
        case " ":
        case "ArrowRight":
        case "PageDown":
          e.preventDefault();
          advance(1);
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          advance(-1);
          break;
        case "ArrowDown":
          e.preventDefault();
          setCursor(Math.min(cursor + 1, Math.max(activeSlides.length - 1, 0)));
          break;
        case "ArrowUp":
          e.preventDefault();
          setCursor(Math.max(cursor - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          goLiveHere(cursor);
          break;
        case "Home":
          e.preventDefault();
          goLiveHere(0);
          break;
        case "Tab": {
          e.preventDefault();
          const order = ["setlist", "library", "media"] as const;
          setTab(order[(order.indexOf(tab) + 1) % order.length]);
          break;
        }
        case "/":
          e.preventDefault();
          setTab("library");
          setTimeout(
            () => document.getElementById("library-search")?.focus(),
            0,
          );
          break;
        case "?":
          e.preventDefault();
          toggleShortcuts();
          break;
        default:
          switch (e.key.toLowerCase()) {
            case "b":
              toggleBlackout();
              break;
            case "c":
              clear();
              break;
            case "l":
              toggleLogoBlank();
              break;
            case "o":
              void openOutputWindow();
              break;
            case "s":
              void openOutputWindow("/stage");
              break;
          }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    advance,
    activeSlides.length,
    cursor,
    setCursor,
    goLiveHere,
    tab,
    setTab,
    toggleBlackout,
    toggleLogoBlank,
    clear,
    toggleShortcuts,
    editing,
    editingTheme,
    setEditing,
    setEditingTheme,
    state.showShortcuts,
  ]);

  if (!ready) {
    return (
      <div className="flex h-dvh items-center justify-center bg-ink">
        <p className="font-mono text-xs tracking-widest text-muted uppercase">
          menyiapkan pustaka…
        </p>
      </div>
    );
  }

  return (
    <div className="studio-root flex h-dvh flex-col bg-ink">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line px-3">
        <Link href="/" className="flex items-center gap-2.5 pr-2" title="Beranda">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mark.svg" alt="" className="size-6" />
          <span className="font-display text-lg leading-none">Introit</span>
        </Link>

        <span className="hidden truncate font-mono text-[11px] text-muted sm:block">
          {setlist?.name}
          {setlist?.date ? ` · ${setlist.date}` : ""}
        </span>

        <div className="ml-auto flex items-center gap-1.5">
          <input
            ref={backupRef}
            type="file"
            accept="application/json"
            hidden
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const n = await importBackup(file);
                alert(`Cadangan dipulihkan: ${n} butir.`);
              } catch (err) {
                alert((err as Error).message);
              }
              e.target.value = "";
            }}
          />
          <Button
            variant="ghost"
            onClick={() => backupRef.current?.click()}
            title="Pulihkan cadangan"
            className="px-2.5"
          >
            <Database className="size-4" />
          </Button>
          <Button
            variant="ghost"
            title="Simpan cadangan"
            className="px-2.5"
            onClick={async () =>
              download(
                await exportBackup(),
                `introit-${new Date().toISOString().slice(0, 10)}.json`,
              )
            }
          >
            <Save className="size-4" />
          </Button>
          <Button
            variant="ghost"
            onClick={toggleShortcuts}
            title="Pintasan papan tik (?)"
            className="px-2.5"
          >
            <Keyboard className="size-4" />
          </Button>
          <Button
            variant="ghost"
            className="px-2.5"
            title="Buka monitor panggung untuk pemusik"
            onClick={() => void openOutputWindow("/stage")}
          >
            <MonitorSpeaker className="size-4" />
          </Button>
          <Link href="/output" target="_blank" className="hidden sm:block">
            <Button variant="ghost" className="px-2.5" title="Buka di tab baru">
              <ExternalLink className="size-4" />
            </Button>
          </Link>
          <Button variant="solid" onClick={() => void openOutputWindow()}>
            <MonitorPlay className="size-4" />
            <span className="hidden sm:inline">Layar keluaran</span>
          </Button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[280px_1fr_340px]">
        <aside className="flex min-h-0 flex-col border-r border-line bg-panel">
          <div className="flex shrink-0 border-b border-line">
            {(
              [
                ["setlist", "Ibadat", ListMusic],
                ["library", "Pustaka", Library],
                ["media", "Latar", ImageIcon],
              ] as const
            ).map(([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={cn(
                  "flex flex-1 cursor-pointer items-center justify-center gap-2 py-2.5 font-mono text-[10px] tracking-wider uppercase transition-colors",
                  tab === key
                    ? "border-b-2 border-gold text-gold"
                    : "border-b-2 border-transparent text-muted hover:text-fg",
                )}
              >
                <Icon className="size-3.5" />
                {label}
              </button>
            ))}
          </div>
          <div className="min-h-0 flex-1">
            {tab === "setlist" && <SetlistPane />}
            {tab === "library" && <LibraryPane onAddToSetlist={addToSetlist} />}
            {tab === "media" && <MediaPane />}
          </div>
        </aside>

        <main className="min-h-0 bg-ink">
          <SlideDeck
            item={activeItem}
            theme={theme}
            background={background}
            liveIndex={liveItem?.id === activeItem?.id ? liveIndex : -1}
            onGoLive={goLiveHere}
          />
        </main>

        <aside className="min-h-0 border-l border-line bg-panel">
          <LiveRail
            theme={theme}
            background={background}
            live={liveSlide}
            next={nextSlide}
            position={
              liveSlide
                ? { index: liveIndex, total: liveSlides.length }
                : null
            }
            onPrev={() => advance(-1)}
            onNext={() => advance(1)}
          />
        </aside>
      </div>

      <footer className="flex h-8 shrink-0 items-center gap-4 border-t border-line px-3 font-mono text-[10px] text-muted">
        <span className={cn(blackout && "text-live")}>
          {blackout ? "layar digelapkan" : "layar aktif"}
        </span>
        <span>{liveItem ? liveItem.title : "belum ada yang tayang"}</span>
        <span className="ml-auto hidden sm:inline">
          data tersimpan di peramban ini · tanpa sambungan internet
        </span>
      </footer>

      <ItemEditor />
      <ThemeEditor />
      <ShortcutsOverlay />
    </div>
  );
}
