"use client"

import { cn } from "@/lib/utils"
import { Moon, SunMedium } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-muted p-1">
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
          mounted && !isDark
            ? "bg-background text-heading shadow-sm"
            : "text-label hover:text-heading"
        )}
        aria-pressed={mounted ? !isDark : undefined}
      >
        <SunMedium className="size-4" />
        Light
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
          isDark
            ? "bg-background text-heading shadow-sm"
            : "text-label hover:text-heading"
        )}
        aria-pressed={isDark}
      >
        <Moon className="size-4" />
        Dark
      </button>
    </div>
  )
}
