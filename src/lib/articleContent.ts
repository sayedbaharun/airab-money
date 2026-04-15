export type ArticleContentBlock =
  | { type: 'heading'; content: string }
  | { type: 'paragraph'; content: string }

const MARKDOWN_HEADING_PATTERN = /^\*\*(.+?)\*\*$/

export const parseArticleContent = (content: string): ArticleContentBlock[] => {
  if (!content.trim()) return []

  return content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const headingMatch = block.match(MARKDOWN_HEADING_PATTERN)

      if (headingMatch) {
        return {
          type: 'heading' as const,
          content: headingMatch[1].trim(),
        }
      }

      return {
        type: 'paragraph' as const,
        content: block,
      }
    })
}
