import { CHEMICAL_FIELD_KEYS } from './chemicalSpecializationTypes'
import type { ChemicalSpecializationCopy } from './chemicalSpecializationTypes'

export type SupplySpecializationCopy = ChemicalSpecializationCopy
export const SUPPLY_FIELD_KEYS = CHEMICAL_FIELD_KEYS

const cta = (subject: string) =>
  `Tell us what you manufacture or supply in ${subject} and which buyers should be able to evaluate it. The first conversation is about product families, the maker or distributor role, and the enquiry path, not a promised ranking, field result, or revenue figure.`

export const PARENT_FIELD_UPDATES: Record<string, string> = {
  industryOverview:
    'This group includes three different offers. <a href="/industrial/agriculture-agricultural-equipment">Agriculture and agricultural equipment</a> is manufacturing of farm machines, implements, and parts. <a href="/industrial/mining-heavy-industry">Mining and heavy industry</a> is manufacturing of mining and quarry equipment and heavy-duty components. <a href="/industrial/industrial-distribution-supply">Industrial distribution and supply</a> is the business of stocking and reselling products made by others. A manufacturer and a distributor should not use the same sentence.',
  productsAndApplications:
    'Equipment and parts are chosen for a duty: crop, ore, abrasion, or a maintenance task. Keep farm equipment on the agriculture page, mining and quarry equipment on the mining page, and stocked multi-brand supply on the distribution page.',
  searchBehavior:
    'Users search a machine, a wear part, or a supplier type. Those three queries need three destinations. Farm equipment manufacturing, mining equipment manufacturing, and industrial distribution are not one page.',
  seoStrategy:
    'Publish family pages for equipment or parts you supply, and a separate explanation when a dealer network is the route to buy. Manufacturing intent belongs on <a href="/industrial/agriculture-agricultural-equipment">agriculture and agricultural equipment</a> or <a href="/industrial/mining-heavy-industry">mining and heavy industry</a>. Catalog and channel intent belongs on <a href="/industrial/industrial-distribution-supply">industrial distribution and supply</a>.',
  websiteAndCatalogStrategy:
    'Separate manufactured lines from distributed lines. Farm machines, mining equipment, and stocked parts should not share one grid. Parts pages should say how to confirm fitment.',
  productAndApplicationContent:
    'Agriculture, mining, and general supply should not share one product grid if the duties differ. Send each intent to its own specialization page.',
}

export const SUPPLY_SPECIALIZATIONS: SupplySpecializationCopy[] = [
  {
    slug: 'agriculture-agricultural-equipment',
    title: 'Agriculture & Agricultural Equipment',
    h1: 'How Agricultural Equipment Plants Separate Machines, Implements, and Parts',
    preview:
      'Family and enquiry pages for manufacturers of farm machines, implements, and parts, kept apart from dealers, farms, and rental yards.',
    metaTitle: 'How Farm Equipment Manufacturers Explain Their Scope',
    metaDescription:
      'How agricultural equipment plants explain machines, implements, and parts for OEM and dealer buyers without posing as a farm, a rental yard, or a distributor.',
    image: 'ind-agriculture-agricultural-equipment.jpg',
    alt: 'A green tractor chassis and a steel cultivator frame on an agricultural equipment assembly line',
    displayOrder: 1,
    services: ['product-capability-pages', 'industrial-seo', 'distributor-channel-enablement'],
    posts: [
      'technical-content-marketing-manufacturers',
      'manufacturing-seo-strategy-complex-industrial-products',
    ],
    cases: [],
    fields: {
      industryOverview:
        'Agricultural equipment manufacturing on this page means companies that build farm machines, implements, attachments, or the components and wear parts that go on them. The buyer is an OEM, a dealer, or a technical purchaser. Farms, equipment rental yards, and repair shops are customers or a different business. They are not the manufacturer.\n\nThis page sits under <a href="/industrial/agriculture-mining-industrial-supply">agriculture, mining, and industrial supply</a>. Mining and quarry equipment belongs on <a href="/industrial/mining-heavy-industry">mining and heavy industry</a>. Stocking and reselling other brands belongs on <a href="/industrial/industrial-distribution-supply">industrial distribution and supply</a>.',
      manufacturingProcesses:
        'Typical routes include steel fabrication, cutting and forming, welding, machining, coating, mechanical assembly, and hydraulic or electrical integration. Name the steps the plant runs. A finished cultivator and a machined wear part are not the same route.\n\nCutting and forming detail belongs with <a href="/industrial/sheet-metal-metal-forming">sheet metal and metal forming</a> and, when the process is laser cutting, with <a href="/industrial/laser-manufacturing">laser manufacturing</a>. Heavy joining belongs with <a href="/industrial/welding-heavy-fabrication">welding and heavy fabrication</a>. Machined details belong with <a href="/industrial/cnc-precision-machining">CNC and precision machining</a>.',
      productsAndApplications:
        'Treat tractors and attachments, tillage tools, planting equipment, sprayers, irrigation components, harvesting equipment, grain handling, trailers, and spare or wear parts as separate families. One plant does not make all of them. Say which families you will quote.\n\nAn implement must name the machine class it fits. A wear part must name the duty, such as soil contact or crop flow. Do not publish a yield, an acre figure, or a brand of tractor you do not build.',
      materialsAndTechnologies:
        'Structural steel, higher-strength grades, and wear-resistant plate are common discussions. Aluminum, engineering plastics, bearings, and hydraulic parts appear when they are real content of the machine. Coatings matter because equipment sits outside.\n\nState the material families you will confirm. Do not publish a hardness number, a load rating, or a service life you cannot source. Fitment and service access are part of the engineering story.',
      targetMarkets:
        'Crop production, soil preparation, planting, crop protection, irrigation, harvesting, grain handling, livestock equipment, and farm transport are different applications. A page should name the applications the plant actually builds for.\n\nA dealer network is a route to market, not proof that the company is a dealer. If you only distribute, use the distribution page.',
      buyerTypes:
        'OEM engineers ask whether the plant can build the assembly. Production and procurement ask about process and quantity. Dealers and importers ask about a family they can represent. Maintenance managers ask about a wear part and the machine it fits.\n\nEnd-user farmers and OEM sourcing teams should not share one vague equipment page.',
      decisionMakers:
        'Design acceptance, a dealer program, and a parts order are three decisions. The site can support the first review of scope. It cannot replace a field trial or a dealer agreement.\n\nSeasonal buying changes timing. An enquiry in one month is not a stocking commitment.',
      buyerRequirements:
        'A useful enquiry names the equipment family, the application, machine compatibility if the product attaches to something else, the component or assembly, quantity if known, and whether the need is OEM, aftermarket, or a dealer program. Drawings belong in the existing enquiry path.\n\nA message that says send a catalog, with no machine and no duty, is not ready to quote.',
      purchasingFactors:
        'Buyers compare family fit, materials, compatibility, documentation, and whether they are talking to the maker or a reseller. Original equipment and replacement parts should be labeled.\n\nInternational buyers also ask which market the documentation is written for. Do not invent a dealer count.',
      marketingChallenges:
        'Catalogs sprawl across machines, attachments, and model-specific parts. Compatibility is the question buyers cannot answer from a lifestyle photo of a field.\n\nThe other failure is sounding like a dealer while the factory builds the product, or sounding like a factory while the company only stocks it.',
      digitalMarketSpecifics:
        'Search splits among agricultural equipment manufacturing, a machine family, a wear part, and a dealer. Those are different intents. Crop prices, farm jobs, and agronomy advice are not this page.\n\nModel-specific parts need a family explanation plus a way to confirm fitment. They do not need a thin page for every number you cannot supply.',
      competitiveFactors:
        'The differences a buyer can check are the families you build, the processes in house, the compatibility rule, and the sales path: direct, OEM, or dealer. An unsupported claim about uptime or fuel use is not a difference.\n\n<a href="/industrial/oem-component-manufacturing">OEM component manufacturing</a> is the page for building to a customer design. This page is the equipment and implement program.',
      leadGenerationChallenges:
        'Seasonal demand and incomplete part requests waste quoting time. The form should ask for family, duty, and machine compatibility.\n\nA download is not a dealer appointment and not a shipped implement.',
      searchBehavior:
        'Engineers and dealers search agricultural machinery manufacturers, farm equipment, implements, harvesting equipment, irrigation equipment, and wear parts. Some add OEM or custom machinery.\n\nThey are not searching for crop advice. Keep that language off the manufacturing page.',
      seoStrategy:
        'Build pages around the equipment families you manufacture and say whether each one is a complete machine, an implement, or a part. Link shop processes to fabrication, welding, and machining pages instead of repeating those subjects.\n\nDo not compete with the mining page or the distributor page. The parent stays the map of all three.',
      aiSearchStrategy:
        'Define agricultural equipment manufacturing as production of farm machines, implements, or their components. State that dealers, farms, and rental companies are different roles. Name the families you will discuss.\n\nAssistants invent capacities when a page says complete agricultural solutions. Specific families reduce that risk. They do not guarantee a citation.',
      keywordAndTopicStructure:
        'Primary topics are agricultural equipment manufacturing, farm equipment manufacturers, and agricultural implements. Secondary topics are attachments, harvesting equipment, irrigation components, wear parts, and OEM supply.\n\nLong-tail pages follow a real family and a real application. Do not target crop prices, jobs, or brands you do not build.',
      authorityAndVisibility:
        'The public record is the family list, the compatibility rule, and the maker role. Do not invent yield figures, dealer maps, or test results.\n\nConsistent names for the same implement help buyers and retrieval systems.',
      contentStrategy:
        'Explain the family, the field duty, the processes in house, and how a buyer confirms fitment. That is the content an OEM or dealer needs.\n\nDo not write farming advice. Marketing copy does not replace a drawing or a parts book.',
      technicalContent:
        'Technical pages can cover structure, wear surfaces, hydraulic interfaces, and public fitment rules. Where a load or a life figure is controlled, say how a qualified buyer requests it.\n\nFinal assembly and test, when you run them, can point to <a href="/industrial/assembly-integration">assembly and integration</a>. Do not claim a test result that is not published.',
      productAndApplicationContent:
        'Give tillage, planting, crop protection, harvest, irrigation, and parts their own explanations only when you sell them. A sprayer is not a plow.\n\nMachine controls, when you build them as a product, can sit with <a href="/industrial/industrial-automation-robotics">industrial automation and robotics</a> rather than inside a tillage story.',
      expertiseContent:
        'Show how an enquiry is checked against family and fitment. That screening is the expertise. A field photograph is not.\n\nNo published case on this site is a farm-equipment factory. Do not borrow a metalworking project and call it one.',
      contentFormats:
        'Family pages, a fitment note, and a dealer-versus-factory explanation fit. Capability pages help when they name the fabrication and assembly scope.\n\nA catalog of every fastener on a machine does not, unless you supply that fastener and can identify it.',
      buyerJourney:
        'An engineer or dealer checks the family, confirms compatibility, and asks for a document or a quote. The site is for that sequence.\n\nA form submission is not a seasonal stocking order.',
      salesCycleCharacteristics:
        'OEM programs and dealer appointments take longer than a wear-part request. The page should make the path obvious so those enquiries are not mixed.\n\nInternational evaluation adds language and documentation. It does not add a certificate you have not published.',
      buyerQuestionsByStage:
        'Early questions are family and application. Middle questions are materials, interfaces, and fitment. Later questions are quantity, season, and whether the buyer is an OEM, a dealer, or an end user.\n\nKeep those stages apart.',
      trustAndConversionFactors:
        'Trust comes from a named family and a clear maker role. Implying you build every machine in a green catalog removes trust.\n\nThe enquiry is a manufacturer asking how to present that scope, or a buyer sending a real equipment question through the existing form.',
      leadNurturingApproach:
        'Follow-up asks for the family, the machine it must fit, and the commercial role. If the visitor wanted a dealer for a brand you do not represent, say so.\n\nDo not send agronomy content.',
      websiteAndCatalogStrategy:
        'Organize by equipment family and by role: complete machine, implement, or part. Parts say how fitment is confirmed.\n\nLink the shop processes out. Do not turn this URL into a second CNC page.',
      paidAdvertisingStrategy:
        'Buy family terms you manufacture, such as an implement class or wear parts for a duty you supply. Send dealer-only brands to a page that says you distribute them, if that is true.\n\nDo not buy crop-price or farm-job queries.',
      conversionOptimization:
        'Ask for equipment family, application, compatibility, OEM or aftermarket, quantity, and whether a drawing exists. Say the message starts a marketing or sourcing conversation about that scope.\n\nDo not add a field for acreage or yield.',
      analyticsAndMeasurement:
        'Count enquiries that name a family and a role. Separate dealer traffic from OEM traffic.\n\nDo not convert those counts into harvested acres or revenue.',
      industryExpertise:
        'The useful distinction is manufacturer versus dealer versus farm, and machine versus implement versus part.\n\nThis page does not offer farming advice or equipment rental.',
      relevantExperience:
        'No published case documents an agricultural equipment factory. Other industrial projects on this site are not relabeled as farm machinery.\n\nIf a future case is a real equipment plant, it can be linked then.',
      industryProofPoints:
        'No tractor brand, yield, dealer count, or field trial is invented here. The public proof is the family split and the enquiry.\n\nMining duty and multi-brand distribution stay on their own pages.',
    },
    faq: [
      {
        question: 'What is agricultural equipment manufacturing?',
        answer:
          'It is the production of farm machines, implements, attachments, or the components and wear parts used on them. The page is for factories and B2B buyers. It is not a guide to crops, and it is not a dealer showroom unless the company also states that it distributes.',
      },
      {
        question: 'Which machines do agricultural equipment manufacturers build?',
        answer:
          'Families can include tillage tools, planting equipment, sprayers, irrigation components, harvesting equipment, grain handling, trailers, and spare parts. A plant should name the families it actually builds. A list of every machine on a farm is not a capability statement.',
      },
      {
        question: 'Which processes are used to make agricultural machinery?',
        answer:
          'Fabrication, cutting, welding, machining, coating, assembly, and hydraulic or electrical integration are common, but only the routes the plant runs. Send cutting, welding, and machining questions to those Industrial pages instead of repeating them as a second thin article.',
      },
      {
        question: 'What should an OEM buyer review before selecting a manufacturer?',
        answer:
          'Review the equipment family, the processes in house, the materials the plant will discuss, and how fitment to a machine is confirmed. Also confirm whether the offer is a complete machine, an implement, a component, or a contract build. A field photo does not answer that.',
      },
      {
        question: 'Why do materials and wear matter on farm equipment?',
        answer:
          'Soil, crop flow, weather, and repeated loading change which steel, coating, or wear part is appropriate. The page can name the material families and the duty. It should not invent a hardness value or a season of life.',
      },
      {
        question: 'How should spare parts and fitment be organized?',
        answer:
          'Group parts by the machine family they fit and by the wear duty, and say how a buyer confirms the model. Do not publish a part number you cannot identify. Original parts and aftermarket parts should be labeled as such.',
      },
      {
        question: 'How is a manufacturer different from an equipment dealer?',
        answer:
          'A manufacturer builds the machine, implement, or part. A dealer represents and sells equipment, often from one or more factories. Farms and rental companies use or hire machines. The website should say which role the company performs.',
      },
      {
        question: 'How can a site show machine compatibility?',
        answer:
          'State the machine class, the interface, and the document a buyer must send to confirm fit. Do not imply that one implement fits every tractor. If the rule is model-specific, say that the model has to be checked.',
      },
      {
        question: 'Which search topics fit this page?',
        answer:
          'Agricultural equipment manufacturing, farm machinery, implements, harvesting or irrigation equipment you build, and wear parts you make. Crop prices, jobs, and dealer searches for brands you do not represent do not fit. Mining equipment has its own page.',
      },
      {
        question: 'Can clearer pages guarantee international enquiries or an AI citation?',
        answer:
          'No. A clear family, role, and fitment rule helps a buyer and reduces invented claims. It does not guarantee a ranking, a dealer appointment, or a citation in Google, ChatGPT, Gemini, or Perplexity.',
      },
    ],
    ctaTitle: 'Discuss farm equipment pages and fitment enquiries',
    ctaDescription: cta('agricultural equipment manufacturing'),
  },
  {
    slug: 'mining-heavy-industry',
    title: 'Mining & Heavy Industry',
    h1: 'How Heavy Equipment Plants Explain Mining and Quarry Duty',
    preview:
      'Equipment and component pages for manufacturers serving mines, quarries, and heavy plant duty, separate from mine operators and dealers.',
    metaTitle: 'How Mining Equipment Manufacturers Explain Plant Duty',
    metaDescription:
      'How mining and quarry equipment plants explain crushers, conveyors, and wear parts for OEM buyers without posing as a mine operator or a dealer.',
    image: 'ind-mining-heavy-industry.jpg',
    alt: 'A heavy steel crusher housing and a fabricated conveyor frame in a bright fabrication bay',
    displayOrder: 2,
    services: ['technical-white-papers', 'engineering-articles-guides', 'industrial-seo'],
    posts: [
      'manufacturing-seo-strategy-complex-industrial-products',
      'ai-search-optimization-for-manufacturers',
    ],
    cases: [],
    fields: {
      industryOverview:
        'Mining and heavy industry manufacturing on this page means companies that build equipment, structures, or components for mines, quarries, mineral processing, and other heavy plant duty. The company is a manufacturer or an OEM supplier. A mine operator, a mining contractor, and an equipment rental firm are different businesses.\n\nThis specialization sits under <a href="/industrial/agriculture-mining-industrial-supply">agriculture, mining, and industrial supply</a>. Farm machines belong on <a href="/industrial/agriculture-agricultural-equipment">agriculture and agricultural equipment</a>. Reselling other brands belongs on <a href="/industrial/industrial-distribution-supply">industrial distribution and supply</a>.',
      manufacturingProcesses:
        'Heavy fabrication, structural welding, large-part machining, wear-part production, coating, and mechanical assembly are the routes to name if you run them. A crusher housing and a wear liner are not built the same way.\n\nJoining and plate work belong with <a href="/industrial/welding-heavy-fabrication">welding and heavy fabrication</a> and <a href="/industrial/metal-fabrication">metal fabrication</a>. Machined fits belong with <a href="/industrial/cnc-precision-machining">CNC and precision machining</a>. Do not claim a bay, a crane, or a machine the plant has not described.',
      productsAndApplications:
        'Keep mining machines, quarry equipment, crushing and screening equipment, mineral processing equipment, conveyors, wear parts, and heavy fabrications as separate families. State the families you build. Do not present a full mine as your catalog.\n\nConveyors you manufacture can point to <a href="/industrial/conveyor-material-handling-systems">conveyor and material handling systems</a>. Pumps you manufacture can point to <a href="/industrial/pumps-valves-fluid-handling">pumps, valves, and fluid handling</a>. Those links name the product class. They are not a mine reference.',
      materialsAndTechnologies:
        'Structural steel, abrasion-resistant plate, and wear alloys are the usual material conversation, plus coatings where impact, dust, and moisture are part of the duty. Castings appear only if you produce or machine them.\n\nDo not publish a hardness, a tonnage, a liner life, or a throughput figure you cannot source. Fitment to an existing machine is a drawing question, not a slogan.',
      targetMarkets:
        'Surface mining, underground mining, quarrying, crushing and screening, mineral processing, and bulk transfer are different duties. Name the duties you will quote. A generic heavy industry label is not a duty.\n\nPlant maintenance and a new equipment program are also different. Say which one the page is for.',
      buyerTypes:
        'OEM engineers and sourcing managers ask whether the plant can build the equipment or the component. Maintenance and reliability teams ask about a wear part and the machine it fits. Operations managers ask about duty. Distributors ask whether they can represent the line.\n\nAn EPC team may ask for a fabricated package. That is still a manufacturing enquiry, not a contract to operate a mine.',
      decisionMakers:
        'Engineering, maintenance, and procurement often all have to agree, especially when a shutdown window is involved. The site should show family, duty, and how a drawing is exchanged.\n\nA high price does not replace that information. Neither does a photograph of an open pit.',
      buyerRequirements:
        'A useful enquiry names the equipment family, the duty, the component if it is a part, machine compatibility if it is a replacement, material expectations if known, quantity, and whether the need is new equipment, a spare, or an OEM build. Drawings use the existing enquiry path.\n\nDo not promise a shutdown delivery or emergency stock unless that offer is real and stated by the business. This page does not state one.',
      purchasingFactors:
        'Buyers compare duty match, materials, fabrication scope, inspection, and compatibility with equipment already in the plant. Original equipment and a pattern part should be distinguished.\n\nInternational buyers ask which documents travel with the part. List the question. Do not invent a certificate.',
      marketingChallenges:
        'Heavy equipment is hard to explain because size, wear, and fitment do not fit in a slogan. Generic heavy industry pages attract mine operators and investors as well as equipment buyers.\n\nThe manufacturer has to say it builds equipment or components, and name the family. A distributor has to say it supplies someone else’s equipment. Those sentences should not be merged.',
      digitalMarketSpecifics:
        'Search uses crusher, screen, conveyor, wear part, and mining equipment manufacturer. It also uses mine jobs, mine investment, and mine news. Only the equipment and component queries belong here.\n\nSpare-part queries need a compatibility statement. A gallery of large steel without a family name does not rank as a useful answer.',
      competitiveFactors:
        'Checkable differences are the families, the processes, the wear materials you will discuss, and the role: OEM, component supplier, or fabricator. Unsupported capacity claims are not a difference.\n\nCustom packages that are not a standard mining family can sit with <a href="/industrial/custom-industrial-manufacturing">custom industrial manufacturing</a>.',
      leadGenerationChallenges:
        'Quotes fail when the duty, the machine, and the part are all missing. Several stakeholders then ask the same question again.\n\nA white paper can explain how to describe duty. It cannot invent a liner life.',
      searchBehavior:
        'Buyers search mining equipment manufacturing, quarry equipment, crushing and screening, mineral processing equipment, conveyors, and wear parts. Maintenance searches a component and a machine model.\n\nInvestment and employment searches should not land on a fabrication page.',
      seoStrategy:
        'One strong page for the manufacturing role, then family pages only for equipment you build. Link material handling to <a href="/industrial/material-handling">material handling</a> when the product is the handling system rather than the mine.\n\nDo not target the same farm-equipment terms as the agriculture page, or the same catalog terms as the distributor page.',
      aiSearchStrategy:
        'State what a mining equipment manufacturer produces, and that operating a mine is a different business. Answer which processes and wear conditions the plant will discuss, without a tonnage figure.\n\nDirect definitions help an assistant avoid calling a fabricator a mining company. They do not guarantee a citation.',
      keywordAndTopicStructure:
        'Primary topics are mining equipment manufacturing, quarry equipment, and heavy-duty components. Secondary topics are crushing, screening, conveyors, wear parts, and heavy fabrication for that duty.\n\nProcess terms such as welding stay linked to the fabrication pages. Farm implements stay on the agriculture page.',
      authorityAndVisibility:
        'The record is the equipment family and the duty language you will stand behind. Do not invent a mine name, a tons-per-hour figure, or a shutdown result.\n\nFiltration and process vessels, when you build them, belong with <a href="/industrial/industrial-filtration-separation">industrial filtration and separation</a> or <a href="/industrial/pressure-vessels-process-equipment">pressure vessels and process equipment</a>.',
      contentStrategy:
        'Explain the family, the duty, the materials conversation, and what a buyer must send before a quote. That is the content maintenance and OEM teams need.\n\nDo not write mine-operation advice.',
      technicalContent:
        'Technical notes can cover abrasion, impact, dust, moisture, and why a wear surface is specified, without a hardness number. Large geometry and fitment belong in the drawing, which is requested rather than published.\n\nInspection of a heavy fabrication can be described as a step. Do not claim a code stamp.',
      productAndApplicationContent:
        'Separate crushing, screening, conveying, wear parts, and structural packages. An application note names the duty, such as abrasive rock or a transfer point, and the family that addresses it.\n\n<a href="/industrial/oem-component-manufacturing">OEM component manufacturing</a> covers building a customer-designed part. Use it when that is the commercial offer.',
      expertiseContent:
        'Show how duty is matched to a family and a material conversation. A photograph of a large housing is not that match.\n\nNo published case on this site is a mining-equipment plant or a mine. Do not present a general fabrication project as one.',
      contentFormats:
        'Family pages, a duty note, and a spare-part compatibility explanation fit. Engineering articles help when they explain wear duty in buyer language.\n\nA copied catalog of every liner profile you do not supply does not.',
      buyerJourney:
        'An engineer checks the family and the duty. Maintenance checks compatibility. Procurement asks about documents and quantity. The site supports that order.\n\nApproval to quote a liner is not approval to operate a circuit.',
      salesCycleCharacteristics:
        'New equipment and a shutdown spare follow different clocks. The page should say which enquiry it is so sales does not promise a window the plant has not confirmed.\n\nInternational sourcing adds document and interface questions. It does not add a production capacity.',
      buyerQuestionsByStage:
        'Early questions are family and duty. Middle questions are material, geometry, and the machine the part must fit. Later questions are quantity, documents, and whether the need is OEM, new equipment, or a replacement.\n\nIf the machine model is missing, ask for it.',
      trustAndConversionFactors:
        'Trust comes from a narrow family list and an honest role. Calling a fabricator a mining company, or a dealer a factory, removes it.\n\nThe conversion is a manufacturer asking how to present that duty, or a buyer sending a real equipment question.',
      leadNurturingApproach:
        'Follow-up asks for family, duty, and machine identity. If the visitor wanted mine investment information, the page is the wrong destination.\n\nDo not nurture with an invented availability promise.',
      websiteAndCatalogStrategy:
        'Catalog by equipment family and by new equipment versus wear part. Link conveyors, pumps, and fabrication pages instead of absorbing them.\n\nWear parts say how compatibility is confirmed.',
      paidAdvertisingStrategy:
        'Buy equipment-family and wear-part terms you manufacture. Send mine-operator and job queries away.\n\nDo not buy farm-implement terms from this URL.',
      conversionOptimization:
        'Ask for equipment family, duty, part or machine compatibility, new versus replacement, quantity, and whether a drawing exists.\n\nDo not add a field for tons per hour unless the buyer already has a figure they want reviewed.',
      analyticsAndMeasurement:
        'Count enquiries that name a family and a duty. Track how often visitors leave for the conveyor or fabrication pages.\n\nDo not turn those counts into mine output.',
      industryExpertise:
        'The expertise is separating equipment manufacturing from mine operations, and naming wear duty without inventing a life figure.\n\nDealer coverage belongs on the distribution page.',
      relevantExperience:
        'No published case documents a mining-equipment factory or a quarry plant. Metal fabrication experience elsewhere is not presented as mining equipment work.\n\nA future case would need to be an equipment or component program, not a picture of a mine.',
      industryProofPoints:
        'No tonnage, hardness, mine name, or delivery promise is added. The proof on the page is the duty split and the enquiry.\n\nAgriculture and distribution stay on their own URLs.',
    },
    faq: [
      {
        question: 'What is mining equipment manufacturing?',
        answer:
          'It is the production of machines, structures, or components used in mining, quarrying, mineral processing, or other heavy plant duty. The manufacturer builds the equipment. A mining company operates the site. Those are different businesses and should not share one description.',
      },
      {
        question: 'Which machines are built for mines and quarries?',
        answer:
          'Families can include crushing and screening equipment, conveyors and transfer equipment, wear parts, and heavy fabrications. A plant should list the families it builds. Crushing is not the same product as a conveyor, and neither is a wear liner.',
      },
      {
        question: 'Which processes are used for heavy-duty mining equipment?',
        answer:
          'Heavy plate fabrication, structural welding, large-part machining, wear-part production, coating, and assembly can all apply. Name the routes in house. Welding and machining already have their own Industrial pages for the process detail.',
      },
      {
        question: 'Why do wear materials matter?',
        answer:
          'Abrasive rock, impact, dust, and moisture change which steel or lining is discussed. The public page can name that duty and the material families the plant will review. It should not invent a hardness number or a liner life.',
      },
      {
        question: 'What should a buyer review before selecting a manufacturer?',
        answer:
          'Review the equipment family, the duty, the processes, how a spare fits an existing machine, and which documents a qualified buyer can request. Also confirm whether the company manufactures the item or only distributes it.',
      },
      {
        question: 'How is an equipment manufacturer different from a mining contractor?',
        answer:
          'A manufacturer builds equipment or components. A contractor or operator runs mining or quarrying work. A dealer sells equipment made by someone else. The website should use only the role that is true.',
      },
      {
        question: 'Why do spare parts and compatibility dominate procurement?',
        answer:
          'A wear part has to fit a machine already in the plant. The page should say which machine family the part belongs to and how the model is confirmed. A drawing or a model number is the enquiry, not a public guess.',
      },
      {
        question: 'Which search topics fit a mining equipment manufacturer?',
        answer:
          'Mining and quarry equipment manufacturing, crushing, screening, conveyors you build, and wear parts you make. Mine investment, mine jobs, and mine news do not fit. Farm equipment has its own page.',
      },
      {
        question: 'What technical content helps a heavy-equipment buyer?',
        answer:
          'Family, duty, material conversation, and the list of what must be on the drawing. White papers help when they explain that sequence. They do not help when they add a capacity the plant has not published.',
      },
      {
        question: 'Can AI search guarantee that a mine will find the manufacturer?',
        answer:
          'No. A clear manufacturer role and a named equipment family make the page easier to interpret. They do not guarantee placement in Google or a citation by ChatGPT, Gemini, or Perplexity.',
      },
    ],
    ctaTitle: 'Discuss mining equipment pages and duty-led enquiries',
    ctaDescription: cta('mining and heavy industrial equipment'),
  },
  {
    slug: 'industrial-distribution-supply',
    title: 'Industrial Distribution & Supply',
    h1: 'How Distributors Separate Brands, Stock, and Their Own Products',
    preview:
      'Catalog and channel pages for industrial distributors and suppliers, written so a stocked brand is not described as a factory.',
    metaTitle: 'How Industrial Distributors Explain Supply and Catalogs',
    metaDescription:
      'How industrial distributors explain brands, catalogs, and supply roles without describing a stocked product line as if the company manufactured it.',
    image: 'ind-industrial-distribution-supply.jpg',
    alt: 'Racks of boxed parts and bins of bearings in an industrial distribution warehouse',
    displayOrder: 3,
    services: ['product-catalogs-ecommerce', 'distributor-channel-enablement', 'rfq-forms-conversion-optimization'],
    posts: [
      'manufacturing-website-architecture-large-catalogues',
      'digital-lead-generation-manufacturing',
    ],
    cases: [],
    fields: {
      industryOverview:
        'Industrial distribution and supply is the business of selecting, stocking, and reselling machinery, components, and MRO products made by other companies, or of combining that role with a smaller set of products you actually manufacture. The public page has to say which of those is true for each line.\n\nThis page sits under <a href="/industrial/agriculture-mining-industrial-supply">agriculture, mining, and industrial supply</a>. Building farm equipment belongs on <a href="/industrial/agriculture-agricultural-equipment">agriculture and agricultural equipment</a>. Building mining equipment belongs on <a href="/industrial/mining-heavy-industry">mining and heavy industry</a>.',
      manufacturingProcesses:
        'Distribution is not a fabrication route. Kitting, repacking, and light assembly can be real operations, and they should be named as supply operations. If the company also machines or fabricates, that work needs its own statement and should link to the manufacturing page that matches it.\n\nDo not describe a warehouse as a factory. Do not describe a factory line as inventory you merely stock.',
      productsAndApplications:
        'Catalogs may include machinery, bearings and drives, pumps and valves, pneumatic and hydraulic parts, electrical and automation components, sensors, MRO items, and spare parts for agricultural or mining equipment. List the categories you supply. Do not imply the warehouse holds every industrial part.\n\nPumps and valves you supply, rather than build, can still point readers to <a href="/industrial/pumps-valves-fluid-handling">pumps, valves, and fluid handling</a> for the product class. The sentence must say you distribute them.',
      materialsAndTechnologies:
        'A distributor’s technical story is the specification, the brand, and the fitment, not a mill certificate from a plant it does not run. Publish the attributes you can keep accurate: size, material description from the manufacturer, and the document you are allowed to share.\n\nDo not rewrite a manufacturer’s datasheet into a performance claim of your own. Do not invent a stock quantity.',
      targetMarkets:
        'Buyers include plant maintenance, procurement, OEMs who source a branded component, and resellers. Agricultural and mining parts are markets only when you supply those lines.\n\nA regional dealer, an authorized distributor, and an independent wholesaler are different commercial models. Use the model you can document.',
      buyerTypes:
        'A maintenance technician often arrives with a part number or a failed component. A purchasing manager then chooses the supplier. An engineer may need a datasheet before either of them will proceed.\n\nThose readers need the same product record, but they do not read it in the same order. Identification comes before price.',
      decisionMakers:
        'Technical acceptance and the purchase order can sit in different departments. Dealer owners and OEM channel managers are another audience when you recruit them rather than sell them a part.\n\nSay who should receive a part enquiry and who should receive a channel enquiry. Do not mix them in one unlabeled form.',
      buyerRequirements:
        'A useful part enquiry names the category, the brand or manufacturer if relevant, the part or model number, the quantity, the application, and the delivery region if coverage is limited. A drawing is relevant when the item is made to order by a factory you represent, not when it is a catalog bearing.\n\nDo not ask the buyer to guess availability. If you do not publish stock, say that availability is confirmed on request.',
      purchasingFactors:
        'Buyers compare correct identification, specification, who is allowed to sell the brand, and how the quote returns. Price without a part number is not a comparison.\n\nAn authorization to represent a brand must be a relationship you can support. Do not print an exclusive territory you have not documented.',
      marketingChallenges:
        'Large catalogs create duplicate descriptions, missing attributes, and pages for numbers you no longer supply. Part-number search then lands on a thin page.\n\nDistributors also compete with other companies selling the same brand. The difference has to be identification, coverage, and technical help, not a claim that you manufactured the bearing.',
      digitalMarketSpecifics:
        'Buyers search a part number, a model, a brand plus a product family, or “industrial supplier.” A manufacturer search is a different intent and should not be answered with a distributor homepage that says we produce the equipment.\n\n<a href="/industrial/mro-industrial-services">MRO and industrial services</a> covers maintenance services and MRO work as a service offer. This page covers supply and catalog. Use both only when you do both, and say which is which.',
      competitiveFactors:
        'Checkable differences are the categories, the brands you are entitled to name, the quality of the product record, and the quote path. A longer list of unrelated brands is not a difference.\n\nSensors and automation parts you supply can reference <a href="/industrial/industrial-sensors-instrumentation">industrial sensors and instrumentation</a> and <a href="/industrial/industrial-automation-components">industrial automation components</a> as product classes, with the distributor role stated.',
      leadGenerationChallenges:
        'Enquiries fail when the part number is missing, or when a branch, a dealer, and a direct salesperson all receive the same request. Routing is part of the offer.\n\nA quote request is not a promise of stock or of a delivery date.',
      searchBehavior:
        'Visitors search industrial distributors, parts suppliers, MRO supply, a brand, and a part number. Some search a machine model plus “parts.”\n\nPublish a page for a brand only when you supply it. A part-number page needs a real product record, not a copied sentence.',
      seoStrategy:
        'Structure the site as categories, brand or manufacturer pages you are allowed to publish, and product records with attributes. Application notes support the catalog. They do not replace it.\n\nDo not index thousands of thin duplicates. The parent industry page stays the overview. Manufacturing intent is handed to the agriculture or mining page, or to <a href="/industrial/industrial-equipment-machinery">industrial equipment and machinery</a> when the visitor needs a factory.',
      aiSearchStrategy:
        'State whether the company manufactures, stocks, imports, or distributes each line. Name the categories. Say that specifications come from the product record and that availability is confirmed rather than invented.\n\nAn assistant will call a distributor a manufacturer if the site says “we produce” for a stocked brand. Clear role language reduces that error. It does not guarantee a citation.',
      keywordAndTopicStructure:
        'Primary topics are industrial distribution, industrial supply, and component or MRO distribution. Secondary topics are catalog structure, part numbers, brand pages, and RFQ.\n\nEquipment-manufacturing head terms stay on the agriculture and mining pages. Do not bid against your own factory pages for “manufacturer” if you are the distributor.',
      authorityAndVisibility:
        'Authority is an accurate product record and a visible role. Do not invent a brand authorization, a stock count, a price, or a region you cover.\n\nCross-references and alternates are useful only when you can supply the alternate and say how it differs.',
      contentStrategy:
        'Explain the supply model, the catalog rules, and how a buyer identifies a part. Keep technical education tied to categories you sell.\n\nThe article on large catalogues is the companion for structure. It is not a substitute for your own product data.',
      technicalContent:
        'A product page should carry the attributes a buyer uses to identify the item: category, brand when allowed, key specifications, documents you may share, and compatibility when you can stand behind it.\n\nManuals and drawings are the manufacturer’s documents. Link or request them. Do not rewrite them into a new claim.',
      productAndApplicationContent:
        'Group the catalog by category and by application only where the application is a real filter, such as a pump duty or a conveyor part. <a href="/industrial/material-handling">Material handling</a> and <a href="/industrial/conveyor-material-handling-systems">conveyor systems</a> are the manufacturing pages for companies that build that equipment.\n\nA distributor page for those products must say “supply,” not “we manufacture the conveyor.”',
      expertiseContent:
        'Show how a part number, a model, and an application are checked before a quote. That is the expertise. A photo of a warehouse aisle is not a product database.\n\nNo published case on this site is an agriculture, mining, or industrial-supply distribution program. Do not attach an unrelated factory case.',
      contentFormats:
        'Category pages, brand pages you can justify, product records, and an RFQ path fit. A fully transactional store is a choice, not a requirement. Some catalogs should quote instead of taking a card payment.\n\nA gallery of boxes without attributes does not fit.',
      buyerJourney:
        'A buyer identifies the part, checks the specification, and requests a quote or an account price. Repeat orders need the same record to stay accurate.\n\nAccount-specific prices, if they exist, belong behind the account. They do not belong on the public page.',
      salesCycleCharacteristics:
        'A known part number can be fast. An unidentified component or a channel appointment is not. The site should separate those paths.\n\nExport and regional coverage are stated only for regions you actually serve. This page does not name one.',
      buyerQuestionsByStage:
        'Early questions identify the category and the number. Middle questions are specification, compatibility, and documents. Later questions are quantity, region, and whether the buyer wants a quote, an account, or a dealer.\n\nIf the number is wrong, stop and correct the identity before talking about delivery.',
      trustAndConversionFactors:
        'Trust comes from role clarity and product records that match what you can supply. A factory photograph on a distribution homepage removes trust when you do not build the goods.\n\nThe conversion is a supplier asking how to structure the catalog, or a buyer sending a real part enquiry.',
      leadNurturingApproach:
        'Follow-up asks for the missing number, brand, or region. Route dealer enquiries away from one-off part enquiries.\n\nDo not nurture with a promise of same-day stock.',
      websiteAndCatalogStrategy:
        'Build categories, then products with attributes and search. Brand pages exist only for brands you supply. Manufacturer-direct lines, if you also build something, are labeled as manufactured.\n\n<a href="/industrial/oem-component-manufacturing">OEM component manufacturing</a> remains the page for a factory building a customer part. Do not use it as a label for a wholesaler.',
      paidAdvertisingStrategy:
        'Buy category and supplier terms you fulfill, and brand terms only for brands you represent. Send manufacturing-intent queries to a factory page if you are not the factory.\n\nDo not buy part numbers you cannot identify.',
      conversionOptimization:
        'Ask for category, brand or manufacturer, part or model, quantity, application, and region. Offer a quote path. Say that stock and date are confirmed rather than displayed, unless a live inventory connection exists. This page does not assume one.\n\nCRM and branch routing can use the existing enquiry. Do not add a second form.',
      analyticsAndMeasurement:
        'Count enquiries with a part identity, and count catalog pages that receive search visits but no identity. That split shows thin records.\n\nDo not report those visits as revenue or as items in stock.',
      industryExpertise:
        'The expertise is keeping manufacturer, distributor, dealer, and hybrid roles apart, and refusing thin part pages.\n\nE-commerce is optional. An RFQ catalog is a valid industrial model.',
      relevantExperience:
        'No published case is an agriculture dealer, a mining distributor, or a general industrial supply catalog. Other equipment websites are not reclassified as this model.\n\nA future distribution case would need to show catalog and channel work, not a factory presented as a warehouse.',
      industryProofPoints:
        'No brand authorization, stock figure, price, or territory is invented. The proof offered here is the role split and the catalog rules.\n\nFarm and mining manufacturing stay on their own pages so this URL does not compete with them.',
    },
    faq: [
      {
        question: 'What is industrial distribution and supply?',
        answer:
          'It is the business of sourcing, stocking, and reselling industrial equipment, components, or MRO products, often from several manufacturers. It can sit beside a factory, but the catalog has to say which lines are manufactured and which lines are distributed.',
      },
      {
        question: 'How is a distributor different from a manufacturer?',
        answer:
          'A manufacturer makes the product. A distributor supplies a product made by someone else. An authorized dealer does that under a documented brand relationship. A hybrid company must label each line. Calling a stocked brand “our equipment” is the mistake this page is meant to prevent.',
      },
      {
        question: 'What belongs in an industrial catalog?',
        answer:
          'Category, product family, brand when you are allowed to name it, the attributes needed to identify the item, documents you may share, and a quote path. Compatibility belongs on the record only when you can stand behind it. A photo gallery without those fields is not a catalog.',
      },
      {
        question: 'How should a large catalog be organized?',
        answer:
          'Start with categories and families, then brand pages you can justify, then product records. Application pages support search. They should not duplicate every part number with the same sentence. Unsupplied numbers should not be published.',
      },
      {
        question: 'Why do part numbers matter for search?',
        answer:
          'Buyers often arrive with a number or a model, not with a slogan. A page can rank for that number only when the record is real and the description is specific. A copied paragraph on thousands of URLs does not identify the part.',
      },
      {
        question: 'What is the difference between a catalog and industrial e-commerce?',
        answer:
          'A catalog helps a buyer find and specify a product, then request a quote. E-commerce adds a transaction, and sometimes an account price or a stock figure from a system you actually run. Many industrial suppliers should keep the quote. A store is not mandatory.',
      },
      {
        question: 'How does a distributor get a useful RFQ?',
        answer:
          'Ask for category, brand, part or model number, quantity, application, and region. Route dealer enquiries separately from one-off part enquiries. Do not promise a ship date on the public page.',
      },
      {
        question: 'How should manufacturers and distributors divide the website?',
        answer:
          'Manufactured lines link to the factory pages, including agriculture or mining when that is the product. Distributed lines stay on catalog pages that name the brand owner. Channel partners need their own explanation so a direct enquiry is not sent to the wrong company.',
      },
      {
        question: 'What should an industrial product page contain?',
        answer:
          'The category, the identifying specifications, the brand when allowed, the documents a buyer may download or request, and a way to ask for a quote. Stock, price, and a substitute belong there only when they are maintained. An empty specification table should not be published.',
      },
      {
        question: 'Can AI search guarantee that buyers will find a distributor?',
        answer:
          'No. Clear role language, real product attributes, and a quote path make the company easier to interpret. They do not guarantee a Google position or a citation in ChatGPT, Gemini, or Perplexity.',
      },
    ],
    ctaTitle: 'Discuss catalog structure and supply-role enquiries',
    ctaDescription: cta('industrial distribution and supply'),
  },
]
