"use client"

import { colorPalettes } from "@/lib/data/colorPalettes"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

const STORAGE_KEY = "bs-palette"

function applyPalette(name: string) {
  const palette = colorPalettes.find((p) => p.name === name)
  if (!palette) return

  const root = document.documentElement
  root.style.setProperty("--brand-primary", palette.primary)
  root.style.setProperty("--brand-secondary", palette.secondary)
  root.style.setProperty("--brand-accent", palette.accent)
}

export function ColorPaletteSwitcher() {
  const [active, setActive] = useState<string>(colorPalettes[0].name)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setActive(stored)
      applyPalette(stored)
    }
  }, [])

  const handleSelect = (name: string) => {
    setActive(name)
    applyPalette(name)
    localStorage.setItem(STORAGE_KEY, name)
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
