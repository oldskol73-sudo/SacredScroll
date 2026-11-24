// Scriptural references shown when a holy day marker on the Calendar is
// tapped (or hovered, on web). Pulled verbatim from the "High Holy Days"
// topics in src/constants/bible/precepts.ts so the Calendar and the
// Precepts tab cite the exact same verses.
import { FeastKey } from "./lunarYear";

export interface ScriptureNote {
  ref: string;
  note: string;
}

// precepts.ts: "sabbath"
export const SABBATH_SCRIPTURE: ScriptureNote = {
  ref: "Exodus 20:8-11",
  note: "Remember the sabbath day, to keep it holy",
};

// precepts.ts: "high-holy-days-new-moon"
export const NEW_MOON_SCRIPTURE: ScriptureNote = {
  ref: "Psalms 81:3-4",
  note: "it is a feast day",
};

// precepts.ts: "high-holy-days-passover", "high-holy-days-pentecost",
// "high-holy-days-memorial-of-blowing-of-trumpets",
// "high-holy-days-day-of-atonement", "high-holy-days-feast-of-tabernacles".
// Labels for these come from FEAST_LABELS in lunarYear.ts — kept here only
// as ref/note so the two don't drift out of sync with each other.
export const FEAST_SCRIPTURE: Record<FeastKey, ScriptureNote> = {
  passover: {
    ref: "Exodus 12:18",
    note: "Passover kept at even on the 14th day of the 1st month, Abib",
  },
  unleavenedBread: {
    ref: "Exodus 34:18",
    note: "thou shalt eat unleavened bread 7 days",
  },
  simon: {
    ref: "1 Maccabees 13:51-52",
    note: "Simon entered the citadel on the 23rd day of the 2nd month with thanksgiving, and the day was ordained to be kept yearly",
  },
  pentecost: {
    ref: "Leviticus 23:15-22",
    note: "Pentecost (50)",
  },
  trumpets: {
    ref: "Leviticus 23:24",
    note: "a holy convocation to be kept on the 1st day of the 7th month",
  },
  atonement: {
    ref: "Leviticus 23:27-32",
    note: "a sabbath of rest unto you, and ye shall afflict your souls",
  },
  tabernacles: {
    ref: "Leviticus 23:34-36",
    note: "the fifteenth day of the seventh month, and the eighth day a solemn assembly",
  },
  dedication: {
    ref: "2 Maccabees 1:18; 10:5-6",
    note: "the temple purified on the 25th day of Casleu, and the feast kept eight days with gladness",
  },
  nicanor: {
    ref: "2 Maccabees 15:28, 32; 1 Maccabees 7; 2 Maccabees 14:3-46; 2 Maccabees 8:1-36; 2 Maccabees 15:1-36",
    note: "the defeat of Nicanor",
  },
  purim: {
    ref: "Esther 9:24, 27-29; Additions to Esther 6:10-14 (Esther 16:10-14)",
    note: "the days of Purim kept every year",
  },
};

// Keys into PRECEPT_TOPICS (src/constants/bible/precepts.ts) for each
// calendar event's "Learn more" link.
export const SABBATH_PRECEPT_TOPIC_KEY = "sabbath";
export const NEW_MOON_PRECEPT_TOPIC_KEY = "high-holy-days-new-moon";
export const FEAST_PRECEPT_TOPIC_KEYS: Record<FeastKey, string> = {
  passover: "high-holy-days-passover",
  unleavenedBread: "high-holy-days-passover",
  simon: "high-holy-days-day-of-atonement",
  pentecost: "high-holy-days-pentecost",
  trumpets: "high-holy-days-memorial-of-blowing-of-trumpets",
  atonement: "high-holy-days-day-of-atonement",
  tabernacles: "high-holy-days-feast-of-tabernacles",
  dedication: "high-holy-days-feast-of-dedication",
  nicanor: "destruction-of-nicanor",
  purim: "high-holy-days-purim",
};
