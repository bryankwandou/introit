/**
 * Flat colours a broadcast keyer removes. Green is the usual choice; magenta suits a
 * theme whose words are green, blue one whose words are yellow.
 *
 * Kept apart from stage.ts so the server-rendered key route can import it without
 * pulling in the client-only BroadcastChannel code.
 */
export const KEY_COLORS = {
  hijau: "#00FF00",
  biru: "#0000FF",
  magenta: "#FF00FF",
} as const;

export type KeyName = keyof typeof KEY_COLORS;
