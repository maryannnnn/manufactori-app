export type PlannedDirection = {
  title: string
  slug: string
  displayOrder: number
}

export type PrimaryPlannedGroup = {
  primarySlug: string
  directions: PlannedDirection[]
}

const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const list = (titles: string[]): PlannedDirection[] =>
  titles.map((title, index) => ({
    title,
    slug: slugify(title),
    displayOrder: index + 1,
  }))

/**
 * Approved October INDUSTRIAL structure: 9 primaries, 65 planned secondary directions
 * (exact titles from the supplied list; the brief said 66, the list totals 65).
 * Cards only. Not Secondary Industry records and not public pages.
 */
export const PLANNED_BY_PRIMARY: PrimaryPlannedGroup[] = [
  {
    primarySlug: 'metalworking-metal-manufacturing',
    directions: list([
      'CNC & Precision Machining',
      'Metal Fabrication',
      'Sheet Metal & Metal Forming',
      'Welding & Heavy Fabrication',
      'Casting & Molding',
      'Heat Treatment & Material Processing',
      'Surface Finishing & Coatings',
      'Laser Manufacturing',
    ]),
  },
  {
    primarySlug: 'industrial-machinery-equipment',
    directions: list([
      'Industrial Equipment & Machinery',
      'Industrial Machinery & Machine Tools',
      'Industrial Automation & Robotics',
      'Industrial Automation Components',
      'Material Handling',
      'Pneumatic Equipment',
      'Power Transmission',
      'Pumps, Valves & Fluid Handling',
      'Pressure Vessels & Process Equipment',
      'OEM & Component Manufacturing',
      'Assembly & Integration',
      'Custom Industrial Manufacturing',
      'MRO & Industrial Services',
      'Industrial Sensors & Instrumentation',
      'Industrial Filtration & Separation',
      'Conveyor & Material Handling Systems',
      'Industrial Cooling & Refrigeration',
      'Water & Wastewater Treatment Equipment',
    ]),
  },
  {
    primarySlug: 'building-products-construction-manufacturing',
    directions: list([
      'Building Products & Materials',
      'Wood Manufacturing & Timber Construction',
      'Furniture Manufacturing',
      'Heating, Sauna & Fireplace Equipment',
      'HVAC & Climate Equipment',
      'Retail & Commercial Equipment Manufacturing',
      'Industrial Lighting Equipment',
      'Fire & Emergency Equipment',
      'Glass Manufacturing & Processing',
      'Ceramics & Refractory Manufacturing',
      'Cement & Concrete Products',
      'Textile & Apparel Manufacturing',
      'Printing & Industrial Printing',
    ]),
  },
  {
    primarySlug: 'electrical-electronics-manufacturing',
    directions: list([
      'Electrical & Electronic Equipment',
      'Electronics Manufacturing',
      'Telecommunications Equipment',
      'Semiconductor Manufacturing',
      'Batteries & Energy Storage Manufacturing',
    ]),
  },
  {
    primarySlug: 'automotive-aerospace-transportation',
    directions: list([
      'Automotive Manufacturing',
      'Aerospace Manufacturing',
      'Marine & Shipbuilding',
      'Defense & Military Manufacturing',
    ]),
  },
  {
    primarySlug: 'chemical-process-manufacturing',
    directions: list([
      'Chemical & Petrochemical',
      'Oil & Gas',
      'Energy & Power Generation',
      'Food & Beverage Manufacturing',
      'Pharmaceutical & Biotechnology Manufacturing',
      'Plastics & Polymer Manufacturing',
      'Packaging & Packaging Equipment',
      'Process Manufacturing',
      'Paper & Pulp Manufacturing',
      'Rubber Products Manufacturing',
      'Renewable Energy Equipment',
    ]),
  },
  {
    primarySlug: 'medical-specialized-manufacturing',
    directions: list(['Medical Device Manufacturing', 'Precision Technology Manufacturing']),
  },
  {
    primarySlug: 'agriculture-mining-industrial-supply',
    directions: list([
      'Agriculture & Agricultural Equipment',
      'Mining & Heavy Industry',
      'Industrial Distribution & Supply',
    ]),
  },
  {
    primarySlug: 'engineering-technical-services',
    directions: list(['Engineering & Technical Services']),
  },
]

export const PLANNED_TOTAL = PLANNED_BY_PRIMARY.reduce((sum, group) => sum + group.directions.length, 0)

export type RelatedPick = {
  services: string[]
  cases: {
    slug: string
    relevance: 'direct' | 'related_manufacturing' | 'related_product'
    note: string
  }[]
}

/** Max three services and three cases per primary, varied across industries. */
export const RELATED_BY_PRIMARY: Record<string, RelatedPick> = {
  'metalworking-metal-manufacturing': {
    services: [
      'industrial-website-design',
      'product-capability-pages',
      'rfq-forms-conversion-optimization',
    ],
    cases: [
      {
        slug: 'laser-made-two-manufacturing-websites',
        relevance: 'related_manufacturing',
        note: 'Laser Made fabricates in wood, acrylic, MDF, and metal. Related manufacturing experience, not a metal-only plant.',
      },
    ],
  },
  'industrial-machinery-equipment': {
    services: [
      'marketing-strategy-roadmap',
      'seo-ai-search-optimization',
      'google-ads-manufacturers',
    ],
    cases: [
      {
        slug: 'pnevmomachta-long-term-digital-presence',
        relevance: 'direct',
        note: 'Pnevmomachta designs and manufactures pneumatic telescopic masts.',
      },
      {
        slug: 'paktrademash-packaging-equipment',
        relevance: 'related_product',
        note: 'A packaging-equipment website organized by equipment type. Related equipment experience, not a machine-tool plant.',
      },
    ],
  },
  'building-products-construction-manufacturing': {
    services: [
      'industrial-website-design',
      'product-catalogs-ecommerce',
      'technical-content-strategy',
    ],
    cases: [
      {
        slug: 'alumatrix-facade-systems',
        relevance: 'direct',
        note: 'AluMatrix designs and manufactures aluminum composite panels and mounting subsystems.',
      },
      {
        slug: 'siblux-timber-houses-wooden-windows',
        relevance: 'related_manufacturing',
        note: 'Timber houses and wooden windows. Related building-product manufacturing.',
      },
      {
        slug: 'npk-binar-roofing-systems',
        relevance: 'related_manufacturing',
        note: 'Metal and copper roofing elements and drainage components.',
      },
    ],
  },
  'electrical-electronics-manufacturing': {
    services: [
      'technical-white-papers',
      'product-capability-pages',
      'seo-ai-search-optimization',
    ],
    cases: [],
  },
  'automotive-aerospace-transportation': {
    services: [
      'international-marketing-strategy',
      'industrial-seo',
      'rfq-forms-conversion-optimization',
    ],
    cases: [],
  },
  'chemical-process-manufacturing': {
    services: [
      'engineering-articles-guides',
      'technical-content-strategy',
      'website-development',
    ],
    cases: [],
  },
  'medical-specialized-manufacturing': {
    services: [
      'technical-white-papers',
      'product-capability-pages',
      'marketing-strategy-roadmap',
    ],
    cases: [
      {
        slug: 'aleks-sf-jewelry-retail-equipment',
        relevance: 'related_product',
        note: 'Specialized equipment manufacturing for jewelry stores. Related specialized manufacturing, not medical-device work.',
      },
    ],
  },
  'agriculture-mining-industrial-supply': {
    services: [
      'distributor-channel-enablement',
      'google-ads-manufacturers',
      'industrial-website-design',
    ],
    cases: [],
  },
  'engineering-technical-services': {
    services: ['buyer-persona-research', 'sales-enablement', 'seo-ai-search-optimization'],
    cases: [
      {
        slug: 'vimpel-engineering-anechoic-chambers',
        relevance: 'direct',
        note: 'Specialist engineering for anechoic chambers. Not every engineering discipline.',
      },
      {
        slug: 'ovik-montag-hvac-engineering-seo',
        relevance: 'related_manufacturing',
        note: 'HVAC engineering contractor. Related technical services, not a product factory.',
      },
    ],
  },
}

export const MEDICAL_PRIMARY_UPDATE = {
  title: 'Medical, Precision & Specialized Manufacturing',
  industryLongTitle: 'Marketing for Medical, Precision, and Specialized Manufacturers',
  industryPreviewDescription:
    'Specification pages for medical-device, precision, and other specialized manufacturers, written around intended use and documented limits.',
  metaTitle: 'B2B Marketing for Medical and Specialized Makers',
  metaDescription:
    'How medical, precision, and specialized manufacturers explain intended use, documents, and enquiries without unsupported regulatory claims.',
} as const
