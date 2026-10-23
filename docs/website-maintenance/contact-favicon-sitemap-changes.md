# Contact, favicon, and sitemap

Checked 2026-10-23 on branch `main` at commit `c187a4a`. This pass did not change application source, CMS content, routes, or URLs. The requested behavior was already in the working site. Unrelated uncommitted files (AI-search changelog and `src/scripts/applyGeoAeoLanguage.ts`) were left untouched and were not committed.

## Original behavior already in place

- Shared destinations live in `src/config/contact.ts`: display phone `+972538974802`, WhatsApp number `972538974802`, and the default message `Hello, I would like to discuss digital marketing for my manufacturing business.`
- WhatsApp click-to-chat is `https://wa.me/972538974802?text=` plus that message, URL-encoded. Footer WhatsApp is empty in the CMS global, so the footer uses this same URL.
- Telegram destination already stored on the footer global is `https://t.me/+972538974802`. Reusable contact strips use the same URL. Phone-style Telegram links do not add a `?text=` parameter.
- The header phone icon is a link to `/contact` with the accessible name `Contact us`. It is not a `tel:` link. The footer phone icon remains `tel:+972538974802`.
- The Contact page (CMS slug `contact`, published) uses the heading `Contact & Global Operations`, the business email `mailto:info@neo-lines.com`, the specified introduction, and the contact strip heading `Have a Question About Your Project?`. There is no booking calendar.
- Favicon artwork is `public/favicon.svg`: a navy square (`#144372`) with a white capital N. `layout.tsx` points the document icon link and metadata icons at that file.
- Audit on 2026-10-23 found that `public/favicon.ico` was still the 29 July 2026 website-template icon (15,086 bytes) and was being served at `/favicon.ico`. It was replaced with a 16/32/48 PNG-in-ICO rendition of the same N. The template file is kept at `public/favicon.ico.template-original` inside the backup folder.
- `/sitemap.xml` is an index of `/pages-sitemap.xml`, `/posts-sitemap.xml`, `/services-sitemap.xml`, and `/case-studies-sitemap.xml`. Entries use `getServerSideURL()`. `lastmod` is included only when a CMS `updatedAt` exists. There is no `priority` or `changefreq`.
- The HTML sitemap is the CMS page `/sitemap`. It lists titles and public routes. The old irrelevant entry was the draft test page `image-editor-check`, which is unpublished and excluded from both sitemaps. Media URLs are rejected in `getHtmlSitemapData`.

## VKontakte

No verified agency VKontakte profile or community URL exists in source, footer channels, or contact configuration. The only mention is historical case-study copy about a client's own channels. No VK icon or `vk.com` link was added. A real profile URL is required before one can be wired in. Do not use the generic VK homepage.

Footer channels that do exist: LinkedIn, Facebook, WhatsApp (shared number), Telegram (the `t.me` phone URL), and phone (`tel:`). Email in the footer global is empty; the Contact page carries `info@neo-lines.com`.

## Files that already implement this

- `src/config/contact.ts`
- `src/Header/Nav/PhoneLink.tsx`
- `src/Header/navigation.ts`
- `src/Footer/resolveChannelHref.ts`
- `src/Footer/Channels.tsx`
- `src/components/ContactStrip/index.tsx`
- `src/components/ContactStrip/copy.ts`
- `src/app/(frontend)/[slug]/page.tsx` (contact strip when the slug is `contact`)
- `src/scripts/updateContactPage.ts` (already applied; Contact page published, `image-editor-check` left as draft)
- `public/favicon.svg`
- `src/app/(frontend)/layout.tsx`
- `src/app/sitemap.xml/route.ts`
- `src/app/(frontend)/(sitemaps)/*-sitemap.xml/route.ts`
- `src/utilities/activeCategoryPaths.ts`
- `src/utilities/getHtmlSitemapData.ts`
- `src/components/HtmlSitemap/index.tsx`
- `src/app/robots.ts`
- `src/utilities/siteRobots.ts`
- `src/utilities/getURL.ts`

## Decisions left as they were

- Local `NEXT_PUBLIC_SERVER_URL` is `http://localhost:3000`. On this machine `robots.txt` disallows `/` and does not print a Sitemap line, because indexing is enabled only when `SITE_INDEXING=true` or `VERCEL_ENV=production`. In production, `robots.ts` adds `Sitemap: ${getServerSideURL()}/sitemap.xml` and allows `/` while disallowing `/admin/`, `/api/`, and `/search`. No production domain was hardcoded, and no extra Disallow rules were added.
- XML category URLs are real public archives that have at least one published post or case study. Industrial filter query strings are not listed. Case Study Categories were not merged with Site Categories.
- This pass did not rewrite About, services, case studies, or blog posts.

## Validation on http://localhost:3000

Checked by HTTP against the already running dev server. Not a production deploy.

| Check | Result |
| --- | --- |
| `/contact` | 200. Heading, Business Inquiries, `mailto:info@neo-lines.com`, introduction, and the WhatsApp/Telegram strip are present. No Calendly or booking CTA. |
| Header phone | Two anchors (desktop and mobile markup), both `href="/contact"` and `aria-label="Contact us"`. |
| WhatsApp | `https://wa.me/972538974802?text=Hello, I would like to discuss digital marketing for my manufacturing business.` |
| Telegram | `https://t.me/+972538974802` |
| VKontakte | No `vk.com` link. |
| `/favicon.svg` | 200, `image/svg+xml`, the N mark. |
| `/favicon.ico` | Was the template icon. After the replacement, 200, 1,558 bytes, the same N. |
| `/sitemap.xml` | 200, XML sitemap index. Child sitemaps have no `image-editor`, `priority`, or `changefreq`. Local host is localhost, which matches `getServerSideURL()`. |
| `/sitemap` | 200. Human titles for home, about, clients, services, case studies, blog, and contact. No media file links and no image-editor entry. |
| `/robots.txt` | 200. Local noindex policy only. Sitemap line appears in production when indexing is on. |

Not verified: a click-through in a real browser at desktop and mobile widths. The browser tool was unavailable (`cursor-ide-browser` server not found). A production build and a fresh typecheck were not run, because this pass did not change application code. Production `robots.txt` and the production sitemap host were not requested from the live domain.

## Backup

`docs/website-maintenance/backups/2026-10-23-contact-favicon-sitemap/`

23 source files, copied without overwriting `docs/ai-search-repositioning/backups/`.

## Recovery

Do not `git reset`, `git checkout`, or `git clean` the whole tree. Unrelated uncommitted work may be present.

To put these contact, favicon, and sitemap files back to this snapshot, copy each file from `docs/website-maintenance/backups/2026-10-23-contact-favicon-sitemap/` onto the same path in the project root. The Contact page body and the draft status of `image-editor-check` live in the database; `npx tsx src/scripts/updateContactPage.ts` republishes that contact copy and unpublishes the test page. Do not deploy as part of a rollback.
