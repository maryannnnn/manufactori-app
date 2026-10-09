import Script from 'next/script'
import React from 'react'

import { A11Y_ATTR, A11Y_STORAGE_KEY, A11Y_TEXT_VAR } from './prefs'

/**
 * Applies stored accessibility prefs before first paint, matching InitTheme / InitPalette.
 */
export const InitAccessibility: React.FC = () => {
  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script
      dangerouslySetInnerHTML={{
        __html: `
  (function () {
    var KEY = '${A11Y_STORAGE_KEY}'
    var TEXT_VAR = '${A11Y_TEXT_VAR}'
    var root = document.documentElement
    root.style.setProperty(TEXT_VAR, '1')
    try {
      var raw = window.localStorage.getItem(KEY)
      if (!raw) return
      var p = JSON.parse(raw)
      var scale = typeof p.textScale === 'number' && isFinite(p.textScale) ? p.textScale : 1
      if (scale < 0.9) scale = 0.9
      if (scale > 1.5) scale = 1.5
      root.style.setProperty(TEXT_VAR, String(scale))
      var set = function (name, on) {
        if (on) root.setAttribute(name, '')
        else root.removeAttribute(name)
      }
      set('${A11Y_ATTR.contrast}', !!p.highContrast)
      set('${A11Y_ATTR.grayscale}', !!p.grayscale)
      set('${A11Y_ATTR.links}', !!p.highlightLinks)
      set('${A11Y_ATTR.font}', !!p.readableFont)
      set('${A11Y_ATTR.spacing}', !!p.increaseSpacing)
      set('${A11Y_ATTR.motion}', !!p.reduceMotion)
    } catch (e) {}
  })();
  `,
      }}
      id="a11y-script"
      strategy="beforeInteractive"
    />
  )
}
