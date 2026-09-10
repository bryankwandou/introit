"use client";

import { useState } from "react";
import { Copy, Trash2, X } from "lucide-react";
import { db, uid } from "@/lib/db";
import { useThemes } from "@/lib/hooks";
import { useMediaUrl } from "@/lib/media";
import { usePresenter } from "@/lib/store";
import type { TextAlign, Theme, VerticalAlign } from "@/lib/types";
import { SlideCanvas } from "@/components/SlideCanvas";
import { Button, Field, Input, cn } from "@/components/ui";

const FONTS = [
  "Inter",
  "Instrument Serif",
  "Georgia",
  "Arial",
  "Times New Roman",
  "Trebuchet MS",
  "Verdana",
];

const SAMPLE =
  "Kudus, kudus, kuduslah Tuhan\nAllah segala kuasa";

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (n: number) => void;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="flex items-center justify-between font-mono text-[11px] tracking-wider text-muted uppercase">
        {label}
        <span className="text-fg">
          {value}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--color-gold)]"
      />
    </label>
  );
}

export function ThemeEditor() {
  const { editingTheme, setEditingTheme, setTheme } = usePresenter();
  const themes = useThemes();
  const [draft, setDraft] = useState<Theme | null>(null);
  const [loadedFor, setLoadedFor] = useState<string | undefined>(undefined);
  const background = useMediaUrl(draft?.backgroundMediaId);

  // Same reasoning as the item drawer: the copy is taken while rendering, so the
  // sliders never show the previous theme's numbers for a frame.
  if (loadedFor !== editingTheme) {
    setLoadedFor(editingTheme);
    setDraft(null);
  } else if (editingTheme && !draft) {
    const found = themes?.find((t) => t.id === editingTheme);
    if (found) setDraft({ ...found });
  }

  if (!editingTheme || !draft) return null;

  const patch = (p: Partial<Theme>) => setDraft((d) => (d ? { ...d, ...p } : d));

  const save = async () => {
    await db.themes.put(draft);
    setTheme(draft.id);
    setEditingTheme(undefined);
  };

  const duplicate = async () => {
    const copy: Theme = {
      ...draft,
      id: uid(),
      name: `${draft.name} (salinan)`,
      createdAt: Date.now(),
    };
    await db.themes.put(copy);
    setEditingTheme(copy.id);
  };

  const remove = async () => {
    if ((themes?.length ?? 0) <= 1) {
      alert("Sisakan setidaknya satu tema.");
      return;
    }
    if (!confirm(`Hapus tema "${draft.name}"?`)) return;
    await db.themes.delete(draft.id);
    const fallback = themes?.find((t) => t.id !== draft.id);
    if (fallback) setTheme(fallback.id);
    setEditingTheme(undefined);
  };

  const align: TextAlign[] = ["left", "center", "right"];
  const vAlign: VerticalAlign[] = ["top", "middle", "bottom"];
  const ALIGN_LABEL: Record<string, string> = {
    left: "Kiri",
    center: "Tengah",
    right: "Kanan",
    top: "Atas",
    middle: "Tengah",
    bottom: "Bawah",
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={() => setEditingTheme(undefined)}
        aria-hidden
      />
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-line bg-panel shadow-2xl">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-line px-4">
          <h2 className="font-display text-lg">Tema</h2>
          <div className="flex items-center gap-1">
            <Button variant="ghost" onClick={duplicate} title="Gandakan">
              <Copy className="size-4" />
            </Button>
            <Button variant="danger" onClick={remove} title="Hapus">
              <Trash2 className="size-4" />
            </Button>
            <Button variant="solid" onClick={save}>
              Simpan
            </Button>
            <Button variant="ghost" onClick={() => setEditingTheme(undefined)}>
              <X className="size-4" />
            </Button>
          </div>
        </header>

        <div className="shrink-0 border-b border-line p-4">
          <div className="overflow-hidden rounded-lg border border-line">
            <SlideCanvas
              text={SAMPLE}
              theme={draft}
              backgroundUrl={background.url}
              backgroundMime={background.mime}
              playBackground
              className="aspect-video w-full"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
          <Field label="Nama">
            <Input
              value={draft.name}
              onChange={(e) => patch({ name: e.target.value })}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Warna teks">
              <input
                type="color"
                value={draft.color}
                onChange={(e) => patch({ color: e.target.value })}
                className="h-9 w-full cursor-pointer rounded-lg border border-line bg-ink"
              />
            </Field>
            <Field label="Latar">
              <input
                type="color"
                value={
                  draft.background.startsWith("#") &&
                  draft.background.length >= 7
                    ? draft.background.slice(0, 7)
                    : "#000000"
                }
                onChange={(e) => patch({ background: e.target.value })}
                className="h-9 w-full cursor-pointer rounded-lg border border-line bg-ink"
              />
            </Field>
          </div>

          <Field label="Huruf">
            <select
              value={draft.fontFamily}
              onChange={(e) => patch({ fontFamily: e.target.value })}
              className="w-full cursor-pointer rounded-lg border border-line bg-ink px-3 py-2 text-sm text-fg focus:border-gold focus:outline-none"
            >
              {FONTS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </Field>

          <Slider
            label="Ukuran huruf"
            value={draft.fontSize}
            min={3}
            max={16}
            step={0.5}
            suffix="%"
            onChange={(fontSize) => patch({ fontSize })}
          />
          <Slider
            label="Tebal"
            value={draft.fontWeight}
            min={300}
            max={800}
            step={100}
            onChange={(fontWeight) => patch({ fontWeight })}
          />
          <Slider
            label="Jarak baris"
            value={draft.lineHeight}
            min={1}
            max={2}
            step={0.02}
            onChange={(lineHeight) => patch({ lineHeight })}
          />
          <Slider
            label="Bayangan"
            value={draft.shadow}
            min={0}
            max={40}
            onChange={(shadow) => patch({ shadow })}
          />
          <Slider
            label="Garis tepi"
            value={draft.outline}
            min={0}
            max={6}
            onChange={(outline) => patch({ outline })}
          />
          <Slider
            label="Tepi aman"
            value={draft.padding}
            min={2}
            max={20}
            suffix="%"
            onChange={(padding) => patch({ padding })}
          />
          <Slider
            label="Peredup latar"
            value={draft.backgroundScrim}
            min={0}
            max={90}
            suffix="%"
            onChange={(backgroundScrim) => patch({ backgroundScrim })}
          />

          <Field label="Perataan mendatar">
            <div className="flex gap-1.5">
              {align.map((a) => (
                <button
                  key={a}
                  onClick={() => patch({ align: a })}
                  className={cn(
                    "flex-1 cursor-pointer rounded-md border px-2 py-1.5 text-xs transition-colors",
                    draft.align === a
                      ? "border-gold text-gold"
                      : "border-line text-muted hover:text-fg",
                  )}
                >
                  {ALIGN_LABEL[a]}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Perataan tegak">
            <div className="flex gap-1.5">
              {vAlign.map((a) => (
                <button
                  key={a}
                  onClick={() => patch({ verticalAlign: a })}
                  className={cn(
                    "flex-1 cursor-pointer rounded-md border px-2 py-1.5 text-xs transition-colors",
                    draft.verticalAlign === a
                      ? "border-gold text-gold"
                      : "border-line text-muted hover:text-fg",
                  )}
                >
                  {ALIGN_LABEL[a]}
                </button>
              ))}
            </div>
          </Field>

          <label className="flex cursor-pointer items-center justify-between rounded-lg border border-line px-3 py-2.5">
            <span className="text-sm text-fg">Huruf kapital semua</span>
            <input
              type="checkbox"
              checked={draft.uppercase}
              onChange={(e) => patch({ uppercase: e.target.checked })}
              className="size-4 accent-[var(--color-gold)]"
            />
          </label>

          <p className="text-xs text-muted">
            Ukuran dihitung sebagai persentase tinggi layar keluaran, sehingga
            tampilan di pratinjau ini sama persis dengan yang jatuh di layar
            gereja, berapa pun resolusi proyektornya.
          </p>
        </div>
      </div>
    </div>
  );
}
