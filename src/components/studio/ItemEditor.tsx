"use client";

import { useState } from "react";
import { Download, Plus, Trash2, X } from "lucide-react";
import { db, uid } from "@/lib/db";
import { download, toOpenLyrics } from "@/lib/io";
import { useItem } from "@/lib/hooks";
import { sectionTag, slidesToText, textToSlides } from "@/lib/slides";
import { usePresenter } from "@/lib/store";
import {
  SECTION_LABEL,
  type ItemKind,
  type LibraryItem,
  type Section,
  type SectionKind,
} from "@/lib/types";
import { Button, Field, Input, cn } from "@/components/ui";
import { blankItem } from "./LibraryPane";

const KINDS: ItemKind[] = ["song", "liturgy", "scripture", "announcement"];
const KIND_LABEL: Record<ItemKind, string> = {
  song: "Lagu",
  liturgy: "Liturgi",
  scripture: "Kitab Suci",
  announcement: "Warta",
};
const SECTION_KINDS: SectionKind[] = [
  "verse",
  "chorus",
  "prechorus",
  "bridge",
  "intro",
  "ending",
  "other",
];

export function ItemEditor() {
  const { editing, setEditing, openItem } = usePresenter();
  const stored = useItem(editing === "new" ? undefined : editing);
  const [draft, setDraft] = useState<LibraryItem | null>(null);
  const [loadedFor, setLoadedFor] = useState<string | undefined>(undefined);

  // Seeding the draft while rendering, rather than after it, means the drawer never
  // paints one frame of the previous song before the right one lands.
  if (loadedFor !== editing) {
    setLoadedFor(editing);
    setDraft(editing === "new" ? blankItem() : null);
  } else if (editing && editing !== "new" && !draft && stored) {
    setDraft(structuredClone(stored));
  }

  if (!editing || !draft) return null;

  const patch = (p: Partial<LibraryItem>) =>
    setDraft((d) => (d ? { ...d, ...p } : d));

  const patchSection = (id: string, p: Partial<Section>) =>
    setDraft((d) =>
      d
        ? {
            ...d,
            sections: d.sections.map((s) => (s.id === id ? { ...s, ...p } : s)),
          }
        : d,
    );

  const addSection = () => {
    const kind: SectionKind = "verse";
    const number =
      draft.sections.filter((s) => s.kind === kind).length + 1;
    const section: Section = { id: uid(), kind, number, slides: [""] };
    patch({
      sections: [...draft.sections, section],
      order: [...draft.order, section.id],
    });
  };

  const removeSection = (id: string) =>
    patch({
      sections: draft.sections.filter((s) => s.id !== id),
      order: draft.order.filter((o) => o !== id),
    });

  const save = async () => {
    if (!draft.title.trim()) {
      alert("Beri judul dulu supaya butir ini bisa ditemukan lagi.");
      return;
    }
    const clean: LibraryItem = {
      ...draft,
      title: draft.title.trim(),
      sections: draft.sections.map((s) => ({
        ...s,
        slides: s.slides.length ? s.slides : [""],
      })),
      order: draft.order.length
        ? draft.order
        : draft.sections.map((s) => s.id),
      updatedAt: Date.now(),
    };
    await db.items.put(clean);
    openItem(clean.id);
    setEditing(undefined);
  };

  const orderText = draft.order
    .map((id) => {
      const s = draft.sections.find((x) => x.id === id);
      return s ? sectionTag(s) : "";
    })
    .filter(Boolean)
    .join(" ");

  /** The operator types "V1 C1 V2 C1"; unknown tags are dropped rather than erroring. */
  const applyOrder = (raw: string) => {
    const byTag = new Map(draft.sections.map((s) => [sectionTag(s), s.id]));
    const next = raw
      .toUpperCase()
      .split(/[\s,]+/)
      .map((t) => byTag.get(t))
      .filter((v): v is string => Boolean(v));
    patch({ order: next });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={() => setEditing(undefined)}
        aria-hidden
      />
      <div className="relative flex h-full w-full max-w-2xl flex-col border-l border-line bg-panel shadow-2xl">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-line px-4">
          <h2 className="font-display text-lg">
            {editing === "new" ? "Butir baru" : "Sunting butir"}
          </h2>
          <div className="flex items-center gap-2">
            {draft.kind === "song" && (
              <Button
                variant="ghost"
                title="Ekspor OpenLyrics"
                onClick={() =>
                  download(
                    new Blob([toOpenLyrics(draft)], { type: "application/xml" }),
                    `${draft.title || "lagu"}.xml`,
                  )
                }
              >
                <Download className="size-4" />
              </Button>
            )}
            <Button variant="solid" onClick={save}>
              Simpan
            </Button>
            <Button variant="ghost" onClick={() => setEditing(undefined)}>
              <X className="size-4" />
            </Button>
          </div>
        </header>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
          <div className="flex flex-wrap gap-1.5">
            {KINDS.map((k) => (
              <button
                key={k}
                onClick={() => patch({ kind: k })}
                className={cn(
                  "cursor-pointer rounded-md px-2.5 py-1.5 font-mono text-[10px] tracking-wider uppercase transition-colors",
                  draft.kind === k
                    ? "bg-gold/15 text-gold"
                    : "text-muted hover:bg-raised hover:text-fg",
                )}
              >
                {KIND_LABEL[k]}
              </button>
            ))}
          </div>

          <Field label="Judul">
            <Input
              autoFocus
              value={draft.title}
              onChange={(e) => patch({ title: e.target.value })}
              placeholder="Misal: Syukur Kepada-Mu Tuhan"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Penulis / sumber">
              <Input
                value={draft.attribution ?? ""}
                onChange={(e) => patch({ attribution: e.target.value })}
                placeholder="Pujian Rohani no. 12"
              />
            </Field>
            <Field label="Koleksi">
              <Input
                value={draft.collection ?? ""}
                onChange={(e) => patch({ collection: e.target.value })}
                placeholder="Adven"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Label" hint="Pisahkan dengan koma.">
              <Input
                value={draft.tags.join(", ")}
                onChange={(e) =>
                  patch({
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="pembuka, komuni"
              />
            </Field>
            <Field label="Hak cipta / CCLI">
              <Input
                value={draft.copyright ?? ""}
                onChange={(e) => patch({ copyright: e.target.value })}
                placeholder="Domain publik"
              />
            </Field>
          </div>

          <Field
            label="Urutan tayang"
            hint="Bagian boleh diulang, misalnya V1 C1 V2 C1."
          >
            <Input
              value={orderText}
              onChange={(e) => applyOrder(e.target.value)}
              className="font-mono"
            />
          </Field>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] tracking-wider text-muted uppercase">
                Bagian
              </span>
              <Button variant="outline" className="py-1.5" onClick={addSection}>
                <Plus className="size-3.5" /> Tambah
              </Button>
            </div>

            {draft.sections.map((s) => (
              <div
                key={s.id}
                className="space-y-2 rounded-lg border border-line bg-ink/60 p-3"
              >
                <div className="flex items-center gap-2">
                  <select
                    value={s.kind}
                    onChange={(e) =>
                      patchSection(s.id, { kind: e.target.value as SectionKind })
                    }
                    className="cursor-pointer rounded-md border border-line bg-ink px-2 py-1.5 text-xs text-fg focus:border-gold focus:outline-none"
                  >
                    {SECTION_KINDS.map((k) => (
                      <option key={k} value={k}>
                        {SECTION_LABEL[k]}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    value={s.number}
                    onChange={(e) =>
                      patchSection(s.id, {
                        number: Math.max(1, Number(e.target.value) || 1),
                      })
                    }
                    className="w-16 rounded-md border border-line bg-ink px-2 py-1.5 text-xs text-fg focus:border-gold focus:outline-none"
                  />
                  <span className="font-mono text-[10px] text-gold">
                    {sectionTag(s)}
                  </span>
                  <span className="ml-auto font-mono text-[10px] text-muted">
                    {s.slides.length} salindia
                  </span>
                  <button
                    onClick={() => removeSection(s.id)}
                    className="cursor-pointer rounded p-1 text-muted hover:text-live"
                    title="Hapus bagian"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
                <textarea
                  value={slidesToText(s.slides)}
                  onChange={(e) =>
                    patchSection(s.id, { slides: textToSlides(e.target.value) })
                  }
                  rows={6}
                  spellCheck={false}
                  placeholder={"Baris pertama\nBaris kedua\n\nBaris pada salindia berikutnya"}
                  className="w-full resize-y rounded-md border border-line bg-ink px-3 py-2 font-mono text-sm leading-relaxed text-fg placeholder:text-muted/60 focus:border-gold focus:outline-none"
                />
              </div>
            ))}
            <p className="text-xs text-muted">
              Satu baris kosong memisahkan salindia. Aturan ini sama dengan yang
              dipakai OpenLP dan EasyWorship, jadi teks lama bisa ditempel apa
              adanya.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
