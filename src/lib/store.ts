"use client";

import { create } from "zustand";
import { DEFAULT_THEME_ID } from "./seed";

export type PaneTab = "library" | "setlist" | "reading" | "media";

interface PresenterState {
  tab: PaneTab;
  /** Setlist currently loaded into the rundown. */
  activeSetlistId?: string;
  /** Item whose slides fill the deck pane. Not necessarily the one that is live. */
  activeItemId?: string;
  /** Item the congregation is looking at. Survives browsing away in the deck. */
  liveItemId?: string;
  /** Index into the live item's resolved slides; -1 means the screen is cleared. */
  liveIndex: number;
  /** Cursor in the deck pane, moved by arrows before committing with Enter. */
  cursor: number;
  themeId: string;
  blackout: boolean;
  logoBlank: boolean;
  ticker: string;
  tickerOn: boolean;
  /** Typed straight onto the screen, ahead of whatever slide is live. */
  quick: string;
  quickOn: boolean;
  /** For the stage monitor only. */
  stageMsg: string;
  stageMsgOn: boolean;
  /** Epoch ms the pre-service clock ends at; undefined once it is dismissed. */
  countdownTo?: number;
  countdownLabel: string;
  search: string;
  /** Item id open in the editor drawer, or "new" for a blank one. */
  editing?: string;
  editingTheme?: string;
  showShortcuts: boolean;

  setTab: (t: PaneTab) => void;
  openSetlist: (id: string) => void;
  openItem: (id: string) => void;
  goLive: (itemId: string, index: number) => void;
  setLiveIndex: (i: number) => void;
  clear: () => void;
  setCursor: (i: number) => void;
  setTheme: (id: string) => void;
  toggleBlackout: () => void;
  toggleLogoBlank: () => void;
  setTicker: (t: string) => void;
  toggleTicker: () => void;
  setQuick: (t: string) => void;
  setStageMsg: (t: string) => void;
  /** Sends the given text, or whatever is typed when called without one. */
  sendStageMsg: (t?: string) => void;
  clearStageMsg: () => void;
  showQuick: () => void;
  hideQuick: () => void;
  startCountdown: (minutes: number) => void;
  stopCountdown: () => void;
  setCountdownLabel: (label: string) => void;
  setSearch: (s: string) => void;
  setEditing: (id?: string) => void;
  setEditingTheme: (id?: string) => void;
  toggleShortcuts: () => void;
}

export const usePresenter = create<PresenterState>((set) => ({
  tab: "setlist",
  liveIndex: -1,
  cursor: 0,
  themeId: DEFAULT_THEME_ID,
  blackout: false,
  logoBlank: false,
  ticker: "",
  tickerOn: false,
  quick: "",
  quickOn: false,
  stageMsg: "",
  stageMsgOn: false,
  countdownLabel: "Misa segera dimulai",
  search: "",
  showShortcuts: false,

  setTab: (tab) => set({ tab }),
  openSetlist: (activeSetlistId) => set({ activeSetlistId }),
  openItem: (activeItemId) => set({ activeItemId, cursor: 0 }),
  goLive: (liveItemId, liveIndex) =>
    set({ liveItemId, liveIndex, cursor: liveIndex, blackout: false }),
  setLiveIndex: (liveIndex) => set({ liveIndex, cursor: liveIndex }),
  clear: () => set({ liveIndex: -1 }),
  setCursor: (cursor) => set({ cursor }),
  setTheme: (themeId) => set({ themeId }),
  toggleBlackout: () => set((s) => ({ blackout: !s.blackout })),
  toggleLogoBlank: () => set((s) => ({ logoBlank: !s.logoBlank })),
  setTicker: (ticker) => set({ ticker }),
  toggleTicker: () => set((s) => ({ tickerOn: !s.tickerOn })),
  setQuick: (quick) => set({ quick }),
  setStageMsg: (stageMsg) => set({ stageMsg }),
  sendStageMsg: (t) =>
    set((s) => ({ stageMsg: t ?? s.stageMsg, stageMsgOn: Boolean((t ?? s.stageMsg).trim()) })),
  clearStageMsg: () => set({ stageMsgOn: false }),
  // Showing it also lifts a blackout: an operator typing a car plate under pressure
  // means "put this on the wall", not "put it behind a black rectangle".
  showQuick: () => set({ quickOn: true, blackout: false }),
  hideQuick: () => set({ quickOn: false }),
  startCountdown: (minutes) =>
    set({ countdownTo: Date.now() + Math.round(minutes * 60_000) }),
  stopCountdown: () => set({ countdownTo: undefined }),
  setCountdownLabel: (countdownLabel) => set({ countdownLabel }),
  setSearch: (search) => set({ search }),
  setEditing: (editing) => set({ editing }),
  setEditingTheme: (editingTheme) => set({ editingTheme }),
  toggleShortcuts: () => set((s) => ({ showShortcuts: !s.showShortcuts })),
}));
