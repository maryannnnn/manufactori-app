import Script from 'next/script'
import React from 'react'

import { DEFAULT_PALETTE_ID, PALETTE_ATTRIBUTE, PALETTE_IDS, PALETTE_STORAGE_KEY } from './palettes'

/**
 * Applies the stored palette before first paint, mirroring how `InitTheme`
 * handles light/dark. Without this the page would render the default palette
 * and visibly repaint once React hydrates.
 */
export const InitPalette: React.FC = () => {
  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script
      dangerouslySetInnerHTML={{
        __html: `
  (function () {
    var valid = ${JSON.stringify(PALETTE_IDS)}
    var paletteToSet = '${DEFAULT_PALETTE_ID}'

    try {
      var stored = window.localStorage.getItem('${PALETTE_STORAGE_KEY}')
      if (valid.indexOf(stored) !== -1) {
        paletteToSet = stored
      }
    } catch (e) {}

    document.documentElement.setAttribute('${PALETTE_ATTRIBUTE}', paletteToSet)
  })();
  `,
      }}
      id="palette-script"
      strategy="beforeInteractive"
    />
  )
}
