import 'dotenv/config'
import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'

import { buildCommentTree, measureCommentTree } from '../blocks/CaseStudyCommentsBlock/buildCommentTree'
import { getTiptapExtensions } from '../utilities/richText/extensions'

/**
 * Updates the existing Laser Made case study in place:
 *
 *  1. Drops the obsolete `.ru` suffix from visible brand references.
 *  2. Replaces the FAQ and discussion blocks with authored content.
 *
 * Re-runnable: the FAQ and discussion blocks are rebuilt rather than appended,
 * so running this twice does not duplicate them.
 *
 * Every factual claim below is drawn from the case study's own fields. Where the
 * source hedges a number, the hedge is kept.
 */
const SLUG = 'laser-made-two-manufacturing-websites'

const EXPERT = 'Maryan Polyak'
const EXPERT_ROLE = 'Manufacturing Digital Marketing & Web Development Expert'

const rt = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [2, 3, 4] }))

/**
 * Visible brand references only. Keys are matched longest-first so the
 * capitalised brand forms win before the bare domains.
 */
const BRAND_REPLACEMENTS: [RegExp, string][] = [
  [/DecorTrend\.ru/g, 'Decor Trend'],
  [/Decor Trend\.ru/g, 'Decor Trend'],
  [/decortrend\.ru/g, 'Decor Trend'],
  [/LaserMade\.ru/g, 'Laser Made'],
  [/lasermade\.ru/g, 'Laser Made'],
]

/** Keys that hold real URLs; never rewritten. */
const URL_KEYS = new Set(['href', 'src', 'url', 'slug', 'filename'])

const stripBrandSuffix = (input: string): string =>
  BRAND_REPLACEMENTS.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), input)

/** Walks the document and rewrites brand names in prose, leaving links alone. */
const cleanValue = (value: unknown, key?: string): unknown => {
  if (typeof value === 'string') {
    if (key && URL_KEYS.has(key)) return value
    return stripBrandSuffix(value)
  }

  if (Array.isArray(value)) return value.map((item) => cleanValue(item))

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, cleanValue(v, k)]),
    )
  }

  return value
}

const faqBlock = () => ({
  blockType: 'csFAQ' as const,
  case_study_faq_title: 'Frequently Asked Questions About Laser Made',
  items: [
    {
      question:
        'How do you structure a site for a workshop that processes 15 different materials without turning navigation into an unusable list?',
      answer: rt(
        '<p>The structure follows the production process, not a services menu. The 27+ sections on the corporate site are grouped into six practical areas: material processing, outdoor advertising, interior advertising, POS and retail equipment, screens and furniture and decor, and a press-center plus client-resources area.</p><p>Within material processing the 15 categories exist as their own destinations — plywood, wood, MDF, acrylic, plastic, PVC, composite, polycarbonate, PET, paper, cardboard, felt, fabric, leather and rubber. That matters because a buyer does not search for "laser cutting", they search for the material they hold in their hand. A single generic services page cannot answer that, and it also cannot rank for it.</p>',
      ),
    },
    {
      question:
        'Why split the business across two websites instead of adding a shop section to the corporate site?',
      answer: rt(
        '<p>Because the two audiences buy differently. The corporate site serves B2B clients commissioning custom production: they need technical detail, material and process specifics, and evidence of comparable work. The separate store serves B2C buyers of finished decor items, where the decision is short and visual.</p><p>Merging them re-creates the original problem in a new form — one page trying to speak to everyone, which is exactly what made the 2019 landing pages unreadable. Keeping them apart lets each platform have its own audience, content and promotion approach.</p>',
      ),
    },
    {
      question: 'What does a 2,000+ keyword semantic core actually buy a manufacturer?',
      answer: rt(
        '<p>It buys specificity. The core is clustered by individual material, process and application rather than a small set of head terms, so "MDF milling" is treated as distinct from generic "laser cutting" demand. Each cluster then has a page that genuinely answers it.</p><p>The compounding effect showed up late: by years four and five, hundreds of keywords had reached top positions in Google. That is the honest shape of the result — not a step change after launch, but breadth accumulating over years as content matched what the workshop actually produces.</p>',
      ),
    },
    {
      question: 'Where did qualified B2B enquiries actually come from?',
      answer: rt(
        '<p>Several routes, deliberately matched to intent. A short name-and-phone form on the homepage captures fast enquiries. An extended form on service pages asks for service type, material and timeline, which qualifies the lead before anyone picks up the phone. A price calculator turns material and size into an estimate. Live chat accounts for roughly 15 to 20% of leads, on the condition that chats are answered within one to two minutes. WhatsApp and Telegram are offered as direct channels.</p><p>On channel mix, the source data gives an approximate split of about 50% from Google Ads, 30% from organic search, 15% from social media and 5% direct. That is presented as an estimate rather than an audited figure, and it is worth treating it as one.</p>',
      ),
    },
    {
      question: 'Does this kind of structure help with AI and generative search visibility?',
      answer: rt(
        '<p>Honest answer: no measured AI-search results are claimed for this project. What exists is the groundwork that AI answers tend to draw on — a structure that ties material to the processes performed on it and to the finished product categories that use it, a 200+ project portfolio, an expert blog built from client interviews, a project FAQ, and Google My Business reviews.</p><p>That is standard information-architecture and authority work rather than a dedicated generative-search programme. It positions the business to be described accurately by a system that reads structure, but claiming measured visibility in ChatGPT, Perplexity or Gemini for this engagement would be inventing a result.</p>',
      ),
    },
  ],
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
 * A real discussion tree stored flat. `depth` 0 opens a new branch; depth N
 * replies to the nearest preceding entry at depth N-1.
 *
 * Laser Made branches (content kept; only the renderer changed):
 *   Hoffman         — architecture / 15 materials          (Q → expert)
 *   Lindqvist       — SEO / thin pages + cannibalisation   (Q → expert → follow-up → expert)
 *   Castellanos     — Drupal vs WordPress                  (Q → expert)
 *   Fischer         — forms + price calculator             (Q → expert → follow-up → expert)
 *   Wierzbicki      — PPC / A/B + ad-account structure     (Q → expert → follow-up → expert)
 *   Berger          — multilingual sequencing              (Q → expert)
 *   Doležal         — interview blog + trust               (Q → expert → follow-up → expert)
 *   Oyelaran        — performance                          (Q → expert)
 *   Aaltonen        — AI-search visibility                 (Q → expert)
 *   Marchetti       — five-year engagement                 (Q → expert)
 */
const DISCUSSION: DiscussionEntry[] = [
  {
    author: 'Daniel Hoffman',
    role: 'Industrial marketing consultant',
    date: '2026-09-02',
    depth: 0,
    body: '<p>The part I keep coming back to is the 15 material categories. Most fabricators I work with have the same breadth and they all end up with one "our services" page because nobody can agree how to divide it. How did you actually decide the six top-level groups rather than, say, splitting by machine?</p>',
  },
  expert(
    '2026-09-02',
    '<p>Splitting by machine is the trap, because it describes the workshop to itself rather than to a buyer. Nobody commissions "the CNC router". The six groups follow what the output is for: material processing, outdoor advertising, interior advertising, POS and retail equipment, screens and furniture and decor, and the client-resources area.</p><p>Material is the entry point because it is the one thing a buyer already knows before they know anything else. Process lives underneath it, which is why 3D milling and CNC facade work sit inside material processing rather than as peers of it.</p>',
    1,
  ),
  {
    author: 'Petra Lindqvist',
    role: 'Technical SEO lead',
    date: '2026-09-04',
    depth: 0,
    body: '<p>2,000+ keywords across 27+ sections raises the obvious question: how did you avoid producing a field of thin near-duplicate pages? Material-by-material pages are notoriously easy to turn into doorway content.</p>',
  },
  expert(
    '2026-09-05',
    '<p>The clustering is what prevents it. A cluster only becomes a page if it has something specific to say — a material with its own tolerances, thicknesses, finishes and typical applications. Where two clusters would say the same thing, they belong on one page with the second as a section, not as a separate URL.</p><p>The other half is content that is not templated. Each service and material category got written content rather than a generated variant, and the portfolio carries 200+ documented projects that give those categories real examples to point at. A page with a real project on it is very hard to mistake for a doorway.</p>',
    1,
  ),
  {
    author: 'Petra Lindqvist',
    role: 'Technical SEO lead',
    date: '2026-09-05',
    depth: 2,
    body: '<p>And cannibalisation between the material pages and the process pages? "MDF" and "MDF milling" are close enough to compete.</p>',
  },
  expert(
    '2026-09-06',
    '<p>They are, and the resolution is hierarchy rather than keyword avoidance. The material page owns the material as a whole and links down; the process page owns the specific operation and links up. One is the category, one is the answer to a narrower query. Problems appear when both pages try to be the category — then you are competing with yourself and Google picks for you.</p>',
    3,
  ),
  {
    author: 'Ruben Castellanos',
    role: 'Web development studio owner',
    date: '2026-09-07',
    depth: 0,
    body: '<p>Curious about the platform decision. Moving off WordPress to Drupal in 2019 for a fabrication business — what made that the right call rather than rebuilding on WordPress properly?</p>',
  },
  expert(
    '2026-09-07',
    '<p>The deciding factor was the structure itself. What had to be modelled was a taxonomy with real depth — materials, processes, applications and product categories that cross-reference each other — plus a portfolio that had to grow past 200 entries and stay navigable.</p><p>I would not present that as a universal verdict on the two platforms. The honest version is that the site was rebuilt from the ground up on Drupal and the structure held for five years without needing another rebuild, which is the outcome that actually mattered.</p>',
    1,
  ),
  {
    author: 'Ilana Fischer',
    role: 'B2B demand generation',
    date: '2026-09-08',
    depth: 0,
    body: '<p>You describe two form types — a short one on the homepage and an extended one on service pages. In practice, did the longer form suppress volume? That is usually the objection from sales.</p>',
  },
  expert(
    '2026-09-08',
    '<p>It changes what you are optimising for. The short form exists precisely because some visitors will not fill in anything longer, so it stays as the low-friction route. The extended form asks for service type, material and timeline, and its job is qualification — those three answers tell you whether an enquiry is a real project before anyone spends time on it.</p><p>For custom production that trade is usually worth it, because the cost of an unqualified enquiry is a quote that takes real engineering time to prepare.</p>',
    1,
  ),
  {
    author: 'Ilana Fischer',
    role: 'B2B demand generation',
    date: '2026-09-09',
    depth: 2,
    body: '<p>Where does the price calculator sit in that? I would expect a fabricator to resist publishing anything that looks like a price.</p>',
  },
  expert(
    '2026-09-09',
    '<p>It gives an estimate from material and size, not a quote, and that distinction is what makes it acceptable. Its real function is filtering: a visitor who sees the rough order of magnitude and continues is a different prospect from one who had no idea. It removes the conversation that ends at the number.</p>',
    3,
  ),
  {
    author: 'Tomasz Wierzbicki',
    role: 'PPC specialist, industrial accounts',
    date: '2026-09-10',
    depth: 0,
    body: '<p>On the paid side — you mention an A/B test where a price-free emotional headline beat a price-led one by around 20% on CTR and conversion. Did that hold for the B2B production campaigns, or mainly the consumer decor side?</p>',
  },
  expert(
    '2026-09-10',
    '<p>I would not stretch that result further than it goes. It is one documented headline test, and the roughly 20% improvement applies to that test rather than to the account as a whole. Treating it as a rule about B2B versus B2C would be overreading a single comparison.</p><p>What is safe to generalise is the practice, not the finding: continuous A/B testing of headlines, images, descriptions and landing pages, with tighter audience targeting used to bring cost per click down over time. The starting point was paid search that was spending without direction, so the gain came from testing at all.</p>',
    1,
  ),
  {
    author: 'Tomasz Wierzbicki',
    role: 'PPC specialist, industrial accounts',
    date: '2026-09-11',
    depth: 2,
    body: '<p>Fair. Did the segmented site structure change what you could do in the ad account?</p>',
  },
  expert(
    '2026-09-11',
    '<p>Significantly, and this is the part that gets missed. Ad groups can only be as specific as the page they land on. With one generic services page every keyword lands in the same place, so match quality is capped no matter how well the account is built. Once each material and process has a real destination, the campaign can mirror the structure instead of fighting it.</p>',
    3,
  ),
  {
    author: 'Noa Berger',
    role: 'Export manager, metal fabrication',
    date: '2026-09-12',
    depth: 0,
    body: '<p>We are looking at a similar rebuild but with three languages from the start. Did this project run multilingual, and would you sequence it differently knowing what you know?</p>',
  },
  expert(
    '2026-09-12',
    '<p>This engagement was single-language, so I cannot offer you measured results from it on the multilingual side. I would rather say that plainly than generalise from a project that did not test it.</p><p>What does transfer is the sequencing risk. The expensive mistake here would be translating a structure you are not yet sure about. The material, process and application hierarchy took real work to get right, and every language multiplies the cost of changing it later. Settling the architecture in one language first is the cheaper order of operations.</p>',
    1,
  ),
  {
    author: 'Marek Doležal',
    role: 'Content strategist',
    date: '2026-09-14',
    depth: 0,
    body: '<p>The blog model interests me — roughly a 30-minute client interview turned into a ~2,000-word article. How do you keep that going for years without the client losing patience with it?</p>',
  },
  expert(
    '2026-09-14',
    '<p>By keeping their side of it to the 30 minutes. The interview is the only thing that needs the client, because it is the only part that cannot be sourced elsewhere — how they actually solved a specific job. Writing, editing and publishing do not involve them.</p><p>The cadence was front-loaded: 10 to 15 foundational articles first, then 2 to 4 a month. That ordering matters, because the foundational set is what the category pages link into. Starting with a monthly drip leaves the structure with nothing to support it.</p>',
    1,
  ),
  {
    author: 'Marek Doležal',
    role: 'Content strategist',
    date: '2026-09-15',
    depth: 2,
    body: '<p>Did the interview-led articles do anything for trust beyond search traffic?</p>',
  },
  expert(
    '2026-09-15',
    '<p>That is arguably their main job. A buyer commissioning custom production is trying to establish competence before they make contact, and an article that explains how a specific problem was solved does that better than a capability list. Together with the portfolio and the project FAQ, it means the case for the company is already made before the first call.</p>',
    3,
  ),
  {
    author: 'Grace Oyelaran',
    role: 'Frontend performance engineer',
    date: '2026-09-16',
    depth: 0,
    body: '<p>The original landing pages are described as slow. Where did the rebuilt site land on performance, and how much of that was structural versus asset-level work?</p>',
  },
  expert(
    '2026-09-16',
    '<p>The figures recorded for this project are roughly 1.5 to 2 seconds on desktop, 2.5 to 3 seconds on mobile, and a Google PageSpeed score in the 85 to 90 range. For a portfolio-heavy manufacturing site that is a reasonable place to be.</p><p>Most of it is asset-level — a site showing 200+ documented projects lives and dies by image handling. But some is structural: when a visitor can reach the specific material they came for in one step, they load one relevant page instead of hunting through a page that carries everything.</p>',
    1,
  ),
  {
    author: 'Sven Aaltonen',
    role: 'Head of digital, contract manufacturing',
    date: '2026-09-17',
    depth: 0,
    body: '<p>Everyone is now asking whether their site is "AI-search ready". Given this structure, do you see evidence that it helps in generative answers, or is that still speculation?</p>',
  },
  expert(
    '2026-09-17',
    '<p>For this project it is speculation, and I will not dress it up. Nothing in the engagement measured visibility in AI answer engines, so there is no result to report.</p><p>What I will say is that the work that makes a site legible to an AI system is not a separate discipline. Explicit entities, a material linked to the processes performed on it and to the product categories that use it, a clear split between the B2B production business and the B2C store, documented projects, reviews — that is the same information architecture and authority work you would do anyway. If generative search rewards it, this site is positioned for it. That is a different sentence from claiming it already has.</p>',
    1,
  ),
  {
    author: 'Adela Marchetti',
    role: 'Marketing director, furniture manufacturing',
    date: '2026-09-19',
    depth: 0,
    body: '<p>What stands out is the five years rather than any single number. Most agencies would have presented this as a redesign case. Was the long engagement a deliberate model or just how it turned out?</p>',
  },
  expert(
    '2026-09-19',
    '<p>It is the finding, not the framing. A catalogue this wide is not fixed by a redesign, because the work is keeping content and campaigns matched to what the workshop can actually produce — and that changes. The five years cover a Drupal rebuild, the semantic core, the portfolio, a second platform for retail, 10+ social channels, then years of testing and automation from enquiry through to production.</p><p>I would rather present that than a growth percentage. Manufacturers are, in my experience, the audience least impressed by a chart and most interested in whether something is still working after year three.</p>',
    1,
  ),
]

const discussionBlock = () => ({
  blockType: 'csComments' as const,
  case_study_comment_title: 'Expert Discussion: Laser Made',
  comments: DISCUSSION.map((entry) => ({
    author: entry.author,
    role: entry.role,
    depth: entry.depth ?? 0,
    isExpert: entry.isExpert ?? false,
    date: new Date(`${entry.date}T09:00:00.000Z`).toISOString(),
    body: rt(entry.body),
  })),
})

const main = async () => {
  const dry = process.argv.includes('--dry')
  const payload = await getPayload({ config })

  const found = await payload.find({
    collection: 'case-studies',
    where: { slug: { equals: SLUG } },
    limit: 1,
    depth: 0,
    draft: false,
    overrideAccess: true,
  })

  const existing = found.docs[0]
  if (!existing) throw new Error(`No case study with slug "${SLUG}"`)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const layout = (existing.layout ?? []) as any[]

  // Rebuild rather than append, so the script stays re-runnable.
  const keptBlocks = layout.filter(
    (block) => block?.blockType !== 'csFAQ' && block?.blockType !== 'csComments',
  )

  const cleanedBlocks = cleanValue(keptBlocks) as typeof keptBlocks
  // Keep any existing CTA at the end so the FAQ and discussion sit in the
  // same place the generation prompt specifies: after the narrative, before CTA.
  const ctaIndex = cleanedBlocks.findIndex((block) => block?.blockType === 'cta')
  const nextLayout =
    ctaIndex === -1
      ? [...cleanedBlocks, faqBlock(), discussionBlock()]
      : [
          ...cleanedBlocks.slice(0, ctaIndex),
          faqBlock(),
          discussionBlock(),
          ...cleanedBlocks.slice(ctaIndex),
        ]

  // Brand cleanup also has to reach the structured fields outside `layout`.
  const structured = cleanValue({
    case_study_long_title: existing.case_study_long_title,
    manufacturingProfile: existing.manufacturingProfile,
    businessChallenge: existing.businessChallenge,
    nicheSegmentation: existing.nicheSegmentation,
    digitalEcosystem: existing.digitalEcosystem,
    websiteArchitecture: existing.websiteArchitecture,
    semanticArchitecture: existing.semanticArchitecture,
    marketingStrategy: existing.marketingStrategy,
    aiSearchOptimization: existing.aiSearchOptimization,
    implementationProcess: existing.implementationProcess,
    timeline: existing.timeline,
    resultsSummary: existing.resultsSummary,
    metrics: existing.metrics,
    projectsShowcase: existing.projectsShowcase,
    expertInsight: existing.expertInsight,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as Record<string, any>

  if (dry) {
    const before = JSON.stringify(existing)
    const brandHits = BRAND_REPLACEMENTS.flatMap(([pattern]) => before.match(pattern) ?? [])
    const tree = measureCommentTree(buildCommentTree(DISCUSSION))
    console.log(
      JSON.stringify(
        {
          id: existing.id,
          status: existing._status,
          layoutBlocksBefore: layout.length,
          layoutBlocksAfter: nextLayout.length,
          faqQuestions: faqBlock().items.length,
          discussionEntries: discussionBlock().comments.length,
          expertReplies: DISCUSSION.filter((d) => d.isExpert).length,
          discussionTree: tree,
          brandReferencesFound: brandHits.length,
          brandReferenceSamples: [...new Set(brandHits)],
        },
        null,
        2,
      ),
    )
    process.exit(0)
  }

  const updated = await payload.update({
    collection: 'case-studies',
    id: existing.id,
    data: {
      ...structured,
      layout: nextLayout,
      _status: 'published',
    },
    overrideAccess: true,
    // `revalidateTag` needs a Next.js request context, which a CLI script has no
    // access to. Same flag the original import script uses.
    context: { disableRevalidate: true },
  })

  const faq = (updated.layout ?? []).find((b) => b.blockType === 'csFAQ')
  const discussion = (updated.layout ?? []).find((b) => b.blockType === 'csComments')

  console.log(
    JSON.stringify(
      {
        ok: true,
        id: updated.id,
        status: updated._status,
        layoutBlocks: updated.layout?.length ?? 0,
        faqQuestions: faq && 'items' in faq ? faq.items?.length ?? 0 : 0,
        discussionEntries:
          discussion && 'comments' in discussion ? discussion.comments?.length ?? 0 : 0,
        remainingBrandSuffixes: BRAND_REPLACEMENTS.flatMap(
          ([pattern]) => JSON.stringify(updated).match(pattern) ?? [],
        ).length,
      },
      null,
      2,
    ),
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
