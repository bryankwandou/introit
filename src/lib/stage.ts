"use client";

import type { StageState } from "./types";

const CHANNEL = "introit:stage";
/** Mirrored to localStorage so a window opened late paints immediately. */
const SNAPSHOT_KEY = "introit:stage:snapshot";

type Listener = (state: StageState) => void;

/**
 * One-way link from the presenter to every audience window.
 *
 * BroadcastChannel is same-origin and in-process, so it survives an offline PWA with no
 * network at all — which is the whole point. The localStorage mirror covers the case
 * where the output window is opened after the operator has already gone live.
 */
export class StageLink {
  private channel: BroadcastChannel | null = null;
  private listeners = new Set<Listener>();

  constructor() {
    if (typeof window === "undefined") return;
    this.channel = new BroadcastChannel(CHANNEL);
    this.channel.onmessage = (e: MessageEvent<StageState | { hello: true }>) => {
      const data = e.data;
      // A window that just opened asks for the current frame rather than waiting
      // for the operator to press a key.
      if (data && "hello" in data) {
        const snap = this.readSnapshot();
        if (snap) this.channel?.postMessage(snap);
        return;
      }
      this.listeners.forEach((l) => l(data as StageState));
    };
  }

  /** Called by the presenter. Publishes and persists the frame. */
  send(state: StageState) {
    try {
      localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(state));
    } catch {
      // Private-mode or quota failure must never stop the service.
    }
    this.channel?.postMessage(state);
  }

  /** Called by an output window on mount. */
  requestSnapshot() {
    this.channel?.postMessage({ hello: true });
  }

  readSnapshot(): StageState | null {
    try {
      const raw = localStorage.getItem(SNAPSHOT_KEY);
      return raw ? (JSON.parse(raw) as StageState) : null;
    } catch {
      return null;
    }
  }

  subscribe(l: Listener) {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }

  close() {
    this.channel?.close();
    this.channel = null;
    this.listeners.clear();
  }
}

/**
 * Opens the audience window. Tries the Window Management API first so the window lands
 * on the projector without the operator dragging it; falls back to a plain popup that
 * they can throw fullscreen with F11.
 */
export async function openOutputWindow(): Promise<Window | null> {
  const url = "/output";

  interface ScreenDetailed extends Screen {
    isPrimary: boolean;
    left: number;
    top: number;
  }
  interface ScreenDetails {
    screens: ScreenDetailed[];
  }
  const nav = window as unknown as {
    getScreenDetails?: () => Promise<ScreenDetails>;
  };

  if (typeof nav.getScreenDetails === "function") {
    try {
      const details = await nav.getScreenDetails();
      const external = details.screens.find((s) => !s.isPrimary);
      if (external) {
        return window.open(
          url,
          "introit-output",
          `left=${external.left},top=${external.top},width=${external.width},height=${external.height}`,
        );
      }
    } catch {
      // Permission denied or unsupported — fall through to the plain popup.
    }
  }

  return window.open(url, "introit-output", "width=1280,height=720");
}
