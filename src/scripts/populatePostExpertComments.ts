import 'dotenv/config'
import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'

import { buildCommentTree, measureCommentTree } from '../blocks/CaseStudyCommentsBlock/buildCommentTree'
import { getTiptapExtensions } from '../utilities/richText/extensions'

/**
 * Adds threaded Comments blocks to the three expert Posts.
 * Re-runnable: replaces any existing postCommentsBlock rather than appending.
 */

const EXPERT = 'Maryan Polyak'
const EXPERT_ROLE = 'Manufacturing Digital Marketing & Web Development Expert'

const rt = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [2, 3, 4] }))

const p = (...paragraphs: string[]) =>
  paragraphs.map((text) => `<p>${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`).join('')

type Entry = {
  author: string
  role: string
  date: string
  depth: number
  isExpert: boolean
  body: ReturnType<typeof rt>
}

const entry = (
  author: string,
  role: string,
  date: string,
  depth: number,
  isExpert: boolean,
  ...paragraphs: string[]
): Entry => ({
  author,
  role,
  date,
  depth,
  isExpert,
  body: rt(p(...paragraphs)),
})

const maryan = (date: string, depth: number, ...paragraphs: string[]) =>
  entry(EXPERT, EXPERT_ROLE, date, depth, true, ...paragraphs)

const geoComments = (): Entry[] => [
  entry(
    'Elena Vasquez',
    'In-house marketing lead, precision machining',
    '2026-10-07',
    0,
    false,
    'If we already invest in technical SEO, what does AI search visibility actually add? I do not want a second programme that competes with the work we already do on titles, crawlability and product pages.',
  ),
  maryan(
    '2026-10-07',
    1,
    'It is not a second programme. Technical SEO is still the delivery layer: if a page cannot be crawled, titled, or found, an answer engine has nothing reliable to reuse. GEO changes the unit of work. You are no longer only trying to rank a URL for a phrase. You are trying to make the company identifiable as an entity: what it makes, which applications it serves, which materials or processes it can actually do.',
    'The practical overlap is high. Service pages, application pages and case studies that already help an engineer also help a system that has to describe you in a sentence. What you stop doing is treating a handful of head terms as the whole strategy.',
  ),
  entry(
    'Elena Vasquez',
    'In-house marketing lead, precision machining',
    '2026-10-08',
    2,
    false,
    'So we should keep the current SEO backlog and add entity work on top, rather than pause rankings work?',
  ),
  maryan(
    '2026-10-08',
    3,
    'Yes. Finish the technical basics first if they are broken. Then use the same backlog to make relationships explicit: this service belongs to this application, this case study belongs to this capability. That is incremental. It does not require a separate team or a promise that a particular AI product will cite you.',
  ),
  entry(
    'Hiroshi Nakamura',
    'Applications engineer',
    '2026-10-09',
    0,
    false,
    'Our site has datasheets and capability lists, but they sit as PDFs or isolated pages. How should a manufacturer structure that technical information so both search engines and AI systems can understand the expertise?',
  ),
  maryan(
    '2026-10-09',
    1,
    'Put the facts on HTML pages that a specialist would recognise, then link them. A PDF can stay as a download. It should not be the only place the alloy, tolerance, process or certification is stated. An application page should name the job the buyer has. A service page should name the work you actually sell. A case study should point back to both.',
    'Isolated datasheets do not build a picture. The same specification repeated in a page that also explains where it is used does. That is how a system tells “a machining shop” from “a shop that machines a specific alloy for a named application.”',
  ),
  entry(
    'Priya Nair',
    'Owner, 40-person fabrication shop',
    '2026-10-10',
    0,
    false,
    'We are a smaller manufacturer. Can we start this without rebuilding the entire website?',
  ),
  maryan(
    '2026-10-10',
    1,
    'Yes. Start with the pages that already exist and make them specific. Rewrite the service and capability pages so they name products, processes and applications instead of adjectives. Add internal links between those pages and any project write-ups you already have. Fix the obvious technical blockers: orphan pages, thin homepages, navigation that hides the offering.',
    'A rebuild is justified when the architecture itself cannot carry those pages. It is not a prerequisite for clearer entity work.',
  ),
  entry(
    'Priya Nair',
    'Owner, 40-person fabrication shop',
    '2026-10-11',
    2,
    false,
    'If we only have time for three pages this quarter, which ones?',
  ),
  maryan(
    '2026-10-11',
    3,
    'The homepage statement of what you actually do, one service or capability page that a buyer would bookmark, and one proof page that connects that work to a real application. Three connected pages beat a dozen generic articles.',
  ),
  entry(
    'Markus Holtz',
    'Commercial director',
    '2026-10-12',
    0,
    false,
    'How do we evaluate AI search visibility without inventing a score? Management will ask whether this is working.',
  ),
  maryan(
    '2026-10-12',
    1,
    'Treat it as observation, not a ranking report. Pick a short list of questions a real buyer would ask an assistant: companies that do this process, this material, this application. Record whether you are named, how you are described, and which public pages the answer could have come from. Repeat the same questions later.',
    'Also keep the ordinary SEO measures: can the important pages be crawled, do they attract the right queries, do they produce enquiries. None of that proves a citation in a particular product. It tells you whether the public record is becoming easier to describe.',
  ),
  entry(
    'Claire Fontaine',
    'Marketing coordinator',
    '2026-10-13',
    0,
    false,
    'If a company is starting from scratch, which optimisation priorities actually make sense before content volume?',
  ),
  maryan(
    '2026-10-13',
    1,
    'Write down the entities first: company, services, products, applications, industries. Give each one a public page that is accurate. Make the site technically sound enough to crawl. Then publish only the articles that connect to those pages.',
    'Volume without that map is noise. The first job is a site a specialist would trust, not a calendar of generic posts.',
  ),
  entry(
    'Claire Fontaine',
    'Marketing coordinator',
    '2026-10-14',
    2,
    false,
    'Does a blog still help at that stage, or should we pause it?',
  ),
  maryan(
    '2026-10-14',
    3,
    'Pause anything that could sit on any agency site. Keep a post only if it answers a technical question and points to a service or application page. Otherwise the blog competes with the pages that should be doing the work.',
  ),
]

const adsComments = (): Entry[] => [
  entry(
    'Robert Lang',
    'Demand generation manager',
    '2026-09-23',
    0,
    false,
    'How do we tell irrelevant clicks from qualified industrial inquiries? The account looks busy, but sales says most forms are not usable.',
  ),
  maryan(
    '2026-09-23',
    1,
    'A click is not an inquiry, and an inquiry is not a qualified opportunity. Separate those three in reporting. Look at the query, the landing page, and what the form actually asked. If someone searched a generic phrase, landed on a brochure page, and left a first name, you learned almost nothing.',
    'Qualified industrial interest usually names a product family, an application, a specification, or a plant context. Build the campaign and the form around that. Then let sales mark what they will follow. Volume without that filter will always look healthier than it is.',
  ),
  entry(
    'Robert Lang',
    'Demand generation manager',
    '2026-09-24',
    2,
    false,
    'Should we hide the generic terms entirely, or keep them in a tightly limited brand or competitor set?',
  ),
  maryan(
    '2026-09-24',
    3,
    'Keep brand terms. Be cautious with broad category terms unless the landing page can qualify the visitor quickly. If a generic term cannot be matched to a specific product or application page, it is usually training the account to buy the wrong traffic.',
  ),
  entry(
    'Amelia Brooks',
    'PPC specialist',
    '2026-09-25',
    0,
    false,
    'How should we choose between broad product keywords and specialised manufacturing queries? The specialised terms have almost no volume.',
  ),
  maryan(
    '2026-09-25',
    1,
    'Specialised queries are often the ones that match how an engineer searches: process, material, tolerance, certification, application. Low volume is expected. That does not make them worthless. It means they cannot carry the whole account by themselves.',
    'Use the specialised terms where you have a page that can answer them. Use broader product terms only when the page can still qualify the visitor toward a specific line. Do not force one keyword strategy onto every product.',
  ),
  entry(
    'Yusuf Demir',
    'Product manager, capital equipment',
    '2026-09-26',
    0,
    false,
    'Some of our machines are searched so rarely that a campaign looks empty. How do you approach products with low search volume?',
  ),
  maryan(
    '2026-09-26',
    1,
    'Do not invent demand that is not there. Group those products under the application or problem the buyer actually types, and send that traffic to a page that can explain the machine in that context. Search ads are a poor fit if nobody is looking.',
    'In those cases the useful work is often the page itself, remarketing to people who already found you, or a sales-assisted conversation. Paying for a hollow campaign because a SKU exists on the price list is how industrial accounts waste budget.',
  ),
  entry(
    'Yusuf Demir',
    'Product manager, capital equipment',
    '2026-09-27',
    2,
    false,
    'If we group by application, do we still need a separate landing page per machine?',
  ),
  maryan(
    '2026-09-27',
    3,
    'You need a page the ad can honestly represent. If two machines serve the same job and the buyer decides after a conversation, one application page can be enough. If the specification changes the shortlist, the machine needs its own page. The test is whether a serious buyer would feel misled.',
  ),
  entry(
    'Ingrid Bergstrom',
    'Sales operations',
    '2026-09-28',
    0,
    false,
    'Which conversion events and lead-quality indicators actually matter for a long industrial cycle?',
  ),
  maryan(
    '2026-09-28',
    1,
    'Count the events that sales will use: a completed enquiry with enough context, a requested drawing or specification pack, a meeting that names a project. Soft conversions — brochure downloads, time on page — can describe interest. They should not be the number the account optimises toward.',
    'Then add a quality mark after the handoff: did sales accept it, did it become an opportunity, did it stall because the visitor was not a buyer. Without that loop, Google Ads will keep chasing the cheapest form fill.',
  ),
  entry(
    'Samuel Okonkwo',
    'Digital marketing lead',
    '2026-09-29',
    0,
    false,
    'How should Google Ads, landing pages, technical content and the B2B sales process connect? Today they sit in different tools.',
  ),
  maryan(
    '2026-09-29',
    1,
    'The ad should open the page that answers the query. That page should ask for the next useful step, not a generic “contact us”. The form should collect what sales needs to start a conversation. The enquiry should land in the same pipeline the team already uses, with the query and page attached.',
    'Technical content supports this when it sits next to the offer: an application note or comparison that helps the buyer decide, not a blog post disconnected from the campaign. If sales cannot see where the person came from, the account cannot improve.',
  ),
  entry(
    'Samuel Okonkwo',
    'Digital marketing lead',
    '2026-09-30',
    2,
    false,
    'Is it a problem if the sales cycle is six months and the form only starts the conversation?',
  ),
  maryan(
    '2026-09-30',
    3,
    'No. For capital equipment that is the honest conversion. Optimise for a usable start, then judge the campaign by the opportunities that follow. Do not pretend a click or a short form is a sold machine.',
  ),
]

const linkedinComments = (): Entry[] => [
  entry(
    'Helena Krüger',
    'Communications manager',
    '2026-09-08',
    0,
    false,
    'Should we put the effort into the company page or into personal profiles? We do not have a large marketing team.',
  ),
  maryan(
    '2026-09-08',
    1,
    'Use both for different jobs. The company page is the official record: what you make, who you hire, the pages you want a buyer to keep. Personal profiles are where engineers and salespeople are actually read. A company page that posts and a silent leadership team will stay quiet. Profiles with no company page behind them look unanchored.',
    'If the team is small, keep the company page accurate and consistent, and put most of the conversational effort on two or three people who already talk to customers.',
  ),
  entry(
    'Helena Krüger',
    'Communications manager',
    '2026-09-09',
    2,
    false,
    'Which two or three roles are usually worth the time?',
  ),
  maryan(
    '2026-09-09',
    3,
    'Someone who owns the technical offer, someone who owns the customer conversation, and one person who can publish without waiting for a committee. That is enough to start. Adding more profiles before those three have a rhythm only creates unused drafts.',
  ),
  entry(
    'Owen Gallagher',
    'Engineering manager',
    '2026-09-10',
    0,
    false,
    'How can engineers contribute technical expertise without this becoming another workload they will drop after two weeks?',
  ),
  maryan(
    '2026-09-10',
    1,
    'Do not ask them to become publishers. Ask for short, structured input: a correction to a draft, a photo from the floor with one sentence about the process, a fifteen-minute interview that marketing turns into a post. The engineer should recognise the result as accurate. They should not be asked to write weekly essays.',
    'If the only plan is “our engineers will post”, the plan will fail. The reusable asset is their knowledge, not their spare time.',
  ),
  entry(
    'Fatima El-Sayed',
    'Marketing manager, process equipment',
    '2026-09-11',
    0,
    false,
    'Most of our interesting work is under NDA. What can a manufacturer publish when customer information is confidential?',
  ),
  maryan(
    '2026-09-11',
    1,
    'Publish the work, not the client. Describe the process, the constraint, the material, the inspection requirement, or the application class. Remove names, sites and anything that would identify the buyer. A post about how you hold a tolerance or qualify a weld can be useful without a logo.',
    'If even that is too close, write about the capability in general terms and point to a public page that already passed legal review. Silence is worse than a careful, unnamed example.',
  ),
  entry(
    'Fatima El-Sayed',
    'Marketing manager, process equipment',
    '2026-09-12',
    2,
    false,
    'Legal still prefers we publish nothing from the shop floor. Is a capability post enough?',
  ),
  maryan(
    '2026-09-12',
    3,
    'It is enough if it is specific. “Quality solutions for industry” is not. “We machine this family of parts for this class of duty” is. You do not need a customer story to be concrete.',
  ),
  entry(
    'Jonas Berg',
    'Head of sales',
    '2026-09-13',
    0,
    false,
    'What should we measure besides likes? The page gets reactions and sales still ask what LinkedIn is for.',
  ),
  maryan(
    '2026-09-13',
    1,
    'Measure whether the right people show up and whether a conversation can start. Profile views from target accounts, comments that ask a technical question, inbound messages, and traffic to a service or application page are more useful than a reaction count.',
    'Vanity metrics are not useless. They are just not the goal. If a post is widely liked by people who will never buy, it did not do commercial work.',
  ),
  entry(
    'Chiara Bianchi',
    'Business development',
    '2026-09-14',
    0,
    false,
    'How does LinkedIn support a sales cycle that lasts months? We cannot expect a post to create an order.',
  ),
  maryan(
    '2026-09-14',
    1,
    'It should not. LinkedIn is useful when it keeps the company present while a committee is still forming: a buyer who saw a capability post, later visited a page, later asked sales a better question. That is a long assist, not a checkout.',
    'Use it to make the people and the offer easier to recognise before the RFQ. Then judge it by the quality of conversations and the pages people open, not by a last-click order.',
  ),
  entry(
    'Chiara Bianchi',
    'Business development',
    '2026-09-15',
    2,
    false,
    'Should sales send connection requests after every useful comment?',
  ),
  maryan(
    '2026-09-15',
    3,
    'Only when there is a reason to continue the same conversation. A generic connection after a like feels like prospecting theatre. A short note that refers to the technical point they raised is a normal B2B follow-up.',
  ),
]

const POSTS: Array<{ slug: string; comments: () => Entry[] }> = [
  { slug: 'ai-search-optimization-b2b-geo', comments: geoComments },
  { slug: 'google-ads-for-manufacturers', comments: adsComments },
  { slug: 'linkedin-b2b-manufacturing', comments: linkedinComments },
]

const commentsBlock = (comments: Entry[]) => ({
  blockType: 'postCommentsBlock' as const,
  postCommentTitle: 'Comments',
  comments,
})

const insertComments = (layout: Array<{ blockType?: string }>, comments: Entry[]) => {
  const next = layout.filter((block) => block.blockType !== 'postCommentsBlock')
  const block = commentsBlock(comments)
  const ctaIndex = next.findIndex((item) => item.blockType === 'cta')
  if (ctaIndex === -1) return [...next, block]
  return [...next.slice(0, ctaIndex), block, ...next.slice(ctaIndex)]
}

const main = async () => {
  const payload = await getPayload({ config })

  for (const { slug, comments } of POSTS) {
    const found = await payload.find({
      collection: 'posts',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { slug: { equals: slug } },
    })
    const doc = found.docs[0]
    if (!doc) {
      console.log(`missing ${slug}`)
      continue
    }

    const entries = comments()
    const measure = measureCommentTree(buildCommentTree(entries))
    const layout = insertComments(
      [...(doc.layout ?? [])] as Array<{ blockType?: string }>,
      entries,
    )

    await payload.update({
      collection: 'posts',
      id: doc.id,
      data: { layout: layout as never },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })

    console.log(
      JSON.stringify(
        {
          slug,
          id: doc.id,
          topLevel: measure.topLevel,
          entries: measure.total,
          maxDepth: measure.maxDepth,
        },
        null,
        2,
      ),
    )
  }

  process.exit(0)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
