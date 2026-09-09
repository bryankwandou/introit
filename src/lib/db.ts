import Dexie, { type EntityTable } from "dexie";
import type { LibraryItem, MediaAsset, Setlist, Theme } from "./types";

/**
 * Everything lives in IndexedDB on the operator's machine. There is no server call
 * anywhere in the presentation path — a church with a dead uplink still runs a service.
 */
class IntroitDB extends Dexie {
  items!: EntityTable<LibraryItem, "id">;
  setlists!: EntityTable<Setlist, "id">;
  themes!: EntityTable<Theme, "id">;
  media!: EntityTable<MediaAsset, "id">;

  constructor() {
    super("introit");
    this.version(1).stores({
      items: "id, kind, title, collection, updatedAt, *tags",
      setlists: "id, name, date, updatedAt",
      themes: "id, name, createdAt",
      media: "id, name, mime, createdAt",
    });
  }
}

export const db = new IntroitDB();

export const uid = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 9)}`;
