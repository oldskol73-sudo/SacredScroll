import React, { useMemo, useState } from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";
import { DayMark, FEAST_LABELS, lunarMarksForGregorianYear } from "@/constants/calendar/lunarYear";
import {
  FEAST_PRECEPT_TOPIC_KEYS,
  FEAST_SCRIPTURE,
  NEW_MOON_PRECEPT_TOPIC_KEY,
  NEW_MOON_SCRIPTURE,
  SABBATH_PRECEPT_TOPIC_KEY,
  SABBATH_SCRIPTURE,
  ScriptureNote,
} from "@/constants/calendar/feastScripture";
import { FEAST_COLORS } from "@/constants/calendar/feastColors";
import { CalendarEvent, monthEvents } from "@/constants/calendar/calendarEvents";
import { PRECEPT_TOPICS } from "@/constants/bible/precepts";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
// A full moon, solid — not the crescent Ionicons glyph, which defeats the
// point of marking a FULL moon.
const NEW_MOON_COLOR = "#FFFFFF";

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function monthName(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString(undefined, { month: "long" });
}

function shortDate(date: Date): string {
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function rangeHeading(ev: CalendarEvent): { day: string; mon: string } {
  const sameDay = ev.startDate.getTime() === ev.endDate.getTime();
  const mon = ev.endDate.toLocaleDateString(undefined, { month: "short" }).toUpperCase();
  if (sameDay) return { day: `${ev.startDate.getDate()}`, mon };
  const sameMonth = ev.startDate.getMonth() === ev.endDate.getMonth() && ev.startDate.getFullYear() === ev.endDate.getFullYear();
  return { day: sameMonth ? `${ev.startDate.getDate()} – ${ev.endDate.getDate()}` : `${ev.startDate.getDate()}/${ev.startDate.getMonth() + 1} – ${ev.endDate.getDate()}/${ev.endDate.getMonth() + 1}`, mon };
}

function eventTitle(ev: CalendarEvent): string {
  if (ev.kind === "feast" && ev.feast) return FEAST_LABELS[ev.feast];
  if (ev.kind === "sabbath") return "Weekly Sabbath";
  return "New Moon";
}

function eventScripture(ev: CalendarEvent): ScriptureNote {
  if (ev.kind === "feast" && ev.feast) return FEAST_SCRIPTURE[ev.feast];
  if (ev.kind === "sabbath") return SABBATH_SCRIPTURE;
  return NEW_MOON_SCRIPTURE;
}

function eventPreceptKey(ev: CalendarEvent): string {
  if (ev.kind === "feast" && ev.feast) return FEAST_PRECEPT_TOPIC_KEYS[ev.feast];
  if (ev.kind === "sabbath") return SABBATH_PRECEPT_TOPIC_KEY;
  return NEW_MOON_PRECEPT_TOPIC_KEY;
}

export function CalendarScreen() {
  const { palette, t, openPrecepts } = useApp();
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const marks = useMemo(() => lunarMarksForGregorianYear(viewDate.year), [viewDate.year]);
  const todayKey = useMemo(() => dateKey(new Date()), []);
  const events = useMemo(() => monthEvents(viewDate.year, viewDate.month), [viewDate.year, viewDate.month]);

  function shiftMonth(delta: number) {
    setViewDate(({ year, month }) => {
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  function onLearnMore(ev: CalendarEvent) {
    const topic = PRECEPT_TOPICS.find((topic) => topic.key === eventPreceptKey(ev));
    if (!topic) return;
    openPrecepts({ verseRef: eventScripture(ev).ref, topics: [topic] });
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.strip, { backgroundColor: palette.bg, borderBottomColor: palette.divider }]}>
        <View style={styles.monthNavRow}>
          <Pressable onPress={() => shiftMonth(-1)} style={[styles.navBtn, { backgroundColor: palette.cardAlt }]} hitSlop={8}>
            <Ionicons name="chevron-back" size={16} color={palette.text} />
          </Pressable>
          <AppText variant="serifBold" size={18}>
            {monthName(viewDate.year, viewDate.month)} {viewDate.year}
          </AppText>
          <Pressable onPress={() => shiftMonth(1)} style={[styles.navBtn, { backgroundColor: palette.cardAlt }]} hitSlop={8}>
            <Ionicons name="chevron-forward" size={16} color={palette.text} />
          </Pressable>
        </View>

        <MiniGrid year={viewDate.year} month={viewDate.month} marks={marks} todayKey={todayKey} />

        <View style={styles.legendRow}>
          <LegendDot colorStyle={{ backgroundColor: palette.accent }} label={t("Sabbath")} />
          <LegendDot colorStyle={[styles.moonDot, { borderColor: palette.accent }]} label={t("New moon")} />
          <AppText dim size={10.5} style={{ flexShrink: 1 }}>
            {t("Feast days below, each its own color")}
          </AppText>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.feed}>
        <AppText dim size={11} style={{ marginBottom: 2 }}>
          {t("Each day begins at sundown the evening before (Leviticus 23:32).")}
        </AppText>
        {events.map((ev, i) => (
          <EventCard key={i} event={ev} onLearnMore={() => onLearnMore(ev)} />
        ))}
      </ScrollView>
    </View>
  );
}

function LegendDot({ colorStyle, label }: { colorStyle: object | object[]; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendSwatch, colorStyle as object]} />
      <AppText size={10.5}>{label}</AppText>
    </View>
  );
}

function MiniGrid({ year, month, marks, todayKey }: { year: number; month: number; marks: Map<string, DayMark>; todayKey: string }) {
  const { palette } = useApp();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();

  const cells: { day: number; mark?: DayMark; isToday: boolean }[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push({ day: 0, isToday: false });
  for (let d = 1; d <= daysInMonth; d++) {
    const key = dateKey(new Date(year, month, d));
    cells.push({ day: d, mark: marks.get(key), isToday: key === todayKey });
  }
  while (cells.length % 7 !== 0) cells.push({ day: 0, isToday: false });
  const weeks: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <View style={{ marginTop: 10 }}>
      <View style={styles.weekRow}>
        {WEEKDAY_LABELS.map((w, i) => (
          <AppText key={i} dim size={9} variant="sansBold" style={[styles.miniCell, { textAlign: "center" }]}>
            {w}
          </AppText>
        ))}
      </View>
      {weeks.map((week, w) => (
        <View key={w} style={styles.weekRow}>
          {week.map((cell, i) => {
            if (cell.day === 0) return <View key={i} style={styles.miniCell} />;
            const mark = cell.mark;
            const feast = mark?.feast ?? mark?.fixedFeasts[0];
            // One feast ends at this date's sundown and another begins at that
            // same sundown: the day is shared, first half / second half.
            const nextFeast = feast ? mark?.fixedFeastsBeginningAtSundown.find((f) => f !== feast) : undefined;
            // Hanukkah days that are also the weekly Sabbath: diagonal, Hanukkah
            // color above the line and Sabbath color below it.
            const hanukkahSabbath = feast === "dedication" && !!mark?.isSabbath;
            const bg = feast ? FEAST_COLORS[feast] : mark?.isSabbath ? palette.accent : "transparent";
            const fg = feast || mark?.isSabbath ? "#fff" : palette.text;
            return (
              <View key={i} style={styles.miniCell}>
                <View style={[styles.miniDay, { backgroundColor: bg }, cell.isToday ? { borderWidth: 1.5, borderColor: palette.text } : null]}>
                  {hanukkahSabbath ? (
                    <LinearGradient
                      pointerEvents="none"
                      colors={[FEAST_COLORS.dedication, FEAST_COLORS.dedication, palette.accent, palette.accent]}
                      locations={[0, 0.5, 0.5, 1]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.miniSplit}
                    />
                  ) : null}
                  {feast && nextFeast ? (
                    <View style={styles.miniSplit} pointerEvents="none">
                      <View style={{ flex: 1, backgroundColor: FEAST_COLORS[feast] }} />
                      <View style={{ flex: 1, backgroundColor: FEAST_COLORS[nextFeast] }} />
                    </View>
                  ) : null}
                  <AppText variant="sansBold" size={9.5} color={fg}>
                    {cell.day}
                  </AppText>
                  {mark?.isNewMoon ? <View style={[styles.miniMoonBadge, { borderColor: palette.accent }]} /> : null}
                </View>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

function EventCard({ event, onLearnMore }: { event: CalendarEvent; onLearnMore: () => void }) {
  const { palette, t } = useApp();
  const heading = rangeHeading(event);
  const title = eventTitle(event);
  const scripture = eventScripture(event);
  const color = event.kind === "feast" && event.feast ? FEAST_COLORS[event.feast] : event.kind === "sabbath" ? palette.accent : palette.cardAlt;
  const beginsEve = new Date(event.startDate.getFullYear(), event.startDate.getMonth(), event.startDate.getDate() - 1);

  return (
    <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.divider }]}>
      <View style={styles.cardTop}>
        <View style={[styles.swatch, { backgroundColor: color }]}>
          {event.kind === "newMoon" ? (
            <View style={[styles.swatchMoon, { borderColor: palette.accent }]} />
          ) : (
            <Ionicons name={event.kind === "sabbath" ? "flame" : "star"} size={16} color="#fff" />
          )}
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={styles.headingRow}>
            <AppText variant="serifBold" size={20}>
              {heading.day}
            </AppText>
            <AppText variant="sansExtraBold" size={11} dim style={{ marginLeft: 4, marginTop: 4 }}>
              {heading.mon}
            </AppText>
            {event.overlapsSabbath ? (
              <View style={[styles.badge, { backgroundColor: palette.gold, marginLeft: 8 }]}>
                <AppText variant="sansExtraBold" size={8.5} color="#2D241D" style={{ letterSpacing: 0.3 }}>
                  {t("SABBATH OVERLAP")}
                </AppText>
              </View>
            ) : null}
          </View>
          <AppText variant="sansExtraBold" size={13.5} style={{ marginTop: 2 }}>
            {t(title)}
          </AppText>
          <AppText size={10.5} dim style={{ marginTop: 3, lineHeight: 15 }}>
            {t("Begins at sundown,")} {shortDate(beginsEve)} · {t("Ends at sundown,")} {shortDate(event.endDate)}
          </AppText>
        </View>
      </View>

      <AppText size={11} color={palette.accent} variant="sansBold" style={{ marginTop: 8 }}>
        {scripture.ref} — {t(scripture.note)}
      </AppText>

      <Pressable onPress={onLearnMore} style={styles.learnRow} hitSlop={6}>
        <AppText variant="sansBold" size={11.5} color={palette.accent}>
          {t("Learn more in Precepts")}
        </AppText>
        <Ionicons name="arrow-forward" size={13} color={palette.accent} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: { paddingTop: 10, paddingHorizontal: 18, paddingBottom: 12, borderBottomWidth: 1 },
  monthNavRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 20 },
  navBtn: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  weekRow: { flexDirection: "row" },
  miniCell: { flex: 1, aspectRatio: 1.15, alignItems: "center", justifyContent: "center" },
  miniDay: { width: "82%", height: "82%", borderRadius: 7, alignItems: "center", justifyContent: "center" },
  miniSplit: { ...StyleSheet.absoluteFill, flexDirection: "row", borderRadius: 7, overflow: "hidden" },
  miniMoonBadge: { position: "absolute", top: -2, right: -2, width: 7, height: 7, borderRadius: 3.5, backgroundColor: NEW_MOON_COLOR, borderWidth: 1 },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 14, marginTop: 10, flexWrap: "wrap" },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendSwatch: { width: 11, height: 11, borderRadius: 5.5 },
  moonDot: { backgroundColor: NEW_MOON_COLOR, borderWidth: 1 },

  feed: { padding: 18, paddingTop: 14, gap: 12 },
  card: { borderRadius: 18, padding: 14, borderWidth: 1 },
  cardTop: { flexDirection: "row", gap: 12 },
  swatch: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  swatchMoon: { width: 16, height: 16, borderRadius: 8, backgroundColor: NEW_MOON_COLOR, borderWidth: 1.5 },
  headingRow: { flexDirection: "row", alignItems: "flex-end", flexWrap: "wrap" },
  badge: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 2 },
  learnRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 10, alignSelf: "flex-start" },
});
