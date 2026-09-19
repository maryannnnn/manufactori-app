/**
 * Regenerates src/design-system/palette-tokens.css from the TypeScript palette
 * definitions, and prints a WCAG contrast audit for all 15 palettes.
 *
 * Run: pnpm ds:tokens
 */
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { DEFAULT_PALETTE_ID, PALETTES, getPalette } from '../design-system/palettes'
import { auditPaletteContrast, resolvePaletteTokens, tokensToCssDeclarations } from '../design-system/tokens'

const OUTPUT = resolve(process.cwd(), 'src/design-system/palette-tokens.css')

const block = (selector: string, declarations: string[], comment?: string): string => {
  const head = comment ? `/* ${comment} */\n` : ''
  return `${head}${selector} {\n${declarations.map((line) => `  ${line}`).join('\n')}\n}`
}

const buildCss = (): string => {
  const defaultPalette = getPalette(DEFAULT_PALETTE_ID)

  const header = [
    '/*',
    ' * GENERATED FILE — do not edit by hand.',
    ' * Source: src/design-system/palettes.ts + src/design-system/tokens.ts',
    ' * Regenerate: pnpm ds:tokens',
    ' *',
    ' * --ds-* custom properties are the runtime design-token layer. Tailwind maps',
    ' * semantic utilities onto them via @theme inline in globals.css, so switching',
    ' * the [data-palette] attribute on <html> restyles the whole application.',
    ' */',
  ].join('\n')

  const rootBlock = block(
    ':root',
    tokensToCssDeclarations(resolvePaletteTokens(defaultPalette)),
    `Default palette: ${defaultPalette.id} ${defaultPalette.name} (server-rendered baseline)`,
  )

  const paletteBlocks = PALETTES.map((palette) =>
    block(
      `html[${'data-palette'}='${palette.id}']`,
      tokensToCssDeclarations(resolvePaletteTokens(palette)),
      `${palette.id} ${palette.name}`,
    ),
  )

  return `${[header, rootBlock, ...paletteBlocks].join('\n\n')}\n`
}

const printAudit = (): number => {
  let failures = 0

  for (const palette of PALETTES) {
    const report = auditPaletteContrast(palette)
    const failed = report.filter((row) => !row.passes)

    if (failed.length === 0) {
      console.log(`  ${palette.id} ${palette.name}: all ${report.length} contrast checks pass`)
      continue
    }

    failures += failed.length
    console.log(`  ${palette.id} ${palette.name}: ${failed.length} FAILING`)
    for (const row of failed) {
      console.log(`      ${row.pair}: ${row.ratio}:1 (needs ${row.target}:1)`)
    }
  }

  return failures
}

const main = () => {
  writeFileSync(OUTPUT, buildCss(), 'utf8')
  console.log(`Wrote ${OUTPUT}`)
  console.log(`Palettes: ${PALETTES.length}`)

  console.log('\nContrast audit (WCAG 2.1):')
  const failures = printAudit()

  console.log(
    failures === 0
      ? '\nAll palettes pass their contrast targets.'
      : `\n${failures} contrast check(s) failing — review tokens.ts derivation.`,
  )
}

main()
