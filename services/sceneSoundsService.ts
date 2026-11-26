import { createAudioPlayer, AudioPlayer } from "expo-audio";
import { SceneCue, sceneCuesFor, sceneSoundSource } from "@/constants/audio/sceneSounds";

const STEP_MS = 50;

interface ActiveCue {
  player: AudioPlayer;
  /** Pending delayed start, if the cue hasn't begun yet. */
  startTimer: ReturnType<typeof setTimeout> | null;
  /** Running volume ramp, if any. */
  ramp: ReturnType<typeof setInterval> | null;
  started: boolean;
}

/**
 * Plays the ambient layer for a chapter's scene cues underneath the narration. It only follows
 * what the narration reports (chapter, verse, paused) — it never touches the voice player, the
 * lock screen or the audio session, and every failure is swallowed so it can never break reading.
 */
export class SceneSoundsService {
  private chapterKey: string | null = null;
  private cues: SceneCue[] = [];
  private verse: number | null = null;
  private enabled = true;
  private paused = false;
  private active = new Map<SceneCue, ActiveCue>();

  setEnabled(on: boolean) {
    this.enabled = on;
    if (!on) this.stopAll();
    else this.apply();
  }

  setChapter(book: string | null, chapter: number | null) {
    const key = book && chapter != null ? `${book} ${chapter}` : null;
    if (key === this.chapterKey) return;
    this.stopAll();
    this.chapterKey = key;
    this.verse = null;
    this.cues = book && chapter != null ? sceneCuesFor(book, chapter) : [];
  }

  setVerse(verse: number | null) {
    this.verse = verse;
    this.apply();
  }

  setPaused(paused: boolean) {
    if (paused === this.paused) return;
    this.paused = paused;
    for (const entry of this.active.values()) {
      try {
        if (paused) entry.player.pause();
        else if (entry.started) entry.player.play();
      } catch {}
    }
    if (!paused) this.apply();
  }

  /** Fades everything out and releases the players (stop, chapter change, switch turned off). */
  stopAll() {
    for (const [cue, entry] of [...this.active]) this.release(cue, entry, cue.fadeOutMs ?? 800);
  }

  private apply() {
    if (!this.enabled || this.paused || this.verse == null) return;
    const verse = this.verse;
    const wanted = this.cues.filter((c) => verse >= c.fromVerse && verse <= c.toVerse);
    for (const cue of wanted) if (!this.active.has(cue)) this.start(cue);
    for (const [cue, entry] of [...this.active]) {
      if (!wanted.includes(cue)) this.release(cue, entry, cue.fadeOutMs ?? 1200);
    }
  }

  private start(cue: SceneCue) {
    const source = sceneSoundSource(cue.sound);
    if (source == null) return;
    try {
      const player = createAudioPlayer(source);
      player.loop = cue.loop !== false;
      player.volume = 0;
      const entry: ActiveCue = { player, startTimer: null, ramp: null, started: false };
      this.active.set(cue, entry);
      const begin = () => {
        entry.startTimer = null;
        if (!this.active.has(cue) || this.paused) {
          // Paused during the delay: start when playback resumes.
          if (this.active.has(cue)) entry.startTimer = setTimeout(begin, 250);
          return;
        }
        try {
          entry.started = true;
          player.play();
          this.ramp(entry, cue.volume, cue.fadeInMs ?? 1200);
        } catch {}
      };
      if (cue.delayMs) entry.startTimer = setTimeout(begin, cue.delayMs);
      else begin();
    } catch {}
  }

  private release(cue: SceneCue, entry: ActiveCue, fadeMs: number) {
    this.active.delete(cue);
    if (entry.startTimer) clearTimeout(entry.startTimer);
    const done = () => {
      try {
        entry.player.pause();
        entry.player.remove();
      } catch {}
    };
    if (!entry.started) return done();
    this.ramp(entry, 0, fadeMs, done);
  }

  private ramp(entry: ActiveCue, to: number, ms: number, onDone?: () => void) {
    if (entry.ramp) clearInterval(entry.ramp);
    const from = entry.player.volume;
    const steps = Math.max(1, Math.round(ms / STEP_MS));
    let i = 0;
    entry.ramp = setInterval(() => {
      i += 1;
      try {
        entry.player.volume = from + ((to - from) * i) / steps;
      } catch {}
      if (i >= steps) {
        if (entry.ramp) clearInterval(entry.ramp);
        entry.ramp = null;
        onDone?.();
      }
    }, STEP_MS);
  }
}
