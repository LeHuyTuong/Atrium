"use client";

import { useEffect, useState } from "react";

/**
 * Returns true when the current theme is dark.
 * Listens to <html class="dark"> changes (driven by next-themes).
 */
export function useIsDark() {
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    const el = document.documentElement;
    const update = () => setIsDark(el.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}
