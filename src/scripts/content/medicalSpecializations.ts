import { CHEMICAL_FIELD_KEYS } from './chemicalSpecializationTypes'
import type { ChemicalSpecializationCopy } from './chemicalSpecializationTypes'

export type MedicalSpecializationCopy = ChemicalSpecializationCopy
export const MEDICAL_FIELD_KEYS = CHEMICAL_FIELD_KEYS

const cta = (subject: string) =>
  `Tell us what you manufacture in ${subject} and which buyers should be able to evaluate it. The first conversation is about product scope, documents, and the enquiry path, not a promised ranking, clearance, or revenue figure.`

export const PARENT_FIELD_UPDATES: Record<string, string> = {
  industryOverview:
    'This group covers two different offers. <a href="/industrial/medical-device-manufacturing">Medical device manufacturing</a> is production of devices, instruments, diagnostic equipment, and components for industrial buyers. <a href="/industrial/precision-technology-manufacturing">Precision technology manufacturing</a> is the business of engineered components and precision programs. It is not a second page about machine tools. A custom retail fixture is specialized equipment, and it is not a medical device.',
  productsAndApplications:
    'Pages should name the product family and the use it is built for. Keep device families on <a href="/industrial/medical-device-manufacturing">medical device manufacturing</a> and tight-tolerance engineered components on <a href="/industrial/precision-technology-manufacturing">precision technology manufacturing</a>. Adjacent uses that you will not support should be excluded in the same section.',
  productAndApplicationContent:
    'Each family should say who it is for. A device page and a precision-component page should not share a paragraph. Link the reader to the specialization that matches the enquiry.',
  websiteAndCatalogStrategy:
    'Separate medical families from other specialized products. Each family keeps its own enquiry context. Do not merge a device catalog with a precision-component catalog to look larger.',
  seoStrategy:
    'Publish family pages for the specialty products you sell, with the intended use and the exclusion. Device searches belong on <a href="/industrial/medical-device-manufacturing">medical device manufacturing</a>. Precision-program searches belong on <a href="/industrial/precision-technology-manufacturing">precision technology manufacturing</a>. A machining-process question belongs with <a href="/industrial/cnc-precision-machining">CNC and precision machining</a>. Do not create a page per unapproved claim.',
}

export const MEDICAL_SPECIALIZATIONS: MedicalSpecializationCopy[] = [
  {
    slug: 'medical-device-manufacturing',
    title: 'Medical Device Manufacturing',
    h1: 'How Device Plants Separate Equipment, Instruments, and Contract Work',
    preview:
      'Scope and enquiry pages for manufacturers of medical devices, equipment, instruments, and components, kept apart from hospitals and distributors.',
    metaTitle: 'How Medical Device Manufacturers Explain Their Scope',
    metaDescription:
      'How device and equipment plants explain product scope, contract work, and quality questions for OEM buyers without an unpublished clearance or certificate.',
    image: 'ind-medical-device-manufacturing.jpg',
    alt: 'Stainless instrument components and a device housing on a medical equipment assembly bench',
    displayOrder: 1,
    services: ['technical-white-papers', 'product-capability-pages', 'technical-content-strategy'],
    posts: [
      'technical-content-marketing-manufacturers',
      'manufacturing-seo-strategy-complex-industrial-products',
    ],
    cases: [],
    fields: {
      industryOverview:
        'Medical device manufacturing on this page means companies that produce devices, medical equipment, instruments, diagnostic or laboratory systems, or the components and assemblies that go into them. The buyer is an OEM, a contract-manufacturing customer, or a technical procurement team. Hospitals, clinics, distributors, and consumer medical retailers are a different business.\n\nThis specialization sits under <a href="/industrial/medical-specialized-manufacturing">medical, precision, and specialized manufacturing</a>. High-precision components that are not a device program belong on <a href="/industrial/precision-technology-manufacturing">precision technology manufacturing</a>. Do not use one page to cover both.',
      manufacturingProcesses:
        'Applicable routes depend on the device: machining, sheet metal work, polymer molding, assembly, electrical build, finishing, inspection, and packaging. Name the steps the plant runs and the steps that stay with partners. Machining detail belongs with <a href="/industrial/cnc-precision-machining">CNC and precision machining</a>. Formed metal housings belong with <a href="/industrial/sheet-metal-metal-forming">sheet metal and metal forming</a>.\n\nA process list is not a claim that every device family uses every route. Electronic build, when it is a separate offer, belongs with <a href="/industrial/electrical-electronics-manufacturing">electrical and electronics manufacturing</a>.',
      productsAndApplications:
        'Treat devices, diagnostic systems, laboratory instruments, monitoring equipment, surgical instruments, and component or enclosure work as separate catalogs. A finished device and a machined component for someone else’s device are different offers. OEM production of a customer design is different again from a product the plant owns.\n\nDo not imply that one factory makes every category. State the intended use at the level the company will discuss in public. Do not publish a clinical claim, a hospital name, or a patient outcome.',
      materialsAndTechnologies:
        'Typical discussions cover stainless steel and other engineering metals, aluminum, and engineering plastics. A material is medical-grade only when the company can point to a document it is willing to share. Traceability, surface finish, cleanliness, and dimensional limits belong in that same discussion when they are real requirements of the program.\n\nDesign for manufacturing is a collaboration about a drawing, a material, and a process the plant can run. It is not a promise that a design is cleared for sale. Polymer parts, when that is the product, can be oriented through <a href="/industrial/plastics-polymer-manufacturing">plastics and polymer manufacturing</a> without turning this page into a resin catalog.',
      targetMarkets:
        'The useful markets are device OEMs, contract programs, and buyers of instruments or equipment who purchase from a manufacturer. Clinical departments and retail medical shops search with different words and should not land on a production page.\n\nDiagnostic and laboratory equipment is a market only when the plant builds that class of product. Saying the company serves healthcare is not a market definition.',
      buyerTypes:
        'Product engineers, mechanical engineers, and electrical engineers ask whether the plant can make the part or assembly. Quality and regulatory affairs reviewers ask which documents exist and which questions are still open. Procurement asks about scope, quantity, and the path to a quote.\n\nA page written only for one of those readers fails the others. Put the product scope where engineering can see it, and put the document path where quality can see it.',
      decisionMakers:
        'Engineering acceptance, a quality review, and a purchasing decision rarely happen in one meeting. The site can support the first review. It cannot replace a supplier audit or a regulatory filing.\n\nContract-manufacturing decisions often include a program stage: prototype, pilot, or production. Name which stages the plant will discuss. Do not treat a prototype enquiry as a production award.',
      buyerRequirements:
        'A useful enquiry names the product category, the intended application at a shareable level, the process or component needed, the program stage, and which specification or drawing the buyer can provide. Quantity matters when the buyer knows it.\n\nDo not ask for patient information. Confidential drawings should move through a controlled channel, not a public comment box.',
      purchasingFactors:
        'Buyers compare process fit, materials, documentation, change control, and whether the plant is an OEM, a contract manufacturer, or a component supplier. A clean photograph is not a quality system.\n\nInternational buyers also ask how documents will be shared and which questions are market-specific. The page can list those questions. It should not answer them with an invented registration.',
      marketingChallenges:
        'Device plants are hard to explain because the product, the quality file, and the commercial role are three different stories. One slogan about healthcare innovation hides all three.\n\nSearch traffic mixes manufacturers, distributors, and care providers. The page has to say which of those the company is, or the enquiry queue fills with the wrong requests.',
      digitalMarketSpecifics:
        'Engineers search a device class, a component, or a process. Procurement may search contract manufacturing or OEM production. Patients search symptoms. Only the first two belong here.\n\nA distributor page and a factory page should not share a title. If the company only builds components, do not title the site as if it sells finished diagnostic systems.',
      competitiveFactors:
        'The differences a buyer can check are the product families, the processes in house, the documents available on request, and the commercial role. Superlatives about safety or innovation are not a substitute.\n\nDo not compete by implying a clearance, a notified-body certificate, or a hospital reference the company has not published.',
      leadGenerationChallenges:
        'A short contact form cannot carry a device brief. The useful lead names the category, the application, the program stage, and whether a drawing exists. Unqualified healthcare questions should be declined in the page copy, not sorted later by a salesperson.\n\nLong qualification cycles mean a download is not a purchase. Count specification requests, not imagined revenue.',
      searchBehavior:
        'Qualified visitors look for medical device manufacturing, medical equipment manufacturing, instrument production, diagnostic equipment, and contract or OEM device work. They also search a component and a material.\n\nThey do not need treatment advice. Keep disease, symptom, and therapy language off the page.',
      seoStrategy:
        'Build pages around the device families and the commercial role you actually sell: finished device, equipment, instrument, component, or contract manufacturing. Link process detail to <a href="/industrial/cnc-precision-machining">CNC and precision machining</a> or <a href="/industrial/metal-fabrication">metal fabrication</a> when the visitor needs that shop explanation.\n\nDo not create a page for every unapproved indication. Depth on the families you manufacture is the useful strategy. The parent page stays the broad map.',
      aiSearchStrategy:
        'State what a medical device manufacturer produces, how that differs from a distributor or a hospital, and which quality topics are buyer questions rather than claims. Name ISO 13485 as a quality-management standard people ask about, and state that a standard is not a product authorization.\n\nAssistants invent clearances when a page is vague. Specific scope reduces that risk. It does not guarantee a citation in Google, ChatGPT, Gemini, or Perplexity.',
      keywordAndTopicStructure:
        'Primary topics are medical device manufacturing, medical equipment manufacturing, and medical device contract or OEM manufacturing. Secondary topics are instruments, diagnostic equipment, device components, and the processes used to make them.\n\nLong-tail pages should follow a real family, such as an instrument class or a component process, not a symptom. Keep precision-program language on the precision technology page so the two URLs do not compete.',
      authorityAndVisibility:
        'The public record is the product scope, the process list, and the document request. Do not invent studies, clinical results, hospital logos, or registration numbers.\n\nConsistent names for the same device family help both buyers and retrieval systems. A new adjective every quarter does not.',
      contentStrategy:
        'Explain the product family, the commercial role, the processes in house, and how a qualified buyer asks for drawings review or quality documents. That is the content this audience needs.\n\nDo not write as a clinician or a regulator. Marketing copy does not replace a design history file, a risk file, or a validation record.',
      technicalContent:
        'Technical pages can cover materials, public dimensional themes, finishing, and assembly level without publishing a confidential drawing. Where a number is controlled, say how an approved buyer requests it.\n\nDesign controls, verification, and process validation are industry subjects. Describe them as questions in a supplier review. Do not claim that a process on this website has been validated.',
      productAndApplicationContent:
        'Give each real family its own explanation: diagnostic equipment is not a surgical instrument, and a component is not a finished device. State the intended use you will discuss and the uses you will not quote.\n\nAssemblies that combine mechanical and electrical work can point to <a href="/industrial/assembly-integration">assembly and integration</a> when that is the manufacturing step, not the clinical claim.',
      expertiseContent:
        'Show how an enquiry is checked against product scope and documentation, not against a slogan. A reviewer should be able to see whether the next step is a drawing, a quality questionnaire, or a refusal.\n\nThere is no published medical-device factory case on this site. Do not borrow one from another industry.',
      contentFormats:
        'Family pages, a short quality-topic note, and a document-request path fit this buyer. White papers help when they explain a purchasing question, such as what a contract manufacturer should publish before an audit.\n\nPatient stories, treatment guides, and certificate badges without a source do not fit.',
      buyerJourney:
        'An engineer checks whether the plant builds that class of product. Quality asks which records can be requested. Procurement quotes an accepted scope. The website is for the first two steps and for a clean handoff.\n\nA form submission is not a supplier approval and not a market authorization.',
      salesCycleCharacteristics:
        'Device programs move through design review, supplier questions, samples or pilots, and change control. The cycle is long because the documents are part of the product.\n\nDo not describe a marketing engagement as a regulatory submission. The commercial offer on this website is manufacturing marketing, not a clearance service.',
      buyerQuestionsByStage:
        'Early questions are category, intended use, and process. Middle questions are materials, inspection, and which documents exist. Later questions are quantity, change control, and how confidential files will be exchanged.\n\nKeep those stages in separate sentences so a casual visitor does not think every question is answered on the public page.',
      trustAndConversionFactors:
        'Trust comes from a narrow product scope and an honest document path. Implying ISO 13485 certification, FDA clearance, or CE marking without a published source removes trust.\n\nThe enquiry should identify a manufacturer asking about marketing, pages, and lead quality. It should not collect patient data.',
      leadNurturingApproach:
        'Follow-up asks which device family, which commercial role, and which document the buyer needs to see. If the request is a clinical outcome or a certificate the plant has not published, say so.\n\nDo not send a general healthcare brochure that restarts the explanation.',
      websiteAndCatalogStrategy:
        'Organize the catalog by device or equipment family and by role: own product, OEM build, or contract manufacturing. Component families should say they are components.\n\nLink shop processes out to machining, fabrication, and finishing pages instead of pasting those entire subjects onto the device page.',
      paidAdvertisingStrategy:
        'Buy terms that match a real family, such as a device class or contract manufacturing for that class. Send the click to that family page.\n\nDo not buy symptom queries, hospital-supply queries, or certification queries the company cannot answer with a document.',
      conversionOptimization:
        'Ask for product category, application, process or component, program stage, and whether a specification is available. Explain that the message starts a marketing conversation about how the manufacturer presents that scope.\n\nLeave room for a file only through the existing enquiry path. Do not add a field for patient history.',
      analyticsAndMeasurement:
        'Count enquiries that name a device family and a commercial role. Separate distributor or clinical traffic from manufacturer traffic if it still arrives.\n\nDo not convert those counts into a claim about regulatory approvals or sales.',
      industryExpertise:
        'The useful expertise is the split between a device manufacturer, a contract manufacturer, a component supplier, and a healthcare provider, plus the rule that quality standards are questions until a document is produced.\n\nThis site does not hold itself out as a certification body or a clinical advisor.',
      relevantExperience:
        'No published case study on this site documents a medical-device factory. Aleks SF builds jewelry-store equipment. That work stays on the parent page as specialized equipment, and it is not evidence of device manufacturing.\n\nDo not relabel a retail-fixture project as a medical program.',
      industryProofPoints:
        'No device client, clearance, clinical result, or quality-system certificate is claimed here. The proof offered on the page is a precise scope and a document request, not a borrowed project.\n\nAdjacent industrial pages can explain machining or fabrication. They are not medical evidence.',
    },
    faq: [
      {
        question: 'What is medical device manufacturing?',
        answer:
          'It is the production of medical devices, medical equipment, instruments, diagnostic or laboratory systems, or the components and assemblies used in them. The page is about factories and B2B buyers. It is not about treating patients or selling to a clinic from a retail counter.',
      },
      {
        question: 'How is a device manufacturer different from a distributor?',
        answer:
          'A manufacturer builds the device, the equipment, or the component. A distributor buys finished goods and resells them. Hospitals and clinics use products. They do not belong in the same description as the plant. The website should say which role the company actually performs.',
      },
      {
        question: 'Which processes are used to make medical devices?',
        answer:
          'Machining, sheet metal work, molding, assembly, electronic build, finishing, inspection, and packaging can all appear, but only the routes that match the device and the plant. A surgical instrument and a diagnostic housing do not share one process list. Name the routes in house and link machining or forming pages when the reader needs that detail.',
      },
      {
        question: 'What should an OEM buyer review before choosing a contract manufacturer?',
        answer:
          'Review the product class the plant will quote, the processes it runs, the materials it will discuss, and which quality documents a qualified buyer can request. Also confirm whether the offer is contract manufacturing, an OEM build of the customer design, or a finished device the plant owns. A homepage slogan does not answer that.',
      },
      {
        question: 'Why do quality systems matter, and what does ISO 13485 not do?',
        answer:
          'Device production is reviewed against a quality system, design records, and supplier controls because the product has an intended use. ISO 13485 is a quality-management standard buyers ask about. It is not, by itself, a product clearance, an FDA authorization, or a CE mark. Do not claim a certificate that is not published.',
      },
      {
        question: 'What documents may be requested when a supplier is qualified?',
        answer:
          'Buyers may ask about design controls, risk-management records, traceability, validation and verification, change control, and supplier qualification. The public page should say how a qualified buyer requests that material. It should not paste controlled records or invent a batch history.',
      },
      {
        question: 'How can a plant show capability without publishing a confidential design?',
        answer:
          'Publish the device family, the commercial role, the processes, and the materials at a level that is already public. State that drawings move through a controlled exchange. Do not put a customer design, a tolerance that is not public, or a branded clinical claim on the open page.',
      },
      {
        question: 'How should OEM, contract, and finished-device offers be separated?',
        answer:
          'Give each role its own explanation and its own enquiry context. A contract manufacturer building a customer device is not the same offer as a company selling its own equipment. Mixing them creates enquiries the plant cannot quote.',
      },
      {
        question: 'Which search topics fit a medical device manufacturer?',
        answer:
          'Device manufacturing, equipment manufacturing, instruments, diagnostic equipment, components, and contract or OEM production fit when they match real work. Symptom, treatment, and clinic-location queries do not. Precision-component programs that are not device work belong on the precision technology page.',
      },
      {
        question: 'Can clearer pages guarantee a ranking or an AI citation?',
        answer:
          'No. Clear scope helps a buyer and reduces the chance that an assistant invents a clearance. It does not guarantee a position in Google or a citation in ChatGPT, Gemini, or Perplexity.',
      },
    ],
    ctaTitle: 'Discuss device pages and document-request enquiries',
    ctaDescription: cta('medical device manufacturing'),
  },
  {
    slug: 'precision-technology-manufacturing',
    title: 'Precision Technology Manufacturing',
    h1: 'How Precision Plants Explain Components, Programs, and Inspection',
    preview:
      'Program pages for precision component and assembly manufacturers, written around engineering scope rather than a machining-process catalog.',
    metaTitle: 'How Precision Manufacturers Explain Engineering Scope',
    metaDescription:
      'How precision manufacturers present engineered components, inspection questions, and OEM programs without copying a CNC page or inventing a tolerance.',
    image: 'ind-precision-technology-manufacturing.jpg',
    alt: 'A measuring machine probing a machined aluminum part beside gauges and component trays',
    displayOrder: 2,
    services: ['product-capability-pages', 'engineering-articles-guides', 'industrial-seo'],
    posts: [
      'ai-search-optimization-for-manufacturers',
      'manufacturing-seo-strategy-complex-industrial-products',
    ],
    cases: [],
    fields: {
      industryOverview:
        'Precision technology manufacturing is the business of high-precision components, engineered assemblies, and specialized OEM programs where the buying decision depends on accuracy, repeatability, and inspection. It is broader than a list of machine tools. This page sits under <a href="/industrial/medical-specialized-manufacturing">medical, precision, and specialized manufacturing</a>.\n\n<a href="/industrial/cnc-precision-machining">CNC and precision machining</a> remains the page for machining processes, equipment, and shop capability. Use that URL when the question is how a part is cut. Use this URL when the question is the engineering program, the product, and how a buyer qualifies the manufacturer.',
      manufacturingProcesses:
        'A precision program may include design review, machining, fabrication, finishing, assembly, and inspection. The public page should name which of those the company sells as a program. Cutting detail stays on the machining page. Formed parts stay with <a href="/industrial/sheet-metal-metal-forming">sheet metal and metal forming</a> when forming is the route. Joined structures stay with <a href="/industrial/metal-fabrication">metal fabrication</a> when that is the offer.\n\nDo not paste a machine list here and call it a precision-technology page. Buyers who need the process explanation should be sent to the process page.',
      productsAndApplications:
        'Typical offers include precision mechanical components, high-tolerance parts, engineered OEM parts, small assemblies, and housings. Medical, electronic, and industrial uses are applications only when the plant actually supplies them. A component used in a device is not itself a claim of device manufacturing. That scope belongs on <a href="/industrial/medical-device-manufacturing">medical device manufacturing</a>.\n\n<a href="/industrial/oem-component-manufacturing">OEM component manufacturing</a> covers the commercial pattern of building to a customer design. This page adds the precision and engineering program around that pattern. Do not publish both as the same paragraph.',
      materialsAndTechnologies:
        'Programs commonly discuss stainless steel, carbon and alloy steels, aluminum, copper alloys, and engineering plastics. The right material depends on strength, temperature, chemical exposure, and the dimension the drawing controls. Say which families the plant will quote. Do not publish a property number that is not on a datasheet you can share.\n\nDesign for manufacturing and CAD review are part of the engineering conversation. They are not a promise that every print can be made at any tolerance.',
      targetMarkets:
        'The buyers are OEMs and engineering-led manufacturers in technical markets. A market is real only when the plant has a product family for it. Listing medical, aerospace, and electronics together, without a family for each, creates the wrong enquiries.\n\nSpecialized production that is not a precision program, such as retail fixtures, does not belong in this catalog.',
      buyerTypes:
        'Engineering directors and mechanical designers ask whether the plant can hold the drawing intent. Manufacturing engineers ask about process route and repeatability. Quality asks how parts are inspected. Technical procurement asks what must be on the table before a quote.\n\nR&D and project managers often start with a prototype. The page should say whether prototype work and production work are both offered, and that they are not the same enquiry.',
      decisionMakers:
        'A precision supplier is rarely chosen from a brochure. Design, quality, and sourcing each hold a veto. The site should give each group a stable place to check scope, inspection approach, and how a drawing is exchanged.\n\nInternational OEM teams also need a clear statement of what will not be published on the open web.',
      buyerRequirements:
        'A usable enquiry names the component or assembly, the material if known, whether a drawing exists, the application, the stage (prototype or production), and the quantity if known. Tolerances belong in the enquiry only when the buyer already has them.\n\nConfidential drawings should not be pasted into a public form. Say that files move through the existing controlled enquiry path.',
      purchasingFactors:
        'Buyers compare drawing discipline, materials, inspection evidence, repeatability from prototype to production, and how engineering changes are handled. A photo of a measuring machine is not a capability statement unless the plant will discuss that inspection method.\n\nPrice without a defined tolerance and quantity is not a complete comparison.',
      marketingChallenges:
        'Precision work is difficult to show because the advantage sits in a drawing the company cannot post. Pages that only say high precision leave the buyer with nothing to qualify.\n\nThe other failure is copying the CNC page and changing the title. Process capability and program capability answer different searches.',
      digitalMarketSpecifics:
        'Searches split between precision components, precision engineering, OEM programs, and machining services. The machining service query belongs on the CNC page. The program and product query belongs here.\n\nLow-volume prototype searches and production-volume searches should not share one vague landing line.',
      competitiveFactors:
        'The differences a buyer can check are the product families, the engineering support, the inspection methods the plant will describe, and the boundary with ordinary component work. Invented tolerance bands and unnamed certifications are not differences.\n\nFinish and coating, when they are a separate process, belong with <a href="/industrial/surface-finishing-coatings">surface finishing and coatings</a>.',
      leadGenerationChallenges:
        'Drawings arrive late, quantities are uncertain, and several engineers must agree. A form that asks only for a name produces a call with no part to discuss.\n\nSeparate prototype leads from production leads so sales does not quote a process the plant has not been asked to repeat.',
      searchBehavior:
        'Engineers search precision components, high-tolerance parts, precision assemblies, and OEM precision manufacturing. Some add a material or an industry. Procurement may search a supplier for a drawing package.\n\nQueries that name a machine type or a cutting process should be answered on the machining page and linked, not repeated as a second thin article.',
      seoStrategy:
        'Keep one strong page for the precision program, then supporting pages only for real product families. Link process intent to <a href="/industrial/cnc-precision-machining">CNC and precision machining</a>. Link multi-part builds to <a href="/industrial/assembly-integration">assembly and integration</a> when assembly is part of the offer.\n\nDo not target the same machining head terms as the CNC page. The parent industry page remains the broad specialized-manufacturing map.',
      aiSearchStrategy:
        'Define precision technology manufacturing as engineered components and programs judged on accuracy, repeatability, and inspection. State how that differs from a general machining service and from a medical-device factory.\n\nAnswer what a buyer should send with an enquiry. Do not invent a tolerance, a CMM accuracy, or a customer result. Clear definitions help retrieval. They do not guarantee a citation.',
      keywordAndTopicStructure:
        'Primary topics are precision technology manufacturing, precision component manufacturing, and precision OEM programs. Supporting topics are tolerances, GD&T, inspection, prototype versus production, and materials.\n\nProcess terms such as milling and turning stay secondary and should point to the CNC page. Device-regulatory terms stay on the medical device page.',
      authorityAndVisibility:
        'Authority here is consistent product language and a visible rule for what is public versus what is on the drawing. Do not invent customer names, CpK figures, or equipment brands.\n\nA measuring photograph illustrates inspection. It is not a published accuracy specification.',
      contentStrategy:
        'Explain the component families, the engineering conversation, and how inspection is discussed. Publish the questions a buyer should answer before expecting a quote.\n\nDo not publish customer drawings, closed tolerance tables, or a machine inventory you will not keep current.',
      technicalContent:
        'Technical notes can explain GD&T as the drawing language for form and position, and metrology as the set of measurements used to check a part. Name methods the plant will actually discuss, such as a CMM or a surface measurement, without stating an accuracy figure that is not documented.\n\nFirst-article inspection and engineering change control are buyer questions. Describe the question. Do not claim a specific report format you have not published.',
      productAndApplicationContent:
        'Group products by what is sold: a precision part, a housing, or an assembly. An application note should name the buyer type and the requirement, not a list of every industry that uses metal.\n\nCustom work that is not a precision program belongs with <a href="/industrial/custom-industrial-manufacturing">custom industrial manufacturing</a>.',
      expertiseContent:
        'Show how a drawing is screened against the processes and inspection the plant will discuss. That screening is the expertise. A gallery of small metal parts is not.\n\nNo published case on this site is a precision-component program. Do not convert another industry’s project into one.',
      contentFormats:
        'A program page, family pages, and a short note on what to send with a drawing fit. Engineering articles help when they explain GD&T or inspection in buyer language.\n\nA copied CNC capability table does not. Send that reader to the machining page.',
      buyerJourney:
        'A designer checks whether the plant takes that class of part. Quality asks how conformance is shown. Procurement asks about stage and quantity. The site supports that sequence and the file exchange.\n\nApproval of a prototype is not approval of a production price or a production process.',
      salesCycleCharacteristics:
        'Engineering review, a sample, and a production decision can take months. The website should make the stage obvious so a prototype click is not reported as a production order.\n\nInternational buyers add document language and shipping questions. Those are commercial details, not a reason to invent a certification.',
      buyerQuestionsByStage:
        'Early questions are part type, material, and whether a drawing exists. Middle questions are tolerances, inspection method, and finish. Later questions are quantity, engineering changes, and how files are transferred.\n\nIf a tolerance is unknown, the honest next step is to request the drawing, not to publish a number.',
      trustAndConversionFactors:
        'Trust comes from a clear boundary with machining-process pages, a stated inspection conversation, and a secure path for drawings. Unsourced tolerance claims do the opposite.\n\nThe conversion is a manufacturer asking for help presenting that program, or a buyer sending a real part enquiry through the existing form.',
      leadNurturingApproach:
        'Follow-up asks for the drawing status, the stage, and the family. If the visitor wanted machine-tool specifications, send them to the CNC page instead of stretching this one.\n\nDo not nurture a lead with a generic precision slogan.',
      websiteAndCatalogStrategy:
        'Catalog by component family and by program type: prototype, production, or assembly. Keep machining parameters on the CNC page and link to them.\n\nHousings, mechanical parts, and assemblies should not share one grid with no distinction.',
      paidAdvertisingStrategy:
        'Buy precision-component and OEM-program terms that match a family you sell. Send machining-service terms to the CNC page if you also cover that process in the campaign.\n\nDo not buy medical-device clearance terms from this URL.',
      conversionOptimization:
        'Ask for component or assembly type, material, drawing availability, application, stage, and quantity. State that confidential files use the existing enquiry path rather than a public page.\n\nDo not add a dozen tolerance fields the buyer may not know yet.',
      analyticsAndMeasurement:
        'Count enquiries that include a part type and a stage. Track how often visitors leave for the CNC page. That split shows whether the two URLs are doing different jobs.\n\nDo not turn those counts into a yield or a tolerance claim.',
      industryExpertise:
        'The expertise is knowing when a buyer needs a precision program page and when they need a machining-process page, and refusing to invent inspection capability.\n\nDevice regulatory topics are out of scope here even if a component later goes into a device.',
      relevantExperience:
        'No published case study documents a precision-component or metrology program. Aleks SF manufactures jewelry-store equipment and is kept on the parent page for that reason. It is not a precision-technology project and it is not a medical project.\n\nOther industrial sites are not relabeled as precision programs.',
      industryProofPoints:
        'No tolerance, CMM accuracy, certificate, or customer result is invented on this page. The public proof is the distinction from CNC machining and from device manufacturing, plus a drawing-led enquiry.\n\nIf a future case is a real precision program, it can be linked then. It is not linked now.',
    },
    faq: [
      {
        question: 'What is precision technology manufacturing?',
        answer:
          'It is specialized production of precise components, assemblies, and OEM programs where buyers select a supplier for accuracy, repeatability, and inspection. It describes the engineering and manufacturing offer. It is not a catalog of machine tools and it is not a medical-device factory.',
      },
      {
        question: 'How is this different from CNC and precision machining?',
        answer:
          'CNC and precision machining explains cutting processes, machines, materials, and shop capability. This page explains the broader program: engineered parts, drawings, tolerances, inspection, and prototype versus production. When the reader needs the cutting process, the machining page is the right destination.',
      },
      {
        question: 'Which industries buy precision components?',
        answer:
          'Technical OEMs in industrial, electronic, medical, and other engineered markets can be buyers, but only when the plant actually supplies that market. A public page should name the families it will quote. A list of prestigious industries without a product is not a market.',
      },
      {
        question: 'Why do dimensional tolerances matter on a supplier page?',
        answer:
          'Tolerances tell a buyer whether the drawing and the process are in the same conversation. The public page should say that the plant reviews tolerances from the drawing. It should not invent a tolerance band, a surface-roughness number, or a capability index.',
      },
      {
        question: 'What is GD&T and why does it matter?',
        answer:
          'Geometric dimensioning and tolerancing is the drawing language for form, orientation, and location, not only a plus-or-minus size. Buyers use it to describe what must be true for the part to assemble. A manufacturer can say it reads GD&T. That sentence is not a claim about a specific datum scheme.',
      },
      {
        question: 'How do OEM buyers evaluate a precision manufacturer?',
        answer:
          'They look for the part families, the materials, how drawings are reviewed, how inspection is discussed, and whether prototype and production are both real offers. They also check that confidential files are not required on the public website. A gallery without that information does not finish the evaluation.',
      },
      {
        question: 'What should a precision manufacturer publish if drawings are confidential?',
        answer:
          'Publish the component families, the materials, the engineering steps, and the rule for sending a drawing. Leave customer prints, closed dimensions, and unpublished inspection reports off the page. Tell the reader which secure path to use.',
      },
      {
        question: 'What is the role of metrology and inspection?',
        answer:
          'Inspection shows whether a part matches the drawing. A CMM, a gauge, or a surface check can be part of that conversation when the plant actually uses it. Naming the method is enough in public. An accuracy figure belongs in a document, not in a slogan.',
      },
      {
        question: 'How should prototype and production enquiries be separated?',
        answer:
          'A prototype proves a design can be made once or in a small run. Production asks whether that result can be repeated at a quantity. The page and the form should ask which stage the buyer means so the quote matches the work.',
      },
      {
        question: 'Can AI search guarantee that buyers will find a precision supplier?',
        answer:
          'No. Direct definitions of the program, the difference from machining services, and the enquiry requirements make the page easier to interpret. They do not guarantee placement in Google or a citation by ChatGPT, Gemini, or Perplexity.',
      },
    ],
    ctaTitle: 'Discuss precision program pages and drawing-led enquiries',
    ctaDescription: cta('precision technology manufacturing'),
  },
]
