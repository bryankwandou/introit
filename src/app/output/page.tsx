import type { Metadata } from "next";
import { OutputView } from "@/components/OutputView";

// The window title is what a volunteer picks from the taskbar, so it names the screen.
export const metadata: Metadata = { title: { absolute: "Introit — Layar" } };

export default function OutputPage() {
  return <OutputView />;
}
