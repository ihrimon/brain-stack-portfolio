import {
  Blocks,
  BrainCircuit,
  PencilLine,
  Layers,
  Palette,
  Code2,
  Bot,
  type LucideIcon,
} from "lucide-react"

/**
 * Maps a Sheets-friendly icon name string (e.g. "Blocks") to its Lucide
 * component. Add new icons here as data files reference them.
 */
const ICON_MAP: Record<string, LucideIcon> = {
  Blocks,
  BrainCircuit,
  PencilLine,
  Layers,
  Palette,
  Code2,
  Bot,
}

export function resolveIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Blocks
}
