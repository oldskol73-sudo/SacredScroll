// Builds one "reckoning year" of the app's lunisolar calendar: the year
// begins on the first full moon on or after the March equinox, and each
// subsequent month begins on the next full moon after that — so a year runs
// 12 or 13 months depending on how the lunar cycle lines up with the
// following year's equinox, with no separate leap-month rule needed; it
// falls out of "keep adding months until the next year would start."
//
// Interpretive choices made here, clearly called out since other traditions
// that also reckon by the full moon make different calls on some of these:
//  - Every day here begins at sundown the evening before its calendar date,
//    not at midnight (Genesis 1:5, "the evening and the morning were the
//    first day"; Leviticus 23:32, "from even unto even"). So the new month
//    doesn't begin on the full moon's own calendar date — it begins at the
//    sundown that follows the full moon, and that evening's day is labeled
//    by the NEXT calendar date, since a day's daylight (the half people
//    actually experience it by) falls after its evening, not before. E.g. a
//    full moon at 12:50 PM on Sept 26 starts the new month at sundown that
//    same evening, and the day that begins there — "Day 1" — is labeled
//    Sept 27, not Sept 26. This is computed as the full moon's local
//    calendar date plus one day; we don't attempt to also detect a full
//    moon landing after the evening's own sundown (which would push it a
//    further day), since that needs the viewer's exact latitude and time of
//    year, which this app doesn't have (no geolocation).
//  - The weekly Sabbath is the actual Saturday of every week (beginning at
//    sundown the Friday evening before, per Leviticus 23:32) — the same
//    civil Saturday as any ordinary calendar, independent of which day of
//    the lunar month it happens to fall on.
//  - Passover is the single day, Month 1, Day 14. The Days of Unleavened Bread
//    run from the sundown that ends it through the sundown that ends Day 20.
//  - Firstfruits is Pentecost: one feast, 50 days after the first weekly
//    Sabbath of Passover — the Saturday that falls within Month 1, Days 15-21
//    (Leviticus 23:11, 15-16).
//  - The Day of Simon is Month 2, Day 23 (1 Maccabees 13:51).
//  - Months are labeled by number ("Month 1", "Month 2", ...) rather than
//    the traditional Hebrew/Babylonian names (Nisan, Iyar, ...), matching
//    how the Torah itself refers to them (e.g. Exodus 12:2).
import { dateToJD, firstFullMoonAtOrAfter, jdToDate, marchEquinoxJD } from "./astro";
import { fixedFeastSpans } from "./fixedFeasts";

export type FeastKey =
  | "passover"
  | "unleavenedBread"
  | "simon"
  | "trumpets"
  | "atonement"
  | "tabernacles"
  | "eighthDay"
  | "pentecost"
  | "dedication"
  | "nicanor"
  | "purim";

export const FEAST_LABELS: Record<FeastKey, string> = {
  passover: "Passover",
  unleavenedBread: "Unleavened Bread",
  simon: "Day of Simon",
  pentecost: "Firstfruits (Pentecost)",
  trumpets: "Trumpets",
  atonement: "Day of Atonement",
  tabernacles: "Tabernacles",
  eighthDay: "Tabernacles — Eighth Day",
  dedication: "Feast of Dedication (Hanukkah)",
  nicanor: "Destruction of Nicanor",
  purim: "Purim",
};

export interface LunarDay {
  /** Local calendar date (local midnight) for this day. */
  date: Date;
  /** 1-based day of the month. */
  dayOfMonth: number;
  isSabbath: boolean;
  feast: FeastKey | null;
}

export interface LunarMonth {
  /** 1-based month number within the reckoning year. */
  index: number;
  startDate: Date;
  /** Inclusive. */
  endDate: Date;
  days: LunarDay[];
}

export interface LunarYear {
  /** The Gregorian year whose March equinox anchors this reckoning year. */
  anchorYear: number;
  startDate: Date;
  /** Exclusive — the day before this is the year's last day. */
  nextYearStartDate: Date;
  months: LunarMonth[];
}

const DAY_MS = 86400000;

/** Strips the time-of-day from an absolute instant, in the device's local
 * time zone, giving a Date that represents local midnight of that calendar
 * day. */
function localCalendarDate(instant: Date): Date {
  return new Date(instant.getFullYear(), instant.getMonth(), instant.getDate());
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** The calendar date of "Day 1" of the month that a given full moon starts —
 * the day beginning at the sundown that follows the full moon, labeled by
 * the date of its daylight (see the file header comment). */
function monthStartFromFullMoonJD(fullMoonJD: number): Date {
  return addDays(localCalendarDate(jdToDate(fullMoonJD)), 1);
}

/** Calendar date of the start of the reckoning year beginning at the first
 * full moon on/after the given Gregorian year's March equinox. */
function yearStartDate(anchorYear: number): Date {
  const equinoxJD = marchEquinoxJD(anchorYear);
  const fullMoonJD = firstFullMoonAtOrAfter(equinoxJD);
  return monthStartFromFullMoonJD(fullMoonJD);
}

function feastFor(month: number, day: number): FeastKey | null {
  if (month === 1) {
    if (day === 14) return "passover";
    if (day >= 15 && day <= 20) return "unleavenedBread";
    // Pentecost (Firstfruits) isn't a fixed day-of-month — it's resolved in
    // buildLunarYear() once the actual weekly Sabbath of Passover is known
    // (see the comment there).
    return null;
  }
  if (month === 2) {
    if (day === 23) return "simon";
    return null;
  }
  if (month === 7) {
    if (day === 1) return "trumpets";
    if (day === 10) return "atonement";
    if (day >= 15 && day <= 21) return "tabernacles";
    if (day === 22) return "eighthDay";
  }
  return null;
}

function buildMonthDays(index: number, startDate: Date, endDate: Date): LunarDay[] {
  const totalDays = Math.round((endDate.getTime() - startDate.getTime()) / DAY_MS) + 1;
  const days: LunarDay[] = [];
  for (let i = 0; i < totalDays; i++) {
    const dayOfMonth = i + 1;
    const date = addDays(startDate, i);
    days.push({
      date,
      dayOfMonth,
      // The weekly Sabbath is always the civil Saturday (Friday sundown to
      // Saturday sundown) — not a count from the start of the lunar month.
      isSabbath: date.getDay() === 6,
      feast: feastFor(index, dayOfMonth),
    });
  }
  return days;
}

/** Builds the full reckoning year anchored to `anchorYear`'s March equinox
 * (e.g. anchorYear=2025 is the year starting at the first full moon on/after
 * the March 2025 equinox, running into 2026). */
export function buildLunarYear(anchorYear: number): LunarYear {
  const startDate = yearStartDate(anchorYear);
  const nextYearStartDate = yearStartDate(anchorYear + 1);

  const monthStarts: Date[] = [startDate];
  let searchFromJD = dateToJD(startDate) + 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const fmJD = firstFullMoonAtOrAfter(searchFromJD);
    const monthStart = monthStartFromFullMoonJD(fmJD);
    if (monthStart.getTime() >= nextYearStartDate.getTime()) break;
    monthStarts.push(monthStart);
    searchFromJD = fmJD + 1;
  }

  const months: LunarMonth[] = monthStarts.map((start, i) => {
    const end = addDays(i + 1 < monthStarts.length ? monthStarts[i + 1] : nextYearStartDate, -1);
    return { index: i + 1, startDate: start, endDate: end, days: buildMonthDays(i + 1, start, end) };
  });

  // Firstfruits, i.e. Pentecost (Leviticus 23:15-16), falls 50 days after the
  // first weekly Sabbath (Saturday) of Passover — the Saturday within Month 1,
  // Days 15-21. Any 7-day span contains exactly one Saturday, so this is
  // always resolvable. It's resolved here by date arithmetic instead of in
  // feastFor(), since it doesn't fall on a fixed day-of-month.
  const unleavenedBreadDays = months[0].days.filter((d) => d.dayOfMonth >= 15 && d.dayOfMonth <= 21);
  const sabbathDuringFeast = unleavenedBreadDays.find((d) => d.isSabbath);
  if (!sabbathDuringFeast) {
    throw new Error("Expected a weekly Sabbath within Month 1, Days 15-21");
  }
  const pentecostDate = addDays(sabbathDuringFeast.date, 50);
  for (const month of months) {
    for (const day of month.days) {
      if (day.date.getTime() === pentecostDate.getTime()) day.feast = "pentecost";
    }
  }

  return { anchorYear, startDate, nextYearStartDate, months };
}

export interface DayMark {
  isSabbath: boolean;
  /** The calendar date the full moon itself actually falls on — the LAST
   * day of a month, not its first. "Day 1" of the next month is labeled by
   * the date after this one, since that day begins at the sundown here and
   * is labeled by its daylight's date (see the file header comment); this
   * flag marks the full moon's own, unshifted date. Called "new moon" to
   * match how that term is used in this calendar's own reckoning (the full
   * moon marking the renewal of the month), not the modern astronomical new
   * moon. */
  isNewMoon: boolean;
  feast: FeastKey | null;
  /** Dedication, Nicanor and Purim (see fixedFeasts.ts) — a list, not a single
   * value, because their ranges can overlap (Nicanor and Purim share a day in
   * 2027). Kept apart from `feast` so the Leviticus 23 logic is untouched. */
  fixedFeasts: FeastKey[];
  /** Fixed feasts whose first day begins at the sundown that ends this date —
   * so on a date where another feast is just ending, the day is shared: the
   * first half belongs to the ending feast, the second half to this one. */
  fixedFeastsBeginningAtSundown: FeastKey[];
}

/** `YYYY-M-D` in the device's local time zone — stable, collision-free map
 * key for a calendar date (deliberately not `toISOString()`, which is UTC
 * and would shift local dates near midnight). */
function dateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

/** Every day's Sabbath/new-moon/feast status for a given CIVIL (Gregorian)
 * year, keyed by `dateKey`. A Gregorian year spans the tail of one reckoning
 * year (Jan through the following full moon) and the start of the next, so
 * this merges both of the reckoning years that can overlap it. */
export function lunarMarksForGregorianYear(gregorianYear: number): Map<string, DayMark> {
  const marks = new Map<string, DayMark>();
  for (const anchor of [gregorianYear - 1, gregorianYear]) {
    for (const month of buildLunarYear(anchor).months) {
      for (const day of month.days) {
        marks.set(dateKey(day.date), {
          isSabbath: day.isSabbath,
          isNewMoon: day.dayOfMonth === month.days.length,
          feast: day.feast,
          fixedFeasts: [],
          fixedFeastsBeginningAtSundown: [],
        });
      }
    }
  }
  for (const span of fixedFeastSpans()) {
    for (let date = span.startDate; date.getTime() <= span.endDate.getTime(); date = addDays(date, 1)) {
      marks.get(dateKey(date))?.fixedFeasts.push(span.feast);
    }
    marks.get(dateKey(addDays(span.startDate, -1)))?.fixedFeastsBeginningAtSundown.push(span.feast);
  }
  return marks;
}
