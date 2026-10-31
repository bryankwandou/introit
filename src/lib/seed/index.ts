import { db, uid } from "../db";
import { textToSlides } from "../slides";
import type { ItemKind, LibraryItem, Setlist, Theme } from "../types";
import { DEVOTION_SEED, LATIN_HYMN_SEED } from "./devotions";
import { HYMN_SEED, LITURGY_SEED, type SeedEntry } from "./liturgy";
import { MASS_RESPONSES_SEED } from "./responses";

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

/**
 * Library content ships in numbered bundles. A fresh install takes all of them; an
 * install that already has a library only takes bundles newer than the last one it
 * recorded. That way a parish on an old copy still receives new prayers, while
 * anything it edited or deliberately deleted from an earlier bundle stays as it left it.
 */
const BUNDLES: { version: number; items: () => LibraryItem[] }[] = [
  {
    version: 1,
    items: () => [
      ...LITURGY_SEED.map((e) => toItem(e, "liturgy")),
      ...DEVOTION_SEED.map((e) => toItem(e, "liturgy")),
      ...HYMN_SEED.map((e) => toItem(e, "song")),
      ...LATIN_HYMN_SEED.map((e) => toItem(e, "song")),
    ],
  },
  { version: 2, items: () => MASS_RESPONSES_SEED.map((e) => toItem(e, "liturgy")) },
];

export const SEED_VERSION = BUNDLES[BUNDLES.length - 1].version;
const SEED_KEY = "seedVersion";

/** The Sunday rundown a new install opens on: the Ordinary with the people's parts between. */
const STARTER_ORDER = [
  "Tanda Salib dan Salam",
  "Pernyataan Tobat — Saya Mengaku",
  "Tuhan Kasihanilah Kami",
  "Kemuliaan",
  "Jawaban Sesudah Bacaan",
  "Bait Pengantar Injil",
  "Pewartaan Injil — Pembuka dan Penutup",
  "Syahadat Para Rasul",
  "Doa Umat — Jawaban",
  "Ajakan Berdoa atas Persembahan",
  "Dialog Prefasi",
  "Kudus",
  "Aklamasi Anamnesis",
  "Doksologi Penutup Doa Syukur Agung",
  "Bapa Kami",
  "Salam Damai",
  "Anak Domba Allah",
  "Ajakan Komuni — Saya Tidak Pantas",
  "Berkat dan Pengutusan",
];

/**
 * Brings the library up to SEED_VERSION. Safe to call on every start: it runs inside
 * one transaction, so two tabs opening at once cannot both add the same bundle.
 * Returns how many items it added.
 */
export async function ensureSeed(): Promise<number> {
  return db.transaction("rw", [db.items, db.themes, db.setlists, db.meta], async () => {
    const recorded = (await db.meta.get(SEED_KEY))?.value;
    const hasLibrary = (await db.items.count()) > 0;

    // Installs from before bundles existed have a library but no record: they hold bundle 1.
    const current = recorded ?? (hasLibrary ? 1 : 0);
    if (current >= SEED_VERSION) return 0;

    const fresh = BUNDLES.filter((b) => b.version > current).flatMap((b) => b.items());

    if (current === 0) {
      const themes = DEFAULT_THEMES.map((t) => ({ ...t, createdAt: Date.now() }));
      const byTitle = new Map(fresh.map((i) => [i.title, i.id]));
      const setlist: Setlist = {
        id: uid(),
        name: "Misa Hari Minggu",
        date: new Date().toISOString().slice(0, 10),
        entries: STARTER_ORDER.filter((t) => byTitle.has(t)).map((t) => ({
          id: uid(),
          itemId: byTitle.get(t)!,
        })),
        themeId: DEFAULT_THEME_ID,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await db.themes.bulkPut(themes);
      await db.items.bulkPut(fresh);
      await db.setlists.put(setlist);
      await db.meta.put({ key: SEED_KEY, value: SEED_VERSION });
      return fresh.length;
    }

    // An upgrade: never duplicate a title the parish already has, whoever wrote it.
    const taken = new Set((await db.items.toArray()).map((i) => i.title));
    const added = fresh.filter((i) => !taken.has(i.title));
    await db.items.bulkPut(added);
    await db.meta.put({ key: SEED_KEY, value: SEED_VERSION });
    return added.length;
  });
}
