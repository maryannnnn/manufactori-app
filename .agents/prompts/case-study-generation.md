# Case Study generation

How to turn supplied client material into a complete Case Study in this project.

The output is **Payload data**, never React. Every section below maps to fields that
already exist on the `case-studies` collection or to a block in its `layout`. If a
field does not exist, find the existing one that fits — do not add fields.

Reference implementation: `src/scripts/importLaserMadeCaseStudy.ts` (core content) and
`src/scripts/updateLaserMadeFaqAndDiscussion.ts` (FAQ and discussion).

## Ground rules

- **No invented facts.** Results, technologies, client names, numbers and claims come
  from the supplied material. Where the source hedges a figure ("roughly", "per one
  comment"), keep the hedge. Where the source is silent, say so rather than filling
  the gap — `"The source data does not detail …"` is an acceptable, and often the
  correct, sentence.
- **No fabricated outcomes.** Do not convert activity into a percentage. "Hundreds of
  keywords reached top positions" is reportable; "+240% traffic" is not, unless the
  source says it.
- **Brand names, not domains.** Write `Laser Made`, not `lasermade.ru`. The `.ru`
  suffix is obsolete. Real URLs, links and email addresses are left alone.
- **Case study content, not a blog article.** The register is a documented engagement
  write-up: specific, technical, and willing to state limits.

## Structure to produce

Collection fields: `title`, `case_study_long_title`, `slug`, `featured`,
`displayOrder`, `duration`, `manufacturingProfile`, `businessChallenge`,
`nicheSegmentation`, `digitalEcosystem`, `websiteArchitecture`,
`semanticArchitecture`, `marketingStrategy` (including `paidAdvertising` and
`socialMedia`), `aiSearchOptimization`, `implementationProcess`, `timeline`,
`resultsSummary`, `metrics`, `projectsShowcase`, `expertInsight`,
`clientTestimonial`, `hero`, `meta`.

Taxonomy: `primary_case_study_category` (drives the URL) plus
`case_study_categories`. **Do not set `site_categories`** — it belongs to the hidden
site-wide taxonomy and is not editorial case study categorization.

`layout` blocks, in order: `csPreview`, then the narrative as alternating
`csContentTitle` / `csContent` pairs, then `csFAQ`, then `csComments`, then `cta`.

## FAQ — required

Produce **about 5** questions in the `csFAQ` block:

- `case_study_faq_title`: `Frequently Asked Questions About {Client}`.
- `items[]`: `question` (text) and `answer` (rich text). Each item renders as one
  accordion row, so one question per item — never a list of Q&As inside a single
  rich text field.

Questions must be answerable **from this case study** and worth a professional's
time. Aim at the decisions the engagement actually made, for example:

- how a wide production catalogue was divided without an unusable navigation
- why the digital structure was split (or not) across audiences or platforms
- what the semantic architecture bought, in concrete terms
- where qualified B2B enquiries actually came from
- search and AI-search visibility — including, where true, that no AI-search result
  was measured

Reject generic questions ("Why is SEO important?", "How much does a website cost?")
and anything whose answer is not in the source.

## Expert discussion — required

Produce **about 25** entries in the `csComments` block:

- `case_study_comment_title`: `Expert Discussion: {Client}`.
- `comments[]`: `author`, `role`, `date`, `depth`, `isExpert`, `body` (rich text).

The list is stored flat, but it must be a **real tree**. `depth` is the parent/reply
relationship, not a visual indent:

- `depth` 0 starts a new independent top-level branch.
- `depth` N replies to the nearest preceding entry at depth N-1.
- Depth is capped at 3 in the schema. Do not emit a deeper value.

The frontend (`buildCommentTree`) turns this into branches. If you emit 25 entries
at depth 0, they are 25 unrelated comments — that is a failed generation.

Shape of a good discussion:

- **6–8 top-level branches**, not one long chain and not 25 roots. Each branch is
  a distinct professional vantage point (technical SEO, PPC, B2B demand generation,
  web development, content strategy, performance, an in-house manufacturing
  marketer, an export manager). Give each a real `role`.
- Vary the shape. Do not stamp `question → reply → reply` onto every branch.
  Some branches stop after one expert answer. Some have a follow-up. A few go to
  depth 3. One or two may have two siblings at the same depth (two replies to the
  same parent) rather than a single line.
- Expert replies (`isExpert: true`) are attributed to the configured expert —
  currently **Maryan Polyak**, role **Manufacturing Digital Marketing & Web
  Development Expert**. Invent no further credentials. Not every entry is his;
  other people ask, he answers where an expert answer belongs.
- Dates in ascending order, spread over a few weeks.

Subject matter, chosen to fit the specific case: manufacturing website architecture,
segmentation of production services, SEO and semantic architecture, industrial
keyword strategy, B2B lead generation and conversion architecture, manufacturing PPC
and Google Ads, multilingual sites, technical SEO and performance, AI and generative
search visibility, authority and trust, case-study-driven marketing, and how
production capability maps onto information architecture.

What makes the expert replies credible is willingness to limit the claim. Good
patterns from the Laser Made discussion:

- declining to generalise a single A/B test into a rule
- answering a multilingual question by saying the engagement was single-language, and
  offering only the sequencing risk that does transfer
- answering an AI-search question by stating plainly that nothing was measured, then
  explaining what groundwork exists

Never produce praise-only comments ("Great article!", "Very interesting", "Thanks for
sharing"). Every entry either asks something specific or answers something specific.

## Applying it

Write a script under `src/scripts/`, following
`updateLaserMadeFaqAndDiscussion.ts`:

- rich text via `generateJSON(html, getTiptapExtensions(...))`
- a `--dry` mode that reports counts before writing
- rebuild the `csFAQ` / `csComments` blocks instead of appending, so re-running does
  not duplicate them
- `context: { disableRevalidate: true }` — `revalidateTag` needs a Next.js request
  context that a CLI script does not have
- update the existing record by `slug`; never create a second one for the same client

Schema is applied by hand because `push` is `false`. The FAQ and discussion array
tables already exist (`npm run db:cs-faq-comments`); new fields need their own script.
