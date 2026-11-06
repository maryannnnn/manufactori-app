import { type TransportSpecializationCopy, transportCta } from './transportSpecializationTypes'

export const TRANSPORT_SPECIALIZATIONS_DATA: TransportSpecializationCopy[] = [
  {
    slug: 'automotive-manufacturing',
    title: 'Automotive Manufacturing',
    h1: 'How Automotive Component Suppliers Explain Production Capability',
    preview:
      'Part-family and enquiry pages for plants that machine, stamp, or assemble production components for vehicle makers and Tier suppliers.',
    metaTitle: 'Marketing for Automotive Component and Tier Suppliers',
    metaDescription:
      'How automotive component and Tier suppliers explain processes, APQP, PPAP, and FMEA questions, and structured RFQs, without claiming IATF 16949 or OEM approval.',
    image: 'ind-automotive-manufacturing.jpg',
    alt: 'Machined and stamped automotive components moving along a production line in a component plant',
    displayOrder: 1,
    services: ['industrial-seo', 'product-capability-pages', 'google-ads-manufacturers'],
    posts: [
      'manufacturing-seo-strategy-complex-industrial-products',
      'technical-content-marketing-manufacturers',
    ],
    cases: [],
    fields: {
      industryOverview:
        'Automotive manufacturing on this page means B2B production of components and assemblies for vehicle makers and the Tier suppliers that feed them. The public offer is a set of part families a plant can machine, stamp, form, or assemble for a production conversation. It is not a dealership, a repair bay, or an aftermarket retail catalog.\n\nBuyers arrive with a print, a material callout, and a question about whether the plant can support a production release. A useful page names those part families and states that consumer parts counters, collision repair, and service appointments sit outside the offer.',
      manufacturingProcesses:
        'Typical routes include CNC machining, stamping, forming, joining of subassemblies, and the in-process checks the plant actually runs. Name the steps performed in house and the steps that stay with partners. Where a cell is tended by robots, describe that only as <a href="/industrial/industrial-automation-robotics">industrial automation and robotics</a> used in your own production, not as an integrator brochure.\n\nBuyers often ask how a process would be discussed under APQP, how a PFMEA and a control plan relate to the quote, and which PPAP elements a later package might include. Collect those questions on the enquiry. Do not claim an IATF 16949 certificate, a PPAP level, or an OEM approval.',
      productsAndApplications:
        'Outputs include machined housings, brackets, shafts, stamped details, and smaller welded assemblies used in vehicle production and in Tier supply. Group pages by part family and by the production use you want to quote. Stamped and formed work can sit next to <a href="/industrial/sheet-metal-metal-forming">sheet metal and metal forming</a> when that route is real. Electrical subsystems, when you build them, belong with <a href="/industrial/electrical-electronics-manufacturing">electrical and electronics manufacturing</a> instead of a generic parts dump.\n\nDealers, garages, and aftermarket retailers are a different market. A production-component page should not invite a shopper looking for a replacement lamp or a brake job.',
      materialsAndTechnologies:
        'Buyers ask which metals, coatings, and joining methods the plant will quote, and which documents travel with a production part. Publish the combinations sales will confirm. Do not invent a tolerance, a press size, or a coating callout the quality team has not agreed to state in public.\n\nAPQP, FMEA, control plans, and PPAP are documentation languages many automotive buyers use. A page can say which of those conversations the team is prepared to have. It should not present a certificate, a submission level, or a customer sign-off that has not been issued.',
      targetMarkets:
        'Customers are purchasing teams at vehicle manufacturers, Tier companies that buy machined or stamped parts, and industrial groups that source production hardware for vehicle programs. Geography matters when freight, tooling location, and launch timing change the quote.\n\nIndependent garages, oil-change chains, and parts-store shoppers use the same word automotive and should be filtered in copy and in paid search. The plant is selling manufacturing capacity, not a service bay.',
      buyerTypes:
        'Manufacturing engineers check process fit and whether a print can be discussed with the routes you publish. Supplier quality engineers ask about APQP, PPAP, and FMEA because those frameworks structure many production buys. Purchasing checks documents, capacity honesty, and commercial terms.\n\nA site that only says automotive excellence loses the engineer who needs to know whether you stamp, machine, or both.',
      decisionMakers:
        'Engineering and supplier quality decide whether a process conversation is worth opening. Procurement decides whether the commercial path is credible. Both need a form that accepts a print and a volume band the plant is willing to discuss, without publishing a made-up annual figure.\n\nWhen machining, stamping, and assembly are different plants or different partners, say so. Do not invent an OEM name or a platform name to make the chain sound larger.',
      buyerRequirements:
        'A serious production enquiry names the part family, the process the buyer expects, the material, the print revision, the timing, and a volume band. Optional notes can cover whether the buyer expects an APQP discussion, which PPAP elements they typically request, and whether a PFMEA conversation is in scope.\n\nThe form should ask for those items. Estimating time is wasted when the message is a request for auto parts with no print and no buyer role.',
      purchasingFactors:
        'Selection turns on process fit, documentation discipline, capacity honesty, and whether the company manufactures the part or only resells it. Buyers may ask if a quality system discussed in relation to IATF 16949 is in place. Answer only with what the company can show. Do not imply a certificate, an OEM approval, or a PPAP level.\n\nRevision handling when a print changes matters as much as the first piece price. Say how revisions are received. Do not promise a launch date.',
      marketingChallenges:
        'Search mixes production suppliers with dealers, quick-service chains, and aftermarket shops. A homepage that says automotive solutions attracts all of them. Unsupported claims of IATF 16949, a PPAP level, or a nomination from a vehicle maker damage trust faster than a shorter page that lists real part families.\n\nMetalworking examples elsewhere on a site are easy to misuse. They do not document an automotive manufacturing program.',
      digitalMarketSpecifics:
        'Engineers search by part family and process, such as a machined housing or a stamped bracket for production. Quality staff search for suppliers who can discuss APQP or PPAP. Those intents need different sections, and none of them should land on a dealer-style location page.\n\nAftermarket part numbers and repair symptoms are a separate market. Keep them off the manufacturing URLs.',
      competitiveFactors:
        'Plants differ by the processes they run, the documentation they will discuss, and the production habits they will describe. A machining shop and a stamping house should not share one vague auto-parts paragraph.\n\nPartners for coating, heat treatment, or subassembly should be labeled when they are not in house. Do not name a vehicle maker as a customer unless that relationship is already public and approved for the page, and do not invent one.',
      leadGenerationChallenges:
        'Repair appointments, retail part requests, and briefs with no print consume sales time. The page has to say which part families are in scope and which buyer roles are not.\n\nA single contact button with no file upload invites the wrong traffic and hides a production enquiry that needed a revision level and a volume band.',
      searchBehavior:
        'Supplier quality staff search for how a plant discusses APQP, FMEA, and PPAP. Process engineers search by machining or stamping. Buyers search for a component manufacturer, not a dealer.\n\nBrand searches can introduce the company. Family pages have to carry the process and the enquiry fields. Do not build a URL for every vehicle name.',
      seoStrategy:
        'Give each real part family a page that states the process and the enquiry it can accept. Where machining is the route, link readers to <a href="/industrial/cnc-precision-machining">CNC and precision machining</a> as process context, not as proof of a vehicle program. Use the <a href="/industrial/automotive-aerospace-transportation">automotive, aerospace, and transportation</a> hub as a sector map, and keep this page specific to production components.\n\nDo not target dealer, repair, or aftermarket retail queries. Depth on the families you manufacture is more useful than a list of vehicle models you have never quoted.',
      aiSearchStrategy:
        'An assistant can only repeat what the site states: part families, processes, and the fact that IATF 16949, APQP, PPAP, and FMEA are buyer topics rather than claimed certificates. That is a clarity task. It is not a promise of citation in any assistant.\n\nIf the page claims an OEM approval or a PPAP level the company does not hold, an assistant may repeat the error. Specific, limited statements are safer.',
      keywordAndTopicStructure:
        'Useful groups are the part family, the process, the production buyer role, and the documentation questions you will actually discuss. Treat dealer names, repair symptoms, and unsupported certificate phrases as topics to leave off the manufacturing site.\n\nDo not publish a keyword page for a vehicle platform, and do not compare the company with a named OEM.',
      authorityAndVisibility:
        'Named part-family pages, clear enquiry fields, and an honest statement about quality-system questions are the public evidence. Do not invent certificates, press mentions, or customer lists.\n\nThere is no published Manufactori case that documents a direct automotive, aerospace, marine, or defense manufacturing program. Do not borrow a metalworking story to fill that gap.',
      contentStrategy:
        'Publish what a program manager already asks on a first call: part family, process, print status, and which APQP or PPAP questions are open for discussion. When you quote fabricated assemblies, point them to <a href="/industrial/metal-fabrication">metal fabrication</a> so the process is named instead of implied.\n\nKeep sales adjectives out of that explanation. A short note that retail and repair are out of scope saves more time than a slogan about mobility.',
      technicalContent:
        'Technical pages can explain how you read a print, which materials you quote, and which files a buyer should attach. They can define APQP, FMEA, and PPAP in plain language as buyer frameworks. They should not publish a control plan as if it were a customer-approved submission, and they should not state a tolerance you will not stand behind.\n\nWhen a special process is done by a partner, say so on the same page as the part family.',
      productAndApplicationContent:
        'Repeat part families deserve their own pages when they drive regular RFQs. A one-off sample can stay on the family page with a note that a production release is a different conversation from a single piece.\n\nApplication notes should describe production uses you want, such as chassis hardware or powertrain-adjacent machined parts, without naming a platform or a volume. Link each note back to the process page.',
      expertiseContent:
        'Show how the team separates a production enquiry from a repair or retail request, and how it decides whether an APQP discussion belongs in the first reply. That is more useful than a timeline of slogans.\n\nExplain what makes a package complete enough to estimate: print revision, material, process expectation, and timing. Do not invent a launch score or a quality statistic.',
      contentFormats:
        'Part-family pages, a plain-language note on APQP, PPAP, and FMEA as buyer topics, and a short FAQ about who should not enquire fit this sector. A line photo should show machined or stamped components, and the caption should name the family.\n\nSales PDFs should match the live site. A brochure that claims an OEM approval the site does not claim creates a trust problem on the next call.',
      buyerJourney:
        'A buyer finds a part family, checks process fit, and sends a print with a volume band and a note on documentation expectations. Clarification and a budgetary quote follow. The site supports the first two steps.\n\nLater stages may include process reviews the buyer describes as PPAP-related. Marketing should not treat the form submit as a nomination or a production award.',
      salesCycleCharacteristics:
        'Production quotes wait on prints, material, a quantity band, and sometimes a quality-document question. Revision cycles are normal while the part definition is still moving.\n\nSay who responds and which missing data pauses the quote. Do not promise a ship date or a tooling interval you have not confirmed for that part.',
      buyerQuestionsByStage:
        'Early questions cover process, material, and whether the plant serves production buyers rather than retail. Middle questions cover APQP, FMEA, PPAP expectations, capacity, and revision handling. Later questions cover logistics and how changes are logged.\n\nEach stage needs its own section. A repeated line about automotive innovation does not answer them.',
      trustAndConversionFactors:
        'Trust comes from a specific family list, a form that accepts prints, and a clear refusal to claim IATF 16949, a PPAP level, or an OEM approval. Adjacent metalworking is general process knowledge only and is not program experience.\n\nHonest limits convert better than a page that implies every vehicle maker is a customer.',
      leadNurturingApproach:
        'A brief that lacks a print can stay in a slower follow-up that asks for family, revision, and a volume band. Do not restart a generic capabilities pitch, and do not attach a certificate the company does not hold.\n\nWhen the request is a repair or a retail part, a short decline protects estimating time and keeps the next production enquiry credible.',
      websiteAndCatalogStrategy:
        'Organize the site by part family and process first. The enquiry path should accept prints, material notes, and a volume band. Keep any aftermarket offer on a separate URL if it exists at all.\n\nAvoid a single parts list that mixes production components with consumer SKUs and service specials.',
      paidAdvertisingStrategy:
        'Paid search works when the ad and the landing page name the same part family. Sending every automotive query to the homepage wastes the click.\n\nNegative terms for dealers, oil changes, repair, body shops, and aftermarket retail reduce spend on enquiries the plant will not quote. Do not bid on a vehicle maker brand as if the company were a dealer.',
      conversionOptimization:
        'The form should request part family, process, material, print revision, volume band, timing, and whether the buyer wants to discuss APQP, PPAP, or FMEA. Say what happens next and who reads the package.\n\nConfirm that files can upload. Remove fields estimating will not use.',
      analyticsAndMeasurement:
        'Count enquiries that include a part family and a print or a clear process, not every click from an auto-parts query. Do not report those enquiries as nominations, revenue, or awarded programs.\n\nSeparate family-page traffic from repair-intent traffic so a keyword test does not hide a weak production form.',
      industryExpertise:
        'The work is to describe real component families and the production enquiry, and to explain IATF 16949, APQP, PPAP, and FMEA as subjects buyers ask about. It is not to claim those credentials or to pose as a dealer.\n\nMaryan Polyak and Manufactori focus on clear industrial pages and enquiry paths for manufacturers. That includes automotive component suppliers when the public offer can be stated without inventing an OEM relationship.',
      relevantExperience:
        'There is no published Manufactori case that documents a direct automotive, aerospace, marine, or defense manufacturing program. Adjacent metalworking is general process knowledge only and is not claimed as program experience.\n\nDo not present machining, fabrication, or forming examples as an automotive OEM program, a Tier nomination, a PPAP level, or an IATF 16949 certificate. Do not invent customer names, platforms, volumes, or tolerances to fill that gap.',
      industryProofPoints:
        'There is no published Manufactori case that documents a direct automotive, aerospace, marine, or defense manufacturing program. Adjacent metalworking is general process knowledge only and is not claimed as program experience.\n\nProof on this page is limited to how clearly a supplier can state part families, production processes, and the difference between a buyer question about IATF 16949, APQP, PPAP, or FMEA and a credential the company holds. No OEM approval, PPAP level, or customer program is introduced.',
    },
    faq: [
      {
        question: 'Should a component plant share pages with a dealer or repair offer?',
        answer:
          'No. Dealers, repair shops, and aftermarket retailers answer a different search. Production pages should name part families and ask for a print, a material, and a volume band. Service appointments belong on a different site or a clearly separate URL.',
      },
      {
        question: 'Can the site say the plant is IATF 16949 certified?',
        answer:
          'Only if that certificate is real, current, and approved for public use by the company. This page does not claim IATF 16949 for any supplier. Buyers do ask about the standard. The honest response is to describe the question, not to invent a certificate.',
      },
      {
        question: 'How should PPAP appear in marketing copy?',
        answer:
          'Explain that many production buyers ask which PPAP elements they expect to discuss later. Do not state a PPAP level, and do not describe a submission as approved. The enquiry form can ask whether a PPAP conversation is in scope.',
      },
      {
        question: 'What is the difference between APQP and FMEA on a public page?',
        answer:
          'APQP is the planning conversation buyers use to move a part toward production. FMEA, often a process FMEA, is one risk-review tool inside that conversation. Define both as buyer topics. Do not publish a completed FMEA as if a customer had signed it.',
      },
      {
        question: 'Does a metalworking example prove an automotive OEM program?',
        answer:
          'No. There is no published Manufactori case that documents a direct automotive manufacturing program. Adjacent metalworking is general process knowledge only and is not claimed as program experience, a Tier nomination, or an OEM approval.',
      },
      {
        question: 'What belongs on an automotive production enquiry form?',
        answer:
          'Part family, process, material, print revision, volume band, timing, and a note on whether APQP, PPAP, or FMEA will be discussed. A phone number alone is not enough for estimating.',
      },
      {
        question: 'Should we name vehicle makers or platforms?',
        answer:
          'Do not invent OEM names, platforms, or volumes. If a relationship is not already public and approved, leave it off the page. Part family and process are enough for a first qualification.',
      },
      {
        question: 'How do we keep aftermarket retail traffic off these pages?',
        answer:
          'State that the offer is production components for B2B buyers. Use negative keywords for repair, dealers, and consumer part numbers. Do not build landing pages around retail SKUs.',
      },
      {
        question: 'Is a sample order the same as a production release?',
        answer:
          'No. A sample can be quoted from a family page. A production release usually adds documentation questions, revision control, and a volume band. Say that difference so buyers do not treat one form as both.',
      },
      {
        question: 'Does clearer automotive copy guarantee rankings or citations?',
        answer:
          'No. Clear part families and honest limits help people and tools understand the offer. Rankings, assistant citations, nominations, and revenue are not promised.',
      },
    ],
    ctaTitle: 'Plan automotive component pages and RFQ paths',
    ctaDescription: transportCta('automotive components'),
  },
  {
    slug: 'aerospace-manufacturing',
    title: 'Aerospace Manufacturing',
    h1: 'How Aircraft Component Makers Explain Structures and Traceability',
    preview:
      'Capability and enquiry pages for plants that machine fittings, form sheet details, or build structural components for aircraft programs.',
    metaTitle: 'Marketing for Aircraft Component and Structure Plants',
    metaDescription:
      'How aircraft component plants explain structures, traceability questions, and RFQ paths without claiming AS9100, NADCAP, or an aircraft program approval.',
    image: 'ind-aerospace-manufacturing.jpg',
    alt: 'Machined aircraft fittings and formed sheet-metal structural details arranged in a component shop',
    displayOrder: 2,
    services: ['seo-ai-search-optimization', 'engineering-articles-guides', 'technical-content-strategy'],
    posts: [
      'ai-search-optimization-for-manufacturers',
      'manufacturing-website-architecture-large-catalogues',
    ],
    cases: [],
    fields: {
      industryOverview:
        'Aerospace manufacturing here means build-to-print aircraft components and structures: machined fittings, formed sheet details, brackets, and related assemblies. The public offer is a manufacturing capability with a documentation path. It is not an airline, a ticket desk, a consumer maintenance booking, or a pilot school.\n\nBuyers arrive with a drawing, a material specification, and a question about configuration and traceability. A useful page names the component classes you will quote and keeps flight operations, training, and retail MRO scheduling off the same URL.',
      manufacturingProcesses:
        'Typical routes include precision machining, sheet forming, detail assembly, and the inspection steps the plant will describe in public. General metalworking context can point to <a href="/industrial/metalworking-metal-manufacturing">metalworking and metal manufacturing</a> when you need a process map. Name what is in house. Name partners for special processes instead of implying every step happens on your floor.\n\nBuyers often ask whether a quality system is discussed against AS9100 and whether a special process would need a NADCAP conversation. Those are buyer questions. Do not claim AS9100, NADCAP, or approval on an aircraft program.',
      productsAndApplications:
        'Outputs show up as structural details, machined fittings, brackets, and small assemblies that go into airframes or aircraft systems. Group pages by component class, not by airline route. When the plant also builds electronic hardware, keep that offer with <a href="/industrial/electronics-manufacturing">electronics manufacturing</a> so a board enquiry is not mixed with a fitting enquiry.\n\nDo not describe the company as an airline, an MRO storefront for private owners, or a flight-training provider. Those searches are looking for a service, not a component plant.',
      materialsAndTechnologies:
        'Buyers ask which alloys, tempers, and forming or machining envelopes the plant will accept, and which material certificates and configuration records travel with the part. Publish only the combinations the quality team will confirm. Do not invent a tolerance, a heat-treat condition, or a program specification.\n\nTraceability is the usual technical theme: lot identity, revision level, and who performed a special process. Explain the records you can discuss. Do not present a completed first-article package as if a customer had accepted it.',
      targetMarkets:
        'Customers are aircraft and tier component companies that buy structures or machined details, engineering groups that release build-to-print packages, and supply-chain teams that qualify manufacturing sources. Geography matters when export paperwork or program timing affects whether you should even receive the package.\n\nAirlines shopping for maintenance slots, private owners booking service, and students looking for flight hours are not this buyer. The page should say so.',
      buyerTypes:
        'Design and manufacturing engineers check whether the geometry and material fit the published routes. Quality engineers ask about configuration control, traceability, and special-process responsibility. Procurement checks documents, capacity honesty, and commercial terms.\n\nA site written like an airline brand loses the engineer who needs a fitting, a sheet detail, or a clear limit.',
      decisionMakers:
        'Engineering decides if the part class belongs with the plant. Quality decides if the documentation conversation is credible. Procurement decides if the commercial path is worth opening. All three need a file upload, not only a phone number.\n\nWhen machining, forming, finishing, and assembly are split across partners, say so without inventing an aircraft program name or a customer logo.',
      buyerRequirements:
        'A serious aerospace enquiry names the component class, material, drawing revision, quantity band, and the records the buyer expects to discuss. Optional notes can cover whether AS9100 language is part of their sourcing checklist and whether a special process might raise a NADCAP question.\n\nThe form should ask for those items. A message that says aerospace parts needed, with no revision, is not an estimable package.',
      purchasingFactors:
        'Selection turns on process fit, traceability habits, special-process honesty, and whether you manufacture the detail or only broker it. Buyers may ask about AS9100 and NADCAP because those frameworks organize many aerospace source reviews. Answer with what you can show. Do not imply a certificate or a program approval.\n\nConfiguration control when a drawing revises matters as much as the first unit price. Describe how revisions are received.',
      marketingChallenges:
        'The word aerospace attracts airlines, consumer maintenance, drone hobbyists, and pilot schools as well as component buyers. A page that only says aerospace solutions mixes those intents. Unsupported AS9100 or NADCAP claims, or a named aircraft program, damage trust faster than a shorter component-class page.\n\nThis sector is not automotive serial production. APQP and PPAP language from vehicle supply should not be copied onto an aircraft structures page as if the buying systems were the same.',
      digitalMarketSpecifics:
        'Engineers search by component class and process: machined aircraft fitting, formed sheet detail, structural bracket. Quality staff search for traceability and special-process responsibility. Those intents need distinct sections.\n\nAirline routes, fare language, and flight-training queries should not resolve to the manufacturing template. Keep operational aviation content off the plant site.',
      competitiveFactors:
        'Shops differ by the structures they will touch, the special processes they keep in house, and the configuration records they will describe. A machining source and a sheet-metal source should not share one undifferentiated aerospace paragraph.\n\nPartners for finishing, forming, or processing should be labeled. Do not invent an airframe customer or a program title to look larger.',
      leadGenerationChallenges:
        'Airline service requests, private-owner maintenance, training enquiries, and drawing-free messages consume engineering time. The page has to state component classes and the records required before a quote.\n\nA contact form with no revision field hides the few packages that were actually ready to review.',
      searchBehavior:
        'Manufacturing engineers search by part class and process. Quality engineers search for how a supplier talks about traceability, AS9100, or NADCAP as sourcing questions. Buyers search for a component manufacturer, not a carrier.\n\nBrand pages can introduce the company. Component pages have to carry the process limits and the file requirements. Do not build a URL for every aircraft name.',
      seoStrategy:
        'Give each real component class a page that states the process and the records an enquiry must include. Where machining is central, link to <a href="/industrial/cnc-precision-machining">CNC and precision machining</a> as shop context, not as an aircraft program. The <a href="/industrial/automotive-aerospace-transportation">automotive, aerospace, and transportation</a> hub can orient the sector, while this page stays on aircraft components and structures.\n\nDo not target airline bookings, consumer MRO appointments, or pilot training. Depth on the classes you quote beats a list of aircraft types.',
      aiSearchStrategy:
        'An assistant can only repeat the component classes, the process boundaries, and the statement that AS9100 and NADCAP are buyer questions rather than claimed approvals. That improves clarity. It does not promise a citation.\n\nVague lines about serving every aircraft program give an assistant nothing reliable. A named limit does.',
      keywordAndTopicStructure:
        'Useful groups are the component class, the process, the traceability question, and the buyer role. Leave airline operations, fare and route terms, flight training, and unsupported certificate phrases off the manufacturing site.\n\nDo not create a page per aircraft program, and do not reuse automotive PPAP keywords as if they described this buy.',
      authorityAndVisibility:
        'Named component pages, a file upload, and an honest special-process statement are the public evidence. Do not invent certificates, program awards, or customer fleets.\n\nThere is no published Manufactori case that documents a direct automotive, aerospace, marine, or defense manufacturing program. A metalworking example does not become an aircraft program because the part is aluminum.',
      contentStrategy:
        'Publish the first-call facts: component class, material envelope, revision status, and which traceability records you will discuss. Formed details can reference <a href="/industrial/sheet-metal-metal-forming">sheet metal and metal forming</a>. Finishing steps, when they are real, can reference <a href="/industrial/surface-finishing-coatings">surface finishing and coatings</a> without turning a coating line into a program approval.\n\nKeep the explanation free of airline imagery and sales adjectives. State that consumer maintenance and training are out of scope.',
      technicalContent:
        'Technical pages should cover how you read a drawing, which material certificates you expect, and how configuration is identified on a quote. They can explain what buyers mean when they ask about AS9100 or NADCAP. They should not publish a special-process approval, a tolerance, or a first-article result.\n\nIf a process is subcontracted, name that boundary next to the component class.',
      productAndApplicationContent:
        'Repeat component classes deserve their own pages when they produce regular RFQs. One-off details can remain on the class page with a note that a configured production package needs revision control, not only a model file.\n\nApplication notes for structures, fittings, or system brackets should link back to the process. Do not illustrate them with a named aircraft or a route map.',
      expertiseContent:
        'Show how the team tells a build-to-print structures package from an airline maintenance request, and how it decides which traceability questions belong in the first reply. That is more useful than a history of slogans.\n\nExplain what makes a package complete enough to review: drawing revision, material, quantity band, and special-process notes. Do not invent an acceptance rate.',
      contentFormats:
        'Component-class pages, a short explainer on traceability and configuration, and an FAQ that separates manufacturing from airline operations fit this sector. Photos should show fittings or formed details on a bench or line, with a caption that names the class.\n\nAny PDF leave-behind should match the site. A brochure that adds an AS9100 mark the site does not claim will be questioned on the first call.',
      buyerJourney:
        'A buyer finds a component class, checks process and record fit, and sends a drawing package. Clarification and a budgetary review follow. The site supports those early steps.\n\nLater stages may include configuration reviews and special-process questions. A form submit is not a program award and not a production authorization.',
      salesCycleCharacteristics:
        'Quotes wait on revision level, material, quantity band, and sometimes a quality-system question. Packages move slowly when the definition is still changing, and that should be said in advance.\n\nTell the visitor who responds and which missing record pauses the review. Do not promise a lead time for an unnamed part.',
      buyerQuestionsByStage:
        'Early questions are about component class, material, and whether you manufacture rather than fly or maintain aircraft. Middle questions cover traceability, configuration, AS9100 language, and NADCAP as a special-process topic. Later questions cover shipping records and who owns a subcontracted process.\n\nEach stage needs its own section. Repeating aerospace excellence on every URL does not answer them.',
      trustAndConversionFactors:
        'Trust comes from a specific component list, a drawing upload, and a refusal to claim AS9100, NADCAP, or a program approval. Adjacent metalworking is general process knowledge only.\n\nLimits stated in public convert better than a page that implies every airframe is a customer.',
      leadNurturingApproach:
        'A package without a revision can sit in a slower follow-up that asks for class, material, and drawing status. Do not resend a generic capabilities deck, and do not attach a certificate you do not hold.\n\nWhen the request is an airline booking, a consumer repair, or flight training, decline it in one short note.',
      websiteAndCatalogStrategy:
        'Organize the site by component class and process, then by the structures or fittings you want more of. The enquiry path should accept drawings, revision notes, and a quantity band.\n\nKeep airline, training, and consumer maintenance offers off these URLs. Do not dump every historical part number into one list with no class page.',
      paidAdvertisingStrategy:
        'Paid search works when the ad and the landing page name the same component class. Sending every aerospace query to the homepage mixes engineers with travelers.\n\nNegative terms for flights, tickets, pilot school, and consumer maintenance reduce spend on requests the plant will not quote. Do not bid on an aircraft program name.',
      conversionOptimization:
        'The form should request component class, material, drawing revision, quantity band, timing, and whether the buyer expects to discuss AS9100 or a NADCAP-related special process. Say what happens next.\n\nConfirm file upload. Drop fields that engineering will not read.',
      analyticsAndMeasurement:
        'Count enquiries that include a component class and a drawing or a clear process, not every visit from an aerospace query. Do not report those enquiries as program wins or revenue.\n\nSeparate component-page traffic from airline and training traffic so content tests stay readable.',
      industryExpertise:
        'The work is to describe aircraft component classes, traceability expectations, and the difference between a manufacturing source and an airline or training business. AS9100 and NADCAP stay buyer concepts unless the company can show a current credential, which this page does not claim.\n\nMaryan Polyak and Manufactori focus on clear industrial pages and enquiry paths for manufacturers. That includes aircraft component plants when the offer is stated without inventing a program.',
      relevantExperience:
        'There is no published Manufactori case that documents a direct automotive, aerospace, marine, or defense manufacturing program. Adjacent metalworking is general process knowledge only and is not claimed as program experience.\n\nDo not present machining, forming, or finishing examples as an aircraft program, an AS9100 certificate, a NADCAP accreditation, or a customer approval. Do not invent programs, aircraft names, tolerances, or volumes to fill that gap.',
      industryProofPoints:
        'There is no published Manufactori case that documents a direct automotive, aerospace, marine, or defense manufacturing program. Adjacent metalworking is general process knowledge only and is not claimed as program experience.\n\nProof on this page is limited to how clearly a plant can state component classes, process boundaries, and the difference between a buyer question about AS9100 or NADCAP and a credential the company holds. No program approval is introduced.',
    },
    faq: [
      {
        question: 'Are airlines and pilot schools part of this manufacturing offer?',
        answer:
          'No. This page is for plants that make aircraft components and structures. Airline operations, consumer maintenance bookings, and pilot training are different businesses and should not share the component URLs.',
      },
      {
        question: 'Can marketing copy claim AS9100?',
        answer:
          'Only when the company holds a current certificate and has approved that statement. This page does not claim AS9100. It explains that buyers often ask whether a quality system will be discussed against that standard.',
      },
      {
        question: 'How should NADCAP be described?',
        answer:
          'NADCAP is a special-process accreditation topic buyers raise for processes such as certain treatments and inspections. Say whether a process is in house or at a partner, and whether you are prepared to discuss the question. Do not claim NADCAP accreditation.',
      },
      {
        question: 'Why not reuse automotive PPAP pages for aircraft parts?',
        answer:
          'Vehicle production and aircraft component buying use different document habits. APQP and PPAP language does not describe a structures enquiry. Aircraft pages should talk about configuration, traceability, and special-process responsibility.',
      },
      {
        question: 'Does a metalworking project count as an aerospace program?',
        answer:
          'No. There is no published Manufactori case that documents a direct aerospace manufacturing program. Adjacent metalworking is general process knowledge only and is not claimed as program experience or as an airframe approval.',
      },
      {
        question: 'What should an aircraft component enquiry collect?',
        answer:
          'Component class, material, drawing revision, quantity band, timing, and a note on traceability or special-process questions. A phone-only form usually cannot be estimated.',
      },
      {
        question: 'Should the site name aircraft or customers?',
        answer:
          'Do not invent aircraft programs, tail numbers, customers, tolerances, or volumes. Component class and process limits are the public facts a first review needs.',
      },
      {
        question: 'Where do avionics and boards belong?',
        answer:
          'If you manufacture electronic hardware, give it a separate electronics page. Do not fold populated boards into a structures page, and do not describe that work as airline operations.',
      },
      {
        question: 'Is a first-article conversation the same as a claimed approval?',
        answer:
          'No. Buyers may ask how a first-article package would be discussed. Describing that question is not the same as stating that a customer accepted a part or that a certificate exists.',
      },
      {
        question: 'Does clearer aerospace content guarantee citations or rankings?',
        answer:
          'No. Specific component classes and honest limits help readers and tools understand the offer. Rankings, citations, and program awards are not promised.',
      },
    ],
    ctaTitle: 'Plan aircraft component pages and enquiry paths',
    ctaDescription: transportCta('aircraft components and structures'),
  },
  {
    slug: 'marine-shipbuilding',
    title: 'Marine & Shipbuilding',
    h1: 'How Marine Equipment Makers and Shipyards Explain Their Role',
    preview:
      'Role, product, and enquiry pages for shipyards, marine equipment manufacturers, and installers that supply components for vessels and outfitting.',
    metaTitle: 'Marketing for Marine Equipment and Ship Component Makers',
    metaDescription:
      'How marine equipment makers and shipyards explain roles, processes, and RFQs without claiming DNV, LR, or ABS class approval or a named vessel.',
    image: 'ind-marine-shipbuilding.jpg',
    alt: 'Fabricated marine steel components and outfitting equipment arranged in a ship component shop',
    displayOrder: 3,
    services: [
      'international-marketing-strategy',
      'industrial-website-design',
      'rfq-forms-conversion-optimization',
    ],
    posts: ['digital-lead-generation-manufacturing'],
    cases: [],
    fields: {
      industryOverview:
        'Marine and shipbuilding manufacturing covers three different offers that search often collapses into one. A shipyard builds or assembles structure and outfit. An equipment manufacturer builds machinery, fabrications, or outfitting products in a factory. An installer places that equipment aboard. The public site has to say which of those roles the company plays.\n\nThis is not boat sales, a marina berth, or a tourism booking. Buyers arrive with a specification, a material list, or an outfit package and need the role before they send drawings.',
      manufacturingProcesses:
        'Shipyard routes may include plate preparation, panel assembly, outfitting, and the tests the yard will describe. Factory routes for equipment may include machining, fabrication, assembly, and factory acceptance the plant actually performs. Electrical distribution gear, when you build it, should be described with <a href="/industrial/electrical-electronic-equipment">electrical and electronic equipment</a> rather than folded into a hull story.\n\nBuyers may ask how work would be discussed with a classification society such as DNV, LR, or ABS. Explain that as context. Do not claim class approval from any society.',
      productsAndApplications:
        'Outputs differ by role. A yard may show blocks, outfit packages, or repair scopes it will quote. An equipment plant may show pumps and fluid packages, climate equipment, or fabricated components. Fluid equipment belongs with <a href="/industrial/pumps-valves-fluid-handling">pumps, valves, and fluid handling</a>. Shipboard climate equipment belongs with <a href="/industrial/hvac-climate-equipment">HVAC and climate equipment</a>. Mixing those families into one marine solutions page hides the buyer.\n\nDo not illustrate the offer with a named vessel, a fleet list, or a tourism itinerary.',
      materialsAndTechnologies:
        'Buyers ask about plate and profile grades, joining methods, corrosion protection, and the documents that follow a component or a block. Publish the combinations the company will confirm. Do not invent a class notation, a thickness, or a welding parameter.\n\nMaterial traceability and weld records are common questions for both yards and fabrication shops. State which records you can discuss. A stock photo of a hull does not answer them.',
      targetMarkets:
        'Customers may be shipyards buying equipment, owners representatives sourcing outfit, equipment makers buying fabrications, or naval and commercial technical offices sending a build-to-print package. The page should not pretend those buyers share one form.\n\nBoat dealers, marina operators, and travel sites compete for the word marine. They are not the manufacturing audience, and the copy should exclude them.',
      buyerTypes:
        'Naval architects and outfit engineers check whether the role and the product family match the package. Production planners at a yard check interfaces and lead time honesty. Procurement checks documents and commercial terms. Classification questions often come from the technical office, not from marketing.\n\nA visitor who wants a berth or a weekend charter will not use those checks. Do not write the page for that visitor.',
      decisionMakers:
        'Engineering decides role fit: yard, equipment maker, or installer. Procurement decides whether the document path is credible. Both need a form that asks which role the buyer thinks they are addressing.\n\nWhen fabrication, equipment supply, and onboard installation are different companies, say so. Do not invent a ship name or a class certificate to connect them.',
      buyerRequirements:
        'A serious enquiry names the role sought, the product or work package, materials, drawing status, quantity or scope, and timing. Optional notes can cover whether a classification society is part of the buyer checklist and which society they mention.\n\nThe form should ask for those items. A note that says we need a boat is not a shipyard or equipment enquiry.',
      purchasingFactors:
        'Selection turns on role clarity, process fit, document habits, and whether you build, supply, or install. Buyers may mention DNV, LR, or ABS because those societies appear in many specifications. Treat the names as context the buyer brings. Do not claim class approval, a notation, or a yard authorization.\n\nInterface control between a factory-built unit and a yard installation matters as much as the first price. Say who owns that boundary.',
      marketingChallenges:
        'One homepage often claims shipbuilding, equipment, and installation at once, then adds boat sales language by accident. Visitors cannot tell who will receive the drawing. Unsupported class-approval claims are more damaging than a page that names a single role.\n\nTourism, marina, and brokerage queries will keep arriving until the copy and the paid terms exclude them.',
      digitalMarketSpecifics:
        'Engineers search by equipment family or by yard scope: marine pump package, ship HVAC, fabricated outfit steel, block assembly. Those intents should not share a URL with marina slips or cruise bookings.\n\nInternational buyers may search in more than one language. Translate the role statement and the enquiry fields, not a slogan about the sea.',
      competitiveFactors:
        'Yards, equipment plants, and installers compete on different facts. A pump manufacturer is not a shipyard because both use the word marine. Publish the difference before the quote.\n\nPartners for coatings, controls, or onboard work should be labeled when they are outside the company. Do not attach a vessel name to make the partnership look like a contract award.',
      leadGenerationChallenges:
        'Berth requests, boat purchases, charter bookings, and specification-free messages consume estimating time. The page has to state the role and the packages you will read.\n\nA single contact us control with no scope field invites tourism traffic and hides a real outfit enquiry.',
      searchBehavior:
        'Technical buyers search by equipment or by shipyard work package. Commercial teams search for a manufacturer or a yard, often with a region. Leisure searches use marina, yacht for sale, and tour language.\n\nBrand pages can explain the company role. Product or scope pages have to carry the documents you need. Do not build a page for every port.',
      seoStrategy:
        'Give each real role and each equipment family its own page. Fabricated structure and heavy joining can reference <a href="/industrial/welding-heavy-fabrication">welding and heavy fabrication</a> when that work is quoted. The <a href="/industrial/automotive-aerospace-transportation">automotive, aerospace, and transportation</a> hub is only a sector map. This page has to separate yard, equipment, and installer offers.\n\nDo not target boat sales, marina reservations, or tourism. A short list of real families beats a catalog of vessel types.',
      aiSearchStrategy:
        'An assistant can repeat a role, a product family, and the statement that DNV, LR, and ABS are classification societies buyers mention, not approvals you claim. That is a clarity task. It is not a promise of citation.\n\nA line that says the company is class approved for every vessel type is both unsupported and easy for an assistant to copy.',
      keywordAndTopicStructure:
        'Useful groups are the company role, the equipment or work package, the document question, and the buyer type. Leave marina, brokerage, charter, and unsupported class-notation phrases off the manufacturing site.\n\nDo not create a landing page for a named ship, and do not merge pump, HVAC, and hull assembly into one keyword.',
      authorityAndVisibility:
        'Named role pages, equipment families, and a form that asks which society a buyer is working with are the public evidence. Do not invent notations, yard licenses, or fleet lists.\n\nThere is no published Manufactori case that documents a direct automotive, aerospace, marine, or defense manufacturing program. A fabrication photo is not a ship contract.',
      contentStrategy:
        'Publish the distinction a project manager needs on the first call: yard, equipment manufacturer, or installer, plus the package you will estimate. Fabricated components can point to <a href="/industrial/metal-fabrication">metal fabrication</a> so visitors see the shop process without reading it as a vessel award.\n\nState that boat sales and tourism are out of scope. That sentence prevents more bad enquiries than a paragraph about maritime heritage.',
      technicalContent:
        'Technical pages should cover materials you quote, joining or assembly steps you perform, and the records a buyer should attach. They can explain that classification societies review certain designs and materials. They should not state a class approval, a notation, or a survey result.\n\nWhen installation is done by another company, say that next to the equipment family.',
      productAndApplicationContent:
        'Repeat equipment families and repeat yard scopes deserve their own pages. One-off repairs can stay on the scope page with a note that a newbuilding package and a repair package are different enquiries.\n\nApplication notes for outfit, machinery, or structure should link back to the role. Do not decorate them with a vessel name or a passenger count.',
      expertiseContent:
        'Show how the team reads an enquiry and assigns it to yard work, factory equipment, or installation. That routing is the expertise buyers cannot see on a generic marine page.\n\nExplain what makes a package complete: role, drawings, materials, and whether a society is mentioned. Do not invent a delivery record.',
      contentFormats:
        'Role pages, equipment-family pages, a short note on classification societies as buyer context, and an FAQ that rejects boat sales fit this sector. Photos should show fabrications or equipment in a shop, with a caption that names the family.\n\nBrochures should match the site. Adding a society logo the company is not approved to use creates a problem the form cannot fix.',
      buyerJourney:
        'A buyer identifies the role, checks the family or scope, and sends drawings with timing. Clarification and a budgetary review follow. The site supports those steps.\n\nLater stages may include interface reviews between factory and yard. A form submit is not a ship contract and not a class approval.',
      salesCycleCharacteristics:
        'Quotes wait on scope, materials, drawing status, and sometimes a society question. Newbuilding packages and repair packages move on different clocks, and the page should say which one you accept.\n\nTell the visitor who responds and which missing document pauses the review. Do not promise a docking date or a launch date.',
      buyerQuestionsByStage:
        'Early questions are about role and product family. Middle questions cover materials, weld or assembly records, lead time, and whether DNV, LR, or ABS is relevant to the buyer checklist. Later questions cover interfaces, shipping, and who installs.\n\nEach stage needs its own section. A slogan about the ocean does not answer them.',
      trustAndConversionFactors:
        'Trust comes from a named role, a named equipment or work scope, and a refusal to claim DNV, LR, or ABS class approval. Adjacent metalworking is general process knowledge only and is not a ship contract.\n\nClear exclusions of boat sales and marinas make the right enquiry easier to send.',
      leadNurturingApproach:
        'An incomplete package can stay in a slower follow-up that asks for role, drawings, and scope. Do not restart a tourism-style brand story, and do not send a class certificate you do not hold.\n\nWhen the request is a berth, a boat purchase, or a charter, decline it briefly.',
      websiteAndCatalogStrategy:
        'Organize the site by role first, then by equipment family or yard scope. The enquiry path should force a choice among shipyard, equipment manufacturer, and installer when more than one exists.\n\nKeep leisure marine on other domains or clearly separate URLs. Do not mix a product catalog with a marina price list.',
      paidAdvertisingStrategy:
        'Paid search works when the ad names the same role and family as the landing page. Sending every marine query to the homepage buys tourism clicks.\n\nNegative terms for marina, yacht for sale, charter, cruise, and boat dealer reduce spend the plant or yard will not convert. Do not bid on a vessel name.',
      conversionOptimization:
        'The form should request role, product or work package, materials, drawing status, scope, timing, and whether the buyer is working to a classification-society checklist. Name the societies only as examples the buyer may mention, not as approvals.\n\nConfirm that files can upload. Remove fields the estimating team ignores.',
      analyticsAndMeasurement:
        'Count enquiries that name a role and a package, not every click on a ship photo. Do not report those enquiries as ship contracts, class approvals, or revenue.\n\nSeparate equipment-page traffic, yard-scope traffic, and leisure traffic so the three offers stay measurable.',
      industryExpertise:
        'The work is to separate shipyard, marine equipment manufacturer, and installer, and to explain classification societies as context buyers raise. It is not to claim a DNV, LR, or ABS approval or to sell boats.\n\nMaryan Polyak and Manufactori focus on clear industrial pages and enquiry paths for manufacturers. That includes marine suppliers when the role can be stated without inventing a vessel.',
      relevantExperience:
        'There is no published Manufactori case that documents a direct automotive, aerospace, marine, or defense manufacturing program. Adjacent metalworking is general process knowledge only and is not claimed as program experience.\n\nDo not present fabrication, welding, pump, or HVAC examples as a ship contract, a class approval, or a yard authorization. Do not invent vessels, owners, notations, or tonnage to fill that gap.',
      industryProofPoints:
        'There is no published Manufactori case that documents a direct automotive, aerospace, marine, or defense manufacturing program. Adjacent metalworking is general process knowledge only and is not claimed as program experience.\n\nProof on this page is limited to how clearly a company can state whether it is a shipyard, an equipment manufacturer, or an installer, and how it treats DNV, LR, and ABS as buyer context. No class approval is introduced.',
    },
    faq: [
      {
        question: 'What is the difference between a shipyard, an equipment maker, and an installer?',
        answer:
          'A shipyard builds or assembles structure and outfit. An equipment manufacturer builds products in a factory, such as machinery, fabrications, or outfitting units. An installer places equipment aboard. The website should say which role applies before a drawing is sent.',
      },
      {
        question: 'Should boat sales and marina pages sit with manufacturing?',
        answer:
          'No. Dealers, marinas, and tourism sites answer leisure searches. Manufacturing and yard pages should ask for a work package or a product family, not a berth or a weekend booking.',
      },
      {
        question: 'Can the site claim DNV, LR, or ABS approval?',
        answer:
          'No claim belongs here unless the company holds a specific approval and has cleared the wording. This page does not claim class approval. Buyers may name those societies. The form can ask which checklist they are using.',
      },
      {
        question: 'Does a welding or fabrication example prove a ship contract?',
        answer:
          'No. There is no published Manufactori case that documents a direct marine manufacturing program. Adjacent metalworking is general process knowledge only and is not claimed as a ship contract or a class approval.',
      },
      {
        question: 'How should pumps or HVAC appear on a marine site?',
        answer:
          'As their own equipment families when you manufacture them. A shipyard that only installs a pump should not describe itself as the pump factory. Link the family to the role that actually builds it.',
      },
      {
        question: 'What should a marine manufacturing enquiry collect?',
        answer:
          'Role, product or work package, materials, drawing status, scope, timing, and whether a classification society is part of the buyer checklist. A phone number without scope is rarely enough.',
      },
      {
        question: 'Should newbuilding and repair share one form?',
        answer:
          'Only if the labels are separate. A newbuilding package and a repair package ask for different documents and move on different schedules. One unlabeled marine box hides that difference.',
      },
      {
        question: 'Is it useful to name vessels?',
        answer:
          'Do not invent vessel names, owners, or class notations. Role and product family are the public facts. A named ship is not required for a first review.',
      },
      {
        question: 'How do we handle international buyers?',
        answer:
          'Translate the role statement and the enquiry fields into the languages you actually sell in. A translated slogan without a translated form still produces incomplete packages.',
      },
      {
        question: 'Does clearer marine copy guarantee rankings?',
        answer:
          'No. Role pages and honest limits help the right buyer recognize the offer. Rankings, citations, class approvals, and contract awards are not promised.',
      },
    ],
    ctaTitle: 'Plan marine equipment pages and yard enquiries',
    ctaDescription: transportCta('marine equipment and shipbuilding components'),
  },
  {
    slug: 'defense-military-manufacturing',
    title: 'Defense & Military Manufacturing',
    h1: 'How Defense Component Suppliers Explain a Legitimate B2B Offer',
    preview:
      'Capability and enquiry pages for plants that machine, fabricate, or assemble components and subsystems for defense supply chains.',
    metaTitle: 'Marketing for Defense Component and Subsystem Suppliers',
    metaDescription:
      'How defense component suppliers explain processes, documents, and RFQs without claiming ITAR registration, clearance, or a government contract.',
    image: 'ind-defense-military-manufacturing.jpg',
    alt: 'Machined defense components, metal enclosures, and welded subassemblies laid out on a production bench',
    displayOrder: 4,
    services: ['technical-white-papers', 'linkedin-ads-b2b-campaigns', 'international-multilingual-seo'],
    posts: [
      'technical-content-marketing-manufacturers',
      'ai-search-optimization-for-manufacturers',
    ],
    cases: [],
    fields: {
      industryOverview:
        'Defense and military manufacturing on this page means legitimate B2B supply of components and subsystems: machined parts, welded structures, enclosures, electronic assemblies, and power equipment. Many suppliers never build a complete weapon, and the site should not pretend that they do.\n\nThe offer is a manufacturing capability and a documentation path. It is not a news desk, a field report, or a promotion of the use of force. Buyers arrive with a print, a specification, and questions about configuration and export-control handling.',
      manufacturingProcesses:
        'Typical routes include precision machining, fabrication and welding, enclosure build, electronic assembly, and inspection the plant will actually describe. Heavy joining, when it is in house, can be placed with <a href="/industrial/welding-heavy-fabrication">welding and heavy fabrication</a>. Name partners for processes you do not run.\n\nBuyers sometimes ask whether a part may fall under ITAR or EAR. The page can say that this is a compliance question for counsel and for the company process. It is not legal advice, and it is not a claim of registration, a license, or a security clearance.',
      productsAndApplications:
        'Outputs include machined details, welded subassemblies, racks and enclosures, cable and electronic assemblies, and energy-storage hardware when that is a real product. Power equipment should be described with <a href="/industrial/batteries-energy-storage-manufacturing">batteries and energy storage manufacturing</a> rather than as a weapon system. Keep the language on parts and subsystems.\n\nDo not market complete weapons, operational scenarios, or combat performance. A component plant that machines housings should say it machines housings.',
      materialsAndTechnologies:
        'Buyers ask which materials, joining methods, and electronic build routes the plant will quote, and which configuration records travel with the part. Publish the combinations sales will confirm. Do not invent a tolerance, a specification, or a qualified process.\n\nFinish, identification, and revision control are common technical themes. Explain the records you can discuss. Do not present a government acceptance or a facility clearance.',
      targetMarkets:
        'Customers are prime and lower-tier manufacturers, engineering groups that release build-to-print packages, and procurement teams that buy components for defense programs. Some buyers are commercial companies with a defense division. The page does not need to claim any of them as a current account.\n\nJournalists, hobbyists, and people seeking operational information are not buyers. Copy should not court those searches.',
      buyerTypes:
        'Manufacturing engineers check process fit. Quality and configuration staff check revision control and record habits. Procurement checks documents and commercial terms. Export-compliance staff may ask an ITAR or EAR question before engineering even opens the print.\n\nA site written as a news brief or as a weapons catalog loses the engineer who needs a housing, a weldment, or a board assembly.',
      decisionMakers:
        'Engineering decides whether the part class belongs with the plant. Compliance decides whether the company should receive the package at all. Procurement decides whether the commercial path is credible. Those are three different gates, and the form should not collapse them into one slogan.\n\nWhen machining, electronics, and assembly are different sites or partners, say so. Do not invent a program name or a contract number to connect them.',
      buyerRequirements:
        'A serious enquiry names the component or subsystem class, material or build type, revision, quantity band, timing, and whether the buyer believes export-control review is required. Optional notes can cover configuration records and which documents the buyer can legally send.\n\nThe form should warn that the website does not give legal advice on ITAR or EAR. Estimating should not begin on a package the company is not allowed to hold.',
      purchasingFactors:
        'Selection turns on process fit, configuration discipline, and honesty about what the plant does not build. Buyers may ask about quality records, identification, and export-control screening. Answer with the process you run. Do not imply ITAR registration, an EAR authorization, a security clearance, or a government contract.\n\nNot every supplier builds a complete system. A buyer who needs a finished weapon is often in the wrong factory, and the page should make that visible.',
      marketingChallenges:
        'Defense language attracts news, politics, and weapons enthusiasts as well as component buyers. A page that leads with combat imagery produces the wrong traffic and misstates a machining or electronics business. Unsupported claims of registration, clearance, or a contract award are worse than a plain component list.\n\nAdjacent shops in metalworking or electronics are not evidence of a defense program.',
      digitalMarketSpecifics:
        'Engineers search by part class and process. Compliance staff search for how a supplier talks about export control. Those intents can share a site only if the sections stay distinct.\n\nNews queries, historical battles, and consumer tactical products should not resolve to the manufacturing template. Keep them out of titles and ads.',
      competitiveFactors:
        'Suppliers differ by the component classes they quote, the records they will describe, and whether they build electronics, metal parts, or both. A machine shop and an electronics plant should not share one defense solutions paragraph.\n\nPartners should be labeled. Do not add a service-branch name or a program title to make a partnership look like an award.',
      leadGenerationChallenges:
        'Media requests, student papers, weapons enthusiasts, and drawing-free messages consume time the engineering team does not have. The page has to say which component classes are in scope and that complete weapons are not assumed.\n\nA form that invites any defense question, with no revision and no export-control check, creates risk as well as noise.',
      searchBehavior:
        'Engineers search for machined defense components, welded enclosures, or military electronics manufacturing in the sense of hardware, not operations. Buyers search for a supplier that will state a process and a document path.\n\nBrand searches can introduce the company. Class pages have to carry limits. Do not build a URL for every program nickname.',
      seoStrategy:
        'Give each real component class a page that states the process and the records an enquiry must include. Machined work can reference <a href="/industrial/cnc-precision-machining">CNC and precision machining</a> as shop context, not as a contract. The <a href="/industrial/automotive-aerospace-transportation">automotive, aerospace, and transportation</a> hub is a sector map only. This page stays on defense components and subsystems.\n\nDo not target news, operations, or weapons-promotion queries. Depth on the classes you manufacture is the useful strategy.',
      aiSearchStrategy:
        'An assistant can repeat component classes, the statement that many suppliers do not build complete weapons, and the statement that ITAR and EAR are regulatory topics rather than claimed registrations. That is clarity. It is not legal advice and not a promised citation.\n\nSensational lines about battlefield performance are unreliable and should not be on the site for an assistant to copy.',
      keywordAndTopicStructure:
        'Useful groups are the component class, the process, the record question, and the export-control topic as context. Leave news, operations, political commentary, and unsupported registration phrases off the site.\n\nDo not create a page per weapon type, and do not bid on or publish program nicknames you do not support with a real offer.',
      authorityAndVisibility:
        'Named component pages, a file policy, and a plain export-control disclaimer are the public evidence. Do not invent registrations, clearances, press citations, or contract numbers.\n\nThere is no published Manufactori case that documents a direct automotive, aerospace, marine, or defense manufacturing program. Electronics or machining examples do not become a defense approval.',
      contentStrategy:
        'Publish what a buyer needs before sending a file: component class, whether you build metal, electronics, or both, and how export-control questions are routed. Electronic assemblies can reference <a href="/industrial/electronics-manufacturing">electronics manufacturing</a>. Enclosures and power distribution hardware can reference <a href="/industrial/electrical-electronic-equipment">electrical and electronic equipment</a> when that is the product, not a complete system.\n\nKeep the tone procedural. State that the page is not a briefing on operations and not a legal opinion.',
      technicalContent:
        'Technical pages should cover materials, processes, identification, and the drawing package you need. They can explain, in general terms, that ITAR and EAR are U.S. export-control regimes buyers ask about, and that applicability is a legal and compliance determination. They should not give legal advice, list a registration, or describe a clearance.\n\nDo not publish a specification limit or a test result you will not stand behind.',
      productAndApplicationContent:
        'Repeat component classes deserve their own pages: machined parts, weldments, enclosures, electronic assemblies, or power subsystems, but only when you quote them. One-off builds can stay on the class page.\n\nApplication notes should describe hardware uses in supply-chain language. They should not describe employment of a weapon or name a program.',
      expertiseContent:
        'Show how the team separates a build-to-print component package from a request for a complete weapon, a news question, or a file the company should not accept. That screening is part of the expertise.\n\nExplain what makes a package reviewable: class, revision, quantity band, and a note on export-control status. Do not invent an award history.',
      contentFormats:
        'Component-class pages, a short compliance note that points readers to counsel, and an FAQ that rejects weapons promotion fit this sector. Photos should show parts, enclosures, or assemblies on a bench, with a caption that names the class.\n\nWhite papers can explain enquiry discipline and documentation. They should not read as operational commentary or as a claim of a contract.',
      buyerJourney:
        'A buyer finds a component class, checks process fit and file policy, and sends only what the company is prepared to receive. Clarification and a budgetary review follow when the package is appropriate. The site supports that gate.\n\nLater stages may include configuration reviews. A form submit is not a government contract and not an authorization to export.',
      salesCycleCharacteristics:
        'Reviews wait on revision level, a quantity band, and sometimes a compliance screen before engineering estimates anything. That sequence should be visible so buyers do not expect an instant price.\n\nSay who responds and which missing fact pauses the review. Do not promise a delivery date or a facility clearance.',
      buyerQuestionsByStage:
        'Early questions cover component class and whether you build parts rather than complete weapons. Middle questions cover configuration records, process limits, and how ITAR or EAR questions are handled. Later questions cover logistics and who may receive the file.\n\nEach stage needs its own section. A patriotic slogan does not answer them.',
      trustAndConversionFactors:
        'Trust comes from a specific component list, a visible file policy, and a refusal to claim ITAR registration, EAR authorization, a security clearance, or a government contract. Adjacent metalworking and electronics work are general process knowledge only.\n\nStating that you do not build complete weapons, when that is true, filters the wrong buyer and reassures the right one.',
      leadNurturingApproach:
        'A package that is incomplete can wait for class, revision, and a compliance note. Do not send a capabilities deck that implies a contract award, and do not request files the company is not prepared to store.\n\nWhen the message is a news question or a request to promote a weapon, decline it. Do not argue the topic on the marketing site.',
      websiteAndCatalogStrategy:
        'Organize the site by component class and process. The enquiry path should state the file policy and ask whether the buyer believes an export-control review is required. It should also state that the form is not a legal consultation.\n\nDo not publish a catalog of weapon systems. If electronics, enclosures, and weldments are all real, give each a URL.',
      paidAdvertisingStrategy:
        'Paid campaigns, including professional-network ads aimed at engineers and buyers, work when the ad names a component class. Sending every defense query to the homepage buys news traffic.\n\nNegative themes for news, history, games, and consumer tactical products reduce wasted spend. Do not advertise combat performance or a contract win.',
      conversionOptimization:
        'The form should request component class, process, revision, quantity band, timing, and whether export-control review may apply. Include a short notice that ITAR and EAR questions need qualified counsel and the company compliance process, and that submitting the form is not legal advice.\n\nConfirm which file types you will accept. Remove fields that create copies of data you do not need.',
      analyticsAndMeasurement:
        'Count enquiries that include a component class and a revision or a clear process, not every visit from a defense headline. Do not report those enquiries as contracts, clearances, or revenue.\n\nSeparate class-page traffic from news-driven traffic so a content test does not hide a weak or risky form.',
      industryExpertise:
        'The work is to describe real component and subsystem classes, to say plainly when the plant does not build complete weapons, and to treat ITAR and EAR as regulatory context. It is not legal advice and not a claim of registration, clearance, or a government contract.\n\nMaryan Polyak and Manufactori focus on clear industrial pages and enquiry paths for manufacturers. That includes defense component suppliers when the offer can be stated without inventing a program.',
      relevantExperience:
        'There is no published Manufactori case that documents a direct automotive, aerospace, marine, or defense manufacturing program. Adjacent metalworking is general process knowledge only and is not claimed as program experience.\n\nDo not present machining, welding, electronics, or enclosure examples as a defense approval, an ITAR registration, a security clearance, or a government contract. Do not invent programs, customers, tolerances, or volumes to fill that gap.',
      industryProofPoints:
        'There is no published Manufactori case that documents a direct automotive, aerospace, marine, or defense manufacturing program. Adjacent metalworking is general process knowledge only and is not claimed as program experience.\n\nProof on this page is limited to how clearly a supplier can state component classes, file handling, and the difference between a buyer question about ITAR or EAR and a registration or contract the company holds. No clearance and no government contract are introduced.',
    },
    faq: [
      {
        question: 'Do defense suppliers all build complete weapons?',
        answer:
          'No. Many plants machine parts, weld structures, build enclosures, assemble electronics, or supply power subsystems. The site should name that component work and should not market the company as a complete-weapon maker unless that is the actual, carefully reviewed offer.',
      },
      {
        question: 'Can the website give ITAR or EAR advice?',
        answer:
          'No. ITAR and EAR are regulatory regimes buyers and compliance teams ask about. A marketing page can say the question exists and that applicability is decided by qualified counsel and the company process. That is not legal advice and not a claim of registration or authorization.',
      },
      {
        question: 'Should copy claim a security clearance or a government contract?',
        answer:
          'No. Do not claim a facility clearance, a personnel clearance, or a government contract. Buyers may ask how controlled information is handled. Describe the question and the file policy, not an award.',
      },
      {
        question: 'Does a machining or electronics example prove defense program experience?',
        answer:
          'No. There is no published Manufactori case that documents a direct defense manufacturing program. Adjacent metalworking and electronics knowledge is general process context only and is not a defense approval.',
      },
      {
        question: 'How do we keep news and operations traffic away?',
        answer:
          'Write about component classes and enquiry rules. Do not write about operations, battles, or weapon employment. Use negative themes in paid media for news and consumer tactical products.',
      },
      {
        question: 'What should a defense component form collect?',
        answer:
          'Component class, process, revision, quantity band, timing, and whether the buyer believes an export-control review is required. State which files you will accept. Do not ask for information the company is not prepared to store.',
      },
      {
        question: 'Where do electronics and batteries fit?',
        answer:
          'On their own class pages when you manufacture them. A machined-housing supplier should not absorb a battery or a populated board into one defense paragraph. Subsystem language still does not mean a complete weapon.',
      },
      {
        question: 'Is it acceptable to name programs or customers?',
        answer:
          'Do not invent program names, customers, contract numbers, tolerances, or volumes. If a relationship is not public and approved, leave it off. Component class is enough for a first screen.',
      },
      {
        question: 'Can a white paper discuss export control?',
        answer:
          'It can explain that buyers ask about ITAR and EAR and that the company routes those questions to compliance and counsel. It should not interpret the regulations for a reader or claim a registration.',
      },
      {
        question: 'Does clearer defense copy guarantee rankings or awards?',
        answer:
          'No. Specific component pages and honest limits help the right buyer. Rankings, citations, registrations, clearances, and contracts are not promised.',
      },
    ],
    ctaTitle: 'Plan defense component pages and enquiry paths',
    ctaDescription: transportCta('defense and military components'),
  },
]
