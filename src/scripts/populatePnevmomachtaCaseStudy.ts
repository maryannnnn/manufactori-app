import 'dotenv/config'
import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'

import { buildCommentTree, measureCommentTree } from '../blocks/CaseStudyCommentsBlock/buildCommentTree'
import { getCaseStudyUrl } from '../utilities/getContentUrls'
import { getTiptapExtensions } from '../utilities/richText/extensions'

/**
 * Creates or updates the Pnevmomachta Case Study in the existing architecture.
 * Re-runnable: structured fields and layout blocks are replaced, not appended.
 *
 * No invented metrics, testimonials, photographs, directory names or AI rankings.
 * No site_categories (editorial case-study taxonomy only).
 */
const SLUG = 'pnevmomachta-long-term-digital-presence'

const EXPERT = 'Maryan Polyak'
const EXPERT_ROLE = 'Manufacturing Digital Marketing & Web Development Expert'

/** Existing Case Study Category IDs. Primary drives the public URL. */
const PRIMARY_CASE_STUDY_CATEGORY = 239 // manufacturing-website-development
const CASE_STUDY_CATEGORIES = [
  239, // Manufacturing Website Development
  226, // Manufacturing Website Design & Development
  238, // Manufacturing Website Design
  196, // Manufacturing SEO
  204, // Industrial SEO
  197, // Application SEO
  218, // Product SEO
  311, // Technical Content Marketing
  669, // Manufacturing
  817, // Pneumatic Telescopic Masts
  818, // Telescopic Masts
  813, // Firefighting Masts
  812, // Emergency Service Masts
  815, // Lighting Masts
  811, // Communication Masts
  810, // Antenna Masts
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
 * 8 top-level branches, mixed shapes, 25 entries, depth capped at 3.
 * Editorial discussion participants — not clients or customers.
 */
const DISCUSSION: DiscussionEntry[] = [
  {
    author: 'Lukas Schneider',
    role: 'Industrial marketing consultant',
    date: '2026-09-22',
    depth: 0,
    body: p(
      'With such a specialized product, did you really need a full website rather than a simple company page? A pneumatic mast is a narrow offering. A brochure site would seem enough.',
    ),
  },
  expert(
    '2026-09-22',
    p(
      'The problem was not the number of products. The problem was that the right customer had to be able to find the manufacturer when a specific need appeared. A specialized product can have many applications, and each application creates a different search intent.',
      'A visitor looking for a firefighting mast, a lighting mast for a construction site, or an antenna mast for a vehicle is not looking for a generic company page. If those applications are not explained, the manufacturer stays invisible even though the product exists.',
    ),
    1,
  ),
  {
    author: 'Martin Novak',
    role: 'In-house manufacturing marketer',
    date: '2026-09-23',
    depth: 0,
    body: p(
      'Did you have to constantly create new articles to keep the site visible? Most factories I know cannot feed a content calendar without inventing news.',
    ),
  },
  expert(
    '2026-09-23',
    p(
      'No. I do not believe a manufacturer should manufacture news just to satisfy a content calendar. If there is no real development, there is nothing useful to announce.',
      'When a new mast, mounting configuration or installation appears, that is real content and should be documented. The cadence follows production, not a publishing schedule.',
    ),
    1,
  ),
  {
    author: 'Martin Novak',
    role: 'In-house manufacturing marketer',
    date: '2026-09-24',
    depth: 2,
    body: p(
      'So if a quiet quarter produces no new configuration, you simply publish nothing?',
    ),
  },
  expert(
    '2026-09-24',
    p(
      'You leave the existing pages working. That is the point of the structure: application pages, photographs and technical descriptions continue to be found. Silence is better than filler. A page that still describes a real product is more useful than a blog post that announces nothing.',
    ),
    3,
  ),
  {
    author: 'Thomas Weber',
    role: 'Technical content lead',
    date: '2026-09-25',
    depth: 0,
    body: p(
      'Why do you consider the photographs part of the marketing rather than simply product documentation?',
    ),
  },
  expert(
    '2026-09-25',
    p(
      'Because for technical products the photograph can answer questions that text cannot. A customer can see the construction, mounting arrangement, scale and application. And when those photographs are connected to the correct product and application pages, they become part of the information architecture.',
      'A gallery that is not tied to those pages is decoration. A gallery that is tied to them is evidence.',
    ),
    1,
  ),
  {
    author: 'Thomas Weber',
    role: 'Technical content lead',
    date: '2026-09-26',
    depth: 2,
    body: p(
      'Should galleries then be updated every time a new installation is photographed, even if the product family already exists?',
    ),
  },
  expert(
    '2026-09-26',
    p(
      'Yes, when the photograph shows something the existing set does not: a vehicle mount, a deployed height, a different application. Repeating the same angle does not help. A new configuration does. Over years that produces a visual record of what the manufacturer actually builds, which is more useful than a one-time shoot.',
    ),
    3,
  ),
  {
    author: 'Jan Kowalski',
    role: 'SEO specialist, industrial accounts',
    date: '2026-09-27',
    depth: 0,
    body: p(
      'Is a narrow product range enough for SEO? Most advice assumes a large catalogue. Here the technology is focused.',
    ),
  },
  expert(
    '2026-09-27',
    p(
      'A focused range is enough if the applications are real. SEO here is not about inventing pages for products that do not exist. It is about naming the uses that already exist: firefighting, construction lighting, antennas, communications, emergency vehicles.',
      'One generic “pneumatic mast” page cannot carry those intents. Dedicated application content can, because each page answers a search the buyer actually types.',
    ),
    1,
  ),
  {
    author: 'Peter Horvat',
    role: 'B2B web architect',
    date: '2026-09-28',
    depth: 0,
    body: p(
      'How did you decide between organizing the site around product types versus applications? Those two trees fight each other on most industrial sites.',
    ),
  },
  expert(
    '2026-09-28',
    p(
      'They only fight if you pick one and ignore the other. The architecture holds both: product and application sit next to company information, installation and contact. A firefighting mast is still a mast, and it is also an emergency application. Internal links make that relationship visible instead of forcing the visitor to guess.',
      'New configurations can be added as new pages without rebuilding the tree, which is what a ten-year site actually needs.',
    ),
    1,
  ),
  {
    author: 'Peter Horvat',
    role: 'B2B web architect',
    date: '2026-09-29',
    depth: 2,
    body: p(
      'What happens when the same mast body is used in two industries? Do you duplicate the technical page?',
    ),
  },
  expert(
    '2026-09-29',
    p(
      'No. The technical description stays in one place. The application pages explain the use and point to it. Duplicating the specification creates two pages that compete with each other and drift apart. Linking them keeps the engineering accurate and still lets each industry arrive through its own language.',
    ),
    3,
  ),
  {
    author: 'Stefan Müller',
    role: 'Regional industrial sales',
    date: '2026-09-30',
    depth: 0,
    body: p(
      'For a manufacturer like this, how much of the visibility actually comes from Google versus directories, maps and industry listings?',
    ),
  },
  expert(
    '2026-09-30',
    p(
      'I will not split it into percentages, because this engagement does not have a verified channel mix to publish. What I will say is that search results are not the only surface.',
      'Consistent references in business listings, maps and industry resources help a real company stay identifiable: name, products, location. Those references only work if they point back to the same structured information on the website. Inventing a list of directories we cannot verify would not help anyone.',
    ),
    1,
  ),
  {
    author: 'Daniel Fischer',
    role: 'Head of digital, equipment manufacturing',
    date: '2026-10-01',
    depth: 0,
    body: p(
      'Everyone now asks whether a site like this is “AI-search ready”. Did you measure visibility in ChatGPT or similar systems for Pnevmomachta?',
    ),
  },
  expert(
    '2026-10-01',
    p(
      'No. There is no verified measurement of AI-answer visibility for this case, and I will not invent one.',
      'What the long-term work does produce is structured information: products, applications, photographs, technical descriptions. That is the material search engines and AI systems read when they try to understand an entity. Calling that a ranking result would be dishonest. Calling it groundwork is accurate.',
    ),
    1,
  ),
  {
    author: 'Marek Nowak',
    role: 'Content strategist',
    date: '2026-10-02',
    depth: 1,
    body: p(
      'Then what is the practical difference, for a manufacturer, between a short advertising campaign and this accumulated digital presence?',
    ),
  },
  expert(
    '2026-10-02',
    p(
      'A campaign stops when the budget stops. The accumulated record keeps describing the products. Advertising was used when it was appropriate; it was never the whole model.',
      'The stronger asset here is that a specialized buyer can still find and understand the manufacturer years after the first website work, because the site continued to reflect real production rather than a launch-day snapshot.',
    ),
    2,
  ),
  {
    author: 'Viktor Horváth',
    role: 'Engineering manager, specialty equipment',
    date: '2026-10-03',
    depth: 0,
    body: p(
      'The client is himself an engineer and continues to develop the products. How did that change the website work compared with a company that only resells?',
    ),
  },
  expert(
    '2026-10-03',
    p(
      'It changed the source of truth. The technical detail comes from the person who designs the masts, not from a marketing brief. That is an advantage, if you use it: configurations, applications and photographs can be documented as they appear, instead of being invented for the site.',
      'It also sets a limit. If he has not built it, we do not publish it. The website follows the engineering, not the other way around.',
    ),
    1,
  ),
]

const faqBlock = () => ({
  blockType: 'csFAQ' as const,
  case_study_faq_title: 'Frequently Asked Questions About Pnevmomachta',
  items: [
    {
      question: 'What exactly does Pnevmomachta manufacture?',
      answer: rt(
        p(
          'Pnevmomachta specializes in pneumatic telescopic mast systems and related configurations for applications including firefighting, construction, lighting, antennas, communications and emergency response.',
        ),
      ),
    },
    {
      question: 'Why does a specialized manufacturer need such a large digital presence?',
      answer: rt(
        p(
          'Even a focused product range can serve many different applications. Customers may search for a mast for a specific vehicle, lighting system, firefighting application, antenna or construction task rather than searching only for the general product name. A structured website allows the manufacturer to be found through these different requirements.',
        ),
      ),
    },
    {
      question: 'How can a manufacturer keep its website current without publishing news every day?',
      answer: rt(
        p(
          'It does not need to publish artificial daily news. Real production activity is enough. New products, configurations, installations, photographs and technical information can be added when they actually exist.',
        ),
      ),
    },
    {
      question: 'Why are photographs important for technical manufacturing products?',
      answer: rt(
        p(
          'Technical buyers want to understand how a product looks and how it is used. Photographs of real products, installations and configurations provide evidence of the manufacturer’s actual capabilities and help visitors understand the application.',
        ),
      ),
    },
    {
      question: 'Does SEO for a manufacturing company end after the website is built?',
      answer: rt(
        p(
          'No. A strong initial structure provides the foundation, but ongoing additions of real products, applications, technical content, photographs and internal links allow the website to continue developing its search visibility over time.',
        ),
      ),
    },
    {
      question: 'Can the same product content be used on social media?',
      answer: rt(
        p(
          'Yes, with appropriate adaptation. A new product or installation can become website content, a gallery update and social media content. The website remains the deeper source of technical information while social channels help distribute and expose that information to additional audiences.',
        ),
      ),
    },
  ],
})

const discussionBlock = () => ({
  blockType: 'csComments' as const,
  case_study_comment_title: 'Expert Discussion: Pnevmomachta',
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
    `<h2>${escapeHtml('Discuss a similar long-term manufacturing project')}</h2>` +
      p(
        'If you manufacture a focused technical product and need a digital presence that can grow with production, tell us about the work.',
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
  title: 'Pnevmomachta — Building a Long-Term Digital Presence for a Technical Mast Manufacturer',
  case_study_long_title:
    'Pnevmomachta — Website, SEO and Continuous Digital Development for a Pneumatic Mast Manufacturer',
  slug: SLUG,
  generateSlug: false,
  _status: 'published' as const,
  featured: true,
  displayOrder: 2,
  duration: '10_years',

  layout: [
    {
      blockType: 'csPreview' as const,
      case_study_preview_title:
        'Pnevmomachta: More Than Ten Years of Digital Presence for a Focused Mast Manufacturer',
      case_study_preview_text: rt(
        p(
          'Pnevmomachta designs, engineers and manufactures pneumatic telescopic masts. The engagement with Maryan Polyak has lasted more than ten years. The work was not a one-off website launch. It was the ongoing digital representation of a technically capable manufacturer that had to be findable for the applications its products actually serve.',
        ),
      ),
    },
    titleBlock('About the Client'),
    contentBlock(
      p(
        'Pnevmomachta is a manufacturer of pneumatic telescopic masts and related mast equipment. The founder is an engineer and technical developer. The business started from his own understanding that these masts were needed for practical industrial and emergency work, not from reselling a standard catalogue item.',
        'He continues to develop the technical side of the products: mast construction, configurations, applications and equipment. The production range is relatively focused. That is part of the story. A manufacturer does not need thousands of unrelated products to justify a serious digital presence.',
        'Maryan Polyak has worked with this client for more than ten years. The partnership is between engineering, manufacturing, website, SEO, content and continuous development. The case is not that the client became successful because of an agency. It is that a technically capable manufacturer stayed visible as the production itself developed.',
      ),
    ),
    titleBlock('The Real Problem Was Visibility'),
    contentBlock(
      p(
        'The initial challenge was not that the company had no product. The products existed, and the engineering understanding of the market was strong. Potential customers still could not discover the manufacturer simply because the company existed.',
        'Maryan argued that production itself was not enough. The company needed a website that made the manufacturer visible to people already searching for these solutions: what the masts are, where they are used, which configurations exist, and why this manufacturer is the one to contact.',
        'The website therefore became more than an online brochure. It became a long-term digital representation of the production, the products, the engineering expertise and the new developments as they appeared.',
      ),
    ),
    titleBlock('A Focused Range With Many Applications'),
    contentBlock(
      p(
        'The same core technology can serve different jobs. The source case describes applications including firefighting, construction, lighting, searchlights, antennas, communications, emergency response, special-purpose masts, vehicle-mounted systems and masts for specialized vehicles and services.',
        'That is still one product family. The digital structure has to connect the technical product with the operational problem the buyer is trying to solve, instead of promoting only the generic term “pneumatic mast”.',
      ),
    ),
    titleBlock('Website and Semantic Architecture'),
    contentBlock(
      p(
        'The site was organized around product types, applications and supporting company information. Relevant areas include company and about, firefighting masts, construction masts, lighting and searchlight masts, antenna masts, communication masts, emergency applications, materials and manufacturing, installation services, turnkey solutions, photo gallery, articles and contact.',
        'The architecture is meant to accept additional configurations without a rebuild. Semantic structure connects product, application, industry, equipment, problem and solution. The goal is not artificial SEO pages. The goal is to explain the actual product ecosystem in the language customers use when they look for a solution.',
      ),
    ),
    titleBlock('SEO, Content and Photography as Maintenance'),
    contentBlock(
      p(
        'SEO was treated as a long-term process, not a campaign that ended at launch. The work included researching product and application terminology, analysing competitors, identifying commercial intent, building dedicated product and application content, keeping technical SEO in order, and expanding the footprint as real products appeared.',
        'A historic keyword-count from older material is not republished here, because it has not been independently verified in the current project data. The method is what can be stated.',
        'Content follows production. A new mast on a specialized fire vehicle can generate product information, a gallery update, photographs, a technical description, a social post and an internal link from the relevant category. That is a realistic flow. It is not a demand to publish every day.',
        'Photography matters because this is a physical product. Buyers need to see the mast, deployed and collapsed states, mounts, vehicle installations and equipment on the mast. No specific photographs are claimed in this write-up beyond that principle; existing Media items are used only where they already exist in the project.',
      ),
    ),
    titleBlock('Channels Around the Website'),
    contentBlock(
      p(
        'The website is the central source of structured product and company information. The same material can be adapted for social channels such as LinkedIn and Facebook when a new product or installation is worth showing, with a path back to the technical page.',
        'This case does not claim that every network mentioned in older material is still active, and it does not publish subscriber counts.',
        'Visibility for a manufacturer also includes consistent references in business directories, industry resources, regional listings and maps. Specific directory names are not listed here unless they are already documented in the project.',
      ),
    ),
    titleBlock('What Ten Years Actually Means'),
    contentBlock(
      p(
        'The relationship was not “build a website and leave”. Over more than ten years the mix included website development, catalogue functionality, SEO, content, product descriptions, new photographs, galleries, social support, advertising when appropriate, analytics and ongoing technical improvements. The combination changed. The principle did not: the website should continue to reflect the real production.',
        'The result that can be stated without inventing figures is qualitative. The site has remained discoverable for years and continues to generate visibility and inquiries for a specialized manufacturer. The digital presence is an accumulated asset rather than a short campaign.',
      ),
    ),
    faqBlock(),
    discussionBlock(),
    ctaBlock(),
  ],

  manufacturingProfile: {
    productionCapabilities: rt(
      p(
        'Design, engineering and manufacturing of pneumatic telescopic mast systems. The company develops technical configurations for different operational requirements and applications. The founder continues to work on mast construction, configurations, applications and equipment rather than only reselling a finished standard product.',
      ),
    ),
    products: rt(
      p(
        'Pneumatic telescopic masts and specialized mast configurations for firefighting, construction, lighting, searchlights, antennas, communications, emergency response, specialized vehicles and other technical applications described in the source material.',
      ),
    ),
    materials: rt(
      p(
        'The source material for this case does not specify alloys, composites or material grades. No material specification is invented here. The products are pneumatic telescopic mast systems.',
      ),
    ),
    applications: rt(
      p(
        'The products are designed for situations where equipment needs to be elevated, deployed quickly or mounted on specialized platforms and vehicles. Applications can include lighting, communications, antennas, emergency services, construction and other technical environments.',
      ),
    ),
  },

  businessChallenge: {
    initialState: rt(
      p(
        'The client had a real technical product and a strong engineering understanding of the market. The company was not missing production. It was missing a digital presence that could explain the masts, their applications and configurations, and give a searching buyer a reason to make contact.',
      ),
    ),
    challenge: rt(
      p(
        'The central challenge was to turn a specialized technical manufacturing business into something that could be found and understood online. The website had to carry technical information without becoming difficult to navigate, and it had to support search visibility for different mast applications rather than a single generic product name.',
      ),
    ),
    goals: rt(
      ul([
        'Make the manufacturer discoverable in search',
        'Create a structured online product presence',
        'Organize products around real applications and search intent',
        'Explain technical products clearly',
        'Generate inquiries and orders',
        'Build long-term organic visibility',
        'Keep the website alive as the production develops',
        'Add new products, photographs and technical information as they appear',
        'Support the same content across the website and social channels',
        'Build accumulated digital authority rather than relying only on short advertising campaigns',
      ]),
    ),
  },

  nicheSegmentation: [
    {
      name: 'Emergency and Firefighting',
      description: rt(
        p(
          'Masts for firefighting, emergency response and specialized service vehicles where rapid deployment, elevated lighting, communications or other equipment can be important.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Build dedicated content around the actual application rather than promoting only the generic term “pneumatic mast”. The searcher may be looking for a firefighting mast, lighting solution, antenna support or a mast for a specialized vehicle. The website needs to connect the technical product with the real operational problem.',
        ),
      ),
    },
    {
      name: 'Construction and Industrial Lighting',
      description: rt(
        p(
          'Pneumatic mast systems can be used for construction sites, temporary lighting and other situations where lighting equipment needs to be elevated and deployed.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Present the mast as part of the complete application. Use product information, photographs, technical descriptions and real installation examples to help potential customers understand how the equipment is used.',
        ),
      ),
    },
    {
      name: 'Antenna, Communication and Specialized Vehicle Applications',
      description: rt(
        p(
          'Masts can also be configured for antennas, communication equipment and specialized vehicles.',
        ),
      ),
      marketingApproach: rt(
        p(
          'Create specific product and application content rather than forcing all applications into one generic product page. A new mast configuration, mounting system or vehicle installation can produce a new gallery, product page or technical article.',
        ),
      ),
    },
  ],

  digitalEcosystem: rt(
    p(
      'The digital ecosystem developed around the website as the centre, with product and catalogue content, SEO, technical content, product photography, galleries, social media, external directories and industry resources, regional and local business listings, maps, search visibility and ongoing content updates.',
      'These are not treated as isolated activities. Content is structured on the website first and then adapted for other platforms. No CRM, analytics or advertising stack is claimed beyond what this case can support: the website remains the source of structured product and company information.',
    ),
  ),
  websiteArchitecture: rt(
    p(
      'The website architecture was built around product types, applications and supporting company information.',
    ) +
      ul([
        'Company / About',
        'Firefighting Masts',
        'Construction Masts',
        'Lighting and Searchlight Masts',
        'Antenna Masts',
        'Communication Masts',
        'Emergency / EMERCOM Applications',
        'Materials and Manufacturing',
        'Installation Services',
        'Turnkey Solutions',
        'Photo Gallery',
        'Blog / Articles',
        'Contact',
      ]) +
      p(
        'These categories are supported by the original Pnevmomachta case material. Additional product configurations and applications can be added without rebuilding the whole website.',
      ),
  ),
  semanticArchitecture: rt(
    p(
      'The website should not depend on one generic keyword such as “pneumatic mast”. The semantic structure connects product, application, industry, equipment, problem and solution.',
      'For example: pneumatic mast, then firefighting, emergency vehicle, lighting, searchlight, antenna, communication, construction. That allows one technical manufacturing capability to become visible across multiple real-world search intents.',
      'The goal is not to create artificial SEO pages. The goal is to explain the actual product ecosystem in the language customers use when looking for a solution.',
    ),
  ),

  marketingStrategy: {
    seoAndContentStrategy: rt(
      p(
        'SEO is described here as a long-term process rather than a one-time optimization. The original project included keyword and competitor analysis around pneumatic mast applications. A historic keyword-count from older material is not republished, because it has not been independently verified in the current project data.',
        'The method that can be stated: research product terminology, research application terminology, analyse competitors, identify commercial search intent, create dedicated product and application content, optimize product pages, create technical articles, update existing content, add new products and photographs, strengthen internal linking, maintain technical SEO, and continue expanding the semantic footprint.',
        'SEO was not treated as a campaign that ended after the initial website launch. It became part of the ongoing digital maintenance of the manufacturer.',
        'Content follows real production. When the company develops a new mast, configuration, mounting system, vehicle installation, application, photograph or technical improvement, that development can become website content. A new mast installed on a specialized fire vehicle can generate product information, a gallery, photographs, a technical description, a social post and an internal link from the relevant category. The point is not to publish every day. The point is to keep the digital representation of the real production alive.',
      ),
    ),
    leadGenMechanism: rt(
      p(
        'The website is the public surface through which inquiries reach the manufacturer. This write-up does not invent a specific form mix, chat tool or channel split, because those details are not verified in the current project data.',
        'What the structure is built to do is make the product understandable at the moment of search, then make contact possible. Inquiries and orders are a stated goal of the engagement; no numeric commercial result is claimed.',
      ),
    ),
    paidAdvertising: [],
    socialMedia: [
      {
        channel: 'linkedin',
        strategy: rt(
          p(
            'Product and installation content can be adapted for LinkedIn when there is something real to show, with a path back to the technical page on the website. This is a distribution method, not a claim of continuous activity or audience size.',
          ),
        ),
        content: rt(
          p(
            'A new product, mounting system or vehicle installation can appear as a short post that points to the deeper technical information on the site.',
          ),
        ),
      },
      {
        channel: 'facebook',
        strategy: rt(
          p(
            'The same principle applies where Facebook is an appropriate channel for the audience. No subscriber count or current activity claim is published.',
          ),
        ),
        content: rt(
          p(
            'Photographs of real installations are more useful here than generic company news, again linking back to the website when the visitor needs specifications.',
          ),
        ),
      },
    ],
  },

  aiSearchOptimization: {
    brandAuthorityAndTrust: rt(
      p(
        'Over more than ten years the site accumulates structured information about the company, products, applications and expertise: technical descriptions, application pages, photographs and updates that follow real production.',
        'No claim is made that ChatGPT, Gemini or another AI system ranked the company. There is no verified AI-search measurement in this case. The statement is architectural: there is more accurate material for a system to read than there would be from a one-page brochure that never changed.',
      ),
    ),
    entityAndGeoStructure: rt(
      p(
        'The semantic structure treats the manufacturer, the mast technology and the applications as related entities rather than a single generic product keyword. Firefighting, lighting, antennas, communications and vehicle mounts are distinct uses of the same capability.',
        'That is information architecture. It is not a measured GEO or AEO programme, and none is claimed.',
      ),
    ),
  },

  implementationProcess: rt(
    p(
      'Confirmed shape of the work, without inventing a dated project plan: understand the products and applications with the engineer-client; build a website structured around those applications; establish SEO and content around real search intent; keep photography and galleries tied to products; reuse material on social channels when there is something real to show; maintain consistent company references in listings and maps; continue the work as production develops.',
      'Advertising was used when appropriate. It was not the model. The engagement is measured in more than ten years, not in a launch sprint.',
    ),
  ),

  timeline: [
    {
      period: 'Opening years',
      title: 'Website as digital representation',
      description: rt(
        p(
          'A site structured around products, applications and company information, so a searching buyer could understand the masts and make contact. Exact calendar years for the first launch are not restated here beyond the verified length of the relationship: more than ten years.',
        ),
      ),
    },
    {
      period: 'Ongoing years',
      title: 'Maintenance that follows production',
      description: rt(
        p(
          'New configurations, photographs, technical descriptions and application pages added as they existed. SEO, internal linking and channel reuse continued. The mix of website, content, social support and advertising shifted; the requirement that the site reflect real production did not.',
        ),
      ),
    },
  ],

  resultsSummary: rt(
    p(
      'A focused manufacturing business became continuously visible online through long-term digital work. The value was not simply the creation of an online store. The real result was the creation and maintenance of a digital representation of a technical manufacturer that could grow with the production.',
      'As new products, configurations, photographs and applications appeared, they could be added to the website and distributed through other channels. That created a cumulative digital presence that continued working long after the initial website development.',
      'The website has remained discoverable in search for years and continues to generate visibility and inquiries for a specialized manufacturer. Verified current commercial figures are not stored in this project, so none are published.',
    ),
  ),

  metrics: [
    {
      value: '10+ Years',
      label: 'Continuous digital partnership',
      description: rt(
        p(
          'Maryan Polyak has worked with Pnevmomachta for more than ten years. The duration is the verified result. It is not a traffic percentage.',
        ),
      ),
    },
    {
      value: 'Focused range',
      label: 'Many real applications',
      description: rt(
        p(
          'The production range is relatively focused. The digital structure still covers distinct applications such as firefighting, construction, lighting, antennas, communications and emergency response, because those are how buyers search.',
        ),
      ),
    },
  ],

  projectsShowcase: [
    {
      projectName: 'Firefighting and emergency-response masts',
      description: rt(
        p(
          'Application content for firefighting, emergency response and specialized service vehicles, where rapid deployment and elevated equipment matter. No individual installation is named here beyond the application itself.',
        ),
      ),
    },
    {
      projectName: 'Construction and lighting masts',
      description: rt(
        p(
          'Mast systems presented as part of construction-site and temporary lighting applications, using product information and installation examples rather than a generic product-only page.',
        ),
      ),
    },
    {
      projectName: 'Antenna, communication and vehicle-mounted systems',
      description: rt(
        p(
          'Configurations for antennas, communication equipment and specialized vehicles, treated as their own content opportunities when a new mount or installation appears.',
        ),
      ),
    },
  ],

  expertInsight: rt(
    p(
      'A manufacturing website does not need to look busy every day to be valuable. A factory may develop one important product configuration this month and have nothing genuinely newsworthy to publish tomorrow. That is normal.',
      'The important thing is to make sure that real production activity is reflected online. A new product, a new mounting system, a new vehicle installation, a new photograph or a new technical application can become useful digital information.',
      'Over ten years, these small updates accumulate. The result is not just a website. It is a growing digital record of what the manufacturer actually does.',
      'For a specialized manufacturer, that accumulated record can become more valuable than a short advertising campaign because it remains discoverable and continues to provide context for future customers.',
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
        'More than ten years of website, SEO and content work for a pneumatic mast manufacturer, kept in step with real production rather than treated as a one-off launch.',
      ),
    ),
  },

  primary_case_study_category: PRIMARY_CASE_STUDY_CATEGORY,
  case_study_categories: CASE_STUDY_CATEGORIES,

  meta: {
    title: 'Pnevmomachta Case Study: Long-Term Digital Presence',
    description:
      'More than ten years of website, SEO and content work for Pnevmomachta, a focused pneumatic telescopic mast manufacturer.',
  },
})

const main = async () => {
  const dry = process.argv.includes('--dry')
  const payload = await getPayload({ config })
  const data = buildData()
  const tree = measureCommentTree(buildCommentTree(DISCUSSION))

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
    payload.logger.info(
      `Updated existing Case Study ${updated.id}: ${getCaseStudyUrl(updated)}`,
    )
  } else {
    const created = await payload.create({
      collection: 'case-studies',
      data: payload_data,
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    payload.logger.info(
      `Created Case Study ${created.id}: ${getCaseStudyUrl(created)}`,
    )
  }

  process.exit(0)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
