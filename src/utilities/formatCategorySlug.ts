/**
 * Same algorithm as Payload's built-in slugField slugify
 * (`payload/dist/utilities/slugify.js`).
 */
export const formatCategorySlug = (value: string): string =>
  value.trim().replace(/ /g, '-').replace(/[^\w-]+/g, '').toLowerCase()
