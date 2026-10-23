# AI Search repositioning

Phase Two started on 2026-10-23 as a careful tilt. See `content-change-log.md` for what was edited. The backup in `backups/2026-10-22-baseline/` is still the rollback source and was not overwritten.

## Objective

Present the existing manufacturing marketing practice as one strategy: traditional SEO, website structure, and technical content remain the foundation, and AI-powered search is an extension of how that information is retrieved, interpreted, summarized, and sometimes cited.

The site must not say that SEO has been replaced, that every AI product works the same way, or that a system is obliged to cite original data. Information gain is a content principle here, not a public score.

## Current state

The public site is already a manufacturing B2B site: home, about, seven services, 24 case studies, a clients directory, and seven published articles. English only.

The newest service, "AI Search Optimization & Content Engineering for Manufacturers", is the closest to the intended position. It treats technical SEO as the foundation and does not promise citations.

The older service "SEO & AI Search Optimization" and the technical-content service still read as if presence in ChatGPT, Perplexity, or AI Overviews is the offer. Their meta descriptions say the work gets the company found there, or that AI systems cite the content.

Case studies are historically careful in the body copy. They say the work was SEO, websites, content, and sometimes PPC, and they deny AI-search results. The template then files those paragraphs under an "AI Search" tag. Inside the cases, GEO means "not a local-search programme". On the service pages, GEO means Generative Engine Optimization. A technical reader can think the old projects were generative-engine campaigns.

The homepage does not mention AI-powered search. It also shows six services. The seventh, the content-engineering service, is stored at `displayOrder` 7 and `HOME_SERVICES_LIMIT` is 6, so the homepage hides it. The services overview shows all seven.

About describes production lines, site structure, SEO, ads, content, and links. It does not yet explain how that experience relates to AI-powered search. It does not state a number of years.

There is no Industries section. Case-study category archives exist. They are not industry marketing pages, and this plan does not create any.

## Positioning gaps

1. The homepage sells a connected manufacturing system and never says that the same system now has to be readable to AI-powered search.
2. Two services overlap, and the older one overclaims AI visibility.
3. Technical content says AI systems decide what to cite. That mechanism is not established, and citation is not guaranteed.
4. Historical cases are labeled as AI Search in the interface while the text says they were not.
5. The acronym GEO means two different things on the same site.
6. The strongest proof, measured SEO and PPC on real industrial and commercial projects, is not connected in a careful way to today's search. It should stay historical.

## Proposed strategy

Keep the current templates and URLs.

Use ordinary SEO language next to the newer language. On-page SEO, information architecture, technical content, and structured data are what make a manufacturing site ready for retrieval. Links, editorial mentions, and consistent company facts are different signals. One does not replace the other.

Do not add GEO as a shortcut service. Do not add an Information Gain Score. Do not promise rankings, citations, or leads.

On case studies, do not add a repeated AI paragraph. The existing entity notes are already the "what this demonstrates" text. The safe change is the public label, plus leaving the facts alone.

## What to edit first, after approval

1. Relabel the case-study accordion so historical work is not tagged "AI Search", and stop using GEO for geography on those pages.
2. Rewrite the overclaims on "SEO & AI Search Optimization" and "Technical Content & Thought Leadership".
3. Add one precise homepage passage, and decide whether all seven services appear there.
4. Add one About section on the continuity from SEO to AI-powered search. Publish "about 20 years" only if you confirm that public wording.
5. Add two sentences on the services overview.
6. Make small, non-GEO edits on the website, strategy, lead-generation, and CRM pages.
7. Leave individual case facts, metrics, and images unchanged.

## Questions that need an answer

1. Can About say that you have worked in SEO and digital marketing for about 20 years? That figure is not on the site. It comes from this brief.
2. Should the homepage show all 7 services, or stay at 6 and swap which service is last?
3. Keep both SEO services and differentiate them? The recommendation is to keep both: one is the search programme, the other is content engineering.
4. Approve relabeling the case accordion without rewriting the case records?
5. Approve removing the geographic use of "GEO" from case pages so the acronym is reserved for Generative Engine Optimization, spelled out?
6. Industry landing pages do not exist. This plan does not create them.

## Backup and technical limits

The working tree was dirty, so no branch and no commit were made. Recovery is described in `rollback-plan.md`.

CMS backup: `backups/2026-10-22-baseline/`. Page, service, and case-study documents are there. Post bodies and the testimonials collection are not. Do not start a blog rewrite from `posts.json`.

Structured data was inspected and should not gain new types for this repositioning. Existing FAQ and review schema stay tied to visible content.

Phase Two does not start until you approve the rows in `proposed-content-changes.csv`.
