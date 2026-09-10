import { uid } from "./db";
import type { LibraryItem } from "./types";

/**
 * Turning a pasted reading into slides.
 *
 * Introit ships no Bible text. Indonesian translations in daily use — Terjemahan Baru
 * above all — belong to their publishers, and shipping them would be taking something
 * that is not ours. So the parish pastes the reading it already has permission to
 * project, and this module does the tedious half: finding the verses, keeping them
 * whole, and cutting them at a length a congregation can actually read.
 */

export interface Verse {
  /** Verse number when the pasted text carried one. */
  number?: number;
  text: string;
}

/** Longest slide before a verse gets cut at a sentence boundary. */
export const SLIDE_LIMIT = 240;

const collapse = (s: string) => s.replace(/\s+/g, " ").trim();

/**
 * Finds verse numbers in a pasted block.
 *
 * Both shapes are common in the wild: numbers on their own line, and numbers running
 * inline through a paragraph. A block with no numbers at all falls back to paragraphs,
 * which is what a psalm response or a homily excerpt usually looks like.
 */
export function parseVerses(raw: string): Verse[] {
  const clean = raw.replace(/\r\n/g, "\n").trim();
  if (!clean) return [];

  const marked = /(?:^|\n|\s)(\d{1,3})[.:)]?\s+(?=\S)/g;
  const hits = [...clean.matchAll(marked)];

  // One stray number is a typo, not a numbering scheme.
  if (hits.length >= 2) {
    const out: Verse[] = [];
    hits.forEach((hit, i) => {
      const start = hit.index! + hit[0].length;
      const end = i + 1 < hits.length ? hits[i + 1].index! : clean.length;
      const text = collapse(clean.slice(start, end));
      if (text) out.push({ number: Number(hit[1]), text });
    });
    const preamble = collapse(clean.slice(0, hits[0].index!));
    if (preamble) out.unshift({ text: preamble });
    return out;
  }

  return clean
    .split(/\n{2,}|\n/)
    .map(collapse)
    .filter(Boolean)
    .map((text) => ({ text }));
}

/** Cuts an over-long verse after a full stop, and only mid-sentence as a last resort. */
function chunk(text: string, limit: number): string[] {
  if (text.length <= limit) return [text];

  const sentences = text.match(/[^.!?…]+[.!?…]*\s*/g) ?? [text];
  const out: string[] = [];
  let buffer = "";

  for (const sentence of sentences) {
    const candidate = buffer ? `${buffer}${sentence}` : sentence;
    if (candidate.trim().length <= limit || !buffer) {
      buffer = candidate;
      continue;
    }
    out.push(buffer.trim());
    buffer = sentence;
  }
  if (buffer.trim()) out.push(buffer.trim());

  // A single sentence longer than the limit still has to break somewhere: the last
  // space before the limit beats a hard cut through a word.
  return out.flatMap((part) => {
    if (part.length <= limit) return [part];
    const pieces: string[] = [];
    let rest = part;
    while (rest.length > limit) {
      const cut = rest.lastIndexOf(" ", limit);
      const at = cut > limit * 0.5 ? cut : limit;
      pieces.push(rest.slice(0, at).trim());
      rest = rest.slice(at).trim();
    }
    if (rest) pieces.push(rest);
    return pieces;
  });
}

export interface ReadingOptions {
  /** Verses per slide before the length cut applies. */
  perSlide: number;
  /** Prefix each verse with its number, the way a lectionary sheet does. */
  showNumbers: boolean;
  /** Appended to the last slide, e.g. "Demikianlah sabda Tuhan." */
  closing?: string;
}

export const DEFAULT_READING: ReadingOptions = {
  perSlide: 1,
  showNumbers: false,
};

/** Groups verses into slide-sized blocks. */
export function toSlides(verses: Verse[], opts: ReadingOptions): string[] {
  const groups: string[] = [];
  const size = Math.max(1, opts.perSlide);

  for (let i = 0; i < verses.length; i += size) {
    const text = verses
      .slice(i, i + size)
      .map((v) =>
        opts.showNumbers && v.number ? `${v.number} ${v.text}` : v.text,
      )
      .join(" ");
    groups.push(...chunk(text, SLIDE_LIMIT));
  }

  const closing = opts.closing?.trim();
  if (closing) groups.push(closing);
  return groups.length ? groups : [""];
}

/** Builds a library item so a reading is saved, reordered, and re-run like any other. */
export function buildReading(
  reference: string,
  raw: string,
  opts: ReadingOptions,
  attribution?: string,
): LibraryItem {
  const now = Date.now();
  const sectionId = uid();
  return {
    id: uid(),
    kind: "scripture",
    title: reference.trim() || "Bacaan",
    attribution: attribution?.trim() || undefined,
    collection: "Bacaan",
    sections: [
      {
        id: sectionId,
        kind: "other",
        number: 1,
        slides: toSlides(parseVerses(raw), opts),
      },
    ],
    order: [sectionId],
    tags: ["bacaan"],
    createdAt: now,
    updatedAt: now,
  };
}
