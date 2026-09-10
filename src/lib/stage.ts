"use client";

import { useSyncExternalStore } from "react";

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

/* ------------------------------------------------------- receiving side */

/**
 * One link per window, shared by every component that paints a frame.
 *
 * The audience and monitor pages are read-only subscribers, so the frame lives outside
 * React and reaches it through useSyncExternalStore: no effect writes state, and a
 * window opened halfway through the service paints the stored frame on its first pass.
 */
let receiver: StageLink | null = null;
let latest: StageState | null = null;
const watchers = new Set<() => void>();

function attach(): void {
  if (receiver) return;
  receiver = new StageLink();
  latest = receiver.readSnapshot();
  receiver.subscribe((frame) => {
    latest = frame;
    watchers.forEach((notify) => notify());
  });
  receiver.requestSnapshot();
}

function subscribeToStage(notify: () => void): () => void {
  attach();
  watchers.add(notify);
  return () => {
    watchers.delete(notify);
    if (watchers.size === 0) {
      receiver?.close();
      receiver = null;
    }
  };
}

const readLatest = () => latest;
const readNothing = () => null;

/** The frame the operator last published, or null before one arrives. */
export function useStageState(): StageState | null {
  return useSyncExternalStore(subscribeToStage, readLatest, readNothing);
}

/**
 * Opens the audience window. Tries the Window Management API first so the window lands
 * on the projector without the operator dragging it; falls back to a plain popup that
 * they can throw fullscreen with F11.
 */
export async function openOutputWindow(
  url: "/output" | "/stage" = "/output",
): Promise<Window | null> {
  const name = url === "/stage" ? "introit-stage" : "introit-output";

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
          name,
          `left=${external.left},top=${external.top},width=${external.width},height=${external.height}`,
        );
      }
    } catch {
      // Permission denied or unsupported — fall through to the plain popup.
    }
  }

  return window.open(url, name, "width=1280,height=720");
}
