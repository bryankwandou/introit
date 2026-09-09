import { SECTION_ABBREV, type LibraryItem, type Section } from "./types";

export interface ResolvedSlide {
  /** Stable key: section id plus slide index. */
  key: string;
  sectionId: string;
  /** "V1", "C2" — what the operator scans for. */
  tag: string;
  text: string;
  /** Index of this slide inside its section, for "2/4" affordances. */
  indexInSection: number;
  sectionSlideCount: number;
}

export const sectionTag = (s: Section) =>
  `${SECTION_ABBREV[s.kind]}${s.number}`;

/**
 * Flattens an item into the linear list the operator actually arrows through.
 * `order` may repeat a section (V1 C1 V2 C1), so slides are emitted per occurrence
 * and keys are suffixed with the occurrence index to stay unique.
 */
export function resolveSlides(item: LibraryItem): ResolvedSlide[] {
  const byId = new Map(item.sections.map((s) => [s.id, s]));
  const order = item.order.length
    ? item.order
    : item.sections.map((s) => s.id);

  const out: ResolvedSlide[] = [];
  order.forEach((sectionId, occurrence) => {
    const section = byId.get(sectionId);
    if (!section) return;
    section.slides.forEach((text, i) => {
      out.push({
        key: `${sectionId}:${occurrence}:${i}`,
        sectionId,
        tag: sectionTag(section),
        text,
        indexInSection: i,
        sectionSlideCount: section.slides.length,
      });
    });
  });
  return out;
}

/**
 * Splits a pasted block of lyrics into slides on blank lines, which is the convention
 * every tool in this category uses and the one volunteers already have in their fingers.
 */
export function textToSlides(raw: string): string[] {
  const slides = raw
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean);
  return slides.length ? slides : [""];
}

export const slidesToText = (slides: string[]) => slides.join("\n\n");
