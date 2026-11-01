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
    slug: 'technical-content-strategy',
    successorOf: 'technical-content-thought-leadership',
    title: 'Technical Content Strategy',
    h1: 'A plan for which technical facts get a public page, and who approves them',
    previewDescription:
      'Content audits, buyer questions, topic plans, and editorial priorities for manufacturers, aligned with search and with what sales can quote.',
    metaTitle: 'Technical Content Strategy for Industrial Manufacturers',
    metaDescription:
      'Plan technical content for manufacturers: audits, buyer questions, topic architecture, and editorial priorities aligned with search and sales.',
    intro: [
      'Technical content strategy decides which facts deserve a public page, which stay in a controlled drawing, and who is allowed to approve a number. It is the plan, not the articles, the product pages, or the photography.',
      'Manufacturers usually already have the knowledge. It sits in application notes, quote emails, and the heads of engineers. The strategy names the order in which that knowledge should reach a buyer.',
    ],
    body:
      h2('Start from the questions that already arrive') +
      paragraphs(
        'An audit compares the live site with the datasheets and with the questions sales repeats. Gaps are specific: a pressure class with no public limit, an application that exists only in a PDF, a product family described by a slogan. Topics are then ordered by the families you can quote and by the searches or sales conversations that already ask for them.',
        'Architecture means a job for each URL. A product page carries the identifier and the exclusion. A guide carries the explanation that would bury that page. A paper carries a method. Mixing those jobs is how a catalog becomes a blog that never helps a quote.',
      ) +
      h2('The plan has owners') +
      paragraphs(
        'Marketing can structure the list. Engineering owns the numbers. Sales says whether a page would attract work the plant wants. If those three disagree, the sentence stays off the site. Search and international plans use the same list, so a translated page is not planned for a fact you cannot maintain.',
      ) +
      '<p>The search side of the same families is <a href="/services/search/seo-ai-search-optimization">SEO and AI search</a> and <a href="/services/search/industrial-seo">industrial SEO</a>. Markets that need another language sit with <a href="/services/strategy/international-marketing-strategy">international marketing strategy</a>.</p>',
    situations: [
      { title: 'The site has articles, and the product pages still hide the limit.', text: 'The calendar started in the wrong place. Strategy puts the specification ahead of the essay.' },
      { title: 'Engineering will not review a pile of drafts.', text: 'The plan is a short list with an owner per page, not a year of topics nobody will check.' },
      { title: 'Several brands describe the same part with different names.', text: 'The strategy includes the name map. Otherwise every new page multiplies the conflict.' },
    ],
    scope: [
      { title: 'Content audit', text: 'Live pages compared with datasheets and with real buyer questions. Missing facts and contradictory claims are listed.' },
      { title: 'Topic and page architecture', text: 'Which differences become a product page, a guide, a paper, or nothing. The list is tied to families you can quote.' },
      { title: 'Editorial rules', text: 'Who approves a number, what must not be published, and how a change on the datasheet reaches the page.' },
    ],
    steps: [
      { title: 'Read the current pages against recent quotes', text: 'The gap is whatever sales still has to paste into email.' },
      { title: 'Choose the first families', text: 'Priority follows quote volume and the questions that lack a public answer.' },
      { title: 'Assign a page type and an owner', text: 'Each URL has one job and one person who can reject a sentence.' },
      { title: 'Hand the list to the writing work', text: 'Articles, product pages, and papers are separate services. This one stops at the plan.' },
    ],
    offerTitle: 'Start with one product family',
    offerText: 'The first plan covers the pages, the gaps, and the approval rule for one family you already quote.',
    offerIncludes: ['An audit of the current pages for that family', 'A page-type list', 'Owners for engineering review', 'Topics that should not be written'],
    offerNext: 'Further families follow only after the first list is being used. A content calendar without owners is not the offer.',
    ctaLabel: 'Discuss the content plan',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'A content plan for one product family.' },
      { format: 'campaign', duration: '3_months', text: 'Additional families after the first approval rule is working.' },
    ],
    faqs: [
      { question: 'Does this include writing the articles?', answer: 'No. This service decides what should exist and who approves it. Writing guides, papers, and product pages are separate services.' },
      { question: 'Will you publish numbers engineering has not confirmed?', answer: 'No. An estimated figure is worse than a gap. Unconfirmed limits stay off the page.' },
      { question: 'Is this the same as thought leadership?', answer: 'No. Thought leadership is a specialist explaining a constraint. Strategy is the plan for all technical content, including pages that are not opinion.' },
      { question: 'Can the plan include video and sales decks?', answer: 'It can name them as later formats. Producing the film or the deck is not part of this service.' },
    ],
    ctaHeading: 'Bring the question sales still answers by email',
    ctaBody: 'If the reply already exists in a datasheet, the plan starts by deciding which public page should carry it.',
    imageSource: 'content-technical-strategy.jpg',
    imageFile: 'svc-content-strategy.jpg',
    alt: 'Three professionals at a pale table reviewing papers and metal samples in a bright office.',
    displayOrder: 51,
    related: ['seo-ai-search-optimization', 'industrial-seo', 'international-marketing-strategy'],
  },
  {
    slug: 'engineering-articles-guides',
    title: 'Engineering Articles & Guides',
    h1: 'Guides that explain a rating, a process, or a drawing without replacing the product page',
    previewDescription:
      'Technically accurate articles and engineering guides for specifiers, maintenance teams, and industrial buyers who need an explanation the product page cannot hold.',
    metaTitle: 'Engineering Articles and Guides for B2B Manufacturers',
    metaDescription:
      'Engineering articles and guides for manufacturers: ratings, processes, and application explanations written for technical buyers and checked by engineering.',
    intro: [
      'An engineering guide exists when a product page would become a textbook if it answered the question in full. How to read a pressure class, what a drawing must include before a quote, or how a coating behaves in one environment are that kind of question.',
      'The reader is an engineer, a specifier, or a maintenance lead. The guide has to be accurate enough that your own applications engineer would send it.',
    ],
    body:
      h2('A guide has a job and a product to return to') +
      paragraphs(
        'We write from questions sales and engineering already answer, not from a list of popular phrases. Each article states the condition, the limit, and what it does not cover. It links back to the product or capability page that carries the specification. An article that never returns the reader to something you sell is a magazine piece, not part of the catalog.',
        'Process documentation is included when the process is something you sell or something the buyer must understand before specifying. A plant tour in prose is not a guide. Educational material stays specific to your materials, your equipment, or your applications.',
      ) +
      h2('Where this stops') +
      paragraphs(
        'A short answer that belongs on the product page should stay there. That is answer-focused editing, not a new article. A method long enough to stand as a signed document is a white paper. A named project with conditions and an outcome is a case study. This service is the explanatory middle.',
      ) +
      '<p>Direct answers on the product page are <a href="/services/search/answer-engine-optimization-aeo">answer engine optimization</a>. Making the same facts legible to generative search is <a href="/services/search/ai-search-optimization-geo">GEO</a>. Longer documents are <a href="/services/content/technical-white-papers">technical white papers</a>.</p>',
    situations: [
      { title: 'Buyers misread a rating and then send the wrong duty.', text: 'A short guide on how to read the rating prevents a class of bad enquiries. The product page keeps the number.' },
      { title: 'Application notes exist as internal PDFs.', text: 'The useful ones can become public guides once engineering marks what is releasable.' },
      { title: 'The blog publishes company news and calls it technical content.', text: 'News is not a guide. We do not add posts that do not change how someone specifies.' },
    ],
    scope: [
      { title: 'Question selection', text: 'Topics from real enquiries and from gaps on the product pages, rejected if engineering cannot support them.' },
      { title: 'Guides and articles', text: 'Explanations of ratings, processes, materials, and applications, with conditions and exclusions.' },
      { title: 'Links back to the catalog', text: 'Each piece points at the product or capability page a reader should open next.' },
    ],
    steps: [
      { title: 'Collect questions worth a full page', text: 'One-sentence answers stay on the product page. The rest are candidates.' },
      { title: 'Draft against the datasheet', text: 'The guide may explain. It may not invent a wider capability than the page states.' },
      { title: 'Engineering review', text: 'A specialist signs the limits. Unsigned technical claims are removed.' },
      { title: 'Publish where the product can be found', text: 'The article is linked from the relevant family, not left in an unlinked blog archive.' },
    ],
    offerTitle: 'Start with one question sales repeats',
    offerText: 'The first guide answers one recurring technical question and points at the product page that holds the specification.',
    offerIncludes: ['The question and the audience', 'A draft checked against the datasheet', 'Engineering review', 'Placement next to the product'],
    offerNext: 'More guides follow only when the first one matches how engineering explains the product.',
    ctaLabel: 'Discuss an engineering guide',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'One guide or a short set for a single family.' },
      { format: 'ongoing_monthly', duration: '3_months', text: 'Further guides as new questions show up in quotes.' },
    ],
    faqs: [
      { question: 'Will these rank by themselves?', answer: 'They are written for a reader with a technical question. Search can use them. A ranking is not promised.' },
      { question: 'Can you write about standards we do not apply?', answer: 'No. A standard is named only when you use it and can say how.' },
      { question: 'Is a guide the same as a white paper?', answer: 'No. A guide explains a working question. A white paper documents a method or comparison at greater length, and engineering signs it as a document.' },
      { question: 'Who is the reader?', answer: 'Engineers, specifiers, maintenance leads, and technical buyers. A general consumer introduction is out of scope.' },
    ],
    ctaHeading: 'Bring the explanation that never made it onto the site',
    ctaBody: 'If applications engineering already has the paragraph, the work is to make it public and accurate.',
    imageSource: 'content-engineering-articles.jpg',
    imageFile: 'svc-content-articles.jpg',
    alt: 'An engineer at a bright desk beside a window, with a technical binder and a machined part.',
    displayOrder: 52,
    related: ['answer-engine-optimization-aeo', 'ai-search-optimization-geo', 'technical-white-papers', 'thought-leadership'],
  },
  {
    slug: 'product-capability-pages',
    title: 'Product & Capability Pages',
    h1: 'Pages that state what you make, how you make it, and what you will not claim',
    previewDescription:
      'Product pages, family descriptions, capability and process pages, and specifications that help buyers evaluate a manufacturer.',
    metaTitle: 'Product and Capability Pages for Industrial Companies',
    metaDescription:
      'Product and capability pages for manufacturers: specifications, processes, and application limits written so a buyer can evaluate the work you sell.',
    intro: [
      'A product page is where a buyer decides whether to send a drawing. A capability page is where they decide whether your process can hold the tolerance. Both fail when they lead with a slogan and hide the identifier.',
      'This service writes those pages. It is not the visual design of the template, and it is not the code that publishes them.',
    ],
    body:
      h2('The page has to survive a comparison') +
      paragraphs(
        'Engineers compare families. Procurement compares documents. A useful page names the product, the process, the unit, the condition, and the exclusion. Application notes say where it is used and where it is not. Capability pages describe the equipment and the work you actually sell, such as a machining range or a coating line, without implying a certification you do not hold.',
        'Variants that share a specification stay in one table. A new URL is justified when the difference changes the choice. We do not write a thin page for every SKU and call it a catalog.',
      ) +
      h2('Design and search use the same sentences') +
      paragraphs(
        'The template has to show the identifier before the gallery. That is a design and development concern. The words have to match the searches buyers use and the quote your sales team will stand behind. Industrial SEO and the catalog structure should not invent a second description.',
      ) +
      '<p>The layout of these pages is <a href="/services/website/industrial-website-design">industrial website design</a>. Catalog structure is <a href="/services/website/product-catalogs-ecommerce">product catalogs</a>. The query map is <a href="/services/search/industrial-seo">industrial SEO</a>.</p>',
    situations: [
      { title: 'The homepage is current and the product URL is a paragraph of adjectives.', text: 'The buyer still has to ask for the number. The page should have carried it.' },
      { title: 'Capability is described as a list of machines with no process limits.', text: 'A machine name is not a capability. The page should say what work those machines are used for, and what is out of range.' },
      { title: 'Distributors describe the product differently from the site.', text: 'The public page becomes the source they should copy. Until it is specific, they will invent the missing line.' },
    ],
    scope: [
      { title: 'Product and family pages', text: 'Identifiers, specifications, applications, and exclusions for the priority ranges.' },
      { title: 'Capability and process pages', text: 'What the plant can do, in the language of the work, with the limits engineering will sign.' },
      { title: 'Specification hygiene', text: 'Units attached to figures, controlled drawings named as requestable, and no estimated performance.' },
    ],
    steps: [
      { title: 'Pick the families that create quotes', text: 'Pages follow commercial reality, not a wish to look complete.' },
      { title: 'Draft from the datasheet and the quote', text: 'If sales would not send the sentence, it does not publish.' },
      { title: 'Separate product from capability', text: 'A part and a process do not share one vague URL.' },
      { title: 'Hand copy to the template', text: 'Design and development place it. This service does not rebuild the site.' },
    ],
    offerTitle: 'Start with one family and one process',
    offerText: 'The first set is the product page and, if needed, the capability page that a buyer must read before asking for a quote.',
    offerIncludes: ['Draft specifications', 'Application and exclusion lines', 'A note on what stays in a controlled drawing', 'Engineering review'],
    offerNext: 'The rest of the catalog follows the same pattern. We do not rewrite every SKU in the first pass.',
    ctaLabel: 'Discuss product pages',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'Pages for one family and its related process.' },
      { format: 'campaign', duration: '3_months', text: 'Further families once the first pages match the quotes.' },
    ],
    faqs: [
      { question: 'Do you design the page layout?', answer: 'No. This service is the technical content. Layout is industrial website design, and the build is website development.' },
      { question: 'Will every part number get a page?', answer: 'Only when the difference is one a buyer must see as its own URL. Shared specifications stay in a table.' },
      { question: 'Can you claim a certification?', answer: 'Only when you hold it and can say which products it covers. A general quality slogan is not a certification.' },
      { question: 'How is this different from a brochure?', answer: 'A brochure can travel with a salesperson. These pages are the public specification a buyer finds before that meeting.' },
    ],
    ctaHeading: 'Bring the product page sales will not send',
    ctaBody: 'If the team still attaches a PDF, the public page is missing the line that PDF already has.',
    imageSource: 'content-product-pages.jpg',
    imageFile: 'svc-content-product-pages.jpg',
    alt: 'Precision stainless fittings and a brushed metal housing on a light gray surface.',
    displayOrder: 53,
    related: ['industrial-website-design', 'product-catalogs-ecommerce', 'industrial-seo'],
  },
  {
    slug: 'technical-white-papers',
    title: 'Technical White Papers',
    h1: 'Signed technical documents for buyers comparing a method, a material, or a process',
    previewDescription:
      'White papers and technical documents that explain a method, a comparison, or a problem in enough depth for a complex industrial purchase.',
    metaTitle: 'Technical White Papers for Industrial Manufacturers',
    metaDescription:
      'Technical white papers for manufacturers: methods, material and process comparisons, and problem analysis that engineering will actually sign.',
    intro: [
      'A white paper is justified when the explanation is too long for a product page and too specific to be a general guide. It documents a method, a comparison, or a problem your engineers will put their names behind.',
      'A brochure saved as a PDF is not a white paper. Neither is a paper that invents test results.',
    ],
    body:
      h2('What belongs in the document') +
      paragraphs(
        'Useful papers for manufacturers compare materials or processes under stated conditions, explain why a failure mode happens, or show how to specify a product for an application. The method, the limits, and the cases that were not tested are part of the document. If you cannot say how a figure was obtained, the figure stays out.',
        'The reader is someone making or influencing a technical purchase: an engineer, a specifier, or a technical buyer at an OEM. The paper should help that person evaluate. It should not hide the product you sell, and it should not pretend to be independent research if it is your explanation of your own process.',
      ) +
      h2('How it is used') +
      paragraphs(
        'A paper can be a download on the relevant product or application page, a leave-behind for a technical meeting, or the source for a shorter guide. It is not a gate that blocks the specification. Someone who needs the identifier should not have to download a PDF to see it.',
      ) +
      '<p>Shorter explanations are <a href="/services/content/engineering-articles-guides">engineering articles and guides</a>. The decision to commission a paper sits in <a href="/services/content/technical-content-strategy">technical content strategy</a>.</p>',
    situations: [
      { title: 'Sales keeps rebuilding the same comparison in email.', text: 'A signed comparison, with conditions, replaces that thread and stays consistent.' },
      { title: 'A previous paper quoted performance nobody can source.', text: 'We remove or qualify the figure. An unsourced number is not kept because it sounds strong.' },
      { title: 'The topic is a real method, and the site only has a slogan.', text: 'The paper is the right length. A blog post would either be thin or would duplicate the product page.' },
    ],
    scope: [
      { title: 'Scope and evidence', text: 'The question, the conditions, and the evidence you can actually show. Gaps are named.' },
      { title: 'The document', text: 'A technical paper or long-form explanation reviewed by engineering before it is designed as a PDF.' },
      { title: 'Placement', text: 'Where it is offered, and which product page must remain readable without the download.' },
    ],
    steps: [
      { title: 'Confirm the question and the evidence', text: 'If the evidence is missing, the paper waits. We do not fill the gap with estimates.' },
      { title: 'Outline the comparison or method', text: 'Conditions, exclusions, and the product connection are in the outline, not added at the end.' },
      { title: 'Draft and technical review', text: 'Engineering signs the claims. Marketing does not soften a limit into a vague benefit.' },
      { title: 'Publish without hiding the specification', text: 'The PDF supports the page. It does not replace it.' },
    ],
    offerTitle: 'Start with one comparison you already make',
    offerText: 'The first paper documents one comparison or method your engineers already explain in technical calls.',
    offerIncludes: ['An evidence check', 'An outline', 'A draft for engineering to sign', 'A note on where it should be offered'],
    offerNext: 'Design of the PDF can follow. More papers wait until the first one is accurate.',
    ctaLabel: 'Discuss a white paper',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'One technical paper from evidence you can verify.' },
      { format: 'campaign', duration: '6_months', text: 'A second paper after the first has been reviewed in real sales use.' },
    ],
    faqs: [
      { question: 'Do you invent test data?', answer: 'No. Figures need a source you can stand behind. If the test was not done, the paper says so or does not claim it.' },
      { question: 'Will a download be counted as a lead?', answer: 'Not by itself. A download is interest. A quote request is a different event, and the two should not be added together.' },
      { question: 'Can the paper be anonymous thought leadership?', answer: 'It should be clear that it comes from your company. Pretending it is independent research is a bad way to explain a product.' },
      { question: 'Is this a guide?', answer: 'A guide answers a working question at a shorter length. A white paper is the deeper document, with method and conditions.' },
    ],
    ctaHeading: 'Bring the comparison engineering already trusts',
    ctaBody: 'If the method is real and the numbers have a source, that is enough to scope the paper.',
    imageSource: 'content-white-papers.jpg',
    imageFile: 'svc-content-white-papers.jpg',
    alt: 'A bright work table with a closed folder, a caliper, and metal and polymer samples.',
    displayOrder: 54,
    related: ['engineering-articles-guides', 'technical-content-strategy', 'thought-leadership'],
  },
  {
    slug: 'manufacturing-case-studies',
    title: 'Manufacturing Case Studies',
    h1: 'Project stories that keep the conditions, and leave out results you cannot show',
    previewDescription:
      'Case studies of real manufacturing projects: the requirement, the process, and only the outcomes you are allowed to document.',
    metaTitle: 'Manufacturing Case Studies for Industrial Companies',
    metaDescription:
      'Manufacturing case studies based on real projects, processes, and documented outcomes. Conditions are stated, and results are never invented.',
    intro: [
      'A manufacturing case study is an account of a real job: what the buyer needed, what constrained the work, what you did, and what can honestly be said about the result. If those facts cannot be published, the case study is not written.',
      'It is not a testimonial with a company name, and it is not a thought leadership essay. The project is the subject.',
    ],
    body:
      h2('Proof without invention') +
      paragraphs(
        'We start from a project you are allowed to describe. The context includes the industry or application, the requirement, and the limits that mattered, such as a material, a tolerance, or a lead time. The solution is the process and the product choices, not a list of adjectives. Outcomes are included only when you can document them. A percentage with no source does not get written to make the page feel finished.',
        'Customer permission matters. Some plants can be named. Some can be described only by application. We follow that boundary instead of guessing how specific a story should be.',
      ) +
      h2('Where the story is used') +
      paragraphs(
        'A case can support a product page, a sales conversation, or a careful LinkedIn post. It should use the same product names as the catalog. Sales enablement then decides who is allowed to send it. Thought leadership can refer to the lesson, but the case itself stays an account of the job.',
      ) +
      '<p>Expert commentary that is not a project account is <a href="/services/content/thought-leadership">thought leadership</a>. Using the story in sales is <a href="/services/sales/sales-enablement">sales enablement</a>.</p>',
    situations: [
      { title: 'The only proof on the site is a slogan about quality.', text: 'One permitted project, with conditions, is more useful than another adjective.' },
      { title: 'A draft case claims a savings figure nobody can trace.', text: 'The figure comes out. The process description can stay if it is accurate.' },
      { title: 'Sales wants a story for an application the plant does handle.', text: 'That is a good candidate, if the customer boundary is clear.' },
    ],
    scope: [
      { title: 'Project selection', text: 'Jobs you can describe, with a note on what must stay unnamed.' },
      { title: 'The narrative', text: 'Requirement, constraints, process, and documented results only.' },
      { title: 'Consistency', text: 'Product names and limits aligned with the public specification.' },
    ],
    steps: [
      { title: 'Confirm permission and facts', text: 'If either is missing, we do not draft around the hole.' },
      { title: 'Write the job, not the slogan', text: 'The sequence is the requirement, the constraint, and the work.' },
      { title: 'Remove unsupported results', text: 'A missing metric is acceptable. An invented one is not.' },
      { title: 'Place it where a buyer compares options', text: 'Usually next to the relevant product or capability, not only on a news page.' },
    ],
    offerTitle: 'Start with one project you can name to the level allowed',
    offerText: 'The first case study uses one job and the facts engineering and the customer will both accept.',
    offerIncludes: ['A permission and fact check', 'A draft structured as a project', 'Removal of unsupported claims', 'A placement recommendation'],
    offerNext: 'More cases follow only when they are equally documentable. We do not fill a grid with thin stories.',
    ctaLabel: 'Discuss a case study',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'One case study from a permitted project.' },
      { format: 'campaign', duration: '3_months', text: 'A small set of further projects after the first is approved.' },
    ],
    faqs: [
      { question: 'Do you guarantee a performance number?', answer: 'No. We publish outcomes you can document. If the result cannot be stated, the case describes the work without a fake metric.' },
      { question: 'Can you write a case without the customer?', answer: 'Only at the level of detail you are allowed to share. A fictional customer is not a case study.' },
      { question: 'Is this the same as a testimonial?', answer: 'No. A testimonial is someone else speaking. A case study is your account of the project, checked against the facts.' },
      { question: 'Will you name our client?', answer: 'Only with permission. Otherwise the application is described without a name that would identify them against their wishes.' },
    ],
    ctaHeading: 'Bring a project you are allowed to describe',
    ctaBody: 'The requirement, the constraint, and what you actually did are enough to see whether a case study should exist.',
    imageSource: 'content-case-studies.jpg',
    imageFile: 'svc-content-case-studies.jpg',
    alt: 'Two engineers in a bright factory with skylights, walking beside a finished industrial assembly.',
    displayOrder: 55,
    related: ['thought-leadership', 'sales-enablement', 'linkedin-ads-b2b-campaigns'],
  },
  {
    slug: 'thought-leadership',
    title: 'Thought Leadership',
    h1: 'A specialist explaining a constraint the market keeps getting wrong',
    previewDescription:
      'Expert articles, executive perspectives, and industry commentary that show a manufacturer understands the technical problems its buyers face.',
    metaTitle: 'Industrial Thought Leadership for Manufacturing Firms',
    metaDescription:
      'Thought leadership for manufacturers: expert articles and technical perspectives tied to real products, not unsupported opinion columns or slogans.',
    intro: [
      'Thought leadership, for a manufacturer, is a named specialist explaining a constraint, a failure mode, or a change in how buyers specify. It is tied to products and processes you actually know. It is not a column of opinions with no product behind them.',
      'The point is credibility with engineers and technical managers who can tell when a piece was written by someone who has not stood next to the work.',
    ],
    body:
      h2('Perspective has to be checkable') +
      paragraphs(
        'An executive view is useful when the person has authority over the process they discuss and will review the draft. Industry commentary is useful when it interprets a standard, a material shift, or a buying change your customers are already asking about. We do not invent a staff expert, and we do not publish a point of view engineering will not defend.',
        'The piece should teach something a buyer can use: how a specification goes wrong, what a new requirement changes, or why a common shortcut fails. A recap of your company history is not thought leadership.',
      ) +
      h2('It is not the whole content program') +
      paragraphs(
        'Strategy decides the plan. Guides explain a working question. Case studies recount a job. Thought leadership is the argued point of view. Those can link to each other. They should not be the same article with three titles.',
      ) +
      '<p>The wider plan is <a href="/services/content/technical-content-strategy">technical content strategy</a>. Public names and outside references that should match this voice are <a href="/services/search/entity-authority-building">entity and authority building</a>.</p>',
    situations: [
      { title: 'Competitors are quoted on a technical issue you understand better.', text: 'A clear explanation from someone who does the work is the right response. A slogan is not.' },
      { title: 'Leadership wants visibility without a topic.', text: 'We wait for a constraint worth explaining. Publishing to stay present produces empty posts.' },
      { title: 'An engineer is willing to review one strong piece a quarter.', text: 'That pace is enough. A weekly opinion slot usually outruns the review.' },
    ],
    scope: [
      { title: 'Topic and author', text: 'A real person, a real constraint, and a connection to work you sell.' },
      { title: 'The piece', text: 'An article, commentary, or executive note reviewed by the person whose name is on it.' },
      { title: 'Placement', text: 'On the site, and only then considered for a talk or a social post. The site remains the source.' },
    ],
    steps: [
      { title: 'Choose the constraint', text: 'It comes from quotes, failures, or a standard customers misread.' },
      { title: 'Interview the person who owns it', text: 'We do not write a view they have not expressed.' },
      { title: 'Draft and return it for correction', text: 'Technical lines change when the author says they are wrong.' },
      { title: 'Publish under their name', text: 'The byline matches a real role. It is not a fictional expert.' },
    ],
    offerTitle: 'Start with one argument your specialist will sign',
    offerText: 'The first piece explains one constraint, in the voice of someone on your team who will review it.',
    offerIncludes: ['Topic selection', 'An interview', 'A draft for the author to correct', 'Publication on the site'],
    offerNext: 'A series is justified only if the same standard of review continues. Volume is not the goal.',
    ctaLabel: 'Discuss thought leadership',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'One signed expert piece.' },
      { format: 'ongoing_monthly', duration: '6_months', text: 'A small number of further pieces as real topics appear.' },
    ],
    faqs: [
      { question: 'Do you ghostwrite opinions the author does not hold?', answer: 'No. The draft can organize their explanation. The point of view has to be theirs, and they review it.' },
      { question: 'Will this make AI systems call us an authority?', answer: 'No. Clear expertise can be easier to describe. A citation is not promised.' },
      { question: 'Is this a case study?', answer: 'No. A case study is one project. Thought leadership is an argument or explanation that may draw on experience without pretending to be that project report.' },
      { question: 'Can the piece live only on LinkedIn?', answer: 'The durable version should be on your site. A social post can point at it. The site is the record.' },
    ],
    ctaHeading: 'Bring the constraint your engineers are tired of correcting',
    ctaBody: 'That correction, said once in public by the person who owns it, is the piece.',
    imageSource: 'content-thought-leadership.jpg',
    imageFile: 'svc-content-thought-leadership.jpg',
    alt: 'A senior engineer speaking with two colleagues beside a blank board in a bright meeting room.',
    displayOrder: 56,
    related: ['technical-content-strategy', 'engineering-articles-guides', 'entity-authority-building'],
  },
  {
    slug: 'industrial-video-photography',
    title: 'Industrial Video & Photography',
    h1: 'Pictures and film that show the part, the process, or the condition of use',
    previewDescription:
      'Production photography, process video, product demonstrations, and interviews for manufacturer websites, sales meetings, and campaigns.',
    metaTitle: 'Industrial Video and Photography for Manufacturers',
    metaDescription:
      'Industrial photography and video for manufacturers: products, processes, equipment, and demonstrations that show what the written claims describe.',
    intro: [
      'A photograph helps when it shows the product, the interface, or the installation condition a buyer must judge. A video helps when motion, scale, or a process step is hard to see in a still. A generic factory panorama does not explain a seal.',
      'This service plans and directs that visual work for websites, presentations, and campaigns. It is not a brand identity system, and it is not a paid social campaign.',
    ],
    body:
      h2('Shoot the thing the page is about') +
      paragraphs(
        'Product photography isolates the part so material, finish, and scale are visible. Facility and equipment shots are used when the capability page depends on them, and they are framed so the relevant machine or line is identifiable. Process video shows the step that matters, not a long walk through the plant. Interviews are included when a specialist should explain a constraint on camera, and the words are checked the same way a written claim is checked.',
        'We avoid dark, interchangeable plant scenes and images that could belong to any factory. The set should be bright enough to read the object, and specific enough that a buyer in your industry recognizes the work.',
      ) +
      h2('Where the pictures go') +
      paragraphs(
        'The website, a sales deck, a distributor pack, and a paid social post should not each invent a different look for the same part. Brand identity sets the visual rules. Website development places the files so they do not slow the product page. Paid social uses the pictures. It does not replace the need to take them.',
      ) +
      '<p>The visual system around the pictures is <a href="/services/content/brand-identity-visual-communication">brand identity</a>. Placing them on the site is <a href="/services/website/website-development">website development</a>.</p>',
    situations: [
      { title: 'Every page uses the same dark shop-floor photo.', text: 'The part is never visible. New frames should show the product or the step the page describes.' },
      { title: 'Sales presents with phone pictures taken at an angle.', text: 'A short, planned shoot of the priority products replaces that set.' },
      { title: 'A process is easier to trust when someone can see it run.', text: 'A short demonstration is more useful than a paragraph that says the line is advanced.' },
    ],
    scope: [
      { title: 'Shot list', text: 'Products, processes, facilities, and people, chosen because a specific page or deck needs them.' },
      { title: 'Photography and video', text: 'Still sets and short films, with attention to material, scale, and honest operating conditions.' },
      { title: 'Use rules', text: 'Which files belong on the site, in sales material, and in campaigns, so the part looks like one product.' },
    ],
    steps: [
      { title: 'Match shots to pages', text: 'We do not shoot a catalog of moods. Each setup answers a page.' },
      { title: 'Capture in light that shows the object', text: 'Finish, fit, and context have to be readable.' },
      { title: 'Review claims that appear on camera', text: 'Spoken limits get the same engineering check as written ones.' },
      { title: 'Deliver files the site and the deck can share', text: 'One library, not three incompatible exports.' },
    ],
    offerTitle: 'Start with the products the website cannot show',
    offerText: 'The first shoot covers the priority parts or one process step that current photos fail to explain.',
    offerIncludes: ['A shot list tied to pages', 'Stills or a short film', 'A check of any spoken specification', 'Files ready for the site and for sales'],
    offerNext: 'A wider plant film waits until the priority objects are covered. We do not start with a generic brand video.',
    ctaLabel: 'Discuss photography',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'A focused shoot for priority products or one process.' },
      { format: 'campaign', duration: '6_months', text: 'Further setups as new families need to be shown.' },
    ],
    faqs: [
      { question: 'Do you guarantee cinematic advertising?', answer: 'No. The aim is a clear record of the product and the process. Drama that hides the part is not the goal.' },
      { question: 'Can interviews include performance claims?', answer: 'Only claims engineering will sign. A camera does not make an estimate more true.' },
      { question: 'Is this brand design?', answer: 'No. Brand identity sets the visual rules. This service produces the photographs and video those rules apply to.' },
      { question: 'Will you photograph every SKU?', answer: 'No. We shoot the objects and steps a buyer must see. Variants that look the same do not each need a setup.' },
    ],
    ctaHeading: 'Bring the page where the photo explains nothing',
    ctaBody: 'If a buyer cannot tell what you make from the picture, that frame is the one to replace.',
    imageSource: 'content-video-photo.jpg',
    imageFile: 'svc-content-video-photo.jpg',
    alt: 'A camera on a tripod facing a metal component on a white sweep in a bright studio.',
    displayOrder: 57,
    related: ['brand-identity-visual-communication', 'paid-social-advertising', 'website-development'],
  },
  {
    slug: 'brand-identity-visual-communication',
    title: 'Brand Identity & Visual Communication',
    h1: 'One visual system so the drawing, the page, and the name describe the same company',
    previewDescription:
      'Visual identity and communication standards for manufacturers: consistency across product pages, presentations, and sales material.',
    metaTitle: 'Brand Identity and Visual Communication for Industry',
    metaDescription:
      'Brand identity for manufacturers: visual consistency across product communication, presentations, and the way technical capabilities are shown.',
    intro: [
      'Industrial brand identity is not a new logo for its own sake. It is the rule that the company name, the product names, the drawing style, and the sales pages do not contradict each other.',
      'A buyer who sees one limit in the brochure and another on the site learns to trust neither. The visual system is how you stop that.',
    ],
    body:
      h2('Identity follows the product vocabulary') +
      paragraphs(
        'We document how the company and its brands should be named, how product lines are distinguished, and how drawings, photography, and pages should look together. Color and type are part of that, used sparingly so a specification remains readable. The system covers digital pages and printed or presentation material, because those are where the contradiction usually appears.',
        'We do not replace a working engineering drawing standard with a marketing treatment that makes the figure harder to read. Visual communication serves the technical content. It does not decorate it until the identifier disappears.',
      ) +
      h2('What this is not') +
      paragraphs(
        'It is not a photo shoot, and it is not a sales deck. Photography produces the images. Sales collateral applies the system to a specific leave-behind. This service writes the rules both of those should follow, including what must stay consistent when a distributor reprints your material.',
      ) +
      '<p>Applying the rules to a specific deck is <a href="/services/content/sales-collateral-presentations">sales collateral</a>. The pictures themselves are <a href="/services/content/industrial-video-photography">video and photography</a>.</p>',
    situations: [
      { title: 'The website, the catalog, and the booth use three different product names.', text: 'The identity work starts with the name map, then the visual rules that keep it.' },
      { title: 'A redesign made the pages handsome and the tables hard to read.', text: 'We pull the specification back into a readable hierarchy. Contrast is not a dark filter on every photo.' },
      { title: 'Partners recreate your slides in their own template.', text: 'A short, usable standard gives them less reason to invent a second look.' },
    ],
    scope: [
      { title: 'Name and brand structure', text: 'Company, brands, and product lines, and the phrases that should not be swapped.' },
      { title: 'Visual standards', text: 'Type, color, photography direction, and how a specification is shown on a page and in a deck.' },
      { title: 'Application notes', text: 'What a distributor, a designer, or a web template must not change.' },
    ],
    steps: [
      { title: 'Collect the current contradictions', text: 'Names, colors, and drawing styles that disagree are listed from real files.' },
      { title: 'Set the few rules that matter', text: 'A short standard people will follow beats a long brand book nobody opens.' },
      { title: 'Show the rules on a real page and a real slide', text: 'Examples use your products, not abstract shapes.' },
      { title: 'Leave a reference the next project can use', text: 'Photography and collateral briefs point at that reference.' },
    ],
    offerTitle: 'Start with the files that disagree',
    offerText: 'The first pass compares the website, one sales deck, and the way product names appear on drawings or quotes.',
    offerIncludes: ['A name and visual conflict list', 'A short standard', 'One page example and one slide example', 'Notes for partners who reuse the material'],
    offerNext: 'A wider rollout follows if the short standard holds. We do not begin by redesigning every printed piece.',
    ctaLabel: 'Discuss brand identity',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'A short visual and naming standard, shown on real material.' },
      { format: 'campaign', duration: '3_months', text: 'Application to further page types after the first examples are accepted.' },
    ],
    faqs: [
      { question: 'Do you design a new logo?', answer: 'Only if the current mark actively conflicts with the name structure. Most of this work is consistency, not a new symbol.' },
      { question: 'Will every photo be darkened to match a brand color?', answer: 'No. Brand color belongs in the page system. Photographs should still show the product clearly.' },
      { question: 'Is this the sales deck?', answer: 'No. The deck is sales collateral. This service sets the rules the deck should follow.' },
      { question: 'Can distributors ignore the standard?', answer: 'They often will if it is unusable. The standard is written so a partner can apply it without a designer on every slide.' },
    ],
    ctaHeading: 'Bring the two files that do not look like the same company',
    ctaBody: 'A page and a deck that disagree are a concrete place to write the rule.',
    imageSource: 'content-brand-identity.jpg',
    imageFile: 'svc-content-brand.jpg',
    alt: 'A bright design table with metal samples and pale gray and blue material swatches.',
    displayOrder: 58,
    related: ['sales-collateral-presentations', 'industrial-video-photography', 'industrial-website-design'],
  },
  {
    slug: 'sales-collateral-presentations',
    title: 'Sales Collateral & Presentations',
    h1: 'Decks and leave-behinds that repeat the specification instead of inventing another one',
    previewDescription:
      'Company and product presentations, capability decks, brochures, one-pagers, and product sheets for industrial sales teams and distributors.',
    metaTitle: 'Sales Collateral and Presentations for Manufacturers',
    metaDescription:
      'Sales presentations, brochures, and product sheets for manufacturers, copied from the public specification so the limits match the website exactly.',
    intro: [
      'Sales collateral is the material a person carries into a conversation: a company deck, a product sheet, a one-pager, a brochure. It should state the same limits as the website. A slide that quietly widens a rating is a defect.',
      'This service makes those pieces. Sales enablement is the process and the tools that tell a salesperson when to use them. The two are not the same job.',
    ],
    body:
      h2('Copy the public fact') +
      paragraphs(
        'We build presentations and sheets from the product and capability pages, not from a parallel story written for the meeting. Company decks explain who you sell to and what you do not do. Product decks and sheets carry the identifier, the application, and the exclusion. Capability decks describe the process in the same words as the plant.',
        'One-pagers and brochures are short on purpose. If a figure does not fit with its unit and its condition, it does not get abbreviated into a misleading claim. Distributors receive the same source, so they are not left to redraw the limit.',
      ) +
      h2('The piece is not the sales system') +
      paragraphs(
        'A deck does not decide who follows up an enquiry, and it does not configure a CRM. Those are sales enablement and CRM. Product pages remain the durable specification. When the datasheet changes, the slide changes with it. That update rule is part of the work.',
      ) +
      '<p>How sales uses the material is <a href="/services/sales/sales-enablement">sales enablement</a>. Partner versions are <a href="/services/sales/distributor-channel-enablement">distributor enablement</a>. The source pages are <a href="/services/content/product-capability-pages">product and capability pages</a>.</p>',
    situations: [
      { title: 'Each salesperson has a different version of the company deck.', text: 'One current deck, tied to the site, replaces the folder of private variants.' },
      { title: 'A product sheet states a range the website does not.', text: 'The sheet is corrected to the page, or the page is corrected if the sheet is the accurate one. They do not both stay.' },
      { title: 'Distributors ask for a leave-behind and receive a 40-page PDF.', text: 'They need a short pack: what you sell, what you do not, and how to send a lead back.' },
    ],
    scope: [
      { title: 'Presentations', text: 'Company, product, and capability decks aligned with the public specification.' },
      { title: 'Short documents', text: 'One-pagers, product sheets, and brochures a sales person can leave behind.' },
      { title: 'Update rule', text: 'What must change when a limit changes on the site.' },
    ],
    steps: [
      { title: 'Collect the decks actually in use', text: 'The conflicts with the website are the brief.' },
      { title: 'Write from the specification', text: 'New adjectives are not added to make a slide feel stronger.' },
      { title: 'Design for a conversation', text: 'The identifier stays visible. Decoration does not cover it.' },
      { title: 'Retire the old files', text: 'A single current version is named, including the one partners should use.' },
    ],
    offerTitle: 'Start with the deck sales actually opens',
    offerText: 'The first piece is the company or product presentation that is already in the field, corrected against the site.',
    offerIncludes: ['A conflict check against the specification', 'A revised deck or sheet', 'A note for distributors if they use it', 'The rule for the next datasheet change'],
    offerNext: 'Further sheets follow the same source. We do not design a library of pieces nobody will maintain.',
    ctaLabel: 'Discuss sales material',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'One deck or a short set of sheets for one family.' },
      { format: 'campaign', duration: '3_months', text: 'Further families once the first piece matches the site.' },
    ],
    faqs: [
      { question: 'Is this sales enablement?', answer: 'No. Enablement is how the team uses information and tools in the sales process. This service produces the presentations and documents themselves.' },
      { question: 'Can the deck claim a wider range than the site?', answer: 'No. If the deck is right and the site is wrong, the site changes too. They are not allowed to diverge.' },
      { question: 'Do you print brochures?', answer: 'We prepare the files. Print production is arranged only when you need it and is not assumed.' },
      { question: 'Will every product get a glossy brochure?', answer: 'No. A one-page sheet is often enough. A brochure is justified when the family needs more than a sheet and someone will keep it current.' },
    ],
    ctaHeading: 'Bring the slide that does not match the datasheet',
    ctaBody: 'That mismatch is the brief. The corrected piece should be something sales can send the same day.',
    imageSource: 'content-sales-collateral.jpg',
    imageFile: 'svc-content-collateral.jpg',
    alt: 'Two people at a bright table with a closed brochure and a machined metal part between them.',
    displayOrder: 59,
    related: ['sales-enablement', 'distributor-channel-enablement', 'product-capability-pages'],
  },
  {
    slug: 'sales-enablement',
    successorOf: 'sales-enablement-crm',
    title: 'Sales Enablement',
    h1: 'The information and the handoff that let sales answer with the same limits as the site',
    previewDescription:
      'Resources, talk tracks, and handoff rules that help manufacturing sales teams answer technical questions and move a qualified enquiry forward.',
    metaTitle: 'Sales Enablement Resources for Manufacturing Teams',
    metaDescription:
      'Sales enablement for manufacturers: the resources, handoff rules, and product information sales needs to answer with the same limits as the website.',
    intro: [
      'Sales enablement is the set of resources and rules that let a salesperson answer a technical question without inventing a limit, and that tell the team who owns the next step. It is how the website, the deck, and the reply stay one story.',
      'It is not the design of the brochure. That is sales collateral. It is not the installation of a CRM. That is a separate implementation service. Enablement decides what the conversation needs. The system stores it.',
    ],
    body:
      h2('What the seller has to have in hand') +
      paragraphs(
        'A manufacturing sale often stalls on a missing drawing, an unclear exclusion, or a salesperson who answers from memory. Enablement puts the current specification, the questions that qualify a fit, and the path for a technical review where the team can reach them. Talk tracks are included only as the questions to ask, not as a script that overstates the product.',
        'The handoff is part of the resource. Marketing, inside sales, and applications engineering need a shared definition of a real enquiry: a product or range, an application, and a person who will reply. Without that, a CRM full of names is not enablement.',
      ) +
      h2('Materials are inputs, not the service') +
      paragraphs(
        'Decks and one-pagers are produced as sales collateral and then used here. Lead management says who replies and how fast. CRM implementation is where those fields live if the volume requires a system. This service is the agreement and the pack the team actually uses in the conversation.',
      ) +
      '<p>The documents themselves are <a href="/services/content/sales-collateral-presentations">sales collateral and presentations</a>. The system of record is <a href="/services/sales/crm-implementation-integration">CRM implementation</a>.</p>',
    situations: [
      { title: 'Sales and the website describe different operating limits.', text: 'The enablement pack makes the site the source and retires private versions.' },
      { title: 'Technical questions bounce between inboxes.', text: 'A named path for applications review is the missing resource, not another brochure.' },
      { title: 'New representatives take months to sound accurate.', text: 'A short pack of what you sell, what you do not, and which questions to ask shortens that, if someone keeps it current.' },
    ],
    scope: [
      { title: 'Conversation resources', text: 'Current specifications, qualification questions, and the technical review path.' },
      { title: 'Handoff rules', text: 'What counts as an enquiry worth a reply, and who owns it.' },
      { title: 'Adoption', text: 'A check that the team uses the pack, and that outdated files are removed.' },
    ],
    steps: [
      { title: 'Watch how a real enquiry is answered', text: 'The gaps are the emails that reconstruct the product from scratch.' },
      { title: 'Define the qualified conversation', text: 'Product, application, and owner. Everything else is a different queue.' },
      { title: 'Assemble the pack from current pages', text: 'No new claims. Collateral is linked, not rewritten in a second voice.' },
      { title: 'Review use after a few weeks', text: 'If the team ignores the pack, the pack is wrong or the handoff is unclear. We fix that before adding tools.' },
    ],
    offerTitle: 'Start with one team and one product family',
    offerText: 'The first enablement pack covers the family that already creates technical questions, and the path those questions should take.',
    offerIncludes: ['A definition of a real enquiry', 'The questions sales should ask', 'Links to the current specification and deck', 'A named technical review path'],
    offerNext: 'CRM fields and automation are added only if this path is real. A new tool does not replace the agreement.',
    ctaLabel: 'Discuss sales enablement',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'An enablement pack for one family and one team.' },
      { format: 'ongoing_monthly', duration: '3_months', text: 'Updates as specifications change and the team finds gaps.' },
    ],
    faqs: [
      { question: 'Do you build the slide deck here?', answer: 'No. Decks and sheets are sales collateral. Enablement decides how sales uses the current material and what a qualified handoff requires.' },
      { question: 'Is a CRM required?', answer: 'Not to start. If volume is low, a shared list can hold the same facts. Implementation is a separate service when a system is justified.' },
      { question: 'Will you write scripts that promise a capability?', answer: 'No. Talk tracks ask for the duty and point at the limit. They do not widen it.' },
      { question: 'Does this include lead scoring?', answer: 'Only as a plain rule for what sales will accept. Numeric scoring models are not assumed to be useful.' },
    ],
    ctaHeading: 'Bring the enquiry that arrived without the product name',
    ctaBody: 'That missing context is the enablement problem. The pack and the handoff should make it ordinary for the next one to arrive complete.',
    imageSource: 'sales-enablement.jpg',
    imageFile: 'svc-sales-enablement.jpg',
    alt: 'A sales engineer and a buyer at a bright bench, looking at a valve and a printed sheet.',
    displayOrder: 61,
    related: ['sales-collateral-presentations', 'crm-implementation-integration', 'lead-management-nurturing'],
  },
  {
    slug: 'crm-implementation-integration',
    title: 'CRM Implementation & Integration',
    h1: 'A CRM record that keeps the product name, not a pile of contacts called web leads',
    previewDescription:
      'CRM planning, configuration, pipeline stages, and connections to the website and marketing tools, adopted by the people who update them.',
    metaTitle: 'CRM Implementation and Integration for Manufacturers',
    metaDescription:
      'CRM setup for manufacturers: pipeline stages, product and company records, and website integration. No single CRM brand is assumed or required.',
    intro: [
      'A CRM helps a manufacturer when the volume of enquiries is high enough that a spreadsheet loses the product name. It does not help if every record says web lead and nothing else.',
      'This service is the planning, configuration, and connection of that system. It is not a claim that we implement one named platform for every client. The tool should fit the team you have.',
    ],
    body:
      h2('Fields before features') +
      paragraphs(
        'We map the enquiry to stages your team will update: new, technically reviewed, quoted, won, lost, and a reason when you know it. Company and contact records stay separate from the opportunity, because a plant can have several projects. The product or range, the application, and the owner are required. Extra fields that nobody reads are left out.',
        'Integration means the website form, and later marketing tools, write those same fields. A connector that creates a blank contact is not an integration. Selection support is included when you have not chosen a system: we compare options against the process, and we do not pretend every manufacturer needs the same product.',
      ) +
      h2('Adoption is the implementation') +
      paragraphs(
        'A configured system that sales will not open is a failed project. Training is practical: how to log the product, how to hand off a technical question, and how marketing automation or analytics should read the same record. We do not install a stack of unused modules to look complete.',
      ) +
      '<p>The rules for what counts as an enquiry are <a href="/services/sales/sales-enablement">sales enablement</a>. Follow-up workflows are <a href="/services/sales/marketing-automation">marketing automation</a>.</p>',
    situations: [
      { title: 'The CRM is a contact list with no product and no stage.', text: 'The work is the data structure and the stages, not another import of names.' },
      { title: 'The website form and the CRM ask for different facts.', text: 'The form and the record are mapped once, so the product survives the handoff.' },
      { title: 'A vendor proposed a platform the team will not learn.', text: 'We start from the process. The platform has to be one the team can keep updated.' },
    ],
    scope: [
      { title: 'Process and fields', text: 'Stages, required product context, and company, contact, and opportunity structure.' },
      { title: 'Configuration and connections', text: 'The chosen CRM set up so the website, and agreed marketing tools, write the same fields.' },
      { title: 'Adoption', text: 'Working sessions with the people who must update the record after a real enquiry.' },
    ],
    steps: [
      { title: 'Write the stages from how quotes actually move', text: 'We do not paste a generic pipeline.' },
      { title: 'Choose or confirm the system', text: 'If you already have one, we use it unless it cannot hold the product context.' },
      { title: 'Configure the required fields and the form', text: 'Optional fields wait. Required ones are the product, the application, and the owner.' },
      { title: 'Train on live enquiries', text: 'Practice records are not enough. The team logs the next real request with us watching.' },
    ],
    offerTitle: 'Start with the record sales opens',
    offerText: 'The first implementation covers one pipeline and the website form that feeds it, for the enquiries you already receive.',
    offerIncludes: ['Stage and field definitions', 'Configuration of the chosen system', 'Form-to-record mapping', 'A working session with the users'],
    offerNext: 'Marketing automation and extra objects wait until people update this pipeline. We do not claim expertise in a platform we have not been asked to use.',
    ctaLabel: 'Discuss CRM setup',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'One pipeline, the core fields, and the website connection.' },
      { format: 'ongoing_monthly', duration: '3_months', text: 'Adjustments as the team finds missing fields or unused ones.' },
    ],
    faqs: [
      { question: 'Which CRM do you implement?', answer: 'The one that fits the process, or the one you already run if it can hold product context. We do not insist on a single brand.' },
      { question: 'Will a new CRM fix an empty form?', answer: 'No. If the form does not collect the product, the CRM will store the gap. The form and the record are one job.' },
      { question: 'Do you migrate every historical spreadsheet?', answer: 'Only the records you will still work. Importing dead contacts makes the system harder to trust.' },
      { question: 'Is this marketing automation?', answer: 'No. Automation sends agreed messages. CRM is the record those messages should read and update.' },
    ],
    ctaHeading: 'Bring the record that says web lead and nothing else',
    ctaBody: 'That record is the specification for the fields. The product name has to be able to live there.',
    imageSource: 'sales-crm.jpg',
    imageFile: 'svc-sales-crm.jpg',
    alt: 'A specialist at a pale desk in a bright office, working on a laptop beside a notebook.',
    displayOrder: 62,
    related: ['marketing-automation', 'analytics-conversion-tracking', 'lead-management-nurturing'],
  },
  {
    slug: 'marketing-automation',
    title: 'Marketing Automation',
    h1: 'Automated follow-up only for an action you have already defined',
    previewDescription:
      'Workflows for form handling, segmentation, and agreed follow-up, connected to the CRM so a drawing request is not treated as a live project.',
    metaTitle: 'Marketing Automation Workflows for Industrial Companies',
    metaDescription:
      'Marketing automation for manufacturers: form handling, segmentation, and follow-up workflows tied to real enquiries and the CRM record today.',
    intro: [
      'Marketing automation is justified when a specific action should trigger a specific next step: a drawing request, a quote checklist, or an internal alert to the person who owns that product. It is not a drip that pretends every download is a project.',
      'The workflow has to read the same record as sales. Otherwise marketing and the CRM describe two different enquiries.',
    ],
    body:
      h2('A trigger needs a definition') +
      paragraphs(
        'We connect forms and agreed campaign steps to segments that mean something in a manufacturing sale: product family, application, distributor versus end user, or a quote already in progress. Messages go out only when sales has agreed the content. An alert that the team mutes is treated as a failed workflow, not as engagement.',
        'Automation can route an RFQ to the right owner and send the file the visitor asked for. It should not score a newsletter signup as a hot lead. Lead management owns that distinction. The CRM stores the status. This service builds the path between the form and that record.',
      ) +
      h2('What we leave alone') +
      paragraphs(
        'Complex branching that nobody can explain is worse than a manual send. Email nurturing copy lives with the email service when the message is editorial. Here the work is the workflow: when it fires, who it notifies, and when it stops.',
      ) +
      '<p>The record it updates is <a href="/services/sales/crm-implementation-integration">CRM implementation</a>. Who is allowed to receive the message is <a href="/services/sales/lead-management-nurturing">lead management</a>.</p>',
    situations: [
      { title: 'Every download emails the whole sales team.', text: 'The alert is too broad. It should fire for a defined request and a defined owner.' },
      { title: 'A welcome sequence treats a catalog download as a project.', text: 'That sequence stops. A requested document can still be delivered automatically.' },
      { title: 'The form and the automation platform do not share field names.', text: 'The workflow cannot segment what it cannot read. Mapping comes before any message.' },
    ],
    scope: [
      { title: 'Trigger map', text: 'Which actions send a message, create a task, or do nothing.' },
      { title: 'Workflows', text: 'Form handling, internal alerts, and agreed follow-up, with an end condition.' },
      { title: 'CRM connection', text: 'The workflow writes the product and the status the team already defined.' },
    ],
    steps: [
      { title: 'List the actions worth automating', text: 'If sales has not agreed the response, it stays manual.' },
      { title: 'Map fields', text: 'The form, the automation tool, and the CRM use the same names.' },
      { title: 'Build a small set of workflows', text: 'One or two real paths, not a diagram of every possible branch.' },
      { title: 'Watch the first weeks', text: 'Muted alerts and wrong segments are removed. We do not add volume to compensate.' },
    ],
    offerTitle: 'Start with one agreed follow-up',
    offerText: 'The first workflow handles one action, such as a drawing request or an RFQ routed to an owner.',
    offerIncludes: ['The trigger and the stop rule', 'The message or task sales agreed', 'Field mapping to the CRM', 'A review after real submissions'],
    offerNext: 'More workflows wait until the first one is trusted. We do not launch a full nurture map on day one.',
    ctaLabel: 'Discuss automation',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'One workflow tied to a real form or request.' },
      { format: 'ongoing_monthly', duration: '3_months', text: 'Further triggers as the team agrees them.' },
    ],
    faqs: [
      { question: 'Will automation create more leads?', answer: 'No. It handles actions you already defined. It does not manufacture enquiries.' },
      { question: 'Do you require a particular automation brand?', answer: 'No. We use a tool that can read your forms and write to the CRM. The brand is secondary to that connection.' },
      { question: 'Is this the same as email nurturing?', answer: 'Nurturing is the content and the decision to keep writing. Automation is the mechanism that sends an agreed message or task at the right moment.' },
      { question: 'Can every download start a sequence?', answer: 'We advise against it. A download is not a project. Only defined requests should trigger sales activity.' },
    ],
    ctaHeading: 'Name the follow-up sales already promised',
    ctaBody: 'If that message is real, it can be automated. If it is not, a workflow will only send noise faster.',
    imageSource: 'sales-automation.jpg',
    imageFile: 'svc-sales-automation.jpg',
    alt: 'Hands arranging blank cards into a sequence on a white table beside a laptop in daylight.',
    displayOrder: 63,
    related: ['crm-implementation-integration', 'lead-management-nurturing', 'email-marketing-lead-nurturing'],
  },
  {
    slug: 'lead-management-nurturing',
    title: 'Lead Management & Nurturing',
    h1: 'Who replies to a real enquiry, and which later messages are actually allowed',
    previewDescription:
      'Lead capture, qualification, status, and follow-up rules for manufacturers whose buying cycles are long and technical.',
    metaTitle: 'Lead Management and Nurturing for Industrial Sales',
    metaDescription:
      'Lead management for manufacturers: qualification, status, and follow-up across long technical purchases. A signup is not treated as a quote.',
    intro: [
      'Lead management is the operating rule for enquiries: how they are captured, which ones sales will accept, who replies, and how fast. Nurturing is the smaller set of later messages that a long industrial purchase may justify.',
      'A newsletter subscriber and a request for a quote are not the same record. Mixing them is how reports look busy and the order book does not.',
    ],
    body:
      h2('Qualification is a product question') +
      paragraphs(
        'A useful industrial enquiry names a product or application, a rough stage, and a way to reply. Leads that lack that context are not nurtured into pretending they were quotes. They can be asked for the missing fact once, and then left. Statuses should match the sales process: new, needs technical review, quoted, paused, closed. A score with no definition is not a status.',
        'Nurturing fits the months when a project is real but not ready. The message is a document, a constraint, or a question sales agreed to ask. It is not a weekly digest. Marketing automation can send it. This service decides whether it should be sent at all, and what happens when someone replies.',
      ) +
      h2('Marketing and sales share the queue') +
      paragraphs(
        'Enablement defines the conversation. CRM holds the record. Email programs write the longer sequences when they are editorial. Lead management is the agreement between those pieces: one queue, one owner, and a rule that poor-fit names do not stay in the same list as active quotes.',
      ) +
      '<p>The sending mechanism is <a href="/services/sales/marketing-automation">marketing automation</a>. The sales pack is <a href="/services/sales/sales-enablement">sales enablement</a>.</p>',
    situations: [
      { title: 'Sales says marketing leads are junk, and marketing says sales never calls.', text: 'The missing piece is a shared definition and a clock for the reply, not another campaign.' },
      { title: 'Quotes go quiet for months with no agreed follow-up.', text: 'A short nurture is appropriate if there is something new to say. Silence with a status is better than a drip of slogans.' },
      { title: 'The same person is in five lists.', text: 'Segmentation by situation, not by every form they ever touched, is the cleanup.' },
    ],
    scope: [
      { title: 'Capture and qualification', text: 'What must be present before an enquiry enters the sales queue.' },
      { title: 'Status and ownership', text: 'Who replies, how the status changes, and when a lead is closed.' },
      { title: 'Nurture rules', text: 'Which paused opportunities may receive a later message, and which must not.' },
    ],
    steps: [
      { title: 'Separate quote requests from other contacts', text: 'The queues are different. The reports stay different.' },
      { title: 'Write the reply rule', text: 'Owner and timing for a complete enquiry, and the one question asked when the product is missing.' },
      { title: 'Define nurture only where a project can pause', text: 'No default sequence for everyone.' },
      { title: 'Review a month of real records', text: 'Statuses that nobody uses are removed. Speed is discussed with the people who reply.' },
    ],
    offerTitle: 'Start with the queue sales disputes',
    offerText: 'The first pass defines qualification and ownership for the enquiries you already argue about.',
    offerIncludes: ['A qualification rule', 'Statuses and owners', 'A limited nurture rule for paused work', 'A review of recent records'],
    offerNext: 'Automation can enforce the rule after people agree it. The rule comes first.',
    ctaLabel: 'Discuss lead management',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'Qualification, status, and ownership for the current enquiry types.' },
      { format: 'ongoing_monthly', duration: '3_months', text: 'Adjustments as real replies show where the rule fails.' },
    ],
    faqs: [
      { question: 'Do you promise a shorter sales cycle?', answer: 'No. Industrial purchases take the time they take. The work is to keep a real enquiry from going cold because nobody owned it.' },
      { question: 'Is nurturing the same as a newsletter?', answer: 'No. A newsletter is broad. Nurturing is a message tied to a known buying situation, and only when sales agrees.' },
      { question: 'How is this different from automation?', answer: 'Automation sends the message. Lead management decides which enquiries deserve a reply, a status, or a later note.' },
      { question: 'Can distributors submit leads into the same queue?', answer: 'Yes, if the product context is required there too. A name with no part number is not a partner lead worth the same status.' },
    ],
    ctaHeading: 'Bring the list sales will not call',
    ctaBody: 'The reasons they refuse it are the qualification rule. Write those down before adding another form.',
    imageSource: 'sales-lead-management.jpg',
    imageFile: 'svc-sales-leads.jpg',
    alt: 'Two colleagues in a bright office sorting pale folders beside a small industrial component.',
    displayOrder: 64,
    related: ['marketing-automation', 'sales-enablement', 'email-marketing-lead-nurturing'],
  },
  {
    slug: 'analytics-conversion-tracking',
    title: 'Analytics & Conversion Tracking',
    h1: 'Measurement that shows which product page assisted an enquiry',
    previewDescription:
      'Tracking for enquiries, RFQ submissions, and campaign sources, so reporting follows quote requests rather than visits alone.',
    metaTitle: 'Analytics and Conversion Tracking for Manufacturers',
    metaDescription:
      'Analytics for manufacturers: enquiry events, RFQ submissions, and source reporting tied to product pages rather than traffic or clicks alone.',
    intro: [
      'Analytics for a manufacturer should answer which pages and which campaigns assisted a serious enquiry. A rise in sessions, by itself, does not. A click on a phone number is not a completed sale.',
      'This service sets up that measurement and the report sales can read. It is not a general dashboard of every click on the site.',
    ],
    body:
      h2('Count the enquiry, then the path') +
      paragraphs(
        'Conversion events are the form submissions, RFQ sends, and other requests you have defined as real. Each event should keep the product or page context when the form has it. Traffic sources matter because they show whether paid search, organic pages, or a partner link assisted that request. Last click is recorded and then read with the pages that came before it, when the analytics tool can see them.',
        'We separate poor-fit submissions from quotes so the report cannot be improved by counting the wrong form. Revenue is not invented by multiplying enquiries by an assumed close rate. If the CRM has outcomes, the report can be compared with those outcomes. If it does not, we do not draw the missing line.',
      ) +
      h2('What this is not') +
      paragraphs(
        'It is not RFQ funnel design. That work changes the form and the path. Analytics measures the path you have. It is not an ads account. Google Ads may be one source in the report. The campaigns themselves are a different service.',
      ) +
      '<p>The record of what happened after the enquiry is <a href="/services/sales/crm-implementation-integration">CRM implementation</a>. The form path is <a href="/services/sales/rfq-funnel-optimization">RFQ funnel optimization</a>.</p>',
    situations: [
      { title: 'The report celebrates traffic while sales sees the same two quotes.', text: 'The events are pointed at enquiries, and the traffic chart is demoted.' },
      { title: 'Every phone click is labeled a conversion.', text: 'That event is renamed or removed. A call is not known to be a quote unless someone records it.' },
      { title: 'Paid and organic argue about who sourced the lead.', text: 'The report shows assisting pages and the last source, without pretending one model is the business result.' },
    ],
    scope: [
      { title: 'Event definition', text: 'Which submissions count, which are excluded, and what product context is stored.' },
      { title: 'Source and page reporting', text: 'How campaigns and product pages are read together, including the limits of last click.' },
      { title: 'A sales-readable report', text: 'A short view of enquiries by family and source, not a wall of engagement metrics.' },
    ],
    steps: [
      { title: 'List the actions that are actual requests', text: 'Other clicks stay out of the conversion count.' },
      { title: 'Check that the site records them', text: 'A form that fails silently is fixed before anyone trusts a chart. The fix may be development work.' },
      { title: 'Attach product or page context', text: 'An enquiry with no page is a weaker record, and the report should show that gap.' },
      { title: 'Read one month with sales', text: 'If the numbers do not match the enquiries they remember, the tracking is wrong and we correct it.' },
    ],
    offerTitle: 'Start with the forms you already trust',
    offerText: 'The first setup measures the RFQ or contact forms that sales recognizes, with source and page where available.',
    offerIncludes: ['Event definitions', 'A check that submissions are recorded', 'Source and page context', 'A short report format'],
    offerNext: 'Deeper campaign reporting follows only if the enquiry count matches reality. We do not add tags for their own sake.',
    ctaLabel: 'Discuss tracking',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'Enquiry events and a first report for the current forms.' },
      { format: 'ongoing_monthly', duration: '3_months', text: 'Corrections as new forms or campaigns are added.' },
    ],
    faqs: [
      { question: 'Do you promise perfect attribution?', answer: 'No. Some visits hide their source. We report what can be seen and do not invent the rest.' },
      { question: 'Is traffic still measured?', answer: 'Yes, as context. It is not the success metric. Enquiries that name a product are.' },
      { question: 'Will you install a tag on every button?', answer: 'No. Extra events make the report noisier. We track the requests you defined.' },
      { question: 'Does this replace the CRM?', answer: 'No. Analytics shows the request and its source. The CRM shows what sales did next, if the team updates it.' },
    ],
    ctaHeading: 'Bring the report sales does not believe',
    ctaBody: 'The disagreement is usually the definition of a conversion. Fix that before adding another chart.',
    imageSource: 'sales-analytics.jpg',
    imageFile: 'svc-sales-analytics.jpg',
    alt: 'A bright desk with a monitor showing abstract pale charts, a plant, and a closed notebook.',
    displayOrder: 65,
    related: ['crm-implementation-integration', 'google-ads-manufacturers', 'rfq-funnel-optimization'],
  },
  {
    slug: 'rfq-funnel-optimization',
    title: 'RFQ Funnel Optimization',
    h1: 'The path from a specification to a request that still has the model number on it',
    previewDescription:
      'RFQ forms, inquiry fields, and the steps between a product page and sales follow-up for complex industrial requests.',
    metaTitle: 'RFQ Funnel Optimization for Manufacturing Suppliers',
    metaDescription:
      'RFQ funnel work for manufacturers: forms, product context, and the path from a specification to a request that sales can actually quote from you.',
    intro: [
      'An RFQ funnel is the path from a product or application page to a request that sales can price or decline. It fails when the form drops the model number, asks for a field nobody reads, or lands the buyer on a dead end.',
      'This is narrower than general conversion work. The enquiry is technical. The fields have to carry the part, the duty, or the drawing, not a generic message box.',
    ],
    body:
      h2('The identifier has to survive') +
      paragraphs(
        'We review the pages that should start a request, the form, and what arrives in the inbox or CRM. Required fields are the ones a quote needs. Theater fields come off. If the product page already knows the family, the form should not make the buyer type it from memory. File upload for a drawing belongs here when that is how you quote.',
        'Usability matters because the buyer may be on a phone next to a machine. A form that only works on a wide desktop loses those requests. Tracking then shows where people stop, which is analytics. This service changes the path. The measurement checks whether the change helped.',
      ) +
      h2('Related work that is not this page') +
      paragraphs(
        'The visual order of the product page is design. The template is development. Google Ads can send people to the page, and the landing URL has to be the one that keeps the product context. A generic contact page is a leak in the funnel.',
      ) +
      '<p>Building the form is often <a href="/services/website/website-development">website development</a> and <a href="/services/website/ux-ui-for-engineers-b2b-buyers">UX for technical buyers</a>. Paid traffic into the path is <a href="/services/paid-media/google-ads-manufacturers">Google Ads</a>.</p>',
    situations: [
      { title: 'Quotes arrive by email because the form is painful.', text: 'The form should be easier than that email, and should ask for the same facts.' },
      { title: 'The form asks for company size and not for the model.', text: 'The fields are backwards. The model stays. The unused question goes.' },
      { title: 'Ads land on the homepage and the product is lost.', text: 'The funnel starts at the landing URL, not only at the submit button.' },
    ],
    scope: [
      { title: 'Path review', text: 'From the product or application page to the confirmation the buyer sees.' },
      { title: 'Form and fields', text: 'What is required, what is removed, and how a drawing or model number is attached.' },
      { title: 'Handoff check', text: 'Whether sales receives the context, not only an email address.' },
    ],
    steps: [
      { title: 'Submit the form the way a buyer would', text: 'We use a real product page and note every place the context disappears.' },
      { title: 'Rewrite the fields with sales', text: 'If they will not read it, it is not required.' },
      { title: 'Specify the template change', text: 'Development implements it. We do not call a slide a finished form.' },
      { title: 'Compare the next enquiries', text: 'The test is whether requests arrive with the part identified, not whether the submit rate jumped for empty forms.' },
    ],
    offerTitle: 'Start with one product form',
    offerText: 'The first review follows one family from the page to the record sales opens.',
    offerIncludes: ['A path walkthrough', 'A revised field list', 'Notes for design or development', 'A check of what sales receives'],
    offerNext: 'Other forms are copied from that pattern. We do not redesign every contact box at once.',
    ctaLabel: 'Discuss the RFQ path',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'One product path from page to sales record.' },
      { format: 'campaign', duration: '3_months', text: 'Further families after the first form is in use.' },
    ],
    faqs: [
      { question: 'Is this the same as website conversion optimization?', answer: 'It is the RFQ-specific version. The goal is a technically complete request, not a higher count of thin contact submissions.' },
      { question: 'Do you build the form?', answer: 'We specify it and check the result. Implementation on the site is website development unless the change is only the questions and the page already supports them.' },
      { question: 'Will you guarantee more RFQs?', answer: 'No. A clearer form can raise complete requests and lower empty ones. Volume is not promised.' },
      { question: 'Should every page have a long form?', answer: 'No. The form belongs where someone is ready to ask about a product. Other pages can point there.' },
    ],
    ctaHeading: 'Send the last RFQ that arrived without a part number',
    ctaBody: 'The missing field is the start of the review. The page and the form should have carried it.',
    imageSource: 'sales-rfq-funnel.jpg',
    imageFile: 'svc-sales-rfq.jpg',
    alt: 'Two people at a bright bench reviewing a technical drawing and a metal part beside an inquiry form.',
    displayOrder: 66,
    related: ['website-development', 'ux-ui-for-engineers-b2b-buyers', 'google-ads-manufacturers'],
  },
  {
    slug: 'distributor-channel-enablement',
    title: 'Distributor & Channel Enablement',
    h1: 'A current pack so partners describe your limits the way the factory does',
    previewDescription:
      'Product information, sales tools, and lead handback for manufacturers that sell through distributors, dealers, and representatives.',
    metaTitle: 'Distributor and Channel Enablement for Manufacturers',
    metaDescription:
      'Channel enablement for manufacturers: partner packs, product limits, and a way for distributor leads to return with the product name attached.',
    intro: [
      'Distributors repeat the material you give them. If the partner sheet states a different limit from the website, both of you look careless. Channel enablement is the pack and the handback rule that prevent that.',
      'It is not general sales enablement for your own team, and it is not an international strategy. Those decide other questions. This service is about the people who sell your product without being on your payroll.',
    ],
    body:
      h2('What the partner is allowed to say') +
      paragraphs(
        'The pack states what you sell, what you do not, which product names to use, and how a lead comes back to the factory. It includes the current sheets or pages, not a folder of outdated PDFs. Pricing rules and territory rules are included only when you already have them. We do not invent a discount structure.',
        'Lead coordination means a partner enquiry arrives with the product and the partner name, and someone at the factory owns it. A shared inbox with no owner is not coordination. International partners need the same facts in the language you can maintain. That language decision belongs with international strategy. The pack has to follow it.',
      ) +
      h2('Your own sales team is a different audience') +
      paragraphs(
        'Internal enablement assumes the person can ask engineering down the hall. A distributor often cannot. The material has to stand alone, and it has to be short enough to be used. Product pages remain the source. Collateral is the leave-behind. This service assembles the partner version and the path for leads.',
      ) +
      '<p>Market choice is <a href="/services/strategy/international-marketing-strategy">international marketing strategy</a>. The pages partners should copy are <a href="/services/content/product-capability-pages">product and capability pages</a>.</p>',
    situations: [
      { title: 'Partners still circulate a discontinued range.', text: 'The pack names what is current and what must be pulled. A new brochure is useless if the old file remains.' },
      { title: 'Leads from dealers arrive as a forwarded email with no part number.', text: 'The handback form or template requires the product. Otherwise it is not a lead you can quote.' },
      { title: 'Each region designed its own one-pager.', text: 'The limits diverged. One source pack replaces the local inventions.' },
    ],
    scope: [
      { title: 'Partner pack', text: 'Current product facts, exclusions, and the files partners may send.' },
      { title: 'Lead handback', text: 'How an enquiry returns with the product, the partner, and an owner at the factory.' },
      { title: 'Update routine', text: 'Who tells partners when a limit or a range changes.' },
    ],
    steps: [
      { title: 'List the partners who actually sell', text: 'The pack is for them, not for a database of inactive names.' },
      { title: 'Compare their material with the site', text: 'Conflicts are corrected at the source.' },
      { title: 'Write the handback rule', text: 'Required fields and the factory owner.' },
      { title: 'Issue one pack and retire the rest', text: 'Partners are told which file is current.' },
    ],
    offerTitle: 'Start with one channel and one family',
    offerText: 'The first pack covers the product family your active partners already sell, and the way their enquiries should return.',
    offerIncludes: ['A conflict check against the site', 'A short partner pack', 'A handback rule', 'A note on which old files to withdraw'],
    offerNext: 'Further families or regions follow the same source. We do not write a unique story for every dealer.',
    ctaLabel: 'Discuss channel enablement',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'A pack and handback rule for one family and one partner group.' },
      { format: 'ongoing_monthly', duration: '3_months', text: 'Updates when specifications change and partners need the new file.' },
    ],
    faqs: [
      { question: 'Do you recruit distributors?', answer: 'No. This service supports partners you already have. Finding new ones is a different commercial decision.' },
      { question: 'Can partners change the specification in their own ads?', answer: 'They often try. The pack says what must not change. Enforcement is your commercial relationship, which we do not pretend to replace.' },
      { question: 'Is this sales enablement?', answer: 'Enablement for your own team is a separate service. Channel enablement is the partner pack and the lead path back to the factory.' },
      { question: 'Will you translate the pack into every market?', answer: 'Only into languages you can keep accurate. Otherwise the source language stays, and international strategy should say so.' },
    ],
    ctaHeading: 'Bring the partner sheet that does not match the site',
    ctaBody: 'That sheet is the reason for a single pack. The next lead should come back with the product name on it.',
    imageSource: 'sales-distributor.jpg',
    imageFile: 'svc-sales-distributor.jpg',
    alt: 'A manufacturer and a partner examining components at a bright showroom counter.',
    displayOrder: 67,
    related: ['international-marketing-strategy', 'product-capability-pages', 'sales-collateral-presentations'],
  },
  {
    slug: 'trade-show-event-marketing',
    title: 'Trade Show & Event Marketing',
    h1: 'Show conversations that come back with a product name and an owner',
    previewDescription:
      'Pre-event pages, booth inquiry capture, presentation material, and post-show follow-up for industrial exhibitions and conferences.',
    metaTitle: 'Trade Show and Event Marketing for Industrial Firms',
    metaDescription:
      'Trade show marketing for manufacturers: event pages, lead capture, presentations, and follow-up that returns a product name to the sales team.',
    intro: [
      'A trade show is useful when the notes come home with a product, an application, and a person who will reply. A stack of badges is not a pipeline. This service is the digital and follow-up system around the event, not a booth construction contract.',
      'It is also not a paid advertising program. Ads may invite people to a page. The event work is the page, the capture, the material, and what happens on the next business day.',
    ],
    body:
      h2('Before, during, and after') +
      paragraphs(
        'Before the show, a landing page states what you will exhibit and how to book a conversation, without inventing a product for the occasion. Invitations go to accounts you already want, often alongside LinkedIn or email, and they point at that page. At the booth, the capture method has to record the product discussed. A badge scan with no note is stored as a contact, not as an opportunity.',
        'Presentation material uses the same limits as the website. Photography or video shot for the booth should show the equipment you are actually displaying. After the show, follow-up is sorted: quotes, technical questions, and people who only wanted a catalog. CRM is where those notes should land if you use one. The follow-up owner is named before you travel.',
      ) +
      h2('What we do not sell') +
      paragraphs(
        'We do not promise a number of booth visitors or meetings. Floor traffic depends on the show. The work is to make the conversations you do have usable when you are back at the plant.',
      ) +
      '<p>Booth imagery is <a href="/services/content/industrial-video-photography">video and photography</a>. Account invitations may use <a href="/services/paid-media/linkedin-ads-b2b-campaigns">LinkedIn campaigns</a>. The record is <a href="/services/sales/crm-implementation-integration">CRM implementation</a>.</p>',
    situations: [
      { title: 'Last year the team returned with badges and no applications.', text: 'The capture form is changed so a note without a product is incomplete on purpose.' },
      { title: 'The show landing page is the homepage with a date added.', text: 'Visitors cannot tell what is on the stand. A specific page is the pre-event job.' },
      { title: 'Follow-up starts two weeks later, when the context is gone.', text: 'The owner and the first message are set before the show, not invented on the plane home.' },
    ],
    scope: [
      { title: 'Pre-event page and invitations', text: 'What you are showing, who is invited, and where they are sent.' },
      { title: 'Capture and presentations', text: 'The questions asked on the stand, and decks that match the specification.' },
      { title: 'Post-event follow-up', text: 'Sorting notes into quotes, technical questions, and contacts that are not opportunities.' },
    ],
    steps: [
      { title: 'Name the products on the stand', text: 'The page and the capture form use that list.' },
      { title: 'Prepare the invitation and the deck', text: 'Both point at the same limits. No show-only claims.' },
      { title: 'Set the note format and the owner', text: 'A conversation without a product is filed as a contact only.' },
      { title: 'Run the follow-up in the first days back', text: 'The sort happens while people remember the discussion.' },
    ],
    offerTitle: 'Start with the next show on the calendar',
    offerText: 'The first plan covers one event: the page, the capture questions, and the follow-up owner.',
    offerIncludes: ['An event page outline', 'Capture questions', 'A deck check against the specification', 'A follow-up sort rule'],
    offerNext: 'Booth build and travel are yours. We do not manage the stand contractor. Later shows reuse the same capture rule.',
    ctaLabel: 'Discuss an event',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'The digital and follow-up plan for one show.' },
      { format: 'campaign', duration: '6_months', text: 'A second event using the same capture and CRM path.' },
    ],
    faqs: [
      { question: 'Do you design and build the booth?', answer: 'No. We handle the page, the inquiry path, the presentation content, and the follow-up. Physical stand construction is outside this service.' },
      { question: 'Will you guarantee meetings at the show?', answer: 'No. Invitations can be sent to the right accounts. Attendance is their decision.' },
      { question: 'Is a badge scan a lead?', answer: 'It is a contact. It becomes an enquiry when the product and the need are recorded and someone owns the reply.' },
      { question: 'How is this different from paid ads?', answer: 'Ads can invite people. This service is the event itself: the page, the stand conversation, and the follow-up. The media buy is separate.' },
    ],
    ctaHeading: 'Bring the badge list from the last show',
    ctaBody: 'If the product discussed is missing, that list shows the capture rule to write before you exhibit again.',
    imageSource: 'sales-trade-show.jpg',
    imageFile: 'svc-sales-trade-show.jpg',
    alt: 'A bright exhibition booth with industrial equipment on a platform and two people talking beside it.',
    displayOrder: 68,
    related: ['industrial-video-photography', 'linkedin-ads-b2b-campaigns', 'crm-implementation-integration'],
  },
]

const OVERVIEW_IMAGES = {
  content: {
    source: 'overview-content.jpg',
    file: 'svc-overview-content.jpg',
    alt: 'A bright studio table with a drawing tube, metal samples, a camera, and a closed folder.',
  },
  sales: {
    source: 'overview-sales.jpg',
    file: 'svc-overview-sales.jpg',
    alt: 'A bright office desk with a laptop and a product sample, looking onto a clean factory floor.',
  },
} as const

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
  for (const file of ['content', 'sales'] as const) {
    const raw = readFileSync(path.join(process.cwd(), 'src', 'scripts', 'content', 'services', `${file}.html`), 'utf8')
    const cards = raw.split('@@cards')[1]?.trim().split('\n').filter(Boolean) ?? []
    const expected = file === 'content' ? 9 : 8
    if (cards.length !== expected) throw new Error(`${file} cards ${cards.length}`)
    const hrefs = new Set<string>()
    for (const line of cards) {
      const [title, href, text] = line.split(' || ')
      if (!title || !href?.startsWith('/services/') || !text) throw new Error(`Bad card ${line}`)
      if (hrefs.has(href)) throw new Error(`Duplicate card ${href}`)
      hrefs.add(href)
      if (text.trim().length < 150 || text.trim().length > 250) throw new Error(`card ${text.trim().length} ${title}`)
    }
    if (!existsSync(path.join(process.cwd(), 'public', 'media', OVERVIEW_IMAGES[file].source))) {
      throw new Error(`Missing overview image ${file}`)
    }
  }
}

const uploadFile = async (payload: Payload, sourceName: string, fileName: string, alt: string) => {
  const source = path.join(process.cwd(), 'public', 'media', sourceName)
  const buffer = await sharp(source).rotate().resize({ width: 1800, withoutEnlargement: true }).jpeg({ quality: 82 }).toBuffer()
  const file = { name: fileName, data: buffer, mimetype: 'image/jpeg' as const, size: buffer.byteLength }
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: fileName } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (existing.docs[0]) return Number(existing.docs[0].id)
  const created = await payload.create({
    collection: 'media',
    data: { alt },
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

const updateOverview = async (
  payload: Payload,
  slug: 'content' | 'sales',
  file: 'content' | 'sales',
  imageId: number,
) => {
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
  const meta = typeof overview.meta === 'object' && overview.meta ? overview.meta : {}
  await payload.update({
    collection: 'services',
    id: overview.id,
    draft: false,
    overrideAccess: true,
    context,
    data: {
      service_preview_image: imageId,
      service_card_image: imageId,
      meta: { ...meta, image: imageId },
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
  for (const page of PAGES) {
    imageIds.set(page.slug, await uploadFile(payload, page.imageSource, page.imageFile, page.alt))
  }
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
  const relatedSlugs = [...new Set(PAGES.flatMap((page) => [page.slug, ...page.related]))]
  const relatedDocs = await payload.find({
    collection: 'services',
    depth: 0,
    limit: 80,
    overrideAccess: true,
    where: { slug: { in: relatedSlugs } },
    select: { slug: true },
  })
  const idBySlug = new Map(relatedDocs.docs.map((doc) => [doc.slug, Number(doc.id)]))
  for (const page of PAGES) await setRelated(payload, page.slug, page.related, idBySlug)
  await rewriteCollection(payload, 'posts')
  await rewriteCollection(payload, 'pages')
  await rewriteCollection(payload, 'case-studies')
  await rewriteCollection(payload, 'services')
  const contentImage = await uploadFile(payload, OVERVIEW_IMAGES.content.source, OVERVIEW_IMAGES.content.file, OVERVIEW_IMAGES.content.alt)
  const salesImage = await uploadFile(payload, OVERVIEW_IMAGES.sales.source, OVERVIEW_IMAGES.sales.file, OVERVIEW_IMAGES.sales.alt)
  await updateOverview(payload, 'content', 'content', contentImage)
  await updateOverview(payload, 'sales', 'sales', salesImage)
  process.exit(0)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
