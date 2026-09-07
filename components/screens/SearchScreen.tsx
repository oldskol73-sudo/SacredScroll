import React, { useMemo, useState } from "react";
import { View, TextInput, Pressable, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";
import { searchVerses, SearchMatch } from "@/constants/bible/verses";
import { ALL_BOOKS, BOOKS_PICKER, BookSection, bookLabel, displayRef } from "@/constants/bible/books";

const SUGGESTED_EN = ["love", "faith", "shepherd", "light", "born again"];
const SUGGESTED_ES = ["amor", "fe", "pastor", "luz", "nacer de nuevo"];
const SUGGESTED_HT = ["renmen", "lafwa", "gadò", "limyè", "dezyèm fwa"];

type ScopeType = "full" | "current" | BookSection;
type Dropdown = "scope" | "book" | null;

const SECTION_LABEL_EN: Record<BookSection, string> = {
  "Old Testament": "OT",
  "New Testament": "NT",
  Apocrypha: "Apocrypha",
};
const SECTION_LABEL_ES: Record<BookSection, string> = {
  "Old Testament": "AT",
  "New Testament": "NT",
  Apocrypha: "Apócrifos",
};
const SECTION_LABEL_HT: Record<BookSection, string> = {
  "Old Testament": "AT",
  "New Testament": "NT",
  Apocrypha: "Apokrif",
};

const BOOKS_BY_SECTION: Record<BookSection, string[]> = {
  "Old Testament": [],
  "New Testament": [],
  Apocrypha: [],
};
BOOKS_PICKER.forEach((sec) => {
  BOOKS_BY_SECTION[sec.section] = sec.books.map((b) => b.name);
});

export function SearchScreen() {
  const { palette, goTo, selectVerse, location, language, t } = useApp();
  const SECTION_LABEL = language === "es" ? SECTION_LABEL_ES : language === "ht" ? SECTION_LABEL_HT : SECTION_LABEL_EN;
  const [query, setQuery] = useState("");
  const [scopeType, setScopeType] = useState<ScopeType>("full");
  const [bookFilter, setBookFilter] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<Dropdown>(null);

  const effectiveBooks = bookFilter
    ? [bookFilter]
    : scopeType === "current"
      ? [location.book]
      : scopeType === "full"
        ? undefined
        : BOOKS_BY_SECTION[scopeType];

  const results = useMemo(() => searchVerses(query, effectiveBooks), [query, effectiveBooks]);

  function onResultTap(r: SearchMatch) {
    goTo(r.book, r.chapter);
    selectVerse(r.n);
  }

  function highlightedLine(r: SearchMatch) {
    const pre = r.text.slice(0, r.matchStart);
    const match = r.text.slice(r.matchStart, r.matchEnd);
    const post = r.text.slice(r.matchEnd);
    return (
      <AppText variant="serif" size={15} style={{ lineHeight: 22 }}>
        {pre}
        <AppText variant="serifBold" size={15} color="#fff" style={[styles.matchSpan, { backgroundColor: palette.accent }]}>
          {match}
        </AppText>
        {post}
      </AppText>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={[styles.searchBar, { backgroundColor: palette.card }]}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t("Search the KJV, notes…")}
          placeholderTextColor={palette.textDim}
          style={[styles.input, { color: palette.text }]}
        />
        {query.length > 0 ? (
          <Pressable onPress={() => setQuery("")}>
            <AppText dim size={15}>
              ✕
            </AppText>
          </Pressable>
        ) : null}
        <View style={[styles.searchIcon, { backgroundColor: palette.accent }]}>
          <Ionicons name="search" size={14} color="#fff" />
        </View>
      </View>

      <View style={styles.scopeRow}>
        <View style={{ flex: 1 }}>
          <Pressable
            onPress={() => setOpenDropdown(openDropdown === "scope" ? null : "scope")}
            style={[styles.scopeBtn, { backgroundColor: palette.card }]}
          >
            <AppText variant="sansBold" size={13} color={palette.accent}>
              {scopeType === "current"
                ? displayRef(location.book, location.chapter, language)
                : scopeType === "full"
                  ? t("Full Bible")
                  : SECTION_LABEL[scopeType]}
            </AppText>
            <Ionicons name={openDropdown === "scope" ? "chevron-up" : "chevron-down"} size={12} color={palette.accent} />
          </Pressable>
          {openDropdown === "scope" ? (
            <View style={[styles.dropdown, { backgroundColor: palette.card }]}>
              <Pressable
                onPress={() => {
                  setScopeType("full");
                  setOpenDropdown(null);
                }}
                style={[styles.dropdownRow, scopeType === "full" && { backgroundColor: palette.cardAlt }]}
              >
                <AppText variant="sansBold" size={13} color={palette.accent}>
                  {t("Full Bible")}
                </AppText>
              </Pressable>
              {(["Old Testament", "New Testament", "Apocrypha"] as BookSection[]).map((sec) => (
                <Pressable
                  key={sec}
                  onPress={() => {
                    setScopeType(sec);
                    setOpenDropdown(null);
                  }}
                  style={[styles.dropdownRow, scopeType === sec && { backgroundColor: palette.cardAlt }]}
                >
                  <AppText variant="sansBold" size={13}>
                    {SECTION_LABEL[sec]}
                  </AppText>
                </Pressable>
              ))}
              <Pressable
                onPress={() => {
                  setScopeType("current");
                  setOpenDropdown(null);
                }}
                style={[styles.dropdownRow, scopeType === "current" && { backgroundColor: palette.cardAlt }]}
              >
                <AppText size={13}>
                  {t("Current Book")} ({bookLabel(location.book, language)})
                </AppText>
              </Pressable>
            </View>
          ) : null}
        </View>

        <View style={{ flex: 1 }}>
          <Pressable
            onPress={() => setOpenDropdown(openDropdown === "book" ? null : "book")}
            style={[styles.scopeBtn, { backgroundColor: palette.card }]}
          >
            <AppText variant="sansBold" size={13} color={palette.accent}>
              {bookFilter ? bookLabel(bookFilter, language) : t("All Books")}
            </AppText>
            <Ionicons name="chevron-down" size={12} color={palette.accent} />
          </Pressable>
          {openDropdown === "book" ? (
            <View style={[styles.dropdown, { backgroundColor: palette.card }]}>
              <ScrollView style={{ maxHeight: 220 }}>
                <Pressable
                  onPress={() => {
                    setBookFilter(null);
                    setOpenDropdown(null);
                  }}
                  style={styles.dropdownRow}
                >
                  <AppText variant="sansBold" size={13} color={palette.accent}>
                    {t("All Books")}
                  </AppText>
                </Pressable>
                {ALL_BOOKS.map((b) => (
                  <Pressable
                    key={b.name}
                    onPress={() => {
                      setBookFilter(b.name);
                      setOpenDropdown(null);
                    }}
                    style={styles.dropdownRow}
                  >
                    <AppText size={13}>{bookLabel(b.name, language)}</AppText>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          ) : null}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} onScrollBeginDrag={() => setOpenDropdown(null)}>
        {!query ? (
          <View style={styles.emptyWrap}>
            <Ionicons name="search-outline" size={56} color={palette.textDim} />
            <AppText dim variant="sansBold" size={14} style={{ marginTop: 10 }}>
              {t("Enter a text to search")}
            </AppText>
            <View style={styles.chipRow}>
              {(language === "es" ? SUGGESTED_ES : language === "ht" ? SUGGESTED_HT : SUGGESTED_EN).map((s) => (
                <Pressable key={s} onPress={() => setQuery(s)} style={[styles.chip, { backgroundColor: palette.card }]}>
                  <AppText size={13} variant="sansBold">
                    {s}
                  </AppText>
                </Pressable>
              ))}
            </View>
          </View>
        ) : results.length === 0 ? (
          <AppText dim>
            {t("No results for")} "{query}"
          </AppText>
        ) : (
          results.map((r) => (
            <Pressable
              key={r.ref}
              onPress={() => onResultTap(r)}
              style={[styles.resultCard, { backgroundColor: palette.card }]}
            >
              <AppText variant="sansExtraBold" size={11} color={palette.accent}>
                {displayRef(r.book, r.chapter, language)}:{r.n}
              </AppText>
              {highlightedLine(r)}
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, paddingHorizontal: 20, paddingTop: 16, gap: 12 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 28,
    paddingLeft: 20,
    paddingRight: 6,
    paddingVertical: 6,
  },
  input: { flex: 1, fontSize: 15, paddingVertical: 10 },
  searchIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  scopeRow: { flexDirection: "row", gap: 10, zIndex: 5 },
  scopeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: 6,
    borderRadius: 16,
    zIndex: 20,
    overflow: "hidden",
  },
  dropdownRow: { paddingVertical: 11, paddingHorizontal: 16 },
  content: { paddingTop: 10, paddingBottom: 120, gap: 12 },
  emptyWrap: { alignItems: "center", gap: 14, paddingTop: 40 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "center" },
  chip: { borderRadius: 14, paddingVertical: 8, paddingHorizontal: 14 },
  resultCard: { borderRadius: 16, padding: 14, gap: 6 },
  matchSpan: { borderRadius: 4, paddingHorizontal: 3 },
});
