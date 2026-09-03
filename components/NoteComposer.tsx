import React, { useState, useEffect } from "react";
import { View, Pressable, Modal, TextInput, StyleSheet } from "react-native";
import { useApp } from "@/context/AppContext";
import { AppText } from "@/components/AppText";
import { displayRef } from "@/constants/bible/books";

export function NoteComposer() {
  const { palette, location, selectedVerse, showNoteComposer, setShowNoteComposer, notes, showToast, language, t } = useApp();
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (showNoteComposer) setDraft("");
  }, [showNoteComposer]);

  if (selectedVerse === null) return null;
  const ref = `${displayRef(location.book, location.chapter, language)}:${selectedVerse}`;

  function close() {
    setShowNoteComposer(false);
  }

  function save() {
    if (!draft.trim() || selectedVerse === null) return;
    notes.addNote(location.book, location.chapter, selectedVerse, draft);
    showToast(t("Note saved"));
    setShowNoteComposer(false);
  }

  return (
    <Modal visible={showNoteComposer} transparent animationType="fade" onRequestClose={close}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: palette.card }]}>
          <View style={styles.headerRow}>
            <AppText variant="sansExtraBold" size={15}>
              {t("Note on")} {ref}
            </AppText>
            <Pressable onPress={close}>
              <AppText size={18} dim>
                ✕
              </AppText>
            </Pressable>
          </View>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder={t("Write your thoughts…")}
            placeholderTextColor={palette.textDim}
            multiline
            style={[
              styles.input,
              { backgroundColor: palette.cardAlt, borderColor: palette.divider, color: palette.text },
            ]}
          />
          <Pressable
            onPress={save}
            style={[styles.saveBtn, { backgroundColor: palette.accent }]}
          >
            <AppText variant="sansExtraBold" size={14} color="#fff">
              {t("Save Note")}
            </AppText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(60,52,30,.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 20,
    paddingBottom: 30,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  input: {
    minHeight: 110,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    textAlignVertical: "top",
  },
  saveBtn: {
    marginTop: 12,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },
});
