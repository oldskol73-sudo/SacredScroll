/**
 * Shared types for the Bible narration system (Twelve Scents premium narrator +
 * Apple Reader fallback). These are pure data shapes with no dependency on any
 * specific playback engine (react-native-track-player, expo-speech, etc.) so the
 * service layer and UI can be built/tested against them independently.
 */

/** Which engine is producing audio for the current playback session. */
export type NarrationSource = "premium" | "apple";

/** A selectable voice. Premium narrators come from the backend catalog; Apple
 * voices come from the device's installed AVSpeechSynthesisVoice list (surfaced
 * through expo-speech). Both are presented through the same picker UI. */
export interface Narrator {
  id: string;
  source: NarrationSource;
  name: string;
  /** e.g. "Twelve Scents Narrator" for premium, or the voice's language/locale
   * label ("English (United States)") for Apple voices. */
  description: string;
  /** Apple voices only — the underlying expo-speech/AVSpeechSynthesisVoice identifier. */
  appleVoiceIdentifier?: string;
  /** Apple voices only — surfaced so the picker can prefer Enhanced voices over Default.
   * Mirrors expo-speech's VoiceQuality enum. */
  appleQuality?: "default" | "enhanced";
}

/** One verse's position within its chapter's audio file, in seconds. */
export interface VerseTiming {
  verse: number;
  start: number;
  end: number;
}

/** Per-chapter narration metadata, one record per (book, chapter, narrator version).
 * Mirrors the JSON sidecar produced by the backend generation pipeline and fetched
 * alongside the audio file — this is the production data structure, not the app's
 * scripture database. */
export interface ChapterAudioMetadata {
  book: string;
  chapter: number;
  /** Filename only (e.g. "Deuteronomy_028.m4a"); resolved against AudioConfiguration's
   * base URL for streaming, or against the local download directory once downloaded. */
  audioFile: string;
  /** Total chapter audio duration in seconds. */
  duration: number;
  /** Which generation pass produced this audio, e.g. "narrator_v1". Lets individual
   * chapters be regenerated/replaced without invalidating the whole catalog. */
  version: string;
  narratorId: string;
  verses: VerseTiming[];
}

/** Live playback/transport state, independent of which NarrationSource is active. */
export type NarrationPlaybackStatus = "idle" | "loading" | "buffering" | "playing" | "paused" | "stopped" | "error";

export const PLAYBACK_SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2] as const;
export type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number];

export type SleepTimerOption = "off" | "15" | "30" | "45" | "60" | "endOfChapter";

/** Persisted "where the listener left off" — restored as a "Continue Listening"
 * prompt, never auto-played. */
export interface PlaybackPosition {
  book: string;
  chapter: number;
  verse: number;
  positionSeconds: number;
  source: NarrationSource;
  narratorId: string;
  speed: PlaybackSpeed;
  updatedAt: number;
}

export type DownloadStatus = "not_downloaded" | "downloading" | "downloaded" | "failed";

/** One row in the local download manifest. Audio bytes live under the app's
 * Documents directory (see AudioDownloadManager) — this record is the metadata
 * describing what's there, so the UI can show a downloaded indicator without
 * re-reading the filesystem. */
export interface ChapterDownload {
  book: string;
  chapter: number;
  version: string;
  narratorId: string;
  localUri: string;
  fileSizeBytes: number;
  downloadedAt: number;
}

/** User-facing narration errors. Each maps to a friendly message in i18n; the
 * underlying technical detail (if any) is kept separately for logging. */
export type NarrationErrorCode =
  | "chapterAudioUnavailable"
  | "networkUnavailable"
  | "downloadFailed"
  | "invalidMetadata"
  | "voiceUnavailable"
  | "playbackFailed";

export class NarrationError extends Error {
  constructor(
    public code: NarrationErrorCode,
    message: string,
    public cause?: unknown
  ) {
    super(message);
    this.name = "NarrationError";
  }
}
