# Baseline inventory

Audit date: 2026-10-22. No content was edited.

## Repository

- Branch: `main`, aligned with `origin/main` at `7fee79c`.
- Dedicated branch `ai-search-repositioning`: not created.
- Reason: the working tree already contained unrelated uncommitted work. Committing it, stashing it, or branching as if it were a clean rollback point would have been misleading.
- Content location: Payload CMS on Postgres. Homepage, services overview, clients page, and blog archive intro are React source. Service pages and case studies are CMS records rendered by existing templates. About and Contact are CMS pages.

## Counts inspected

| Surface | Count | Source | Public route |
| --- | --- | --- | --- |
| Home | 1 | `src/components/Home/*`, `src/utilities/siteIdentity.ts`, plus the first 6 services and featured cases from Payload | `/` |
| About | 1 published | Pages, id 7 | `/about` |
| Services overview | 1 | `src/app/(frontend)/services/page.tsx`, cards from Payload | `/services` |
| Services | 7 published | Services ids 5, 6, 7, 8, 9, 10, 12 | `/services/{slug}` |
| Case studies | 24 published | Case studies ids 3–26 | `/case-studies/{primary-category}/{slug}` |
| Blog posts | 7 published, 1 empty draft | Posts. Full bodies were not exported. | `/blog/{category}/{slug}` |
| Clients | 1 | Code plus case-study list | `/clients` |
| Contact | 1 published | Pages, id 8 | `/contact` |
| Legal / utility | Sitemap, Privacy, Accessibility | Pages ids 11, 10, 9 | `/sitemap`, `/privacy-policy`, `/accessibility` |
| Industries | none | No Industries collection and no industry marketing routes | — |

Draft pages that are not public: id 6 `image-editor-check`, and id 5 with a null title and slug.

There is one locale, English. No localization routes were found.

## Services, in display order

| ID | Order | Status | Title | Slug |
| --- | --- | --- | --- | --- |
| 5 | 1 | published | Marketing Strategy & Roadmap | `marketing-strategy-roadmap` |
| 6 | 2 | published | Website Design & Development for Manufacturers | `website-design-development-for-manufacturers` |
| 7 | 3 | published | SEO & AI Search Optimization | `seo-ai-search-optimization` |
| 8 | 4 | published | Technical Content & Thought Leadership | `technical-content-thought-leadership` |
| 9 | 5 | published | Lead Generation | `lead-generation` |
| 10 | 6 | published | Sales Enablement & CRM | `sales-enablement-crm` |
| 12 | 7 | published | AI Search Optimization & Content Engineering for Manufacturers | `ai-search-optimization-manufacturers` |

`HOME_SERVICES_LIMIT` is 6, sorted by `displayOrder`. The homepage therefore omits service 12. The services overview loads all published services.

## Case studies

All 24 are published. Primary category, slug, and whether the record already contains measured metrics are listed in `proposed-content-changes.csv`.

Every inspected case already has `aiSearchOptimization.brandAuthorityAndTrust` and `entityAndGeoStructure` filled. The text says the project was not an AI-search engagement. The public accordion still labels those blocks with the tag "AI Search", and the CMS group is named "AI Search Optimization (GEO & AEO)". In the case text, "GEO" is used to mean a geographic or local-search programme. On the service pages, GEO means Generative Engine Optimization. That collision is a credibility problem. It is not a reason to rewrite the project history.

Case Study Categories and hidden Site Categories were not merged, renamed, or reassigned. Cases carry large category sets. Those relationships stay as they are.

## Blog, inspected and not proposed for rewriting

Published:

- `manufacturing-content-distribution-ai-search-zero-click`
- `manufacturing-first-party-data-information-gain`
- `manufacturing-ai-outreach-brand-mentions-entity-visibility`
- `manufacturing-content-engineering-semantic-chunking`
- `linkedin-b2b-manufacturing`
- `google-ads-for-manufacturers`
- `ai-search-optimization-b2b-geo`

Draft post id 8 has no title or slug. `posts.json` stores inventory fields only, not article HTML.

## Metadata and structured data

- Titles and descriptions exist for the homepage, services, cases, About, and blog posts.
- Several service meta titles already contain "Maryan Polyak". The site helper appends "Manufacturing Marketing Agency" only when that personal name is absent, so those titles are not doubled.
- Canonicals follow the current routes. This audit does not change slugs.
- JSON-LD already emits `WebPage`, `Service`, breadcrumbs, `FAQPage` when FAQ items exist, and `Review` only when a testimonial has both a quote and an author. No new schema type is proposed.
- The case-study admin help text still names ChatGPT, Perplexity, Gemini, and Google SGE. SGE is an outdated product name. That string is admin-only.

## Backup

`backups/2026-10-22-baseline/` holds `pages.json`, `services.json`, `case-studies.json`, `posts.json`, and `digest.txt`. Upload objects are reduced to id, filename, and alt. No credentials are included.

## Incomplete records

- Post bodies are not in the backup.
- Testimonials were not exported.
- Page id 5 is an empty draft.
- `digest.txt` is a shortened reading copy. Restore from the JSON files, not from the digest.
