export type HighlightColorKey =
  | "red"
  | "magenta"
  | "blue"
  | "cyan"
  | "green"
  | "brown"
  | "orange";

export const HIGHLIGHT_COLORS: Record<HighlightColorKey, string> = {
  red: "#E14F4F",
  magenta: "#D64FB0",
  blue: "#3F5FD6",
  cyan: "#3FBFD6",
  green: "#3FA85C",
  brown: "#8A5B3D",
  orange: "#E08A2E",
};

export const HIGHLIGHT_SWATCH_ORDER: HighlightColorKey[] = [
  "red",
  "magenta",
  "blue",
  "cyan",
  "green",
  "brown",
  "orange",
];

export type AtmosphereKey = "parchment" | "stone" | "midnight";

export interface Palette {
  key: AtmosphereKey;
  name: string;
  badge: string;
  tone: string;
  tagline: string;
  isDark: boolean;
  bgSolid: string;
  /** Alias of bgSolid — the page background color. */
  bg: string;
  card: string;
  cardAlt: string;
  text: string;
  textDim: string;
  accent: string;
  gold: string;
  verseNum: string;
  divider: string;
  track: string;
  /** [start, end] colors for the header/hero gradient, top-left to bottom-right. */
  headerGrad: [string, string];
}

export const ATMOSPHERES: Record<AtmosphereKey, Palette> = {
  parchment: {
    key: "parchment",
    name: "Royal Parchment",
    badge: "👑",
    tone: "Luxury • Warm • Premium • Timeless",
    tagline: "Warm daylight reading inspired by handcrafted heirloom Bibles.",
    isDark: false,
    bgSolid: "#F5ECD6",
    bg: "#F5ECD6",
    card: "#FAF3E5",
    cardAlt: "#EFE0BE",
    text: "#2D241D",
    textDim: "rgba(45,36,29,.6)",
    accent: "#8A6B3C",
    gold: "#C8A86B",
    verseNum: "#8A6B3C",
    divider: "rgba(200,168,107,.35)",
    track: "rgba(45,36,29,.12)",
    headerGrad: ["#23160E", "#4B3626"],
  },
  stone: {
    key: "stone",
    name: "Temple Stone",
    badge: "🏛️",
    tone: "Modern • Clean • Biblical • Sophisticated",
    tagline: "Balanced study environment inspired by Jerusalem's timeless architecture.",
    isDark: false,
    bgSolid: "#F1EEE7",
    bg: "#F1EEE7",
    card: "#FFFFFF",
    cardAlt: "#EDE9DF",
    text: "#2E2B26",
    textDim: "rgba(46,43,38,.6)",
    accent: "#A06D37",
    gold: "#D4AF5A",
    verseNum: "#A06D37",
    divider: "rgba(160,109,55,.28)",
    track: "rgba(46,43,38,.12)",
    headerGrad: ["#1F2328", "#353D46"],
  },
  midnight: {
    key: "midnight",
    name: "Midnight Scroll",
    badge: "🌙",
    tone: "Cinematic • Focused • Premium • Easy on Eyes",
    tagline: "An immersive candlelit experience designed for evening Scripture reading.",
    isDark: true,
    bgSolid: "#111315",
    bg: "#111315",
    card: "#1C1F22",
    cardAlt: "#23272B",
    text: "#F3E8D0",
    textDim: "rgba(214,198,168,.65)",
    accent: "#D7B979",
    gold: "#E8C989",
    verseNum: "#C4A267",
    divider: "#3B352F",
    track: "rgba(255,255,255,.12)",
    headerGrad: ["#0B0A08", "#342418"],
  },
};

export const ATMOSPHERE_ORDER: AtmosphereKey[] = ["parchment", "stone", "midnight"];

export function nextAtmosphere(current: AtmosphereKey): AtmosphereKey {
  const idx = ATMOSPHERE_ORDER.indexOf(current);
  return ATMOSPHERE_ORDER[(idx + 1) % ATMOSPHERE_ORDER.length];
}

// Kept as an alias so existing `Palette`-typed props keep working post-rename.
export const LIGHT = ATMOSPHERES.parchment;
export const DARK = ATMOSPHERES.midnight;

export const FONTS = {
  serifSemibold: "SourceSerif4_600SemiBold",
  serifBold: "SourceSerif4_700Bold",
  sansRegular: "NunitoSans_400Regular",
  sansBold: "NunitoSans_700Bold",
  sansExtraBold: "NunitoSans_800ExtraBold",
};

export const READER_FONT_SIZES = [16, 18, 20, 22];
