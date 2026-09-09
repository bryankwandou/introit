"use client";

import { useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Download,
  FilePlus2,
  ListPlus,
  Music4,
  Pencil,
  Scroll,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { db, uid } from "@/lib/db";
import { importSongFiles } from "@/lib/io";
import { useItems } from "@/lib/hooks";
import { usePresenter } from "@/lib/store";
import type { ItemKind, LibraryItem } from "@/lib/types";
import { Button, Empty, Input, PaneTitle, cn } from "@/components/ui";

const KIND_META: Record<ItemKind, { label: string; icon: typeof Music4 }> = {
  song: { label: "Lagu", icon: Music4 },
  liturgy: { label: "Liturgi", icon: Scroll },
  scripture: { label: "Kitab Suci", icon: BookOpen },
  announcement: { label: "Warta", icon: FilePlus2 },
};

const FILTERS: (ItemKind | "all")[] = [
  "all",
  "song",
  "liturgy",
  "scripture",
  "announcement",
];

export function LibraryPane({
  onAddToSetlist,
}: {
  onAddToSetlist: (item: LibraryItem) => void;
}) {
  const items = useItems();
  const { search, setSearch, activeItemId, openItem, setEditing } = usePresenter();
  const [filter, setFilter] = useState<ItemKind | "all">("all");
  const fileRef = useRef<HTMLInputElement>(null);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (items ?? []).filter((item) => {
      if (filter !== "all" && item.kind !== filter) return false;
      if (!q) return true;
      // Volunteers search by a half-remembered line as often as by title, so the
      // body text is part of the haystack.
      const body = item.sections
        .flatMap((s) => s.slides)
        .join(" ")
        .toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        (item.attribution ?? "").toLowerCase().includes(q) ||
        (item.collection ?? "").toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q)) ||
        body.includes(q)
      );
    });
  }, [items, search, filter]);

  const remove = async (item: LibraryItem) => {
    if (!confirm(`Hapus "${item.title}" dari pustaka?`)) return;
    await db.items.delete(item.id);
  };

  return (
    <div className="flex h-full flex-col">
      <PaneTitle
        right={
          <div className="flex items-center gap-1">
            <input
              ref={fileRef}
              type="file"
              accept=".xml,.txt"
              multiple
              hidden
              onChange={async (e) => {
                if (e.target.files?.length) {
                  const n = await importSongFiles(e.target.files);
                  alert(`${n} berkas dimuat ke pustaka.`);
                  e.target.value = "";
                }
              }}
            />
            <Button
              variant="ghost"
              className="px-2 py-1.5"
              title="Impor OpenLyrics atau teks"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="size-4" />
            </Button>
            <Button
              variant="ghost"
              className="px-2 py-1.5"
              title="Butir baru"
              onClick={() => setEditing("new")}
            >
              <FilePlus2 className="size-4" />
            </Button>
          </div>
        }
      >
        Pustaka
      </PaneTitle>

      <div className="space-y-2 border-b border-line p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
          <Input
            id="library-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul, penulis, atau baris lirik"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "cursor-pointer rounded-md px-2 py-1 font-mono text-[10px] tracking-wider uppercase transition-colors",
                filter === f
                  ? "bg-gold/15 text-gold"
                  : "text-muted hover:bg-raised hover:text-fg",
              )}
            >
              {f === "all" ? "Semua" : KIND_META[f].label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {visible.length === 0 ? (
          <Empty
            title="Belum ada yang cocok"
            body="Ubah kata kunci, atau impor berkas OpenLyrics dari perangkat lunak lama paroki."
          />
        ) : (
          <ul className="space-y-0.5">
            {visible.map((item) => {
              const Icon = KIND_META[item.kind].icon;
              const slideCount = item.sections.reduce(
                (n, s) => n + s.slides.length,
                0,
              );
              return (
                <li key={item.id}>
                  <div
                    onClick={() => openItem(item.id)}
                    onDoubleClick={() => onAddToSetlist(item)}
                    className={cn(
                      "group flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors",
                      activeItemId === item.id
                        ? "bg-raised"
                        : "hover:bg-raised/60",
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-4 shrink-0",
                        activeItemId === item.id ? "text-gold" : "text-muted",
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-fg">{item.title}</p>
                      <p className="truncate font-mono text-[10px] text-muted">
                        {[item.collection, item.attribution]
                          .filter(Boolean)
                          .join(" · ") || `${slideCount} salindia`}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                      <button
                        title="Tambahkan ke tata ibadat"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToSetlist(item);
                        }}
                        className="cursor-pointer rounded p-1.5 text-muted hover:text-gold"
                      >
                        <ListPlus className="size-3.5" />
                      </button>
                      <button
                        title="Sunting"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditing(item.id);
                        }}
                        className="cursor-pointer rounded p-1.5 text-muted hover:text-fg"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        title="Hapus"
                        onClick={(e) => {
                          e.stopPropagation();
                          void remove(item);
                        }}
                        className="cursor-pointer rounded p-1.5 text-muted hover:text-live"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="flex shrink-0 items-center justify-between border-t border-line px-3 py-2 font-mono text-[10px] text-muted">
        <span>{visible.length} butir</span>
        <span className="flex items-center gap-1.5">
          <Download className="size-3" />
          tersimpan di perangkat ini
        </span>
      </div>
    </div>
  );
}

/** A blank item, used by the “new” state of the editor. */
export function blankItem(): LibraryItem {
  const now = Date.now();
  const sectionId = uid();
  return {
    id: uid(),
    kind: "song",
    title: "",
    sections: [{ id: sectionId, kind: "verse", number: 1, slides: [""] }],
    order: [sectionId],
    tags: [],
    createdAt: now,
    updatedAt: now,
  };
}
