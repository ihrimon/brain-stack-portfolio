import type Lenis from "lenis"

declare global {
  interface Window {
    __lenisInstance?: Lenis
  }
}

export function setLenis(lenis: Lenis | undefined) {
  window.__lenisInstance = lenis
}

export function getLenis() {
  return typeof window !== "undefined" ? window.__lenisInstance : undefined
}
