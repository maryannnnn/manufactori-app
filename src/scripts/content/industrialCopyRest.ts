import type { IndustryCopy } from './industrialCopy'

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

export const MORE_INDUSTRIES: IndustryCopy[] = [
  {
    slug: 'building-products-construction-manufacturing',
    title: 'Building Products & Construction Manufacturing',
    h1: 'Marketing for Building Product Manufacturers',
    preview:
      'System, product, and project pages for manufacturers of facade, roofing, window, and other building products.',
    metaTitle: 'Marketing Pages for Building Product Manufacturers',
    metaDescription:
      'How building-product manufacturers separate materials, systems, and installation so architects and contractors can enquire. A rank is not promised.',
    image: 'industry-building.jpg',
    alt: 'Bright factory floor with facade panels and window frames',
    displayOrder: 3,
    services: [...baseServices, 'product-catalogs-ecommerce'],
    posts: ['manufacturing-website-architecture-large-catalogues', 'technical-content-marketing-manufacturers'],
    cases: [
      {
        slug: 'alumatrix-facade-systems',
        relevance: 'direct',
        note: 'AluMatrix designs and manufactures aluminum composite panels and mounting subsystems for ventilated facades.',
      },
      {
        slug: 'grosstek-aluminum-composite-panels',
        relevance: 'related_manufacturing',
        note: 'A separate facade-material manufacturer. Linked as related building-product experience, not as a copy of the AluMatrix case.',
      },
      {
        slug: 'npk-binar-roofing-systems',
        relevance: 'related_manufacturing',
        note: 'The published manufacturing scope is metal and copper roofing elements and drainage components, not a full building catalog.',
      },
      {
        slug: 'siblux-timber-houses-wooden-windows',
        relevance: 'related_manufacturing',
        note: 'Siblux manufactures timber houses and premium wooden windows. It is building-product experience, not a facade-panel plant.',
      },
      {
        slug: 'promtehmontg-facade-engineering-installation',
        relevance: 'related_manufacturing',
        note: 'PromTehMontg is a facade engineer-installer, not a panel manufacturer.',
      },
    ],
    planned: [],
    fields: {
      industryOverview:
        'Building-product manufacturers make materials and systems used in buildings: panels, roofing, windows, and related components. Buyers include architects, contractors, and developers, and they do not read the site the same way.',
      manufacturingProcesses:
        'Production may include panel lines, profile fabrication, glazing, or roofing components. Say which of those you run. Installation, when it is a separate offer, should not be described as the factory.',
      productsAndApplications:
        'Products are chosen for a facade, a roof, an opening, or a building type. Pages should separate the product from the system and from the project type.',
      materialsAndTechnologies:
        'Material, coating, subsystem, and the building use are the facts that change a specification. Publish the combinations you supply, not every material in the category.',
      targetMarkets:
        'Commercial, industrial, and residential projects pull different documents. A page aimed at all of them at once usually answers none of them.',
      buyerTypes:
        'Architects and specifiers look for system fit. Contractors look for supply, details, and how to order. Distributors look for the range they can stock.',
      decisionMakers:
        'Specification and purchase are often different companies. The site has to be usable by the specifier and still give the buyer a clear next step.',
      buyerRequirements:
        'Project type, system, approximate area or quantity, and location are the usual starting facts. A contact form without them creates an unqualified lead.',
      purchasingFactors:
        'System compatibility, availability, documentation, and who installs the product decide the shortlist. A lifestyle photo of a building does not.',
      marketingChallenges:
        'Sites mix manufacturing, design, and installation until the visitor cannot tell which company does which. That confusion produces the wrong enquiries.',
      digitalMarketSpecifics:
        'Search splits by product, system, and project. Brand searches and generic facade searches should not open the same page.',
      competitiveFactors:
        'Range, tested uses you can document, and the boundary between supply and installation are the real differences. Do not invent test reports.',
      leadGenerationChallenges:
        'Homeowner requests and contractor project requests need different paths. One form for both lowers the quality of both.',
      searchBehavior:
        'Specifiers search systems and materials. Contractors search supply and detail. The architecture should follow that split.',
      seoStrategy:
        'Create pages for the product families and systems you sell. Link installation only when that service is actually offered, and label it as installation.',
      aiSearchStrategy:
        'State whether you manufacture, supply, or install. Assistants mix those roles when the site does. Clear roles are the task. Citations are not promised.',
      keywordAndTopicStructure:
        'Use product, system, and project terms you can support. Do not build pages for building types you have never supplied.',
      authorityAndVisibility:
        'Project types and system pages are the public record. Do not add unnamed buildings or performance claims that are not in the published cases.',
      contentStrategy:
        'Explain the system, where it is used, and how a project enquiry should be sent. Keep manufacturing and installation in separate explanations.',
      technicalContent:
        'Details, materials, and the documents a specifier asks for belong on the system page. Do not replace a missing figure with an estimate.',
      productAndApplicationContent:
        'A facade system, a roofing component, and a window are different catalogs. They should not share one description with the noun swapped.',
      expertiseContent:
        'Show how a system is selected for a project type. That is more checkable than a claim of being a full-service construction partner.',
      contentFormats:
        'System pages, product families, project-type notes, and a clear supply-versus-install statement are the useful formats.',
      buyerJourney:
        'A specifier shortlists a system, a contractor checks supply, and a quote follows the project documents. The site should support the shortlist before the quote.',
      salesCycleCharacteristics:
        'Project cycles follow design, tender, and procurement. A download or a form is not a won facade.',
      buyerQuestionsByStage:
        'Early questions are about system fit. Later questions are about quantities, details, and who installs. Answer them in that order.',
      trustAndConversionFactors:
        'Named systems and an honest role, manufacturer or installer, build trust. Treating an installation case as a factory case does not.',
      leadNurturingApproach:
        'Follow-up should ask for the project type and the system, and should not send a generic company profile again.',
      websiteAndCatalogStrategy:
        'Catalog by product and system. Project examples should link to the system they used, and only when that example is published.',
      paidAdvertisingStrategy:
        'Ads for a panel system should open the panel system page. Ads for installation should not pretend to be the factory.',
      conversionOptimization:
        'Ask for project type, system, and location. Separate homeowner and project forms when both audiences reach the site.',
      analyticsAndMeasurement:
        'Count project enquiries that name a system. Do not treat those messages as booked construction revenue.',
      industryExpertise:
        'The work is to separate product, system, and installation. Several published cases sit in facades, roofing elements, and timber windows, and they are not the same kind of company.',
      relevantExperience:
        'AluMatrix is direct panel and subsystem manufacturing. Grosstek, NPK BINAR, and Siblux are related manufacturing in facade materials, roofing elements, and timber windows. PromTehMontg is an engineer-installer.',
      industryProofPoints:
        'The linked cases are the evidence. No extra buildings, test values, or sales figures are introduced on this page.',
    },
    faq: [
      {
        question: 'Should installation and manufacturing share a page?',
        answer:
          'No, when they are different offers. The visitor needs to know whether you make the product, install it, or both.',
      },
      {
        question: 'Do project photos replace a system page?',
        answer:
          'No. A photo without the system name does not help a specifier compare products.',
      },
      {
        question: 'Are rankings or AI citations included?',
        answer: 'No. The page can be specific and still not be cited or ranked. Neither result is promised.',
      },
    ],
    ctaTitle: 'Discuss building-product pages and project enquiries',
    ctaDescription: cta('building products'),
  },
  {
    slug: 'electrical-electronics-manufacturing',
    title: 'Electrical & Electronics Manufacturing',
    h1: 'Marketing for Electrical and Electronics Manufacturers',
    preview:
      'Specification and capability pages for companies that build electrical equipment, electronics, and related assemblies.',
    metaTitle: 'B2B Marketing for Electrical Equipment Manufacturers',
    metaDescription:
      'How electrical and electronics manufacturers publish clear specifications, applications, and enquiries without unsupported compliance claims.',
    image: 'industry-electronics.jpg',
    alt: 'Bright electronics benches with circuit boards and cable assemblies',
    displayOrder: 4,
    services: [...baseServices, 'technical-white-papers'],
    posts: ['technical-content-marketing-manufacturers', 'ai-search-optimization-for-manufacturers'],
    cases: [],
    planned: [],
    fields: {
      industryOverview:
        'This industry makes electrical equipment, electronic assemblies, and related components for other manufacturers and infrastructure projects. Buyers compare specifications and application limits, not a brand mood.',
      manufacturingProcesses:
        'Assembly, wiring, enclosure work, and test may all be in the offer. Name the steps you perform. Do not imply a certification or a cleanroom standard that is not documented.',
      productsAndApplications:
        'Products are chosen for a voltage, a function, an environment, or an OEM platform. Pages should follow those groups when they match how sales quotes.',
      materialsAndTechnologies:
        'Ratings, interfaces, and environmental limits are the technical facts that belong in public. Internal process settings that sales will not confirm should stay off the page.',
      targetMarkets:
        'OEM builds, panel shops, and infrastructure projects search differently. A single industrial electronics headline does not serve all three.',
      buyerTypes:
        'Design engineers, component engineers, and procurement teams all read the same specification for different reasons. The page should give the specification first.',
      decisionMakers:
        'Engineering accepts the rating and the interface. Procurement accepts the document set and the lead time. Hide neither behind a brochure.',
      buyerRequirements:
        'A useful enquiry names the function, the key rating, the environment, and the quantity or program. A message that only says electronics is not quotable.',
      purchasingFactors:
        'Fit to the specification, documentation, and supply continuity matter. An unsupported compliance badge is a risk, not a selling point.',
      marketingChallenges:
        'Sites pile product families into one grid and never state a rating or an exclusion. Engineers leave because they cannot check fit.',
      digitalMarketSpecifics:
        'Queries are technical and often include a function or a standard name. The landing page has to use the same term the query used, if you sell that item.',
      competitiveFactors:
        'Range, documented limits, and the ability to build to a customer specification are the differences. Price slogans are not.',
      leadGenerationChallenges:
        'Students, hobby requests, and OEM programs arrive in the same inbox. The form should ask which of those the sender is.',
      searchBehavior:
        'Engineers search the function and the limit. Buyers search the manufacturer plus the part family. Support those as separate pages when both exist.',
      seoStrategy:
        'One indexable page per product family you want enquiries for, with the ratings you will publish. Filters that create empty URLs should not be indexable.',
      aiSearchStrategy:
        'Write the ratings and the exclusions in sentences an assistant can quote without inventing a certificate. Do not promise that ChatGPT, Gemini, or Perplexity will mention you.',
      keywordAndTopicStructure:
        'Function, rating, and application are the groups. Do not add standard names you are not prepared to explain accurately.',
      authorityAndVisibility:
        'Consistent product names and public specifications are the authority you control. Do not fabricate laboratory mentions.',
      contentStrategy:
        'Lead with what the product does, the limit, and how to start a specification review. Company awards, if unpublished, are not the article.',
      technicalContent:
        'Ratings, interfaces, and environment are the content. If a number is controlled by a drawing you do not publish, say how to request it.',
      productAndApplicationContent:
        'Applications should point at the families that fit, and say when a family should not be used. That exclusion prevents bad enquiries.',
      expertiseContent:
        'Show how a requirement is matched to a family. Do not imply a regulatory approval that is not on the record.',
      contentFormats:
        'Family pages, application notes, and a specification checklist are the core. A downloadable sheet helps when it matches the page.',
      buyerJourney:
        'The engineer checks fit, the team requests documents, and procurement compares supply. The site is responsible for the fit check.',
      salesCycleCharacteristics:
        'Programs and qualified-supplier steps take longer than a spot buy. Marketing measurement should not call a document request a purchase order.',
      buyerQuestionsByStage:
        'First questions are about ratings. Later questions are about documents, revisions, and lead time. Keep those answers apart.',
      trustAndConversionFactors:
        'A stated limit and a way to send a specification build trust. A stock photo of a circuit board without a product name does not.',
      leadNurturingApproach:
        'If the rating is incomplete, the follow-up asks for it. It does not send a second generic capabilities PDF.',
      websiteAndCatalogStrategy:
        'The catalog is the family tree of electrical and electronic products you sell. Each family needs its own enquiry context.',
      paidAdvertisingStrategy:
        'Keywords should map to a family page. Bidding on a component you do not make creates the wrong conversation.',
      conversionOptimization:
        'Ask for function, key rating, and quantity or program stage. Leave off fields engineering will ignore.',
      analyticsAndMeasurement:
        'Report specification requests and family-level enquiries. Do not attribute factory revenue to a click.',
      industryExpertise:
        'The task is accurate public specifications and a clean enquiry. There is no published case study on this site that is an electronics manufacturing plant.',
      relevantExperience:
        'Security-system and energy-efficiency records exist on the site, and they are service or contractor work. They are not used here as electronics manufacturing proof.',
      industryProofPoints:
        'No direct electronics manufacturing case is linked, because none of the published records is that. No performance numbers are added to fill the gap.',
    },
    faq: [
      {
        question: 'Should we publish every compliance mark we hope to earn?',
        answer: 'No. Publish only marks and standards you can describe accurately. A hoped-for approval is not a page.',
      },
      {
        question: 'Is a distributor page the same as a manufacturer page?',
        answer: 'No. If you build the product, say so. If you only supply it, say that instead.',
      },
      {
        question: 'Does clearer specification content guarantee AI citations?',
        answer: 'No. It makes an inaccurate description less likely. It does not guarantee a citation.',
      },
    ],
    ctaTitle: 'Discuss electrical product pages and specifications',
    ctaDescription: cta('electrical and electronics manufacturing'),
  },
  {
    slug: 'automotive-aerospace-transportation',
    title: 'Automotive, Aerospace & Transportation',
    h1: 'Marketing for Transportation Component Manufacturers',
    preview:
      'Capability and documentation pages for manufacturers supplying automotive, aerospace, and other transportation programs.',
    metaTitle: 'Marketing for Transportation Component Manufacturers',
    metaDescription:
      'How transportation suppliers explain processes, traceability, and quotation steps without inventing approvals or program wins. A rank is not promised.',
    image: 'industry-transportation.jpg',
    alt: 'Bright automotive component plant with machined parts and a chassis fixture',
    displayOrder: 5,
    services: [...baseServices, 'international-marketing-strategy'],
    posts: ['manufacturing-seo-strategy-complex-industrial-products', 'technical-content-marketing-manufacturers'],
    cases: [],
    planned: [],
    fields: {
      industryOverview:
        'Suppliers in this group make components, assemblies, or process services for vehicles, aircraft programs, and other transport equipment. The public site has to respect how those buyers qualify a source.',
      manufacturingProcesses:
        'Machining, fabrication, electronics, or assembly may all appear. Describe the processes you run for this market. Do not borrow a quality-system name you cannot explain.',
      productsAndApplications:
        'Pages should group parts by vehicle area, system, or process, matching the way programs are quoted. A single transportation page is too broad for a real part.',
      materialsAndTechnologies:
        'Material, process, and traceability expectations are part of the offer. Publish the ones your quality team will confirm on a call.',
      targetMarkets:
        'Passenger vehicles, commercial vehicles, aerospace, and rail do not share one specification pack. Do not imply you serve a mode you have no public example for.',
      buyerTypes:
        'Supplier-quality, engineering, and commodity buyers read different parts of the same record. The site should make the process and the document path obvious to all three.',
      decisionMakers:
        'Engineering owns the print. Supplier quality owns the process evidence. Purchasing owns the commercial step. The enquiry should identify which conversation is starting.',
      buyerRequirements:
        'Part description, process, volume range, and the documentation you can provide are the minimum. Do not ask the visitor to guess your approval status.',
      purchasingFactors:
        'Process fit, traceability, capacity, and how changes are controlled influence the shortlist. A claim of being aerospace grade, without evidence, does not.',
      marketingChallenges:
        'Suppliers sound identical when every page says safety and quality. Buyers need the process and the part family.',
      digitalMarketSpecifics:
        'Search includes part types, processes, and sometimes a platform word. Bidding or writing for a platform you do not supply attracts the wrong program.',
      competitiveFactors:
        'Process range, documentation discipline, and the markets you will actually quote separate suppliers. Unnamed OEM logos do not.',
      leadGenerationChallenges:
        'A request without a part or a volume is hard to qualify. The form should collect those facts before a meeting is booked.',
      searchBehavior:
        'Engineers search the process and the part. Buyers search an approved-supplier style question. Answer only the version you can support.',
      seoStrategy:
        'Publish process and part-family pages for the transportation work you want. Keep unrelated consumer vehicle content off those URLs.',
      aiSearchStrategy:
        'State the markets and processes plainly, including limits. Do not write copy that nudges an assistant to invent an OEM approval. Citations are not promised.',
      keywordAndTopicStructure:
        'Process, part family, and market are enough. Platform names belong on a page only when that work is real and describable.',
      authorityAndVisibility:
        'Your own process descriptions are the safe public source. Do not invent customer names or audit results.',
      contentStrategy:
        'Explain how a drawing becomes a quoted process, and which documents you provide. Skip superlatives about safety culture.',
      technicalContent:
        'Materials, processes, and the traceability you actually maintain are the technical pages. If a record stays internal, say that it is available on request.',
      productAndApplicationContent:
        'Separate automotive, aerospace, and other transport uses when the requirements differ. Do not merge them to look broader.',
      expertiseContent:
        'Show how a print is reviewed for process fit. That is expertise. A list of hoped-for industries is not.',
      contentFormats:
        'Process pages, part-family pages, and a documentation checklist match the way these buyers evaluate a plant.',
      buyerJourney:
        'A print is reviewed, a process is proposed, and a qualification step may follow. The website supports the review, not the approval decision.',
      salesCycleCharacteristics:
        'Program timing, tooling, and document packages make this a long cycle. An enquiry is not a nomination.',
      buyerQuestionsByStage:
        'Early questions are about process and material. Later questions are about documents, capacity, and change control. Keep the answers specific.',
      trustAndConversionFactors:
        'A precise process description and a file upload build more trust than a vehicle photograph with no part named.',
      leadNurturingApproach:
        'Follow-up should request the print, the volume band, and the market. It should not promise a qualification outcome.',
      websiteAndCatalogStrategy:
        'Organize by process and part family. Market pages should link only to families you will quote in that market.',
      paidAdvertisingStrategy:
        'Use part and process terms you can land on a matching page. Exclude consumer vehicle shopping queries.',
      conversionOptimization:
        'Ask for part type, process, market, and a drawing. State that the message starts a review, not an approval.',
      analyticsAndMeasurement:
        'Count drawing reviews requested. Do not report them as program wins or revenue.',
      industryExpertise:
        'The useful work is an honest process and document path for transportation parts. This site does not currently publish a case that is an automotive or aerospace plant.',
      relevantExperience:
        'Metal and equipment cases on the site are adjacent manufacturing work. They are not presented here as transportation-program experience.',
      industryProofPoints:
        'No transportation case is linked. No OEM names, approvals, or volumes are invented to fill that absence.',
    },
    faq: [
      {
        question: 'Can we say we are qualified for a market we hope to enter?',
        answer: 'No. Describe the process you can quote today. A target market is not a qualification.',
      },
      {
        question: 'Should consumer vehicle keywords be in the campaign?',
        answer: 'Not if you sell components to programs. Those queries are a different buyer.',
      },
      {
        question: 'Does this include a guaranteed supplier nomination?',
        answer: 'No. Digital work can make the process clear. It does not award a program.',
      },
    ],
    ctaTitle: 'Discuss transportation component pages',
    ctaDescription: cta('transportation components'),
  },
  {
    slug: 'chemical-process-manufacturing',
    title: 'Chemical & Process Manufacturing',
    h1: 'Marketing for Chemical and Process Manufacturers',
    preview:
      'Application and specification pages for process plants, formulated products, and equipment tied to a defined operating window.',
    metaTitle: 'B2B Marketing for Chemical and Process Manufacturers',
    metaDescription:
      'How process manufacturers explain operating windows, applications, and enquiries without unsupported safety or compliance claims. A rank is not promised.',
    image: 'industry-chemical.jpg',
    alt: 'Bright process hall with stainless steel tanks and piping',
    displayOrder: 6,
    services: [...baseServices, 'engineering-articles-guides'],
    posts: ['technical-content-marketing-manufacturers', 'manufacturing-seo-strategy-complex-industrial-products'],
    cases: [],
    planned: [],
    fields: {
      industryOverview:
        'Chemical and process manufacturers sell formulations, intermediates, or equipment defined by an operating window. Buyers need composition or duty, not a lifestyle description of industry.',
      manufacturingProcesses:
        'Batch, continuous, blending, and fabrication of process equipment are different offers. Name the one you run. Do not describe a tolling service as if it were a branded chemical.',
      productsAndApplications:
        'Products are chosen for an application, a compatibility, or a duty. Pages should state the use and the conditions that make the product unsuitable.',
      materialsAndTechnologies:
        'Materials of construction, operating range, and handling constraints are the public technical core. Safety documents that must stay controlled should be requested, not improvised on the page.',
      targetMarkets:
        'Plants, formulators, and OEMs of process equipment search with different words. Split those paths when you sell to more than one.',
      buyerTypes:
        'Process engineers, EHS reviewers, and procurement all need the same facts in a stable place. The engineer looks first for the window of use.',
      decisionMakers:
        'Technical acceptance often precedes the purchase order by a long review. The site should support that review with stable names and limits.',
      buyerRequirements:
        'Application, operating conditions, quantity or duty, and the document needed are the useful enquiry fields. A free-text message alone is a weak start.',
      purchasingFactors:
        'Compatibility, documentation, supply form, and lead time decide. A claim of being the safest choice, without a stated limit, is not acceptable copy.',
      marketingChallenges:
        'Process sites hide the product behind a corporate sustainability paragraph. The buyer still has to ask what you make.',
      digitalMarketSpecifics:
        'Queries use chemical functions, equipment types, and application words. Generic industrial solutions pages do not match them.',
      competitiveFactors:
        'The operating window, the form of supply, and the documents you will share are the differences. Superlatives about purity need a source.',
      leadGenerationChallenges:
        'Unspecified applications create a safety and estimating problem. The form should require the use case.',
      searchBehavior:
        'Engineers search the application and the constraint. Procurement may search the product family. Both need a page that states limits.',
      seoStrategy:
        'Build pages around product families and applications you can support, and say when a use is outside scope. Do not index thin parameter copies.',
      aiSearchStrategy:
        'Assistants invent operating limits when the site is vague. Publish the window you will stand behind, and do not promise an AI citation.',
      keywordAndTopicStructure:
        'Family, application, and equipment type are the groups. Do not target regulated claims you cannot phrase accurately.',
      authorityAndVisibility:
        'Consistent names and public limits are the record. Do not invent registrations or laboratory partnerships.',
      contentStrategy:
        'Explain what the product or vessel is for, the limit, and how to request the controlled document. That is the content this buyer needs.',
      technicalContent:
        'Operating window, materials, and exclusions are the technical pages. If a number is not public, say how a qualified buyer requests it.',
      productAndApplicationContent:
        'Applications should name the duty and the product family. A page that only says process solutions is not an application page.',
      expertiseContent:
        'Show how an application is checked against the window. Do not imply a hazard approval that is not published.',
      contentFormats:
        'Family pages, application notes, and a document-request path fit. Safety theater without the actual limit does not.',
      buyerJourney:
        'The engineer checks fit, the reviewer asks for documents, and procurement quotes an accepted item. The site is for the fit check and the request.',
      salesCycleCharacteristics:
        'Trials, document reviews, and plant approvals stretch the cycle. A download is not a supply agreement.',
      buyerQuestionsByStage:
        'Early questions are about suitability. Later questions are about documents, pack size or duty, and lead time.',
      trustAndConversionFactors:
        'A stated exclusion builds more trust than an unqualified safety claim. The enquiry should capture the application.',
      leadNurturingApproach:
        'If the duty is incomplete, ask for it. Do not send a general brochure that restarts the explanation.',
      websiteAndCatalogStrategy:
        'Catalog by family and application. Equipment and chemistry should not share a template if the buyer questions differ.',
      paidAdvertisingStrategy:
        'Land on the family or application that matches the query. Do not buy terms for products you will not ship.',
      conversionOptimization:
        'Require the application and the key condition. Explain that a message starts a suitability check.',
      analyticsAndMeasurement:
        'Count suitability requests that name an application. Do not turn them into a production-volume or revenue report.',
      industryExpertise:
        'The work is a clear operating window and an honest enquiry. This site has no published case of a chemical plant or a formulated-product factory.',
      relevantExperience:
        'Process language from other industrial sites is not treated as chemical-manufacturing experience. No adjacent case is forced onto this page.',
      industryProofPoints:
        'No chemical or process-plant case is linked. No registrations, capacities, or incident-free claims are added.',
    },
    faq: [
      {
        question: 'Can marketing copy replace a safety document?',
        answer: 'No. The page can say how to request the document. It should not invent the figures the document contains.',
      },
      {
        question: 'Should every application have a page?',
        answer: 'Only applications you will actually review and quote. A borrowed list of industries creates bad enquiries.',
      },
      {
        question: 'Are AI citations part of the offer?',
        answer: 'No. Clear limits help accuracy. They do not guarantee that an assistant will cite the page.',
      },
    ],
    ctaTitle: 'Discuss process pages and suitability enquiries',
    ctaDescription: cta('chemical and process manufacturing'),
  },
  {
    slug: 'medical-specialized-manufacturing',
    title: 'Medical, Precision & Specialized Manufacturing',
    h1: 'Marketing for Medical, Precision, and Specialized Manufacturers',
    preview:
      'Specification pages for medical-device, precision, and other specialized manufacturers, written around intended use and documented limits.',
    metaTitle: 'B2B Marketing for Medical and Specialized Makers',
    metaDescription:
      'How medical, precision, and specialized manufacturers explain intended use, documents, and enquiries without unsupported regulatory claims.',
    image: 'industry-medical.jpg',
    alt: 'Bright assembly room with small stainless and plastic device components',
    displayOrder: 7,
    services: [...baseServices, 'technical-white-papers'],
    posts: ['technical-content-marketing-manufacturers', 'ai-search-optimization-for-manufacturers'],
    cases: [],
    planned: [],
    fields: {
      industryOverview:
        'This group covers medical-device manufacturing and other specialized production where the product has a narrow intended use. A custom retail fixture is specialized equipment, and it is not a medical device.',
      manufacturingProcesses:
        'Machining, molding, assembly, and finishing may apply. Describe the steps you run for the device or specialty product. Do not imply a quality-system certificate that is not public.',
      productsAndApplications:
        'Pages should name the product family and the use it is built for. Adjacent uses that you will not support should be excluded in the same section.',
      materialsAndTechnologies:
        'Materials, cleanliness expectations you can document, and critical dimensions that are public belong here. Controlled drawings stay request-only.',
      targetMarkets:
        'Device companies, clinical buyers, and industrial specialty OEMs are not one audience. Do not place them on one page to look larger.',
      buyerTypes:
        'Engineers, quality reviewers, and purchasing read the intended use first. If the use is wrong, the rest of the page does not matter.',
      decisionMakers:
        'Technical and quality acceptance come before a purchase. The site should make the document path visible without inventing an approval.',
      buyerRequirements:
        'Intended use, key specification, quantity or program, and the document requested are the fields that make an enquiry reviewable.',
      purchasingFactors:
        'Fit to the intended use, documentation, and change control matter. A clinical-looking photograph is not evidence.',
      marketingChallenges:
        'Specialized plants either hide behind the word quality or list every possible industry. Both make the real product hard to find.',
      digitalMarketSpecifics:
        'Search uses product and procedure language. Broad medical manufacturing terms attract the wrong programs.',
      competitiveFactors:
        'The documented use, the process, and the materials you will confirm are the differences. Regulatory adjectives without a source are not.',
      leadGenerationChallenges:
        'Consumer health questions and OEM component questions should not share one form. The mismatch wastes a quality review.',
      searchBehavior:
        'Engineers search the component and the use. Patients, if they are not your buyer, should not be the landing-page audience.',
      seoStrategy:
        'Publish family pages for the specialty products you sell, with the intended use and the exclusion. Do not create a page per unapproved claim.',
      aiSearchStrategy:
        'Write intended use and limits so an assistant is less likely to invent a clinical claim. Do not promise mentions in ChatGPT, Gemini, or Perplexity.',
      keywordAndTopicStructure:
        'Product family and intended use are the groups. Disease or outcome terms are out of scope unless you can support them, which this page does not assume.',
      authorityAndVisibility:
        'Your own specification language is the safe source. Do not invent hospital names, studies, or clearances.',
      contentStrategy:
        'Explain the product, the use, the limit, and how a qualified buyer requests documents. Do not write patient advice.',
      technicalContent:
        'Materials, public specifications, and the document list are the technical content. Missing numbers stay missing.',
      productAndApplicationContent:
        'Each family should say who it is for. Specialized industrial products and medical products should not share a paragraph.',
      expertiseContent:
        'Show how an enquiry is checked against the intended use. That is the expertise. A list of prestigious markets is not.',
      contentFormats:
        'Family pages, a document checklist, and a clear exclusion note are enough. Patient stories are not a fit for a component manufacturer.',
      buyerJourney:
        'A buyer checks use, requests documents, and may run a supplier review. The website supports the first two steps only.',
      salesCycleCharacteristics:
        'Reviews and change control make the cycle long. A form submit is not a cleared product or a purchase order.',
      buyerQuestionsByStage:
        'First questions are about use and materials. Later questions are about documents and change control. Keep them separate.',
      trustAndConversionFactors:
        'An explicit intended use and a document request build trust. Implying a clearance you do not name does the opposite.',
      leadNurturingApproach:
        'Follow-up asks for the use and the specification gap. It does not offer a clinical outcome.',
      websiteAndCatalogStrategy:
        'Separate medical families from other specialized products. Each family keeps its own enquiry context.',
      paidAdvertisingStrategy:
        'Use component and process terms that match a family page. Do not buy consumer symptom queries.',
      conversionOptimization:
        'Ask for intended use and the specification to review. Say that the message is a manufacturer enquiry.',
      analyticsAndMeasurement:
        'Count document and specification requests. Do not report them as clinical results or revenue.',
      industryExpertise:
        'The work is precise intended use and a document path. No published case on this site is a medical-device factory.',
      relevantExperience:
        'Aleks SF manufactures jewelry-store equipment. That is specialized equipment, not medical-device manufacturing, and it is listed below as related product experience.',
      industryProofPoints:
        'No medical or device case is cited. Aleks SF is related specialized equipment only. No clearances, studies, or outcome claims are added.',
    },
    faq: [
      {
        question: 'Is custom equipment outside medicine part of this page?',
        answer:
          'The industry name includes specialized manufacturing. A non-medical product still needs its own family page, and it should not borrow medical language.',
      },
      {
        question: 'Can we mention a clearance we plan to seek?',
        answer: 'No. Describe the product you can document today.',
      },
      {
        question: 'Will better pages guarantee an AI citation?',
        answer: 'No. They reduce the chance of an invented claim. They do not guarantee a citation.',
      },
    ],
    ctaTitle: 'Discuss specialized product pages and document requests',
    ctaDescription: cta('specialized manufacturing'),
  },
  {
    slug: 'agriculture-mining-industrial-supply',
    title: 'Agriculture, Mining & Industrial Supply',
    h1: 'Marketing for Agriculture, Mining, and Industrial Supply',
    preview:
      'Duty, parts, and distributor pages for equipment and supply companies serving farms, mines, and plant maintenance.',
    metaTitle: 'B2B Marketing for Agriculture and Mining Suppliers',
    metaDescription:
      'How agriculture, mining, and industrial-supply companies explain duty, parts, and distributor paths without invented field results. A rank is not promised.',
    image: 'industry-agriculture.jpg',
    alt: 'Bright workshop with a green tractor and field implements',
    displayOrder: 8,
    services: [...baseServices, 'distributor-channel-enablement'],
    posts: ['digital-lead-generation-manufacturing', 'manufacturing-website-architecture-large-catalogues'],
    cases: [],
    planned: [],
    fields: {
      industryOverview:
        'This group includes agricultural equipment, mining and heavy-duty components, and the industrial suppliers that stock or distribute them. A manufacturer and a distributor should not use the same sentence.',
      manufacturingProcesses:
        'Fabrication, assembly, wear-part production, and kitting are different operations. State which one the company does. A catalog reseller is not a factory.',
      productsAndApplications:
        'Equipment and parts are chosen for a duty: crop, ore, abrasion, or a maintenance task. Pages should name that duty and the product family.',
      materialsAndTechnologies:
        'Wear materials, fitment, and the machines a part fits are the facts buyers check. Do not publish a hardness or a life figure you cannot source.',
      targetMarkets:
        'Farms, mines, quarries, and plant storerooms overlap in harsh duty and diverge in how they buy. Split those paths.',
      buyerTypes:
        'Owners, maintenance planners, and distributors ask different questions. The distributor page is not the end-user page.',
      decisionMakers:
        'Maintenance may specify the part, and purchasing or the dealer may place the order. The site should serve the specification and show who to contact.',
      buyerRequirements:
        'Machine, duty, part identification, and quantity or season are the useful enquiry facts. A request that says send a catalog is incomplete.',
      purchasingFactors:
        'Fit, availability, duty match, and who supports the part decide the order. A rural photograph does not identify the part.',
      marketingChallenges:
        'Sites mix the brand of equipment they build with the brands they only stock. Buyers cannot tell who makes the item.',
      digitalMarketSpecifics:
        'Search is full of part numbers, machine models, and generic heavy-equipment terms. The page should match the level you can fulfill.',
      competitiveFactors:
        'Range, fitment clarity, and supply path distinguish companies. An unsupported uptime claim does not.',
      leadGenerationChallenges:
        'Part requests without a machine or a duty are hard to quote. The form has to ask for both.',
      searchBehavior:
        'Users search a machine, a wear part, or a supplier type. Those three queries need three destinations when you serve all three.',
      seoStrategy:
        'Publish family pages for equipment or parts you supply, and a separate explanation when a dealer network is the route to buy.',
      aiSearchStrategy:
        'State whether you manufacture or distribute, and for which duty. Assistants confuse those roles. Citations are not promised.',
      keywordAndTopicStructure:
        'Duty, equipment family, and part family are the groups. Do not target machine brands you are not allowed to represent.',
      authorityAndVisibility:
        'Clear fitment and role are the public record. Do not invent yield, tons, or dealer counts.',
      contentStrategy:
        'Explain the duty, the family, and how to identify the part. Keep manufacturer and distributor language separate.',
      technicalContent:
        'Fitment, materials you will confirm, and operating limits you can stand behind are the technical pages.',
      productAndApplicationContent:
        'Agriculture, mining, and general MRO supply should not share one product grid if the duties differ.',
      expertiseContent:
        'Show how a duty is matched to a family or a part. That is useful. A claim about harvest or mine output is not, unless it is already published, which it is not here.',
      contentFormats:
        'Family pages, fitment notes, and a distributor or direct-enquiry explanation are the right formats.',
      buyerJourney:
        'A user identifies the machine or duty, checks the family, and asks for availability. The site should finish the identification step.',
      salesCycleCharacteristics:
        'Seasons, shutdowns, and dealer stock change the timing. An enquiry is not a shipped part.',
      buyerQuestionsByStage:
        'Early questions identify the part. Later questions are about availability, alternates, and who sells it in that region.',
      trustAndConversionFactors:
        'A named family and a role, maker or distributor, are the trust signals. Unrelated heavy-machinery drama is not.',
      leadNurturingApproach:
        'Follow-up should ask for the machine and the duty if they were missing. It should not offer a fictional field trial.',
      websiteAndCatalogStrategy:
        'Separate manufactured lines from distributed lines. Parts pages should say how to confirm fitment.',
      paidAdvertisingStrategy:
        'Land part and equipment queries on the matching family. Exclude brands and models you do not supply.',
      conversionOptimization:
        'Ask for machine, duty, and quantity. If a dealer must respond, say that on the form.',
      analyticsAndMeasurement:
        'Count identified part or equipment enquiries. Do not convert them into tons, acres, or revenue.',
      industryExpertise:
        'The task is to separate agriculture, mining, and industrial supply, and to label maker versus distributor. No published case on this site is a farm-equipment or mining plant.',
      relevantExperience:
        'Harsh-duty manufacturing elsewhere on the site is not reclassified as agriculture or mining experience.',
      industryProofPoints:
        'No agriculture, mining, or industrial-supply case is linked. No field metrics are created.',
    },
    faq: [
      {
        question: 'Should a distributor use the same pages as a manufacturer?',
        answer: 'No. The buyer needs to know who makes the part and who can supply it.',
      },
      {
        question: 'Can we publish a part number we do not stock?',
        answer: 'No. A page for a number you cannot identify or supply creates a bad enquiry.',
      },
      {
        question: 'Does this promise more quotes from the field?',
        answer: 'No. It makes the duty and the path clear. It does not promise a volume of enquiries.',
      },
    ],
    ctaTitle: 'Discuss equipment, parts, and supply pages',
    ctaDescription: cta('agriculture, mining, or industrial supply'),
  },
  {
    slug: 'engineering-technical-services',
    title: 'Engineering & Technical Services',
    h1: 'Marketing for Engineering and Technical Services',
    preview:
      'Scope and deliverable pages for engineering firms whose offer is a study, a design, or a technical service rather than a shipped SKU.',
    metaTitle: 'B2B Marketing for Engineering and Technical Services',
    metaDescription:
      'How engineering firms explain scope, deliverables, and the next technical question without packaging the work as a product catalog. A rank is not promised.',
    image: 'industry-engineering.jpg',
    alt: 'Bright engineering bench with drawings and a metal prototype',
    displayOrder: 9,
    services: [...baseServices, 'buyer-persona-research', 'sales-enablement'],
    posts: ['ai-search-optimization-for-manufacturers', 'manufacturing-seo-strategy-complex-industrial-products'],
    cases: [
      {
        slug: 'vimpel-engineering-anechoic-chambers',
        relevance: 'direct',
        note: 'Vimpel Engineering is published as specialist engineering for anechoic chambers. It does not represent every engineering discipline.',
      },
      {
        slug: 'ovik-montag-hvac-engineering-seo',
        relevance: 'related_manufacturing',
        note: 'Ovik Montag is a building-engineering contractor for heating, ventilation, and air conditioning, not a product factory.',
      },
    ],
    planned: [],
    fields: {
      industryOverview:
        'Engineering and technical service firms sell a scope: design, calculation, test, or a defined field service. The website fails when it looks like a product catalog with no deliverable.',
      manufacturingProcesses:
        'Some firms also fabricate a chamber, a duct, or a test article. Say when hardware is part of the scope and when the deliverable is a document or a service only.',
      productsAndApplications:
        'The offer is a service line and the problems it addresses. Pages should name the deliverable, the input the client must provide, and the applications in scope.',
      materialsAndTechnologies:
        'Methods, tools, and technical domains belong here when they change the engagement. A wall of software logos does not explain the work.',
      targetMarkets:
        'Industrial clients, building projects, and laboratories brief engineers differently. Keep those scopes apart if the deliverable changes.',
      buyerTypes:
        'A technical lead hires the scope. Procurement may contract it. The page should be readable by the person who must judge competence.',
      decisionMakers:
        'The reviewer looks for relevant scope and exclusions. Commercial terms come after the technical fit is clear.',
      buyerRequirements:
        'A useful enquiry names the problem, the site or product, the desired deliverable, and the timing. A request to call about engineering is not enough.',
      purchasingFactors:
        'Relevant scope, clarity of deliverable, and how information is exchanged decide the shortlist. Years-in-business is a weak substitute.',
      marketingChallenges:
        'Engineering sites list every discipline and never show a deliverable. The buyer cannot tell what an engagement produces.',
      digitalMarketSpecifics:
        'Search is for a specific engineering problem. A homepage that says innovative solutions does not match that query.',
      competitiveFactors:
        'Scope boundaries, the artifact delivered, and the industries where that scope has been published are the differences.',
      leadGenerationChallenges:
        'Broad requests waste senior time. The page should show an example scope so unfit work self-selects out.',
      searchBehavior:
        'People search the problem and the deliverable, such as a calculation, a chamber, or a system design. The page should use those words when they are accurate.',
      seoStrategy:
        'One page per service line, with the deliverable and the exclusion. Do not create a page for a discipline you do not practice.',
      aiSearchStrategy:
        'Describe the scope in sentences that cannot be mistaken for a product SKU or a guaranteed test result. Do not promise assistant citations.',
      keywordAndTopicStructure:
        'Problem, deliverable, and domain are the groups. Discipline names you do not staff should stay out.',
      authorityAndVisibility:
        'Published scopes are the authority. Do not add unnamed reference sites or invented peer-reviewed work.',
      contentStrategy:
        'Explain the engagement: input, work, deliverable, and what is not included. That is more useful than a manifesto.',
      technicalContent:
        'Methods you will describe publicly, and the questions that start a review, are the technical content. Detailed client data stays off the page.',
      productAndApplicationContent:
        'If hardware is delivered, give it a product path. If only a service is delivered, do not force it into a catalog template.',
      expertiseContent:
        'Show how a problem is framed into a scope. Limit the claim to disciplines the published record supports.',
      contentFormats:
        'Service-line pages, a sample outline of a deliverable, and a short list of exclusions fit this industry.',
      buyerJourney:
        'A client recognizes the problem, checks the scope, and sends the starting information. Contracting and the work follow offline.',
      salesCycleCharacteristics:
        'Proposals, site data, and revisions make the cycle longer than a parts order. A contact form is not a signed scope.',
      buyerQuestionsByStage:
        'Early questions ask what you deliver. Later questions ask what you need from the client and how changes are handled.',
      trustAndConversionFactors:
        'A named deliverable and a real limitation build trust. A stock photo of people at a whiteboard does not.',
      leadNurturingApproach:
        'Follow-up should request the missing problem statement or site data. It should not resell the entire firm.',
      websiteAndCatalogStrategy:
        'Structure the site as service lines. Hardware, if any, is a separate branch with its own enquiry.',
      paidAdvertisingStrategy:
        'Advertise the problem and the deliverable, and open that service page. Do not buy generic engineering jobs unrelated to the scope.',
      conversionOptimization:
        'Ask for the problem, the deliverable expected, and the timing. Say what the first reply will and will not include.',
      analyticsAndMeasurement:
        'Count enquiries that name a scope. Do not report them as booked engineering hours or revenue.',
      industryExpertise:
        'The work is to make scopes and deliverables explicit. Vimpel Engineering is the published specialist example, limited to anechoic-chamber engineering.',
      relevantExperience:
        'Vimpel is direct experience for that chamber scope. Ovik Montag is related experience as an HVAC engineering contractor, not as a product manufacturer and not as a stand-in for every discipline.',
      industryProofPoints:
        'Those two published records are the proof. No additional offices, licenses, or project counts are stated.',
    },
    faq: [
      {
        question: 'Should an engineering firm use a product-catalog template?',
        answer: 'Only for hardware it actually delivers. A study or a design scope needs a page that names the deliverable.',
      },
      {
        question: 'Can one page list every discipline?',
        answer: 'A directory can list them. The rankable, useful page is the discipline you can scope.',
      },
      {
        question: 'Does a clear scope guarantee the firm will be cited by AI search?',
        answer: 'No. It makes the scope harder to invent. It does not guarantee a citation.',
      },
    ],
    ctaTitle: 'Discuss service-line pages and the first technical question',
    ctaDescription: cta('engineering services'),
  },
]

export const OVERVIEW = {
  title: 'Industrial',
  h1: 'Marketing Built Around the Manufacturing Industry',
  metaTitle: 'An Industrial Marketing Approach for Manufacturers',
  metaDescription:
    'Why manufacturing marketing has to follow the industry, the product, the buyer, and a long B2B cycle instead of a generic promotion. A rank is not promised.',
  image: 'industry-overview.jpg',
  alt: 'Bright modern factory interior with skylights and mixed equipment',
  intro: [
    'Manufacturing marketing starts from the industry in front of you. A machined part, a machine, a facade system, an electrical assembly, and a process vessel are not sold with the same page or the same enquiry.',
    'Generic promotion treats the plant as a logo and a list of qualities. The buyer is usually trying to match a specification, an application, or a production limit. The site has to help with that match before it asks for a meeting.',
  ],
  sections: [
    {
      title: 'Manufacturing industry expertise',
      paragraphs: [
        'Each industry on this site has its own products, processes, and buyers. The nine primary pages are where that detail lives. This page only explains why the split exists.',
        'Expertise here means describing what the company makes and how a buyer checks it. It does not mean borrowing a case study from another sector and renaming it.',
      ],
    },
    {
      title: 'Industry-specific website architecture',
      paragraphs: [
        'A useful industrial site is organized the way the buyer searches and the way sales quotes. That may be process and material, equipment family and duty, or system and project type.',
        'The homepage cannot carry every product. Family and application pages should be the ones that receive the enquiry, with internal links that reflect the real range.',
      ],
    },
    {
      title: 'SEO and AI search for manufacturing',
      paragraphs: [
        'Search visibility depends on technical language, specifications, and applications that match a real offer. A page of interchangeable adjectives gives neither ordinary search nor an AI assistant anything accurate to use.',
        'AI search work on this site means clearer entities, limits, and sources. It does not mean a guaranteed citation in ChatGPT, Gemini, Perplexity, or any other assistant.',
      ],
    },
    {
      title: 'Technical content and industry knowledge',
      paragraphs: [
        'Technical content is the explanation a specialist, an engineer, or a buyer needs in order to judge fit. It includes materials, duties, exclusions, and the documents required for a quote.',
        'The same outline does not fit every industry. A drawing upload matters in metalworking. An operating window matters in process manufacturing. The industry pages say which.',
      ],
    },
    {
      title: 'B2B buyer journey and long sales cycles',
      paragraphs: [
        'Industrial purchases move through research, technical review, quotation, and approval. A form submission is an early step. It is not a closed sale, and the reporting should not pretend that it is.',
        'Content and follow-up have to match the stage. Early pages answer fit. Later messages ask for the missing specification instead of repeating the company introduction.',
      ],
    },
    {
      title: 'Digital marketing for manufacturing companies',
      paragraphs: [
        'Websites, SEO, Google Ads, technical content, enquiry design, and measurement are useful together when they point at the same product truth. Running them as separate campaigns with different claims creates confusion.',
        'Paid media should open the page that matches the query. Analytics should count qualified enquiries and defined actions. It should not claim factory revenue from a click.',
      ],
    },
    {
      title: 'Relevant services and practical experience',
      paragraphs: [
        'The service pages describe the work: strategy, websites, search, paid media, technical content, and sales systems. Industry pages point to the services that fit that industry. They do not paste the service text again.',
        'Case studies are linked only where the published record is direct or clearly related. A facade manufacturer is not evidence for a chemical plant, and the industry pages keep that distinction.',
      ],
    },
    {
      title: 'Questions',
      paragraphs: [
        'Why are there nine industries instead of one manufacturing page? Because the product, the buyer, and the enquiry are different. One page would hide those differences.',
        'Will every industry page list the same services? No. The set overlaps, and it changes where the work changes, such as distributor pages for supply companies or specification pages for electronics.',
        'Are secondary industry pages live? Not yet. Primary pages show planned specializations as cards. Those cards are not links, because the pages do not exist.',
      ],
    },
    {
      title: 'Talk through an industry',
      paragraphs: [
        'If you manufacture in one of these industries, the useful next step is to look at the product range, the buyer, and the enquiry you want. Start from the industry page, or send the product context directly.',
      ],
    },
  ],
}
