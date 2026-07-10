"use client";

import { useEffect, useRef } from "react";
import { useEngineStore } from "./useEngineStore";
import { engineClock } from "./engineClock";

/** Procedural audio: a low "chuff" on each power stroke (twice per revolution
 *  for a double-acting engine — here once per rev for the beam engine), plus
 *  a continuous boiler hiss modulated by steam pressure, and a soft metallic
 *  tick from the crank. All synthesized with the Web Audio API — no asset
 *  files. Honours the store's audioOn toggle. */
export function EngineAudio() {
  const audioOn = useEngineStore((s) => s.audioOn);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const hissGainRef = useRef<GainNode | null>(null);
  const lastChuffRef = useRef<number>(-1);
  const lastThetaRef = useRef<number>(0);

  useEffect(() => {
    if (!audioOn) {
      // tear down
      if (ctxRef.current) {
        ctxRef.current.close().catch(() => {});
        ctxRef.current = null;
        masterRef.current = null;
        hissGainRef.current = null;
      }
      return;
    }
    // set up
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = 0.0;
    master.connect(ctx.destination);
    masterRef.current = master;

    // Fade master in
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.45, ctx.currentTime + 0.4);

    // ---- Continuous boiler hiss (filtered noise) ----
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    const hissFilter = ctx.createBiquadFilter();
    hissFilter.type = "bandpass";
    hissFilter.frequency.value = 3200;
    hissFilter.Q.value = 0.7;
    const hissGain = ctx.createGain();
    hissGain.gain.value = 0.04;
    noise.connect(hissFilter);
    hissFilter.connect(hissGain);
    hissGain.connect(master);
    noise.start();
    hissGainRef.current = hissGain;

    return () => {
      try {
        noise.stop();
      } catch {
        /* noop */
      }
      ctx.close().catch(() => {});
      ctxRef.current = null;
      masterRef.current = null;
      hissGainRef.current = null;
    };
  }, [audioOn]);

  // Per-frame: trigger chuffs at TDC crossings, modulate hiss by pressure.
  useEffect(() => {
    if (!audioOn) return;
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const ctx = ctxRef.current;
      const master = masterRef.current;
      const hissGain = hissGainRef.current;
      if (!ctx || !master || !hissGain) return;

      // Modulate hiss by steam pressure
      const sp = useEngineStore.getState().steamPressure;
      const targetHiss = 0.02 + sp * 0.06;
      hissGain.gain.setTargetAtTime(targetHiss, ctx.currentTime, 0.1);

      // Apply user volume to master gain
      const vol = useEngineStore.getState().audioVolume;
      master.gain.setTargetAtTime(vol * 0.6, ctx.currentTime, 0.05);

      // Chuff when theta crosses a multiple of 2π (one chuff per revolution).
      // For a more lively sound we also fire a softer chuff at π (BDC).
      const theta = engineClock.theta;
      const prev = lastThetaRef.current;
      const rpm = engineClock.rpm;
      // Detect crossing of 0 and π within (prev, theta]
      const crossed = (ang: number) => {
        const norm = (t: number) => ((t % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const a = norm(prev);
        const b = norm(theta);
        if (a <= b) return a < ang && ang <= b;
        // wrapped
        return ang > a || ang <= b;
      };
      const now = ctx.currentTime;
      if (rpm > 1) {
        if (crossed(0) && now - lastChuffRef.current > 0.08) {
          fireChuff(ctx, master, 1.0, rpm);
          lastChuffRef.current = now;
        } else if (crossed(Math.PI) && now - lastChuffRef.current > 0.08) {
          fireChuff(ctx, master, 0.45, rpm);
          lastChuffRef.current = now;
        }
      }
      lastThetaRef.current = theta;
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [audioOn]);

  return null;
}

/** Synthesize a single "chuff" — a short percussive burst with a low
 *  thump (sine sweep) + a bit of noise for the steam release. */
function fireChuff(
  ctx: AudioContext,
  dest: AudioNode,
  intensity: number,
  rpm: number,
) {
  const t = ctx.currentTime;
  // Low thump: sine sweeping 180→60 Hz
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(180, t);
  osc.frequency.exponentialRampToValueAtTime(55, t + 0.18);
  const oscGain = ctx.createGain();
  const vol = 0.5 * intensity * Math.min(1, 0.4 + rpm / 60);
  oscGain.gain.setValueAtTime(0.0001, t);
  oscGain.gain.exponentialRampToValueAtTime(vol, t + 0.012);
  oscGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
  osc.connect(oscGain);
  oscGain.connect(dest);
  osc.start(t);
  osc.stop(t + 0.32);

  // Steam burst: short noise puff through highpass
  const bufferSize = 0.15 * ctx.sampleRate;
  const buf = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    d[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 1800;
  const ng = ctx.createGain();
  ng.gain.value = 0.18 * intensity;
  src.connect(hp);
  hp.connect(ng);
  ng.connect(dest);
  src.start(t);
}
