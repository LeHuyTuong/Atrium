/**
 * AudioEngine — client-side ambient hum + procedural sound effects.
 *
 * All audio is synthesized at runtime with the Web Audio API; no audio files.
 * - Ambient: two detuned brown-noise sources → lowpass 200Hz → gain 0.04,
 *   plus one 60Hz sine sub-bass at gain 0.02. Warm museum-room hum.
 * - Effects: open (C5+E5 chime), navigate (filtered noise sweep),
 *   bookmark (880Hz click), success (C5-E5-G5 arpeggio), close (200Hz thunk).
 *
 * NOTE: This module uses `window` / `AudioContext` and must only be invoked
 * from client components. The class itself is framework-agnostic.
 */

type AnyAudioContextCtor = typeof AudioContext;

function getAudioContextCtor(): AnyAudioContextCtor | null {
  if (typeof window === "undefined") return null;
  return (
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: AnyAudioContextCtor })
      .webkitAudioContext ||
    null
  );
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientNodes: AudioNode[] = [];
  private _muted: boolean = true; // start muted (avoid surprise audio)
  private _ambientOn: boolean = false;

  get muted(): boolean {
    return this._muted;
  }
  get ambientOn(): boolean {
    return this._ambientOn;
  }

  /**
   * Lazily create the AudioContext on first user gesture (browser autoplay
   * policy). Safe to call multiple times — also resumes a suspended context.
   */
  init(): void {
    if (typeof window === "undefined") return;
    const Ctor = getAudioContextCtor();
    if (!Ctor) return;
    if (this.ctx) {
      if (this.ctx.state === "suspended") {
        void this.ctx.resume().catch(() => {
          /* ignore */
        });
      }
      return;
    }
    const ctx = new Ctor();
    const masterGain = ctx.createGain();
    masterGain.gain.value = this._muted ? 0 : 0.4;
    masterGain.connect(ctx.destination);
    this.ctx = ctx;
    this.masterGain = masterGain;

    // If ambient was requested before init (e.g. persisted state), start now.
    if (this._ambientOn) {
      this.startAmbient();
    }
  }

  /** Toggle master mute. Ramp gain smoothly to avoid clicks. */
  setMuted(m: boolean): void {
    this._muted = m;
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      const cur = this.masterGain.gain.value;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(cur, now);
      this.masterGain.gain.linearRampToValueAtTime(m ? 0 : 0.4, now + 0.06);
    }
    // When unmuting, if ambient flag is on but nodes aren't running (e.g. they
    // were never started because audio wasn't initialized), start them.
    if (!m && this._ambientOn && this.ambientNodes.length === 0) {
      this.startAmbient();
    }
  }

  /** Start or stop the ambient hum. */
  setAmbient(on: boolean): void {
    this._ambientOn = on;
    if (on) {
      // Need an AudioContext to actually produce sound.
      this.init();
      this.startAmbient();
    } else {
      this.stopAmbient();
    }
  }

  // ── Ambient implementation ────────────────────────────────────────────

  private startAmbient(): void {
    if (!this.ctx || !this.masterGain) return;
    if (this.ambientNodes.length > 0) return; // already running

    const ctx = this.ctx;
    const ambientGain = ctx.createGain();
    ambientGain.gain.value = 1;
    ambientGain.connect(this.masterGain);
    this.ambientGain = ambientGain;

    // Brown-noise layer: 2 detuned sources → lowpass 200Hz → gain 0.04
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 200;
    lp.Q.value = 0.5;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.04;

    lp.connect(noiseGain).connect(ambientGain);

    const buf1 = this.makeBrownNoiseBuffer(4);
    const buf2 = this.makeBrownNoiseBuffer(4);
    const src1 = ctx.createBufferSource();
    src1.buffer = buf1;
    src1.loop = true;
    src1.playbackRate.value = 1.0;
    src1.connect(lp);
    src1.start();

    const src2 = ctx.createBufferSource();
    src2.buffer = buf2;
    src2.loop = true;
    src2.playbackRate.value = 1.003; // subtle detune → phasing
    src2.connect(lp);
    src2.start();

    // Sub-bass rumble: 60Hz sine at gain 0.02
    const sub = ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.value = 60;
    const subGain = ctx.createGain();
    subGain.gain.value = 0.02;
    sub.connect(subGain).connect(ambientGain);
    sub.start();

    this.ambientNodes = [src1, src2, lp, noiseGain, sub, subGain];
  }

  private stopAmbient(): void {
    if (this.ambientNodes.length === 0) {
      this.ambientGain = null;
      return;
    }
    for (const n of this.ambientNodes) {
      try {
        if (n instanceof AudioBufferSourceNode || n instanceof OscillatorNode) {
          n.stop();
        }
      } catch {
        /* already stopped */
      }
      try {
        n.disconnect();
      } catch {
        /* already disconnected */
      }
    }
    this.ambientNodes = [];
    if (this.ambientGain) {
      try {
        this.ambientGain.disconnect();
      } catch {
        /* noop */
      }
      this.ambientGain = null;
    }
  }

  /** Generate ~seconds of bounded brown noise. */
  private makeBrownNoiseBuffer(seconds: number): AudioBuffer {
    const ctx = this.ctx!;
    const length = Math.max(1, Math.floor(ctx.sampleRate * seconds));
    const buf = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      // Leaky integrator → bounded brown noise.
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
    return buf;
  }

  // ── Sound effects ─────────────────────────────────────────────────────

  /** Skip effects when muted or when the user prefers reduced motion. */
  private shouldPlayEffect(): boolean {
    if (this._muted) return false;
    if (prefersReducedMotion()) return false;
    return true;
  }

  /** Soft chime: 2 sine oscillators (C5 + E5) through 2kHz lowpass, 0.4s decay. */
  playOpen(): void {
    if (!this.shouldPlayEffect()) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 2000;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.15, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

    lp.connect(g).connect(this.masterGain);

    for (const freq of [523.25, 659.25]) {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = freq;
      o.connect(lp);
      o.start(now);
      o.stop(now + 0.45);
    }
  }

  /** Whoosh: 0.3s filtered noise, bandpass sweeping 400Hz → 2000Hz. */
  playNavigate(): void {
    if (!this.shouldPlayEffect()) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const dur = 0.3;

    const length = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource();
    src.buffer = buf;

    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 1.0;
    bp.frequency.setValueAtTime(400, now);
    bp.frequency.exponentialRampToValueAtTime(2000, now + dur);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.08, now + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    src.connect(bp).connect(g).connect(this.masterGain);
    src.start(now);
    src.stop(now + dur + 0.05);
  }

  /** Click: 880Hz sine, 0.1s decay. */
  playBookmark(): void {
    if (!this.shouldPlayEffect()) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = 880;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.1, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

    o.connect(g).connect(this.masterGain);
    o.start(now);
    o.stop(now + 0.15);
  }

  /** Success chord: C5 (0s) → E5 (0.1s) → G5 (0.2s) arpeggio, each 0.4s sine. */
  playSuccess(): void {
    if (!this.shouldPlayEffect()) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const notes = [
      { f: 523.25, t: 0 },
      { f: 659.25, t: 0.1 },
      { f: 783.99, t: 0.2 },
    ];
    for (const { f, t } of notes) {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, now + t);
      g.gain.linearRampToValueAtTime(0.12, now + t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.4);
      o.connect(g).connect(this.masterGain);
      o.start(now + t);
      o.stop(now + t + 0.45);
    }
  }

  /** Soft low thunk: 200Hz sine, 0.15s decay. */
  playClose(): void {
    if (!this.shouldPlayEffect()) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = 200;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.1, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

    o.connect(g).connect(this.masterGain);
    o.start(now);
    o.stop(now + 0.2);
  }
}

export const audio = new AudioEngine();
