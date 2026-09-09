import { db, uid } from "../db";
import { textToSlides } from "../slides";
import type { ItemKind, LibraryItem, Setlist, Theme } from "../types";
import { DEVOTION_SEED, LATIN_HYMN_SEED } from "./devotions";
import { HYMN_SEED, LITURGY_SEED, type SeedEntry } from "./liturgy";

export const DEFAULT_THEME_ID = "theme-ink";

export const DEFAULT_THEMES: Theme[] = [
  {
    id: DEFAULT_THEME_ID,
    name: "Ink",
    background: "#000000",
    backgroundScrim: 0,
    color: "#FFFFFF",
    fontFamily: "Inter",
    fontSize: 7.5,
    fontWeight: 600,
    lineHeight: 1.28,
    align: "center",
    verticalAlign: "middle",
    uppercase: false,
    shadow: 18,
    outline: 0,
    padding: 8,
    createdAt: 0,
  },
  {
    id: "theme-parchment",
    name: "Perkamen",
    background: "#F4EFE4",
    backgroundScrim: 0,
    color: "#1A1712",
    fontFamily: "Instrument Serif",
    fontSize: 8,
    fontWeight: 400,
    lineHeight: 1.24,
    align: "center",
    verticalAlign: "middle",
    uppercase: false,
    shadow: 0,
    outline: 0,
    padding: 9,
    createdAt: 0,
  },
  {
    id: "theme-vigil",
    name: "Vigili",
    background: "#0B1220",
    backgroundScrim: 0,
    color: "#F2E4C4",
    fontFamily: "Instrument Serif",
    fontSize: 8.5,
    fontWeight: 400,
    lineHeight: 1.22,
    align: "center",
    verticalAlign: "middle",
    uppercase: false,
    shadow: 24,
    outline: 0,
    padding: 8,
    createdAt: 0,
  },
  {
    id: "theme-lent",
    name: "Prapaskah",
    background: "#241A22",
    backgroundScrim: 0,
    color: "#E8DCE4",
    fontFamily: "Inter",
    fontSize: 7,
    fontWeight: 500,
    lineHeight: 1.32,
    align: "center",
    verticalAlign: "middle",
    uppercase: false,
    shadow: 14,
    outline: 0,
    padding: 10,
    createdAt: 0,
  },
  {
    id: "theme-lower-third",
    name: "Lower Third",
    background: "#00000000",
    backgroundScrim: 0,
    color: "#FFFFFF",
    fontFamily: "Inter",
    fontSize: 5.5,
    fontWeight: 700,
    lineHeight: 1.18,
    align: "center",
    verticalAlign: "bottom",
    uppercase: true,
    shadow: 26,
    outline: 2,
    padding: 6,
    createdAt: 0,
  },
];

function toItem(entry: SeedEntry, kind: ItemKind): LibraryItem {
  const now = Date.now();
  const slides = textToSlides(entry.body);
  // Liturgical texts have no verse/chorus structure worth modelling; one section
  // holding every slide keeps the outline honest instead of inventing fake verses.
  const sectionId = uid();
  return {
    id: uid(),
    kind,
    title: entry.title,
    attribution: entry.attribution,
    collection: entry.collection,
    sections: [{ id: sectionId, kind: "other", number: 1, slides }],
    order: [sectionId],
    tags: entry.tags,
    createdAt: now,
    updatedAt: now,
  };
}

/** Runs once on an empty database. Never overwrites what the parish has edited. */
export async function seedIfEmpty(): Promise<void> {
  const existing = await db.items.count();
  if (existing > 0) return;

  const themes = DEFAULT_THEMES.map((t) => ({ ...t, createdAt: Date.now() }));
  const items = [
    ...LITURGY_SEED.map((e) => toItem(e, "liturgy")),
    ...DEVOTION_SEED.map((e) => toItem(e, "liturgy")),
    ...HYMN_SEED.map((e) => toItem(e, "song")),
    ...LATIN_HYMN_SEED.map((e) => toItem(e, "song")),
  ];

  const pick = (title: string) => items.find((i) => i.title === title)!.id;
  const order = [
    "Tanda Salib dan Salam",
    "Pernyataan Tobat — Saya Mengaku",
    "Tuhan Kasihanilah Kami",
    "Kemuliaan",
    "Syahadat Para Rasul",
    "Kudus",
    "Bapa Kami",
    "Anak Domba Allah",
    "Berkat dan Pengutusan",
  ];

  const setlist: Setlist = {
    id: uid(),
    name: "Misa Hari Minggu",
    date: new Date().toISOString().slice(0, 10),
    entries: order.map((title) => ({ id: uid(), itemId: pick(title) })),
    themeId: DEFAULT_THEME_ID,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await db.transaction("rw", db.items, db.themes, db.setlists, async () => {
    await db.themes.bulkPut(themes);
    await db.items.bulkPut(items);
    await db.setlists.put(setlist);
  });
}
