"use client"

import { colorPalettes } from "@/lib/constants/color-palettes"
import { cn } from "@/lib/utils/cn"
import { useEffect, useSyncExternalStore } from "react"

const STORAGE_KEY = "bs-palette"
const CHANGE_EVENT = "bs-palette-change"

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback)
  return () => window.removeEventListener(CHANGE_EVENT, callback)
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY) ?? colorPalettes[0].name
}

function getServerSnapshot() {
  return colorPalettes[0].name
}

function applyPalette(name: string) {
  const palette = colorPalettes.find((p) => p.name === name)
  if (!palette) return

  const root = document.documentElement
  root.style.setProperty("--brand-primary", palette.primary)
  root.style.setProperty("--brand-secondary", palette.secondary)
  root.style.setProperty("--brand-accent", palette.accent)
}

export function ColorPaletteSwitcher() {
  const active = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  useEffect(() => {
    applyPalette(active)
  }, [active])

  const handleSelect = (name: string) => {
    localStorage.setItem(STORAGE_KEY, name)
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }

  return (
    <div className="flex flex-wrap gap-3">
      {colorPalettes.map((palette) => (
        <button
          key={palette.name}
          type="button"
          onClick={() => handleSelect(palette.name)}
          className={cn(
            "flex size-9 items-center justify-center rounded-full ring-offset-2 ring-offset-background transition-shadow",
            active === palette.name && "ring-2 ring-foreground"
          )}
          style={{
            background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
          }}
          aria-label={`Use ${palette.name} color palette`}
          aria-pressed={active === palette.name}
          title={palette.name}
        />
      ))}
    </div>
  )
}
