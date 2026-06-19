"use client";

import { Volume2, VolumeX, Music } from "lucide-react";
import { useMuseum } from "@/lib/store";
import { audio } from "@/lib/audio";

/**
 * Compact audio control pill for the VisitorHud.
 * - Mute toggle (Volume2 / VolumeX)
 * - Ambient hum toggle (Music) — only enabled when not muted.
 *
 * AudioContext is created lazily on the unmute click (browser autoplay policy).
 */
export function AudioToggle() {
  const muted = useMuseum((s) => s.audioMuted);
  const ambientOn = useMuseum((s) => s.ambientOn);
  const setAudioMuted = useMuseum((s) => s.setAudioMuted);
  const setAmbientOn = useMuseum((s) => s.setAmbientOn);

  const onToggleMute = () => {
    const nextMuted = !muted;
    if (!nextMuted) {
      // Unmuting requires a user gesture → create the AudioContext now.
      audio.init();
    }
    audio.setMuted(nextMuted);
    setAudioMuted(nextMuted);
    // If we just muted, also stop the ambient nodes (audible state off).
    if (nextMuted && ambientOn) {
      audio.setAmbient(false);
      setAmbientOn(false);
    }
  };

  const onToggleAmbient = () => {
    if (muted) return; // disabled when muted
    const next = !ambientOn;
    audio.setAmbient(next);
    setAmbientOn(next);
  };

  return (
    <div
      data-onboarding="tools"
      className="flex items-center gap-0.5 rounded-full border border-foreground/12 bg-foreground/[0.03] p-0.5"
      role="group"
      aria-label="Điều khiển âm thanh"
    >
      <button
        type="button"
        onClick={onToggleMute}
        title={muted ? "Bật âm thanh" : "Tắt âm thanh"}
        aria-label={muted ? "Bật âm thanh" : "Tắt âm thanh"}
        aria-pressed={!muted}
        className="grid h-8 w-8 place-items-center rounded-full text-foreground/70 transition hover:bg-foreground/[0.06] hover:text-foreground"
      >
        {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
      </button>
      <button
        type="button"
        onClick={onToggleAmbient}
        disabled={muted}
        title={muted ? "Bật âm thanh để dùng nhạc nền" : ambientOn ? "Tắt nhạc nền" : "Bật nhạc nền"}
        aria-label={ambientOn ? "Tắt nhạc nền" : "Bật nhạc nền"}
        aria-pressed={ambientOn}
        className="grid h-8 w-8 place-items-center rounded-full text-foreground/70 transition hover:bg-foreground/[0.06] hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
        style={ambientOn && !muted ? { color: "#e89446" } : undefined}
      >
        <Music className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
