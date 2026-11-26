import { SCENE_SOUND_FILES } from "./sceneSoundFiles";

/**
 * Scene sounds: a quiet ambient layer under the narration for chosen scenes — only some
 * passages have one. A cue plays while the narration is inside its verse range, so the
 * layer follows the voice and never depends on the voice recording's timing.
 */
export interface SceneCue {
  /** A sound id: the file name (no extension) in assets/scene-sounds. */
  sound: string;
  fromVerse: number;
  toVerse: number;
  /** 0–1, relative to full volume. Keep it low — this sits under the voice. */
  volume: number;
  /** Repeat while the cue is active (default). false = play once when the verse begins. */
  loop?: boolean;
  /** Start this long after the verse begins (e.g. "we have piped" … then "we have mourned"). */
  delayMs?: number;
  fadeInMs?: number;
  fadeOutMs?: number;
}

/** Cue sheets, keyed "<Book> <chapter>". Only passages listed here have scene sounds. */
export const SCENE_CUES: Record<string, SceneCue[]> = {
  // The creation: wind and water, light, sea, plants, birds and fish, animals.
  "Genesis 1": [
    { sound: "wind-over-water", fromVerse: 2, toVerse: 2, volume: 0.3, fadeInMs: 1500 },
    { sound: "light-shimmer", fromVerse: 3, toVerse: 3, volume: 0.35, loop: false, delayMs: 1800 },
    { sound: "wind-high", fromVerse: 6, toVerse: 8, volume: 0.25, fadeInMs: 1500 },
    { sound: "ocean-waves", fromVerse: 9, toVerse: 10, volume: 0.3, fadeInMs: 1500 },
    { sound: "leaves-breeze", fromVerse: 11, toVerse: 13, volume: 0.25, fadeInMs: 1500 },
    { sound: "birds-dawn", fromVerse: 20, toVerse: 23, volume: 0.28, fadeInMs: 1500 },
    { sound: "water-splash", fromVerse: 21, toVerse: 21, volume: 0.35, loop: false },
    { sound: "animals-field", fromVerse: 24, toVerse: 25, volume: 0.26, fadeInMs: 1500 },
    { sound: "birds-dawn", fromVerse: 31, toVerse: 31, volume: 0.2, fadeInMs: 2000, fadeOutMs: 2500 },
  ],
  // The children in the marketplace: crowd and play, the pipe, the mourning, the feast.
  "Matthew 11": [
    { sound: "marketplace-crowd", fromVerse: 16, toVerse: 19, volume: 0.28, fadeInMs: 1500 },
    { sound: "children-playing", fromVerse: 16, toVerse: 17, volume: 0.25, fadeInMs: 1500 },
    { sound: "shepherd-pipe", fromVerse: 17, toVerse: 17, volume: 0.35, loop: false },
    { sound: "mourning-wail", fromVerse: 17, toVerse: 17, volume: 0.22, delayMs: 5000, fadeInMs: 1800 },
    { sound: "desert-wind", fromVerse: 18, toVerse: 18, volume: 0.26, fadeInMs: 1500 },
    { sound: "banquet-chatter", fromVerse: 19, toVerse: 19, volume: 0.28, fadeInMs: 1500, fadeOutMs: 2500 },
  ],
};

/** The cues for a chapter whose sound files are actually installed. */
export function sceneCuesFor(book: string, chapter: number): SceneCue[] {
  return (SCENE_CUES[`${book} ${chapter}`] ?? []).filter((cue) => cue.sound in SCENE_SOUND_FILES);
}

export function sceneSoundSource(sound: string): number | undefined {
  return SCENE_SOUND_FILES[sound];
}
