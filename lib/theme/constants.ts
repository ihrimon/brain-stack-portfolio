// Shared by the client-side preference store (lib/theme/preferences.ts) and
// the pre-paint init script inlined by app/layout.tsx. Kept free of React so
// the server-rendered layout can import it.

export const themes = ["light", "dark"] as const
export type Theme = (typeof themes)[number]
export const DEFAULT_THEME: Theme = "dark"

export const THEME_STORAGE_KEY = "bs-theme"

/** Runs in `<head>` before first paint and applies the saved theme to
 * `<html>`, so a returning visitor never sees the default flash first. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(${JSON.stringify(themes)}.indexOf(t)>-1)document.documentElement.dataset.theme=t}catch(e){}})()`
