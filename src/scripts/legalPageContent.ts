import { contact } from '../config/contact'
import { ORGANIZATION_NAME, SITE_NAME } from '../utilities/siteIdentity'

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const h2 = (text: string) => `<h2>${escapeHtml(text)}</h2>`
const h3 = (text: string) => `<h3>${escapeHtml(text)}</h3>`
const p = (text: string) => `<p>${escapeHtml(text)}</p>`
const htmlP = (inner: string) => `<p>${inner}</p>`
const strong = (text: string) => `<strong>${escapeHtml(text)}</strong>`
const bullets = (items: string[]) =>
  `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
const htmlBullets = (items: string[]) => `<ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`
const link = (href: string, text: string) =>
  `<a href="${escapeHtml(href)}">${escapeHtml(text)}</a>`
const placeholder = (text: string) => strong(`[${text}]`)

export const LEGAL_PLACEHOLDERS = {
  legalEntity: 'Registered legal entity name — to be confirmed by the site owner',
  postalAddress: 'Registered postal address — to be confirmed by the site owner',
  privacyEmail: 'Privacy contact email — to be confirmed by the site owner',
  retention: 'Data retention schedule — to be confirmed by the site owner',
  lastUpdated: 'Last updated date — to be confirmed by the site owner',
  euRepresentative: 'EU/UK representative, DPO, and lawful bases — to be confirmed by the site owner',
} as const

export const accessibilitySeo = {
  title: `Accessibility Statement | ${SITE_NAME}`,
  description:
    'Learn about our commitment to website accessibility, inclusive design, keyboard navigation, readable content, and ongoing accessibility improvements.',
}

export const privacySeo = {
  title: `Privacy Policy | ${SITE_NAME}`,
  description:
    'Read our privacy policy to understand how website information, contact inquiries, cookies, analytics, advertising technologies, and personal data are handled.',
}

export const sitemapSeo = {
  title: `Sitemap | ${SITE_NAME}`,
  description: 'Browse the main pages, services, case studies, and articles available on our website.',
}

export const accessibilityHtml = (): string =>
  [
    h2('Our Commitment'),
    p(
      `${ORGANIZATION_NAME} operates ${SITE_NAME} as a B2B manufacturing marketing website. We intend this site to be usable by as many people as reasonably possible, including people who use keyboards, screen readers, and other assistive technologies.`,
    ),
    p(
      'Accessibility is treated as an ongoing design and engineering practice, not a one-time launch task. We continue to improve the site as we add pages, features, and content.',
    ),
    h2('Accessibility Standards'),
    p(
      `We aim to align the public website with widely used accessibility best practices. Where it is useful as a technical reference, we look to the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA.`,
    ),
    p(
      'This statement does not claim that the website is fully compliant, certified, or independently audited. No accessibility certification, audit score, or compliance percentage is published here because none has been independently verified for this site.',
    ),
    h2('Accessibility Features'),
    p(
      'The following features are implemented in the current public website and can be verified in the product itself:',
    ),
    bullets([
      'A skip link that moves keyboard users to the main content.',
      'Keyboard access to primary navigation, footer links, buttons, and form controls.',
      'Visible focus indicators on interactive controls.',
      'Semantic page structure, including headings, navigation, main content, and footer landmarks.',
      'Language set to English on the document.',
      'Screen-reader labels on key controls, including the site logo and the accessibility settings panel.',
      'Alternative text support for CMS images, used when editors provide a description.',
      'Readable typography and responsive layouts that adapt to common screen sizes.',
      'An accessibility settings widget with text size, high contrast, grayscale, highlighted links, a more readable font, increased text spacing, reduced motion, and a reset control.',
      'Respect for reduced-motion preferences, including the system reduced-motion setting and the in-site control.',
    ]),
    p(
      'The accessibility widget stores the visitor’s chosen settings in the browser. It is an assistance panel. It is not a substitute for a formal accessibility audit and it is not a cookie-consent manager.',
    ),
    h2('Ongoing Improvements'),
    p(
      'We review and improve accessibility as the website changes. There is no published formal audit calendar. When we add features or content, we work to keep the site operable with a keyboard, reasonably readable, and compatible with common assistive technologies.',
    ),
    h2('Known Limitations'),
    p(
      'No independent accessibility audit of this website has been completed for publication. We continue to evaluate the experience and welcome reports of barriers. This section can be updated in the CMS when specific issues are confirmed.',
    ),
    p(
      'Some content is photographic or technically detailed. Image descriptions depend on the text supplied in the CMS. Third-party embeds, when used, may not offer the same accessibility support as the rest of the site.',
    ),
    h2('Third-Party Content'),
    p(
      'Parts of the website can include content or tools that we do not fully control. Examples that exist in the current product include optional video embeds on case study pages and links to external messaging services such as WhatsApp. Those third-party interfaces follow their own accessibility practices.',
    ),
    h2('Feedback and Contact'),
    htmlP(
      `If you have trouble using this website, please tell us. Use the ${link('/contact', 'Contact page')} to send a message, or contact us through WhatsApp at ${escapeHtml(contact.displayPhone)} when that channel is available. Please include the page URL and a short description of the barrier.`,
    ),
    p(
      'We will use the information you provide to understand the issue and, where reasonable, to improve the website.',
    ),
    h2('Statement Review'),
    p(
      'This statement describes current website practices. It is edited in the website CMS when accessibility features or this text change. It is not a formal accessibility audit report and it does not use a separate legal-review date.',
    ),
  ].join('')

export const privacyHtml = (): string =>
  [
    h2('1. Scope and Introduction'),
    p(
      `This Privacy Policy explains how personal information may be collected, used, disclosed, retained, and protected when you visit ${SITE_NAME}, read our content, or contact ${ORGANIZATION_NAME} about manufacturing marketing services.`,
    ),
    htmlP(
      `The website is presented publicly under the name ${escapeHtml(ORGANIZATION_NAME)}, operating as ${escapeHtml(SITE_NAME)}. The registered legal entity, if different from that public name, has not been confirmed for publication: ${placeholder(LEGAL_PLACEHOLDERS.legalEntity)}.`,
    ),
    htmlP(
      `Registered postal address for privacy correspondence: ${placeholder(LEGAL_PLACEHOLDERS.postalAddress)}.`,
    ),
    p(
      'This policy covers the public website, contact and inquiry communications, browser storage used for site preferences, and marketing or advertising technologies if they are enabled. It does not cover unrelated websites that we do not operate.',
    ),
    p(
      'This document is a practical description of current website implementation and of categories of processing that may become relevant. It is not a claim that every technology mentioned below is active today, and it is not a substitute for a legal review of actual business practices.',
    ),

    h2('2. Information We May Collect'),
    h3('Information provided directly'),
    p(
      'The information we receive depends on how you choose to contact us. You are not required to submit an inquiry in order to browse public pages.',
    ),
    p(
      'At the time this policy was drafted, the CMS did not contain a published contact form, and the Contact page did not include a form block. The website software can host forms. If a form is published later, we will process the fields shown on that form, which may include name, email address, telephone number, message text, and other details the form is configured to collect, such as company name, job title, website URL, or project requirements.',
    ),
    htmlP(
      `You may also contact us through the ${link('/contact', 'Contact page')} or through WhatsApp using the number published on the website (${escapeHtml(contact.displayPhone)}). A Telegram option may be shown, but it is only active when a public Telegram destination has been configured. Information you send through those channels is the information you choose to provide in the conversation.`,
    ),
    p(
      'Starting a conversation or submitting an inquiry does not, by itself, subscribe you to a marketing email list.',
    ),
    h3('Automatically collected information'),
    p(
      'Like most websites, the hosting and application infrastructure may process technical information needed to deliver pages, keep the site secure, and diagnose problems. That information can include IP address, browser and device details, operating system, referring URL, pages requested, date and time of the request, approximate location derived from IP address, and diagnostic or security logs.',
    ),
    p(
      'This operational processing is distinct from optional analytics or advertising tracking. Optional analytics and advertising tags are described later in this policy and are not treated as active merely because they are mentioned.',
    ),
    h3('Information from third parties'),
    p(
      'We may receive business contact details from the person who contacts us, from public business sources, or from service providers involved in hosting, security, communications, or project delivery. We do not claim that every possible third-party source is currently in use.',
    ),

    h2('3. How We Use Information'),
    p('Depending on the interaction, information may be used to:'),
    bullets([
      'Respond to inquiries and prepare requested information or quotations.',
      'Communicate about potential or active projects.',
      'Provide contracted manufacturing marketing services.',
      'Maintain customer and prospect records needed to manage a professional relationship.',
      'Operate, secure, and troubleshoot the website.',
      'Understand how the public website is performing, where analytics are lawfully configured.',
      'Measure marketing or advertising effectiveness, where those tools are enabled and configured.',
      'Improve website content and user experience.',
      'Prevent abuse, fraud, and security incidents.',
      'Meet legal obligations and establish, exercise, or defend legal claims where applicable.',
    ]),
    p(
      'Operational communications about an inquiry or a project are different from promotional campaigns. We do not treat a contact form submission or a WhatsApp message as consent to unrelated marketing emails unless that consent is separately and clearly obtained.',
    ),

    h2('4. Cookies and Similar Technologies'),
    p(
      'This website can use cookies, similar identifiers, and browser storage. The technologies actually present depend on the current configuration of the site.',
    ),
    h3('Essential and operational technologies'),
    p(
      'The application may set cookies required to operate signed-in administrative sessions, such as the Payload CMS authentication cookie used by site editors. Ordinary public visitors do not need an account to read the website.',
    ),
    h3('Preference storage'),
    p(
      'The public website stores certain preferences in the browser’s local storage rather than in advertising cookies. These include appearance theme, color-palette selection, and accessibility-widget settings. Those preferences stay on the device and are used to remember the visitor’s chosen display options.',
    ),
    h3('Analytics, advertising, and embedded content'),
    p(
      'Analytics cookies, advertising identifiers, conversion-measurement tags, and embedded third-party content may process information when those integrations are actually loaded. Similar technologies can operate without a traditional cookie, for example through pixels, local storage, or server-side logging.',
    ),
    h3('Consent and preference controls'),
    p(
      'Where applicable law requires consent before optional tracking, that consent should be collected through a working preference mechanism. This website does not currently include a cookie-consent banner or a consent-management platform. Optional advertising and analytics tags are not currently loaded by the public frontend. Preference controls in the accessibility widget and theme selector are not consent tools for advertising cookies.',
    ),
    p(
      'We do not claim that all cookies are blocked until consent, because no such blocking layer is implemented.',
    ),
    h3('Current and possible future integrations'),
    p(
      'A code review of the current project found no Google Analytics 4, Google Ads conversion or remarketing tags, Google Tag Manager container, Meta Pixel, or Cloudflare analytics/bot script installed on the public website.',
    ),
    p(
      'Those products, and other analytics, attribution, or advertising tools, may be added later. If they are enabled, this policy should be updated so that active providers are described as active, and any required consent or disclosure controls should be implemented before those tags collect optional data.',
    ),
    p(
      'Until that happens, the list above is a maintainable map of technologies that a manufacturing marketing website might use. It is not a statement that they currently collect visitor data on this site.',
    ),

    h2('5. Google Analytics and Google Advertising'),
    p(
      'Google Analytics 4, Google Ads conversion tracking, remarketing tags, and Google Tag Manager are not currently initialized in the public website code.',
    ),
    p(
      'If Google technologies are enabled later, they may process website usage information and advertising interaction data for analytics, campaign measurement, or other purposes configured in the Google account. We would not, at that time, publish unverified claims about exact data fields, retention periods, data locations, Google signals, or advertising personalization settings. Those details would need to be taken from the live Google configuration.',
    ),
    htmlP(
      `Google’s own information about how it processes data is available in ${link('https://policies.google.com/privacy', "Google's Privacy Policy")} and ${link('https://business.safety.google/privacy/', "Google's Business Data Responsibility pages")}.`,
    ),

    h2('6. Meta and Social Advertising Technologies'),
    p(
      'Meta Pixel and related Meta advertising measurement tools are not currently initialized in the public website code.',
    ),
    p(
      'If a Meta Pixel or similar tool is enabled later, it may process information about website interactions and configured conversion events for measurement and advertising. Private messages sent through a contact form, email, or WhatsApp are not automatically shared with advertising platforms by the current website implementation.',
    ),
    htmlP(
      `Meta’s privacy information is available in the ${link('https://www.facebook.com/privacy/policy/', 'Meta Privacy Policy')}. WhatsApp, which is a separate Meta product used here only as a contact channel when you choose to open it, publishes its own ${link('https://www.whatsapp.com/legal/privacy-policy', 'WhatsApp Privacy Policy')}.`,
    ),

    h2('7. Cloudflare and Website Security'),
    p(
      'The current website codebase does not install Cloudflare analytics or a Cloudflare challenge widget. The site may still be delivered through hosting, DNS, CDN, or security infrastructure that logs technical requests in order to operate the service.',
    ),
    p(
      'The project is configured to run as a Next.js application with a hosted Postgres database. Those hosting and database providers may process technical logs, stored content, and backup copies as needed to deliver the website. We do not claim that any provider encrypts or anonymizes all data in every circumstance, and we do not publish invented retention periods for those vendors.',
    ),
    p(
      'If Cloudflare or a similar security or CDN service is later confirmed as part of the live environment, this section should be updated to describe the functions actually used, such as DNS, content delivery, security filtering, abuse prevention, or performance optimization.',
    ),
    htmlP(
      `Cloudflare’s policy, for reference if that infrastructure is used, is available at ${link('https://www.cloudflare.com/privacypolicy/', 'Cloudflare’s Privacy Policy')}.`,
    ),

    h2('8. Contact Forms and Direct Communications'),
    p(
      'The website software includes form-builder support and a form-submission endpoint. No public form was published in the CMS when this policy was drafted. If a form is added to a public page later, submissions from that form will be stored so we can read and respond to the inquiry. The precise fields will be those displayed on the form you submit.',
    ),
    htmlP(
      `If you contact us by WhatsApp, telephone, Telegram, or another channel that we actually offer, the relevant communications provider processes that conversation under its own terms. The current public WhatsApp number is ${escapeHtml(contact.displayPhone)}. No public Telegram username is configured at the time this policy was drafted.`,
    ),
    p(
      'Contacting us about a project is not the same as opting in to a newsletter or paid advertising audience.',
    ),

    h2('9. CRM and Lead Management'),
    p(
      'Inquiry information may be stored in internal business tools so we can organize requests, manage projects, keep business records, and coordinate follow-up. The current website code does not name a specific CRM product as a connected integration.',
    ),
    p(
      'Not every website visitor is entered into a CRM. Records are created when there is a business reason to keep the inquiry or relationship, such as a message you sent or a project we are discussing.',
    ),

    h2('10. AI Tools and Automated Processing'),
    p(
      'We may use internal drafting, research, and productivity tools, including AI-assisted tools, in ordinary business work. That is different from sending visitor data to an AI provider as part of the public website, and it is different from automated decisions that produce legal or similarly significant effects.',
    ),
    p(
      'The current website implementation does not send contact-form submissions to a public AI provider for automated decision-making of that kind. We do not claim that AI is used to approve or refuse services through a fully automated legal decision. If those practices change, this policy should be updated.',
    ),

    h2('11. Sharing and Disclosure'),
    p(
      'Information may be disclosed to recipients who need it for a specific purpose. Actual recipients depend on the services in use and the circumstances of the inquiry or project. Categories can include:',
    ),
    bullets([
      'Hosting, database, and application infrastructure providers.',
      'Security, DNS, or content-delivery providers, if used.',
      'Analytics and advertising providers, if those tags are enabled.',
      'Communications platforms you choose to use, such as WhatsApp.',
      'Professional advisers, such as legal or accounting advisers, where needed.',
      'Authorities when the law requires disclosure.',
      'A successor in a lawful business transaction, where applicable.',
    ]),
    p(
      'We do not operate this website as a data-brokerage service. We also do not publish an absolute statement that personal information is never shared, because hosting, communications, and future marketing tools necessarily involve service providers.',
    ),
    p(
      'Whether any activity meets a legal definition of a “sale” or “sharing” of personal information depends on applicable law and on practices that the site owner must confirm. No claim that data is sold, or never sold, is made here without that confirmation.',
    ),

    h2('12. International Data Transfers'),
    p(
      'Service providers may process information in countries other than the country from which you visit the site. The current implementation does not publish a verified list of processing countries, standard contractual clauses, or transfer certifications.',
    ),
    p(
      'If GDPR, UK GDPR, or another transfer regime applies, the site owner should confirm the safeguards actually used rather than relying on this placeholder description.',
    ),

    h2('13. Data Retention'),
    p(
      'We retain information only as long as reasonably necessary for the purpose for which it was collected, including inquiry follow-up, project delivery, security, and legal or accounting recordkeeping where those requirements apply.',
    ),
    htmlP(
      `No specific retention schedule has been confirmed for publication: ${placeholder(LEGAL_PLACEHOLDERS.retention)}.`,
    ),
    p(
      'Browser preference storage remains on the visitor’s device until the visitor clears it or resets the relevant control. Hosting and security logs follow the provider’s own retention practices.',
    ),

    h2('14. Data Security'),
    p(
      'We use reasonable technical and organizational measures appropriate to a professional website, including access-controlled administration of the CMS, encrypted transport to the public site over HTTPS where the hosting environment provides it, and limitation of published secrets in the frontend.',
    ),
    p(
      'No website is immune to security incidents. This policy does not claim that systems have been independently audited or that a breach cannot occur.',
    ),

    h2('15. Privacy Rights'),
    p(
      'Depending on where you live and which law applies, you may have rights in relation to personal information. Those rights can include access, correction, deletion, restriction of processing, objection to certain processing, data portability, withdrawal of consent where processing relies on consent, opting out of certain targeted advertising or sale/sharing practices, and lodging a complaint with a supervisory authority.',
    ),
    p(
      'Not every visitor has every right in every jurisdiction. The availability and scope of these rights depend on applicable law, the role of the website operator, and the circumstances of the request.',
    ),
    htmlP(
      `To make a privacy request, use the ${link('/contact', 'Contact page')} or write to ${placeholder(LEGAL_PLACEHOLDERS.privacyEmail)}. We may need to confirm the request is legitimate before completing it.`,
    ),

    h2('16. Regional Privacy Information'),
    p(
      `${SITE_NAME} is a B2B manufacturing marketing website that may be visited by companies in more than one country. The subsections below are structured so they can be completed as the operator’s legal status is confirmed. They do not assert unsupported registrations, representative appointments, or jurisdictional coverage.`,
    ),
    h3('European Economic Area and United Kingdom'),
    p(
      'If the GDPR or UK GDPR applies to a particular processing activity, the operator would need to identify lawful bases, honor valid data-subject rights, and use appropriate transfer safeguards. Those items have not been confirmed for publication.',
    ),
    htmlP(placeholder(LEGAL_PLACEHOLDERS.euRepresentative)),
    p(
      'Depending on the activity, a lawful basis may later be confirmed as steps taken at the request of a prospective client, performance of a contract, compliance with law, legitimate interests in operating a B2B website, or consent where optional tracking is introduced and consent is required. Until the operator confirms the bases actually relied on, this policy does not select them as established legal positions.',
    ),
    h3('Israel'),
    p(
      'The public contact number uses an Israeli country code. Israeli privacy law, including the Protection of Privacy Law, 5741-1981, related data-security regulations, and subsequent amendments, may be relevant. This subsection identifies that local framework for legal review. It does not claim that a particular registration, database, or compliance program has been completed.',
    ),
    h3('United States'),
    p(
      'Some U.S. state privacy laws, including the California Consumer Privacy Act as amended by the CPRA and similar state statutes, confer rights on certain residents when the business is in scope. This website does not currently publish a separate “Do Not Sell or Share My Personal Information” link, because it has not been confirmed that those statutes apply to this operator or that a sale or share as those laws define it is occurring.',
    ),
    p(
      'State-specific notices should be added only when the relevant law applies. No U.S. state is listed here as definitely in scope.',
    ),
    h3('Other jurisdictions'),
    p(
      'Additional disclosures can be added here if the agency establishes operations or legal obligations in other countries. No extra country-specific statement is published without that confirmation.',
    ),

    h2('17. Children’s Privacy'),
    p(
      'This website is intended for business professionals considering manufacturing marketing services. It is not directed at children, and we do not knowingly collect personal information from children in order to offer services to them.',
    ),
    p(
      'The site does not include an age-verification mechanism. If we learn that we have collected personal information from a child in a way that is inconsistent with applicable law, we will take reasonable steps to delete it.',
    ),

    h2('18. Third-Party Links'),
    p(
      'The website may link to external sites, messaging apps, social platforms, and vendor documentation. Those destinations have their own privacy policies and practices. We do not control how those operators use information you provide to them.',
    ),
    htmlP(
      `Official policies for services that are currently linked or that may later be enabled include ${link('https://policies.google.com/privacy', 'Google')}, ${link('https://www.facebook.com/privacy/policy/', 'Meta')}, ${link('https://www.whatsapp.com/legal/privacy-policy', 'WhatsApp')}, and ${link('https://www.cloudflare.com/privacypolicy/', 'Cloudflare')}.`,
    ),

    h2('19. Changes to This Policy'),
    p(
      'We may update this policy as the website, services, legal requirements, and technology integrations change. Material changes should be reflected in the CMS copy before new optional tracking is presented as current practice.',
    ),
    htmlP(`Last updated: ${placeholder(LEGAL_PLACEHOLDERS.lastUpdated)}.`),
    p(
      'The presence of a last-updated field does not mean that a lawyer has completed a formal legal review on that date.',
    ),

    h2('20. Contact Information'),
    htmlP(
      `For privacy questions or requests, contact ${escapeHtml(ORGANIZATION_NAME)} through the ${link('/contact', 'Contact page')} or WhatsApp at ${escapeHtml(contact.displayPhone)}.`,
    ),
    htmlP(`Privacy email: ${placeholder(LEGAL_PLACEHOLDERS.privacyEmail)}.`),
    htmlP(`Legal entity: ${placeholder(LEGAL_PLACEHOLDERS.legalEntity)}.`),
    htmlP(`Postal address: ${placeholder(LEGAL_PLACEHOLDERS.postalAddress)}.`),
    p(
      'Do not send passwords, payment-card numbers, or other highly sensitive credentials through public contact channels.',
    ),
  ].join('')

export const sitemapIntroHtml = (): string =>
  [
    p(
      `This page lists the main public areas of ${SITE_NAME}. Use it to move to services, case studies, articles, and legal pages. Search-engine XML sitemaps are separate from this visitor page.`,
    ),
  ].join('')
