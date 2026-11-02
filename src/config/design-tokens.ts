/**
 * Green Valor design tokens: the single list of colors the site may use,
 * plus every foreground/background pairing the UI relies on.
 *
 * `src/styles/globals.css` must declare the same hex values; the unit test
 * `tests/unit/design-tokens.test.ts` checks both the values and that every
 * pairing below meets its WCAG 2.1 contrast target.
 */

/** Official brand palette (do not alter). */
export const brand = {
  green: "#02331D",
  gold: "#BD870B",
  forest: "#14452F",
  ivory: "#F5F0E4",
  charcoal: "#202824",
  white: "#FFFFFF",
} as const;

/**
 * Supporting tints. Brand gold fails AA for normal text on white (3.2:1),
 * ivory (2.9:1) and primary green (4.4:1), so gold TEXT uses these tints.
 * Brand gold itself is kept for fills, rules, icons on dark and large display.
 */
export const support = {
  goldDeep: "#8A6208", // gold text / focus ring on white & ivory
  goldBright: "#C9962A", // gold text / focus ring on primary green
  mutedText: "#4A524E", // supporting copy on white & ivory
  border: "#E3DCCB",
  inputBorder: "#8C8676", // form control outline (3:1 non-text contrast)
  error: "#B42318",
  success: "#14452F",
} as const;

export type ContrastPair = {
  name: string;
  fg: string;
  bg: string;
  /** 4.5 = normal text, 3 = large text (≥24px or ≥18.66px bold) or UI/graphics. */
  min: 4.5 | 3;
};

export const contrastPairs: ContrastPair[] = [
  { name: "body text on white", fg: brand.charcoal, bg: brand.white, min: 4.5 },
  { name: "body text on ivory", fg: brand.charcoal, bg: brand.ivory, min: 4.5 },
  { name: "headings on white", fg: brand.green, bg: brand.white, min: 4.5 },
  { name: "headings on ivory", fg: brand.green, bg: brand.ivory, min: 4.5 },
  { name: "muted text on white", fg: support.mutedText, bg: brand.white, min: 4.5 },
  { name: "muted text on ivory", fg: support.mutedText, bg: brand.ivory, min: 4.5 },
  { name: "white text on primary green", fg: brand.white, bg: brand.green, min: 4.5 },
  { name: "white text on forest (hover)", fg: brand.white, bg: brand.forest, min: 4.5 },
  { name: "ivory text on primary green", fg: brand.ivory, bg: brand.green, min: 4.5 },
  { name: "charcoal text on gold button", fg: brand.charcoal, bg: brand.gold, min: 4.5 },
  { name: "eyebrow gold-deep on white", fg: support.goldDeep, bg: brand.white, min: 4.5 },
  { name: "eyebrow gold-deep on ivory", fg: support.goldDeep, bg: brand.ivory, min: 4.5 },
  { name: "eyebrow gold-bright on green", fg: support.goldBright, bg: brand.green, min: 4.5 },
  { name: "error text on white", fg: support.error, bg: brand.white, min: 4.5 },
  { name: "success text on white", fg: support.success, bg: brand.white, min: 4.5 },
  { name: "focus ring on white", fg: support.goldDeep, bg: brand.white, min: 3 },
  { name: "focus ring on ivory", fg: support.goldDeep, bg: brand.ivory, min: 3 },
  { name: "focus ring on green", fg: support.goldBright, bg: brand.green, min: 3 },
  { name: "input outline on white", fg: support.inputBorder, bg: brand.white, min: 3 },
  { name: "gold icon/rule on green", fg: brand.gold, bg: brand.green, min: 3 },
  { name: "gold large display on white", fg: brand.gold, bg: brand.white, min: 3 },
];

/** Combinations that must NOT be used for text (documented, and asserted to fail AA). */
export const forbiddenTextPairs: ContrastPair[] = [
  { name: "gold text on white", fg: brand.gold, bg: brand.white, min: 4.5 },
  { name: "white text on gold", fg: brand.white, bg: brand.gold, min: 4.5 },
  { name: "gold text on ivory", fg: brand.gold, bg: brand.ivory, min: 4.5 },
];

function channel(c: number) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function luminance(hex: string) {
  const n = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => channel(parseInt(n.slice(i, i + 2), 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
