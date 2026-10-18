import Script from 'next/script'
import React from 'react'

import { DEFAULT_PALETTE_ID, PALETTE_ATTRIBUTE, PALETTE_IDS, PALETTE_STORAGE_KEY, SHOW_PALETTE_SELECTOR } from './palettes'

/**
 * Applies a stored palette before first paint when the selector is visible.
 * While the selector is hidden, the root layout sets the default palette on
 * `<html>` and this script is omitted, so React does not render a script tag
 * during client updates.
 */
export const InitPalette: React.FC = () => {
  if (!SHOW_PALETTE_SELECTOR) return null

  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script
      dangerouslySetInnerHTML={{
        __html: `
  (function () {
    var paletteToSet = '${DEFAULT_PALETTE_ID}'
    ${
      SHOW_PALETTE_SELECTOR
        ? `var valid = ${JSON.stringify(PALETTE_IDS)}
    try {
      var stored = window.localStorage.getItem('${PALETTE_STORAGE_KEY}')
      if (valid.indexOf(stored) !== -1) {
        paletteToSet = stored
      }
    } catch (e) {}`
        : ''
    }
    document.documentElement.setAttribute('${PALETTE_ATTRIBUTE}', paletteToSet)
  })();
  `,
      }}
      id="palette-script"
      strategy="beforeInteractive"
    />
  )
}
