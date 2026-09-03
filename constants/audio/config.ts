/**
 * Central place for the premium narration CDN location, so it can change
 * (dev → prod, or CDN migration) without touching every call site. No
 * chapters exist at either URL yet — PremiumNarrationService's metadata
 * fetch simply returns null (chapterAudioUnavailable) until the backend
 * generation pipeline has uploaded a chapter, at which point that chapter
 * lights up automatically with no app changes required.
 */

export type AudioEnvironment = "development" | "production";

const ENVIRONMENT: AudioEnvironment = __DEV__ ? "development" : "production";

const AUDIO_BASE_URL: Record<AudioEnvironment, string> = {
  development: "https://dev-audio.twelvescentspublishing.com",
  production: "https://audio.twelvescentspublishing.com",
};

/** Matches the AudioBible/<Book>/<Book>_<chapter>.* layout from the production
 * pipeline. Book names with spaces/punctuation (e.g. "1 Samuel", "Ecclesiasticus
 * (Sirach)") are slugged the same way on both the client and the backend pipeline
 * — keep the two in sync if this changes. */
export function audioBookSlug(book: string): string {
  return book
    .replace(/[()]/g, "")
    .trim()
    .replace(/\s+/g, "_");
}

function chapterFileStem(book: string, chapter: number): string {
  return `${audioBookSlug(book)}_${String(chapter).padStart(3, "0")}`;
}

export const AudioConfiguration = {
  environment: ENVIRONMENT,
  baseUrl: AUDIO_BASE_URL[ENVIRONMENT],

  /** Where a chapter's audio file lives, given the filename recorded in its metadata. */
  audioFileUrl(book: string, filename: string): string {
    return `${AUDIO_BASE_URL[ENVIRONMENT]}/${audioBookSlug(book)}/${filename}`;
  },

  /** Where a chapter's verse-timing metadata JSON lives. */
  metadataUrl(book: string, chapter: number): string {
    return `${AUDIO_BASE_URL[ENVIRONMENT]}/${audioBookSlug(book)}/${chapterFileStem(book, chapter)}.json`;
  },
};
