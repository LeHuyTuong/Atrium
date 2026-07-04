"use client";

import { useEffect, useRef } from "react";
import { useEngineStore } from "./useEngineStore";
import { engineClock } from "./engineClock";

export function EngineAudio() {
  const audioOn = useEngineStore((s) => s.audioOn);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const lastChuffRef = useRef<number>(-1);
  const lastThetaRef = useRef<number>(0);

  useEffect(() => {
    if (!audioOn) {
      if (ctxRef.current) {
        ctxRef.current.close().catch(() => {});
        ctxRef.current = null;
        masterRef.current = null;
      }
      return;
    }
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

    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.4);

    return () => {
      ctx.close().catch(() => {});
      ctxRef.current = null;
      masterRef.current = null;
    };
  }, [audioOn]);

  useEffect(() => {
    if (!audioOn) return;
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const ctx = ctxRef.current;
      const master = masterRef.current;
      if (!ctx || !master) return;

      const rpm = engineClock.rpm;
      const vol = useEngineStore.getState().audioVolume || 0.6;
      master.gain.setTargetAtTime(vol * 0.3, ctx.currentTime, 0.05);

      const theta = engineClock.theta;
      const prev = lastThetaRef.current;
      const now = ctx.currentTime;
      if (rpm > 1) {
        const crossed = (ang: number) => {
          const norm = (t: number) => ((t % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
          const a = norm(prev);
          const b = norm(theta);
          if (a <= b) return a < ang && ang <= b;
          return ang > a || ang <= b;
        };
        if (crossed(0) && now - lastChuffRef.current > 0.06) {
          fireCombustion(ctx, master, rpm);
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

function fireCombustion(ctx: AudioContext, dest: AudioNode, rpm: number) {
  const t = ctx.currentTime;
  const baseFreq = 80 + (rpm / 8000) * 120;

  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(baseFreq, t);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, t + 0.15);
  const oscGain = ctx.createGain();
  const vol = 0.3 * Math.min(1, 0.3 + rpm / 4000);
  oscGain.gain.setValueAtTime(0.0001, t);
  oscGain.gain.exponentialRampToValueAtTime(vol, t + 0.008);
  oscGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
  osc.connect(oscGain);
  oscGain.connect(dest);
  osc.start(t);
  osc.stop(t + 0.25);

  const bufferSize = 0.08 * ctx.sampleRate;
  const buf = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 2000;
  const ng = ctx.createGain();
  ng.gain.value = 0.08 * Math.min(1, 0.3 + rpm / 4000);
  src.connect(hp);
  hp.connect(ng);
  ng.connect(dest);
  src.start(t);
}
