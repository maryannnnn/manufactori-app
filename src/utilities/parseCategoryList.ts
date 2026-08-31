/**
 * Split pasted Excel / Sheets / plain-text category lists into titles.
 * One line = one category. Trims whitespace, ignores empty lines,
 * dedupes by case-insensitive title within the paste.
 */
export const parseCategoryList = (raw: string): string[] => {
  const seen = new Set<string>()
  const titles: string[] = []

  for (const line of raw.split(/\r\n|\n|\r/)) {
    // Excel may paste a single cell with tabs — take the first non-empty cell.
    const title = line.split('\t')[0]?.trim() ?? ''
    if (!title) continue

    const key = title.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    titles.push(title)
  }

  return titles
}
