// The site's single motion language — mirrors `--ease-premium` and the
// `--duration-*` scale in app/globals.css. Use these instead of ad-hoc
// easings/durations so every transition feels like the same system.

/** x.ai's curve: fast start, long soft settle. CSS form. */
export const EASE_PREMIUM = "cubic-bezier(0.22, 1, 0.36, 1)"

/** GSAP equivalent of EASE_PREMIUM (expo-like out curve). */
export const GSAP_EASE = "expo.out"

/** Durations in seconds (GSAP units). */
export const DURATION = {
  xs: 0.15,
  sm: 0.3,
  md: 0.5,
  lg: 0.7,
  xl: 1,
} as const
