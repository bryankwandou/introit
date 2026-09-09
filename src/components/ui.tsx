"use client";

import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...parts: unknown[]) => twMerge(clsx(parts));

type Variant = "ghost" | "solid" | "outline" | "live" | "danger";

const VARIANTS: Record<Variant, string> = {
  ghost: "text-muted hover:bg-raised hover:text-fg",
  solid: "bg-gold text-ink hover:bg-gold-bright font-medium",
  outline: "border border-line text-fg hover:border-muted hover:bg-raised",
  live: "bg-live text-white hover:brightness-110 font-medium",
  danger: "text-live hover:bg-live/10",
};

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  active?: boolean;
}

export function Button({
  variant = "ghost",
  active,
  className,
  ...rest
}: BtnProps) {
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors select-none disabled:cursor-not-allowed disabled:opacity-40",
        VARIANTS[variant],
        active && "bg-raised text-gold",
        className,
      )}
    />
  );
}

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...rest}
      className={cn(
        "w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-fg placeholder:text-muted/70 focus:border-gold focus:outline-none",
        className,
      )}
    />
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="block font-mono text-[11px] tracking-wider text-muted uppercase">
        {label}
      </span>
      {children}
      {hint && <span className="block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function PaneTitle({
  children,
  right,
}: {
  children: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="flex h-11 shrink-0 items-center justify-between border-b border-line px-3">
      <h2 className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
        {children}
      </h2>
      {right}
    </div>
  );
}

/** Keyboard hint rendered inline in menus and the status bar. */
export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded border border-line bg-raised px-1.5 py-0.5 font-mono text-[10px] text-muted">
      {children}
    </kbd>
  );
}

export function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-8 text-center">
      <p className="font-display text-lg text-fg">{title}</p>
      <p className="max-w-xs text-sm text-muted">{body}</p>
    </div>
  );
}
