import type { Palette, PaletteId } from './types'

/**
 * The 15 manufacturing research palettes.
 *
 * These five colours per palette are the single source of truth and must stay
 * exactly as researched. Accessibility fixes happen in `tokens.ts` by deriving
 * additional values, never by editing the numbers below.
 */
export const PALETTES: readonly Palette[] = [
  {
    id: '01',
    name: 'Machine Shop Heavy',
    shortName: 'Machine Shop',
    base: {
      primary: '#1A1D20',
      cta: '#E35205',
      secondary: '#4A5568',
      surface: '#F0F2F5',
      body: '#FFFFFF',
    },
    meaning: {
      primary: 'Dark Cast Iron',
      cta: 'Safety Orange',
      secondary: 'Machined Steel',
      surface: 'Cool Gray',
      body: 'Pure White',
    },
  },
  {
    id: '02',
    name: 'Factory Safety Yellow',
    shortName: 'Factory Safety',
    base: {
      primary: '#111111',
      cta: '#FFC700',
      secondary: '#2D3748',
      surface: '#E2E8F0',
      body: '#FFFFFF',
    },
    meaning: {
      primary: 'Charcoal Black',
      cta: 'Caution Yellow',
      secondary: 'Slate Blue',
      surface: 'Light Industrial Slate',
      body: 'Base White',
    },
  },
  {
    id: '03',
    name: 'Deep Vulcanized Bronze',
    shortName: 'Deep Bronze',
    base: {
      primary: '#17191C',
      cta: '#D97706',
      secondary: '#6B7280',
      surface: '#F3F4F6',
      body: '#FFFFFF',
    },
    meaning: {
      primary: 'Dark Anodized',
      cta: 'Industrial Amber',
      secondary: 'Neutral Gray',
      surface: 'Light Metallic',
      body: 'White',
    },
  },
  {
    id: '04',
    name: 'Corporate Navy Trust',
    shortName: 'Corporate Navy',
    base: {
      primary: '#0F2C59',
      cta: '#00A8B5',
      secondary: '#334155',
      surface: '#F8FAFC',
      body: '#FFFFFF',
    },
    meaning: {
      primary: 'Deep Corporate Navy',
      cta: 'Teal Focus',
      secondary: 'Slate Text',
      surface: 'Ice Tint',
      body: 'Pure White',
    },
  },
  {
    id: '05',
    name: 'Precision Engineering Blue',
    shortName: 'Precision Blue',
    base: {
      primary: '#0A192F',
      cta: '#2563EB',
      secondary: '#38BDF8',
      surface: '#F1F5F9',
      body: '#FFFFFF',
    },
    meaning: {
      primary: 'Deep Space Navy',
      cta: 'Precision Blue',
      secondary: 'Electric Sky',
      surface: 'Light Slate',
      body: 'White',
    },
  },
  {
    id: '06',
    name: 'HubSpot Platinum Inbound',
    shortName: 'Platinum Inbound',
    base: {
      primary: '#002B49',
      cta: '#F58220',
      secondary: '#3B82F6',
      surface: '#F3F4F6',
      body: '#FFFFFF',
    },
    meaning: {
      primary: 'Dark Ink Blue',
      cta: 'Inbound Amber',
      secondary: 'Interactive Blue',
      surface: 'Light Gray Neutral',
      body: 'Base White',
    },
  },
  {
    id: '07',
    name: 'AI Search Engine',
    shortName: 'AI Search',
    base: {
      primary: '#0B0F17',
      cta: '#00F0FF',
      secondary: '#1E293B',
      surface: '#94A3B8',
      body: '#FFFFFF',
    },
    meaning: {
      primary: 'Deep AI Space',
      cta: 'Cyber Cyan',
      secondary: 'Dark Card Slate',
      surface: 'Muted Tech Gray',
      body: 'Crisp White',
    },
    note: 'Surface is a muted technical gray. Best used for secondary text and metadata rather than large background areas.',
  },
  {
    id: '08',
    name: 'High-Tech Automation',
    shortName: 'Automation',
    base: {
      primary: '#1E2229',
      cta: '#10B981',
      secondary: '#64748B',
      surface: '#F8FAFC',
      body: '#FFFFFF',
    },
    meaning: {
      primary: 'Dark Graphite',
      cta: 'Automation Green',
      secondary: 'Slate Steel',
      surface: 'Clean Gray Tint',
      body: 'Pure White',
    },
  },
  {
    id: '09',
    name: 'Data Pipeline Purple',
    shortName: 'Data Pipeline',
    base: {
      primary: '#181123',
      cta: '#EC4899',
      secondary: '#8B5CF6',
      surface: '#F5F3FF',
      body: '#FFFFFF',
    },
    meaning: {
      primary: 'Deep Violet Slate',
      cta: 'Pipeline Magenta',
      secondary: 'Data Violet',
      surface: 'Soft Violet Tint',
      body: 'Pure White',
    },
  },
  {
    id: '10',
    name: 'Clean-Tech Emerald',
    shortName: 'Clean-Tech',
    base: {
      primary: '#064E3B',
      cta: '#059669',
      secondary: '#047857',
      surface: '#ECFDF5',
      body: '#FFFFFF',
    },
    meaning: {
      primary: 'Deep Forest Green',
      cta: 'Clean Energy Emerald',
      secondary: 'Muted Mint Green',
      surface: 'Mint Tint',
      body: 'White',
    },
  },
  {
    id: '11',
    name: 'Industrial Sage & Olive',
    shortName: 'Sage & Olive',
    base: {
      primary: '#1C2421',
      cta: '#5C933F',
      secondary: '#78716C',
      surface: '#F5F5F4',
      body: '#FFFFFF',
    },
    meaning: {
      primary: 'Dark Olive Charcoal',
      cta: 'Industrial Sage',
      secondary: 'Warm Stone Gray',
      surface: 'Stone Background',
      body: 'Clean White',
    },
  },
  {
    id: '12',
    name: 'Architectural CAD / Blueprint Blue',
    shortName: 'Blueprint Blue',
    base: {
      primary: '#003366',
      cta: '#FF9900',
      secondary: '#64748B',
      surface: '#F1F5F9',
      body: '#FFFFFF',
    },
    meaning: {
      primary: 'Blueprint Blue',
      cta: 'Warm CAD Orange',
      secondary: 'Grid Line Gray',
      surface: 'Paper Gray Tint',
      body: 'Pure White',
    },
  },
  {
    id: '13',
    name: 'Swiss Minimal Industrial',
    shortName: 'Swiss Minimal',
    base: {
      primary: '#000000',
      cta: '#DC2626',
      secondary: '#525252',
      surface: '#F5F5F5',
      body: '#FFFFFF',
    },
    meaning: {
      primary: 'Pure Black',
      cta: 'Swiss Red',
      secondary: 'Neutral Dark Gray',
      surface: 'Off-White Tint',
      body: 'Base White',
    },
  },
  {
    id: '14',
    name: 'High-End Material Science',
    shortName: 'Material Science',
    base: {
      primary: '#0F172A',
      cta: '#6366F1',
      secondary: '#0EA5E9',
      surface: '#F8FAFC',
      body: '#FFFFFF',
    },
    meaning: {
      primary: 'Slate Midnight',
      cta: 'Polymer Indigo',
      secondary: 'Sky Accent',
      surface: 'Light Slate Tint',
      body: 'Pure White',
    },
  },
  {
    id: '15',
    name: 'Modern Supply Chain & Logistics',
    shortName: 'Supply Chain',
    base: {
      primary: '#131C2E',
      cta: '#EA580C',
      secondary: '#475569',
      surface: '#F1F5F9',
      body: '#FFFFFF',
    },
    meaning: {
      primary: 'Global Navy',
      cta: 'Cargo Amber-Orange',
      secondary: 'Steel Slate',
      surface: 'Container Gray',
      body: 'Clean White',
    },
  },
] as const

export const DEFAULT_PALETTE_ID: PaletteId = '01'

/** localStorage key holding the visitor's chosen palette. */
export const PALETTE_STORAGE_KEY = 'ds-palette'

/** Attribute written on <html>; CSS keys every palette block off it. */
export const PALETTE_ATTRIBUTE = 'data-palette'

export const PALETTE_IDS: readonly PaletteId[] = PALETTES.map((palette) => palette.id)

export const isPaletteId = (value: unknown): value is PaletteId =>
  typeof value === 'string' && PALETTE_IDS.includes(value as PaletteId)

export const getPalette = (id: PaletteId): Palette =>
  PALETTES.find((palette) => palette.id === id) ??
  (PALETTES.find((palette) => palette.id === DEFAULT_PALETTE_ID) as Palette)
