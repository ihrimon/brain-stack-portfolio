import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  themes,
  type Theme,
} from "@/lib/theme/constants"
import { useSyncExternalStore } from "react"

// -----------------------------------------------------------------------------
// Visitor light/dark preference.
//
// `<html data-theme>` is the single source of truth. `themeInitScript` writes
// it from localStorage before first paint, so a saved choice shows on every
// page load. The hook below just reads that DOM state back.
// -----------------------------------------------------------------------------

const CHANGE_EVENT = "bs-preferences-change"

function isTheme(value: unknown): value is Theme {
  return themes.includes(value as Theme)
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
}

function notify() {
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

/** Keeps other open tabs in sync when the theme changes in one of them. */
function handleStorage(event: StorageEvent) {
  if (event.key === THEME_STORAGE_KEY && isTheme(event.newValue)) {
    applyTheme(event.newValue)
    notify()
  }
}

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback)
  window.addEventListener("storage", handleStorage)
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback)
    window.removeEventListener("storage", handleStorage)
  }
}

function getThemeSnapshot(): Theme {
  const value = document.documentElement.dataset.theme
  return isTheme(value) ? value : DEFAULT_THEME
}

export function setTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Private mode / blocked storage — the choice still applies to this page.
  }
  applyTheme(theme)
  notify()
}

export function useTheme() {
  return useSyncExternalStore(subscribe, getThemeSnapshot, () => DEFAULT_THEME)
}
