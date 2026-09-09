"use client";

import { db, uid } from "./db";
import { slidesToText, textToSlides } from "./slides";
import {
  SECTION_ABBREV,
  type LibraryItem,
  type Section,
  type SectionKind,
  type Setlist,
  type Theme,
} from "./types";

/* ---------------------------------------------------------------- backups */

interface Backup {
  format: "introit-backup";
  version: 1;
  exportedAt: string;
  items: LibraryItem[];
  setlists: Setlist[];
  themes: Theme[];
}

export async function exportBackup(): Promise<Blob> {
  const [items, setlists, themes] = await Promise.all([
    db.items.toArray(),
    db.setlists.toArray(),
    db.themes.toArray(),
  ]);
  const backup: Backup = {
    format: "introit-backup",
    version: 1,
    exportedAt: new Date().toISOString(),
    items,
    setlists,
    themes,
  };
  return new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });
}

/**
 * Merges a backup into the current database rather than replacing it: a parish that
 * restores last year's file should not lose this year's songs.
 */
export async function importBackup(file: File): Promise<number> {
  const parsed = JSON.parse(await file.text()) as Partial<Backup>;
  if (parsed.format !== "introit-backup") {
    throw new Error("Berkas ini bukan cadangan Introit.");
  }
  const items = parsed.items ?? [];
  await db.transaction("rw", db.items, db.setlists, db.themes, async () => {
    if (parsed.themes?.length) await db.themes.bulkPut(parsed.themes);
    if (items.length) await db.items.bulkPut(items);
    if (parsed.setlists?.length) await db.setlists.bulkPut(parsed.setlists);
  });
  return items.length;
}

export function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ------------------------------------------------------------ openlyrics */

const KIND_BY_LETTER: Record<string, SectionKind> = {
  v: "verse",
  c: "chorus",
  b: "bridge",
  p: "prechorus",
  i: "intro",
  e: "ending",
  o: "other",
};

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Writes OpenLyrics 0.9, the format OpenLP and several others read. Slides inside a
 * section are separated by `<br/><br/>`, which round-trips back through the parser.
 */
export function toOpenLyrics(item: LibraryItem): string {
  const tagOf = (s: Section) =>
    `${SECTION_ABBREV[s.kind].toLowerCase()}${s.number}`;

  const verses = item.sections
    .map((s) => {
      const lines = s.slides
        .map((slide) =>
          slide
            .split("\n")
            .map((l) => `        <line>${esc(l)}</line>`)
            .join("\n"),
        )
        .join("\n        <line></line>\n");
      return `    <verse name="${tagOf(s)}">\n      <lines>\n${lines}\n      </lines>\n    </verse>`;
    })
    .join("\n");

  const order = item.order
    .map((id) => {
      const s = item.sections.find((x) => x.id === id);
      return s ? tagOf(s) : "";
    })
    .filter(Boolean)
    .join(" ");

  return `<?xml version="1.0" encoding="UTF-8"?>
<song xmlns="http://openlyrics.info/namespace/2009/song" version="0.9" createdIn="Introit" modifiedIn="Introit" modifiedDate="${new Date().toISOString()}">
  <properties>
    <titles><title>${esc(item.title)}</title></titles>${
      item.attribution
        ? `\n    <authors><author>${esc(item.attribution)}</author></authors>`
        : ""
    }${item.copyright ? `\n    <copyright>${esc(item.copyright)}</copyright>` : ""}${
      item.ccli ? `\n    <ccliNo>${esc(item.ccli)}</ccliNo>` : ""
    }${order ? `\n    <verseOrder>${order}</verseOrder>` : ""}
  </properties>
  <lyrics>
${verses}
  </lyrics>
</song>`;
}

export function parseOpenLyrics(xml: string): LibraryItem | null {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.querySelector("parsererror")) return null;

  const title = doc.querySelector("title")?.textContent?.trim();
  if (!title) return null;

  const counters: Partial<Record<SectionKind, number>> = {};
  const sections: Section[] = [];
  const byTag = new Map<string, string>();

  doc.querySelectorAll("verse").forEach((verse) => {
    const name = (verse.getAttribute("name") ?? "v1").toLowerCase();
    const kind = KIND_BY_LETTER[name[0]] ?? "other";
    const number = (counters[kind] = (counters[kind] ?? 0) + 1);

    // OpenLyrics puts every line in its own element; a blank line marks a slide break,
    // matching the convention used everywhere else in Introit.
    const lines = Array.from(verse.querySelectorAll("line")).map(
      (l) => l.textContent ?? "",
    );
    const slides = textToSlides(lines.join("\n"));

    const id = uid();
    byTag.set(name, id);
    sections.push({ id, kind, number, slides });
  });

  if (!sections.length) return null;

  const orderRaw = doc.querySelector("verseOrder")?.textContent?.trim();
  const order = orderRaw
    ? orderRaw
        .split(/\s+/)
        .map((t) => byTag.get(t.toLowerCase()))
        .filter((v): v is string => Boolean(v))
    : sections.map((s) => s.id);

  const now = Date.now();
  return {
    id: uid(),
    kind: "song",
    title,
    attribution: doc.querySelector("author")?.textContent?.trim() || undefined,
    copyright: doc.querySelector("copyright")?.textContent?.trim() || undefined,
    ccli: doc.querySelector("ccliNo")?.textContent?.trim() || undefined,
    sections,
    order,
    tags: [],
    createdAt: now,
    updatedAt: now,
  };
}

/** Accepts .xml (OpenLyrics) and .txt (title on line one, slides after). */
export async function importSongFiles(files: FileList): Promise<number> {
  const parsed: LibraryItem[] = [];

  for (const file of Array.from(files)) {
    const text = await file.text();
    if (/\.xml$/i.test(file.name)) {
      const item = parseOpenLyrics(text);
      if (item) parsed.push(item);
      continue;
    }
    const [first, ...rest] = text.replace(/\r\n/g, "\n").split("\n");
    const body = rest.join("\n").trim();
    if (!first?.trim()) continue;
    const sectionId = uid();
    const now = Date.now();
    parsed.push({
      id: uid(),
      kind: "song",
      title: first.trim(),
      sections: [
        { id: sectionId, kind: "verse", number: 1, slides: textToSlides(body) },
      ],
      order: [sectionId],
      tags: [],
      createdAt: now,
      updatedAt: now,
    });
  }

  if (parsed.length) await db.items.bulkPut(parsed);
  return parsed.length;
}

/** Plain text for printing an order of service or pasting into a bulletin. */
export function itemToPlainText(item: LibraryItem): string {
  return [
    item.title,
    item.attribution ?? "",
    "",
    item.sections.map((s) => slidesToText(s.slides)).join("\n\n"),
  ]
    .filter((p, i) => p !== "" || i === 2)
    .join("\n");
}
