"use client";

import { useEffect } from "react";
import { useEngineStore } from "./useEngineStore";
import type { StringKey } from "./i18n";

interface Shortcut {
  key: string;
  /** VI label (default) */
  label: string;
  /** EN label */
  labelEn: string;
  action: string;
}

export const SHORTCUTS: Shortcut[] = [
  { key: "Space", label: "Chạy / Dừng", labelEn: "Play / Pause", action: "toggle" },
  { key: "R", label: "Đặt lại thông số", labelEn: "Reset settings", action: "reset" },
  { key: "1–5", label: "Góc nhìn (Toàn cảnh → Bánh đà)", labelEn: "View angle (Overview → Flywheel)", action: "view" },
  { key: "E", label: "Bật/tắt sơ đồ nổ", labelEn: "Toggle exploded view", action: "explode" },
  { key: "C", label: "Bật/tắt cắt ngang xy-lanh", labelEn: "Toggle cross-section", action: "cross" },
  { key: "G", label: "Bật/tắt bộ điều tốc", labelEn: "Toggle governor", action: "governor" },
  { key: "A", label: "Bật/tắt âm thanh", labelEn: "Toggle audio", action: "audio" },
  { key: "V", label: "Bật/tắt sơ đồ P–V", labelEn: "Toggle P–V diagram", action: "pv" },
  { key: "M", label: "Bật/tắt đồ thị hiệu suất", labelEn: "Toggle metrics chart", action: "metrics" },
  { key: "F", label: "Bật/tắt bộ đếm FPS", labelEn: "Toggle FPS counter", action: "fps" },
  { key: "L", label: "Chế độ nhãn (Tắt/Tên/Đầy đủ)", labelEn: "Label mode (Off/Names/Full)", action: "labels" },
  { key: "B", label: "Đổi ngôn ngữ (VI/EN)", labelEn: "Switch language (VI/EN)", action: "lang" },
  { key: "T", label: "Hướng dẫn tham quan", labelEn: "Guided tour", action: "tour" },
  { key: "N", label: "Ban ngày / Hoàng hôn / Ban đêm", labelEn: "Day / Dusk / Night", action: "tod" },
  { key: "H", label: "Bảng phím tắt này", labelEn: "This shortcuts panel", action: "help" },
  { key: "Ctrl+S", label: "Lưu kịch bản hiện tại", labelEn: "Save current preset", action: "save" },
  { key: "Shift+↑/↓", label: "Tăng/giảm âm lượng", labelEn: "Volume up/down", action: "vol" },
  { key: "Esc", label: "Đóng / Bỏ chọn phụ tùng", labelEn: "Close / Deselect part", action: "esc" },
];

// Keep StringKey import used for type safety in consuming components
export type { StringKey };

const VIEW_PRESETS = ["hero", "side", "top", "cylinder", "flywheel"] as const;
const LABEL_CYCLE = ["off", "compact", "full"] as const;

/** Global keyboard shortcut handler. Mounted once at the page root.
 *  Ignores keystrokes when the user is typing in an input/textarea. */
export function useKeyboardShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target?.isContentEditable
      ) {
        return;
      }

      const s = useEngineStore.getState();
      const key = e.key;

      if (key === " ") {
        e.preventDefault();
        s.toggle();
      } else if (key === "r" || key === "R") {
        s.reset();
      } else if (key >= "1" && key <= "5") {
        const idx = parseInt(key, 10) - 1;
        s.setViewPreset(VIEW_PRESETS[idx]);
      } else if (key === "e" || key === "E") {
        s.toggleExploded();
      } else if (key === "c" || key === "C") {
        s.toggleCrossSection();
      } else if (key === "g" || key === "G") {
        s.toggleGovernor();
      } else if (key === "a" || key === "A") {
        s.toggleAudio();
      } else if (key === "v" || key === "V") {
        s.toggleCycleDiagram();
      } else if (key === "m" || key === "M") {
        s.toggleMetrics();
      } else if (key === "f" || key === "F") {
        s.toggleFps();
      } else if (key === "l" || key === "L") {
        const cur = s.showLabels;
        const next = LABEL_CYCLE[(LABEL_CYCLE.indexOf(cur) + 1) % LABEL_CYCLE.length];
        s.setShowLabels(next);
      } else if (key === "b" || key === "B") {
        s.toggleLanguage();
      } else if (key === "t" || key === "T") {
        if (s.tourActive) s.stopTour();
        else s.startTour();
      } else if (key === "n" || key === "N") {
        s.toggleTimeOfDay();
      } else if (key === "h" || key === "H") {
        s.toggleHelp();
      } else if (key === "Escape") {
        if (s.showHelp) s.toggleHelp();
        else if (s.tourActive) s.stopTour();
        else if (s.selectedPart) s.setSelectedPart(null);
      } else if (key === "ArrowRight" && s.tourActive) {
        s.nextTourStep();
      } else if (key === "ArrowLeft" && s.tourActive) {
        s.prevTourStep();
      } else if ((e.ctrlKey || e.metaKey) && (key === "s" || key === "S")) {
        e.preventDefault();
        const name = window.prompt(
          s.language === "vi" ? "Tên kịch bản:" : "Preset name:",
          `Preset ${s.customPresets.length + 1}`,
        );
        if (name && name.trim()) s.savePreset(name.trim());
      } else if (e.shiftKey && key === "ArrowUp") {
        e.preventDefault();
        s.setAudioVolume(Math.min(1, s.audioVolume + 0.1));
      } else if (e.shiftKey && key === "ArrowDown") {
        e.preventDefault();
        s.setAudioVolume(Math.max(0, s.audioVolume - 0.1));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}
