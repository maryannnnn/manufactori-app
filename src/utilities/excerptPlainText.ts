/** Word-safe excerpt ending with an ellipsis when truncated. */
export const excerptPlainText = (value: string, maxChars = 70): string => {
  const text = value.replace(/\s+/g, ' ').trim()
  if (text.length <= maxChars) return text
  const slice = text.slice(0, maxChars + 1)
  const lastSpace = slice.lastIndexOf(' ')
  const cut = lastSpace > Math.floor(maxChars * 0.5) ? slice.slice(0, lastSpace) : text.slice(0, maxChars)
  return `${cut.trimEnd()}…`
}
