# Rollback plan

No repositioning edit has been applied. This plan is the recovery procedure if Phase Two is later approved and then needs to be undone.

## Do not use a blanket Git reset

On 2026-10-22 the branch was `main`, tracking `origin/main`, at commit `7fee79c` (`dded chaged`). The working tree was already dirty with unrelated local work: contact page, messenger links, favicon, sitemap routes, the AI-search service script, four blog articles, and their media.

The branch `ai-search-repositioning` was not created. Creating it, or committing those files, would have mixed an unrelated rollback point into this audit.

Do not run `git reset`, `git checkout .`, `git clean`, `git stash`, or `git revert` against the whole tree. Those commands would discard or hide the pre-existing local work.

## Source files

Homepage and archive copy that is stored in the repository, not in Payload, includes:

- `src/utilities/siteIdentity.ts`
- `src/components/Home/Hero.tsx`
- `src/components/Home/Problems.tsx`
- `src/components/Home/Process.tsx`
- `src/components/Home/Services.tsx`
- `src/components/Home/FinalCta.tsx`
- `src/utilities/getHomePageData.ts` (`HOME_SERVICES_LIMIT`)
- `src/app/(frontend)/services/page.tsx`
- `src/components/CaseStudyPage/index.tsx` (the public "AI Search" accordion label)
- `src/collections/CaseStudies/fields/structuredCaseStudyFields.ts` (admin labels only)

Before Phase Two changes any of these, copy the current file into a new dated folder under `docs/ai-search-repositioning/backups/`. After that, restore only the named file from that copy or from the commit that contained it. Do not restore unrelated dirty files.

## CMS records

Page, service, and case-study text lives in the Payload Postgres database. A Git commit does not restore it.

The recoverable export is:

`docs/ai-search-repositioning/backups/2026-10-22-baseline/`

| File | What it can restore |
| --- | --- |
| `pages.json` | Full page documents, including About, with upload fields reduced to id, filename, and alt. |
| `services.json` | Full service documents, same media reduction. |
| `case-studies.json` | Full case-study documents, including metrics, categories, and the existing AI-search fields. |
| `posts.json` | Post id, title, slug, status, date, meta, and categories only. It cannot restore article bodies. |
| `digest.txt` | A short reading aid. It is not a restore source. |

Media binaries were not exported. Relationships point at existing media ids.

To restore one CMS document after a future edit:

1. Stop and record the bad edit in `content-change-log.md`.
2. Read the matching object from the baseline JSON by numeric `id`.
3. Update that one Payload document with the baseline `data`, `draft: false`, the original `_status`, `overrideAccess: true`, and `context: { disableRevalidate: true }`.
4. Do not send a partial body that omits arrays such as categories, metrics, or layout. A partial update can drop relationships.
5. Revalidate only the affected public URL and confirm the title, metrics, and slug match the baseline.
6. Do not restore every collection in one script unless the whole batch must be undone.

`posts.json` must not be written back over a post. Blog articles are out of Phase Two unless a separate full-body export is made first.

## What this backup does not cover

- Environment variables, database credentials, and Vercel settings. They are intentionally absent.
- The uncommitted contact, favicon, sitemap, and blog-media work. Leave it untouched.
- Draft page id 5, which has no title or slug, and draft page id 6, `image-editor-check`.
- Testimonials as a full collection. Homepage testimonials were not part of this copy.
