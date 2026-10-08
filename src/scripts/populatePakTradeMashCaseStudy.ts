import 'dotenv/config'
import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'

import { buildCommentTree, measureCommentTree } from '../blocks/CaseStudyCommentsBlock/buildCommentTree'
import { getCaseStudyUrl } from '../utilities/getContentUrls'
import { getTiptapExtensions } from '../utilities/richText/extensions'

/**
 * Creates or updates the PakTradeMash Case Study in the existing architecture.
 * Structural reference: Pnevmomachta / Laser Made (no Azimuth record exists).
 * Re-runnable: structured fields and layout blocks are replaced, not appended.
 *
 * No invented metrics, testimonials, photographs, competitor names, AI rankings
 * or in-house manufacturing claims. No site_categories.
 */
const SLUG = 'paktrademash-packaging-equipment'

const EXPERT = 'Maryan Polyak'
const EXPERT_ROLE = 'Manufacturing Digital Marketing & Web Development Expert'

/** Existing Case Study Category IDs. Primary drives the public URL. */
const PRIMARY_CASE_STUDY_CATEGORY = 196 // manufacturing-seo
const CASE_STUDY_CATEGORIES = [
  196, // Manufacturing SEO
  239, // Manufacturing Website Development
  204, // Industrial SEO
  197, // Application SEO
  218, // Product SEO
  311, // Technical Content Marketing
  669, // Manufacturing
  643, // Packaging Equipment
  786, // Packaging Machinery
  781, // Industrial Packaging
  782, // Industrial Packaging Systems
  548, // Food Packaging Equipment
  549, // Food Processing
  550, // Food Processing Equipment
  843, // Food Manufacturing
  551, // Industrial Food Systems
  636, // Industrial Equipment
  544, // Food & Beverage Manufacturing
]

const rt = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [2, 3, 4] }))
const rtHero = (html: string) =>
  generateJSON(html, getTiptapExtensions({ headingLevels: [1, 2, 3, 4] }))

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const p = (...texts: string[]) => texts.map((text) => `<p>${escapeHtml(text)}</p>`).join('')
const ul = (items: string[]) =>
  `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`

const contentBlock = (html: string) => ({
  blockType: 'csContent' as const,
  columns: [{ size: 'full' as const, richText: rt(html), enableLink: false }],
})

const titleBlock = (title: string) => ({
  blockType: 'csContentTitle' as const,
  case_study_content_title: title,
})

type DiscussionEntry = {
  author: string
  role?: string
  depth?: number
  isExpert?: boolean
  date: string
  body: string
}

const expert = (date: string, body: string, depth: number): DiscussionEntry => ({
  author: EXPERT,
  role: EXPERT_ROLE,
  depth,
  isExpert: true,
  date,
  body,
})

/**
 * 8 top-level branches, mixed shapes, 24 entries, depth capped at 3.
 * Editorial discussion participants - not clients or customers.
 */
const DISCUSSION: DiscussionEntry[] = [
  {
    author: 'Lukas Schneider',
    role: 'Industrial marketing consultant',
    date: '2026-09-08',
    depth: 0,
    body: p(
      'If PakTradeMash already had a website, why was it not enough to tighten titles and metadata on the existing pages? That is the advice most industrial firms get.',
    ),
  },
  expert(
    '2026-09-08',
    p(
      'Because the existing pages could not carry the way buyers actually search. A general corporate site can describe the company. It cannot simultaneously be the page for packaging machinery, a production line, refrigeration equipment and a food-processing application.',
      'The work was to understand that demand first, then expand the information architecture so each intent had a place to land. On-page edits on a structure that is too small just concentrate every query on the same few URLs.',
    ),
    1,
  ),
  {
    author: 'Martin Novak',
    role: 'In-house manufacturing marketer',
    date: '2026-09-09',
    depth: 2,
    body: p(
      'So the homepage was never going to rank for the whole catalogue, even with better copy?',
    ),
  },
  expert(
    '2026-09-09',
    p(
      'Correct. A homepage can introduce the company. The catalogue lives in categories, equipment types and applications. Mapping keywords onto those pages is the difference between a brochure and a discovery platform for industrial buyers.',
    ),
    3,
  ),
  {
    author: 'Thomas Weber',
    role: 'Technical content lead',
    date: '2026-09-10',
    depth: 0,
    body: p(
      'Why spend so much of the project on keyword research for equipment that sales already understands?',
    ),
  },
  expert(
    '2026-09-10',
    p(
      'Sales understands the product. Search shows how a plant engineer or procurement lead names the problem: packaging machine, packaging line, freezing equipment, meat-processing line, vegetable packing. Those are not the same query, and they are not always the language used in a sales brochure.',
      'The semantic core was built so the website could speak in that search language without inventing pages for products the company did not offer.',
    ),
    1,
  ),
  {
    author: 'Jan Kowalski',
    role: 'SEO specialist, industrial accounts',
    date: '2026-09-11',
    depth: 0,
    body: p(
      'How did you keep product, application and industry from collapsing into duplicate pages?',
    ),
  },
  expert(
    '2026-09-11',
    p(
      'By treating them as related layers, not three copies of the same page. Equipment type is one page. The food-processing application is another. The industry context can sit on the application or as a connecting piece. Internal links show the relationship.',
      'A meat-processing buyer and a packaging-line buyer may land on different URLs and still be looking at parts of the same offering. That is mapping, not duplication.',
    ),
    1,
  ),
  {
    author: 'Jan Kowalski',
    role: 'SEO specialist, industrial accounts',
    date: '2026-09-12',
    depth: 2,
    body: p(
      'Did you publish a page for every keyword cluster in the research, including thin ones?',
    ),
  },
  expert(
    '2026-09-12',
    p(
      'No. Research is a map, not a publishing quota. Clusters that matched real equipment, applications or services became structure and content. Clusters that did not match the offering were left alone. Filling the site with unsupported pages would have been the opposite of this project.',
    ),
    3,
  ),
  {
    author: 'Peter Horvat',
    role: 'B2B web architect',
    date: '2026-09-13',
    depth: 0,
    body: p(
      'Packaging and industrial refrigeration are different buying problems. How did one website hold both without becoming a junk drawer?',
    ),
  },
  expert(
    '2026-09-13',
    p(
      'They stayed as separate equipment and application areas, connected where a production process actually uses both. The point of the expanded architecture was to stop forcing unrelated search intents onto one general equipment page.',
      'A visitor looking for freezing equipment should not have to read a generic packaging overview to find it. Category structure is the marketing strategy here, not a visual theme.',
    ),
    1,
  ),
  {
    author: 'Stefan Mueller',
    role: 'Regional industrial sales',
    date: '2026-09-14',
    depth: 0,
    body: p(
      'Some of these buyers want a single machine. Others want a line installed in a plant. Did the SEO treat those as the same commercial intent?',
    ),
  },
  expert(
    '2026-09-14',
    p(
      'No. A search for a packaging machine and a search for a production-line solution are different jobs. The first is often equipment-type intent. The second is closer to integration, installation and a production process.',
      'PakTradeMash worked across supply, installation and implementation. The site had to make those paths visible without claiming that every enquiry was a full turnkey project.',
    ),
    1,
  ),
  {
    author: 'Daniel Rossi',
    role: 'Plant project buyer',
    date: '2026-09-15',
    depth: 2,
    body: p(
      'Would you put installation and service on the product page, or keep them as their own section?',
    ),
  },
  expert(
    '2026-09-15',
    p(
      'Both, with a clear primary. Commercial and service intent needs its own place so it can be found. Product pages should still say that installation and implementation exist, and link there. Hiding service inside a product description is how industrial sites lose that demand.',
    ),
    3,
  ),
  {
    author: 'Daniel Fischer',
    role: 'Head of digital, equipment manufacturing',
    date: '2026-09-16',
    depth: 0,
    body: p(
      'The write-up has no traffic or ranking table. Was the project measured, or is this just architecture theory?',
    ),
  },
  expert(
    '2026-09-16',
    p(
      'The work was practical: research, structure, content, on-page SEO. Verified traffic, ranking and lead figures are not stored in the current project data, so they are not published. I will not fill the gap with a round number.',
      'What can be stated is the output of the work: a broader structure, mapped search demand, and content that matches how industrial buyers look for equipment and applications.',
    ),
    1,
  ),
  {
    author: 'Marek Nowak',
    role: 'Content strategist',
    date: '2026-09-17',
    depth: 2,
    body: p(
      'Older agency write-ups sometimes quote huge keyword lists. Why not reuse those here?',
    ),
  },
  expert(
    '2026-09-17',
    p(
      'Because a historic count that cannot be checked in this project is not a result. The method is what remains: product, category, application, industry, process, commercial intent and informational intent, mapped to pages that deserve them.',
    ),
    3,
  ),
  {
    author: 'Viktor Horvath',
    role: 'Engineering manager, specialty equipment',
    date: '2026-09-18',
    depth: 0,
    body: p(
      'Would you now say this architecture also wins in ChatGPT or AI Overviews?',
    ),
  },
  expert(
    '2026-09-18',
    p(
      'No. This engagement predates that language as a service line, and there is no documented AI-search measurement for PakTradeMash.',
      'A clearer product, application and industry model is useful to any system that has to understand an entity. That is a structural observation. It is not a ranking claim.',
    ),
    1,
  ),
  {
    author: 'Andrei Popescu',
    role: 'Technical editor, industrial media',
    date: '2026-09-19',
    depth: 0,
    body: p(
      'How technical did the new pages need to be? Equipment buyers are not reading blog tips.',
    ),
  },
  expert(
    '2026-09-19',
    p(
      'Technical enough to be useful, not a substitute for a specification sheet that did not exist in the brief. Pages had to explain equipment categories, applications and production context so a searching buyer could recognise the offering and continue toward an enquiry.',
      'The audience is industrial: food production, processing, packaging operations. The copy is for that reader, not for a generic content calendar.',
    ),
    1,
  ),
]

const faqBlock = () => ({
  blockType: 'csFAQ' as const,
  case_study_faq_title: 'Frequently Asked Questions About PakTradeMash',
  items: [
    {
      question: 'What was the main SEO challenge with PakTradeMash?',
      answer: rt(
        p(
          'The company already had a website and an established industrial business. The structure did not fully represent the breadth of equipment, applications and services. The challenge was to understand how industrial buyers searched for packaging, refrigeration, production-line and food-processing solutions, then turn that demand into a logical site architecture rather than chasing traffic on a few general pages.',
        ),
      ),
    },
    {
      question: 'Why was keyword research important for an industrial equipment company?',
      answer: rt(
        p(
          'Buyers rarely search only for the company name. They search for equipment types, production processes and applications: packaging machinery, packaging lines, freezing equipment, food-production equipment. Research showed how those intents were worded so the website could match them with relevant pages instead of one generic corporate description.',
        ),
      ),
    },
    {
      question: 'How did you structure search demand across products and applications?',
      answer: rt(
        p(
          'The semantic core was organised by product, equipment category, application, industry, production process, and commercial versus informational intent. Terms were mapped to the most relevant page type. A packaging-machine query and a meat-processing application query were not forced onto the same URL.',
        ),
      ),
    },
    {
      question: 'Why was it not enough to optimize the existing website pages?',
      answer: rt(
        p(
          'Existing pages can be improved, but they cannot absorb every equipment category and application if the architecture is too small. The project expanded the information architecture so new, relevant pages could exist. SEO here was structural, not only metadata on the original URLs.',
        ),
      ),
    },
    {
      question: 'How can an industrial equipment company use content to reach different customer industries?',
      answer: rt(
        p(
          'By writing to the production problem, not only the product family. Food production, meat processing, vegetable processing and industrial packaging operations describe different jobs. Content that names the application helps a technical buyer recognise the offering. It should still stay within what the company actually supplied and installed.',
        ),
      ),
    },
    {
      question: 'What can other manufacturers learn from the PakTradeMash project?',
      answer: rt(
        p(
          'If the business has many equipment types, applications and customer industries, one general corporate page will not represent it in search. Search research can show how buyers describe those problems. That demand can be translated into architecture, category pages, application pages and useful technical content. The website becomes a structured digital representation of the offering, not only a company presentation.',
        ),
      ),
    },
  ],
})

const discussionBlock = () => ({
  blockType: 'csComments' as const,
  case_study_comment_title: 'Expert Discussion: PakTradeMash',
  comments: DISCUSSION.map((entry) => ({
    author: entry.author,
    role: entry.role,
    depth: entry.depth ?? 0,
    isExpert: entry.isExpert ?? false,
    date: new Date(`${entry.date}T09:00:00.000Z`).toISOString(),
    body: rt(entry.body),
  })),
})

const ctaBlock = () => ({
  blockType: 'cta' as const,
  richText: rtHero(
    `<h2>${escapeHtml('Discuss a similar industrial SEO and website-architecture project')}</h2>` +
      p(
        'If you supply or integrate technical equipment across several applications and need the website to match how buyers search, tell us about the catalogue.',
      ),
  ),
  links: [
    {
      link: {
        type: 'custom' as const,
        newTab: false,
        url: '/contact',
        label: 'Contact',
        appearance: 'default' as const,
      },
    },
  ],
})

const buildData = () => ({
  title: 'PakTradeMash — Digital Marketing for Packaging Equipment and Food Production Systems',
  case_study_long_title:
    'PakTradeMash — Website Expansion, SEO and Digital Marketing for Packaging Equipment and Food Production Systems',
  slug: SLUG,
  generateSlug: false,
  _status: 'published' as const,
  featured: true,
  displayOrder: 3,
  duration: null,

  layout: [
    {
      blockType: 'csPreview' as const,
      case_study_preview_title:
        'PakTradeMash: Search Research and Website Expansion for an Industrial Equipment Supplier',
      case_study_preview_text: rt(
        p(
          'PakTradeMash worked with packaging equipment and food-production systems: supply, installation, technical implementation and service for industrial buyers, including food-processing businesses. The project expanded and restructured an existing website so search demand for equipment, applications and production solutions could land on relevant pages rather than a limited corporate structure.',
        ),
      ),
    },
    titleBlock('About the Client'),
    contentBlock(
      p(
        'PakTradeMash was a large industrial company working with packaging equipment and production systems. The business was not a retail shopfront. Its customers could include food-production and processing companies that needed equipment and systems for packaging, refrigeration and freezing, food processing, production lines, handling and preparation, and industrial packaging operations.',
        'The company operated across production and manufacturing, equipment supply, installation, technical implementation, maintenance and service, and solutions for food-production businesses. Some equipment or components may have been sourced from other manufacturers while the company also produced or integrated parts of its own solutions. This case does not treat that mix as a verified bill of materials. The working description is a technical industrial supplier and integrator with a broad packaging and food-production equipment offering.',
        "Maryan Polyak's work sat on the digital side of that offering: search research, information architecture, content and SEO. The case is not that the company existed because of marketing. It is that a technically complex catalogue needed a website that industrial buyers could actually find and navigate.",
      ),
    ),
    titleBlock('The Website Was Too Small for the Offering'),
    contentBlock(
      p(
        'PakTradeMash already had a website and an established industrial business. The digital structure did not fully represent the breadth of equipment, solutions and applications. Promoting the existing pages as they stood would have left most of the catalogue without a corresponding place in search.',
        'The job was to understand how potential industrial buyers searched - packaging equipment and machinery, production lines, refrigeration and freezing equipment, food-production equipment, application-specific kit, related technical solutions - and convert that demand into a logical website structure.',
        'This is a B2B industrial marketing case, not a retail e-commerce story. The buyers are companies looking for equipment, technologies and production solutions, often with long evaluation cycles.',
      ),
    ),
    titleBlock('Website and Semantic Architecture'),
    contentBlock(
      p(
        'The website was expanded from a relatively limited existing structure into a more comprehensive architecture. The aim was to represent equipment categories, packaging systems, refrigeration and freezing solutions, production lines, applications, food-industry segments, technical information and commercial or service intent.',
        'The architecture connects product, equipment type, application, industry, production need and solution. Industrial SEO here is not adding keywords to the original pages. The structure itself is part of the marketing strategy.',
      ) +
        ul([
          'Company / about',
          'Packaging equipment and machinery',
          'Packaging lines and production-line equipment',
          'Refrigeration and freezing solutions',
          'Food-production and processing applications',
          'Meat-processing and vegetable-processing contexts',
          'Installation, implementation and service',
          'Technical information',
          'Contact',
        ]) +
        p(
          'These areas follow the supplied project material. Specific URLs are not reconstructed here. Additional equipment types and applications can be added as pages when they match real offering and real search demand, without treating every keyword as a new URL.',
        ),
    ),
    titleBlock('Search Research, Mapping and Content'),
    contentBlock(
      p(
        'The SEO work started with search and competitor research: how industrial buyers name equipment, categories, applications and production processes, and how search results were already organised. Competitor names are not listed, because they are not verified in the current project data. What was used is the pattern: category structure, content gaps, terminology, intent and opportunities for more specific pages.',
        'The semantic core was organised by product, equipment category, application, industry, production process, commercial intent and informational intent. Keywords were mapped to the most relevant pages instead of concentrating every term on the homepage.',
        'Content was created or improved around that demand: equipment, applications and industrial solutions written so a technical buyer could recognise the offering and a search engine could associate the page with the right query. On-page work covered titles, headings, metadata, internal linking, semantic relevance, page structure, content depth and intent alignment.',
        'Exact keyword volumes, ranking positions and traffic figures are not published. They are not verified in the current project data.',
      ),
    ),
    titleBlock('What the Work Produced'),
    contentBlock(
      p(
        'The engagement is remembered as a substantial project on the order of a year. That duration is not treated as a verified calendar metric in this record, and the duration field is left empty.',
        'The result that can be stated without inventing figures is qualitative: a broader website structure, stronger semantic coverage, clearer organisation of products and applications, expanded content, and a better foundation for organic search growth in packaging and food-production equipment. Paid campaigns, social programmes and CRM work are not listed as completed channels, because they are not confirmed in the source material used here.',
      ),
    ),
    faqBlock(),
    discussionBlock(),
    ctaBlock(),
  ],

  manufacturingProfile: {
    productionCapabilities: rt(
      p(
        'PakTradeMash operated as an industrial company supplying, implementing and, where the offering included it, producing or integrating equipment and systems for packaging and food-production environments.',
        'The combination that matters for this case is equipment, production systems, installation, technical implementation and service support - not a claim that every item in the catalogue was manufactured in-house.',
      ),
    ),
    products: rt(
      p(
        'Packaging machines, packaging equipment and packaging lines; refrigeration and freezing equipment; production-line equipment; and related industrial equipment used in food-production and packaging operations, as described in the source material.',
        'No machine models, third-party brand lists or technical specifications are stated here. Packaging materials are not listed as a product line, because that is not clearly supported in the available project information.',
      ),
    ),
    materials: null,
    applications: rt(
      p(
        'Applications included food production and food processing, meat processing, vegetable processing, packaging operations, industrial refrigeration and freezing, production facilities, and businesses that needed automated or semi-automated packaging processes.',
        'Customer industries and equipment applications overlap: a meat-processing company may need both packaging equipment and refrigeration as part of one production environment. The website had to make those applications findable without treating them as one generic food-industry page.',
      ),
    ),
  },

  businessChallenge: {
    initialState: rt(
      p(
        'PakTradeMash already had a website and an established industrial business. The digital structure did not fully represent the breadth of equipment, solutions and applications. The site had to become more useful as a discovery platform for companies searching for specific packaging, refrigeration and production solutions.',
      ),
    ),
    challenge: rt(
      p(
        'The challenge was not simply to get more traffic. It was to understand how potential industrial buyers searched for packaging equipment and machinery, production lines, refrigeration and freezing equipment, food-production equipment, application-specific equipment and related technical solutions - then convert that demand into a logical website structure.',
      ),
    ),
    goals: rt(
      ul([
        'Understand search demand in the packaging and food-production equipment sector',
        'Build a detailed semantic core',
        'Map keywords to appropriate pages',
        'Expand the website structure',
        'Improve content relevance',
        'Improve organic visibility without inventing ranking targets',
        'Make complex product categories easier to navigate',
        'Support lead generation from industrial search demand',
        'Establish stronger digital positioning around packaging and food-production systems',
      ]),
    ),
  },

  nicheSegmentation: [
    {
      name: 'Food and Meat Processing',
      description: rt(
        p(
          'Companies requiring packaging, refrigeration, freezing and production equipment for meat and other food products.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Build search visibility around equipment categories, production processes, packaging requirements and application-specific demand, rather than a single generic food-industry page.',
        ),
      ),
    },
    {
      name: 'Vegetable and Agricultural Food Processing',
      description: rt(
        p(
          'Companies processing and packaging vegetables and related food products.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Connect equipment and production solutions with specific processing, packaging, refrigeration and operational needs that these plants actually search for.',
        ),
      ),
    },
    {
      name: 'Industrial Packaging',
      description: rt(
        p(
          'Businesses requiring packaging machinery, packaging lines and related equipment.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Capture high-intent technical searches around packaging equipment, machinery categories, applications and production requirements, mapped to dedicated pages.',
        ),
      ),
    },
    {
      name: 'Refrigeration and Freezing Systems',
      description: rt(
        p(
          'Industrial businesses requiring refrigeration or freezing equipment as part of their production or storage process.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Structure content around equipment types, industrial applications and production requirements, kept distinct from packaging-only intent where the search is different.',
        ),
      ),
    },
    {
      name: 'Production Lines and Integrated Solutions',
      description: rt(
        p(
          'Companies looking for broader equipment configurations rather than a single machine, including supply, integration and installation around an actual production process.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Present PakTradeMash as a technical solution provider capable of supplying, integrating and installing equipment around a production process. No specific automation platform or proprietary engineering stack is claimed beyond that role.',
        ),
      ),
    },
  ],

  digitalEcosystem: rt(
    p(
      'The digital ecosystem in this case was the corporate website, product and equipment pages, application-oriented content, search-driven landing pages where they matched real offering, technical content, SEO, the keyword and semantic architecture, industry-oriented information, and content expansion as the structure grew.',
      'External digital visibility beyond the website is not listed as a completed workstream. Social media campaigns, CRM systems, advertising platforms and AI-search programmes are not included as delivered work, because they are not confirmed in the source material used here.',
    ),
  ),
  websiteArchitecture: rt(
    p(
      'The website was expanded from a relatively limited existing structure into a more comprehensive architecture capable of representing equipment categories, packaging systems, refrigeration and freezing solutions, production lines, applications, food-industry segments, technical information and commercial or service intent.',
      'The working model is product to equipment type to application to industry to production need to solution. Exact historic URLs are not reconstructed. The point is that structure, not only copy, carried the SEO strategy.',
    ),
  ),
  semanticArchitecture: rt(
    p(
      'The semantic model connected packaging equipment, packaging machinery, production lines, refrigeration equipment, freezing equipment, food production, food processing, meat processing, vegetable processing, industrial packaging, equipment installation, production solutions and industrial applications.',
      'Search intent was mapped to appropriate content and pages rather than trying to rank one general page for every term. Keyword volumes are not stated, because they are not available as verified figures in the current project data.',
    ),
  ),

  marketingStrategy: {
    seoAndContentStrategy: rt(
      p(
        'The main strategy was search-driven industrial marketing supported by a stronger website architecture: keyword research, competitor and SERP analysis, semantic core development, mapping, website expansion, content development and on-page SEO working as one process.',
        'Content explained equipment, applications and industrial solutions for technical buyers and for search engines. Internal linking tied categories to applications and to commercial or service pages. The relationship is research, then structure, then pages, then relevance, then organic visibility, not a separate content campaign bolted onto an unchanged site.',
      ),
    ),
    leadGenMechanism: rt(
      p(
        'The expanded site was meant to support enquiries from industrial search demand: a buyer who finds a relevant equipment or application page should be able to understand the offering and make contact. No form mix, conversion rate or lead volume is published.',
      ),
    ),
    paidAdvertising: [],
    socialMedia: [],
  },

  aiSearchOptimization: {
    brandAuthorityAndTrust: rt(
      p(
        'This project is described in the language of the work as it was done: research, architecture, content and SEO. It is not rewritten as an AI-search engagement.',
        'A structured model of company, products, applications and industries gives search systems more accurate material to read than a thin corporate brochure. No ChatGPT ranking, Perplexity citation, Gemini visibility, AI Overview result or AI-generated lead is claimed, and none is documented.',
      ),
    ),
    entityAndGeoStructure: rt(
      p(
        'Equipment types, applications and industries are treated as related entities in the information architecture. That topical model is useful for modern search systems in principle. It is not a measured GEO or AEO programme.',
      ),
    ),
  },

  implementationProcess: rt(
    p(
      'Confirmed shape of the work, without inventing dates: audit the existing website, business model and offering; research search demand, terminology and competitors; build the semantic core; expand information architecture; develop content against intent; implement on-page SEO; continue expanding pages where new products or applications justified it.',
      'The sequence is the method. It is not a dated Gantt chart.',
    ),
  ),

  timeline: [
    {
      period: 'Phase 1',
      title: 'Business and website audit',
      description: rt(
        p(
          'Review of the existing website, business model, equipment offering and information architecture to see what the live structure could and could not represent.',
        ),
      ),
    },
    {
      period: 'Phase 2',
      title: 'Search and competitor research',
      description: rt(
        p(
          'Research into search demand, terminology, competitor category patterns and potential customer intent. Individual competitor brands are not named here.',
        ),
      ),
    },
    {
      period: 'Phase 3',
      title: 'Semantic core development',
      description: rt(
        p(
          'Keyword and semantic core organised around products, equipment, applications and industries, including commercial and informational intent.',
        ),
      ),
    },
    {
      period: 'Phase 4',
      title: 'Website architecture expansion',
      description: rt(
        p(
          'Translation of the semantic core into a stronger information architecture and page structure, rather than concentrating demand on the original URLs.',
        ),
      ),
    },
    {
      period: 'Phase 5',
      title: 'Content development',
      description: rt(
        p(
          'Creation and improvement of technical and commercial content based on search intent and the actual offering.',
        ),
      ),
    },
    {
      period: 'Phase 6',
      title: 'SEO implementation',
      description: rt(
        p(
          'Optimization of pages, metadata, headings, internal linking and semantic relevance.',
        ),
      ),
    },
    {
      period: 'Phase 7',
      title: 'Ongoing content expansion',
      description: rt(
        p(
          'Where the project supported it, additional products, applications and equipment could become new search-oriented pages. That is a structural capability, not a claim of an open-ended retainership with unpublished dates.',
        ),
      ),
    },
  ],

  resultsSummary: rt(
    p(
      'The website structure became broader and more able to represent equipment categories and applications. Semantic coverage improved because search demand was mapped to relevant pages instead of a few general URLs. Product and application organisation became clearer for industrial buyers.',
      'Content coverage expanded around packaging, refrigeration and freezing, production lines and food-industry applications. That created a stronger foundation for organic search growth and a clearer connection between equipment categories and customer applications.',
      'Verified historical traffic, rankings, leads, conversions, revenue, keyword counts and percentage improvements are not stored in this project, so none are published.',
    ),
  ),

  metrics: [],
  projectsShowcase: [],

  expertInsight: rt(
    p(
      'For industrial companies, SEO becomes much more powerful when the website reflects the actual structure of the business. A manufacturer or technical supplier may have dozens of products, applications and customer industries that cannot be represented effectively by one general corporate page.',
      'Search research can reveal how different industries and technical buyers describe their problems. That demand can then be translated into website architecture, product pages, application pages and useful technical content.',
      "For a company that manufactures, supplies and installs equipment, the website can become more than a company presentation. It can become a structured digital representation of the company's industrial expertise and solution ecosystem.",
    ),
  ),

  clientTestimonial: {
    quote: null,
    author: null,
    position: null,
    company: null,
  },

  hero: {
    type: 'lowImpact' as const,
    richText: rtHero(
      p(
        'Website expansion, semantic research and SEO for an industrial supplier of packaging equipment and food-production systems, so buyers could find specific equipment and applications rather than a limited corporate site.',
      ),
    ),
  },

  primary_case_study_category: PRIMARY_CASE_STUDY_CATEGORY,
  case_study_categories: CASE_STUDY_CATEGORIES,

  meta: {
    title: 'PakTradeMash Case Study: Packaging Equipment SEO and Website Expansion',
    description:
      'Website expansion, keyword research and SEO for PakTradeMash, an industrial supplier of packaging equipment and food-production systems.',
  },
})

const main = async () => {
  const dry = process.argv.includes('--dry')
  const payload = await getPayload({ config })
  const data = buildData()
  const tree = measureCommentTree(buildCommentTree(DISCUSSION))

  const azimuth = await payload.find({
    collection: 'case-studies',
    where: {
      or: [{ slug: { like: 'azimuth' } }, { title: { like: 'Azimuth' } }],
    },
    limit: 5,
    depth: 0,
    overrideAccess: true,
    select: { id: true, slug: true, title: true },
  })
  if (azimuth.docs.length) {
    payload.logger.info(
      `Azimuth-related records: ${azimuth.docs.map((doc) => `${doc.id}:${doc.slug}`).join(', ')}`,
    )
  } else {
    payload.logger.warn(
      'No Azimuth Case Study found. Structural reference used: Pnevmomachta and Laser Made.',
    )
  }

  if (dry) {
    payload.logger.info(
      JSON.stringify(
        {
          slug: data.slug,
          layoutBlocks: data.layout.length,
          faqQuestions: faqBlock().items.length,
          discussionEntries: DISCUSSION.length,
          expertReplies: DISCUSSION.filter((entry) => entry.isExpert).length,
          discussionTree: tree,
          niches: data.nicheSegmentation.length,
          timeline: data.timeline.length,
          metrics: data.metrics.length,
          showcase: data.projectsShowcase.length,
          categories: data.case_study_categories.length,
          paidAds: data.marketingStrategy.paidAdvertising.length,
          social: data.marketingStrategy.socialMedia.length,
          duration: data.duration,
        },
        null,
        2,
      ),
    )
    process.exit(0)
  }

  const existing = await payload.find({
    collection: 'case-studies',
    where: { slug: { equals: SLUG } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const payload_data = data as never

  if (existing.docs[0]) {
    const updated = await payload.update({
      collection: 'case-studies',
      id: existing.docs[0].id,
      data: payload_data,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    payload.logger.info(`Updated existing Case Study ${updated.id}: ${getCaseStudyUrl(updated)}`)
  } else {
    const created = await payload.create({
      collection: 'case-studies',
      data: payload_data,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    payload.logger.info(`Created Case Study ${created.id}: ${getCaseStudyUrl(created)}`)
  }

  process.exit(0)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
