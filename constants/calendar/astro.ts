// Low-level solar/lunar position math, used to find the exact moment of each
// full moon and each March equinox for the lunisolar calendar in
// `lunarYear.ts`. No network calls and no native modules — everything here
// is pure arithmetic, so it works offline and identically on every platform.
//
// The formulas are Jean Meeus's "Astronomical Algorithms" (2nd ed.):
//   - Sun's true geometric longitude: chapter 25.
//   - Moon's geocentric longitude (ELP2000-82B periodic terms): chapter 47.
//   - March equinox: chapter 27.
// Rather than trust these from memory, every formula and coefficient table
// below was checked against Fabio Soldati's MeeusJs (MIT licensed), a
// third-party implementation unit-tested against JPL Horizons —
// https://github.com/Fabiz/MeeusJs (lib/Astro.Solar.js, Astro.Moon.js,
// Astro.Solistice.js). Full moons are found by numerically solving for when
// the Moon's geocentric longitude minus the Sun's reaches 180°, rather than
// by using Meeus's separate "phases of the Moon" curve-fit (chapter 49) —
// that table has different coefficients for new vs. full moons that are easy
// to mix up from memory, whereas solving directly from the two verified
// longitude formulas above only depends on the (verified) position formulas.
//
// Precision note: this ignores ΔT (the small, slowly-growing difference
// between Terrestrial Time, which these formulas are conventionally defined
// in, and UTC — currently on the order of a minute). That's immaterial for a
// calendar that only cares which calendar day an event falls on.

const DEG = Math.PI / 180;
const J2000 = 2451545.0;
const JULIAN_CENTURY = 36525;
/** Julian Day for the Unix epoch (1970-01-01T00:00:00Z) — lets us convert JS
 * `Date`s to/from Julian Day with plain linear arithmetic instead of the
 * Gregorian-calendar JD formulas, since `Date` already handles those. */
const JD_UNIX_EPOCH = 2440587.5;

export function dateToJD(date: Date): number {
  return date.getTime() / 86400000 + JD_UNIX_EPOCH;
}

export function jdToDate(jd: number): Date {
  return new Date((jd - JD_UNIX_EPOCH) * 86400000);
}

function julianCenturiesSinceJ2000(jd: number): number {
  return (jd - J2000) / JULIAN_CENTURY;
}

function norm360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/** Sun's true geometric longitude in degrees [0, 360). Meeus ch. 25. */
function sunLongitudeDeg(T: number): number {
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) * DEG;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M) +
    0.000289 * Math.sin(3 * M);
  return norm360(L0 + C);
}

/** 0:D, 1:M, 2:M', 3:F, 4:coefficient (longitude term, in millionths of a degree) */
const MOON_LONGITUDE_TERMS: readonly [number, number, number, number, number][] = [
  [0, 0, 1, 0, 6288774],
  [2, 0, -1, 0, 1274027],
  [2, 0, 0, 0, 658314],
  [0, 0, 2, 0, 213618],
  [0, 1, 0, 0, -185116],
  [0, 0, 0, 2, -114332],
  [2, 0, -2, 0, 58793],
  [2, -1, -1, 0, 57066],
  [2, 0, 1, 0, 53322],
  [2, -1, 0, 0, 45758],
  [0, 1, -1, 0, -40923],
  [1, 0, 0, 0, -34720],
  [0, 1, 1, 0, -30383],
  [2, 0, 0, -2, 15327],
  [0, 0, 1, 2, -12528],
  [0, 0, 1, -2, 10980],
  [4, 0, -1, 0, 10675],
  [0, 0, 3, 0, 10034],
  [4, 0, -2, 0, 8548],
  [2, 1, -1, 0, -7888],
  [2, 1, 0, 0, -6766],
  [1, 0, -1, 0, -5163],
  [1, 1, 0, 0, 4987],
  [2, -1, 1, 0, 4036],
  [2, 0, 2, 0, 3994],
  [4, 0, 0, 0, 3861],
  [2, 0, -3, 0, 3665],
  [0, 1, -2, 0, -2689],
  [2, 0, -1, 2, -2602],
  [2, -1, -2, 0, 2390],
  [1, 0, 1, 0, -2348],
  [2, -2, 0, 0, 2236],
  [0, 1, 2, 0, -2120],
  [0, 2, 0, 0, -2069],
  [2, -2, -1, 0, 2048],
  [2, 0, 1, -2, -1773],
  [2, 0, 0, 2, -1595],
  [4, -1, -1, 0, 1215],
  [0, 0, 2, 2, -1110],
  [3, 0, -1, 0, -892],
  [2, 1, 1, 0, -810],
  [4, -1, -2, 0, 759],
  [0, 2, -1, 0, -713],
  [2, 2, -1, 0, -700],
  [2, 1, -2, 0, 691],
  [2, -1, 0, -2, 596],
  [4, 0, 1, 0, 549],
  [0, 0, 4, 0, 537],
  [4, -1, 0, 0, 520],
  [1, 0, -2, 0, -487],
  [2, 1, 0, -2, -399],
  [0, 0, 2, -2, -381],
  [1, 1, 1, 0, 351],
  [3, 0, -2, 0, -340],
  [4, 0, -3, 0, 330],
  [2, -1, 2, 0, 327],
  [0, 2, 1, 0, -323],
  [1, 1, -1, 0, 299],
  [2, 0, 3, 0, 294],
  [2, 0, -1, -2, 0],
];

/** Moon's geocentric (ecliptic) longitude, in degrees [0, 360). Meeus ch. 47
 * — latitude/distance terms are omitted since only longitude (for elongation
 * from the Sun) is needed here. */
function moonLongitudeDeg(T: number): number {
  const D = norm360(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T + (T * T * T) / 545868 - (T * T * T * T) / 113065000) * DEG;
  const M = norm360(357.5291092 + 35999.0502909 * T - 0.0001535 * T * T + (T * T * T) / 24490000) * DEG;
  const Mp = norm360(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T + (T * T * T) / 69699 - (T * T * T * T) / 14712000) * DEG;
  const F = norm360(93.272095 + 483202.0175233 * T - 0.0036539 * T * T - (T * T * T) / 3526000 + (T * T * T * T) / 863310000) * DEG;
  const Lp = norm360(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + (T * T * T) / 538841 - (T * T * T * T) / 65194000);

  const A1 = (119.75 + 131.849 * T) * DEG;
  const A2 = (53.09 + 479264.29 * T) * DEG;
  const E = 1 - 0.002516 * T - 0.0000074 * T * T;
  const E2 = E * E;

  let suml = 3958 * Math.sin(A1) + 1962 * Math.sin(Lp * DEG - F) + 318 * Math.sin(A2);

  for (const [d, m, mp, f, coeff] of MOON_LONGITUDE_TERMS) {
    const arg = d * D + m * M + mp * Mp + f * F;
    const eFactor = m === 0 ? 1 : Math.abs(m) === 1 ? E : E2;
    suml += coeff * Math.sin(arg) * eFactor;
  }

  return norm360(Lp + suml * 1e-6);
}

/** Angular difference `a - b` in degrees, wrapped to (-180, 180]. */
function wrapDiff180(a: number, b: number): number {
  return (((a - b + 180) % 360) + 360) % 360 - 180;
}

/** Mean degrees/day the Moon gains on the Sun — used only as a Newton-iteration
 * step size, not as part of the actual position calculation, so it doesn't need
 * to be precise. */
const MEAN_ELONGATION_RATE_DEG_PER_DAY = 360 / 29.530588861 - 360 / 365.2422;

/** Refines an approximate Julian Day near a full moon to the precise moment
 * the Moon's geocentric longitude is 180° ahead of the Sun's, by Newton
 * iteration on the (verified) longitude formulas above. Converges to
 * sub-minute precision in a handful of iterations since elongation changes
 * almost linearly with time over the few-day span a single iteration covers. */
export function refineFullMoonJD(approxJD: number): number {
  let jd = approxJD;
  for (let i = 0; i < 8; i++) {
    const T = julianCenturiesSinceJ2000(jd);
    const diff = wrapDiff180(moonLongitudeDeg(T) - sunLongitudeDeg(T), 180);
    if (Math.abs(diff) < 1e-6) break;
    jd -= diff / MEAN_ELONGATION_RATE_DEG_PER_DAY;
  }
  return jd;
}

/** The mean synodic month, used only to seed `refineFullMoonJD` with a
 * starting guess — the periodic terms in `moonLongitudeDeg` are what give
 * the real precision. k=0 is the new moon nearest 2000-01-06; k+0.5 is the
 * nearest full moon. */
const SYNODIC_MONTH_DAYS = 29.530588861;
const K0_JD = 2451550.09766;

/** Julian Day of the full moon nearest to synodic-month index k+0.5 (k=0 is
 * the January 2000 new moon reference epoch). */
export function fullMoonJDForK(k: number): number {
  const seed = K0_JD + SYNODIC_MONTH_DAYS * (k + 0.5);
  return refineFullMoonJD(seed);
}

/** Approximate synodic-month index for a given Julian Day — used to find
 * where to start stepping `fullMoonJDForK` from. */
function approxKForJD(jd: number): number {
  return (jd - K0_JD) / SYNODIC_MONTH_DAYS - 0.5;
}

/** Returns the Julian Day of the first full moon at or after `jd`. */
export function firstFullMoonAtOrAfter(jd: number): number {
  let k = Math.floor(approxKForJD(jd));
  // approxKForJD is only approximate, and refineFullMoonJD's Newton step can
  // occasionally land a neighboring k's full moon a fraction of a day the
  // wrong side of `jd` — walk forward (or, rarely, back) until the condition
  // genuinely holds, instead of trusting a single estimated k.
  let fm = fullMoonJDForK(k);
  while (fm < jd) {
    k += 1;
    fm = fullMoonJDForK(k);
  }
  while (k > 0 && fullMoonJDForK(k - 1) >= jd) {
    k -= 1;
    fm = fullMoonJDForK(k);
  }
  return fm;
}

/** 0:a (days), 1:b (days/1000yr), 2:c, 3:d, 4:e — mean March equinox JDE
 * polynomial in Y=(year-2000)/1000, valid for years near 1000-3000. Meeus
 * ch. 27 (the "mc2" table). */
const MARCH_EQUINOX_MEAN: readonly number[] = [2451623.80984, 365242.37404, 0.05169, -0.00411, -0.00057];

/** 0:amplitude, 1:phase (deg), 2:rate (deg per Julian century) — the 24
 * largest periodic terms Meeus adds to the mean equinox/solstice time.
 * Accurate to within about a minute for 1951-2050, and still good for years
 * well outside that range. */
const EQUINOX_PERIODIC_TERMS: readonly [number, number, number][] = [
  [485, 324.96, 1934.136],
  [203, 337.23, 32964.467],
  [199, 342.08, 20.186],
  [182, 27.85, 445267.112],
  [156, 73.14, 45036.886],
  [136, 171.52, 22518.443],
  [77, 222.54, 65928.934],
  [74, 296.72, 3034.906],
  [70, 243.58, 9037.513],
  [58, 119.81, 33718.147],
  [52, 297.17, 150.678],
  [50, 21.02, 2281.226],
  [45, 247.54, 29929.562],
  [44, 325.15, 31555.956],
  [29, 60.93, 4443.417],
  [18, 155.12, 67555.328],
  [17, 288.79, 4562.452],
  [16, 198.04, 62894.029],
  [14, 199.76, 31436.921],
  [12, 95.39, 14577.848],
  [12, 287.11, 31931.756],
  [12, 320.81, 34777.259],
  [9, 227.73, 1222.114],
  [8, 15.45, 16859.074],
];

/** Julian Day (Ephemeris Time — see the ΔT note at the top of this file) of
 * the March equinox for the given Gregorian year. */
export function marchEquinoxJD(year: number): number {
  const Y = (year - 2000) / 1000;
  let J0 = MARCH_EQUINOX_MEAN[0];
  let YPow = 1;
  for (let i = 1; i < MARCH_EQUINOX_MEAN.length; i++) {
    YPow *= Y;
    J0 += MARCH_EQUINOX_MEAN[i] * YPow;
  }

  const T = julianCenturiesSinceJ2000(J0);
  const W = (35999.373 * T - 2.47) * DEG;
  const deltaTheta = 1 + 0.0334 * Math.cos(W) + 0.0007 * Math.cos(2 * W);

  let S = 0;
  for (const [amplitude, phase, rate] of EQUINOX_PERIODIC_TERMS) {
    S += amplitude * Math.cos((phase + rate * T) * DEG);
  }

  return J0 + (0.00001 * S) / deltaTheta;
}
