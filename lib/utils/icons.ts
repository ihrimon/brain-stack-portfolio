import {
  Blocks,
  BookOpen,
  BrainCircuit,
  PencilLine,
  Layers,
  Megaphone,
  Palette,
  Code2,
  Bot,
  Smartphone,
  Search,
  Rocket,
  type LucideIcon,
} from "lucide-react"

/**
 * Maps an icon name string (e.g. "Blocks") to its Lucide component.
 * Add new icons here as data files reference them.
 */
const ICON_MAP: Record<string, LucideIcon> = {
  Blocks,
  BookOpen,
  BrainCircuit,
  PencilLine,
  Layers,
  Megaphone,
  Palette,
  Code2,
  Bot,
  Smartphone,
  Search,
  Rocket,
}

export function resolveIcon(name?: string): LucideIcon {
  return (name && ICON_MAP[name]) || Blocks
}
