"use client";

import { X } from "lucide-react";
import { Kbd } from "@/components/ui";
import { usePresenter } from "@/lib/store";

const GROUPS: { title: string; rows: [string, string[]][] }[] = [
  {
    title: "Menayangkan",
    rows: [
      ["Salindia berikutnya", ["Spasi", "→", "PgDn"]],
      ["Salindia sebelumnya", ["←", "PgUp"]],
      ["Tayangkan salindia terpilih", ["Enter"]],
      ["Pindah pilihan di kisi", ["↑", "↓"]],
      ["Salindia pertama butir ini", ["Home"]],
    ],
  },
  {
    title: "Layar",
    rows: [
      ["Gelapkan layar", ["B"]],
      ["Bersihkan teks", ["C"]],
      ["Sisakan latar saja", ["L"]],
      ["Buka jendela keluaran", ["O"]],
    ],
  },
  {
    title: "Bekerja",
    rows: [
      ["Lompat ke pencarian", ["/"]],
      ["Ganti panel kiri", ["Tab"]],
      ["Daftar pintasan ini", ["?"]],
      ["Tutup apa pun yang terbuka", ["Esc"]],
    ],
  },
];

export function ShortcutsOverlay() {
  const { showShortcuts, toggleShortcuts } = usePresenter();
  if (!showShortcuts) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
      onClick={toggleShortcuts}
    >
      <div
        className="w-full max-w-3xl rounded-xl border border-line bg-panel p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl">Pintasan papan tik</h2>
          <button
            onClick={toggleShortcuts}
            className="cursor-pointer rounded p-1.5 text-muted hover:text-fg"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {GROUPS.map((g) => (
            <section key={g.title} className="space-y-2.5">
              <h3 className="font-mono text-[10px] tracking-[0.18em] text-gold uppercase">
                {g.title}
              </h3>
              {g.rows.map(([label, keys]) => (
                <p
                  key={label}
                  className="flex items-baseline justify-between gap-3 text-sm text-muted"
                >
                  <span className="text-fg/85">{label}</span>
                  <span className="flex shrink-0 gap-1">
                    {keys.map((k) => (
                      <Kbd key={k}>{k}</Kbd>
                    ))}
                  </span>
                </p>
              ))}
            </section>
          ))}
        </div>

        <p className="mt-6 border-t border-line pt-4 text-xs text-muted">
          Pintasan berhenti bekerja saat kursor berada di kotak isian, jadi
          mengetik lirik tidak akan mengubah apa yang sedang tampil di gereja.
        </p>
      </div>
    </div>
  );
}
