import type { BlogContentBlock } from "@/lib/data/blog-page"

const WORDS_PER_MINUTE = 200

function wordsIn(block: BlogContentBlock): number {
  switch (block.type) {
    case "paragraph":
    case "heading":
      return block.text.split(/\s+/).filter(Boolean).length
    case "list":
      return block.items.join(" ").split(/\s+/).filter(Boolean).length
    case "sideBySide":
      return block.text.split(/\s+/).filter(Boolean).length
    case "image":
    case "imageGrid":
      return 0
  }
}

/** Estimated reading time in minutes, derived from actual content length — never a stored/fabricated number. */
export function getReadingTime(content: BlogContentBlock[]): number {
  const totalWords = content.reduce((sum, block) => sum + wordsIn(block), 0)
  return Math.max(1, Math.round(totalWords / WORDS_PER_MINUTE))
}
