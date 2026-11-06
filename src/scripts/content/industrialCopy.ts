export type PlannedCopy = {
  title: string
  slug: string
  previewDescription: string
  displayOrder: number
}

export type CaseLink = {
  slug: string
  relevance: 'direct' | 'related_manufacturing' | 'related_product'
  note: string
}

export type IndustryCopy = {
  slug: string
  title: string
  h1: string
  preview: string
  metaTitle: string
  metaDescription: string
  image: string
  alt: string
  displayOrder: number
  services: string[]
  posts: string[]
  cases: CaseLink[]
  planned: PlannedCopy[]
  fields: Record<string, string>
  faq: { question: string; answer: string }[]
  ctaTitle: string
  ctaDescription: string
}

const cta = (subject: string) =>
  `Tell us what you manufacture in ${subject} and which buyers should be able to evaluate it. The first conversation is about the product and the enquiry path, not a promised ranking or a revenue figure.`

const baseServices = [
  'marketing-strategy-roadmap',
  'industrial-website-design',
  'website-development',
  'seo-ai-search-optimization',
  'technical-content-strategy',
  'google-ads-manufacturers',
  'product-capability-pages',
  'rfq-forms-conversion-optimization',
]

export const INDUSTRIES: IndustryCopy[] = [
  {
    slug: 'metalworking-metal-manufacturing',
    title: 'Metalworking & Metal Manufacturing',
    h1: 'Marketing for Metalworking and Metal Manufacturing',
    preview:
      'Websites, search, and technical pages for shops and plants that cut, form, fabricate, and weld metal to a drawing.',
    metaTitle: 'Metalworking Marketing for Manufacturing Companies',
    metaDescription:
      'How metalworking companies present processes, materials, and drawing-based enquiries on the website, in search, and in paid campaigns. A rank is not promised.',
    image: 'industry-metalworking.jpg',
    alt: 'Bright CNC machining shop with aluminum parts on a worktable',
    displayOrder: 1,
    services: [...baseServices, 'cad-3d-configurator-integration'],
    posts: [
      'manufacturing-website-architecture-large-catalogues',
      'technical-content-marketing-manufacturers',
    ],
    cases: [
      {
        slug: 'laser-made-two-manufacturing-websites',
        relevance: 'related_manufacturing',
        note: 'Laser Made fabricates in wood, acrylic, MDF, and metal. The case shows a fabrication website, not a dedicated metal-only plant.',
      },
    ],
    // Specializations are published Secondary Industry records (metalworkingSpecializations.ts).
    planned: [],
    fields: {
      industryOverview:
        'Metalworking covers companies that machine, fabricate, form, and weld metal into components, assemblies, and structures. The public offer is usually a process plus a material range, not a single consumer product.',
      manufacturingProcesses:
        'Typical routes include cutting, milling, turning, bending, forming, welding, and finishing. The page should name the routes the plant actually runs, and leave out processes that would have to be subcontracted without saying so.',
      productsAndApplications:
        'Work arrives as a drawing, a sample, or a repeat part number. Applications sit in equipment, buildings, vehicles, and other plants. A useful page groups parts by process and use, not only by a gallery of finished photos.',
      materialsAndTechnologies:
        'Buyers ask which metals and thicknesses the shop will take, and which machines or welding methods are in house. Those facts belong next to the process, with the limits the estimator will stand behind.',
      targetMarkets:
        'Customers are usually other manufacturers, equipment builders, contractors, and maintenance teams. Geography matters when the part is large, urgent, or tied to a local qualification.',
      buyerTypes:
        'The enquiry may come from an engineer, a buyer, or a project manager at an OEM or a plant. A job shop and a captive metal plant do not speak to the same account list.',
      decisionMakers:
        'Engineering checks whether the process can hold the drawing. Procurement checks price, lead time, and documents. Both need a path that does not collapse into one generic contact box.',
      buyerRequirements:
        'A serious enquiry names material, quantity, drawing or model, finish, and the date the part is needed. The site should ask for those items instead of only a phone number.',
      purchasingFactors:
        'Selection turns on capability, capacity, quality documents, and whether the shop has made a similar part. A slogan about precision does not replace a process list.',
      marketingChallenges:
        'Many metalworking sites look like the same machine list. Buyers cannot tell who welds heavy plate, who runs precision turning, or who should not receive the drawing.',
      digitalMarketSpecifics:
        'Search demand mixes process terms, material terms, and local supplier terms. A page that only says custom metalwork competes with every shop using the same phrase.',
      competitiveFactors:
        'Shops differ by machine range, materials, welding procedure, inspection, and the size of part they will handle. Those differences should be visible before the quote.',
      leadGenerationChallenges:
        'Unqualified files, missing drawings, and one-off hobby requests consume estimating time. The form and the page have to signal which work the shop wants.',
      searchBehavior:
        'Engineers search by process and material. Buyers search for a supplier near a plant or for a repeat component. The two intents should not land on the same thin page.',
      seoStrategy:
        'Give each real process and material family a page that states the capability and the enquiry it can accept. Link those pages from the industries and applications you actually serve.',
      aiSearchStrategy:
        'An assistant can only repeat what the site states clearly: processes, materials, and what you do not do. That is a clarity task. It is not a promise of citation in ChatGPT, Gemini, or Perplexity.',
      keywordAndTopicStructure:
        'Useful groups are the process, the metal, the part family, and the application. Treat brand-only names and unsupported tolerance claims as topics to avoid.',
      authorityAndVisibility:
        'Drawings, inspection notes, and named process pages are the public evidence. Do not invent certifications, press mentions, or customer lists to fill a gap.',
      contentStrategy:
        'Publish the information an estimator already gives on the phone: process, material, typical part, and how to send a drawing. Keep sales adjectives out of that explanation.',
      technicalContent:
        'Technical pages should cover materials, available processes, and the drawing data required for a quote. Do not publish a tolerance the shop will not accept.',
      productAndApplicationContent:
        'Where the plant repeats a part family, that family deserves its own page. One-off work can stay on the process page with a clear request for the drawing.',
      expertiseContent:
        'Show how the team reads a drawing and chooses a route. That is more useful than a timeline of company slogans.',
      contentFormats:
        'Process pages, material pages, application notes, and a short FAQ about quotations fit this industry. Video of a machine is optional and should name the process.',
      buyerJourney:
        'A buyer finds a process, checks the material, and sends a drawing. Estimating, clarification, and a quoted lead time follow. The site supports the first two steps.',
      salesCycleCharacteristics:
        'Quotes wait on drawings, quantity, and sometimes a sample or a first-article check. Marketing should not treat the form submit as a closed order.',
      buyerQuestionsByStage:
        'Early questions are about process and material. Later questions are about documents, lead time, and how revisions are handled. Each stage needs a different page, not a repeated slogan.',
      trustAndConversionFactors:
        'Trust comes from a specific process list, a clear way to send a file, and examples that match the metal and the method. Do not imply a case study is metal-only when it is not.',
      leadNurturingApproach:
        'A drawing that is not ready can stay in a slower follow-up. The message should ask for the missing specification, not restart a generic capabilities pitch.',
      websiteAndCatalogStrategy:
        'Organize the site by process and material first, then by the applications you want more of. The enquiry path should accept a drawing and a quantity.',
      paidAdvertisingStrategy:
        'Paid search works when the ad and the landing page name the same process. Sending every metal query to the homepage wastes the click.',
      conversionOptimization:
        'The form should request material, quantity, and a file, and say what happens next. Extra fields that estimating will not read should come off.',
      analyticsAndMeasurement:
        'Count enquiries that include a drawing or a defined part, not every click. Do not report those enquiries as revenue or as won orders.',
      industryExpertise:
        'The work is to describe real metal processes, materials, and the drawing-based quote. It is not to claim a machine list the plant does not have.',
      relevantExperience:
        'Published experience that touches metal fabrication is the Laser Made case, which also covers wood, acrylic, and MDF. That is related manufacturing experience, not a metal-only plant.',
      industryProofPoints:
        'The linked case is the public record. No additional metalworking clients, tolerances, or performance figures are stated here.',
    },
    faq: [
      {
        question: 'Should every alloy have its own page?',
        answer:
          'Only when the plant quotes that alloy often enough to support the page. A long list of metals the shop rarely runs makes the site harder to trust.',
      },
      {
        question: 'Can paid search replace a process page?',
        answer:
          'No. The ad can name the process, but the page still has to state the material, the enquiry, and what the shop will not take.',
      },
      {
        question: 'Does this promise a position in search or in an AI answer?',
        answer:
          'No. The work is to make the process and the enquiry clear. Rankings and citations are not guaranteed.',
      },
    ],
    ctaTitle: 'Discuss a metalworking website and enquiry path',
    ctaDescription: cta('metalworking'),
  },
  {
    slug: 'industrial-machinery-equipment',
    title: 'Industrial Machinery & Equipment',
    h1: 'Marketing for Industrial Machinery and Equipment',
    preview:
      'Product, application, and enquiry pages for companies that design or build industrial machines, masts, and related equipment.',
    metaTitle: 'B2B Marketing for Industrial Machinery Manufacturers',
    metaDescription:
      'How machinery manufacturers explain duty, application, and configuration so engineers can enquire without a generic brochure. A rank is not promised.',
    image: 'industry-machinery.jpg',
    alt: 'Bright assembly hall with industrial machines under skylights',
    displayOrder: 2,
    services: [...baseServices, 'engineering-articles-guides', 'sales-collateral-presentations'],
    posts: ['manufacturing-seo-strategy-complex-industrial-products', 'digital-lead-generation-manufacturing'],
    cases: [
      {
        slug: 'pnevmomachta-long-term-digital-presence',
        relevance: 'direct',
        note: 'Pnevmomachta designs and manufactures pneumatic telescopic masts. This is equipment manufacturing, not a general machine-tool catalog.',
      },
      {
        slug: 'paktrademash-packaging-equipment',
        relevance: 'related_product',
        note: 'The public case is a packaging-equipment website organized by equipment type. It is related equipment experience, not proof of a machine-tool factory.',
      },
    ],
    planned: [],
    fields: {
      industryOverview:
        'This industry builds or configures machines and equipment that other companies use to produce, lift, package, or operate. Buyers compare duty, options, and support, not a shelf price.',
      manufacturingProcesses:
        'Design, fabrication, assembly, and test are often in one offer. The site should say which of those steps the company performs and which stay with a partner.',
      productsAndApplications:
        'A machine line needs pages for the equipment family and for the jobs it does. Options that change the quote should be named, not buried in a PDF.',
      materialsAndTechnologies:
        'Frame materials, drives, controls, and test methods matter when they change selection. Publish the ones sales already explains, and skip decorative specification lists.',
      targetMarkets:
        'Buyers are plants, OEMs, and contractors who need a machine for a defined duty. Export and domestic pages should not pretend the support offer is identical.',
      buyerTypes:
        'An engineer specifies the duty. A project lead compares suppliers. A maintenance manager may be buying a replacement or a spare path.',
      decisionMakers:
        'Technical acceptance and commercial approval are rarely the same person. The page should serve both without hiding the operating limits.',
      buyerRequirements:
        'Useful enquiries include duty, environment, capacity, and the interface to the existing line. A form that only asks for a name cannot start a machinery quote.',
      purchasingFactors:
        'Buyers weigh fitness for the duty, documentation, lead time, and how commissioning is handled. A claim of best equipment is not a selection factor.',
      marketingChallenges:
        'Machinery sites often lead with a company story and leave the model range unnamed. The engineer cannot tell which machine applies.',
      digitalMarketSpecifics:
        'Search is split between equipment types, applications, and replacement parts. One homepage headline cannot carry all three.',
      competitiveFactors:
        'Range, duty limits, customization, and service access distinguish suppliers. Those points belong on the product page.',
      leadGenerationChallenges:
        'Vague requests for a catalog create work without a quotable duty. The landing page should ask for the application before the meeting.',
      searchBehavior:
        'People search the machine name, the application, and sometimes the standard or the interface. Each of those is a different page when you sell them.',
      seoStrategy:
        'Build a page per equipment family and per application you will quote. Link spare or accessory paths only where that offer exists.',
      aiSearchStrategy:
        'State the equipment scope, the applications, and the limits in plain sentences. Assistants may still omit you. The goal is an accurate public description, not a guaranteed mention.',
      keywordAndTopicStructure:
        'Group terms by machine family, duty, and industry served. Do not target equipment you do not build.',
      authorityAndVisibility:
        'Application notes and consistent model names help. Do not invent test results, installed-base counts, or media coverage.',
      contentStrategy:
        'Explain how to choose among the range and what information a quote needs. Keep the company history shorter than the product explanation.',
      technicalContent:
        'Duty, options, interfaces, and exclusions are the technical core. A brochure scan is not a substitute when the buyer cannot search it.',
      productAndApplicationContent:
        'Each family should show what it is for and what it is not for. Application pages should point back to the families that apply.',
      expertiseContent:
        'Show how the team matches a duty to a configuration. That is the expertise a machinery buyer can check.',
      contentFormats:
        'Family pages, application notes, option lists, and a quote checklist fit. Long videos help only when they show the machine doing the stated job.',
      buyerJourney:
        'Research starts with the application, moves to configuration, and then to a formal quote and sometimes a factory test. The site owns the first two.',
      salesCycleCharacteristics:
        'Cycles are long because duty, layout, and approval take time. A form completion is the start of qualification, not a shipment.',
      buyerQuestionsByStage:
        'Early questions are about fit. Later questions are about documents, lead time, installation, and spares. Answer them on the relevant page.',
      trustAndConversionFactors:
        'Named equipment, stated limits, and a real way to send duty data build trust. Unrelated factory photos do not.',
      leadNurturingApproach:
        'Follow-up should ask for the missing duty or layout, and point to the family page. It should not restart from a general capabilities letter.',
      websiteAndCatalogStrategy:
        'The catalog is the equipment range, with applications as the way in. Configuration and enquiry should stay on the family that was read.',
      paidAdvertisingStrategy:
        'Ads should name the equipment family and open that family page. A homepage destination hides the machine the query was about.',
      conversionOptimization:
        'Ask for duty, environment, and timeline. Offer a file upload when a layout or specification is how the quote starts.',
      analyticsAndMeasurement:
        'Separate catalog visits, configuration views, and enquiries that name a machine family. Do not convert those counts into a revenue claim.',
      industryExpertise:
        'The marketing task is to make equipment families and duties distinguishable. It is not to imply a test certificate or an installed base that is not published.',
      relevantExperience:
        'Pnevmomachta is direct equipment-manufacturing experience for pneumatic telescopic masts. PakTradeMash is a related packaging-equipment website, not a machine-tool case.',
      industryProofPoints:
        'Only those published cases are cited. No additional machinery clients or performance figures are added here.',
    },
    faq: [
      {
        question: 'Does every option need a URL?',
        answer:
          'No. Options that change the quote should be visible on the family page. A separate URL is justified when people search that option as its own product.',
      },
      {
        question: 'Should ads point at the homepage?',
        answer:
          'Not when the query names a machine family. The landing page should be that family.',
      },
      {
        question: 'Will AI search cite the equipment pages?',
        answer:
          'Not by promise. Clear scope and limits make a wrong description less likely. They do not force a citation.',
      },
    ],
    ctaTitle: 'Discuss machinery pages and the enquiry path',
    ctaDescription: cta('industrial machinery'),
  },
]
