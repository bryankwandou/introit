"use client";

import { useState } from "react";
import {
  CalendarDays,
  GripVertical,
  MessageSquare,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { db, uid } from "@/lib/db";
import { useItems, useSetlist, useSetlists } from "@/lib/hooks";
import { usePresenter } from "@/lib/store";
import type { Setlist } from "@/lib/types";
import { Button, Empty, Input, PaneTitle, cn } from "@/components/ui";

export function SetlistPane() {
  const setlists = useSetlists();
  const { activeSetlistId, openSetlist, activeItemId, openItem, liveItemId } =
    usePresenter();
  const current = useSetlist(activeSetlistId ?? setlists?.[0]?.id);
  const items = useItems();
  const [dragging, setDragging] = useState<number | null>(null);
  const [noteFor, setNoteFor] = useState<string | null>(null);

  const byId = new Map((items ?? []).map((i) => [i.id, i]));

  const persist = async (next: Setlist) => {
    await db.setlists.put({ ...next, updatedAt: Date.now() });
  };

  const createSetlist = async () => {
    const name = prompt("Nama tata ibadat", "Misa Hari Minggu");
    if (!name) return;
    const list: Setlist = {
      id: uid(),
      name,
      date: new Date().toISOString().slice(0, 10),
      entries: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await db.setlists.put(list);
    openSetlist(list.id);
  };

  const removeEntry = async (entryId: string) => {
    if (!current) return;
    await persist({
      ...current,
      entries: current.entries.filter((e) => e.id !== entryId),
    });
  };

  const move = async (from: number, to: number) => {
    if (!current || from === to) return;
    const entries = [...current.entries];
    const [moved] = entries.splice(from, 1);
    entries.splice(to, 0, moved);
    await persist({ ...current, entries });
  };

  const setNote = async (entryId: string, note: string) => {
    if (!current) return;
    await persist({
      ...current,
      entries: current.entries.map((e) =>
        e.id === entryId ? { ...e, note: note || undefined } : e,
      ),
    });
  };

  return (
    <div className="flex h-full flex-col">
      <PaneTitle
        right={
          <Button
            variant="ghost"
            className="px-2 py-1.5"
            title="Tata ibadat baru"
            onClick={createSetlist}
          >
            <Plus className="size-4" />
          </Button>
        }
      >
        Tata Ibadat
      </PaneTitle>

      <div className="space-y-2 border-b border-line p-3">
        <select
          value={current?.id ?? ""}
          onChange={(e) => openSetlist(e.target.value)}
          className="w-full cursor-pointer rounded-lg border border-line bg-ink px-3 py-2 text-sm text-fg focus:border-gold focus:outline-none"
        >
          {(setlists ?? []).map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        {current && (
          <div className="flex items-center gap-2">
            <CalendarDays className="size-3.5 shrink-0 text-muted" />
            <Input
              type="date"
              value={current.date ?? ""}
              onChange={(e) => void persist({ ...current, date: e.target.value })}
              className="py-1.5 font-mono text-xs"
            />
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {!current || current.entries.length === 0 ? (
          <Empty
            title="Tata ibadat masih kosong"
            body="Klik ganda sebuah butir di Pustaka untuk memasukkannya ke urutan ini."
          />
        ) : (
          <ol className="space-y-0.5">
            {current.entries.map((entry, index) => {
              const item = byId.get(entry.itemId);
              if (!item) return null;
              const isLive = liveItemId === item.id;
              return (
                <li
                  key={entry.id}
                  draggable
                  onDragStart={() => setDragging(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (dragging !== null) void move(dragging, index);
                    setDragging(null);
                  }}
                  onDragEnd={() => setDragging(null)}
                  className={cn(
                    "group rounded-lg transition-colors",
                    dragging === index && "opacity-40",
                  )}
                >
                  <div
                    onClick={() => openItem(item.id)}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2",
                      activeItemId === item.id
                        ? "bg-raised"
                        : "hover:bg-raised/60",
                    )}
                  >
                    <GripVertical className="size-3.5 shrink-0 cursor-grab text-line group-hover:text-muted" />
                    <span
                      className={cn(
                        "w-5 shrink-0 text-right font-mono text-[10px]",
                        isLive ? "text-live" : "text-muted",
                      )}
                    >
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-fg">{item.title}</p>
                      {entry.note && (
                        <p className="truncate font-mono text-[10px] text-gold/80">
                          {entry.note}
                        </p>
                      )}
                    </div>
                    {isLive && (
                      <span className="size-1.5 shrink-0 rounded-full bg-live" />
                    )}
                    <div className="flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        title="Catatan operator"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNoteFor(noteFor === entry.id ? null : entry.id);
                        }}
                        className="cursor-pointer rounded p-1.5 text-muted hover:text-gold"
                      >
                        <MessageSquare className="size-3.5" />
                      </button>
                      <button
                        title="Keluarkan dari tata ibadat"
                        onClick={(e) => {
                          e.stopPropagation();
                          void removeEntry(entry.id);
                        }}
                        className="cursor-pointer rounded p-1.5 text-muted hover:text-live"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  {noteFor === entry.id && (
                    <div className="px-2 pb-2 pl-11">
                      <Input
                        autoFocus
                        defaultValue={entry.note ?? ""}
                        placeholder="Catatan yang hanya dilihat operator"
                        onBlur={(e) => {
                          void setNote(entry.id, e.target.value.trim());
                          setNoteFor(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") e.currentTarget.blur();
                          if (e.key === "Escape") setNoteFor(null);
                        }}
                        className="py-1.5 text-xs"
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {current && current.entries.length > 0 && (
        <div className="flex shrink-0 items-center justify-between border-t border-line px-3 py-2 font-mono text-[10px] text-muted">
          <span>{current.entries.length} butir</span>
          <button
            onClick={() => {
              if (confirm("Kosongkan urutan tata ibadat ini?"))
                void persist({ ...current, entries: [] });
            }}
            className="flex cursor-pointer items-center gap-1 hover:text-live"
          >
            <Trash2 className="size-3" /> kosongkan
          </button>
        </div>
      )}
    </div>
  );
}
