import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OutputView } from "@/components/OutputView";
import { KEY_COLORS, type KeyName } from "@/lib/key";

// Built ahead of time for each colour, so the key feed works offline like the rest.
export const dynamicParams = false;
export const generateStaticParams = () =>
  Object.keys(KEY_COLORS).map((warna) => ({ warna }));

const isKey = (warna: string): warna is KeyName => warna in KEY_COLORS;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ warna: string }>;
}): Promise<Metadata> {
  const { warna } = await params;
  // OBS lists windows by title; this is the one an operator looks for in Window Capture.
  return { title: { absolute: `Introit — Kunci siaran (${warna})` } };
}

export default async function KeyPage({
  params,
}: {
  params: Promise<{ warna: string }>;
}) {
  const { warna } = await params;
  if (!isKey(warna)) notFound();
  return <OutputView keyColor={KEY_COLORS[warna]} />;
}
