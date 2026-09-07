import React, { useState } from "react";
import { View, Pressable, Modal, StyleSheet, ScrollView } from "react-native";
import { OverlaySafeArea } from "@/components/OverlaySafeArea";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";
import { BOOKS_PICKER, isChapterLoaded, bookLabel, sectionLabel, BookInfo } from "@/constants/bible/books";

export function BookPicker() {
  const { palette, showBookPicker, setShowBookPicker, goTo, showToast, language, t } = useApp();
  const [pickerBook, setPickerBook] = useState<BookInfo | null>(null);

  function close() {
    setShowBookPicker(false);
    setPickerBook(null);
  }

  function onPickBook(book: BookInfo) {
    if (!book.available) {
      showToast(t("Full text coming soon"));
      return;
    }
    setPickerBook(book);
  }

  function onPickChapter(book: string, chapter: number, available: boolean) {
    if (!available) {
      showToast(t("Chapter text coming soon"));
      return;
    }
    goTo(book, chapter);
    close();
  }

  return (
    <Modal visible={showBookPicker} animationType="fade" onRequestClose={close}>
      <OverlaySafeArea style={[styles.container, { backgroundColor: palette.bg }]}>
        <View style={[styles.header, { backgroundColor: palette.card, borderBottomColor: palette.divider }]}>
          <View style={styles.headerLeft}>
            {pickerBook ? (
              <Pressable onPress={() => setPickerBook(null)} style={[styles.roundBtn, { backgroundColor: palette.track }]}>
                <Ionicons name="chevron-back" size={18} color={palette.text} />
              </Pressable>
            ) : null}
            <AppText variant="serifBold" size={19}>
              {pickerBook ? bookLabel(pickerBook.name, language) : t("Books")}
            </AppText>
          </View>
          <Pressable onPress={close} style={[styles.roundBtn, { backgroundColor: palette.track }]}>
            <AppText size={14}>⌄</AppText>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {pickerBook ? (
            <View style={styles.grid}>
              {Array.from({ length: pickerBook.count }, (_, i) => i + 1).map((ch) => {
                const available = isChapterLoaded(pickerBook.name, ch);
                return (
                  <Pressable
                    key={ch}
                    onPress={() => onPickChapter(pickerBook.name, ch, available)}
                    style={[
                      styles.chapterCell,
                      {
                        backgroundColor: available ? palette.accent : palette.cardAlt,
                        opacity: available ? 1 : 0.45,
                      },
                    ]}
                  >
                    <AppText variant="sansBold" size={15} color={available ? "#fff" : palette.textDim}>
                      {ch}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          ) : (
            BOOKS_PICKER.map((sec) => (
              <View key={sec.section} style={{ marginBottom: 16 }}>
                <AppText variant="sansExtraBold" size={11} dim style={{ letterSpacing: 1, paddingVertical: 6 }}>
                  {sectionLabel(sec.section, language).toUpperCase()}
                </AppText>
                {sec.books.map((b) => (
                  <Pressable
                    key={b.name}
                    onPress={() => onPickBook(b)}
                    style={[styles.bookRow, { opacity: b.available ? 1 : 0.45 }]}
                  >
                    <AppText variant="sans" size={15}>
                      {bookLabel(b.name, language)}
                    </AppText>
                    <AppText variant="sansBold" size={13} dim>
                      {b.count}
                    </AppText>
                  </Pressable>
                ))}
              </View>
            ))
          )}
        </ScrollView>
      </OverlaySafeArea>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexShrink: 0,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  roundBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { padding: 18, paddingTop: 10, paddingBottom: 30 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chapterCell: {
    width: "17.5%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  bookRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 2,
  },
});
