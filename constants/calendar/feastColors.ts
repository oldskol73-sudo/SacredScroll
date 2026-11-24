import { AtmosphereKey } from "@/constants/theme";
import { FeastKey } from "./lunarYear";

type FeastPalette = Record<FeastKey, string>;

// Distinct colors for each holy day, so they can be told apart at a glance in
// the calendar grid instead of all sharing one "feast" gold. Each atmosphere
// has its own set, tuned to sit well on that atmosphere's background and to
// keep clear of its Sabbath color (the atmosphere's accent); every color holds
// white day numbers. The Sabbath and new moon are not here — they follow the
// atmosphere's accent and a white ring.
const PARCHMENT: FeastPalette = {
  passover: "#B23A32", // red — the Passover lamb's blood (Exodus 12:7)
  unleavenedBread: "#C9A227", // wheat gold — unleavened bread
  simon: "#5B8C3E", // green — the palm branches of Simon's entry (1 Maccabees 13:51)
  pentecost: "#3F7FD6", // blue — the outpoured Spirit (Acts 2)
  trumpets: "#B5742B", // brass/bronze — the trumpet's metal
  atonement: "#5C4A8A", // deep purple — the solemnity of the fast
  tabernacles: "#D98A2E", // amber — the autumn harvest booths
  dedication: "#2A9D8F", // teal — the festival of lights
  nicanor: "#2E4A9E", // blue — the enemy's fall
  purim: "#C2528B", // rose — the days of feasting and gladness (Esther 9:22)
};

// Temple Stone: cool, light stone with a bronze accent — deeper, dyed-stone
// tones; trumpets is a vermilion so it never reads as the bronze Sabbath.
const STONE: FeastPalette = {
  passover: "#933A3A", // oxblood
  unleavenedBread: "#7A7A1C", // olive
  simon: "#4F8A3A", // palm green
  pentecost: "#3A80B8", // steel blue
  trumpets: "#BA5230", // vermilion
  atonement: "#6E4C8E", // amethyst
  tabernacles: "#2F7D5B", // sage green
  dedication: "#1E7A87", // slate teal
  nicanor: "#26407F", // navy
  purim: "#A4466F", // mulberry
};

// Midnight Scroll: dark with a gold accent — jewel tones that glow against the
// dark page without competing with the gold Sabbath.
const MIDNIGHT: FeastPalette = {
  passover: "#C4453E", // ruby
  unleavenedBread: "#9C6F10", // dark ochre
  simon: "#4C8A2C", // palm green
  pentecost: "#2F86C9", // sapphire
  trumpets: "#B85F2B", // copper
  atonement: "#8A55C0", // amethyst
  tabernacles: "#23895A", // emerald
  dedication: "#1B8A93", // deep teal
  nicanor: "#3F57CC", // royal blue
  purim: "#BC3D7E", // magenta rose
};

const FEAST_COLORS_BY_ATMOSPHERE: Record<AtmosphereKey, FeastPalette> = {
  parchment: PARCHMENT,
  stone: STONE,
  midnight: MIDNIGHT,
};

export function feastColor(atmosphere: AtmosphereKey, feast: FeastKey): string {
  return FEAST_COLORS_BY_ATMOSPHERE[atmosphere][feast];
}
