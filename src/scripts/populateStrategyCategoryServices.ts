import 'dotenv/config'
import { readFileSync } from 'fs'
import path from 'path'

import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload, type Payload } from 'payload'
import sharp from 'sharp'

import { getServiceUrl } from '../utilities/getContentUrls'
import { getTiptapExtensions } from '../utilities/richText/extensions'
import { LEGACY_SERVICE_REDIRECTS } from '../utilities/serviceCatalog'

const context = { disableCategorySeo: true }

const rt = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [2, 3, 4] }))
const rtCta = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [1, 2, 3, 4] }))

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const paragraphs = (...texts: string[]) => texts.map((text) => `<p>${escapeHtml(text)}</p>`).join('')

const bullets = (items: string[]) =>
  `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`

type PageCopy = {
  slug: string
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
  formats: { format: 'initial_project' | 'campaign' | 'ongoing_monthly'; duration: 'one_time_project' | '3_months' | '6_months'; text: string }[]
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
    slug: 'market-competitor-research',
    title: 'Market & Competitor Research',
    h1: 'How manufacturers find out who buyers already compare them with',
    previewDescription:
      'A short competitor brief for a specific product and application, built from lost quotes and public catalogs rather than a generic industry scan.',
    metaTitle: 'Market and Competitor Research for Industrial Manufacturers',
    metaDescription:
      'A manufacturer-side review of the competitors buyers already shortlist, drawn from lost quotes, public catalogs, and the applications those companies claim.',
    intro: [
      'A plant usually knows its famous rivals and still loses quotes to a company it did not put on the slide. The name that matters is the one a buyer writes down for a particular part, standard, and application.',
      'This service produces that comparison. It uses lost quotes, the catalogs those competitors publish, and the applications your sales team is actually asked to defend.',
    ],
    body:
      `<h2>${escapeHtml('A comparison has to name the product')}</h2>` +
      paragraphs(
        'A market summary that covers "industrial equipment" does not help a salesperson explain why a valve, a panel, or a machined housing was specified against someone else. The unit of research is a product family plus the application the buyer is trying to solve.',
        'We start from quotes you lost or discounted, and from the competitors your sales engineers already hear on calls. Public websites, catalogs, and distributor listings fill in what those companies claim to make and where they say they apply it. If a claim cannot be checked against a page or a document, it stays out of the brief.',
      ) +
      `<h2>${escapeHtml('What the brief is for')}</h2>` +
      paragraphs(
        'The result is a short comparison sales can keep next to the quote file: who shows up for this application, which specification they lead with, and where their public story is thinner than yours or stronger. It is not a ranking of websites and it is not a prediction of win rate.',
        'That brief is an input to the marketing roadmap. Positioning, the website, and any later campaign should use the same competitor set, so the company is not answering a different shortlist in each channel.',
      ),
    situations: [
      {
        title: 'Sales keeps hearing a competitor name that marketing has never written down.',
        text: 'The name appears in lost-quote notes and in distributor conversations, but the website still talks about a broader set of rivals. The research starts from those notes.',
      },
      {
        title: 'A new product line is being quoted with no picture of who already owns the specification.',
        text: 'Engineering can make the part. Purchasing at the customer already has an approved vendor. The brief records who that vendor appears to be, and which claims they publish.',
      },
      {
        title: 'Competitive slides were written once and now contradict the current catalog.',
        text: 'Old battle cards list features you no longer lead with, or competitors who have changed range. The work replaces that slide with a comparison tied to current public material.',
      },
    ],
    scope: [
      {
        title: 'Lost-quote and win-note review',
        text: 'A pass through recent quotes where a competitor was named, grouped by product family and application. The sample is whatever the sales team can actually retrieve.',
      },
      {
        title: 'Public catalog comparison',
        text: 'For the shortlisted competitors, a record of the products, standards, and applications they state in public. Unsupported inferences are marked as such or left out.',
      },
      {
        title: 'Sales-ready comparison',
        text: 'A brief your team can use on the next similar quote: where you overlap, where you do not, and which claims need an engineer before they are repeated.',
      },
    ],
    steps: [
      {
        title: 'Choose the product and application',
        text: 'We agree the family and the job the buyer is trying to do. A whole company catalog is too wide for one comparison.',
      },
      {
        title: 'Collect the names sales already hears',
        text: 'Interviews and quote notes come before a desk search. The desk search checks those names and adds only companies that show up in the same application.',
      },
      {
        title: 'Read what they publish',
        text: 'Catalogs, product pages, and distributor listings are the source. We do not invent specifications that are not printed.',
      },
      {
        title: 'Write the brief and walk it through sales',
        text: 'Sales marks anything they would not say to a buyer. Those lines are removed or sent back to engineering before the brief is finished.',
      },
    ],
    offerTitle: 'Start with one product family',
    offerText:
      'The first comparison covers one product family and the applications attached to it. You keep the brief whether or not the work continues into a roadmap.',
    offerIncludes: [
      'A defined product family and application, agreed with sales',
      'The competitor names already appearing in recent quotes',
      'A public-catalog comparison for that set',
      'A recommendation on whether the finding belongs in the roadmap',
    ],
    offerNext:
      'Scope depends on how many product families are in play and how complete the quote history is. The first family produces a clear next step.',
    ctaLabel: 'Discuss a competitor brief',
    formats: [
      {
        format: 'initial_project',
        duration: 'one_time_project',
        text: 'One product family, from quote notes through a sales-reviewed comparison.',
      },
      {
        format: 'campaign',
        duration: '3_months',
        text: 'A sequence of families, used when a roadmap needs more than one shortlist before channel decisions are made.',
      },
    ],
    faqs: [
      {
        question: 'Do you need access to our CRM or quote files?',
        answer:
          'We need the quotes where a competitor was named, in whatever form you keep them. A full CRM export is useful when it exists. A salesperson reading from the last quarter of notes is enough to start.',
      },
      {
        question: 'Will the brief tell us how to beat a competitor on price?',
        answer:
          'No. It records what they publicly claim and where your quotes already collide with them. Pricing tactics are a sales decision, and we do not invent a discount.',
      },
      {
        question: 'How is this different from the marketing roadmap?',
        answer:
          'The roadmap decides which products and channels get time. This brief is one of the inputs: the shortlist buyers already use for a specific application.',
      },
      {
        question: 'Can you research a country we do not sell in yet?',
        answer:
          'Only as a separate question about whether the product and the sales capacity exist for that country. A competitor list is not a reason to enter a market.',
      },
    ],
    ctaHeading: 'Bring the quotes where the competitor was named',
    ctaBody:
      'Tell us the product family and how your team records lost work. We will say whether a comparison is the right first step.',
    imageSource: 'blog-first-party-data-manufacturing.jpg',
    imageFile: 'strategy-market-competitor-research.jpg',
    alt: 'A precision-machined steel component on a workbench beside measuring tools and an engineering drawing.',
    displayOrder: 8,
    related: ['marketing-strategy-roadmap', 'brand-positioning-messaging'],
  },
  {
    slug: 'brand-positioning-messaging',
    title: 'Brand Positioning & Messaging',
    h1: 'Positioning language a sales engineer can repeat next to a part number',
    previewDescription:
      'A short set of claims engineering will sign and a salesperson can use in a quote, written for a specific product line rather than a company slogan.',
    metaTitle: 'Brand Positioning and Messaging for Industrial Firms',
    metaDescription:
      'Positioning and sales language for manufacturers: what you make, who it is for, and which claims engineering will actually stand behind on a quote.',
    intro: [
      'Industrial buyers meet your company in a quote, a datasheet, and a short email from a sales engineer. A positioning line that only works in a workshop is not in use.',
      'The work is to write the few sentences that can sit next to a part number: what the product is, which application it is for, and which claims your engineers will not make.',
    ],
    body:
      `<h2>${escapeHtml('The sentence has to survive a quote')}</h2>` +
      paragraphs(
        'A manufacturer can sound precise in a brand session and vague on the website a month later. The test we use is practical. If a salesperson cannot paste the sentence into a quotation without adding a disclaimer, it is not finished.',
        'We write against a real product line. "Quality" and "innovation" come out. What stays is the application, the limit, and the buyer role the product is meant for. Engineering reviews the lines that mention a specification, a standard, or a performance limit.',
      ) +
      `<h2>${escapeHtml('Where the language has to match')}</h2>` +
      paragraphs(
        'The same description should be usable on the product page, in the sales leave-behind, and in the first reply to an RFQ. When those three texts disagree, the buyer treats all of them as drafts.',
        'This is not a visual identity project and it does not rename the company. It produces the words the roadmap, the site, and the sales team are supposed to share.',
      ),
    situations: [
      {
        title: 'The website, the brochure, and the quote describe different companies.',
        text: 'Each was written by a different person, in a different year. The project picks the product lines that matter this year and writes one description for them.',
      },
      {
        title: 'Sales has stopped using the approved message.',
        text: 'They rewrote it because the approved line did not answer the question on the RFQ. We start from the sentences they actually send.',
      },
      {
        title: 'A new range needs language before the page is designed.',
        text: 'Design can wait. The page structure needs to know what the range is for, and what it is not for, before anyone chooses a layout.',
      },
    ],
    scope: [
      {
        title: 'Claim review with engineering',
        text: 'Every line that states a capability, a material, or a limit is checked with the person who would defend it. Lines they will not sign are removed.',
      },
      {
        title: 'Message set for the priority products',
        text: 'A short description, the buyer it is for, and the applications that are in scope. The same set is written so a product page and a quote can both use it.',
      },
      {
        title: 'Handoff notes for the website and sales material',
        text: 'A record of which existing pages and leave-behinds contradict the new language, so the next edit does not put the old slogan back.',
      },
    ],
    steps: [
      {
        title: 'Read the words already in market',
        text: 'We collect the homepage, the priority product pages, and a sample of real quotes and sales emails.',
      },
      {
        title: 'Separate claims from slogans',
        text: 'Specifications and applications stay. Phrases that could describe any plant are set aside.',
      },
      {
        title: 'Draft the lines and review them with engineering and sales',
        text: 'Engineering owns the technical sentence. Sales owns whether they would send it. Both have to agree before it is called final.',
      },
      {
        title: 'Mark the pages that still contradict it',
        text: 'The deliverable includes a list of public pages and sales files that need the new language, without pretending the rewrite of those pages is already done.',
      },
    ],
    offerTitle: 'Start with the products you quote most',
    offerText:
      'The first pass covers the product lines that produce the quotes you want more of. You receive language your own team has reviewed.',
    offerIncludes: [
      'A reading of the current site and a sample of quotes',
      'A draft message set for the priority product lines',
      'An engineering and sales review of any technical claim',
      'A list of pages and files that still use the old wording',
    ],
    offerNext:
      'A full catalog is a later decision. One or two product lines show whether the company can keep a single description in use.',
    ctaLabel: 'Discuss positioning',
    formats: [
      {
        format: 'initial_project',
        duration: 'one_time_project',
        text: 'A message set for the priority product lines, reviewed with engineering and sales.',
      },
      {
        format: 'ongoing_monthly',
        duration: '3_months',
        text: 'A follow-up period to check that new pages and quotes still use the agreed lines.',
      },
    ],
    faqs: [
      {
        question: 'Is this a new logo or a new company name?',
        answer:
          'No. The deliverable is language: what you manufacture, who it is for, and which claims are allowed. Visual identity is a different project.',
      },
      {
        question: 'Who has to approve a technical claim?',
        answer:
          'The engineer or product owner who would answer the question on a call. Marketing does not sign a specification.',
      },
      {
        question: 'Will you rewrite the whole website as part of this?',
        answer:
          'The positioning work lists the pages that contradict the agreed language. Rewriting and rebuilding those pages is the website service, scoped separately.',
      },
      {
        question: 'What if sales and engineering disagree?',
        answer:
          'The more cautious line stays. A sentence sales wants and engineering will not defend is how inaccurate claims reach a buyer.',
      },
    ],
    ctaHeading: 'Bring a quote and the page that should match it',
    ctaBody:
      'If those two texts already disagree, that is enough to start. We will tell you whether a positioning pass is the right scope.',
    imageSource: 'blog-technical-content-manufacturing.jpg',
    imageFile: 'strategy-brand-positioning-messaging.jpg',
    alt: 'Two engineers comparing an industrial valve assembly with a paper drawing at a workbench.',
    displayOrder: 9,
    related: ['marketing-strategy-roadmap', 'buyer-persona-research'],
  },
  {
    slug: 'buyer-persona-research',
    title: 'Buyer Persona Research',
    h1: 'The buying roles inside an industrial purchase, taken from real sales conversations',
    previewDescription:
      'A record of who actually takes part in a manufacturer\'s sale: the engineer, the maintenance lead, and procurement, based on live deals rather than stock portraits.',
    metaTitle: 'Buyer Persona Research for Industrial Buying Teams',
    metaDescription:
      'Buyer research for manufacturers based on real sales conversations: what engineers, maintenance leads, and procurement each need before a quote can move.',
    intro: [
      'An industrial purchase is rarely one person. An engineer checks the specification, maintenance asks whether the part can be serviced, and procurement asks for terms, documents, and an approved vendor.',
      'Persona work here is a record of those roles in your deals. It is built from sales conversations and lost or won quotes, not from a template with a stock photo and a fictional job title.',
    ],
    body:
      `<h2>${escapeHtml('The role matters more than a portrait')}</h2>` +
      paragraphs(
        'A page written for "the buyer" tends to mix three questions that are not asked by the same person. The engineer wants the limit and the standard. Maintenance wants the spare, the lead time, and what fails in the field. Procurement wants the document set and the commercial path.',
        'We interview the people who sit on your side of those conversations, and where you can arrange it, we listen to how a recent deal was argued. The notes stay tied to a product family. A persona for the whole company is too blunt to change a page or a sales email.',
      ) +
      `<h2>${escapeHtml('What changes after the interviews')}</h2>` +
      paragraphs(
        'The useful output is a short account of each role: the question they ask, the proof they accept, and the point at which they stop a quote. Marketing can then decide which of those questions belongs on the product page and which belongs in a follow-up from sales.',
        'We do not assign percentages of influence, and we do not invent a day-in-the-life. If a role did not appear in the deals you showed us, it is not in the write-up.',
      ),
    situations: [
      {
        title: 'The website answers a technical question and ignores the person who issues the PO.',
        text: 'Enquiries arrive with a specification and then stall on documents, terms, or vendor setup. The research separates those steps.',
      },
      {
        title: 'Sales says marketing\'s content is written for the wrong person.',
        text: 'That complaint is specific enough to test. We ask which sentences they delete before sending a link, and which role those sentences were aimed at.',
      },
      {
        title: 'A new market is being described with the same buyer as the home market.',
        text: 'The maintenance contractor, the OEM engineer, and the distributor are not the same reader. The interviews show which of them is actually in the deals you have.',
      },
    ],
    scope: [
      {
        title: 'Deal interviews',
        text: 'Conversations with sales and application engineering about recent quotes: who joined, what they asked, and where the quote stopped.',
      },
      {
        title: 'Role notes for the priority product',
        text: 'A written account of each role that actually appeared, including the evidence they asked for. Roles that did not appear are omitted.',
      },
      {
        title: 'Implications for pages and sales replies',
        text: 'Which questions belong on the public page, and which should stay in a direct reply. This is a recommendation, not a redesigned site.',
      },
    ],
    steps: [
      {
        title: 'Pick the deals',
        text: 'A handful of recent quotes, won and lost, in one product family. More deals do not help if they are all the same application.',
      },
      {
        title: 'Interview the people who were on the call',
        text: 'Sales and application engineering first. A customer conversation only happens when you can introduce it without turning the project into a survey campaign.',
      },
      {
        title: 'Write the roles and the questions',
        text: 'Each role gets the question they ask and the proof they accept. We do not add demographics we did not hear.',
      },
      {
        title: 'Review the notes with the team that will use them',
        text: 'If sales does not recognise the write-up, it is revised. A persona nobody will use is a failed deliverable.',
      },
    ],
    offerTitle: 'Start from five recent deals',
    offerText:
      'Five quotes in one product family are enough to see the roles. You receive the notes, including the gaps where the team could not say who stopped the deal.',
    offerIncludes: [
      'A chosen product family and a short list of deals',
      'Interviews with the sales and engineering people on those deals',
      'Role notes limited to people who actually appeared',
      'A recommendation on what the product page still fails to answer',
    ],
    offerNext:
      'Customer interviews are added only when you can make the introduction. The internal interviews are enough for a first version.',
    ctaLabel: 'Discuss buyer research',
    formats: [
      {
        format: 'initial_project',
        duration: 'one_time_project',
        text: 'Role notes for one product family, based on recent deals.',
      },
      {
        format: 'campaign',
        duration: '3_months',
        text: 'A second family, used when the first notes show that OEM and end-user deals are not the same purchase.',
      },
    ],
    faqs: [
      {
        question: 'Do you write fictional buyer profiles?',
        answer:
          'No. If a detail did not come from a deal or an interview, it is not in the document. We would rather leave a role thin than invent a biography.',
      },
      {
        question: 'Will you interview our customers?',
        answer:
          'Only when you introduce the conversation and the customer agrees. Many projects stop at your sales and application engineers, who hear the questions every week.',
      },
      {
        question: 'How should marketing use the notes?',
        answer:
          'As a check on pages and emails: which role is being answered, and which question is still missing. The notes are not a media plan.',
      },
      {
        question: 'Does this replace the marketing roadmap?',
        answer:
          'It feeds the roadmap. The roadmap still has to decide which product and which market get the work. A persona does not make that choice.',
      },
    ],
    ctaHeading: 'Start with deals the team can still describe',
    ctaBody:
      'If sales can walk through a few recent quotes, the roles can be written down. Bring the product family, not a blank persona template.',
    imageSource: 'blog-linkedin-b2b-manufacturing.jpg',
    imageFile: 'strategy-buyer-persona-research.jpg',
    alt: 'Engineers reviewing a machined metal part together in a workshop.',
    displayOrder: 10,
    related: ['marketing-strategy-roadmap', 'market-competitor-research'],
  },
  {
    slug: 'fractional-marketing-advisory',
    title: 'Fractional Marketing Advisory',
    h1: 'Ongoing marketing judgment for a plant that does not need a full-time marketing director',
    previewDescription:
      'A part-time marketing lead who keeps the website, content, and campaigns lined up with the product priorities sales already agreed.',
    metaTitle: 'Fractional Marketing Advisory for Industrial Firms',
    metaDescription:
      'Part-time marketing leadership for manufacturers: keeping the site, content, and campaigns tied to agreed product priorities, without a full-time director.',
    intro: [
      'A lot of industrial companies have a website vendor, a freelance designer, and a salesperson who posts occasionally. Nobody is responsible for whether those pieces still match the products the company wants to quote.',
      'Fractional advisory is that responsibility, on a part-time basis. It is for a plant that needs judgment and follow-through, and does not have enough marketing work to hire a director.',
    ],
    body:
      `<h2>${escapeHtml('The job is the decision, not another pair of hands')}</h2>` +
      paragraphs(
        'The advisory work sits above execution. Each month we look at what was published, what was spent, and which product lines the roadmap said mattered. If a campaign, a page, or a content draft has drifted, it gets stopped or rewritten before it accumulates.',
        'We join the conversations where marketing meets sales: lead definition, what a qualified enquiry contains, and which requests the plant should refuse. We do not replace the sales team, and we do not become the person who designs every page.',
      ) +
      `<h2>${escapeHtml('Who this is for, and who it is not')}</h2>` +
      paragraphs(
        'It fits an owner or general manager who is currently the marketing department, or a small team that can produce but has no one to decide. It is a poor fit when the company wants a full campaign produced every week and has no internal or agency capacity to make the work.',
        'The engagement has a written list of decisions we are there to make. Open-ended "help with marketing" becomes status meetings. The list is reviewed when the roadmap changes, not whenever a new tactic becomes fashionable.',
      ),
    situations: [
      {
        title: 'The owner is approving every blog post and every ad invoice.',
        text: 'The advisory takes that review, against the product list you already agreed, and sends back a clear yes, no, or change.',
      },
      {
        title: 'Agencies are busy and the priorities are still last year\'s.',
        text: 'The website, the ads, and the content calendar can all be active while quoting the wrong range. Someone has to compare the activity with the roadmap.',
      },
      {
        title: 'A full-time marketing hire would not have enough scope.',
        text: 'The commercial questions are real, but they do not fill a week. A part-time lead covers the decisions without building a department around them.',
      },
    ],
    scope: [
      {
        title: 'Monthly priority check',
        text: 'A review of live work against the product and market list: what continued, what should stop, and what is missing for the quotes you want.',
      },
      {
        title: 'Briefs and decisions for the people who execute',
        text: 'Clear direction for an internal marketer or an outside supplier. The advisory does not silently absorb their production work.',
      },
      {
        title: 'Sales alignment on what counts as an enquiry',
        text: 'A working definition the team will use, including the requests that should be declined. The definition is revisited when the mix of quotes changes.',
      },
    ],
    steps: [
      {
        title: 'Read the current roadmap and the live work',
        text: 'If there is no roadmap, the first month is spent writing the product priorities down with sales. Advisory without that list has nothing to judge against.',
      },
      {
        title: 'Agree the decisions this engagement owns',
        text: 'A short list: which spends, which pages, which claims. Work outside the list is named as out of scope.',
      },
      {
        title: 'Hold the monthly review with the people who can change course',
        text: 'The owner, sales, and whoever publishes or buys media. A review that cannot change a brief is only a report.',
      },
      {
        title: 'Leave a written record',
        text: 'Decisions are written down, including what was refused. The next month starts from that note, not from memory.',
      },
    ],
    offerTitle: 'Start with a ninety-day advisory period',
    offerText:
      'Three months is long enough to see whether the decisions are being used. You can stop at the end of that period with the written record.',
    offerIncludes: [
      'A review of current marketing activity against the product priorities',
      'A written list of decisions the advisory owns',
      'Monthly sessions with the people who can change the work',
      'Notes of what was approved, changed, or stopped',
    ],
    offerNext:
      'After ninety days we either continue on the same list or stop. Continuing is a decision, not an automatic retainer.',
    ctaLabel: 'Discuss advisory support',
    formats: [
      {
        format: 'ongoing_monthly',
        duration: '3_months',
        text: 'An initial three months, with a written decision log and a stop or continue point at the end.',
      },
      {
        format: 'ongoing_monthly',
        duration: '6_months',
        text: 'A longer spell once the decision list is stable and the team is using it.',
      },
    ],
    faqs: [
      {
        question: 'Are you the company\'s marketing director?',
        answer:
          'For the decisions in the written list, yes, on a part-time basis. Employment, HR, and a full department are not part of the engagement.',
      },
      {
        question: 'Will you write the pages and run the ads?',
        answer:
          'Production stays with your team or a supplier briefed for that work. The advisory decides and reviews. Taking over production is a different scope.',
      },
      {
        question: 'What if we do not have a roadmap yet?',
        answer:
          'Then the roadmap comes first. Advisory needs a product and market list to judge against. We will say so rather than invent priorities in the first meeting.',
      },
      {
        question: 'How much of the week is included?',
        answer:
          'Enough for the monthly review, the decision log, and the briefs on the agreed list. It is not a blank number of hours for unrelated requests.',
      },
    ],
    ctaHeading: 'If the owner is still the marketing department',
    ctaBody:
      'Describe who approves the work today and which product lines are supposed to get the attention. We will tell you whether part-time advisory fits.',
    imageSource: 'blog-manufacturing-seo.jpg',
    imageFile: 'strategy-fractional-marketing-advisory.jpg',
    alt: 'A manufacturing engineer reviewing a technical drawing beside a CNC machining centre.',
    displayOrder: 11,
    related: ['marketing-strategy-roadmap', 'international-marketing-strategy'],
  },
  {
    slug: 'international-marketing-strategy',
    title: 'International Marketing Strategy',
    h1: 'Which export markets deserve documentation, translation, and sales time',
    previewDescription:
      'A decision about which countries a manufacturer can actually support, based on product fit, documents, and who answers the technical questions.',
    metaTitle: 'International Marketing Strategy for Manufacturers',
    metaDescription:
      'Export marketing decisions for manufacturers: which countries fit the product, the documents, and the people who can answer technical questions.',
    intro: [
      'Translating the current website does not create an export market. The earlier question is whether the product, the certificates, and the person who answers a technical email exist for that country.',
      'This service is that decision. It names the countries worth the documentation and sales time, and the countries that should wait until the offer is real.',
    ],
    body:
      `<h2>${escapeHtml('A country is a sales commitment')}</h2>` +
      paragraphs(
        'An enquiry from a new country still needs a quote, a document pack, and someone who can explain a limit in the language the buyer uses, or through a distributor who can. If none of that is available, a translated page collects interest the plant cannot answer.',
        'We look at where you already ship or already have a distributor, which standards and certificates the product carries, and which applications engineering will support outside the home market. A country with search demand and no support path is recorded as a later option, not as a campaign.',
      ) +
      `<h2>${escapeHtml('What gets translated, and what does not')}</h2>` +
      paragraphs(
        'Translation follows the decision. Priority product pages, the specifications a buyer must see, and the enquiry path come first. A blog archive and a slogan do not. The glossary is agreed with engineering so a standard or a material is not renamed into something you do not make.',
        'The output sits on the roadmap as a sequence: which country, which pages, which distributor or salesperson owns the reply. It does not promise a share of that market.',
      ),
    situations: [
      {
        title: 'The site is being translated because a vendor offered a language list.',
        text: 'Language is the last choice. We start from the countries where a quote can actually be answered.',
      },
      {
        title: 'Export enquiries arrive and then sit with the home sales team.',
        text: 'The strategy names who responds, in what time, and which documents they must have. A page that invites a country you cannot reply to is a problem, not a lead source.',
      },
      {
        title: 'A distributor wants marketing support in a market you barely know.',
        text: 'The work checks whether their territory matches products you will stand behind, and what they are allowed to claim.',
      },
    ],
    scope: [
      {
        title: 'Market screen',
        text: 'A short list of candidate countries based on current shipments, distributor conversations, and product constraints. Demand estimates are treated as secondary.',
      },
      {
        title: 'Support check',
        text: 'For each candidate: certificates, language of the technical documents, and the named person or distributor who answers questions.',
      },
      {
        title: 'Sequence for the roadmap',
        text: 'Which country is first, which pages and documents move with it, and which countries stay off the site until the support exists.',
      },
    ],
    steps: [
      {
        title: 'List where you already have a path to a quote',
        text: 'Shipments, distributors, and salespeople who have answered an export enquiry. A blank map of the world is not the starting file.',
      },
      {
        title: 'Check the product constraints',
        text: 'Standards, materials, and applications engineering will not support abroad. Those limits remove countries before anyone talks about translation.',
      },
      {
        title: 'Choose the first country and the pages it needs',
        text: 'One country, the product pages a buyer must read, and the enquiry route. Further countries wait.',
      },
      {
        title: 'Agree the glossary and the owner of the reply',
        text: 'Engineering approves technical terms. Sales or the distributor is named as the person who answers. The page does not go live without that name.',
      },
    ],
    offerTitle: 'Start with the countries you can already answer',
    offerText:
      'The first recommendation covers the countries where a quote is already possible, plus a clear list of countries to leave alone for now.',
    offerIncludes: [
      'A review of current export enquiries, shipments, and distributors',
      'A product-constraint check with engineering',
      'A first country, with the pages and documents it requires',
      'Countries explicitly deferred, and the reason',
    ],
    offerNext:
      'Translation and page production are scoped after the country is chosen. They are not assumed in this decision.',
    ctaLabel: 'Discuss export priorities',
    formats: [
      {
        format: 'initial_project',
        duration: 'one_time_project',
        text: 'A country decision and the page sequence for the first market.',
      },
      {
        format: 'campaign',
        duration: '6_months',
        text: 'A follow-up when a second country becomes real because the documents and the reply path now exist.',
      },
    ],
    faqs: [
      {
        question: 'Do you translate the site as part of this work?',
        answer:
          'No. This engagement decides which country and which pages are worth translating. Translation is commissioned after that decision, with a glossary engineering has approved.',
      },
      {
        question: 'Should every page exist in every language we might sell in?',
        answer:
          'No. Extra languages on pages you cannot support create enquiries nobody owns. Start with the first country and the pages a buyer must read.',
      },
      {
        question: 'What if a distributor wants claims we do not make at home?',
        answer:
          'Those claims are refused. A distributor version of the product story has to stay inside what engineering will sign.',
      },
      {
        question: 'Will you estimate the revenue from a new country?',
        answer:
          'No. We record whether the product, the documents, and the reply path exist. A revenue figure would be a guess.',
      },
    ],
    ctaHeading: 'Name the country someone already asked you to quote',
    ctaBody:
      'If an export enquiry is sitting unanswered, that is a concrete place to start. We will tell you whether the gap is strategy, documents, or simply capacity.',
    imageSource: 'blog-manufacturing-website-architecture.jpg',
    imageFile: 'strategy-international-marketing-strategy.jpg',
    alt: 'Warehouse aisles with separated bins of machined components and fittings.',
    displayOrder: 12,
    related: ['marketing-strategy-roadmap', 'fractional-marketing-advisory'],
  },
]

const assertCopy = () => {
  const slugs = new Set<string>()
  for (const page of PAGES) {
    if (slugs.has(page.slug)) throw new Error(`Duplicate slug ${page.slug}`)
    slugs.add(page.slug)
    if (page.h1 === page.title) throw new Error(`${page.slug} H1 repeats the title`)
    if (page.metaTitle.length < 50 || page.metaTitle.length > 60) {
      throw new Error(`${page.slug} meta title ${page.metaTitle.length}: ${page.metaTitle}`)
    }
    if (page.metaDescription.length < 140 || page.metaDescription.length > 160) {
      throw new Error(`${page.slug} meta description ${page.metaDescription.length}`)
    }
    const intro = page.intro.join(' ')
    if (page.body.includes(intro.slice(0, 80))) throw new Error(`${page.slug} body repeats the intro`)
    const blob = JSON.stringify(page)
    if (/[\u2013\u2014]/.test(blob)) throw new Error(`${page.slug} contains an en or em dash`)
  }
}

const uploadImage = async (payload: Payload, page: PageCopy) => {
  const source = path.join(process.cwd(), 'public', 'media', page.imageSource)
  const buffer = await sharp(source)
    .rotate()
    .resize({ width: 1800, withoutEnlargement: true })
    .jpeg({ quality: 82 })
    .toBuffer()
  const file = {
    name: page.imageFile,
    data: buffer,
    mimetype: 'image/jpeg' as const,
    size: buffer.byteLength,
  }
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: page.imageFile } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (existing.docs[0]) {
    const updated = await payload.update({
      collection: 'media',
      id: existing.docs[0].id,
      data: { alt: page.alt },
      overrideAccess: true,
      context,
    })
    return Number(updated.id)
  }
  const created = await payload.create({
    collection: 'media',
    data: { alt: page.alt },
    file,
    overrideAccess: true,
    context,
  })
  return Number(created.id)
}

const pageData = (page: PageCopy, imageId: number, relatedIds: number[]) => ({
  title: page.title,
  service_long_title: page.h1,
  slug: page.slug,
  generateSlug: false,
  _status: 'published' as const,
  publishedAt: new Date().toISOString(),
  featured: false,
  displayOrder: page.displayOrder,
  authors: [1],
  service_preview_title: page.title,
  service_preview_description: page.previewDescription,
  service_preview_image: imageId,
  service_card_image: imageId,
  service_content_title: null,
  meta: {
    title: page.metaTitle,
    description: page.metaDescription,
    image: imageId,
  },
  introduction: {
    text: rt(paragraphs(...page.intro)),
    supportingText: rt(page.body),
  },
  clientSituations: page.situations.map((item) => ({
    title: item.title,
    description: rt(paragraphs(item.text)),
  })),
  serviceScope: page.scope.map((item) => ({
    title: item.title,
    description: rt(paragraphs(item.text)),
  })),
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
  relatedCaseStudies: [],
  clientTestimonial: {
    quote: null,
    author: null,
    position: null,
    company: null,
  },
  faq: {
    title: 'Questions & answers',
    intro: null,
    items: page.faqs.map((item) => ({
      question: item.question,
      answer: rt(paragraphs(item.answer)),
    })),
  },
  relatedServices: relatedIds,
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

const rewriteString = (value: string): string => {
  if (LEGACY_SERVICE_REDIRECTS[value]) return LEGACY_SERVICE_REDIRECTS[value]
  const trimmed = value.replace(/\/$/, '')
  if (LEGACY_SERVICE_REDIRECTS[trimmed]) return LEGACY_SERVICE_REDIRECTS[trimmed]
  let next = value
  for (const [from, to] of Object.entries(LEGACY_SERVICE_REDIRECTS)) {
    next = next.replaceAll(`href="${from}"`, `href="${to}"`)
    next = next.replaceAll(`href='${from}'`, `href='${to}'`)
    next = next.replaceAll(`href="${from}/"`, `href="${to}"`)
  }
  next = next.replaceAll(
    'They do not each have a separate public page yet.',
    'Each of those questions now has its own service page.',
  )
  return next
}

const rewriteValue = (value: unknown): unknown => {
  if (typeof value === 'string') return rewriteString(value)
  if (Array.isArray(value)) return value.map((item) => rewriteValue(item))
  if (value && typeof value === 'object') {
    const next: Record<string, unknown> = {}
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      next[key] = rewriteValue(child)
    }
    return next
  }
  return value
}

const OMIT = new Set(['id', 'createdAt', 'updatedAt', 'deletedAt'])

const rewriteCollection = async (payload: Payload, collection: 'services' | 'posts' | 'pages' | 'case-studies') => {
  const found = await payload.find({
    collection,
    depth: 0,
    limit: 500,
    pagination: false,
    overrideAccess: true,
  })
  let changed = 0
  for (const doc of found.docs) {
    const rewritten = rewriteValue(doc) as Record<string, unknown>
    if (JSON.stringify(rewritten) === JSON.stringify(doc)) continue
    for (const key of OMIT) delete rewritten[key]
    await payload.update({
      collection,
      id: doc.id,
      data: rewritten,
      draft: false,
      overrideAccess: true,
      context,
    })
    changed += 1
  }
  payload.logger.info(`${collection}: updated ${changed} documents with nested service URLs`)
}

const updateStrategyOverview = async (payload: Payload) => {
  const raw = readFileSync(
    path.join(process.cwd(), 'src', 'scripts', 'content', 'services', 'strategy.html'),
    'utf8',
  )
  const parts = raw.trim().split(/\n@@/)
  const take = (name: string) => {
    const part = parts.find((item) => item.startsWith(name))
    if (!part) throw new Error(`strategy.html missing ${name}`)
    return part.slice(name.length).trim()
  }
  const cards = take('cards')
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [title, href, text] = line.split(' || ')
      if (!title || !href || !text) throw new Error(`Bad strategy card: ${line}`)
      return { title: title.trim(), href: href.trim(), text: text.trim() }
    })
  const existing = await payload.find({
    collection: 'services',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: 'strategy' } },
  })
  const overview = existing.docs[0]
  if (!overview) throw new Error('Strategy overview is missing')
  const layout = Array.isArray(overview.layout) ? [...overview.layout] : []
  const contentIndex = layout.findIndex((block) => block.blockType === 'content')
  if (contentIndex >= 0) {
    const block = layout[contentIndex]
    if (block.blockType === 'content') {
      layout[contentIndex] = {
        ...block,
        columns: [{ size: 'full', richText: rt(take('together')), enableLink: false }],
      }
    }
  }
  await payload.update({
    collection: 'services',
    id: overview.id,
    draft: false,
    overrideAccess: true,
    context,
    data: {
      serviceScope: cards.map((card) => ({
        title: card.title,
        description: rt(
          `<p>${escapeHtml(card.text)}</p><p><a href="${card.href}">View the service page</a></p>`,
        ),
      })),
      layout,
    },
  })
  payload.logger.info('Strategy overview cards now link to the six service pages')
}

const main = async () => {
  assertCopy()
  for (const page of PAGES) {
    console.log(
      `${page.slug} title ${page.metaTitle.length} description ${page.metaDescription.length}`,
    )
  }

  const payload = await getPayload({ config })
  const required = [
    'marketing-strategy-roadmap',
    'website-design-development-for-manufacturers',
    'seo-ai-search-optimization',
    'ai-search-optimization-manufacturers',
    'lead-generation',
    'technical-content-thought-leadership',
    'sales-enablement-crm',
    ...PAGES.map((page) => page.slug),
  ]
  const imageIds = new Map<string, number>()
  for (const page of PAGES) {
    imageIds.set(page.slug, await uploadImage(payload, page))
  }

  for (const page of PAGES) {
    const data = pageData(page, imageIds.get(page.slug)!, [])
    const existing = await payload.find({
      collection: 'services',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { slug: { equals: page.slug } },
    })
    if (existing.docs[0]) {
      await payload.update({
        collection: 'services',
        id: existing.docs[0].id,
        data,
        draft: false,
        overrideAccess: true,
        context,
      })
      payload.logger.info(`Updated ${page.slug}`)
    } else {
      await payload.create({
        collection: 'services',
        data,
        draft: false,
        overrideAccess: true,
        context,
      })
      payload.logger.info(`Created ${page.slug}`)
    }
  }

  const relatedDocs = await payload.find({
    collection: 'services',
    depth: 0,
    limit: 20,
    overrideAccess: true,
    where: { slug: { in: required } },
    select: { slug: true, title: true },
  })
  const idBySlug = new Map(relatedDocs.docs.map((doc) => [doc.slug, Number(doc.id)]))
  for (const slug of required) {
    if (!idBySlug.has(slug)) throw new Error(`Missing service ${slug}`)
  }
  for (const page of PAGES) {
    const id = idBySlug.get(page.slug)
    await payload.update({
      collection: 'services',
      id: id!,
      draft: false,
      overrideAccess: true,
      context,
      data: {
        relatedServices: page.related.map((slug) => {
          const relatedId = idBySlug.get(slug)
          if (!relatedId) throw new Error(`Missing related ${slug}`)
          return relatedId
        }),
      },
    })
  }

  await rewriteCollection(payload, 'services')
  await rewriteCollection(payload, 'posts')
  await rewriteCollection(payload, 'pages')
  await rewriteCollection(payload, 'case-studies')
  await updateStrategyOverview(payload)

  const published = await payload.find({
    collection: 'services',
    depth: 0,
    draft: false,
    limit: 30,
    overrideAccess: true,
    where: { slug: { in: required } },
    select: { slug: true, title: true },
  })
  for (const doc of published.docs) {
    payload.logger.info(`${doc.title} → ${getServiceUrl(doc)}`)
  }
  process.exit(0)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
