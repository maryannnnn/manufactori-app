import React from 'react'

import { PaletteProvider } from '@/design-system'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <PaletteProvider>
        <HeaderThemeProvider>{children}</HeaderThemeProvider>
      </PaletteProvider>
    </ThemeProvider>
  )
}
