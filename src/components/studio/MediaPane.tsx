"use client";

import { useRef, useState } from "react";
import { Film, ImageIcon, Trash2, Upload } from "lucide-react";
import { db } from "@/lib/db";
import { addMedia, isVideo, removeMedia, useMedia, useMediaUrl } from "@/lib/media";
import { useThemes } from "@/lib/hooks";
import { usePresenter } from "@/lib/store";
import type { MediaAsset } from "@/lib/types";
import { Button, Empty, PaneTitle, cn } from "@/components/ui";

function Thumb({ asset }: { asset: MediaAsset }) {
  const { url } = useMediaUrl(asset.id);
  if (!url) return <div className="size-full bg-raised" />;
  if (isVideo(asset.mime)) {
    return (
      <video src={url} className="size-full object-cover" muted playsInline />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt="" className="size-full object-cover" />
  );
}

export function MediaPane() {
  const media = useMedia();
  const themes = useThemes();
  const { themeId } = usePresenter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const current = themes?.find((t) => t.id === themeId);

  /** Assigns the file to the theme that is live, which is what an operator means
   *  when they click a background mid-service. */
  const apply = async (id?: string) => {
    if (!current) return;
    await db.themes.put({ ...current, backgroundMediaId: id });
  };

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      await addMedia(files);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="flex h-full flex-col"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        void upload(e.dataTransfer.files);
      }}
    >
      <PaneTitle
        right={
          <Button
            variant="ghost"
            className="px-2 py-1.5"
            title="Muat gambar atau video"
            disabled={busy}
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="size-4" />
          </Button>
        }
      >
        Latar
      </PaneTitle>

      <input
        ref={fileRef}
        type="file"
        accept="image/*,video/*"
        multiple
        hidden
        onChange={(e) => {
          void upload(e.target.files);
          e.target.value = "";
        }}
      />

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {!media?.length ? (
          <Empty
            title="Belum ada berkas latar"
            body="Seret foto atau video ke panel ini. Berkas disimpan di perangkat, bukan diunggah ke mana pun."
          />
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => void apply(undefined)}
              className={cn(
                "group relative aspect-video overflow-hidden rounded-lg border transition-colors",
                current?.backgroundMediaId
                  ? "border-line hover:border-muted"
                  : "border-gold",
              )}
            >
              <span className="flex size-full items-center justify-center bg-ink font-mono text-[10px] text-muted">
                polos
              </span>
            </button>

            {media.map((asset) => {
              const active = current?.backgroundMediaId === asset.id;
              return (
                <div
                  key={asset.id}
                  className={cn(
                    "group relative aspect-video overflow-hidden rounded-lg border transition-colors",
                    active ? "border-gold" : "border-line hover:border-muted",
                  )}
                >
                  <button
                    onClick={() => void apply(asset.id)}
                    className="size-full cursor-pointer"
                    title={`${asset.name} · pasang ke tema ${current?.name ?? ""}`}
                  >
                    <Thumb asset={asset} />
                  </button>

                  <span className="pointer-events-none absolute top-1 left-1 rounded bg-black/70 p-1 text-white/80 backdrop-blur-sm">
                    {isVideo(asset.mime) ? (
                      <Film className="size-3" />
                    ) : (
                      <ImageIcon className="size-3" />
                    )}
                  </span>

                  <button
                    onClick={() => {
                      if (confirm(`Hapus "${asset.name}" dari perangkat?`))
                        void removeMedia(asset.id);
                    }}
                    title="Hapus berkas"
                    className="absolute top-1 right-1 cursor-pointer rounded bg-black/70 p-1 text-white/70 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:text-live"
                  >
                    <Trash2 className="size-3" />
                  </button>

                  <span className="pointer-events-none absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/80 to-transparent px-1.5 py-1 text-[10px] text-white/85">
                    {asset.name}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p className="shrink-0 border-t border-line px-3 py-2 font-mono text-[10px] leading-relaxed text-muted">
        dipasang ke tema {current?.name ?? "—"}
        <br />
        atur peredupnya di penyunting tema
      </p>
    </div>
  );
}
