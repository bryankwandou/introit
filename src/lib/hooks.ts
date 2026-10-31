"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import { db } from "./db";
import { ensureSeed } from "./seed";
import type { LibraryItem, Setlist, Theme } from "./types";

/** Populates a fresh install or tops up an old one, then reports when the studio may paint. */
export function useSeeded() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    ensureSeed()
      // A failed top-up must not keep the operator out of a service already under way.
      .catch((err) => console.warn("Introit: pustaka bawaan tidak bisa diperbarui", err))
      .finally(() => setReady(true));
  }, []);
  return ready;
}

export const useItems = (): LibraryItem[] | undefined =>
  useLiveQuery(() => db.items.orderBy("title").toArray(), []);

export const useSetlists = (): Setlist[] | undefined =>
  useLiveQuery(() => db.setlists.orderBy("updatedAt").reverse().toArray(), []);

export const useThemes = (): Theme[] | undefined =>
  useLiveQuery(() => db.themes.orderBy("createdAt").toArray(), []);

export const useItem = (id?: string): LibraryItem | undefined =>
  useLiveQuery(() => (id ? db.items.get(id) : undefined), [id]);

export const useSetlist = (id?: string): Setlist | undefined =>
  useLiveQuery(() => (id ? db.setlists.get(id) : undefined), [id]);
