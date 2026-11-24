import { DayMark, FeastKey, lunarMarksForGregorianYear } from "./lunarYear";

export type CalendarEventKind = "sabbath" | "newMoon" | "feast";

export interface CalendarEvent {
  kind: CalendarEventKind;
  feast?: FeastKey;
  startDate: Date;
  /** Inclusive. */
  endDate: Date;
  /** Feast events only: its first or last day falls on, or lands the day
   * immediately before/after, the weekly Sabbath — two separate holy rest
   * days running back to back, which matters practically even though
   * they're reckoned independently. */
  overlapsSabbath: boolean;
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function isSaturday(date: Date): boolean {
  return date.getDay() === 6;
}

/** True when a feast's first or last day is, or lands the day immediately
 * before/after, a Saturday — see CalendarEvent.overlapsSabbath. */
function overlapsWeeklySabbath(start: Date, end: Date): boolean {
  return isSaturday(start) || isSaturday(end) || isSaturday(addDays(start, -1)) || isSaturday(addDays(end, 1));
}

/** Every Sabbath, new moon, and feast touching a given civil (Gregorian)
 * month, as discrete events — a multi-day feast collapses into one event
 * spanning its full range, even where that range extends outside the
 * month, so "Begins/Ends" is never truncated at the month boundary.
 * Ordered by start date. */
export function monthEvents(year: number, month: number): CalendarEvent[] {
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);
  // Padded so a feast starting just before, or ending just after, this
  // civil month still resolves its true full range.
  const scanStart = addDays(monthStart, -7);
  const scanEnd = addDays(monthEnd, 7);

  const marksByYear = new Map<number, Map<string, DayMark>>();
  function marksFor(date: Date): DayMark | undefined {
    const y = date.getFullYear();
    if (!marksByYear.has(y)) marksByYear.set(y, lunarMarksForGregorianYear(y));
    return marksByYear.get(y)!.get(dateKey(date));
  }

  const events: CalendarEvent[] = [];
  let openFeast: { feast: FeastKey; start: Date } | null = null;
  function closeFeast(endDate: Date) {
    if (!openFeast) return;
    events.push({
      kind: "feast",
      feast: openFeast.feast,
      startDate: openFeast.start,
      endDate,
      overlapsSabbath: overlapsWeeklySabbath(openFeast.start, endDate),
    });
    openFeast = null;
  }

  for (let date = scanStart; date.getTime() <= scanEnd.getTime(); date = addDays(date, 1)) {
    const mark = marksFor(date);
    if (mark?.feast) {
      if (!openFeast || openFeast.feast !== mark.feast) {
        closeFeast(addDays(date, -1));
        openFeast = { feast: mark.feast, start: date };
      }
    } else {
      closeFeast(addDays(date, -1));
    }
    const inMonth = date.getTime() >= monthStart.getTime() && date.getTime() <= monthEnd.getTime();
    if (mark?.isSabbath && !mark.feast && inMonth) {
      events.push({ kind: "sabbath", startDate: date, endDate: date, overlapsSabbath: false });
    }
    if (mark?.isNewMoon && inMonth) {
      events.push({ kind: "newMoon", startDate: date, endDate: date, overlapsSabbath: false });
    }
  }
  closeFeast(scanEnd);

  const touchesMonth = (ev: CalendarEvent) =>
    ev.endDate.getTime() >= monthStart.getTime() && ev.startDate.getTime() <= monthEnd.getTime();
  const filtered = events.filter((ev) => ev.kind !== "feast" || touchesMonth(ev));
  filtered.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  return filtered;
}
