import { contact } from '../config/contact'
import { ORGANIZATION_NAME, SITE_NAME } from '../utilities/siteIdentity'

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const h2 = (text: string) => `<h2>${escapeHtml(text)}</h2>`
const h3 = (text: string) => `<h3>${escapeHtml(text)}</h3>`
const p = (text: string) => `<p>${escapeHtml(text)}</p>`
const htmlP = (inner: string) => `<p>${inner}</p>`
const bullets = (items: string[]) =>
  `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
const link = (href: string, text: string) =>
  `<a href="${escapeHtml(href)}">${escapeHtml(text)}</a>`

export const accessibilitySeo = {
  title: `Accessibility Statement | ${SITE_NAME}`,
  description:
    'Learn about our commitment to website accessibility, inclusive design, keyboard navigation, readable content, and ongoing accessibility improvements.',
}

const PRIVACY_EMAIL = 'info@neo-lines.com'

export const privacySeo = {
  title: `Privacy Policy | ${SITE_NAME}`,
  description:
    'How this website handles inquiries, cookies, Google Analytics, Meta Pixel, and advertising measurement.',
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
      `The website is presented publicly under the name ${escapeHtml(ORGANIZATION_NAME)}, operating as ${escapeHtml(SITE_NAME)}. Privacy requests go to ${link(`mailto:${PRIVACY_EMAIL}`, PRIVACY_EMAIL)} or through the ${link('/contact', 'Contact page')}. A separate registered postal address is not published on this website.`,
    ),
    p(
      'This policy covers the public website, contact and inquiry communications, browser storage used for site preferences, Google Analytics, and Meta advertising technologies, including the Meta Pixel. It does not cover unrelated websites that we do not operate.',
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
      'In addition, Google Analytics and Meta technologies described below collect usage and advertising information when you browse the public site. That collection is separate from the message you choose to send us on WhatsApp, Telegram, or email.',
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
      'Measure visits, pages, referring sites, and on-site actions with Google Analytics.',
      'Measure and improve advertising with Meta, including the Meta Pixel, conversion events, and audiences built from site visits.',
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
    h3('Analytics and advertising technologies'),
    p(
      'The public website uses Google Analytics and Meta technologies. These can set cookies, similar identifiers, and pixels. They can also recognize a browser without a traditional cookie, including through local storage or an advertising identifier.',
    ),
    bullets([
      'Google Analytics, to count visits and understand which pages and referring sites are used.',
      'Meta Pixel and related Meta advertising tools, to measure visits, record conversion events, build audiences from site activity, and deliver or measure ads on Meta services such as Facebook and Instagram.',
      'Google advertising cookies, where a Google tag on the site is also used for ads measurement or remarketing.',
    ]),
    h3('Controls'),
    p(
      'The accessibility widget and the theme selector only remember display preferences. They do not switch analytics or advertising off.',
    ),
    p(
      'Where the law requires a choice before analytics or advertising cookies, that choice is the basis for those cookies. You can also limit them with the browser and with the Google and Meta controls linked in the next sections. Blocking cookies in the browser can stop parts of this measurement.',
    ),

    h2('5. Google Analytics'),
    p(
      'Google Analytics is used on the public website to measure how the site is used. Google can process information such as pages viewed, approximate location derived from IP address, device and browser details, language, referring URL, date and time, events on the page, and an identifier stored in a cookie or similar technology.',
    ),
    p(
      'We use that information to see which pages are used, how visitors arrive, and whether the site is working. Where Google advertising features are connected to the same Google tag, Google can also use visit information to measure ads and to support remarketing. The exact retention period and any advertising-personalization switch are the settings in the Google account that receives this site’s traffic, together with Google’s own retention rules.',
    ),
    htmlP(
      `You can limit Google Analytics in the browser with ${link('https://tools.google.com/dlpage/gaoptout', 'Google’s Analytics opt-out add-on')}. Ad personalization controls are in ${link('https://myadcenter.google.com/', 'Google My Ad Center')}. Google describes its own processing in ${link('https://policies.google.com/privacy', "Google's Privacy Policy")} and ${link('https://business.safety.google/privacy/', "Google's Business Data Responsibility pages")}.`,
    ),

    h2('6. Meta Pixel and Meta Advertising'),
    p(
      'The public website uses the Meta Pixel and Meta’s advertising measurement tools. Meta can process information about pages you view, actions we configure as conversion events, the date and time, device and browser details, IP address, a cookie or similar identifier such as those Meta uses to recognize a browser, and the fact that you came from or interacted with an ad.',
    ),
    p(
      'We use that information to measure advertising, understand which visits follow an ad, create and use audiences based on visits to this site, and improve or limit later ads on Meta services. If you are logged in to Facebook or Instagram, Meta can match the visit to your account under Meta’s own terms. A message you send through the contact page, email, WhatsApp, or Telegram is not added to the Meta Pixel by this policy and is not used here as an advertising audience by itself.',
    ),
    htmlP(
      `Meta’s privacy information is in the ${link('https://www.facebook.com/privacy/policy/', 'Meta Privacy Policy')}. Ad controls are in ${link('https://www.facebook.com/adpreferences', 'Meta Ad Preferences')}. WhatsApp is a separate Meta product used only as a contact channel when you choose to open it. WhatsApp’s own notice is the ${link('https://www.whatsapp.com/legal/privacy-policy', 'WhatsApp Privacy Policy')}.`,
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
      `If you contact us by WhatsApp, telephone, or Telegram, that provider processes the conversation under its own terms. The published WhatsApp number and the published Telegram destination both use ${escapeHtml(contact.displayPhone)}.`,
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
      'Google, for Analytics and any connected advertising measurement.',
      'Meta, for the Meta Pixel, conversion measurement, and advertising audiences.',
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
      'Google and Meta may process this information in countries other than the country from which you visit. Their published terms describe the safeguards they offer for those transfers. Hosting and database providers used to run this website may do the same for technical logs and stored content.',
    ),

    h2('13. Data Retention'),
    p(
      'We retain information only as long as reasonably necessary for the purpose for which it was collected, including inquiry follow-up, project delivery, security, and legal or accounting recordkeeping where those requirements apply.',
    ),
    p(
      'Inquiry and project records are kept for as long as needed to answer the inquiry, carry out the work, and meet ordinary legal or accounting recordkeeping. Google Analytics data and Meta advertising data are kept for the period set in those accounts and under Google’s and Meta’s own rules. Browser preference storage stays on the device until you clear it.',
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
      `To make a privacy request, use the ${link('/contact', 'Contact page')} or write to ${link(`mailto:${PRIVACY_EMAIL}`, PRIVACY_EMAIL)}. We may need to confirm the request is legitimate before completing it.`,
    ),

    h2('16. Regional Privacy Information'),
    p(
      `${SITE_NAME} is a B2B manufacturing marketing website. Visitors may be in more than one country. The notes below state how the uses in this policy are treated. They do not claim a government registration that is not listed here.`,
    ),
    h3('European Economic Area and United Kingdom'),
    p(
      'For visits from the EEA or the United Kingdom, answering an inquiry and doing the requested work is a step toward a contract or performance of a contract. Running, securing, and hosting the site is a legitimate interest. Google Analytics and Meta advertising cookies are used on the basis of consent where the law requires a choice before those cookies. No separate EU or UK representative is appointed on this page. Send privacy requests to the email above.',
    ),
    h3('Israel'),
    p(
      'The public contact number uses an Israeli country code. Israeli privacy law, including the Protection of Privacy Law, 5741-1981, related data-security regulations, and subsequent amendments, may be relevant. This subsection identifies that local framework for legal review. It does not claim that a particular registration, database, or compliance program has been completed.',
    ),
    h3('United States'),
    p(
      'Use of Google advertising features and the Meta Pixel can count as sharing personal information for cross-context advertising under some U.S. state laws, including the California Consumer Privacy Act as amended by the CPRA. We do not sell personal information for money. To limit advertising use, use the Google and Meta controls linked in sections 5 and 6, and the browser controls described above.',
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
    p('This policy was last updated on 23 October 2026.'),
    p(
      'The presence of a last-updated field does not mean that a lawyer has completed a formal legal review on that date.',
    ),

    h2('20. Contact Information'),
    htmlP(
      `For privacy questions or requests, contact ${escapeHtml(ORGANIZATION_NAME)} at ${link(`mailto:${PRIVACY_EMAIL}`, PRIVACY_EMAIL)}, through the ${link('/contact', 'Contact page')}, or by WhatsApp at ${escapeHtml(contact.displayPhone)}.`,
    ),
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
