# Blog article standards

Permanent requirements for every Blog / Posts article in this project.

## Author identification (required)

Every article must attribute **Maryan Polyak** with this exact public identity:

- **Name:** Maryan Polyak
- **Job title:** Manufacturing Marketing Specialist | SEO & AI Search
- **Professional focus:** Manufacturing & Industrial Digital Marketing

Do not use a general web developer title or another designation.

The public article template renders this block automatically at the end of the main
content (before FAQ / discussion). Populate the CMS user profile (`jobTitle`,
`professionalFocus`) with the same wording so the hero and BlogPosting structured
data stay consistent. Do not paste a second duplicate author block into the body.

## Layout blocks (required)

Typical `layout` order:

1. `postPreviewBlock`
2. Content (`postContentTitleBlock` / `postContentBlock` pairs)
3. `postFAQBlock` — about **5** Q&A pairs (h3 question + paragraph answer in rich text)
4. `postCommentsBlock` — editorial discussion, **not** fake customer reviews
5. Optional `cta`

## Discussion count

Use a **variable** number of discussion exchanges per article, generally **2 to 5**
buyer↔expert pairs (each pair is one depth-0 comment plus one expert reply). Do not
generate exactly two comments on every article. Represent configured authors clearly
(buyer editorial roles + Maryan Polyak as Manufacturing Expert for answers).

## FAQ

Exactly five FAQ items is the current editorial norm for industrial deep articles.
Answers must be grounded in the article.

## Categories

Set `primary_category` (URL) and supporting `categories` / `site_categories` so the
article can appear in Industrial topic feeds and Blog category activity chips.
