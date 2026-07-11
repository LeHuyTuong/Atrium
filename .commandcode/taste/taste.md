# framer-motion
- Never mix Tailwind `hover:-translate-y` or `hover:scale` classes with Framer Motion `motion` components — both control `transform`, causing infinite jitter loops. Use Framer Motion's `whileHover={{ y: X }}` or `whileHover={{ scale: X }}` instead. Confidence: 0.85
- Use `pointer-events-none` on hover glow overlay layers inside motion components to prevent event bubbling from breaking hover states. Confidence: 0.80
- When hover states on motion elements involve Tailwind opacity transitions, add explicit `duration-300 ease-in-out` to ensure smooth animations. Confidence: 0.70

# tailwind
- For quiz/answer buttons on glassmorphism backgrounds, ensure adequate text contrast: use `text-white` (dark backgrounds) or `text-neutral-900` (light backgrounds), with distinct colored states like `text-emerald-400` for correct and `text-rose-400` for incorrect. Confidence: 0.75
