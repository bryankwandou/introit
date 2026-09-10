"use client";

import { useMemo, useState } from "react";
import { BookOpen, CornerDownRight, Plus } from "lucide-react";
import { db } from "@/lib/db";
import {
  DEFAULT_READING,
  buildReading,
  parseVerses,
  toSlides,
  type ReadingOptions,
} from "@/lib/scripture";
import { usePresenter } from "@/lib/store";
import type { LibraryItem } from "@/lib/types";
import { Button, Field, Input, PaneTitle, cn } from "@/components/ui";

const CLOSINGS = [
  "Demikianlah sabda Tuhan.",
  "Demikianlah Injil Tuhan.",
  "Berbahagialah orang yang mendengarkan sabda Tuhan.",
];

/**
 * Composing a reading from pasted text.
 *
 * The operator supplies the translation their parish is allowed to project; the pane
 * only decides where the slides break. Everything it produces is a normal library
 * item, so it can be reordered, re-themed, and run next Sunday without retyping.
 */
export function ReadingPane({
  onAddToSetlist,
}: {
  onAddToSetlist: (item: LibraryItem) => Promise<void> | void;
}) {
  const { openItem, setTab } = usePresenter();
  const [reference, setReference] = useState("");
  const [source, setSource] = useState("");
  const [raw, setRaw] = useState("");
  const [opts, setOpts] = useState<ReadingOptions>(DEFAULT_READING);

  const verses = useMemo(() => parseVerses(raw), [raw]);
  const preview = useMemo(
    () => (verses.length ? toSlides(verses, opts) : []),
    [verses, opts],
  );

  const save = async (thenAdd: boolean) => {
    if (!preview.length) return;
    const item = buildReading(reference, raw, opts, source);
    await db.items.put(item);
    openItem(item.id);
    if (thenAdd) await onAddToSetlist(item);
    else setTab("library");
    setRaw("");
    setReference("");
  };

  return (
    <div className="flex h-full flex-col">
      <PaneTitle>Bacaan</PaneTitle>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
        <Field label="Petikan">
          <Input
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Yohanes 3:16-21"
          />
        </Field>

        <Field label="Terjemahan" hint="Dicatat sebagai atribusi, tidak ditayangkan.">
          <Input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Terjemahan Baru, LAI"
          />
        </Field>

        <Field
          label="Teks bacaan"
          hint="Tempel dari lembar bacaan. Nomor ayat dikenali sendiri, baik yang menjorok di awal baris maupun yang menyatu di dalam paragraf."
        >
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={9}
            placeholder={"16 Karena begitu besar kasih Allah akan dunia ini…\n17 Sebab Allah mengutus Anak-Nya…"}
            className="w-full resize-y rounded-lg border border-line bg-ink px-3 py-2 text-sm leading-relaxed text-fg outline-none placeholder:text-muted/60 focus:border-gold"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Ayat per salindia">
            <div className="flex gap-1">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  onClick={() => setOpts({ ...opts, perSlide: n })}
                  className={cn(
                    "flex-1 cursor-pointer rounded-lg border py-1.5 font-mono text-xs transition-colors",
                    opts.perSlide === n
                      ? "border-gold text-gold"
                      : "border-line text-muted hover:text-fg",
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Nomor ayat">
            <button
              onClick={() => setOpts({ ...opts, showNumbers: !opts.showNumbers })}
              className={cn(
                "w-full cursor-pointer rounded-lg border py-1.5 font-mono text-xs transition-colors",
                opts.showNumbers
                  ? "border-gold text-gold"
                  : "border-line text-muted hover:text-fg",
              )}
            >
              {opts.showNumbers ? "ditampilkan" : "disembunyikan"}
            </button>
          </Field>
        </div>

        <Field label="Penutup" hint="Menjadi salindia terakhir.">
          <div className="space-y-1">
            <Input
              value={opts.closing ?? ""}
              onChange={(e) => setOpts({ ...opts, closing: e.target.value })}
              placeholder="kosongkan bila tidak perlu"
            />
            <div className="flex flex-wrap gap-1">
              {CLOSINGS.map((c) => (
                <button
                  key={c}
                  onClick={() => setOpts({ ...opts, closing: c })}
                  className="cursor-pointer rounded border border-line px-1.5 py-0.5 text-[10px] text-muted transition-colors hover:border-muted hover:text-fg"
                >
                  {c.split(" ").slice(0, 2).join(" ")}…
                </button>
              ))}
            </div>
          </div>
        </Field>

        {preview.length > 0 && (
          <section className="space-y-1.5">
            <h3 className="font-mono text-[10px] tracking-[0.18em] text-gold uppercase">
              {preview.length} salindia
            </h3>
            {preview.map((text, i) => (
              <p
                key={i}
                className="rounded-lg border border-line bg-ink px-2.5 py-2 text-xs leading-relaxed text-fg/80"
              >
                <span className="mr-2 font-mono text-[10px] text-muted">
                  {i + 1}
                </span>
                {text}
              </p>
            ))}
          </section>
        )}
      </div>

      <div className="flex shrink-0 gap-1.5 border-t border-line p-2">
        <Button
          variant="ghost"
          className="flex-1"
          disabled={!preview.length}
          onClick={() => void save(false)}
        >
          <BookOpen className="size-3.5" />
          Simpan
        </Button>
        <Button
          variant="solid"
          className="flex-1"
          disabled={!preview.length}
          onClick={() => void save(true)}
        >
          <Plus className="size-3.5" />
          Ke ibadat
        </Button>
      </div>

      <p className="flex shrink-0 items-start gap-1.5 border-t border-line px-3 py-2 font-mono text-[10px] leading-relaxed text-muted">
        <CornerDownRight className="mt-0.5 size-3 shrink-0" />
        Introit tidak membawa teks Alkitab. Tempel terjemahan yang boleh dipakai
        parokinya, lalu simpan sekali untuk dipakai lagi.
      </p>
    </div>
  );
}
