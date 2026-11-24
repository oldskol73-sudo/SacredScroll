// The authoritative new moon dates, entered by hand. Each is the calendar date
// of the full moon that renews the month (Jerusalem time) — the month begins at
// the sundown that closes this date, so "Day 1" is labeled the date after.
//
// The astronomical calculation in astro.ts is only as good as the time zone it
// runs in: a full moon near midnight UTC lands on a different calendar date on
// a phone in the Americas than in Jerusalem. So wherever this list has a date
// within two days of a computed full moon, this list wins; any full moon past
// the end of the list falls back to the calculation.
//
// [year, month (1-12), day]
export const NEW_MOON_DATES: [number, number, number][] = [
  // 2027 reckoning year begins with the March 22 new moon (Month 1, New Year).
  [2027, 1, 22], // month 11
  [2027, 2, 20], // month 12
  [2027, 3, 22], // month 1 — New Year
  [2027, 4, 21], // month 2
  [2027, 5, 20], // month 3
  [2027, 6, 19], // month 4
  [2027, 7, 18], // month 5
  [2027, 8, 17], // month 6
  [2027, 9, 16], // month 7
  [2027, 10, 15], // month 8
  [2027, 11, 14], // month 9
  [2027, 12, 13], // month 10
  [2028, 1, 12], // month 11
  [2028, 2, 10], // month 12
];

const OVERRIDE_WINDOW_DAYS = 2;

/** The listed new moon within two days of a computed full-moon date, if any. */
export function overrideNewMoonDate(computed: Date): Date | undefined {
  for (const [year, month, day] of NEW_MOON_DATES) {
    const listed = new Date(year, month - 1, day);
    const apart = Math.abs(Math.round((listed.getTime() - computed.getTime()) / 86400000));
    if (apart <= OVERRIDE_WINDOW_DAYS) return listed;
  }
  return undefined;
}
