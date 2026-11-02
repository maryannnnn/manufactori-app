import 'dotenv/config'
import { readFileSync } from 'fs'
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

type FormatName = 'initial_project' | 'campaign' | 'ongoing_monthly'
type DurationName = 'one_time_project' | '3_months' | '6_months'

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
  formats: { format: FormatName; duration: DurationName; text: string }[]
  faqs: { question: string; answer: string }[]
  ctaHeading: string
  ctaBody: string
  imageSource?: string
  imageFile?: string
  alt?: string
  displayOrder: number
  related: string[]
  successorOf?: string
}

const h2 = (text: string) => `<h2>${escapeHtml(text)}</h2>`

const PAGES: PageCopy[] = [
  {
    slug: 'industrial-website-design',
    successorOf: 'website-design-development-for-manufacturers',
    title: 'Industrial Website Design',
    h1: 'Website structure and visual design for manufacturers and their buyers',
    previewDescription:
      'Page structure, navigation, and visual hierarchy for industrial sites, so an engineer can find the specification and the next step.',
    metaTitle: 'Industrial Website Design for Manufacturing Companies',
    metaDescription:
      'Structure and visual design for manufacturer websites: product pages, navigation, and a layout engineers and procurement can use. The build is separate.',
    intro: [
      'An industrial website is judged in the first product page, not on the homepage slogan. The buyer is trying to match a size, a material, or a standard, and the page either helps or it does not.',
      'This service is the design of that path: what appears first, how families are grouped, and how the page behaves on a phone at a machine. The code that makes it run is a separate service.',
    ],
    body:
      h2('Design is the order of the information') +
      paragraphs(
        'Engineers, maintenance leads, and procurement do not read a site in the same order. The engineer looks for the limit and the standard. Maintenance looks for the spare and the lead time. Procurement looks for the document set. A layout that leads with a company story makes all three of them hunt.',
        'We design from a real product family. The identifier, the constraint, and the way to ask for a drawing or a quote stay visible. Decoration that covers those three is removed, even when it looked finished in a brand presentation.',
      ) +
      h2('What the pages have to carry') +
      paragraphs(
        'Category pages, application pages, and product pages have different jobs. A category helps someone choose a branch. An application says where the product is used and where it is not. A product page holds the specification a salesperson would accept in a quote. Mixing those jobs is how catalogs become brochures.',
        'The design also has to survive a narrow screen. A maintenance technician is often on a phone. Tables that only make sense on a desktop, and buttons that sit below a gallery, fail that visit. We specify the mobile order before anyone treats the desktop mockup as the whole design.',
      ),
    situations: [
      {
        title: 'The homepage looks current and the product pages still hide the part number.',
        text: 'Visitors can see the company and still cannot tell whether a range fits. The redesign of the visual theme is not the first move. The page order is.',
      },
      {
        title: 'Sales keeps sending PDFs because the site does not show the limit.',
        text: 'If the public page cannot carry the distinction the price list already uses, the site is not part of the quote. Design starts from that missing distinction.',
      },
      {
        title: 'A new catalog is being drawn before anyone has agreed the page types.',
        text: 'Families, applications, and single products need different templates. Drawing screens before that decision produces a set of pages that look related and answer different questions badly.',
      },
    ],
    scope: [
      {
        title: 'Information architecture',
        text: 'A map of page types for the priority families: what each URL is for, and which differences stay in a table instead of becoming another page.',
      },
      {
        title: 'Page layouts for buyers',
        text: 'Hierarchy, type, and the placement of specifications, exclusions, and the enquiry path. Desktop and a narrow screen are both specified.',
      },
      {
        title: 'Handoff for the build',
        text: 'Notes the development work can implement without inventing a second structure. Visual design stops where the template and the CMS fields begin.',
      },
    ],
    steps: [
      {
        title: 'Read the current site against recent quotes',
        text: 'We compare live pages with the way sales actually describes the product. Gaps in the specification, not the color palette, lead the notes.',
      },
      {
        title: 'Agree the page types',
        text: 'Category, application, and product pages are named, with an example from your catalog. Pages that would only repeat a filter are left out.',
      },
      {
        title: 'Design the priority templates',
        text: 'Layouts for those page types, including the mobile order and the enquiry point. Engineering reviews any line that states a limit.',
      },
      {
        title: 'Hand the templates to development',
        text: 'You receive the structure and the layouts. Building them in Next.js and Payload is scoped as website development, not folded back into this page.',
      },
    ],
    offerTitle: 'Start with one product family',
    offerText:
      'The first design pass covers the page types for one family you already quote. You can see whether the structure holds before the rest of the catalog is drawn.',
    offerIncludes: [
      'A review of the current pages for that family',
      'A page-type map',
      'Layouts for the priority templates, including a narrow screen',
      'A note of what development must not invent on its own',
    ],
    offerNext: 'A whole catalog follows only after the first family is clear. Visual refresh of unchanged pages is not assumed.',
    ctaLabel: 'Discuss the website design',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'Design for one product family and its page types.' },
      { format: 'campaign', duration: '3_months', text: 'Further families once the first templates are accepted by sales and engineering.' },
    ],
    faqs: [
      {
        question: 'Does this include building the site?',
        answer: 'No. This service decides structure and layout. Implementation on Next.js and Payload CMS is the website development service.',
      },
      {
        question: 'Will you redesign the logo?',
        answer: 'No. The work is the website: navigation, page types, and how specifications are shown. A new brand mark is a different project.',
      },
      {
        question: 'Can the same layout serve a phone and a desktop?',
        answer: 'The content is the same. The order changes. We specify both, because a table that only works on a wide screen fails the maintenance visit.',
      },
      {
        question: 'Do you design a page for every SKU?',
        answer: 'Only when the difference is one a buyer must see as its own URL. Variants that share a specification usually stay in a table on one page.',
      },
    ],
    ctaHeading: 'Bring the product page sales will not send',
    ctaBody: 'If the team still attaches a PDF, the public page is missing something. That is a concrete place to start the design.',
    displayOrder: 13,
    related: ['website-development', 'ux-ui-for-engineers-b2b-buyers'],
  },
  {
    slug: 'website-development',
    title: 'Website Development',
    h1: 'A Next.js and Payload build that can grow with the product catalog',
    previewDescription:
      'Custom website development for manufacturers on Next.js, React, and Payload CMS, with room for catalogs, forms, and later features.',
    metaTitle: 'Next.js Development for Industrial Manufacturer Sites',
    metaDescription:
      'Custom Next.js, React, and Payload CMS websites for manufacturers: speed, Core Web Vitals, security, forms, and a catalog that can grow with new ranges.',
    intro: [
      'A design is a set of decisions. Development is what keeps those decisions intact once the catalog, the forms, and the next product line arrive.',
      'We build manufacturer sites with Next.js and React, and we use Payload CMS so your team can edit pages without a developer for every sentence. The stack is a means to a site that stays fast and can take new sections without a rewrite.',
    ],
    body:
      h2('Why the stack is part of the commercial site') +
      paragraphs(
        'Industrial sites collect specifications, drawings, and quote requests. They also change: a range is withdrawn, a new standard is added, a distributor needs a page. A build that treats the site as a fixed brochure makes every one of those changes a small project. Payload stores the pages, the catalog entries, and the forms as content your editors can reach. Next.js renders that content as a site we can tune for loading speed.',
        'Core Web Vitals are the practical version of that speed. A heavy template, an uncompressed catalog image, or a script that waits on a third-party tag shows up as a slow product page. We treat those measurements as part of the build, not as a report someone runs after launch and then ignores.',
      ) +
      h2('What we will and will not claim about other platforms') +
      paragraphs(
        'Many manufacturers already have a WordPress site, and some of those sites are maintained carefully. The recurring problems we see are not a verdict on every WordPress install. They are the ones that show up on quote-led catalogs: plugin stacks that fight each other, page builders that make a simple specification hard to keep consistent, and updates that get postponed because the site is fragile.',
        'A custom Next.js front end and a Payload admin give a narrower, more explicit system. Templates are code, so a product page stays a product page. CSS is written for the layout you approved, not selected from a theme. Forms post into a path you can see. Security updates have a smaller surface than a pile of unused plugins. None of that removes the need for someone to maintain the site. It makes that maintenance a defined job.',
      ) +
      `<h3>${escapeHtml('Room for the next feature')}</h3>` +
      paragraphs(
        'Catalogs, RFQ forms, and a later CAD download or configurator should plug into the same content model. We design the first build so a new collection, a new page type, or an integration does not require throwing the site away. That is the flexibility the architecture is for.',
      ),
    situations: [
      {
        title: 'The design is agreed and the current site cannot implement it cleanly.',
        text: 'The page types exist on paper. The live CMS turns them into a compromise. Development is the point where the template becomes real.',
      },
      {
        title: 'Every catalog change needs the original developer, or nobody at all.',
        text: 'Editors cannot add a range without breaking the layout. The build should leave ordinary content edits in Payload and keep the structure in code.',
      },
      {
        title: 'The site has become slow or brittle as plugins accumulated.',
        text: 'A rebuild is justified when the template, the forms, and the updates are no longer predictable. It is not justified only because a newer framework exists.',
      },
    ],
    scope: [
      {
        title: 'Application build',
        text: 'Next.js and React templates for the agreed page types, styled to the design, with Payload collections for the content editors actually change.',
      },
      {
        title: 'Performance and the technical base',
        text: 'Image handling, caching, and a check of Core Web Vitals on the priority templates. Technical SEO basics, such as indexable URLs and metadata, are part of the same pass.',
      },
      {
        title: 'Forms and a path for later work',
        text: 'Enquiry and RFQ submission that stores the fields sales asked for. The content model leaves a place for catalog growth and later integrations.',
      },
    ],
    steps: [
      {
        title: 'Confirm the page types and the content model',
        text: 'We implement the design that was agreed. If that design does not exist yet, we say so and start with the design service rather than inventing screens in code.',
      },
      {
        title: 'Build the templates and the CMS',
        text: 'Priority pages, navigation, and the fields an editor needs. Sample products from your catalog are the test, not placeholder latin.',
      },
      {
        title: 'Check speed, forms, and the obvious security basics',
        text: 'We review loading on the main templates, the form path, and the admin access. A launch with an open form and no recipient is not a launch.',
      },
      {
        title: 'Hand over with a way to extend it',
        text: 'You get the site, the editing path, and a short note of how a new page type or collection would be added. Ongoing upkeep is the maintenance service.',
      },
    ],
    offerTitle: 'Start from an agreed set of templates',
    offerText:
      'Development begins when the page types are known. The first build covers those templates, the CMS, and the enquiry path.',
    offerIncludes: [
      'Next.js templates for the agreed page types',
      'A Payload CMS your editors can use for those pages',
      'A performance pass on the priority templates',
      'Forms that deliver the fields sales expects',
    ],
    offerNext: 'Integrations, commerce, and configurators are scoped after the core site is stable. They are not implied by the first build.',
    ctaLabel: 'Discuss the build',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'The first site build: templates, CMS, and the enquiry path.' },
      { format: 'campaign', duration: '3_months', text: 'A follow-on phase for the next set of page types or an integration that the first build left open.' },
    ],
    faqs: [
      {
        question: 'Is this the same engagement as website design?',
        answer: 'No. Design decides structure and layout. Development implements that layout in Next.js, React, and Payload, and keeps the site able to change.',
      },
      {
        question: 'Can our team edit pages after launch?',
        answer: 'Yes, for the content we put in Payload. Changing the template itself is development work, which is how the product page stays consistent.',
      },
      {
        question: 'Do you guarantee a Core Web Vitals score?',
        answer: 'No. We build and measure the priority templates and fix what the build itself made slow. A third-party script you add later can still change the result.',
      },
      {
        question: 'Will you migrate every old URL?',
        answer: 'We map the URLs that still match a live product or application. Retired pages should redirect or go, not come across as empty copies.',
      },
    ],
    ctaHeading: 'Bring the templates you want built',
    ctaBody: 'If the page types are already decided, we can talk about the build. If they are not, the useful first step is the design, not a framework.',
    imageSource: 'blog-google-ads-manufacturing.jpg',
    imageFile: 'website-development-service.jpg',
    alt: 'A manufacturing control room with production documents and unmarked screens.',
    displayOrder: 14,
    related: ['industrial-website-design', 'website-maintenance-security'],
  },
  {
    slug: 'website-redesign-audit',
    title: 'Website Redesign & Audit',
    h1: 'What to keep, merge, or drop before a manufacturer site is redesigned',
    previewDescription:
      'An audit of templates, forms, and page types before a visual refresh, so the redesign does not repaint a catalog you cannot maintain.',
    metaTitle: 'Website Redesign and Audit for Industrial Manufacturers',
    metaDescription:
      'A pre-redesign audit for manufacturer websites: which templates, forms, and URLs to keep, merge, or retire before anyone reskins the catalog.',
    intro: [
      'A redesign that starts with a new look usually keeps the underlying mess. The catalog, the duplicate URLs, and the form nobody reads survive under a new header.',
      'The audit names what the next site should carry. The visual work comes after that list, not before it.',
    ],
    body:
      h2('The audit is a cut list') +
      paragraphs(
        'We read the current site as a set of templates: product, category, application, news, and the pages that exist only because a filter created them. Each type gets a recommendation to keep, merge, or retire. A page with no owner and no specification is a candidate to leave behind.',
        'The form is part of the same review. If sales ignores half the fields, the redesign should not draw them again. If the useful detail, the part number or the application, never arrives, the form is failing even when the submission count looks fine.',
      ) +
      h2('Then the redesign has a boundary') +
      paragraphs(
        'Once the cut list exists, design and development have something to build. Without it, both will reproduce the old information architecture in a newer typeface. We do not treat a homepage concept as a substitute for that list.',
        'The deliverable is written so a later project can follow it. It is not a score and it is not a promise that traffic will rise because the site looks newer.',
      ),
    situations: [
      {
        title: 'A new visual identity is ready and the site is about to be reskinned.',
        text: 'That is the moment to stop. The identity can wait a few weeks while the page types are sorted. Reskinning first locks the old structure in.',
      },
      {
        title: 'The site has more URLs than the team can check.',
        text: 'Filter combinations, near-duplicate products, and old campaigns are still public. The audit is how you decide which of them still deserve a template.',
      },
      {
        title: 'The last redesign finished and the same complaints came back.',
        text: 'Sales still cannot find the specification. The look changed. The page jobs did not. A second visual pass will do the same unless the structure is examined.',
      },
    ],
    scope: [
      { title: 'Template and URL review', text: 'A list of page types and the URLs that represent them, with a keep, merge, or retire note.' },
      { title: 'Form and enquiry review', text: 'Which fields arrive, which sales uses, and which should not be redrawn.' },
      { title: 'Redesign boundary', text: 'A short brief the design and development work can follow, including what is out of scope for the visual refresh.' },
    ],
    steps: [
      { title: 'Inventory the live templates', text: 'We group the public site by the job of the page, not by the menu label.' },
      { title: 'Check a sample with sales', text: 'A few recent quotes show whether the page that should have helped was the one the buyer saw.' },
      { title: 'Write the cut list', text: 'Keep, merge, and retire, with the reason. Disputed pages are marked rather than quietly dropped.' },
      { title: 'Hand the list to design', text: 'The redesign starts from the list. This service does not itself draw the new site or rebuild it.' },
    ],
    offerTitle: 'Start with the templates you already have',
    offerText: 'You receive the cut list whether or not you continue into design and development with us.',
    offerIncludes: ['A template inventory', 'A keep, merge, or retire recommendation', 'Notes on the enquiry form', 'A boundary for the redesign'],
    offerNext: 'Design and the build are separate services. The audit does not include them.',
    ctaLabel: 'Discuss an audit',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'One audit of the current public site and its forms.' },
      { format: 'campaign', duration: '3_months', text: 'A second pass after the redesign, to see whether retired URLs stayed retired.' },
    ],
    faqs: [
      { question: 'Is the audit the redesign?', answer: 'No. It decides what the redesign is allowed to carry. Drawing and building come after, as their own services.' },
      { question: 'Will you tell us to delete the whole site?', answer: 'Only the pages that have no job. A product URL that sales still sends is kept, even if the template around it changes.' },
      { question: 'Do you need analytics access?', answer: 'It helps, for seeing which templates are actually visited. The cut list can start from the catalog and from sales if analytics are incomplete.' },
      { question: 'Does a newer design improve rankings by itself?', answer: 'No. Rankings are not the subject of this review. Clearing duplicate and empty URLs removes a problem. It does not promise positions.' },
    ],
    ctaHeading: 'Bring the site you are about to reskin',
    ctaBody: 'If a visual project is already scheduled, the audit is the cheaper conversation to have first.',
    imageSource: 'blog-manufacturing-seo.jpg',
    imageFile: 'website-redesign-audit-service.jpg',
    alt: 'A manufacturing engineer reviewing a technical drawing beside a CNC machining centre.',
    displayOrder: 15,
    related: ['industrial-website-design', 'website-development'],
  },
  {
    slug: 'product-catalogs-ecommerce',
    title: 'Product Catalogs & E-commerce',
    h1: 'How a manufacturer puts ranges, options, and drawings where buyers can use them',
    previewDescription:
      'Catalog structure for industrial ranges and options, with a storefront only where the company actually takes orders online.',
    metaTitle: 'Product Catalogs and E-commerce for Manufacturer Sites',
    metaDescription:
      'Catalog structure for industrial ranges, options, and drawings. Online ordering is included only where the company really sells that way, not as a default.',
    intro: [
      'A manufacturing catalog is not a shop grid with the prices removed. Buyers need the range, the option that changes the specification, and the drawing or the table that proves it.',
      'E-commerce belongs in the same decision only when you truly take an order online. Many of the companies we work with quote first. Forcing a cart onto that process creates a storefront nobody is staffed to fulfill.',
    ],
    body:
      h2('The range is the page, until a variant earns a URL') +
      paragraphs(
        'Thousands of item codes in an ERP do not each need a public page. Buyers usually recognize a family, then a size or a material inside it. We organize the public catalog around those choices and keep the item code in a table or a selector when that is enough.',
        'A separate URL is justified when the specification change would mislead someone if it stayed in a row, or when that code is searched on its own. The rule is written down so the next import does not create a page per SKU overnight.',
      ) +
      h2('Ordering is a separate question from browsing') +
      paragraphs(
        'If standard parts are sold from stock, with a price and a ship date you will honor, a narrow commerce path can sit on those products. If every job is engineered, the catalog should end in a quote request, not a checkout that implies the price on the screen is final.',
        'Drawings, CAD files, and certificates are part of the catalog when you are willing to publish them. A download that is out of date is worse than a page that says the file is available on request.',
      ),
    situations: [
      { title: 'The ERP catalog was published as one page per item code.', text: 'The site is now larger than the team can correct. The work is to decide the public families and retire the thin copies.' },
      { title: 'Sales wants a webshop because competitors show a cart.', text: 'We ask what can actually be ordered without a conversation. The rest of the range stays as a catalog with a quote path.' },
      { title: 'Options are described in a PDF that contradicts the page.', text: 'The catalog has to pick one source for the public specification. The PDF can be generated from it, or the page can point to a controlled file, but they cannot diverge.' },
    ],
    scope: [
      { title: 'Public catalog model', text: 'Families, options, and the rule for when a variant gets a URL.' },
      { title: 'Documents and drawings', text: 'Which files are public, who updates them, and how a withdrawn range comes off the site.' },
      { title: 'Commerce only where it is real', text: 'A defined set of products that can be ordered, or an explicit decision that the site quotes and does not check out.' },
    ],
    steps: [
      { title: 'Separate the ERP from the public site', text: 'We list what buyers recognize, which is rarely the full item master.' },
      { title: 'Write the URL rule', text: 'One sentence your product manager can apply to the next variant.' },
      { title: 'Specify documents and the order path', text: 'Downloads, request-only files, and whether any product is actually sold online.' },
      { title: 'Hand the model to design and development', text: 'This service defines the catalog. It does not by itself draw every template or write the checkout.' },
    ],
    offerTitle: 'Start with the families you quote',
    offerText: 'The first model covers the ranges that produce real enquiries, plus a note of what stays in the ERP.',
    offerIncludes: ['A public family structure', 'A URL rule for variants', 'A decision on drawings and downloads', 'A yes or no on online ordering, with the products named'],
    offerNext: 'Building the templates is development. Designing them is the design service. Both can follow this model.',
    ctaLabel: 'Discuss the catalog',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'A catalog model for the priority families.' },
      { format: 'campaign', duration: '3_months', text: 'A second group of families, or a commerce slice once the orderable products are agreed.' },
    ],
    faqs: [
      { question: 'Will every part number get a page?', answer: 'No. Item codes stay in the table or the ERP unless a buyer needs that code as its own URL.' },
      { question: 'Do you build an online store by default?', answer: 'No. A cart is added only for products you can price and ship without a custom quote.' },
      { question: 'Can distributors have a different catalog?', answer: 'They can see a subset if you operate that way. They should not publish claims the public catalog does not support.' },
      { question: 'Who updates a withdrawn range?', answer: 'Someone has to be named. A catalog model without an owner becomes stale the first time engineering kills a size.' },
    ],
    ctaHeading: 'Bring the price list and the public catalog',
    ctaBody: 'If those two already disagree, the catalog structure is the right conversation.',
    imageSource: 'blog-manufacturing-website-architecture.jpg',
    imageFile: 'product-catalogs-ecommerce-service.jpg',
    alt: 'Warehouse aisles with separated bins of machined components and fittings.',
    displayOrder: 16,
    related: ['industrial-website-design', 'rfq-forms-conversion-optimization'],
  },
  {
    slug: 'ux-ui-for-engineers-b2b-buyers',
    title: 'UX/UI for Engineers & B2B Buyers',
    h1: 'Interface decisions that let an engineer find the limit before the company story',
    previewDescription:
      'Interface work for industrial sites: scanning specifications, comparing options, and reaching a quote without a consumer-style layout.',
    metaTitle: 'Industrial UX and UI for Engineers and Plant Buyers',
    metaDescription:
      'Interface design for manufacturer sites so engineers, maintenance, and procurement can scan specifications and reach the right next step on the page.',
    intro: [
      'Engineers scan. They do not browse a marketing site the way a consumer shops. The interface either lets them compare a limit in a few seconds or it asks them to read paragraphs to find a number.',
      'This work is that interface: tables, filters that match real options, labels written the way the drawing is written, and a path to a person when the option is not on the page.',
    ],
    body:
      h2('The test is a specification, not a preference') +
      paragraphs(
        'We sit with a task a buyer already has. Find the pressure class. See whether a material is excluded. Tell which drawing applies. If the interface makes that a search through the about page, it has failed, regardless of how current the components look.',
        'Filters are a common failure. A filter for every ERP attribute produces combinations you do not sell. We keep controls that match options engineering will confirm, and we leave the rest in the specification table.',
      ) +
      h2('Different roles, one page') +
      paragraphs(
        'The same product page can serve an engineer and a procurement manager if the specification is easy to scan and the documents and commercial next step are visible without replacing the technical content. Hiding the numbers in order to "simplify" for a non-technical buyer removes the reason the engineer opened the page.',
        'This is narrower than the full website design service. Design decides the page types and the overall layout. Here we work on the interaction: how someone moves through options, tables, and the enquiry when the structure already exists or is being drawn.',
      ),
    situations: [
      { title: 'Users say the site is hard to use and cannot name a screen.', text: 'We pick a real task from sales, watch where it stalls, and change that interaction rather than restyling the whole site.' },
      { title: 'A filter set was copied from a consumer catalog.', text: 'Color and size grids do not describe a valve or a machined housing. The controls need to use your actual options.' },
      { title: 'The specification is in an image of a table.', text: 'It cannot be copied into a quote and it often cannot be read on a phone. The interface work includes making that table real text.' },
    ],
    scope: [
      { title: 'Task review', text: 'A small set of jobs buyers actually do on the site, written as steps.' },
      { title: 'Interface for those tasks', text: 'Tables, filters, labels, and the enquiry entry, specified so development can build them.' },
      { title: 'Mobile scan', text: 'The same tasks on a narrow screen, where a wide table usually breaks first.' },
    ],
    steps: [
      { title: 'Choose three tasks', text: 'From recent quotes, not from a generic usability checklist.' },
      { title: 'Walk the current interface', text: 'Note where the specification, the exclusion, or the drawing is hard to reach.' },
      { title: 'Specify the interaction', text: 'Labels, order, and what a filter is allowed to promise.' },
      { title: 'Review with someone technical', text: 'If an application engineer would not use the label, it is rewritten before it is called final.' },
    ],
    offerTitle: 'Start with three tasks from real quotes',
    offerText: 'You get the interaction notes for those tasks, including what should not be filtered.',
    offerIncludes: ['Three buyer tasks', 'A walkthrough of where the current UI stalls', 'Specified tables, filters, and labels', 'A narrow-screen note'],
    offerNext: 'Implementing the interface is development. Redefining the whole site map is the design service.',
    ctaLabel: 'Discuss the interface',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'Interface specification for a defined set of tasks.' },
      { format: 'campaign', duration: '3_months', text: 'A second set of tasks after the first templates are in use.' },
    ],
    faqs: [
      { question: 'Is this a visual rebrand?', answer: 'No. Type, spacing, and components change only where they help someone read a specification or complete a task.' },
      { question: 'Will you test with our customers?', answer: 'When you can introduce them. Otherwise we use your sales and application engineers, who watch the stall every week.' },
      { question: 'Can filters include every attribute in the ERP?', answer: 'They should not. A filter is a promise that the combination exists and that you will stand behind it.' },
      { question: 'How is this different from website design?', answer: 'Website design sets the page types and the overall layout. This service focuses on how a buyer moves through specifications and options.' },
    ],
    ctaHeading: 'Name the specification people cannot find',
    ctaBody: 'One missed pressure class or material is enough to start. We do not need a full usability program to see it.',
    imageSource: 'blog-linkedin-b2b-manufacturing.jpg',
    imageFile: 'ux-ui-engineers-service.jpg',
    alt: 'Engineers reviewing a machined metal part together in a workshop.',
    displayOrder: 17,
    related: ['industrial-website-design', 'product-catalogs-ecommerce'],
  },
  {
    slug: 'rfq-forms-conversion-optimization',
    title: 'RFQ Forms & Conversion Optimization',
    h1: 'Quote forms that ask for the model, the application, and nothing sales will ignore',
    previewDescription:
      'RFQ forms for manufacturers that collect the part, the application, and the project stage, and that leave out fields nobody reads.',
    metaTitle: 'RFQ Forms and Conversion Paths for Manufacturer Sites',
    metaDescription:
      'Quote request forms for manufacturers: the model, the application, and the project stage, with fields sales will not read taken off the form.',
    intro: [
      'A manufacturer does not convert a visit into a purchase on the page. The useful conversion is a quote request that sales can answer without writing back for the part number.',
      'We design that request: which fields are required, which files can be attached, and what happens to the submission so it does not sit in an inbox nobody owns.',
    ],
    body:
      h2('The form is a qualification step') +
      paragraphs(
        'Too many fields and the engineer on a phone gives up. Too few and sales receives "send quote" with no model and no application. The middle is specific to your products. A valve RFQ needs different questions from a contract machining RFQ. We write the fields from the questions your team already asks on the first call.',
        'Required files matter as much as required text. If a drawing is necessary, the form should say so and should accept the formats engineering can open. A form that only allows a small image of a nameplate creates a second email anyway.',
      ) +
      h2('Optimization here is not a consumer funnel') +
      paragraphs(
        'We do not treat the manufacturer site as a checkout to be nudged. Changes are about whether the right requests arrive and the poor-fit ones are declined earlier. A shorter form that drops the application is not an improvement, even if more people submit it.',
        'The submission has to land where the team works. Email alone is fragile. A record in the CRM, with the product name and the page they started from, is the version sales can actually manage. Connecting that path is part of this service when the CRM is already the place quotes live.',
      ),
    situations: [
      { title: 'Sales says the website leads are incomplete.', text: 'The form is the first place we look. Missing model, missing quantity, or a free-text box where a range should have been chosen.' },
      { title: 'The form is long because every department added a field.', text: 'Fields without an owner come off. If nobody reads it, the visitor should not have to type it.' },
      { title: 'Requests arrive and nobody knows which page sent them.', text: 'The product or application URL has to travel with the submission. Otherwise sales starts from zero.' },
    ],
    scope: [
      { title: 'Field set', text: 'Required and optional fields, written from real quote conversations, including file types.' },
      { title: 'Routing', text: 'Where the request goes, who owns the first reply, and how a poor fit is declined.' },
      { title: 'A check after launch', text: 'A review of actual submissions to see which fields are filled with nonsense and which are still missing.' },
    ],
    steps: [
      { title: 'Read recent requests with sales', text: 'Both the useful ones and the ones that wasted a morning.' },
      { title: 'Draft the form', text: 'Fewer fields, named options where you have them, and a file slot that matches the drawing formats you accept.' },
      { title: 'Specify the handoff', text: 'Inbox, CRM, or both, plus the page URL stored on the record.' },
      { title: 'Review live submissions', text: 'After the form is in use, we adjust the fields that are being skipped or misunderstood.' },
    ],
    offerTitle: 'Start with the last twenty requests',
    offerText: 'Twenty real submissions show which questions are missing and which are ignored. You keep the field specification.',
    offerIncludes: ['A review of recent requests', 'A revised field list', 'Routing and ownership', 'The product URL stored with the request'],
    offerNext: 'Building the form into the site is development work if the template does not exist yet. This service specifies and corrects it.',
    ctaLabel: 'Discuss the quote form',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'A form specification and the routing, based on recent requests.' },
      { format: 'campaign', duration: '3_months', text: 'A follow-up on live submissions once the form has been used.' },
    ],
    faqs: [
      { question: 'Will a shorter form produce more quotes?', answer: 'It may produce more submissions. We are aiming at requests sales can price, which is not the same number.' },
      { question: 'Should every page use the same form?', answer: 'The core fields can be shared. A product page should add the range or the model so the visitor does not retype what the URL already knows.' },
      { question: 'Do you install a CRM?', answer: 'No. If you already keep quotes in one, we map the form to it. Choosing and implementing a CRM is the sales systems work.' },
      { question: 'What about spam?', answer: 'The form needs a basic control so sales is not reading junk. That control should not block an engineer sending a drawing from a factory network.' },
    ],
    ctaHeading: 'Bring a request sales could not price',
    ctaBody: 'One incomplete RFQ is a better brief than a funnel diagram.',
    imageSource: 'blog-manufacturing-lead-generation.jpg',
    imageFile: 'rfq-forms-service.jpg',
    alt: 'A sales engineer walking a factory aisle beside installed process equipment, carrying a closed notebook.',
    displayOrder: 18,
    related: ['product-catalogs-ecommerce', 'website-development'],
  },
  {
    slug: 'website-maintenance-security',
    title: 'Website Maintenance & Security',
    h1: 'Keeping a manufacturer site accurate, updated, and fit to collect quote requests',
    previewDescription:
      'Ongoing upkeep for industrial sites: withdrawn ranges, security updates, and a quote form that keeps working after launch.',
    metaTitle: 'Website Maintenance and Security for Manufacturers',
    metaDescription:
      'Maintenance and security for manufacturer websites: range updates, platform patches, backups, and a quote form that still delivers after launch.',
    intro: [
      'Industrial sites usually decay after launch, not during it. A range is withdrawn and the page stays up. A form plugin stops delivering. An update is postponed because the last one broke a template.',
      'Maintenance is the work of keeping the public specification true and the site able to take a quote request. Security sits in the same job, because a neglected install is a poor place to collect drawings and contact details.',
    ],
    body:
      h2('Accuracy is the part visitors notice') +
      paragraphs(
        'The commercial failure is a page that offers a product you no longer make, or a limit engineering changed last quarter. We agree what "current" means: who tells us a range has changed, how fast the page comes down or is edited, and where the old URL goes so buyers do not hit a dead end.',
        'Editors in Payload can do a lot of this themselves when the content model is clear. Maintenance covers the changes that are not ordinary edits: template fixes, dependency updates, and the moments when a content change reveals a structural one.',
      ) +
      h2('Security without a theatre of tools') +
      paragraphs(
        'A site that accepts file uploads and enquiry data needs updates, backups, and an admin that is not shared as a single password. We keep the platform current and we check that the form still arrives. We do not sell a stack of security badges or promise that a site cannot be attacked.',
        'The work is scheduled. A site that is only touched when something is already broken will eventually be too far behind to update safely. That is the situation we are trying to avoid, especially on a Next.js and Payload build where small, regular updates are cheaper than a rescue.',
      ),
    situations: [
      { title: 'Pages for retired products are still the ones buyers find.', text: 'There is no routine for taking a range off the site. Maintenance starts by naming that routine.' },
      { title: 'Updates have been skipped because the last one caused a fault.', text: 'The platform is now further behind. The work is to make updates small again, not to freeze the site.' },
      { title: 'Nobody is sure the quote form still sends.', text: 'A form can fail quietly. A periodic check with a real test submission is part of upkeep, not an extra.' },
    ],
    scope: [
      { title: 'Content corrections that are structural', text: 'Retired ranges, redirects, and template bugs. Ordinary wording stays with your editors.' },
      { title: 'Platform upkeep', text: 'Dependency and security updates, backups, and a note of what changed.' },
      { title: 'Form and admin checks', text: 'A test that enquiries arrive, and that admin access is limited to the people who need it.' },
    ],
    steps: [
      { title: 'See how far behind the site is', text: 'Updates, failed forms, and public pages for products you no longer sell.' },
      { title: 'Agree the monthly list', text: 'What we will touch, and what your editors remain responsible for.' },
      { title: 'Do the work and write it down', text: 'Each month has a short record: what was updated, what was taken down, what still needs a decision.' },
      { title: 'Escalate structural problems', text: 'If the template itself is the reason updates fail, we say so. A rebuild is a different service. We will not quietly rebuild under a maintenance label.' },
    ],
    offerTitle: 'Start with a review of what has drifted',
    offerText: 'The first month shows the gap: retired pages, pending updates, and whether the form delivers. You can stop after that review.',
    offerIncludes: ['A drift review', 'A named list of monthly tasks', 'Updates and a written record', 'A form delivery check'],
    offerNext: 'Continuing is a decision at the end of the first period. It does not roll on by default.',
    ctaLabel: 'Discuss maintenance',
    formats: [
      { format: 'ongoing_monthly', duration: '3_months', text: 'An initial three months, with a stop or continue point.' },
      { format: 'ongoing_monthly', duration: '6_months', text: 'A longer spell once the monthly list is stable.' },
    ],
    faqs: [
      { question: 'Will you rewrite the catalog every month?', answer: 'No. Editors handle ordinary product text. We handle retired URLs, template faults, and platform updates.' },
      { question: 'Do you guarantee the site cannot be compromised?', answer: 'No. We keep the platform updated, limit admin access, and keep backups. That reduces a class of failures. It is not a guarantee.' },
      { question: 'What if we need a new page type?', answer: 'That is development. Maintenance can point out the need. It does not absorb a new build.' },
      { question: 'Who approves taking a product page down?', answer: 'The person who owns the product data. We do not unpublish a range on a rumor.' },
    ],
    ctaHeading: 'If the last update was "when we launched"',
    ctaBody: 'That is enough of a brief. Tell us who edits the site today and when a range was last withdrawn.',
    imageSource: 'blog-technical-content-manufacturing.jpg',
    imageFile: 'website-maintenance-security-service.jpg',
    alt: 'Two engineers comparing an industrial valve assembly with a paper drawing at a workbench.',
    displayOrder: 19,
    related: ['website-development', 'product-catalogs-ecommerce'],
  },
  {
    slug: 'cad-3d-configurator-integration',
    title: 'CAD & 3D Configurator Integration',
    h1: 'CAD downloads and 3D configurators only when the options engineering accepts are real',
    previewDescription:
      'CAD file delivery and 3D configurators for manufacturers, limited to options engineering will stand behind.',
    metaTitle: 'CAD and 3D Configurators for Industrial Manufacturers',
    metaDescription:
      'CAD downloads and 3D configurators for manufacturers, connected only to options and limits that engineering will actually accept on the product page.',
    intro: [
      'A configurator that allows a combination you cannot build creates a bad quote. A CAD file that does not match the current revision creates the same problem in the buyer\'s model.',
      'We connect those tools only after the product data is stable enough to drive them. The integration is a convenience for a real option set, not a visual feature for the homepage.',
    ],
    body:
      h2('The model has to match the page') +
      paragraphs(
        'Buyers use CAD to see whether a component fits their assembly, and a configurator to see which options exist. Both fail when they diverge from the specification on the product page. We start from the options and the limits engineering will sign, and we refuse combinations outside that list.',
        'File delivery is often the right first step. A controlled download of the current revision, with the part number visible, removes an email. A 3D configurator is a later step, and only when the options are few enough to model and common enough to justify the cost of keeping the model current.',
      ) +
      h2('Integration is maintenance as much as a launch') +
      paragraphs(
        'A configurator is a product that your catalog changes will break. If a size is withdrawn, the model has to lose it in the same week as the page. We specify who owns that update. Without an owner, we recommend the download and not the configurator.',
        'The technical connection sits on the website build: a Payload record for the file or the option, and a front end that does not invent geometry for a combination that was never approved. We do not embed a third-party widget that lets the buyer design a product you do not sell.',
      ),
    situations: [
      { title: 'Sales spends hours sending STEP files that are already public somewhere.', text: 'A controlled download on the product page is the smaller project. It may remove the need for a configurator entirely.' },
      { title: 'A vendor has offered a 3D tool that can "configure anything".', text: 'Anything is the problem. We limit the tool to published options or we do not connect it.' },
      { title: 'An old configurator is still on the site and engineering no longer trusts it.', text: 'Take it down or rebuild it from the current option list. Leaving a wrong model up is worse than a page with a download link.' },
    ],
    scope: [
      { title: 'Option list', text: 'The combinations engineering accepts, written tightly enough to drive a file or a model.' },
      { title: 'CAD delivery or a configurator', text: 'A download of the current revision, or a 3D tool when the option set justifies it. Not both by default.' },
      { title: 'Update path', text: 'Who changes the file or the model when the product changes, and how the old revision comes off the site.' },
    ],
    steps: [
      { title: 'Ask whether a download would solve it', text: 'If sales only needs to stop emailing files, we do that and stop.' },
      { title: 'Freeze the option list', text: 'Engineering signs the combinations. The tool cannot offer more than that list.' },
      { title: 'Connect it to the product page', text: 'The part number on the model matches the part number on the page. A mismatch is a defect.' },
      { title: 'Name the person who updates it', text: 'If that person does not exist, the configurator does not launch.' },
    ],
    offerTitle: 'Start by asking what sales is emailing',
    offerText: 'The first recommendation is often a download, not a configurator. You get that recommendation in writing.',
    offerIncludes: ['A look at the files sales sends today', 'An option list engineering can sign', 'A recommendation of download or configurator', 'An owner for later revisions'],
    offerNext: 'Building a configurator is scoped only after the option list exists. We will not start from a software demo.',
    ctaLabel: 'Discuss CAD or 3D',
    formats: [
      { format: 'initial_project', duration: 'one_time_project', text: 'A download path, or a decision that a configurator is not justified yet.' },
      { format: 'campaign', duration: '6_months', text: 'A configurator for one product family whose options are already stable.' },
    ],
    faqs: [
      { question: 'Do you model the parts yourselves?', answer: 'We integrate files your engineering team already trusts. Creating the master CAD is your engineering work, or a specialist you appoint. We do not invent geometry.' },
      { question: 'Can the configurator show a price?', answer: 'Only for options you will actually sell at that price. A generated price for an impossible build is a quote you then have to unwind.' },
      { question: 'What if the option list changes every month?', answer: 'Then a configurator will be wrong most of the time. Use a download of the current file, or wait until the range settles.' },
      { question: 'Is this part of the catalog service?', answer: 'The catalog decides what is public. This service connects a file or a model to that public product. They are sequential, not the same job.' },
    ],
    ctaHeading: 'Bring the file sales keeps attaching',
    ctaBody: 'If that file has a current revision and a part number, we can talk about putting it on the page. If it does not, the configurator can wait.',
    imageSource: 'blog-content-engineering-semantic-chunking.jpg',
    imageFile: 'cad-configurator-service.jpg',
    alt: 'A laptop showing a specification grid, with technical drawings and machined metal parts on an engineering desk.',
    displayOrder: 20,
    related: ['product-catalogs-ecommerce', 'website-development'],
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
    if (page.body.includes(intro.slice(0, 70))) throw new Error(`${page.slug} repeats intro`)
    if (/[\u2013\u2014]/.test(JSON.stringify(page))) throw new Error(`${page.slug} has a dash`)
  }
  const raw = readFileSync(path.join(process.cwd(), 'src', 'scripts', 'content', 'services', 'website.html'), 'utf8')
  const cards = raw.split('@@cards')[1]?.trim().split('\n').filter(Boolean) ?? []
  if (cards.length !== 8) throw new Error(`website cards ${cards.length}`)
  const hrefs = new Set<string>()
  for (const line of cards) {
    const [title, href, text] = line.split(' || ')
    if (!title || !href || !text) throw new Error(`Bad card ${line}`)
    if (text.trim().length < 150 || text.trim().length > 250) {
      throw new Error(`card ${text.trim().length} ${title}`)
    }
    if (hrefs.has(href)) throw new Error(`Duplicate href ${href}`)
    hrefs.add(href.trim())
  }
}

const uploadImage = async (payload: Payload, page: PageCopy) => {
  if (!page.imageSource || !page.imageFile || !page.alt) throw new Error(`No image for ${page.slug}`)
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

const pageData = (page: PageCopy, imageId: number, relatedIds: number[], publishedAt?: string) => ({
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
    const deny = new Set([
      'id',
      'createdAt',
      'updatedAt',
      'deletedAt',
      'populatedAuthors',
      'breadcrumbs',
    ])
    const data: Record<string, unknown> = {}
    const original = doc as unknown as Record<string, unknown>
    for (const [key, value] of Object.entries(rewritten)) {
      if (deny.has(key)) continue
      if (JSON.stringify(value) !== JSON.stringify(original[key])) data[key] = value
    }
    if (Object.keys(data).length === 0) continue
    try {
      await payload.update({ collection, id: doc.id, data, draft: false, overrideAccess: true, context })
    } catch (error) {
      const details = error && typeof error === 'object' && 'data' in error ? (error as { data?: { errors?: unknown } }).data?.errors : error
      console.log(collection, doc.id, Object.keys(data))
      console.dir(details, { depth: 6 })
      throw error
    }
    changed += 1
  }
  payload.logger.info(`${collection}: rewrote ${changed} documents`)
}

const updateWebsiteOverview = async (payload: Payload) => {
  const raw = readFileSync(path.join(process.cwd(), 'src', 'scripts', 'content', 'services', 'website.html'), 'utf8').trim()
  const parts = raw.split(/\n@@/)
  const take = (name: string) => {
    const part = parts.find((item) => item.startsWith(name))
    if (!part) throw new Error(`website.html missing ${name}`)
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
    where: { slug: { equals: 'website' } },
  })
  const overview = existing.docs[0]
  if (!overview) throw new Error('Website overview missing')
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
  payload.logger.info('Website overview cards point at eight separate services')
}

const main = async () => {
  if (process.env.SKIP_PAGES === '1') {
    const payload = await getPayload({ config })
    await rewriteCollection(payload, 'posts')
    await rewriteCollection(payload, 'pages')
    await rewriteCollection(payload, 'case-studies')
    await updateWebsiteOverview(payload)
    process.exit(0)
  }
  assertCopy()
  for (const page of PAGES) console.log(`${page.slug} title ${page.metaTitle.length} description ${page.metaDescription.length}`)
  const payload = await getPayload({ config })

  const design = PAGES[0]
  const designExisting = await payload.find({
    collection: 'services',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { slug: { in: [design.slug, design.successorOf || ''] } },
  })
  const designDoc = designExisting.docs[0]
  const designImage = mediaId(designDoc?.service_preview_image) || mediaId(designDoc?.meta && typeof designDoc.meta === 'object' ? (designDoc.meta as { image?: unknown }).image : null)
  if (!designDoc || !designImage) throw new Error('Existing website design service or its image was not found')

  const imageIds = new Map<string, number>([[design.slug, designImage]])
  for (const page of PAGES.slice(1)) imageIds.set(page.slug, await uploadImage(payload, page))

  const caseStudy = await payload.find({
    collection: 'case-studies',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: 'laser-made-two-manufacturing-websites' } },
    select: { slug: true },
  })
  const caseIds = caseStudy.docs[0] ? [Number(caseStudy.docs[0].id)] : relationIds(designDoc.relatedCaseStudies)

  for (const page of PAGES) {
    const existing = page.slug === design.slug
      ? designDoc
      : (await payload.find({
          collection: 'services',
          depth: 0,
          limit: 1,
          overrideAccess: true,
          where: { slug: { equals: page.slug } },
        })).docs[0]
    const publishedAt = existing?.publishedAt || undefined
    const data = pageData(page, imageIds.get(page.slug)!, [], publishedAt)
    if (page.slug === design.slug) data.relatedCaseStudies = caseIds
    if (existing) {
      await payload.update({ collection: 'services', id: existing.id, data, draft: false, overrideAccess: true, context })
      payload.logger.info(`Updated ${page.slug}`)
    } else {
      await payload.create({ collection: 'services', data, draft: false, overrideAccess: true, context })
      payload.logger.info(`Created ${page.slug}`)
    }
  }

  const slugs = PAGES.flatMap((page) => [page.slug, ...page.related])
  const relatedDocs = await payload.find({
    collection: 'services',
    depth: 0,
    limit: 30,
    overrideAccess: true,
    where: { slug: { in: [...new Set(slugs)] } },
    select: { slug: true },
  })
  const idBySlug = new Map(relatedDocs.docs.map((doc) => [doc.slug, Number(doc.id)]))
  for (const page of PAGES) {
    const id = idBySlug.get(page.slug)
    if (!id) throw new Error(`Missing ${page.slug}`)
    await payload.update({
      collection: 'services',
      id,
      draft: false,
      overrideAccess: true,
      context,
      data: { relatedServices: page.related.map((slug) => {
        const relatedId = idBySlug.get(slug)
        if (!relatedId) throw new Error(`Missing related ${slug}`)
        return relatedId
      }) },
    })
  }

  await rewriteCollection(payload, 'posts')
  await rewriteCollection(payload, 'pages')
  await rewriteCollection(payload, 'case-studies')
  await updateWebsiteOverview(payload)
  process.exit(0)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
