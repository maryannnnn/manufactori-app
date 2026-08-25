/**
 * Full case-studies DDL extractor (legacy).
 *
 * Schema for this environment was applied from a Payload migrate:create dump,
 * then cleaned up. Current DB already has `cs` / `_cs*` tables.
 *
 * To re-apply on a fresh database:
 * 1. Temporarily set `db.push: true` in payload.config.ts and start the app once, OR
 * 2. Run `npx payload migrate:create` after CaseStudies is registered and extract
 *    only `cs` / `_cs*` / `enum_cs*` / `cs_id` statements (see prior chat notes), OR
 * 3. Run `src/scripts/applyCaseStudiesRelsFinish.ts` after core tables exist.
 *
 * Do not reintroduce a full-database dump migration into `src/migrations/`.
 */
console.error(
  'applyCaseStudiesExtractedSql.ts is retired. Core schema is already on the DB; use applyCaseStudiesRelsFinish.ts for shared rel columns only.',
)
process.exit(1)
