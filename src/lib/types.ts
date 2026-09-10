/**
 * Core domain model.
 *
 * The vocabulary follows OpenLyrics / OpenLP so that songs can move between Introit
 * and the tools churches already run, rather than inventing a private dialect.
 * See https://docs.openlyrics.org/en/latest/dataformat.html
 */

/** OpenLyrics verse tags: v1, c1, b1, p1, i1, e1, o1. */
export type SectionKind =
  | "verse"
  | "chorus"
  | "bridge"
  | "prechorus"
  | "intro"
  | "ending"
  | "other";

export const SECTION_ABBREV: Record<SectionKind, string> = {
  verse: "V",
  chorus: "C",
  bridge: "B",
  prechorus: "P",
  intro: "I",
  ending: "E",
  other: "O",
};

export const SECTION_LABEL: Record<SectionKind, string> = {
  verse: "Bait",
  chorus: "Refren",
  bridge: "Bridge",
  prechorus: "Pre-Refren",
  intro: "Intro",
  ending: "Penutup",
  other: "Lain",
};

export interface Section {
  id: string;
  kind: SectionKind;
  /** 1-based index within its kind, so verse #2 renders as "V2". */
  number: number;
  /** One string per slide. A blank line in the editor splits a new slide. */
  slides: string[];
}

export type ItemKind = "song" | "liturgy" | "scripture" | "announcement";

export interface LibraryItem {
  id: string;
  kind: ItemKind;
  title: string;
  /** Composer, author, or liturgical source. */
  attribution?: string;
  /** Free-text grouping: "Adven", "Prapaskah", "Ordinarium". */
  collection?: string;
  ccli?: string;
  copyright?: string;
  sections: Section[];
  /** Section ids in presentation order; repeats are allowed (V1 C1 V2 C1). */
  order: string[];
  /** Theme id override; falls back to the setlist theme. */
  themeId?: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface SetlistEntry {
  id: string;
  itemId: string;
  /** Operator note shown only on the presenter side, never to the audience. */
  note?: string;
}

export interface Setlist {
  id: string;
  name: string;
  /** Service date as YYYY-MM-DD. */
  date?: string;
  entries: SetlistEntry[];
  themeId?: string;
  createdAt: number;
  updatedAt: number;
}

export type TextAlign = "left" | "center" | "right";
export type VerticalAlign = "top" | "middle" | "bottom";

export interface Theme {
  id: string;
  name: string;
  background: string;
  /** Optional media id painted behind the text. */
  backgroundMediaId?: string;
  /** 0–100; darkens background media so lyrics stay readable. */
  backgroundScrim: number;
  color: string;
  fontFamily: string;
  /** Percentage of output height, so type scales with the projector. */
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  align: TextAlign;
  verticalAlign: VerticalAlign;
  uppercase: boolean;
  /** Drop shadow radius in px; 0 disables. Essential over video. */
  shadow: number;
  outline: number;
  /** Safe-area inset as a percentage of the shorter edge. */
  padding: number;
  /** Cross-fade between slides in milliseconds; 0 cuts straight over. */
  transition?: number;
  createdAt: number;
}

export interface MediaAsset {
  id: string;
  name: string;
  mime: string;
  /** Stored as a Blob so the library survives offline with no server. */
  blob: Blob;
  width?: number;
  height?: number;
  createdAt: number;
}

/** What the audience window is told to paint. Sent over BroadcastChannel. */
export interface StageState {
  /** Monotonic counter so a late-joining window can tell staleness. */
  revision: number;
  visible: boolean;
  /** Slide text, already resolved. Null means cleared to background. */
  text: string | null;
  theme: Theme;
  /** Announcement crawl along the bottom, e.g. "Parkir liar akan diderek". */
  ticker?: string;
  /** Black the output entirely, above everything. */
  blackout: boolean;
  logoBlank: boolean;
  /** Epoch ms the pre-service countdown ends at. Absent means no countdown. */
  countdownTo?: number;
  /** Shown under the countdown, e.g. "Misa dimulai". */
  countdownLabel?: string;
  /** Title and slide tag, for the musicians' monitor only. */
  nowTitle?: string;
  nowTag?: string;
  /** Text of the slide queued after the live one, for the monitor. */
  nextText?: string | null;
}
