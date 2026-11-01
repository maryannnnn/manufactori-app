import 'dotenv/config'
import { existsSync, readFileSync } from 'fs'
import path from 'path'

import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload, type Payload } from 'payload'
import sharp from 'sharp'

import { getTiptapExtensions } from '../utilities/richText/extensions'
import { LEGACY_SERVICE_REDIRECTS } from '../utilities/serviceCatalog'

const context = { disableCategorySeo: true, disableRevalidate: true }
const rt = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [2, 3, 4] }))
const rtCta = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [1, 2, 3, 4] }))
const escapeHtml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const paragraphs = (...texts: string[]) => texts.map((text) => `<p>${escapeHtml(text)}</p>`).join('')
const bullets = (items: string[]) => `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
const h2 = (text: string) => `<h2>${escapeHtml(text)}</h2>`

type FormatName = 'initial_project' | 'campaign' | 'ongoing_monthly'
type DurationName = 'one_time_project' | '3_months' | '6_months'

type PageCopy = {
  slug: string
  successorOf?: string
  title: string
  h1: string
  previewDescription: string
  metaTitle: string
  metaDescription: string
  intro: string[]
  body: string
  situations: { title: string; text: string }[]
  scope: { title: string; text: string }[]
  steps: { title: string; text: string }[]
  offerTitle: string
  offerText: string
  offerIncludes: string[]
  offerNext: string
  ctaLabel: string
  formats: { format: FormatName; duration: DurationName; text: string }[]
  faqs: { question: string; answer: string }[]
  ctaHeading: string
  ctaBody: string
  imageSource: string
  imageFile: string
  alt: string
  displayOrder: number
  related: string[]
}

const PAGES: PageCopy[] = [
  {
    slug: 'industrial-seo',
    title: 'Industrial SEO',
    h1: 'Product and application search for companies that sell specified parts',
    previewDescription:
      'Search work for manufacturing catalogs: product families, applications, standards, and the queries an engineer uses when a general brochure page is not enough.',
    metaTitle: 'Industrial Product SEO for Manufacturing Companies',
    metaDescription:
      'Industrial SEO for manufacturers: product, application, and standard searches matched to pages that state what you sell. No ranking guarantee is included.',
    intro: [
      'Industrial search is usually a part number, a material, a pressure class, or an application, not a phrase a consumer brand would buy. The page that should answer it is often a category, a product, or a short application note.',
      'This service builds that match. It is separate from a general SEO program and from a technical audit. Those still matter. They do not decide which product families deserve a public page.',
    ],
    body:
      h2('What the query is actually asking') +
      paragraphs(
        'An engineer searching for a replacement seal, a pump curve, or a coating for a specific environment is not looking for a company story. The result has to name the product family, the limit, and the cases where it should not be used. If the only public page is a homepage claim about quality, the query has nothing accurate to land on.',
        'We start from the catalog and from the questions sales already answers. Families that share a specification can share a page. Families that differ by a standard, a material, or an industry use get their own URL when that difference is how buyers choose. Filter pages that only reshuffle the same table stay out of the plan.',
      ) +
      h2('Where this sits next to the rest of the site') +
      paragraphs(
        'Industrial SEO assumes the important text is in HTML and that the index is not full of duplicate combinations. When that is not true, the technical audit comes first. The words on the page still have to come from engineering, not from a keyword list written without the product.',
      ) +
      '<p>The crawl and index side of the same catalog is <a href="/services/search/technical-seo-website-audits">technical SEO and website audits</a>. The pages themselves often belong with <a href="/services/website/product-catalogs-ecommerce">product catalogs</a> and <a href="/services/content/technical-content-strategy">technical content</a>.</p>',
    situations: [
      {
        title: 'The catalog is large and the public site only describes the company.',
        text: 'Buyers search for a product class. The site answers with a slogan. The missing object is a page that names the class and its limits.',
      },
      {
        title: 'Several industries use the same part for different reasons.',
        text: 'A shared product page can stay. An application page is justified when the duty, the standard, or the exclusion changes the choice.',
      },
      {
        title: 'Sales ranks for the brand and almost nothing else.',
        text: 'Branded queries are useful. They do not replace the non-branded product and application searches that a new buyer uses.',
      },
    ],
    scope: [
      {
        title: 'Query map from the catalog',
        text: 'Product, application, and standard searches tied to a real family you can quote. Queries you cannot fulfill are marked as out of scope.',
      },
      {
        title: 'Page types',
        text: 'Which differences become a URL, and which stay in a table. This is the information architecture of search, not a redesign of the visual theme.',
      },
      {
        title: 'On-page specification',
        text: 'Titles, headings, and the sentences that state the product, the use, and the limit. Engineering checks any line that could be read as a capability.',
      },
    ],
    steps: [
      {
        title: 'Read the catalog against live search',
        text: 'We compare what you sell with the pages that exist and with the queries those pages could honestly answer.',
      },
      {
        title: 'Choose the families',
        text: 'Priority goes to ranges sales can quote and that buyers search for by product or application, not by your brand name.',
      },
      {
        title: 'Specify the pages',
        text: 'Each chosen URL gets a job: category, application, or product. Copy is limited to facts engineering will sign.',
      },
      {
        title: 'Hand the list to the build and the audit',
        text: 'New templates go to website development. Index problems go to the technical audit. This service does not pretend to be both.',
      },
    ],
    offerTitle: 'Start with one product family',
    offerText:
      'The first pass maps the searches and the pages for one family you already quote. You can see whether the structure is worth extending.',
    offerIncludes: [
      'A query map for that family',
      'A decision on page types',
      'Notes on titles and the facts each page must state',
      'A list of queries to leave alone',
    ],
    offerNext: 'Further families follow only after the first set is accurate. Rankings are not promised.',
    ctaLabel: 'Discuss industrial SEO',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'A search map and page specification for one product family.' },
      { format: 'campaign', duration: '3_months', text: 'Additional families once the first pages are live and engineering has checked the limits.' },
    ],
    faqs: [
      {
        question: 'Is this the same as the general SEO service?',
        answer: 'No. The general service covers the search program as a whole. This page is specifically about industrial product, application, and standard searches.',
      },
      {
        question: 'Will you guarantee a position in Google?',
        answer: 'No. The work is the match between a query and a page that states the product accurately. Positions depend on more than that page.',
      },
      {
        question: 'Do you write a page for every SKU?',
        answer: 'Only when the difference is one a buyer must see as its own URL. Variants that share a specification usually stay in one table.',
      },
      {
        question: 'Can this run before the technical audit?',
        answer: 'The map can. Publishing a large set of new URLs into a broken index should wait until crawl and duplication are understood.',
      },
    ],
    ctaHeading: 'Bring the product search the homepage cannot answer',
    ctaBody: 'If buyers look for a class of part and the site only introduces the company, that gap is a concrete place to start.',
    imageSource: 'blog-manufacturing-seo.jpg',
    imageFile: 'service-industrial-seo.jpg',
    alt: 'Engineer standing beside a CNC machine on a manufacturing floor.',
    displayOrder: 21,
    related: [
      'technical-seo-website-audits',
      'website-development',
      'product-catalogs-ecommerce',
      'technical-content-strategy',
    ],
  },
  {
    slug: 'technical-seo-website-audits',
    title: 'Technical SEO & Website Audits',
    h1: 'Crawl, index, and speed checks for large industrial catalogs',
    previewDescription:
      'Audits of crawl paths, index bloat, page speed, structured data, and the technical errors that hide product pages on complex manufacturer websites.',
    metaTitle: 'Technical SEO and Website Audits for Manufacturers',
    metaDescription:
      'Technical SEO audits for manufacturer websites: crawl paths, index bloat, Core Web Vitals, structured data, and filter URLs a catalog should not publish.',
    intro: [
      'A manufacturing catalog can publish thousands of URLs without anyone choosing them. Filter combinations, duplicate titles, and files search tools cannot read are common. Extra articles do not fix that.',
      'A technical audit names what should be fetched, what should stay out of the index, and whether the specification a buyer needs is actually in the HTML.',
    ],
    body:
      h2('The index is a product decision') +
      paragraphs(
        'Search engines have a finite amount of attention for a domain. If that attention is spent on sorted and filtered copies of the same table, the product page you care about waits. The audit starts by listing the URL patterns: products, applications, documents, parameters, and session or sort links that should never have been links.',
        'Core Web Vitals sit in the same review. A heavy gallery, an uncompressed drawing, or a script that blocks the specification can make a correct page slow enough that people leave before they read the limit. We treat speed as part of the audit, not as a separate slogan.',
      ) +
      h2('What the audit does not pretend to choose') +
      paragraphs(
        'The audit can say a page is duplicated or blocked. It should not invent a new product architecture. Which families deserve a URL is industrial SEO. Which sentence states a capability is content engineering. Structured data is added only for facts the visible page already shows.',
      ) +
      '<p>Page structure for the products themselves is <a href="/services/search/industrial-seo">industrial SEO</a>. Implementation of templates and performance is <a href="/services/website/website-development">website development</a>.</p>',
    situations: [
      {
        title: 'Search Console shows thousands of indexed URLs and little product demand.',
        text: 'The index is probably full of combinations. The first job is to decide which patterns are real pages.',
      },
      {
        title: 'Important specifications exist only inside a PDF or an image.',
        text: 'If the text is not in HTML, a search tool and a buyer on a phone both have less to use. The audit flags those pages.',
      },
      {
        title: 'A redesign is planned and nobody has listed the current errors.',
        text: 'Rebuilding a site without an audit often copies the same duplicate titles and parameter URLs into the new templates.',
      },
    ],
    scope: [
      {
        title: 'Crawl and index review',
        text: 'Status codes, canonicals, robots rules, sitemaps, and the URL patterns that should or should not be indexed.',
      },
      {
        title: 'Performance and rendering',
        text: 'Core Web Vitals on representative product and category templates, including the effect of images and third-party scripts.',
      },
      {
        title: 'Structured data and errors',
        text: 'Markup that matches visible facts, plus broken internal links, soft duplicates, and templates that emit empty titles.',
      },
    ],
    steps: [
      {
        title: 'Sample the templates, not every SKU',
        text: 'We crawl the patterns: a category, a product, a document, a filter, and a parameter URL. The pattern tells us more than a random list of pages.',
      },
      {
        title: 'Separate blockers from tidy-ups',
        text: 'Index bloat and missing HTML text outrank cosmetic title tweaks. The report says which items change what a buyer can find.',
      },
      {
        title: 'Write the fix list in template language',
        text: 'Recommendations name the template or the rule, so development can implement them once instead of editing pages by hand.',
      },
      {
        title: 'Recheck after the change',
        text: 'A second look confirms the pattern changed. It is not a promise that rankings will move by a stated amount.',
      },
    ],
    offerTitle: 'Start with a template audit',
    offerText:
      'The first audit covers the main templates and the URL patterns they generate. You receive a fix list, not a slide about search trends.',
    offerIncludes: [
      'A crawl sample of the live patterns',
      'Index and canonical notes',
      'A Core Web Vitals check on representative templates',
      'A prioritized fix list for development',
    ],
    offerNext: 'A full catalog review follows only if the templates are not enough to explain the index.',
    ctaLabel: 'Discuss a technical audit',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'An audit of the current templates and index patterns.' },
      { format: 'ongoing_monthly', duration: '3_months', text: 'Rechecks after development ships the fixes, limited to the patterns already reviewed.' },
    ],
    faqs: [
      {
        question: 'Does the audit include new product copy?',
        answer: 'No. It identifies technical obstacles and missing HTML text. Writing the specification is a content task, checked by engineering.',
      },
      {
        question: 'Will you add schema that the page does not show?',
        answer: 'No. Structured data should repeat a visible fact. Markup for a capability the page does not state is a bad idea.',
      },
      {
        question: 'Is a perfect Core Web Vitals score required?',
        answer: 'No. We look for the templates where speed clearly gets in the way of reading a specification, and we name the cause.',
      },
      {
        question: 'Can you audit a site that is about to be rebuilt?',
        answer: 'Yes. The useful output is the list of patterns the new build must not recreate.',
      },
    ],
    ctaHeading: 'Bring the catalog that search tools cannot sort out',
    ctaBody: 'If the index is larger than the product range, the audit should start there rather than with another article.',
    imageSource: 'blog-manufacturing-website-architecture.jpg',
    imageFile: 'service-technical-seo.jpg',
    alt: 'Warehouse aisles in an industrial building, seen from one end.',
    displayOrder: 22,
    related: ['industrial-seo', 'website-development', 'website-maintenance-security'],
  },
  {
    slug: 'ai-search-optimization-geo',
    title: 'AI Search Optimization (GEO)',
    h1: 'Making product facts easier for generative search systems to describe accurately',
    previewDescription:
      'Work on entity clarity, topical relevance, and source credibility so AI search systems have accurate public material about a manufacturer. Citations are not promised.',
    metaTitle: 'Generative AI Search Optimization for Manufacturers',
    metaDescription:
      'Prepare manufacturing product facts so generative search systems can describe the offer without guessing. This does not promise a citation in any assistant.',
    intro: [
      'Generative engine optimization, in the practical sense, means making the public facts about a manufacturer clear enough that an AI search system is less likely to invent them. It is not a switch that forces ChatGPT, Gemini, or Perplexity to mention you.',
      'Those systems do not share one method. Some retrieve live pages. Some mix stored material with a search tool. Some show sources. Some do not. What you can control is the page.',
    ],
    body:
      h2('What can actually be prepared') +
      paragraphs(
        'A useful page names the company, the product family, the application, and the limit in sentences a specialist would accept. It uses the same names your quotes use. It does not bury the specification under a slogan. That helps a conventional results page, and it gives an assistant less reason to guess.',
        'Topical relevance here means the site covers the subjects you really sell, with enough distinction that one family is not described as all of them. Source credibility means the page, and any document it relies on, can be checked. It does not mean a badge or a claim that a model must trust you.',
      ) +
      h2('How this differs from content engineering and from an audit') +
      paragraphs(
        'Content engineering is the restructuring of product pages so the facts exist in the first place. GEO is the discipline of making those facts legible to generative search: names, relationships, and the absence of contradictions. A citation audit is the later check of what an assistant actually said on a given date. None of the three guarantees inclusion.',
      ) +
      '<p>The page-building work is <a href="/services/search/ai-search-optimization-content-engineering">AI search optimization and content engineering</a>. Checking what assistants currently say is <a href="/services/search/ai-visibility-citation-audits">an AI visibility and citation audit</a>.</p>',
    situations: [
      {
        title: 'Assistants describe the company with a capability you do not sell.',
        text: 'The public site is often vague enough to allow the invention. The fix starts by stating the real scope in plain sentences.',
      },
      {
        title: 'Product pages exist, but the names differ from the quote and the drawing.',
        text: 'Inconsistent names make both buyers and retrieval systems uncertain which object is meant. GEO work aligns those names.',
      },
      {
        title: 'The team wants a GEO program before any product page states a limit.',
        text: 'There is nothing solid to summarize. Content engineering has to come first, or the exercise is only a prompt.',
      },
    ],
    scope: [
      {
        title: 'Entity and name clarity',
        text: 'The company, the brands, and the product families, written so a system can tell them apart from a parent, a distributor, or a similar product.',
      },
      {
        title: 'Topical boundaries',
        text: 'Which applications and standards the site should be understood to cover, and which claims should be removed or narrowed.',
      },
      {
        title: 'Source notes',
        text: 'Where a fact lives on the site, and whether a public document supports it. We do not invent third-party endorsements.',
      },
    ],
    steps: [
      {
        title: 'Collect the names you already use',
        text: 'Quotes, drawings, and the website are compared. Conflicts are listed before any new copy is written.',
      },
      {
        title: 'Mark the pages a system would have to read',
        text: 'Usually a company description, the priority product pages, and the application pages that state a limit.',
      },
      {
        title: 'Edit for explicit facts',
        text: 'Sentences say what the product is, where it is used, and where it is not. Adjectives that could be read as a certification are removed unless you hold it.',
      },
      {
        title: 'Leave a question list for the audit',
        text: 'The same buyer questions can later be asked of assistants. That check is a separate service, and it still will not force a mention.',
      },
    ],
    offerTitle: 'Start with the pages assistants would have to read',
    offerText:
      'The first pass covers the company description and one product family. You see the contradictions and the sentences that should replace them.',
    offerIncludes: [
      'A name and scope check against quotes',
      'A short list of pages that carry the facts',
      'Edits that state the product, the use, and the limit',
      'Questions worth asking an assistant later',
    ],
    offerNext: 'Broader families follow only when the first set is accurate. Inclusion in any AI answer is not part of the offer.',
    ctaLabel: 'Discuss GEO',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'A GEO pass on the company description and one product family.' },
      { format: 'campaign', duration: '3_months', text: 'Further families after engineering has confirmed the revised sentences.' },
    ],
    faqs: [
      {
        question: 'Can you make ChatGPT cite our site?',
        answer: 'No. Nobody can honestly promise that. The work makes the public facts clearer. Whether a system mentions them is outside the engagement.',
      },
      {
        question: 'Is GEO different from ordinary SEO?',
        answer: 'The pages are the same pages. GEO focuses on explicit names, scope, and contradictions that matter when a system summarizes you, not only when it ranks a URL.',
      },
      {
        question: 'Do you need access to our models or prompts?',
        answer: 'No. The material is your public site and the documents you can verify. We do not require a private model.',
      },
      {
        question: 'Will you add hidden text for AI systems?',
        answer: 'No. Facts belong in the visible page. Hidden text is a bad way to describe a product and a bad way to be summarized.',
      },
    ],
    ctaHeading: 'Bring a page an assistant could misread',
    ctaBody: 'If a product page could be summarized as a capability you do not have, that page is the right sample.',
    imageSource: 'blog-ai-search-manufacturers.jpg',
    imageFile: 'service-geo.jpg',
    alt: 'Engineer with a specification binder, with industrial pumps visible through the office window.',
    displayOrder: 23,
    related: [
      'ai-search-optimization-content-engineering',
      'answer-engine-optimization-aeo',
      'entity-authority-building',
    ],
  },
  {
    slug: 'answer-engine-optimization-aeo',
    title: 'Answer Engine Optimization (AEO)',
    h1: 'Direct answers to the technical questions industrial buyers already ask',
    previewDescription:
      'Pages that answer engineering, procurement, and distributor questions in plain technical language, on the URL where that question belongs.',
    metaTitle: 'Answer Engine Optimization for Manufacturing Buyers',
    metaDescription:
      'Write direct answers to technical questions from engineers, procurement, and distributors. The answer sits on the page where the question belongs.',
    intro: [
      'Answer engine optimization, for a manufacturer, means writing the reply sales already gives, on the page where the question belongs. An engineer asks about a material. Procurement asks what document comes with the quote. A distributor asks which range they can stock.',
      'It is not a separate ranking system, and it does not force an assistant to quote you. A clear answer is still useful to the person who opened the page.',
    ],
    body:
      h2('Questions have a home') +
      paragraphs(
        'A compatibility question belongs on the product or application page, not in a blog post that never links back. A lead-time question belongs where someone is deciding whether to enquire. A standards question belongs next to the product that claims the standard, and only if you can support the claim.',
        'We collect the questions from sales calls, RFQ emails, and the gaps on current pages. Each answer states the fact, the condition, and the limit. If engineering cannot confirm it, it does not go on the site.',
      ) +
      h2('What AEO is not') +
      paragraphs(
        'It is not a pile of FAQ blocks on every URL, and it is not GEO. GEO is about how a system can describe the company and the product without inventing a scope. AEO is about a specific question a buyer asks. Content engineering is the wider job of structuring the specification so those answers have a page to live on.',
      ) +
      '<p>Structuring the underlying pages is <a href="/services/search/ai-search-optimization-content-engineering">content engineering</a>. The writing itself often overlaps <a href="/services/content/technical-content-strategy">technical content</a>, with a narrower job: answer the question in place.</p>',
    situations: [
      {
        title: 'The same question arrives in every RFQ.',
        text: 'If sales pastes the same paragraph into emails, the product page is missing that paragraph.',
      },
      {
        title: 'A FAQ page answers questions no buyer asks.',
        text: 'Generic questions about quality dilute the page. We start from the inbox, not from a template of FAQs.',
      },
      {
        title: 'Distributors ask which variants they can offer.',
        text: 'That is a commercial answer with a technical boundary. It deserves a page or a section, not a phone call every time.',
      },
    ],
    scope: [
      {
        title: 'Question inventory',
        text: 'Real questions from engineers, procurement, and distributors, grouped by the page that should answer them.',
      },
      {
        title: 'Answers with conditions',
        text: 'The fact, the condition of use, and the exclusion. Engineering reviews anything that could be read as a guarantee.',
      },
      {
        title: 'Placement',
        text: 'The answer is added to the product, application, or document page. A standalone FAQ is used only when no better URL exists.',
      },
    ],
    steps: [
      {
        title: 'Collect questions from sales',
        text: 'We use recent emails and call notes. Invented questions are rejected even if they contain a useful keyword.',
      },
      {
        title: 'Assign each question to a URL',
        text: 'If the URL does not exist, the gap is recorded for industrial SEO or content engineering rather than forced into a blog.',
      },
      {
        title: 'Draft the answer',
        text: 'Short, specific, and limited to what you can support. A standard is named only when you apply it.',
      },
      {
        title: 'Review with the person who quotes',
        text: 'If sales would not send the sentence, it does not publish. That rule matters more than how an answer might be extracted.',
      },
    ],
    offerTitle: 'Start with the questions sales repeats',
    offerText:
      'The first set is the questions that already show up in quotes for one product family. You see the answers and the pages they belong on.',
    offerIncludes: [
      'A question list from real enquiries',
      'A URL for each question',
      'Draft answers for engineering to check',
      'Notes on questions that should not be published',
    ],
    offerNext: 'More families can follow. We do not promise that an answer engine will quote the page.',
    ctaLabel: 'Discuss AEO',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'Answers for one product family, placed on the existing URLs.' },
      { format: 'campaign', duration: '3_months', text: 'Further questions once the first answers match how sales actually replies.' },
    ],
    faqs: [
      {
        question: 'Does AEO guarantee a featured snippet or an AI answer?',
        answer: 'No. The deliverable is a clear answer on the right page. How a search or answer system uses it is not guaranteed.',
      },
      {
        question: 'Should every page have an FAQ?',
        answer: 'No. An answer belongs where the question is asked. A repeated FAQ block across the catalog usually adds duplication.',
      },
      {
        question: 'Who checks technical accuracy?',
        answer: 'Your engineering or product staff. We will not publish a limit, a standard, or a compatibility claim they have not confirmed.',
      },
      {
        question: 'Is this only for voice search?',
        answer: 'No. The readers are engineers, procurement, and distributors. The same clarity helps a person and any system summarizing the page.',
      },
    ],
    ctaHeading: 'Bring the question sales answers every week',
    ctaBody: 'If the reply already exists in email, the work is to put the accurate version on the page where the buyer looked first.',
    imageSource: 'blog-content-engineering-semantic-chunking.jpg',
    imageFile: 'service-aeo.jpg',
    alt: 'Laptop showing a specification grid, with drawings and machined parts on the desk.',
    displayOrder: 24,
    related: [
      'ai-search-optimization-content-engineering',
      'technical-content-strategy',
      'entity-authority-building',
    ],
  },
  {
    slug: 'ai-visibility-citation-audits',
    title: 'AI Visibility & Citation Audits',
    h1: 'A dated check of how assistants describe your company and products',
    previewDescription:
      'A qualitative audit of AI-generated answers about a manufacturer: which sources appear, which facts are wrong, and which public pages are missing.',
    metaTitle: 'AI Visibility and Citation Audits for Manufacturers',
    metaDescription:
      'Review how assistants describe your company and products, which pages they cite, and where the public site is incomplete. A missing mention is not a penalty.',
    intro: [
      'An AI visibility audit asks a real buyer question, records the date, and writes down what the assistant said and which sources it showed. It is a qualitative check, not a score and not a ranking.',
      'A missing mention is not a penalty. A wrong mention is more useful, because it often points at a vague or contradictory page you can correct.',
    ],
    body:
      h2('What gets recorded') +
      paragraphs(
        'We use questions your customers would ask: what you make, whether a product fits an application, and how you differ from a named alternative only when that comparison is fair. For each question we note the assistant, the date, the answer, and any cited URL. ChatGPT, Gemini, Perplexity, and others can disagree with each other on the same day. The audit does not average them into a single grade.',
        'Where a source is cited, we check whether it is your page, a distributor, a directory, or something outdated. Where no source is cited, we still record the claim. The output is a gap list: invented capabilities, missing product names, and pages that exist but do not state the fact the answer needed.',
      ) +
      h2('What the audit does not sell') +
      paragraphs(
        'It does not sell a method to force a citation. After the audit, GEO and content engineering can make the public page more explicit. Whether the next answer changes is something you can recheck later. We will not present a one-time sample as proof of a permanent result.',
      ) +
      '<p>Preparing the pages is <a href="/services/search/ai-search-optimization-geo">GEO</a>. Aligning public names and outside references is <a href="/services/search/entity-authority-building">entity and authority building</a>.</p>',
    situations: [
      {
        title: 'Sales heard an assistant describe a product you discontinued.',
        text: 'The audit finds the question, the date, and the source, so the correction has a target.',
      },
      {
        title: 'Leadership wants to know if AI search mentions the company.',
        text: 'A dated sample answers that more honestly than a dashboard with an invented visibility score.',
      },
      {
        title: 'Citations point at a distributor or an old PDF.',
        text: 'The audit shows which URL is being used. Updating your own page may still leave the other source in place, and we will say so.',
      },
    ],
    scope: [
      {
        title: 'Question set',
        text: 'Buyer questions agreed with you, covering the company and the priority products. We do not pad the list with vanity prompts.',
      },
      {
        title: 'Recorded answers',
        text: 'Assistant, date, answer summary, and cited sources when the interface shows them. Screenshots or exports are kept with the notes.',
      },
      {
        title: 'Gap list',
        text: 'Wrong claims, missing distinctions, and the public page that should have carried the fact. Fixes are recommended, not guaranteed to change the next answer.',
      },
    ],
    steps: [
      {
        title: 'Agree the questions and the tools',
        text: 'We pick the assistants your buyers might use and the questions sales recognizes. The set stays small enough to read.',
      },
      {
        title: 'Run and record',
        text: 'Each answer is captured with the date. We do not rerun a prompt until it flatters the company.',
      },
      {
        title: 'Compare with the site',
        text: 'Claims are checked against your current pages. A flattering error is still an error.',
      },
      {
        title: 'Recommend the page changes',
        text: 'The next work may be GEO, content engineering, or an entity correction. The audit itself stops at the evidence.',
      },
    ],
    offerTitle: 'Start with one product line',
    offerText:
      'The first audit uses a short question list about the company and one product line. You receive the records and the gaps, not a score.',
    offerIncludes: [
      'An agreed question list',
      'Dated answers from the assistants you choose',
      'Cited sources where the tool shows them',
      'A gap list tied to your pages',
    ],
    offerNext: 'A later sample can compare the same questions. It is a new observation, not a promise that the answers improved.',
    ctaLabel: 'Discuss a citation audit',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'One dated sample for the company and a priority product line.' },
      { format: 'campaign', duration: '3_months', text: 'A follow-up sample after page changes, using the same questions.' },
    ],
    faqs: [
      {
        question: 'Is a missing citation a failure?',
        answer: 'No. Many answers do not cite sources. The useful finding is a wrong claim or a gap on your own site.',
      },
      {
        question: 'Will the same prompt give the same answer next month?',
        answer: 'Not necessarily. That is why every record has a date. We do not treat one session as a stable ranking.',
      },
      {
        question: 'Do you audit every AI product?',
        answer: 'No. We use the ones relevant to your buyers and say which ones were included.',
      },
      {
        question: 'Can the audit invent competitor weaknesses?',
        answer: 'No. Comparisons are limited to claims you can support. The audit is about accuracy, not a script for disparagement.',
      },
    ],
    ctaHeading: 'Bring the answer that described you incorrectly',
    ctaBody: 'A single wrong description, with the question that produced it, is enough to scope the first sample.',
    imageSource: 'blog-ai-search-b2b.jpg',
    imageFile: 'service-citation-audits.jpg',
    alt: 'Technical drawings and industrial components on a table in a factory office.',
    displayOrder: 25,
    related: ['ai-search-optimization-geo', 'entity-authority-building', 'seo-ai-search-optimization'],
  },
  {
    slug: 'entity-authority-building',
    title: 'Entity & Authority Building',
    h1: 'Clear company and product names, backed by references that match the site',
    previewDescription:
      'Company and product identity, consistent public descriptions, and credible outside mentions that agree with what the website already says.',
    metaTitle: 'Entity and Authority Building for Industrial Firms',
    metaDescription:
      'Clarify the company, brand, and product names buyers should recognize, then add outside references that match the site. Identical directory blurbs do not count.',
    intro: [
      'A manufacturer is hard to recognize when the legal name, the brand, the product line, and the parent company are used as if they were the same thing. Search systems and buyers both inherit that confusion.',
      'Entity work makes those names distinct. Authority work adds outside references that repeat the same facts. A directory full of identical blurbs does not do either job.',
    ],
    body:
      h2('Identity before mentions') +
      paragraphs(
        'We write down the entity that should be understood: the company, the brands it sells under, the product families, and the industries those families serve. Distributor pages, old acquisitions, and regional spellings are listed when they collide with that description. The website is corrected first. Sending a third party a description the site does not support only spreads the conflict.',
        'External mentions are then chosen for relevance. A technical publication, a standards body listing you actually appear in, a trade association, or a partner page can help a buyer and a search system connect the name to the work. The mention has to match the site. We do not buy lists of low-quality links or write fake expert profiles.',
      ) +
      h2('How this supports search without becoming the whole program') +
      paragraphs(
        'Clear entities help industrial SEO, GEO, and citation audits because they give each of those a stable subject. They do not replace product pages. An authoritative mention of a vague company still leaves the product unexplained.',
      ) +
      '<p>International naming and market structure belong with <a href="/services/strategy/international-marketing-strategy">international marketing strategy</a>. Published technical explanation belongs with <a href="/services/content/technical-content-strategy">technical content</a>.</p>',
    situations: [
      {
        title: 'The brand, the legal entity, and a product line share one muddled description.',
        text: 'Pages and directories describe them interchangeably. The first task is a name map people can follow.',
      },
      {
        title: 'An acquisition still ranks under the old company name.',
        text: 'The relationship has to be stated. Pretending the old name never existed usually leaves two conflicting descriptions in circulation.',
      },
      {
        title: 'Someone proposed a large directory submission package.',
        text: 'We decline identical blurbs. A mention is useful when the site and the reader would both recognize it as true.',
      },
    ],
    scope: [
      {
        title: 'Name map',
        text: 'Legal entity, brands, product families, and the phrases that should not be used as synonyms.',
      },
      {
        title: 'On-site consistency',
        text: 'Company and product descriptions aligned to that map, including titles and footer details that currently disagree.',
      },
      {
        title: 'External references',
        text: 'A short list of relevant places to clarify or contribute, with the exact description to use. No purchased link schemes.',
      },
    ],
    steps: [
      {
        title: 'Gather the names in current use',
        text: 'Site, quotes, directories, and the way sales introduces the company on a call.',
      },
      {
        title: 'Decide the canonical description',
        text: 'One description for the company and one for each priority brand or family. Engineering checks product lines.',
      },
      {
        title: 'Correct the site',
        text: 'Conflicts on your own pages are fixed before any outside request is sent.',
      },
      {
        title: 'Place a few matching references',
        text: 'Only where a real publication, association, or partner page is appropriate. Volume is not the goal.',
      },
    ],
    offerTitle: 'Start with the name map',
    offerText:
      'The first deliverable is the name map and the on-site conflicts. Outside mentions are proposed only after the site agrees with itself.',
    offerIncludes: [
      'A name map for the company and priority brands',
      'A list of on-site conflicts',
      'Corrected description text for those pages',
      'A short, relevant list of outside references to consider',
    ],
    offerNext: 'Further mentions are optional and are judged one by one. We do not sell a count of links.',
    ctaLabel: 'Discuss entity work',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'Name map, on-site corrections, and a reference shortlist.' },
      { format: 'ongoing_monthly', duration: '3_months', text: 'A small number of additional references after the site is consistent.' },
    ],
    faqs: [
      {
        question: 'Do you build links at a promised rate?',
        answer: 'No. We do not sell a monthly link count. A reference is included only when it is relevant and accurate.',
      },
      {
        question: 'Will this make AI systems treat us as an authority?',
        answer: 'No system owes you that status. Consistent names and real references make you easier to recognize. They do not force a citation.',
      },
      {
        question: 'Can you create expert profiles for staff we do not have?',
        answer: 'No. Biographies and authorship have to match real people and real roles.',
      },
      {
        question: 'What if a parent company owns the brand?',
        answer: 'The relationship should be stated plainly. Hiding it creates two entities that search systems may merge incorrectly.',
      },
    ],
    ctaHeading: 'Bring the two names that keep getting confused',
    ctaBody: 'If the website, a directory, and a quote each introduce the company differently, the name map is the first document to write.',
    imageSource: 'blog-ai-outreach-entity-visibility.jpg',
    imageFile: 'service-entity-authority.jpg',
    alt: 'Engineer reviewing a technical drawing in a factory office, with a laptop on the desk.',
    displayOrder: 26,
    related: [
      'ai-visibility-citation-audits',
      'technical-content-strategy',
      'international-marketing-strategy',
    ],
  },
  {
    slug: 'international-multilingual-seo',
    title: 'International & Multilingual SEO',
    h1: 'Search structure for manufacturers that sell in more than one language',
    previewDescription:
      'International search architecture, language and regional targeting, and localized technical pages for markets you actually serve and can maintain.',
    metaTitle: 'International and Multilingual SEO for Manufacturers',
    metaDescription:
      'Plan multilingual structure, regional targeting, and localized technical pages for manufacturers that sell in those markets. A vague translation is not enough.',
    intro: [
      'A second language is justified when you sell in it and can keep the specifications current. A translated copy of a vague page does not open a country.',
      'This service plans the structure: which markets, which language, how the URLs are organized, and which technical pages are worth localizing rather than merely translated.',
    ],
    body:
      h2('Market first, translation second') +
      paragraphs(
        'We start from where you already quote, ship, or support. A country with a distributor and a local standard is a different problem from a country you would like to appear in. Hreflang, country folders, and language switchers are chosen to match that reality. They are not applied because a checklist said every site needs them.',
        'Localized technical content means the standard, the unit, the document, and the enquiry path a buyer in that market expects. A word-for-word translation of an English slogan does not carry a DIN or an ASTM distinction. Where the specification is identical, we say so and avoid inventing a local difference.',
      ) +
      h2('Maintenance is the constraint') +
      paragraphs(
        'Every extra language is another set of pages that can go stale. If a pressure rating changes in English and not in the other language, you have published a conflict. The plan names who updates each language and which pages are in scope. Pages you cannot maintain stay in one language.',
      ) +
      '<p>The commercial choice of markets belongs with <a href="/services/strategy/international-marketing-strategy">international marketing strategy</a>. Building the templates belongs with <a href="/services/website/website-development">website development</a>.</p>',
    situations: [
      {
        title: 'The site is English only, and sales already quotes in another language.',
        text: 'The gap is real. The first decision is which product families are worth maintaining in that language.',
      },
      {
        title: 'A translation of the whole site was proposed before the English pages were specific.',
        text: 'Translating a vague catalog produces a vague catalog in two languages. Specific English pages come first.',
      },
      {
        title: 'Several country URLs exist and they contradict each other.',
        text: 'Hreflang will not repair conflicting specifications. The audit of those pages is part of this work.',
      },
    ],
    scope: [
      {
        title: 'Market and language scope',
        text: 'Which countries and languages are in, based on sales you can support, and which are explicitly out.',
      },
      {
        title: 'URL and targeting model',
        text: 'Folders, subdomains, or a single locale structure, plus hreflang only where the pages truly correspond.',
      },
      {
        title: 'Localization rules',
        text: 'What must be rewritten for the local standard or unit, and what can stay aligned with the source specification.',
      },
    ],
    steps: [
      {
        title: 'Confirm the markets with sales',
        text: 'We use shipments, quotes, and distributor coverage. A wish list of countries is not a search plan.',
      },
      {
        title: 'Choose the URL model',
        text: 'The structure has to survive another language later. We avoid a pattern you would have to undo.',
      },
      {
        title: 'Specify the pages to localize',
        text: 'Priority product and application pages, plus the enquiry path. The rest of the brochure can wait.',
      },
      {
        title: 'Define the update rule',
        text: 'Who changes a specification, and how the other language is updated in the same pass.',
      },
    ],
    offerTitle: 'Start with one additional language',
    offerText:
      'The first plan covers one language you already sell in, and the product families that must be accurate in it.',
    offerIncludes: [
      'A market note tied to current sales',
      'A URL and hreflang recommendation',
      'A page list for localization',
      'An update rule so the two languages do not diverge',
    ],
    offerNext: 'Further languages wait until the first one has an owner. We do not translate the entire site by default.',
    ctaLabel: 'Discuss international SEO',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'Structure and page scope for one additional language.' },
      { format: 'campaign', duration: '6_months', text: 'A second market after the first language is being maintained.' },
    ],
    faqs: [
      {
        question: 'Do you translate the site yourselves?',
        answer: 'We specify what must be localized and review whether the result still states the specification. Professional translation is arranged as needed and is not a hidden extra claim of fluency in every language.',
      },
      {
        question: 'Is hreflang always required?',
        answer: 'Only when you have corresponding pages in more than one language or region. Adding it to a single-language site does nothing useful.',
      },
      {
        question: 'Should each country have a different homepage slogan?',
        answer: 'Not unless the offer changes. Local pages are for local standards, units, documents, and enquiry paths.',
      },
      {
        question: 'Can this work if we have no local staff?',
        answer: 'Only for languages you can still keep accurate, often through a distributor who will review technical lines. Otherwise stay with one language.',
      },
    ],
    ctaHeading: 'Bring the language sales already uses',
    ctaBody: 'If quotes go out in a language the website does not speak, that language is the one to plan, not a list of flags.',
    imageSource: 'blog-content-distribution-zero-click.jpg',
    imageFile: 'service-international-seo.jpg',
    alt: 'Industrial sales professional reviewing product documents and a tablet on a factory floor.',
    displayOrder: 27,
    related: ['international-marketing-strategy', 'website-development', 'industrial-seo'],
  },
  {
    slug: 'local-multi-location-seo',
    title: 'Local & Multi-Location SEO',
    h1: 'Location pages for plants, branches, and service areas that change the offer',
    previewDescription:
      'Local search for plants, distributors, showrooms, and branches, including location pages and consistent business information where the offer actually changes.',
    metaTitle: 'Local and Multi-Location SEO for Industrial Companies',
    metaDescription:
      'Local search for plants, showrooms, and branches, with location pages and consistent business details. A city name on the homepage is not the work.',
    intro: [
      'A city name on the homepage is not a local strategy. A location page is justified when a plant, a stock point, a showroom, a branch, or a service area changes what the buyer can get.',
      'This service is for manufacturers, distributors, and industrial firms that operate in more than one place, or in one place where local search is how nearby buyers look for them.',
    ],
    body:
      h2('When a location deserves a page') +
      paragraphs(
        'A plant that cuts or stocks a range, a service team with a territory, or a showroom where a buyer can see the product can each deserve a page. The page should say what happens at that place: what is made, what is stocked, who it serves, and how to start an enquiry. Copying the homepage and swapping the city is how these projects go wrong.',
        'Business information has to match across the website, Google Business Profile where you use it, and the documents a buyer receives. Conflicting phone numbers and old addresses create doubt, and they create conflicting local listings. We list the locations that are real and the listings that should be closed or corrected.',
      ) +
      h2('What we will not build') +
      paragraphs(
        'We will not publish a page for every city in a region you do not serve. Service-area pages are limited to areas where you will actually respond. Paid search for those locations, when it is useful, is a separate Google Ads decision and should use the same location facts.',
      ) +
      '<p>The templates for those pages are a <a href="/services/website/website-development">development</a> and <a href="/services/website/industrial-website-design">design</a> question. Local queries with a budget sit with <a href="/services/paid-media/google-ads-manufacturers">Google Ads for manufacturers</a>.</p>',
    situations: [
      {
        title: 'Several branches exist and only the headquarters is on the site.',
        text: 'Buyers near a branch cannot tell whether that branch stocks or only forwards calls. The page should say which.',
      },
      {
        title: 'Google listings still show a closed unit or an old phone number.',
        text: 'The audit lists the profiles and the corrections. New city pages do not fix a wrong listing by themselves.',
      },
      {
        title: 'A vendor proposed dozens of city pages for SEO.',
        text: 'We will not do that. If the offer does not change by city, one clear service-area statement is enough.',
      },
    ],
    scope: [
      {
        title: 'Location inventory',
        text: 'Plants, branches, showrooms, distributors you control pages for, and service areas, with what each one actually offers.',
      },
      {
        title: 'Location pages',
        text: 'A template and the facts for each justified location: offer, coverage, and enquiry path. Empty city pages are excluded.',
      },
      {
        title: 'Listing consistency',
        text: 'Name, address, phone, and hours where you publish them, aligned on the site and on Google Business Profile profiles you already use.',
      },
    ],
    steps: [
      {
        title: 'List the real locations',
        text: 'We use the places you operate, not a keyword list of cities. Closed sites are marked for removal from public listings.',
      },
      {
        title: 'Decide which ones need a URL',
        text: 'A page exists when the offer or the coverage changes. Otherwise the location stays in a single directory block.',
      },
      {
        title: 'Write the distinguishing facts',
        text: 'What is made or stocked, who is served, and how to enquire. A map embed is not a substitute for that paragraph.',
      },
      {
        title: 'Align the public listings',
        text: 'The same facts are applied to the profiles you control. We do not claim to control directories you cannot access.',
      },
    ],
    offerTitle: 'Start with the location list',
    offerText:
      'The first pass decides which locations deserve a page and which listings are wrong. Pages are written only for the justified set.',
    offerIncludes: [
      'An inventory of locations and what they offer',
      'A yes or no on a URL for each',
      'Draft facts for the pages you approve',
      'A listing correction list for profiles you control',
    ],
    offerNext: 'Additional branches can be added later under the same rule. City pages without an offer are declined.',
    ctaLabel: 'Discuss local SEO',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'Location inventory, page decisions, and listing corrections.' },
      { format: 'ongoing_monthly', duration: '3_months', text: 'New branches added under the same template as they open.' },
    ],
    faqs: [
      {
        question: 'Do you create a Google Business Profile for every city?',
        answer: 'No. Profiles should match real locations. A service-area business is described as one, not as a stack of fake offices.',
      },
      {
        question: 'We ship nationally. Do we need local pages?',
        answer: 'Only if a place changes the offer. National shipping alone is not a reason for a city page.',
      },
      {
        question: 'Will local pages rank for every nearby town?',
        answer: 'No. The page is there to explain a real location. Rankings are not guaranteed for every surrounding city.',
      },
      {
        question: 'Can distributors have pages on our site?',
        answer: 'Only when you are responsible for the accuracy of that page and the distributor relationship is current.',
      },
    ],
    ctaHeading: 'Bring the branch the website never mentions',
    ctaBody: 'If a location stocks, builds, or serves a territory, and the site does not say so, that is the page to specify.',
    imageSource: 'blog-first-party-data-manufacturing.jpg',
    imageFile: 'service-local-seo.jpg',
    alt: 'Steel component, a caliper, and a technical drawing on a workbench.',
    displayOrder: 28,
    related: ['website-development', 'google-ads-manufacturers', 'industrial-website-design'],
  },
  {
    slug: 'search-engine-marketing-sem',
    title: 'Search Engine Marketing (SEM)',
    h1: 'Paid search built from the catalog and the queries sales can quote',
    previewDescription:
      'Paid search strategy across engines: structure, intent, budgets, and landing pages for manufacturer queries that sales can actually answer.',
    metaTitle: 'Search Engine Marketing for Manufacturing Companies',
    metaDescription:
      'Paid search strategy for manufacturers: campaign structure, query intent, budgets, and landing pages for products sales can quote. No lead quota is promised.',
    intro: [
      'Search engine marketing is the discipline of paying for a query you can answer, on a page that matches it, with a person assigned to the reply. Google is usually the largest account. Microsoft is included when the same queries justify a second one.',
      'This page is the overall paid search service. It is not a substitute for the Google Ads page or the Microsoft Ads page, which cover those platforms in more detail.',
    ],
    body:
      h2('Structure before spend') +
      paragraphs(
        'Campaigns should follow the catalog. A product family that sales can quote gets an ad group and a landing page that names that family. Research queries, career searches, and queries for products you do not make are separated or excluded. A single campaign aimed at the homepage wastes the click and makes the report impossible to read.',
        'Budgets follow the families you can respond to this month, not an even split across every word in an industry list. We keep poor-fit clicks visible so they can be cut. The useful report is enquiries that name a product or an application, not the cheapest cost per click.',
      ) +
      h2('How the engines fit together') +
      paragraphs(
        'The keyword logic, the negatives, and the landing pages should be shared. Google and Microsoft do not need two stories. They need the same offer and a clear reason to run the second account. Social, outbound, and email sit beside this work. They are not line items inside an SEM campaign.',
      ) +
      '<p>Platform specifics are on the <a href="/services/paid-media/google-ads-manufacturers">Google Ads</a> and <a href="/services/paid-media/microsoft-ads">Microsoft Ads</a> pages. The queries worth buying often overlap <a href="/services/search/industrial-seo">industrial SEO</a>.</p>',
    situations: [
      {
        title: 'Spend is up and sales cannot tell which clicks became quotes.',
        text: 'The account is probably organized by channel habit rather than by product family. Structure is the first correction.',
      },
      {
        title: 'One campaign sends every query to the homepage.',
        text: 'The landing page has to name the product in the query. Homepage traffic is treated as a mismatch until proven otherwise.',
      },
      {
        title: 'A second engine was opened because a vendor said to diversify.',
        text: 'A second account is justified by query volume and by someone to read the leads, not by a diversification slogan.',
      },
    ],
    scope: [
      {
        title: 'Query and intent map',
        text: 'Product, supplier, and research queries, marked as buy, separate, or exclude, based on what sales can quote.',
      },
      {
        title: 'Account structure',
        text: 'Campaigns and ad groups aligned to families, with shared negatives and landing pages. Engine choice is explicit.',
      },
      {
        title: 'Measurement',
        text: 'Enquiries that name a product or application, plus the poor-fit clicks that should be reduced. No promised cost per lead.',
      },
    ],
    steps: [
      {
        title: 'List the families sales will answer',
        text: 'Paid search starts from capacity. A family with no one to reply is not a campaign.',
      },
      {
        title: 'Map queries to pages',
        text: 'If the page does not exist, the campaign waits or the page is scoped. We do not advertise a PDF nobody linked.',
      },
      {
        title: 'Build the account',
        text: 'Structure, ads, and negatives follow the map. Google and Microsoft use the same landing rules.',
      },
      {
        title: 'Read the enquiries with sales',
        text: 'The optimization loop uses sales feedback. A click that sales will not call is not counted as success.',
      },
    ],
    offerTitle: 'Start with the queries you can quote',
    offerText:
      'The first review covers one or two families, the pages they have, and whether paid search should run at all.',
    offerIncludes: [
      'A query map for those families',
      'A landing-page check',
      'A structure recommendation for Google and, if justified, Microsoft',
      'A note on what not to advertise',
    ],
    offerNext: 'Live campaigns follow only when a page and a person can carry the replies. Results are not guaranteed.',
    ctaLabel: 'Discuss paid search',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'Strategy and structure for the priority families.' },
      { format: 'ongoing_monthly', duration: '3_months', text: 'Management of the accounts once the structure and the reply path exist.' },
    ],
    faqs: [
      {
        question: 'Is SEM the same as Google Ads?',
        answer: 'Google Ads is the usual platform. SEM is the wider paid search discipline, including Microsoft when it earns a place, and the shared structure behind both.',
      },
      {
        question: 'Do you promise a cost per lead?',
        answer: 'No. Industrial cycles are long, and a cheap click is often the wrong click. We report enquiries sales can use.',
      },
      {
        question: 'Can you run ads before the landing page exists?',
        answer: 'We advise against it. The page is part of the campaign. A homepage detour is a common way to waste the budget.',
      },
      {
        question: 'Who owns the ad account?',
        answer: 'You do. We work in an account your company controls.',
      },
    ],
    ctaHeading: 'Bring the campaign that lands on the homepage',
    ctaBody: 'If a product query opens a general page, the structure is the problem to fix before the budget is increased.',
    imageSource: 'blog-google-ads-manufacturing.jpg',
    imageFile: 'service-sem.jpg',
    alt: 'Industrial control room with documents on a desk and unmarked screens.',
    displayOrder: 31,
    related: ['google-ads-manufacturers', 'microsoft-ads', 'industrial-seo'],
  },
  {
    slug: 'google-ads-manufacturers',
    title: 'Google Ads for Manufacturers',
    h1: 'Google Ads for technical product searches and RFQ-oriented campaigns',
    previewDescription:
      'Google Ads for manufacturers: product and equipment searches, application queries, and campaigns aimed at qualified B2B enquiries rather than raw traffic.',
    metaTitle: 'Google Ads for Manufacturers and Industrial Suppliers',
    metaDescription:
      'Google Ads for manufacturers: product searches, equipment queries, and RFQ campaigns. Research traffic stays separate from real quote intent.',
    intro: [
      'Google is where an engineer or a buyer types a product, a standard, or a supplier need. For a manufacturer, the useful campaign is the one that meets that query with a page and an enquiry path sales will answer.',
      'This is the Google-specific service. Account structure that also covers Microsoft lives under search engine marketing. The queries and the pages should still match.',
    ],
    body:
      h2('Industrial queries are easy to waste') +
      paragraphs(
        'A broad match on a machine type can buy students, competitors, and people who needed a manual. We separate supplier and product queries you can quote from research queries that belong on an application page or nowhere in the paid account. Equipment, spare parts, and application searches are not one ad group unless the landing page truly serves all three.',
        'RFQ-oriented campaigns ask for the details a quote needs: model, duty, or drawing. The form is part of the campaign. A click that reaches a homepage contact box with no product context is a weak enquiry even when the ad was relevant.',
      ) +
      h2('What we measure') +
      paragraphs(
        'We look at search terms, the page they opened, and whether the enquiry named a product. We do not promise a conversion rate or a cost per lead. Quotes issued, on the sales calendar, matter more than the platform column labeled conversions when that column is only a form fill.',
      ) +
      '<p>The product pages are often <a href="/services/website/product-catalogs-ecommerce">catalog</a> work, and the form is <a href="/services/website/rfq-forms-conversion-optimization">RFQ and conversion</a> work. Unpaid coverage of the same queries is <a href="/services/search/industrial-seo">industrial SEO</a>.</p>',
    situations: [
      {
        title: 'The account has traffic and sales calls the leads junk.',
        text: 'Search terms and landing pages usually explain it. The fix is tighter queries and a page that matches them.',
      },
      {
        title: 'A new product line needs demand before the organic page has history.',
        text: 'Paid search can test whether the family is looked for. It still needs a page that states the product.',
      },
      {
        title: 'Brand searches are the only profitable part of the account.',
        text: 'That is worth keeping and worth understanding. It is not evidence that non-brand product queries should be forced.',
      },
    ],
    scope: [
      {
        title: 'Search term control',
        text: 'Product, equipment, application, and supplier queries, with negatives for the terms sales will not call.',
      },
      {
        title: 'Landing pages and RFQ paths',
        text: 'Each active ad group opens a page about that product, with a way to send a drawing or a model number.',
      },
      {
        title: 'Ongoing search-term review',
        text: 'Regular checks of what Google actually matched, not only the keywords that were entered.',
      },
    ],
    steps: [
      {
        title: 'Export what the account already bought',
        text: 'If an account exists, search terms tell us the waste. If it does not, we start from the catalog.',
      },
      {
        title: 'Pair each ad group with a URL',
        text: 'No URL, no ad group. Homepage exceptions are rare and have to be justified.',
      },
      {
        title: 'Launch a narrow set',
        text: 'Priority families only. Budget is easier to read when it is not spread across the whole industry vocabulary.',
      },
      {
        title: 'Review enquiries with sales',
        text: 'Terms that produce poor-fit contacts are excluded. Terms that produce quotable enquiries are kept and watched.',
      },
    ],
    offerTitle: 'Start with one family in Google',
    offerText:
      'The first campaign, or the first cleanup, covers one product family and its landing page. You see search terms before the account grows.',
    offerIncludes: [
      'Search-term and query review',
      'Ad groups tied to real URLs',
      'Negative recommendations',
      'A simple read of which enquiries named a product',
    ],
    offerNext: 'More families are added only when the first one produces contacts sales will take. No cost per lead is quoted in advance.',
    ctaLabel: 'Discuss Google Ads',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'Setup or cleanup for one product family.' },
      { format: 'ongoing_monthly', duration: '3_months', text: 'Management, search-term review, and landing-page feedback.' },
    ],
    faqs: [
      {
        question: 'Do you guarantee a number of leads?',
        answer: 'No. Lead volume depends on search demand, the page, the offer, and how strictly poor-fit queries are excluded.',
      },
      {
        question: 'Is broad match acceptable?',
        answer: 'Sometimes, with close review of search terms. Left alone, it is a common way for an industrial account to buy irrelevant clicks.',
      },
      {
        question: 'Can ads point at a PDF?',
        answer: 'Prefer an HTML page that states the product and offers the PDF. A file with no context is a weak landing page.',
      },
      {
        question: 'Do you also run Microsoft?',
        answer: 'Yes, when the query set supports it. That decision is covered under search engine marketing and the Microsoft Ads service.',
      },
    ],
    ctaHeading: 'Bring the search terms sales rejected',
    ctaBody: 'A list of wasted queries is a better brief than a target cost per lead.',
    imageSource: 'svc-page-website.jpg',
    imageFile: 'service-google-ads.jpg',
    alt: 'Factory floor seen from an unmarked industrial office.',
    displayOrder: 32,
    related: ['industrial-seo', 'product-catalogs-ecommerce', 'rfq-forms-conversion-optimization'],
  },
  {
    slug: 'microsoft-ads',
    title: 'Microsoft Ads',
    h1: 'Microsoft Advertising as a second search network, on the same landing pages',
    previewDescription:
      'Microsoft Ads for manufacturers when the query set justifies a second search account, using the same pages and the same rules as the Google program.',
    metaTitle: 'Microsoft Advertising for Industrial Manufacturers',
    metaDescription:
      'Microsoft Ads as a second search network for manufacturers, using the same landing pages and query rules as Google. Added only when the economics support it.',
    intro: [
      'Microsoft Advertising reaches a search audience that overlaps Google and is not identical to it. For a manufacturer, it is worth running when the same product queries appear there at a cost that still makes sense next to the Google account.',
      'It is not a different strategy. The landing pages, the negatives, and the definition of a useful enquiry stay the same.',
    ],
    body:
      h2('A second account, not a second story') +
      paragraphs(
        'Importing a Google account without reading it copies the waste as well as the structure. We open Microsoft for the families already justified in the paid search plan, then check the search terms Microsoft actually serves. Audience options on the Microsoft network are used only when they match a known buyer role or account list, not as a reason to relax the query rules.',
        'LinkedIn data inside Microsoft advertising can be relevant for a named role. It still has to land on a product page. A campaign that targets a job title and opens the homepage is the same mistake as a loose keyword.',
      ) +
      h2('When to leave it off') +
      paragraphs(
        'If the Google account is still unsorted, a second engine adds reporting without adding clarity. If volume for your product terms is thin, the management cost can exceed the value of the clicks. We will say when not to open the account.',
      ) +
      '<p>The shared plan is <a href="/services/paid-media/search-engine-marketing-sem">search engine marketing</a>. The Google-specific work stays on the <a href="/services/paid-media/google-ads-manufacturers">Google Ads</a> page.</p>',
    situations: [
      {
        title: 'Google works for a few families and Microsoft has never been tested.',
        text: 'Those families are the test. The rest of the catalog does not need to be copied on day one.',
      },
      {
        title: 'An imported account is spending on queries you already negated in Google.',
        text: 'The accounts have drifted. The first job is to bring negatives and landing pages back in line.',
      },
      {
        title: 'A proposal treats Microsoft as a branding exercise.',
        text: 'We treat it as search. Brand queries can be included. A vague awareness campaign is a different service.',
      },
    ],
    scope: [
      {
        title: 'Account decision',
        text: 'Whether Microsoft is justified for the current query set, with a clear no when it is not.',
      },
      {
        title: 'Shared structure',
        text: 'Campaigns, negatives, and landing pages aligned with the Google account rather than reinvented.',
      },
      {
        title: 'Search-term checks',
        text: 'Review of what the Microsoft network matched, including partner traffic when it is low quality.',
      },
    ],
    steps: [
      {
        title: 'Compare query value with Google',
        text: 'Families that already produce usable enquiries are the candidates. Unproven families wait.',
      },
      {
        title: 'Build a smaller mirror',
        text: 'The Microsoft account starts narrower than Google. It can grow after the search terms look clean.',
      },
      {
        title: 'Watch the network mix',
        text: 'Search partners and audience expansions are kept only when the enquiries are still relevant.',
      },
      {
        title: 'Report it next to Google, not instead of it',
        text: 'The question is whether the second account adds quotable enquiries, not whether it has its own vanity metrics.',
      },
    ],
    offerTitle: 'Start by deciding if the account should exist',
    offerText:
      'The first step is a recommendation to open, fix, or leave Microsoft Ads, based on the families you already advertise.',
    offerIncludes: [
      'A yes or no on opening or keeping the account',
      'A family list to include',
      'Landing pages shared with Google',
      'A search-term review after launch, if you proceed',
    ],
    offerNext: 'Ongoing management follows only if the account earns it. We do not keep a quiet account open for appearance.',
    ctaLabel: 'Discuss Microsoft Ads',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'A decision and, if warranted, a first Microsoft build for priority families.' },
      { format: 'ongoing_monthly', duration: '3_months', text: 'Management beside the Google account, with shared landing rules.' },
    ],
    faqs: [
      {
        question: 'Should every manufacturer run Microsoft Ads?',
        answer: 'No. It is a second search network. Thin query volume or an unsorted Google account are reasons to wait.',
      },
      {
        question: 'Are the ads copied from Google automatically?',
        answer: 'They can be imported and then edited. An unreviewed import is how bad queries travel.',
      },
      {
        question: 'Do you promise lower costs than Google?',
        answer: 'No. Costs vary by query. A cheaper click that sales will not call is not a saving.',
      },
      {
        question: 'Does this include LinkedIn Ads?',
        answer: 'No. LinkedIn campaigns are a separate service. Audience options inside Microsoft are used only when they support the same search offer.',
      },
    ],
    ctaHeading: 'Bring the Google account before opening a second one',
    ctaBody: 'The useful question is which families already deserve paid search, not which extra logo to add.',
    imageSource: 'blog-technical-content-manufacturing.jpg',
    imageFile: 'service-microsoft-ads.jpg',
    alt: 'Two engineers examining an industrial valve in a workshop.',
    displayOrder: 33,
    related: ['search-engine-marketing-sem', 'google-ads-manufacturers'],
  },
  {
    slug: 'linkedin-ads-b2b-campaigns',
    title: 'LinkedIn Ads & B2B Campaigns',
    h1: 'LinkedIn campaigns aimed at named industrial roles and accounts',
    previewDescription:
      'LinkedIn advertising for engineers, procurement, distributors, and other industrial roles, with account or industry targeting chosen before the creative.',
    metaTitle: 'LinkedIn Ads and B2B Campaigns for Industrial Firms',
    metaDescription:
      'LinkedIn campaigns for engineers, procurement, and distributors, with account or industry targeting. The company list comes before the creative.',
    intro: [
      'LinkedIn can reach a job role or a company list when you already know which plants, OEMs, or distributors matter. It is a poor place to explain a tolerance for the first time.',
      'This service is the LinkedIn-specific campaign. Broader paid social planning, and Meta specifically, are separate pages so the audiences are not blurred together.',
    ],
    body:
      h2('The list comes first') +
      paragraphs(
        'A useful LinkedIn campaign starts with accounts or a tight role and industry: maintenance managers at food plants, buyers at a named OEM, distributor sales engineers in a region. A worldwide audience of anyone with engineer in the title will spend the budget without giving sales a company to call.',
        'The message has to carry a product fact or a reason to open a specific page. Lead gen forms are used when the questions are ones sales wants. A form that asks only for an email produces a name, not an enquiry. We would rather send a serious visitor to a product page than collect a contact with no context.',
      ) +
      h2('How it connects to outbound and ABM') +
      paragraphs(
        'LinkedIn is one way to reach an account list. Outbound is a direct conversation. Account-based marketing is the decision to concentrate on that list across more than one tactic. Running LinkedIn ads without the list is not ABM, and it is not a substitute for search when the buyer is already typing the product name.',
      ) +
      '<p>The account program is <a href="/services/paid-media/account-based-marketing-abm">account-based marketing</a>. Direct contact is <a href="/services/paid-media/outbound-lead-generation">outbound lead generation</a>.</p>',
    situations: [
      {
        title: 'Sales has a target list and no systematic way to reach it.',
        text: 'LinkedIn is a candidate. The list should be short enough that the creative can mention the relevant product.',
      },
      {
        title: 'Previous ads collected emails that sales never called.',
        text: 'The form or the audience was too loose. We rebuild from the accounts and the question you actually need answered.',
      },
      {
        title: 'The product is specified from a drawing, not from a scroll.',
        text: 'LinkedIn can announce a page or a document. It should not be asked to carry the whole specification in an ad.',
      },
    ],
    scope: [
      {
        title: 'Audience definition',
        text: 'Account lists, industries, and roles that match the buyers you can serve. Exclusions for competitors, students, and irrelevant geographies.',
      },
      {
        title: 'Offer and format',
        text: 'Sponsored content, document ads, or lead forms, chosen because they fit the next step, not because the format is available.',
      },
      {
        title: 'Handoff to sales',
        text: 'What counts as a contact worth a call, and which responses are only page visits.',
      },
    ],
    steps: [
      {
        title: 'Freeze the account or role list',
        text: 'Campaigns do not start from a stock audience. Sales confirms the companies or the role definition.',
      },
      {
        title: 'Choose the page they should reach',
        text: 'A product, an application, or a document. The ad does not outrun the page.',
      },
      {
        title: 'Run a small test',
        text: 'Spend is limited until the responses are recognizable to sales. Scale is not the first goal.',
      },
      {
        title: 'Compare with outbound',
        text: 'If the same accounts are also being emailed, the messages should not contradict each other.',
      },
    ],
    offerTitle: 'Start with the account list',
    offerText:
      'The first recommendation says whether LinkedIn fits the list you already have, and what the ad should ask the reader to do.',
    offerIncludes: [
      'An audience definition sales agrees with',
      'A destination page',
      'Message notes tied to a product fact',
      'A rule for which responses are worth a call',
    ],
    offerNext: 'Live spend follows that rule. We do not promise a volume of leads or a cost per lead.',
    ctaLabel: 'Discuss LinkedIn ads',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'Audience, offer, and a first flight against a defined list.' },
      { format: 'ongoing_monthly', duration: '3_months', text: 'Further flights as the account list and the pages change.' },
    ],
    faqs: [
      {
        question: 'Is LinkedIn the default B2B channel?',
        answer: 'No. It fits named roles and accounts. Buyers who are already searching for a part are usually better served by search.',
      },
      {
        question: 'Do you guarantee meetings?',
        answer: 'No. A campaign can put a relevant page in front of a relevant role. A meeting depends on the offer and on sales follow-up.',
      },
      {
        question: 'Can you target a specific plant?',
        answer: 'Sometimes, through a company list. Match rates vary. We will not pretend every subsidiary is targetable by name.',
      },
      {
        question: 'Is this the same as paid social in general?',
        answer: 'No. Paid social is the cross-platform decision. This page is LinkedIn only.',
      },
    ],
    ctaHeading: 'Bring the account list before the ad design',
    ctaBody: 'If the companies are not named, the campaign is not ready, regardless of how polished the creative looks.',
    imageSource: 'blog-linkedin-b2b-manufacturing.jpg',
    imageFile: 'service-linkedin-ads.jpg',
    alt: 'Engineers reviewing a machined metal part together.',
    displayOrder: 34,
    related: ['account-based-marketing-abm', 'outbound-lead-generation'],
  },
  {
    slug: 'facebook-instagram-ads',
    title: 'Facebook & Instagram Ads',
    h1: 'Meta ads for manufacturers when the product or the dealer network is visual',
    previewDescription:
      'Facebook and Instagram campaigns for industrial companies when awareness, remarketing, recruitment-related audiences, or a visual product justify Meta.',
    metaTitle: 'Facebook and Instagram Ads for Industrial Companies',
    metaDescription:
      'Meta ads for manufacturers when a visual product, a dealer network, or remarketing fits Facebook or Instagram. A drawing-led part is rarely the first choice.',
    intro: [
      'Facebook and Instagram are a weak default for a component that is specified from a drawing. They can still be the right place for a visual product, a dealer network, a recruitment-related business audience, or a remarketing message to people who already visited.',
      'This page is only the Meta platforms. The decision of whether any social network belongs in the plan is the broader paid social service.',
    ],
    body:
      h2('Use Meta for a job it can do') +
      paragraphs(
        'A machine that is easier to understand in a short video, a consumer-adjacent industrial product, or a brand that sells through dealers can use Instagram or Facebook to stay present during a long buying cycle. The click is rarely the purchase. The job is recognition, a return visit, or a dealer enquiry, and the landing page has to match that job.',
        'Recruitment-related audiences are included only when hiring is actually part of the brief, and they are not mixed into a product campaign. Remarketing on Meta should show a next fact, a document, or an event, not the same slogan the visitor already ignored.',
      ) +
      h2('What we leave to other pages') +
      paragraphs(
        'Engineers and procurement staff are often reached more honestly on LinkedIn or on search. Putting the same technical paragraph into an Instagram ad does not make it a Meta strategy. We will recommend skipping Meta when the catalog is the whole story.',
      ) +
      '<p>Remarketing logic that is not tied to one platform is covered under <a href="/services/paid-media/remarketing-retargeting">remarketing</a>. The wider social mix is <a href="/services/paid-media/paid-social-advertising">paid social advertising</a>.</p>',
    situations: [
      {
        title: 'Dealers ask for help promoting a visual product in their region.',
        text: 'Meta can support that if the product is shown accurately and the enquiry path is the dealer or a clear RFQ, not a vague signup.',
      },
      {
        title: 'A previous boost of a company photo produced likes and no conversations.',
        text: 'That is the expected result of a boost. A campaign needs an audience and a next step, or it should stop.',
      },
      {
        title: 'The buying cycle is long and search only catches the last query.',
        text: 'A restrained remarketing or awareness flight can keep the product visible. It is support, not the primary source of specifications.',
      },
    ],
    scope: [
      {
        title: 'Fit check',
        text: 'Whether Meta is appropriate for this product and audience, including a recommendation not to run it.',
      },
      {
        title: 'Campaigns with a job',
        text: 'Awareness, remarketing, dealer support, or a defined recruitment audience. Each has its own page and measure.',
      },
      {
        title: 'Creative limits',
        text: 'What can be shown without overstating a specification. Engineering reviews any technical line in the ad.',
      },
    ],
    steps: [
      {
        title: 'Decide the job',
        text: 'If the job cannot be stated in one sentence, the campaign waits. Reach is not a job.',
      },
      {
        title: 'Match the audience to that job',
        text: 'Dealers, prior visitors, or a recruitment pool. These are not combined to make the audience look larger.',
      },
      {
        title: 'Point at a real next step',
        text: 'A product page, a dealer page, or an application. Not the homepage, unless the job truly is only the company name.',
      },
      {
        title: 'Stop what does not produce the job',
        text: 'Likes and cheap clicks are reported and are not treated as enquiries.',
      },
    ],
    offerTitle: 'Start with a fit check',
    offerText:
      'The first answer may be that Meta is the wrong channel. If it is the right one, the first flight has one job and one destination.',
    offerIncludes: [
      'A written fit decision',
      'Audience and placement notes',
      'A destination page',
      'A measure that is not a like count',
    ],
    offerNext: 'Further flights stay tied to that job. We do not expand into every Meta placement by default.',
    ctaLabel: 'Discuss Meta ads',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'A fit check and, if warranted, one campaign with a single job.' },
      { format: 'campaign', duration: '3_months', text: 'Seasonal or dealer flights after the first job is understood.' },
    ],
    faqs: [
      {
        question: 'Should every manufacturer advertise on Instagram?',
        answer: 'No. Many industrial products are chosen from specifications. Meta is a fit for specific jobs, not a default.',
      },
      {
        question: 'Can you target plant managers reliably on Facebook?',
        answer: 'Job targeting is weaker here than on LinkedIn. We do not pretend Meta interest categories are an org chart.',
      },
      {
        question: 'Do you promise viral reach?',
        answer: 'No. Reach without a defined next step is not a result we will sell.',
      },
      {
        question: 'Is remarketing on Meta included?',
        answer: 'Yes, when Meta is the right place for that return message. The general remarketing approach is its own service.',
      },
    ],
    ctaHeading: 'Say what the Meta campaign is supposed to do',
    ctaBody: 'A visual product, a dealer network, or a return visit is a real brief. A request to be on Instagram is not.',
    imageSource: 'svc-page-content.jpg',
    imageFile: 'service-meta-ads.jpg',
    alt: 'Workshop table with a technical drawing and a machined metal component.',
    displayOrder: 35,
    related: ['paid-social-advertising', 'remarketing-retargeting'],
  },
  {
    slug: 'account-based-marketing-abm',
    title: 'Account-Based Marketing (ABM)',
    h1: 'Marketing aimed at a short list of accounts sales already wants',
    previewDescription:
      'Programs for selected industrial accounts: research, audience selection, messaging, and coordination with sales. Not a new name for broad advertising.',
    metaTitle: 'Account-Based Marketing for Industrial Manufacturers',
    metaDescription:
      'Account-based programs for a short list of companies sales wants to reach, with research, messaging, and ads aligned to that list. It is not broad advertising.',
    intro: [
      'Account-based marketing means the company list is the plan. A manufacturer that already knows which OEMs, plants, or distributors it wants should market to those names, with pages and follow-up that mention what those accounts buy.',
      'It is not a synonym for LinkedIn, and it is not a coat of paint on a campaign aimed at everyone in an industry.',
    ],
    body:
      h2('A short list, used everywhere') +
      paragraphs(
        'We start with the accounts sales will actually work. For each one, or for a tight cluster, we note the product that matters, the sites or roles involved, and what you will not claim. Advertising, outbound, and email can all use that note. If they do not, you have three campaigns and no account program.',
        'Personalization is specific and limited. Mentioning the product family an OEM already designs in is useful. Pretending you know their unstated budget is not. Pages may be a focused application note rather than a one-off microsite for every logo. A microsite is justified only when the offer truly differs.',
      ) +
      h2('Sales has to be in the work') +
      paragraphs(
        'ABM fails when marketing builds a list sales does not recognize, or when sales will not follow up a reply. The program includes the handoff: who calls, what counts as a conversation, and which accounts are paused. CRM fields, when you use them, should show the account, not only a loose lead status.',
      ) +
      '<p>LinkedIn is a common delivery channel and has its <a href="/services/paid-media/linkedin-ads-b2b-campaigns">own service page</a>. Direct outreach is <a href="/services/paid-media/outbound-lead-generation">outbound</a>. The sales system is <a href="/services/sales/sales-enablement">sales enablement and CRM</a>.</p>',
    situations: [
      {
        title: 'Revenue depends on a few dozen accounts, and marketing still buys a broad audience.',
        text: 'The spend and the pages should be rebuilt around the names sales already has.',
      },
      {
        title: 'Each account receives the same PDF as every other prospect.',
        text: 'The program adds the one distinction that matters for that account, usually the application or the plant, not a custom novel.',
      },
      {
        title: 'A previous ABM tool produced a score and no meetings.',
        text: 'We ignore the score until the list, the message, and the follow-up are real.',
      },
    ],
    scope: [
      {
        title: 'Account selection',
        text: 'A short list sales agrees to work, with a reason for each name and a note on product fit.',
      },
      {
        title: 'Message and page',
        text: 'What that cluster should see, and which existing URL can carry it. New pages only when the offer changes.',
      },
      {
        title: 'Coordination',
        text: 'How ads, outbound, and email share the list, and how a reply reaches the right salesperson.',
      },
    ],
    steps: [
      {
        title: 'Cut the list down',
        text: 'A long dump from a database is not a program. Sales marks the accounts they will pursue this quarter.',
      },
      {
        title: 'Research the product fit',
        text: 'Public information and your own history. We do not invent internal details about the account.',
      },
      {
        title: 'Align the tactics',
        text: 'Choose which of search, LinkedIn, outbound, and email apply to this list. Unused tactics are left off.',
      },
      {
        title: 'Review conversations, not impressions',
        text: 'The report is replies and meetings sales accepts. Impression volume is secondary.',
      },
    ],
    offerTitle: 'Start with the accounts for this quarter',
    offerText:
      'The first program covers a short list and one product theme. You see the message and the handoff before any extra tools are discussed.',
    offerIncludes: [
      'A working account list',
      'Product-fit notes from public information',
      'A message and a destination page',
      'A follow-up rule with sales',
    ],
    offerNext: 'More accounts are added only when the first set is being worked. We do not sell an ABM platform as the deliverable.',
    ctaLabel: 'Discuss ABM',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'List, message, and handoff for one cluster of accounts.' },
      { format: 'ongoing_monthly', duration: '6_months', text: 'The same program as accounts are added or paused with sales.' },
    ],
    faqs: [
      {
        question: 'Is ABM just LinkedIn ads with a company list?',
        answer: 'LinkedIn can be part of it. ABM is the decision to concentrate marketing and sales on named accounts, including pages and follow-up.',
      },
      {
        question: 'How many accounts should be in the program?',
        answer: 'As many as sales will work. A list nobody calls is a brochure, not ABM. We would rather start with a small set.',
      },
      {
        question: 'Do you guarantee pipeline from the list?',
        answer: 'No. The work makes the outreach and the pages specific. It does not promise that an account will buy.',
      },
      {
        question: 'Do you need a special ABM platform?',
        answer: 'Not to begin. A shared list and a CRM your team already uses are enough until the program proves it needs more software.',
      },
    ],
    ctaHeading: 'Bring the accounts sales would notice',
    ctaBody: 'If marketing cannot name the companies that matter this quarter, the advertising channel is the wrong first question.',
    imageSource: 'svc-page-strategy.jpg',
    imageFile: 'service-abm.jpg',
    alt: 'Manufacturing planning table with drawings, calipers, and metal samples.',
    displayOrder: 36,
    related: ['linkedin-ads-b2b-campaigns', 'outbound-lead-generation', 'sales-enablement'],
  },
  {
    slug: 'remarketing-retargeting',
    title: 'Remarketing & Retargeting',
    h1: 'Return visits for people who already opened a product or technical page',
    previewDescription:
      'Remarketing for visitors who saw a product page, a technical article, or an ad, timed to long industrial buying cycles and a useful next step.',
    metaTitle: 'Remarketing and Retargeting for Manufacturer Sites',
    metaDescription:
      'Bring back visitors who opened a product page, a technical article, or an ad. Useful on long industrial cycles when the next message adds a fact.',
    intro: [
      'Industrial purchases take months. A visitor who opened a product page may be comparing, waiting on a drawing, or not ready to enquire. Remarketing is a way to return with something new: a specification, a document, or a relevant case.',
      'Repeating the same slogan is not remarketing. It is a reminder that you bought the same impression twice.',
    ],
    body:
      h2('Sequence, not presence') +
      paragraphs(
        'Audiences should come from real sections of the site: a product family, an application, a download. A single pool of all visitors mixes careers, support, and buyers. The next message depends on what they saw. Someone who read a pressure rating does not need a homepage brand line. They may need the document, the exclusion, or a prompt to send the duty cycle.',
        'Frequency and duration follow the sales cycle you actually have. A three-day consumer window is usually wrong. A message that chases someone for a year after a single visit is also wrong. We set an end.',
      ) +
      h2('The site has to deserve the return') +
      paragraphs(
        'Remarketing cannot repair a product page that hides the part number. If the return visit opens the same weak page, the campaign only spends more. Design, development, and email nurturing are the companions: the page, the speed, and the follow-up when you already have permission to write.',
      ) +
      '<p>Page quality is <a href="/services/website/industrial-website-design">industrial website design</a> and <a href="/services/website/website-development">development</a>. A permitted follow-up is <a href="/services/paid-media/email-marketing-lead-nurturing">email nurturing</a>.</p>',
    situations: [
      {
        title: 'People view product pages and disappear for months.',
        text: 'A return message with a document or a clearer limit can be worth testing. A logo ad is not the test.',
      },
      {
        title: 'The current remarketing pixel fires on every page, including careers.',
        text: 'The audiences are contaminated. The first job is to split them by section.',
      },
      {
        title: 'Sales already has the contact, and ads keep asking them to fill the same form.',
        text: 'That visitor should move to a sales or email path. Paid remarketing is for people you cannot yet write to.',
      },
    ],
    scope: [
      {
        title: 'Audience rules',
        text: 'Which page groups qualify, which are excluded, and how long a person stays in the audience.',
      },
      {
        title: 'Next message',
        text: 'A fact, a document, or a step that was not the first thing they saw. Creative is reviewed against the product page.',
      },
      {
        title: 'Channel choice',
        text: 'Search remarketing, Meta, or another network, picked because that is where the return is useful, not because every channel is available.',
      },
    ],
    steps: [
      {
        title: 'Map the pages worth returning to',
        text: 'Product and application templates first. Utility pages are excluded.',
      },
      {
        title: 'Define the second step',
        text: 'What the return visit adds. If nothing new can be said, the campaign waits until the page improves.',
      },
      {
        title: 'Set frequency and an end date',
        text: 'The audience expires. Industrial cycles are long, but they are not infinite.',
      },
      {
        title: 'Read the return visits with the enquiries',
        text: 'A view is not a result. We look for enquiries that came back to a specific family.',
      },
    ],
    offerTitle: 'Start with one product audience',
    offerText:
      'The first setup covers visitors to one family and a single next step. Other audiences are added only if the split stays clean.',
    offerIncludes: [
      'Audience rules and exclusions',
      'A next-step message',
      'A frequency cap and an end',
      'A note on which network is worth using',
    ],
    offerNext: 'Broader site audiences wait. We do not turn every visitor into an ad target.',
    ctaLabel: 'Discuss remarketing',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'Audience and message setup for one product family.' },
      { format: 'ongoing_monthly', duration: '3_months', text: 'Adjustments as pages and documents change.' },
    ],
    faqs: [
      {
        question: 'Is remarketing the same as retargeting?',
        answer: 'On this page the words mean the same work: a later message to someone who already had a specific interaction. The interaction matters more than the label.',
      },
      {
        question: 'Do you guarantee they will return and buy?',
        answer: 'No. The campaign offers a relevant next step. It does not control the buying timeline.',
      },
      {
        question: 'Should we remarket to everyone who bounced?',
        answer: 'No. A one-second visit is a weak signal. Audiences should reflect a real page, not a flicker.',
      },
      {
        question: 'Does this replace email?',
        answer: 'No. Email is for people you may contact directly. Remarketing is for people you can only recognize as prior visitors.',
      },
    ],
    ctaHeading: 'Name the page they already saw',
    ctaBody: 'Remarketing starts from that URL and from a second fact worth showing. Without either, there is nothing to run.',
    imageSource: 'blog-manufacturing-lead-generation.jpg',
    imageFile: 'service-remarketing.jpg',
    alt: 'Sales engineer standing in a factory aisle.',
    displayOrder: 37,
    related: ['industrial-website-design', 'website-development', 'email-marketing-lead-nurturing'],
  },
  {
    slug: 'paid-social-advertising',
    title: 'Paid Social Advertising',
    h1: 'Choosing paid social networks by where industrial buyers actually spend time',
    previewDescription:
      'Cross-platform paid social for industrial companies: audience strategy, message, and management, kept distinct from the LinkedIn and Meta services.',
    metaTitle: 'Paid Social Advertising Programs for Manufacturers',
    metaDescription:
      'Paid social for the networks your buyers use, with audience and message kept distinct from the LinkedIn and Meta pages. Not every network is required.',
    intro: [
      'Paid social advertising is the decision of whether a social network belongs in an industrial program at all, and how the pieces fit. LinkedIn, Facebook, and Instagram each have their own service page because the audiences are different. This page is the layer above them.',
      'Being present on every network is not a goal. A component specified from a drawing may need none of them. A dealer brand or a named-account program may need one.',
    ],
    body:
      h2('Pick the network from the buyer') +
      paragraphs(
        'Search captures a person who already typed a product. Social reaches someone who did not. That difference decides the message. Social has to earn the click with a role, an account, or a visual fact, because there is no query to match. We choose networks from where those people can actually be reached with an acceptable level of waste.',
        'Creative and message development sit here when more than one network is in play, so the claim stays consistent. Campaign management includes the rule for stopping a network that only produces cheap visits. Reporting stays tied to enquiries and account conversations, not to a blended engagement number.',
      ) +
      h2('What this page will not repeat') +
      paragraphs(
        'LinkedIn role and account tactics are written on the LinkedIn page. Meta placements, dealer visuals, and recruitment-related audiences are written on the Facebook and Instagram page. This service decides which of those to use, in which order, and what they share. It is not a third copy of either playbook.',
      ) +
      '<p>Account selection often belongs with <a href="/services/paid-media/account-based-marketing-abm">account-based marketing</a>. The two platform pages are <a href="/services/paid-media/linkedin-ads-b2b-campaigns">LinkedIn</a> and <a href="/services/paid-media/facebook-instagram-ads">Facebook and Instagram</a>.</p>',
    situations: [
      {
        title: 'The plan says social without naming a network or a buyer.',
        text: 'This is the conversation that forces the choice. Some manufacturers should spend the money on search instead.',
      },
      {
        title: 'LinkedIn and Meta are both running, with different claims.',
        text: 'The cross-platform job is to make the offer consistent and to drop the network that does not fit.',
      },
      {
        title: 'A new market needs awareness before product search exists.',
        text: 'Social can support that if a real audience is defined. It still needs a page that states the product.',
      },
    ],
    scope: [
      {
        title: 'Network selection',
        text: 'Which platforms are in, which are out, and why, based on the buyer and the product rather than on a channel menu.',
      },
      {
        title: 'Shared message',
        text: 'The claim, the proof, and the page every chosen network must use. Technical lines go through engineering.',
      },
      {
        title: 'Management rules',
        text: 'What gets paused, how audiences stay distinct, and how results are read across networks without fake blended ROI.',
      },
    ],
    steps: [
      {
        title: 'Name the buyer and the job',
        text: 'Role, account list, dealer, or return visitor. A job of awareness still needs a page and an end date.',
      },
      {
        title: 'Assign networks',
        text: 'One primary network is normal. A second is added only for a different job, not for symmetry.',
      },
      {
        title: 'Write the shared brief',
        text: 'Message, exclusions, and destination. Platform teams or later campaigns inherit the brief.',
      },
      {
        title: 'Review by network',
        text: 'Results are not averaged into a single social score. A weak network is stopped.',
      },
    ],
    offerTitle: 'Start with the network decision',
    offerText:
      'The first deliverable is which social networks to use for a defined buyer, and which to leave off. Platform builds can follow.',
    offerIncludes: [
      'A buyer and job statement',
      'A network yes or no',
      'A shared message and destination',
      'A rule for stopping a network',
    ],
    offerNext: 'Execution moves to the LinkedIn or Meta service, or stops if neither fits. No lead volume is promised.',
    ctaLabel: 'Discuss paid social',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'Network choice and a shared brief for one buyer group.' },
      { format: 'ongoing_monthly', duration: '3_months', text: 'Coordination across the networks you chose to keep.' },
    ],
    faqs: [
      {
        question: 'Why is this separate from LinkedIn and Meta?',
        answer: 'Those pages explain how to run each platform. This page decides whether they belong in the program and how they share a message.',
      },
      {
        question: 'Will you advertise on every major network?',
        answer: 'No. Extra networks add waste unless the buyer is there and the message fits.',
      },
      {
        question: 'Do you promise engagement or follower growth?',
        answer: 'No. Those numbers are easy to buy and hard to connect to a quote. We look at the job the campaign was given.',
      },
      {
        question: 'Can paid social replace a catalog?',
        answer: 'No. Social sends someone to a page. If the page does not state the product, the campaign has nowhere honest to land.',
      },
    ],
    ctaHeading: 'Name the buyer before you name the app',
    ctaBody: 'The network is a consequence of who must see the product. Starting from the icon usually wastes the first month.',
    imageSource: 'svc-page-sales.jpg',
    imageFile: 'service-paid-social.jpg',
    alt: 'Empty manufacturing office with dark unmarked screens.',
    displayOrder: 38,
    related: ['linkedin-ads-b2b-campaigns', 'facebook-instagram-ads', 'account-based-marketing-abm'],
  },
  {
    slug: 'outbound-lead-generation',
    successorOf: 'lead-generation',
    title: 'Outbound Lead Generation',
    h1: 'Outreach to accounts that can buy, with the product stated in the first note',
    previewDescription:
      'Targeted outbound for manufacturers: prospect research, account and contact selection, and outreach that asks for a relevant technical conversation.',
    metaTitle: 'Outbound Lead Generation for Manufacturing Companies',
    metaDescription:
      'Targeted outreach for manufacturers: account research, contact selection, and a first message that states the product. Message volume is not treated as success.',
    intro: [
      'Outbound lead generation is a direct approach to companies that could buy, distribute, or specify your product. The first message has to say what you make and why that account might care. A request for a meeting before that sentence is how these programs get ignored.',
      'This is not the whole of paid media. Search, LinkedIn, and email nurturing are separate services. Outbound is the proactive conversation.',
    ],
    body:
      h2('Research before a sequence') +
      paragraphs(
        'We build the list from a market you serve: plants, OEMs, or distributors with a visible reason to need the product. Contacts are chosen for a role that can start a technical conversation, not for a large count of emails. Public information and your existing customers set the pattern. Purchased lists of vague titles are a last resort and are often declined.',
        'Segmentation follows product fit. An account that needs a different family gets a different note, or no note. The message states the product, the application, and a specific question. It does not pretend to know their budget or their unstated problems.',
      ) +
      h2('What a qualified conversation is') +
      paragraphs(
        'A reply that confirms the product is relevant, or that introduces the person who specifies it, is the result worth counting. A bounce, an out-of-office note, and a meeting with someone who cannot discuss the part are not. We do not promise a number of meetings. Sales has to be ready to continue the conversation when it is real.',
      ) +
      '<p>The same accounts may also sit in <a href="/services/paid-media/account-based-marketing-abm">an account program</a> or in <a href="/services/paid-media/email-marketing-lead-nurturing">email nurturing</a> after they have a reason to keep hearing from you. The handoff belongs in <a href="/services/sales/sales-enablement">sales enablement and CRM</a>.</p>',
    situations: [
      {
        title: 'Sales wants new accounts and the current list is everyone in an industry.',
        text: 'The list has to shrink to companies with a visible fit before anyone writes a sequence.',
      },
      {
        title: 'Previous outreach asked for fifteen minutes and never named the product.',
        text: 'The rewrite starts with the product and the application. The meeting is optional until the fit is clear.',
      },
      {
        title: 'Replies arrive and then sit in a shared inbox.',
        text: 'Outbound without an owner is noise. The program includes who responds and how fast.',
      },
    ],
    scope: [
      {
        title: 'Account and contact selection',
        text: 'Companies and roles with a stated reason, plus exclusions for poor fit, competitors, and existing customers unless sales asks otherwise.',
      },
      {
        title: 'Outreach messages',
        text: 'Short notes that name the product and the question. Sequences stay limited. Volume is not a KPI.',
      },
      {
        title: 'Qualification rule',
        text: 'What sales will accept as a conversation, written down before the first send.',
      },
    ],
    steps: [
      {
        title: 'Define the fit with sales',
        text: 'Product, region, and the role that can discuss it. Accounts outside that definition are not a stretch goal.',
      },
      {
        title: 'Research a small set',
        text: 'Enough public evidence to write a specific note. If the evidence is missing, the account waits.',
      },
      {
        title: 'Send and read the replies',
        text: 'The first wave is small. Wording changes because of real replies, not because a template said day three.',
      },
      {
        title: 'Hand over the conversations',
        text: 'Accepted replies go to a named salesperson. The rest are closed, not recycled into a newsletter by default.',
      },
    ],
    offerTitle: 'Start with one product and one account type',
    offerText:
      'The first wave targets one product family and one kind of company. You see the list and the message before it scales.',
    offerIncludes: [
      'Fit definition with sales',
      'A researched starter list',
      'Message drafts',
      'A handoff rule for replies',
    ],
    offerNext: 'A larger list follows only if the first replies are relevant. A meeting quota is not part of the offer.',
    ctaLabel: 'Discuss outbound',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'List, message, and a first wave for one account type.' },
      { format: 'ongoing_monthly', duration: '3_months', text: 'Further waves as sales accepts or rejects the pattern of replies.' },
    ],
    faqs: [
      {
        question: 'How many emails will you send?',
        answer: 'As few as the list justifies. A target for message volume encourages poor-fit names, so we do not set one.',
      },
      {
        question: 'Do you guarantee meetings or a cost per lead?',
        answer: 'No. The offer is a relevant conversation with accounts that fit. Uptake depends on the product, the list, and sales follow-up.',
      },
      {
        question: 'Can you use our existing CRM contacts?',
        answer: 'Yes, when they match the fit and sales agrees they can be contacted. We do not email a dormant database by default.',
      },
      {
        question: 'Is this the old lead generation page?',
        answer: 'The previous lead generation service mixed several channels. This page is only outbound. Paid search, LinkedIn, and email each have their own pages now.',
      },
    ],
    ctaHeading: 'Bring the kind of company you want a reply from',
    ctaBody: 'One product and one account type are enough to write the first list. A generic industry blast is not.',
    imageSource: 'svc-page-leads.jpg',
    imageFile: 'service-outbound.jpg',
    alt: 'Paper documents on an industrial desk, with a factory floor beyond the glass.',
    displayOrder: 30,
    related: ['account-based-marketing-abm', 'email-marketing-lead-nurturing', 'sales-enablement'],
  },
  {
    slug: 'email-marketing-lead-nurturing',
    title: 'Email Marketing & Lead Nurturing',
    h1: 'Email that follows a quote path, not a newsletter counted as a lead',
    previewDescription:
      'Email programs and lead nurturing for industrial buyers: technical follow-up, segmentation, and automation only where a long purchase cycle needs it.',
    metaTitle: 'Email Marketing and Lead Nurturing for Manufacturers',
    metaDescription:
      'Email and lead nurturing for long industrial purchases: technical follow-up, segmentation, and automation where sales will act. A signup alone is not a lead.',
    intro: [
      'Email earns a place when there is a reason to write again: a quote in progress, a document the buyer asked for, or a product change that affects an account you may already know. A newsletter signup, by itself, is not that reason.',
      'Nurturing for a manufacturer is a sequence tied to a long purchasing cycle. It distributes a specification, a comparison, or a question sales agreed to ask. It is not a drip of slogans.',
    ],
    body:
      h2('Segment by the buying situation') +
      paragraphs(
        'Someone who downloaded a drawing is not the same as someone who asked for a quote, and neither is the same as a distributor who wanted a line card. Segments follow that difference. Automation is used when the branch is obvious, such as sending the document they requested, and avoided when a salesperson should decide the next sentence.',
        'Technical content is the usual substance: a clarified limit, an application note, a maintenance interval you can support. Each message says who it is for and what it does not change. Frequency stays low. Industrial buyers do not need a weekly recap of the homepage.',
      ) +
      h2('How email sits with outbound and ads') +
      paragraphs(
        'Outbound can start a conversation. Email continues it when you have permission and something new to say. Remarketing reaches people you cannot email. Account programs keep the same story across those paths. Mixing them into one blast list erases the difference.',
      ) +
      '<p>Starting the conversation is often <a href="/services/paid-media/outbound-lead-generation">outbound</a> or <a href="/services/paid-media/account-based-marketing-abm">ABM</a>. Recording what sales does next is <a href="/services/sales/sales-enablement">sales enablement and CRM</a>.</p>',
    situations: [
      {
        title: 'Quotes go quiet for months and nobody sends the missing document.',
        text: 'A short, agreed follow-up is nurturing. A newsletter is not a substitute for that document.',
      },
      {
        title: 'The list is everyone who ever filled a form.',
        text: 'The list has to be split or reduced. Relevance beats a large send.',
      },
      {
        title: 'Marketing automation is in place and sales does not trust the stages.',
        text: 'We simplify the branches until each email matches an action sales recognizes.',
      },
    ],
    scope: [
      {
        title: 'Audience rules',
        text: 'Who may be written to, on what basis, and which old addresses should be left alone.',
      },
      {
        title: 'Message program',
        text: 'A small set of emails tied to documents, product updates, or quote follow-up. Each has an owner.',
      },
      {
        title: 'Light automation',
        text: 'Triggers for requested documents and simple branches. Complex scoring is not assumed to be useful.',
      },
    ],
    steps: [
      {
        title: 'Separate the real situations',
        text: 'Quote, document request, distributor, and dormant contact are not one segment.',
      },
      {
        title: 'Write the few emails sales will stand behind',
        text: 'If a salesperson would not forward it, it does not go in the program.',
      },
      {
        title: 'Connect the send to a record',
        text: 'The CRM, or at least a shared list, shows who was written to and who replied.',
      },
      {
        title: 'Stop sequences that only produce unsubscribes',
        text: 'A quiet, relevant note is kept. A sequence that exists to fill a calendar is cut.',
      },
    ],
    offerTitle: 'Start with one follow-up situation',
    offerText:
      'The first program covers one situation, such as a quote that needs a document, rather than a full newsletter redesign.',
    offerIncludes: [
      'A segment definition',
      'The emails for that situation',
      'A simple trigger or a manual send rule',
      'A note on what is not a lead',
    ],
    offerNext: 'Other segments are added after the first one is used. We do not launch a large automation map on day one.',
    ctaLabel: 'Discuss email nurturing',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'One segment and its messages.' },
      { format: 'ongoing_monthly', duration: '3_months', text: 'Additional situations and upkeep of the messages as products change.' },
    ],
    faqs: [
      {
        question: 'Is a newsletter part of nurturing?',
        answer: 'Only if each edition has a reader and a purpose sales agrees with. A signup counted as a lead is a measurement error.',
      },
      {
        question: 'Do you promise open rates or revenue per email?',
        answer: 'No. We look at whether the right people received a useful document and whether sales could act on replies.',
      },
      {
        question: 'Can you email purchased lists?',
        answer: 'We do not recommend it. Industrial outreach to people who have no relationship with you belongs in a deliberate outbound program, not a newsletter blast.',
      },
      {
        question: 'How automated should this be?',
        answer: 'Automate the obvious handoff, such as a requested file. Leave judgment calls to sales. A score is not a conversation.',
      },
    ],
    ctaHeading: 'Bring the follow-up sales forgets to send',
    ctaBody: 'If a quote stalls because a drawing or a checklist never went out, that message is the program to build first.',
    imageSource: 'svc-page-seo.jpg',
    imageFile: 'service-email-nurturing.jpg',
    alt: 'Technical manuals on a workbench, with CNC machines in the background.',
    displayOrder: 39,
    related: ['outbound-lead-generation', 'account-based-marketing-abm', 'sales-enablement'],
  },
]

const assertCopy = () => {
  const slugs = new Set<string>()
  for (const page of PAGES) {
    if (slugs.has(page.slug)) throw new Error(`Duplicate ${page.slug}`)
    slugs.add(page.slug)
    if (page.h1.toLowerCase() === page.title.toLowerCase()) throw new Error(`${page.slug} H1 repeats title`)
    if (page.metaTitle.length < 50 || page.metaTitle.length > 60) {
      throw new Error(`${page.slug} title ${page.metaTitle.length}: ${page.metaTitle}`)
    }
    if (page.metaDescription.length < 140 || page.metaDescription.length > 160) {
      throw new Error(`${page.slug} description ${page.metaDescription.length}: ${page.metaDescription}`)
    }
    const intro = page.intro.join(' ')
    if (page.body.includes(intro.slice(0, 80))) throw new Error(`${page.slug} repeats intro`)
    if (/[\u2013\u2014]/.test(JSON.stringify(page))) throw new Error(`${page.slug} has a dash`)
    const source = path.join(process.cwd(), 'public', 'media', page.imageSource)
    if (!existsSync(source)) throw new Error(`Missing image ${page.imageSource}`)
  }
  for (const file of ['search', 'paid']) {
    const raw = readFileSync(path.join(process.cwd(), 'src', 'scripts', 'content', 'services', `${file}.html`), 'utf8')
    if (/[\u2013\u2014]/.test(raw.split('@@cards')[1] || '')) throw new Error(`${file} cards have a dash`)
    const cards = raw.split('@@cards')[1]?.trim().split('\n').filter(Boolean) ?? []
    if (cards.length !== 10) throw new Error(`${file} cards ${cards.length}`)
    const hrefs = new Set<string>()
    for (const line of cards) {
      const [title, href, text] = line.split(' || ')
      if (!title || !href?.startsWith('/services/') || !text) throw new Error(`Bad card ${line}`)
      if (hrefs.has(href)) throw new Error(`Duplicate card ${href}`)
      hrefs.add(href)
      if (text.trim().length < 150 || text.trim().length > 250) {
        throw new Error(`card ${text.trim().length} ${title}`)
      }
    }
  }
}

const uploadImage = async (payload: Payload, page: PageCopy) => {
  const source = path.join(process.cwd(), 'public', 'media', page.imageSource)
  const buffer = await sharp(source).rotate().resize({ width: 1800, withoutEnlargement: true }).jpeg({ quality: 82 }).toBuffer()
  const file = { name: page.imageFile, data: buffer, mimetype: 'image/jpeg' as const, size: buffer.byteLength }
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: page.imageFile } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (existing.docs[0]) return Number(existing.docs[0].id)
  const created = await payload.create({
    collection: 'media',
    data: { alt: page.alt },
    file,
    overrideAccess: true,
    context,
  })
  return Number(created.id)
}

const pageData = (page: PageCopy, imageId: number, publishedAt?: string) => ({
  title: page.title,
  service_long_title: page.h1,
  slug: page.slug,
  generateSlug: false,
  _status: 'published' as const,
  publishedAt: publishedAt || new Date().toISOString(),
  featured: false,
  displayOrder: page.displayOrder,
  authors: [1],
  service_preview_title: page.title,
  service_preview_description: page.previewDescription,
  service_preview_image: imageId,
  service_card_image: imageId,
  service_content_title: null,
  meta: { title: page.metaTitle, description: page.metaDescription, image: imageId },
  introduction: { text: rt(paragraphs(...page.intro)), supportingText: rt(page.body) },
  clientSituations: page.situations.map((item) => ({ title: item.title, description: rt(paragraphs(item.text)) })),
  serviceScope: page.scope.map((item) => ({ title: item.title, description: rt(paragraphs(item.text)) })),
  processSteps: page.steps.map((item, index) => ({
    stepNumber: index + 1,
    title: item.title,
    description: rt(paragraphs(item.text)),
  })),
  entryOffer: {
    title: page.offerTitle,
    description: rt(paragraphs(page.offerText)),
    includes: rt(bullets(page.offerIncludes)),
    duration: null,
    price: null,
    deliverables: null,
    ctaLabel: page.ctaLabel,
    ctaUrl: '/contact',
    nextStep: rt(paragraphs(page.offerNext)),
  },
  workingFormat: {
    minimumEngagement: null,
    frequency: null,
    formats: page.formats.map((item) => ({
      format: item.format,
      duration: item.duration,
      description: rt(paragraphs(item.text)),
    })),
  },
  expectedOutcomes: [],
  relatedCaseStudies: [] as number[],
  clientTestimonial: { quote: null, author: null, position: null, company: null },
  faq: {
    title: 'Questions & answers',
    intro: null,
    items: page.faqs.map((item) => ({ question: item.question, answer: rt(paragraphs(item.answer)) })),
  },
  relatedServices: [] as number[],
  layout: [
    {
      blockType: 'cta' as const,
      richText: rtCta(`<h2>${escapeHtml(page.ctaHeading)}</h2>` + paragraphs(page.ctaBody)),
      links: [
        {
          link: {
            type: 'custom' as const,
            newTab: false,
            url: '/contact',
            label: page.ctaLabel,
            appearance: 'default' as const,
          },
        },
      ],
    },
  ],
})

const mediaId = (value: unknown): number | null => {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id?: unknown }).id
    return typeof id === 'number' ? id : null
  }
  return null
}

const relationIds = (value: unknown): number[] => {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    const id = mediaId(item)
    return id ? [id] : []
  })
}

const rewriteString = (value: string) => {
  let next = value
  for (const [from, to] of Object.entries(LEGACY_SERVICE_REDIRECTS)) {
    if (next === from || next === `${from}/`) return to
    next = next.replaceAll(`href="${from}"`, `href="${to}"`)
    next = next.replaceAll(`href="${from}/"`, `href="${to}"`)
  }
  return next
}

const rewriteValue = (value: unknown): unknown => {
  if (typeof value === 'string') return rewriteString(value)
  if (Array.isArray(value)) return value.map((item) => rewriteValue(item))
  if (value && typeof value === 'object') {
    const next: Record<string, unknown> = {}
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) next[key] = rewriteValue(child)
    return next
  }
  return value
}

const rewriteCollection = async (payload: Payload, collection: 'services' | 'posts' | 'pages' | 'case-studies') => {
  const found = await payload.find({ collection, depth: 0, limit: 500, pagination: false, overrideAccess: true })
  let changed = 0
  for (const doc of found.docs) {
    const rewritten = rewriteValue(doc) as Record<string, unknown>
    const deny = new Set(['id', 'createdAt', 'updatedAt', 'deletedAt', 'populatedAuthors', 'breadcrumbs'])
    const data: Record<string, unknown> = {}
    const original = doc as unknown as Record<string, unknown>
    for (const [key, value] of Object.entries(rewritten)) {
      if (deny.has(key)) continue
      if (JSON.stringify(value) !== JSON.stringify(original[key])) data[key] = value
    }
    if (Object.keys(data).length === 0) continue
    await payload.update({ collection, id: doc.id, data, draft: false, overrideAccess: true, context })
    changed += 1
  }
  payload.logger.info(`${collection}: rewrote ${changed} documents`)
}

const updateOverview = async (payload: Payload, slug: 'search' | 'paid-media', file: 'search' | 'paid') => {
  const raw = readFileSync(path.join(process.cwd(), 'src', 'scripts', 'content', 'services', `${file}.html`), 'utf8').trim()
  const parts = raw.split(/\n@@/)
  const take = (name: string) => {
    const part = parts.find((item) => item.startsWith(name))
    if (!part) throw new Error(`${file}.html missing ${name}`)
    return part.slice(name.length).trim()
  }
  const cards = take('cards').split('\n').filter(Boolean).map((line) => {
    const [title, href, text] = line.split(' || ')
    return { title: title.trim(), href: href.trim(), text: text.trim() }
  })
  const existing = await payload.find({
    collection: 'services',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: slug } },
  })
  const overview = existing.docs[0]
  if (!overview) throw new Error(`${slug} overview missing`)
  await payload.update({
    collection: 'services',
    id: overview.id,
    draft: false,
    overrideAccess: true,
    context,
    data: {
      introduction: {
        text: overview.introduction?.text,
        supportingText: rt(take('body')),
      },
      serviceScope: cards.map((card) => ({
        title: card.title,
        description: rt(`<p>${escapeHtml(card.text)}</p><p><a href="${card.href}">View the service page</a></p>`),
      })),
      layout: [
        {
          blockType: 'content' as const,
          columns: [{ size: 'full' as const, richText: rt(take('together')), enableLink: false }],
        },
      ],
    },
  })
  payload.logger.info(`${slug} overview lists ${cards.length} services`)
}

const setRelated = async (payload: Payload, slug: string, related: string[], idBySlug: Map<string, number>) => {
  const id = idBySlug.get(slug)
  if (!id) throw new Error(`Missing ${slug}`)
  await payload.update({
    collection: 'services',
    id,
    draft: false,
    overrideAccess: true,
    context,
    data: {
      relatedServices: related.map((item) => {
        const relatedId = idBySlug.get(item)
        if (!relatedId) throw new Error(`Missing related ${item} for ${slug}`)
        return relatedId
      }),
    },
  })
}

const main = async () => {
  assertCopy()
  for (const page of PAGES) console.log(`${page.slug} title ${page.metaTitle.length} description ${page.metaDescription.length}`)
  const payload = await getPayload({ config })

  const imageIds = new Map<string, number>()
  for (const page of PAGES) imageIds.set(page.slug, await uploadImage(payload, page))

  for (const page of PAGES) {
    const slugs = [page.slug, page.successorOf].filter(Boolean) as string[]
    const existing = (
      await payload.find({
        collection: 'services',
        depth: 0,
        limit: 1,
        overrideAccess: true,
        where: { slug: { in: slugs } },
      })
    ).docs[0]
    const data = pageData(page, imageIds.get(page.slug)!, existing?.publishedAt || undefined)
    data.relatedCaseStudies = relationIds(existing?.relatedCaseStudies)
    if (existing) {
      await payload.update({ collection: 'services', id: existing.id, data, draft: false, overrideAccess: true, context })
      payload.logger.info(`Updated ${page.slug}`)
    } else {
      await payload.create({ collection: 'services', data, draft: false, overrideAccess: true, context })
      payload.logger.info(`Created ${page.slug}`)
    }
  }

  const ai = await payload.find({
    collection: 'services',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      slug: { in: ['ai-search-optimization-content-engineering', 'ai-search-optimization-manufacturers'] },
    },
  })
  const aiDoc = ai.docs[0]
  if (!aiDoc) throw new Error('Existing AI search service was not found')
  await payload.update({
    collection: 'services',
    id: aiDoc.id,
    draft: false,
    overrideAccess: true,
    context,
    data: {
      slug: 'ai-search-optimization-content-engineering',
      generateSlug: false,
      meta: {
        ...(typeof aiDoc.meta === 'object' && aiDoc.meta ? aiDoc.meta : {}),
        title: 'AI Search and Content Engineering for Manufacturers',
      },
    },
  })
  payload.logger.info('Preserved AI search page at ai-search-optimization-content-engineering')

  const relatedSlugs = [
    ...PAGES.flatMap((page) => [page.slug, ...page.related]),
    'seo-ai-search-optimization',
    'ai-search-optimization-content-engineering',
    'technical-content-strategy',
    'website-development',
    'industrial-seo',
    'technical-seo-website-audits',
    'ai-search-optimization-geo',
  ]
  const relatedDocs = await payload.find({
    collection: 'services',
    depth: 0,
    limit: 80,
    overrideAccess: true,
    where: { slug: { in: [...new Set(relatedSlugs)] } },
    select: { slug: true },
  })
  const idBySlug = new Map(relatedDocs.docs.map((doc) => [doc.slug, Number(doc.id)]))
  for (const page of PAGES) await setRelated(payload, page.slug, page.related, idBySlug)
  await setRelated(
    payload,
    'seo-ai-search-optimization',
    ['industrial-seo', 'technical-seo-website-audits', 'technical-content-strategy'],
    idBySlug,
  )
  await setRelated(
    payload,
    'ai-search-optimization-content-engineering',
    ['seo-ai-search-optimization', 'ai-search-optimization-geo', 'technical-content-strategy'],
    idBySlug,
  )

  await rewriteCollection(payload, 'posts')
  await rewriteCollection(payload, 'pages')
  await rewriteCollection(payload, 'case-studies')
  await rewriteCollection(payload, 'services')
  await updateOverview(payload, 'search', 'search')
  await updateOverview(payload, 'paid-media', 'paid')
  process.exit(0)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
