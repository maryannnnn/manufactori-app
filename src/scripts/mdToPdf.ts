import 'dotenv/config'
import { readFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { chromium } from 'playwright'

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const inline = (s: string) =>
  escapeHtml(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')

/** Minimal markdown subset: headings, bullet/numbered lists, tables, paragraphs, hr. */
const renderMarkdown = (md: string): string => {
  const lines = md.split(/\r?\n/)
  const out: string[] = []
  let i = 0

  const flushTable = () => {
    const rows: string[][] = []
    while (i < lines.length && lines[i].trim().startsWith('|')) {
      const cells = lines[i]
        .trim()
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map((c) => c.trim())
      rows.push(cells)
      i += 1
    }
    if (!rows.length) return
    const isDivider = (cells: string[]) => cells.every((c) => /^:?-{2,}:?$/.test(c))
    const header = rows[0]
    const body = rows.filter((r, idx) => idx > 0 && !isDivider(r))
    out.push('<table><thead><tr>')
    for (const c of header) out.push(`<th>${inline(c)}</th>`)
    out.push('</tr></thead><tbody>')
    for (const r of body) {
      out.push('<tr>')
      for (const c of r) out.push(`<td>${inline(c)}</td>`)
      out.push('</tr>')
    }
    out.push('</tbody></table>')
  }

  const flushList = (ordered: boolean) => {
    const marker = ordered ? /^\s*\d+\.\s+/ : /^\s*[-*]\s+/
    out.push(ordered ? '<ol>' : '<ul>')
    while (i < lines.length && marker.test(lines[i])) {
      out.push(`<li>${inline(lines[i].replace(marker, ''))}</li>`)
      i += 1
    }
    out.push(ordered ? '</ol>' : '</ul>')
  }

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      i += 1
      continue
    }
    if (trimmed.startsWith('|')) {
      flushTable()
      continue
    }
    if (/^\s*[-*]\s+/.test(line)) {
      flushList(false)
      continue
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      flushList(true)
      continue
    }
    const heading = /^(#{1,4})\s+(.*)$/.exec(trimmed)
    if (heading) {
      const level = heading[1].length
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`)
      i += 1
      continue
    }
    if (/^(-{3,}|={3,})$/.test(trimmed)) {
      out.push('<hr />')
      i += 1
      continue
    }

    const paragraph: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('|') &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^#{1,4}\s+/.test(lines[i].trim())
    ) {
      paragraph.push(lines[i].trim())
      i += 1
    }
    out.push(`<p>${inline(paragraph.join(' '))}</p>`)
  }

  return out.join('\n')
}

const STYLES = `
  @page { size: A4; margin: 16mm 14mm 18mm 14mm; }
  body { font-family: "Segoe UI", Roboto, Arial, sans-serif; font-size: 11.5pt; line-height: 1.55; color: #16181d; }
  h1 { font-size: 20pt; margin: 0 0 14px; border-bottom: 2px solid #16181d; padding-bottom: 8px; }
  h2 { font-size: 14pt; margin: 26px 0 8px; color: #0b2e4f; page-break-after: avoid; }
  h3 { font-size: 12pt; margin: 18px 0 6px; page-break-after: avoid; }
  p { margin: 8px 0; }
  ul, ol { margin: 8px 0 8px 20px; padding: 0; }
  li { margin: 4px 0; }
  code { font-family: Consolas, "Courier New", monospace; font-size: 10pt; background: #f2f4f7; padding: 1px 4px; border-radius: 3px; }
  strong { font-weight: 600; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 9.5pt; page-break-inside: auto; }
  th, td { border: 1px solid #c9cfd8; padding: 5px 7px; text-align: left; vertical-align: top; word-break: break-word; }
  th { background: #eef1f5; font-weight: 600; }
  tr { page-break-inside: avoid; }
  hr { border: 0; border-top: 1px solid #c9cfd8; margin: 18px 0; }
`

const main = async () => {
  const inputs = process.argv.slice(2)
  if (!inputs.length) {
    console.error('Usage: tsx src/scripts/mdToPdf.ts <file.md> [more.md ...]')
    process.exit(1)
  }

  let browser
  try {
    browser = await chromium.launch()
  } catch {
    // Sandboxed runs point PLAYWRIGHT_BROWSERS_PATH at an empty cache; fall back to installed Edge.
    browser = await chromium.launch({ channel: 'msedge' })
  }
  const page = await browser.newPage()

  for (const input of inputs) {
    const path = resolve(input)
    const md = readFileSync(path, 'utf8')
    const title = basename(path).replace(/\.md$/i, '')
    const html = `<!doctype html><html><head><meta charset="utf-8" /><title>${escapeHtml(
      title,
    )}</title><style>${STYLES}</style></head><body>${renderMarkdown(md)}</body></html>`

    await page.setContent(html, { waitUntil: 'load' })
    const outPath = path.replace(/\.md$/i, '.pdf')
    await page.pdf({
      path: outPath,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate:
        '<div style="width:100%;font-size:8pt;color:#7a828e;padding:0 14mm;text-align:right;font-family:Segoe UI,Arial,sans-serif;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>',
      margin: { top: '16mm', bottom: '18mm', left: '14mm', right: '14mm' },
    })
    console.log(`PDF: ${outPath}`)
  }

  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
