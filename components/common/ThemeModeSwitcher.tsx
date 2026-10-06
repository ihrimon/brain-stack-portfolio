"use client"

import { type Theme } from "@/lib/theme/constants"
import { setTheme, useTheme } from "@/lib/theme/preferences"
import { cn } from "@/lib/utils/cn"
import { Moon, Sun, type LucideIcon } from "lucide-react"

const options: { value: Theme; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
]

export function ThemeModeSwitcher() {
  const active = useTheme()

  return (
    <div
      role="group"
      aria-label="Theme mode"
      className="grid grid-cols-2 gap-2 rounded-full border border-white/10 p-1"
    >
      {options.map(({ value, label, icon: Icon }) => {
        const isActive = active === value

        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-pressed={isActive}
            className={cn(
              "flex cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-300",
              isActive
                ? "bg-foreground text-background"
                : "text-white/60 hover:bg-white/10 hover:text-white"
            )}
          >
            <Icon className="size-4" />
            {label}
          </button>
        )
      })}
    </div>
  )
}
