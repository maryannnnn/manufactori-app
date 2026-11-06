import { CHEMICAL_FIELD_KEYS } from './chemicalSpecializationTypes'
import type { ChemicalSpecializationCopy } from './chemicalSpecializationTypes'

export type EngineeringSpecializationCopy = ChemicalSpecializationCopy
export const ENGINEERING_FIELD_KEYS = CHEMICAL_FIELD_KEYS

const cta = (subject: string) =>
  `Tell us what you sell in ${subject} and which buyers should be able to judge the scope. The first conversation is about the problem, the deliverable, and the enquiry path, not a promised ranking, approval, or project award.`

export const PARENT_FIELD_UPDATES: Record<string, string> = {
  industryOverview:
    'Engineering and technical service firms sell a scope: design, calculation, test, or a defined field service. The expanded explanation lives on <a href="/industrial/specialized-engineering-technical-services">specialized engineering and technical services</a>. The website fails when it looks like a product catalog with no deliverable.',
  seoStrategy:
    'One page per service line, with the deliverable and the exclusion. This parent page stays the broad map. The specialist page is <a href="/industrial/specialized-engineering-technical-services">specialized engineering and technical services</a>. Do not create a page for a discipline you do not practice.',
  websiteAndCatalogStrategy:
    'Structure the site as service lines. Hardware, if any, is a separate branch with its own enquiry. Keep the longer specialist explanation on <a href="/industrial/specialized-engineering-technical-services">specialized engineering and technical services</a> rather than repeating it here.',
  expertiseContent:
    'Show how a problem is framed into a scope. Limit the claim to disciplines the published record supports. The worked example of that framing is on <a href="/industrial/specialized-engineering-technical-services">specialized engineering and technical services</a>.',
}

export const ENGINEERING_SPECIALIZATIONS: EngineeringSpecializationCopy[] = [
  {
    slug: 'specialized-engineering-technical-services',
    title: 'Specialized Engineering & Technical Services',
    h1: 'How Engineering Firms Present Scopes, Inputs, and Deliverables',
    preview:
      'Service-line pages for firms that sell design, calculation, testing, or field engineering, kept separate from a product catalog.',
    metaTitle: 'How Engineering Firms Explain Scope and Deliverables',
    metaDescription:
      'How engineering service firms explain a problem, the client inputs, and the deliverable without turning a design or a test into a product catalog.',
    image: 'ind-specialized-engineering-technical-services.jpg',
    alt: 'A CAD model of a metal housing beside the matching prototype, drawings, and a caliper',
    displayOrder: 1,
    services: [
      'engineering-articles-guides',
      'technical-content-strategy',
      'seo-ai-search-optimization',
      'technical-white-papers',
      'industrial-website-design',
    ],
    posts: [
      'ai-search-optimization-for-manufacturers',
      'manufacturing-seo-strategy-complex-industrial-products',
      'technical-content-marketing-manufacturers',
    ],
    cases: [
      {
        slug: 'vimpel-engineering-anechoic-chambers',
        relevance: 'direct',
        note: 'Published specialist engineering for anechoic chambers and electromagnetic absorbing solutions. The case is that scope and the digital work around it. It is not proof of every testing discipline, and it is not a claim that the agency performed the chamber engineering.',
      },
      {
        slug: 'ovik-montag-hvac-engineering-seo',
        relevance: 'related_manufacturing',
        note: 'Related HVAC engineering and installation experience. Ovik Montag is a building-services contractor, not a general consultancy and not an equipment manufacturer.',
      },
    ],
    fields: {
      industryOverview:
        'Engineering and technical services, on this page, means a firm sells a defined technical scope and a deliverable. That deliverable may be a drawing set, a calculation, a feasibility report, a test setup, a design, or supervised field work. It is not a catalog of machines the firm happens to mention.\n\nThis page sits under <a href="/industrial/engineering-technical-services">engineering and technical services</a>. Companies that primarily ship equipment belong on manufacturing pages such as <a href="/industrial/industrial-machinery-equipment">industrial machinery and equipment</a>. If a firm both designs and builds, the hardware needs its own statement.',
      manufacturingProcesses:
        'The work is staged as consulting, concept, detailed engineering, and implementation. Those are different contracts. Consulting frames the problem. Concept proposes an approach. Detailed engineering produces the documents a builder can use. Implementation may include supervision, installation engineering, or commissioning support.\n\nSome firms also fabricate a chamber, a duct, or a test article. Say when the hardware is in scope. Do not describe a drawing as if it were a production line, and do not describe a factory as if the only offer were advice.',
      productsAndApplications:
        'Buyers purchase a deliverable, not a slogan about expertise. Typical artifacts include drawings, CAD models, specifications, calculations, feasibility reports, test reports, inspection notes, and commissioning records. For each one, the page should say the problem it addresses, the inputs the client must provide, the work performed, the artifact produced, and what is excluded unless added later.\n\nA sample outline of a report is useful. A fabricated client report is not. Do not imply that every firm on this page produces every artifact.',
      materialsAndTechnologies:
        'Methods that change the engagement belong in public: the discipline, the calculation type, the model the client must supply, and the review points. A wall of software logos does not explain the work.\n\nDesign for manufacturing is a conversation with a plant about a drawing and a process. When the output is a part the factory will make, send that product path to <a href="/industrial/oem-component-manufacturing">OEM component manufacturing</a>. The engineering page keeps the scope of the design work.',
      targetMarkets:
        'Industrial plants, machinery OEMs, building projects, laboratories, and electronics facilities brief engineers differently. Name the markets where the firm has a real scope. Do not list every sector to look broader.\n\nHVAC engineering for buildings is not the same market as machinery design. Equipment makers for climate systems live on <a href="/industrial/hvac-climate-equipment">HVAC and climate equipment</a>. A contractor who designs and installs is not that manufacturer.',
      buyerTypes:
        'Engineering directors, chief engineers, and discipline leads judge whether the scope matches the problem. Project managers ask about stages and client inputs. Procurement asks what the proposal will contain. Facility and plant managers often start from a site issue rather than a discipline name.\n\nA page written only as a capability list fails the person who must compare deliverables.',
      decisionMakers:
        'Technical fit usually comes before a commercial award. Reviewers look for a similar scope, a named deliverable, the assumptions, and the boundary of responsibility. Years in business and a claim of innovation are weak substitutes.\n\nConfidential project details can stay off the site. The public page still has to show the shape of an engagement.',
      buyerRequirements:
        'A useful enquiry names the industry or project type, the discipline, the problem, the site or equipment involved, the deliverable expected, the stage, and the timing. Drawings and models should move through a controlled exchange, not a public upload of a confidential file.\n\nCompany name and a contact are enough to start. They are not a scope.',
      purchasingFactors:
        'Proposals are compared on scope, assumptions, exclusions, required inputs, review stages, and how revisions are handled. Site access and coordination matter when the work is in the field.\n\nThe website should let a buyer see that structure before asking for a fee. It should not promise compliance, savings, or a finished approval.',
      marketingChallenges:
        'Engineering sites list disciplines and never show what the client receives. Phrases such as innovative engineering solutions hide the scope. Several disciplines under one firm then look like one undifferentiated offer.\n\nIndustrial, construction, and laboratory buyers do not search the same way. A single homepage cannot carry all three without saying which deliverable belongs to which.',
      digitalMarketSpecifics:
        'Commercial queries ask for a design service, a calculation, a test environment, or an HVAC engineering contractor. Job, degree, and software-tutorial queries are a different audience and should not be the landing page.\n\nBuyers also search the problem, not the firm. The page has to name problems the firm will actually scope.',
      competitiveFactors:
        'Checkable differences are the disciplines practiced, the deliverables, the inputs required, and the published project types. A longer list of sectors is not a difference.\n\nSpecialist testing is not interchangeable with structural calculation or with HVAC design. Keep those sentences apart.',
      leadGenerationChallenges:
        'Enquiries that say we need engineering waste senior time. The form should ask for the problem, the expected deliverable, and the stage.\n\nA contact is not a signed scope, and a download is not a booked project.',
      searchBehavior:
        'Qualified visitors search engineering services, a discipline, a deliverable, or a facility type such as an anechoic chamber or an industrial HVAC design. They are not searching for coursework.\n\nManufacturer queries belong on the equipment pages. Send them there instead of answering them with a service slogan.',
      seoStrategy:
        'Keep this URL as the sector page for firms that sell engineering work. Give each real service line its own page when the deliverable is distinct: a design package, a calculation, a test facility, or field supervision. Do not publish a page for a discipline the firm does not practice.\n\nDo not compete with machinery, electronics, or precision-component pages for product intent. Link those readers across.',
      aiSearchStrategy:
        'Define the firm as a seller of scopes and deliverables, and state how that differs from a manufacturer and from an equipment distributor. Name the artifact and the inputs. State limits.\n\nAssistants invent licenses and test results when the page is vague. Specific scope reduces that risk. It does not guarantee a citation in Google, ChatGPT, Gemini, or Perplexity.',
      keywordAndTopicStructure:
        'Primary topics are engineering and technical services, engineering design, and engineering consulting as a commercial offer. Secondary topics follow real lines: calculations, testing environments, HVAC engineering, and field engineering.\n\nDo not force every discipline phrase onto this one page. A line the firm does not sell should not be a heading.',
      authorityAndVisibility:
        'Authority is a named scope plus a published project that matches it. Vimpel Engineering is the published anechoic-chamber example. Ovik Montag is the published HVAC contractor example. Neither one authorizes a claim about every other discipline.\n\nDo not add offices, license numbers, project counts, or papers that are not in the record.',
      contentStrategy:
        'Each service line should answer five things: the problem, the client inputs, the work, the deliverable, and the exclusion. That outline is the content strategy.\n\nGuides and checklists help a buyer prepare the inputs. They should not disclose a confidential client model.',
      technicalContent:
        'Technical pages can explain a method at the level a buyer needs in order to see fit: what a calculation covers, what a design review checks, what a test setup is for. Detailed client data stays off the page.\n\nMeasurement and instrumentation, when the product is hardware rather than the engineering service, belong with <a href="/industrial/industrial-sensors-instrumentation">industrial sensors and instrumentation</a>.',
      productAndApplicationContent:
        'Organize by discipline only when the deliverable changes. An industry page is justified when the inputs and the exclusions change, for example a laboratory test environment versus a building HVAC design. A thin copy of the same scope under ten industry names is not justified.\n\nAutomation design that specifies controls can point to <a href="/industrial/industrial-automation-robotics">industrial automation and robotics</a> for the equipment context, while this page keeps the engineering scope.',
      expertiseContent:
        'Show how a problem becomes a scope: what is in, what is out, and what the client must send. Limit the example to disciplines the published work supports.\n\nVimpel is anechoic-chamber engineering and absorbing solutions, not a general test laboratory. Ovik is HVAC engineering and installation, not a consultancy for every building discipline.',
      contentFormats:
        'Service-line pages, a deliverable outline, a short exclusion list, and a project note fit. White papers help when they explain how to brief an engineer.\n\nA grid of software logos does not. A product catalog template does not, unless hardware is actually delivered.',
      buyerJourney:
        'A client names a problem, checks whether the scope matches, reads what they must provide, and requests a discussion. The proposal and the reviews happen after that.\n\nThe site supports the match. It does not sign the scope.',
      salesCycleCharacteristics:
        'Engineering sales run through missing data, a proposal, revisions, and sometimes site access. That is longer than a parts order.\n\nDo not describe the first email as a booked project or as evidence of compliance.',
      buyerQuestionsByStage:
        'Early questions ask what is delivered and which disciplines are real. Middle questions ask for inputs, assumptions, and exclusions. Later questions ask about review points, revisions, and how confidential files move.\n\nAnswer the stage the buyer is in. Do not dump every discipline into the first paragraph.',
      trustAndConversionFactors:
        'Trust comes from a boundary. Name the deliverable and the work you will not do. The two published cases are boundaries of that kind: chambers for Vimpel, HVAC contracting for Ovik.\n\nThe call to action should invite a scope conversation. It should not promise a result, an approval, or a saving.',
      leadNurturingApproach:
        'Follow-up asks for the missing problem, the expected artifact, and the stage. If the request is a product the firm does not engineer, point to the manufacturing page that fits.\n\nDo not resend a brochure that lists every discipline again.',
      websiteAndCatalogStrategy:
        'Build the site as service lines, each with inputs, stages, deliverables, and exclusions. Add an industry or application page only when the scope actually changes.\n\nIf the firm also builds hardware, give that hardware its own branch. Precision parts and custom builds belong with <a href="/industrial/precision-technology-manufacturing">precision technology manufacturing</a> or <a href="/industrial/custom-industrial-manufacturing">custom industrial manufacturing</a>, not inside a consulting paragraph.',
      paidAdvertisingStrategy:
        'Buy problem and deliverable terms that match a real line, and open that line. Do not buy engineering jobs, degrees, or generic innovation terms.\n\nHVAC contractor terms and anechoic-chamber terms should not share one ad group unless the firm truly sells both.',
      conversionOptimization:
        'Ask for project type, discipline, problem, expected deliverable, stage, and timing. Say that drawings move through a secure path after the fit is clear.\n\nDo not require a confidential model on the first public form.',
      analyticsAndMeasurement:
        'Count enquiries that name a discipline and a deliverable. Separate product-manufacturing traffic from service traffic.\n\nDo not convert those counts into booked hours or awarded projects.',
      industryExpertise:
        'The useful expertise is the split between a service scope and a shipped product, and between consulting, detailed design, testing, and field work.\n\nThis website does not claim to perform the engineering. The published record is how those firms were presented online.',
      relevantExperience:
        'Vimpel Engineering is direct experience for anechoic-chamber engineering and electromagnetic absorbing solutions, including the market and website work around that offer. It is not a credential for structural, process, or medical engineering.\n\nOvik Montag is related experience for HVAC engineering and installation on building projects, including component production where that case states it. It is not a general consultancy and not an equipment brand.',
      industryProofPoints:
        'Those two records are the proof on this page. No extra clients, licenses, accreditations, measurement accuracies, or project counts are added.\n\nElectronics manufacturing context, when a reader needs the product rather than the engineering service, stays on <a href="/industrial/electrical-electronics-manufacturing">electrical and electronics manufacturing</a>.',
    },
    faq: [
      {
        question: 'What are engineering and technical services?',
        answer:
          'They are paid technical scopes whose output is a defined deliverable: a design, a calculation, a report, a test setup, or supervised field work. The buyer is hiring that scope. A company that mainly ships equipment is a manufacturer and needs a product page instead.',
      },
      {
        question: 'How is engineering consulting different from engineering contracting?',
        answer:
          'Consulting frames a problem, reviews a design, or recommends an approach. Contracting carries a defined package through design, and sometimes through installation or commissioning. The proposal should say which of those is being sold. A firm can do both, but not in one unlabeled sentence.',
      },
      {
        question: 'What deliverables can an engineering firm produce?',
        answer:
          'Common artifacts include drawings, CAD models, specifications, calculations, feasibility reports, test or inspection notes, and commissioning records. A firm should list the ones it actually issues. An outline of a report is fair. A fake client report is not.',
      },
      {
        question: 'How should a firm define its service scope?',
        answer:
          'State the problem, the discipline, the inputs the client must send, the work, the deliverable, and the exclusions. That definition is what procurement and the technical lead both need. A list of disciplines without those boundaries is not a scope.',
      },
      {
        question: 'What should a client send before asking for a proposal?',
        answer:
          'The project type, the problem, the expected deliverable, the stage, and the timing. Drawings or models help once the fit is clear, and they should move through a secure exchange rather than a public form. A request that only says call us about engineering is not ready to price.',
      },
      {
        question: 'How can a buyer evaluate an engineering provider?',
        answer:
          'Check whether the published scope matches the problem, whether a similar project type is documented, and whether inputs, exclusions, and review points are visible. Relevant scope beats a claim about years of experience. Do not treat a logo wall as evidence.',
      },
      {
        question: 'How do design, analysis, and testing differ?',
        answer:
          'Design produces the documents or model used to build or install something. Analysis and calculations check a load, a flow, a thermal case, or a similar question and end in a result with assumptions. Testing uses a setup or a facility and ends in a measurement record. They are different contracts. An anechoic chamber is a testing environment, not a structural calculation.',
      },
      {
        question: 'How should several disciplines appear on one website?',
        answer:
          'Give each discipline its own page when the deliverable changes. A short index can list them. Do not merge HVAC design, machinery engineering, and a test facility into one paragraph. Do not add a page for a discipline the firm does not practice.',
      },
      {
        question: 'Why do separate service-line pages matter?',
        answer:
          'Buyers search a problem and a deliverable. A dedicated page can state inputs and exclusions for that line. An index page cannot. Separate pages also stop a chamber enquiry from being quoted as a building-services job.',
      },
      {
        question: 'How can SEO attract engineering enquiries rather than job seekers?',
        answer:
          'Use commercial language: the service, the deliverable, and the project type. Keep degree, job, and software-tutorial terms off the landing page. Send product searches to the manufacturing page that matches the equipment.',
      },
      {
        question: 'How do technical content and case studies show expertise?',
        answer:
          'A guide can explain how to brief a scope. A case should name the client problem, the work, and the deliverable that is already public. Vimpel is the anechoic-chamber record. Ovik is the HVAC contractor record. Neither one should be stretched into a discipline it does not document.',
      },
      {
        question: 'Can AI search guarantee that a buyer will find an engineering firm?',
        answer:
          'No. Clear roles, named deliverables, and real project limits make the firm easier to interpret and harder to misread as a factory. They do not guarantee a ranking or a citation in ChatGPT, Gemini, or Perplexity.',
      },
    ],
    ctaTitle: 'Discuss scope pages and the first engineering enquiry',
    ctaDescription: cta('engineering and technical services'),
  },
]
