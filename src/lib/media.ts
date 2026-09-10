"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useMemo } from "react";
import { db, uid } from "./db";
import type { MediaAsset } from "./types";

/** Anything larger than this makes IndexedDB writes stutter on the laptops parishes own. */
export const MEDIA_LIMIT = 60 * 1024 * 1024;

export const isVideo = (mime: string) => mime.startsWith("video/");

/** Reads intrinsic size so the library can warn about a portrait file on a wide screen. */
function measure(file: File): Promise<{ width?: number; height?: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const done = (size: { width?: number; height?: number }) => {
      URL.revokeObjectURL(url);
      resolve(size);
    };

    if (isVideo(file.type)) {
      const v = document.createElement("video");
      v.preload = "metadata";
      v.onloadedmetadata = () =>
        done({ width: v.videoWidth, height: v.videoHeight });
      v.onerror = () => done({});
      v.src = url;
      return;
    }

    const img = new Image();
    img.onload = () => done({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => done({});
    img.src = url;
  });
}

export async function addMedia(files: FileList | File[]): Promise<number> {
  const assets: MediaAsset[] = [];

  for (const file of Array.from(files)) {
    if (!/^(image|video)\//.test(file.type)) continue;
    if (file.size > MEDIA_LIMIT) {
      alert(
        `"${file.name}" berukuran ${(file.size / 1024 / 1024).toFixed(0)} MB, di atas batas 60 MB. Perkecil dulu supaya proyektor tidak tersendat.`,
      );
      continue;
    }
    const { width, height } = await measure(file);
    assets.push({
      id: uid(),
      name: file.name.replace(/\.[^.]+$/, ""),
      mime: file.type,
      blob: file,
      width,
      height,
      createdAt: Date.now(),
    });
  }

  if (assets.length) await db.media.bulkPut(assets);
  return assets.length;
}

export async function removeMedia(id: string) {
  // A theme still pointing at a deleted file would paint nothing with no explanation,
  // so the reference is cleared in the same breath.
  const themes = await db.themes.where("id").notEqual("").toArray();
  const orphaned = themes.filter((t) => t.backgroundMediaId === id);
  await db.transaction("rw", db.media, db.themes, async () => {
    await db.media.delete(id);
    if (orphaned.length) {
      await db.themes.bulkPut(
        orphaned.map((t) => ({ ...t, backgroundMediaId: undefined })),
      );
    }
  });
}

export const useMedia = (): MediaAsset[] | undefined =>
  useLiveQuery(() => db.media.orderBy("createdAt").reverse().toArray(), []);

/**
 * Turns a stored blob into an object URL and takes it back when the id changes.
 *
 * Every surface that paints a background calls this independently — including the
 * output window, which reads the same IndexedDB rather than waiting for the operator
 * to ship bytes over BroadcastChannel.
 */
export function useMediaUrl(id?: string): { url?: string; mime?: string } {
  const asset = useLiveQuery<MediaAsset | undefined>(
    async () => (id ? await db.media.get(id) : undefined),
    [id],
  );
  const blob = asset?.blob;

  // Minting the URL while rendering keeps it in step with the blob: no first paint
  // with a stale background, and no state update fired from inside an effect.
  const url = useMemo(
    () => (blob ? URL.createObjectURL(blob) : undefined),
    [blob],
  );

  useEffect(() => {
    if (!url) return;
    return () => URL.revokeObjectURL(url);
  }, [url]);

  return { url, mime: asset?.mime };
}
