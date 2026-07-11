"use client";

import { useEffect, useRef } from "react";
import { useEngineStore } from "./useEngineStore";

/** Keys encoded into the URL hash for sharing. Subset of PERSIST_KEYS that
 *  make sense to share (not runtime counters). */
const SHARE_KEYS = [
  "rpm",
  "steamPressure",
  "throttle",
  "load",
  "governorEnabled",
  "scenario",
  "showLabels",
  "timeOfDay",
  "language",
  "crossSection",
  "exploded",
  "showCycleDiagram",
  "showMetrics",
  "audioOn",
  "audioVolume",
] as const;

interface ShareState {
  rpm: number;
  steamPressure: number;
  throttle: number;
  load: number;
  governorEnabled: boolean;
  scenario: string;
  showLabels: string;
  timeOfDay: string;
  language: string;
  crossSection: boolean;
  exploded: boolean;
  showCycleDiagram: boolean;
  showMetrics: boolean;
  audioOn: boolean;
  audioVolume: number;
}

/** Encode the shareable state into a compact URL hash string. */
export function encodeState(state: Partial<ShareState>): string {
  const parts: string[] = [];
  for (const k of SHARE_KEYS) {
    const v = state[k as keyof ShareState];
    if (v !== undefined && v !== null) {
      parts.push(`${k}=${encodeURIComponent(String(v))}`);
    }
  }
  return parts.join("&");
}

/** Decode a URL hash string into a partial state object. */
export function decodeState(hash: string): Partial<ShareState> {
  const out: Partial<ShareState> = {};
  const clean = hash.replace(/^#\/?/, "");
  if (!clean) return out;
  for (const pair of clean.split("&")) {
    const [k, v] = pair.split("=");
    if (!k || v === undefined) continue;
    const key = k as keyof ShareState;
    const raw = decodeURIComponent(v);
    // Type coerce based on key
    if (
      key === "rpm" ||
      key === "steamPressure" ||
      key === "throttle" ||
      key === "load" ||
      key === "audioVolume"
    ) {
      out[key] = Number(raw) as never;
    } else if (
      key === "governorEnabled" ||
      key === "crossSection" ||
      key === "exploded" ||
      key === "showCycleDiagram" ||
      key === "showMetrics" ||
      key === "audioOn"
    ) {
      out[key] = (raw === "true") as never;
    } else {
      out[key] = raw as never;
    }
  }
  return out;
}

/** Build a shareable URL for the current state. */
export function buildShareUrl(): string {
  const s = useEngineStore.getState();
  const partial: Partial<ShareState> = {};
  for (const k of SHARE_KEYS) {
    // @ts-expect-error dynamic key access
    partial[k as keyof ShareState] = s[k];
  }
  const encoded = encodeState(partial);
  return `${window.location.origin}${window.location.pathname}#${encoded}`;
}

/** On mount, read the URL hash and apply it to the store. Called once at page
 *  load. */
export function useShareUrlOnMount() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash || hash.length < 3) return;
    const decoded = decodeState(hash);
    if (Object.keys(decoded).length === 0) return;
    // Apply to store
    const s = useEngineStore.getState();
    if (decoded.rpm !== undefined) s.setRpm(decoded.rpm);
    if (decoded.steamPressure !== undefined) s.setSteamPressure(decoded.steamPressure);
    if (decoded.throttle !== undefined) s.setThrottle(decoded.throttle);
    if (decoded.load !== undefined) s.setLoad(decoded.load);
    if (decoded.governorEnabled !== undefined) s.setGovernorEnabled(decoded.governorEnabled);
    if (decoded.scenario) s.setScenario(decoded.scenario as never);
    if (decoded.showLabels) s.setShowLabels(decoded.showLabels as never);
    if (decoded.timeOfDay) s.setTimeOfDay(decoded.timeOfDay as never);
    if (decoded.language) s.setLanguage(decoded.language as never);
    if (decoded.crossSection !== undefined && decoded.crossSection !== s.crossSection)
      s.toggleCrossSection();
    if (decoded.exploded !== undefined && decoded.exploded !== s.exploded)
      s.toggleExploded();
    if (decoded.showCycleDiagram !== undefined && decoded.showCycleDiagram !== s.showCycleDiagram)
      s.toggleCycleDiagram();
    if (decoded.showMetrics !== undefined && decoded.showMetrics !== s.showMetrics)
      s.toggleMetrics();
    if (decoded.audioOn !== undefined && decoded.audioOn !== s.audioOn) s.toggleAudio();
    if (decoded.audioVolume !== undefined) s.setAudioVolume(decoded.audioVolume);
    // Clear the hash so subsequent resets don't re-apply
    window.history.replaceState(null, "", window.location.pathname);
  }, []);
}

/** Copy the current state as a shareable URL to the clipboard.
 *  Returns the URL that was copied. */
export async function copyShareUrl(): Promise<string> {
  const url = buildShareUrl();
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* ignore — clipboard may be blocked */
    }
  }
  return url;
}

// unused but kept to avoid tree-shaking the ref import in some bundlers
void useRef;
