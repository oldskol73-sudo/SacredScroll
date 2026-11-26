import { useEffect, useRef } from "react";
import { SceneSoundsService } from "@/services/sceneSoundsService";
import type { NarrationPlaybackStatus } from "@/constants/audio/types";

interface NarrationLike {
  status: NarrationPlaybackStatus;
  book: string | null;
  chapter: number | null;
  verse: number | null;
}

/** Keeps the scene-sound layer in step with the narration: starts and fades cues as the reader
 * moves through a scene, pauses with the voice, and stops when narration stops. */
export function useSceneSounds(narration: NarrationLike, enabled: boolean) {
  const service = useRef<SceneSoundsService | null>(null);
  if (!service.current) service.current = new SceneSoundsService();

  useEffect(() => {
    service.current!.setEnabled(enabled);
  }, [enabled]);

  const { status, book, chapter, verse } = narration;
  useEffect(() => {
    const s = service.current!;
    if (status === "idle" || status === "stopped" || status === "error") {
      s.setChapter(null, null);
      return;
    }
    s.setChapter(book, chapter);
    s.setVerse(verse);
    s.setPaused(status === "paused");
  }, [status, book, chapter, verse]);

  useEffect(() => () => service.current?.setChapter(null, null), []);
}
