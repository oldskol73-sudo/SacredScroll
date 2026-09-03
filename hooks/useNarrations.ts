import { id } from "@instantdb/react-native";
import { db } from "@/lib/db";

export function useNarrations(userId?: string) {
  const { data, isLoading } = db.useQuery(
    userId ? { narrations: { audioFile: {} } } : null
  );
  const narrations = data?.narrations || [];

  function narrationFor(book: string, chapter: number) {
    const key = `${book} ${chapter}`;
    return narrations.find((n) => n.bookChapter === key);
  }

  async function uploadNarration(book: string, chapter: number, uri: string, name: string, mimeType?: string) {
    if (!userId) return;
    const key = `${book} ${chapter}`;
    const res = await fetch(uri);
    const blob = await res.blob();
    const path = `narrations/${userId}/${key}-${Date.now()}-${name}`;
    const { data: uploaded } = await db.storage.uploadFile(path, blob, {
      contentType: mimeType || "audio/mpeg",
    });

    const existing = narrationFor(book, chapter);
    if (existing) {
      db.transact(db.tx.narrations[existing.id].update({ name }).link({ audioFile: uploaded.id }));
    } else {
      const newId = id();
      db.transact(
        db.tx.narrations[newId]
          .update({ bookChapter: key, name })
          .link({ owner: userId, audioFile: uploaded.id })
      );
    }
  }

  function removeNarration(book: string, chapter: number) {
    const existing = narrationFor(book, chapter);
    if (existing) db.transact(db.tx.narrations[existing.id].delete());
  }

  return { isLoading, narrations, narrationFor, uploadNarration, removeNarration };
}
