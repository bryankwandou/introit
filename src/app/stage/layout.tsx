import type { Metadata } from "next";

// Set here rather than from the page: metadata lands after client effects and would
// overwrite a title the page wrote itself.
export const metadata: Metadata = { title: { absolute: "Introit — Monitor panggung" } };

export default function StageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
