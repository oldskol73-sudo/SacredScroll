import { Platform } from "react-native";
import * as Speech from "expo-speech";
import { versesFor, verseText } from "@/constants/bible/verses";
import { normalizeForNarration } from "@/constants/audio/narrationText";
import { Narrator, NarrationErrorCode, NarrationError, NarrationPlaybackStatus, PlaybackSpeed } from "@/constants/audio/types";

export interface AppleReaderCallbacks {
  onVerseChange?: (verse: number) => void;
  onStatusChange?: (status: NarrationPlaybackStatus) => void;
  onChapterDone?: () => void;
  onError?: (error: NarrationError) => void;
}

/**
 * Offline text-to-speech fallback, reading this app's own scripture text
 * (never a separate copy) verse by verse via AVSpeechSynthesizer (through
 * expo-speech). Verse boundaries come from chunking speech into one utterance
 * per verse and advancing on `onDone` — no timestamp metadata needed, unlike
 * the premium narrator path.
 */
export class AppleReaderService {
  private callbacks: AppleReaderCallbacks;
  private book: string | null = null;
  private chapter: number | null = null;
  private verseNumbers: number[] = [];
  private verseIndex = 0;
  private voiceIdentifier: string | undefined;
  private rate: PlaybackSpeed = 1;
  // Bumped on every stop/seek so late callbacks from a superseded utterance are ignored.
  private generation = 0;

  constructor(callbacks: AppleReaderCallbacks = {}) {
    this.callbacks = callbacks;
  }

  /** Installed English voices, Enhanced-quality ones first. Never assumes a
   * specific named voice exists — callers should fall back to no `voice` set
   * (system default) if this list is empty. */
  static async getAvailableVoices(): Promise<Narrator[]> {
    const voices = await Speech.getAvailableVoicesAsync();
    return voices
      .filter((v) => v.language?.toLowerCase().startsWith("en"))
      .map(
        (v): Narrator => ({
          id: v.identifier,
          source: "apple",
          name: v.name,
          description: v.language,
          appleVoiceIdentifier: v.identifier,
          appleQuality: v.quality === Speech.VoiceQuality.Enhanced ? "enhanced" : "default",
        })
      )
      .sort((a, b) => Number(b.appleQuality === "enhanced") - Number(a.appleQuality === "enhanced"));
  }

  setVoice(voiceIdentifier: string | undefined) {
    this.voiceIdentifier = voiceIdentifier;
  }

  /** Takes effect from the next verse onward — expo-speech can't change the
   * rate of an utterance already in flight. */
  setRate(rate: PlaybackSpeed) {
    this.rate = rate;
  }

  get currentVerse(): number | null {
    return this.verseNumbers[this.verseIndex] ?? null;
  }

  /** Starts reading a chapter aloud from its first verse, or from `fromVerse`
   * ("Start Reading Here"), continuing forward automatically. */
  playChapter(book: string, chapter: number, fromVerse?: number) {
    const verses = versesFor(book, chapter);
    if (!verses.length) {
      this.fail("chapterAudioUnavailable", `No scripture text for ${book} ${chapter}`);
      return;
    }
    this.book = book;
    this.chapter = chapter;
    this.verseNumbers = verses.map((v) => v.n);
    const startIdx = fromVerse != null ? this.verseNumbers.indexOf(fromVerse) : 0;
    this.verseIndex = Math.max(0, startIdx);
    this.generation++;
    this.setStatus("loading");
    this.speakCurrentVerse();
  }

  /** Reads exactly one verse aloud and stops ("Read Verse"). */
  playVerseOnly(book: string, chapter: number, verse: number) {
    const target = verseText(book, chapter, verse);
    if (!target) {
      this.fail("chapterAudioUnavailable", `No scripture text for ${book} ${chapter}:${verse}`);
      return;
    }
    this.book = book;
    this.chapter = chapter;
    this.verseNumbers = [verse];
    this.verseIndex = 0;
    this.generation++;
    this.setStatus("loading");
    this.speakCurrentVerse();
  }

  async pause() {
    if (Platform.OS !== "ios") {
      // expo-speech pause/resume is iOS-only; degrade to a full stop on Android.
      await this.stop();
      return;
    }
    await Speech.pause();
    this.setStatus("paused");
  }

  async resume() {
    if (Platform.OS !== "ios") {
      this.speakCurrentVerse();
      return;
    }
    await Speech.resume();
    this.setStatus("playing");
  }

  async stop() {
    // Reset state before the await: playChapter is often called synchronously
    // right after stop(), and clearing these fields after the await would wipe
    // the new chapter's state mid-playback (leaving onDone unable to advance
    // past the first verse).
    this.generation++;
    this.book = null;
    this.chapter = null;
    this.verseNumbers = [];
    this.verseIndex = 0;
    this.setStatus("stopped");
    await Speech.stop();
  }

  nextVerse() {
    if (this.verseIndex >= this.verseNumbers.length - 1) return;
    this.generation++;
    Speech.stop();
    this.verseIndex++;
    this.speakCurrentVerse();
  }

  previousVerse() {
    if (this.verseIndex <= 0) return;
    this.generation++;
    Speech.stop();
    this.verseIndex--;
    this.speakCurrentVerse();
  }

  private speakCurrentVerse() {
    if (!this.book || this.chapter == null) return;
    const verse = this.currentVerse;
    if (verse == null) {
      this.setStatus("stopped");
      this.callbacks.onChapterDone?.();
      return;
    }
    const text = verseText(this.book, this.chapter, verse);
    const gen = this.generation;
    this.callbacks.onVerseChange?.(verse);
    Speech.speak(normalizeForNarration(text), {
      voice: this.voiceIdentifier,
      rate: this.rate,
      onStart: () => {
        if (gen !== this.generation) return;
        this.setStatus("playing");
      },
      onDone: () => {
        if (gen !== this.generation) return;
        this.verseIndex++;
        this.speakCurrentVerse();
      },
      onStopped: () => {
        if (gen !== this.generation) return;
        this.setStatus("stopped");
      },
      onError: (error) => {
        if (gen !== this.generation) return;
        this.fail("playbackFailed", error.message, error);
      },
    });
  }

  private setStatus(status: NarrationPlaybackStatus) {
    this.callbacks.onStatusChange?.(status);
  }

  private fail(code: NarrationErrorCode, message: string, cause?: unknown) {
    this.setStatus("error");
    this.callbacks.onError?.(new NarrationError(code, message, cause));
  }
}
