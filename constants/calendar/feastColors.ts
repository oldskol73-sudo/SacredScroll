import { FeastKey } from "./lunarYear";

// Distinct colors for each Leviticus 23 holy day, so they can be told apart
// at a glance in the calendar grid instead of all sharing one "feast" gold.
export const FEAST_COLORS: Record<FeastKey, string> = {
  passover: "#B23A32", // red — the Passover lamb's blood (Exodus 12:7)
  unleavenedBread: "#C9A227", // wheat gold — unleavened bread
  simon: "#5B8C3E", // green — the palm branches of Simon's entry (1 Maccabees 13:51)
  pentecost: "#3F7FD6", // blue — the outpoured Spirit (Acts 2)
  trumpets: "#B5742B", // brass/bronze — the trumpet's metal
  atonement: "#5C4A8A", // deep purple — the solemnity of the fast
  tabernacles: "#D98A2E", // amber — the autumn harvest booths
  eighthDay: "#8A5B3D", // brown — the feast's closing assembly
  dedication: "#2A9D8F", // teal — the festival of lights
  nicanor: "#2E4A9E", // blue — the enemy's fall
  purim: "#C2528B", // rose — the days of feasting and gladness (Esther 9:22)
};
