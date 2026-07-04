"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const emptySubscribe = () => () => {};
const getMountedSnap = () => true;
const getMountedServerSnap = () => false;

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, getMountedSnap, getMountedServerSnap);

  const isDark = theme === "dark";
  const toggle = () => setTheme(isDark ? "light" : "dark");

  if (!mounted) {
    return (
      <button
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/12 bg-foreground/[0.03] text-foreground/55"
        aria-label="Đổi giao diện"
      >
        <Palette className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      className="group relative inline-flex h-9 items-center gap-1.5 rounded-full border border-foreground/12 bg-foreground/[0.03] px-3 text-xs text-foreground/70 transition hover:border-foreground/30 hover:text-foreground"
      title={isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
      aria-label={isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
      data-theme-toggle
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="inline-flex"
          >
            <Moon className="h-3.5 w-3.5" style={{ color: "#e89446" }} />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="inline-flex"
          >
            <Sun className="h-3.5 w-3.5" style={{ color: "#c9701f" }} />
          </motion.span>
        )}
      </AnimatePresence>
      {!compact && (
        <span className="hidden lg:inline">{isDark ? "Ban đêm" : "Ban ngày"}</span>
      )}
    </button>
  );
}
