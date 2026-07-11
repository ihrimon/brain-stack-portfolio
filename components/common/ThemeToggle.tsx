"use client"

import { Moon, SunMedium } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-muted p-1">
      <button
        type="button"
        onClick={() => setTheme("light")}
        className="flex items-center gap-1.5 rounded-full bg-background px-3 py-1.5 text-sm font-medium text-heading shadow-sm transition-colors dark:bg-transparent dark:text-label dark:shadow-none cursor-pointer"
      >
        <SunMedium className="size-4" />
        Light
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-label transition-colors dark:bg-background dark:text-heading dark:shadow-sm cursor-pointer"
      >
        <Moon className="size-4" />
        Dark
      </button>
    </div>
  )
}
