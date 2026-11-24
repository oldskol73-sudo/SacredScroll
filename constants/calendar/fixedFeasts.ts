// Feasts outside Leviticus 23 — the Feast of Dedication, the Destruction of
// Nicanor, and Purim — which are kept by the moon like the other holy days
// but aren't yet computed by lunarYear.ts. For now their dates are entered by
// hand, year by year, exactly as given; a year with no entry here simply shows
// none of these. When the calculation for 2028 and beyond is worked out, it
// should replace this table (or generate it) rather than touch the
// Leviticus 23 logic in lunarYear.ts.
//
// Dates follow the same convention as every other day in this calendar: a day
// is labeled by its daylight date and begins at sundown the evening before.
// So a feast running "sundown March 4 to sundown March 5" is the single date
// March 5, and "sundown March 5 to sundown March 7" is March 6–7. Ranges are
// inclusive of both listed dates.
import type { FeastKey } from "./lunarYear";

export interface FixedFeastRange {
  feast: FeastKey;
  /** First daylight date. [year, month (1-12), day] */
  start: [number, number, number];
  /** Last daylight date, inclusive. [year, month (1-12), day] */
  end: [number, number, number];
}

export const FIXED_FEASTS: FixedFeastRange[] = [
  // 2026–27
  // Sundown Dec 18 – sundown Dec 26 (eight days).
  { feast: "dedication", start: [2026, 12, 19], end: [2026, 12, 26] },
  // Sundown Mar 4 – sundown Mar 5.
  { feast: "nicanor", start: [2027, 3, 5], end: [2027, 3, 5] },
  // Sundown Mar 5 – sundown Mar 7. Begins at the very sundown Nicanor ends.
  { feast: "purim", start: [2027, 3, 6], end: [2027, 3, 7] },
];

export interface FixedFeastSpan {
  feast: FeastKey;
  startDate: Date;
  /** Inclusive. */
  endDate: Date;
}

/** FIXED_FEASTS as local-midnight Dates. */
export function fixedFeastSpans(): FixedFeastSpan[] {
  return FIXED_FEASTS.map(({ feast, start, end }) => ({
    feast,
    startDate: new Date(start[0], start[1] - 1, start[2]),
    endDate: new Date(end[0], end[1] - 1, end[2]),
  }));
}
