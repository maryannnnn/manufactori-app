import 'dotenv/config'
import pg from 'pg'
import config from '@payload-config'
import { getPayload } from 'payload'

import { buildCommentTree, measureCommentTree } from '../blocks/CaseStudyCommentsBlock/buildCommentTree'

const main = async () => {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
  const tables = await pool.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND (
        table_name ILIKE '%comment%'
        OR table_name ILIKE '%post_com%'
        OR table_name ILIKE '%posts_blocks%'
      )
    ORDER BY table_name
  `)
  console.log('Tables:')
  for (const row of tables.rows) console.log(`  ${row.table_name}`)

  const payload = await getPayload({ config })

  const caseStudies = await payload.find({
    collection: 'case-studies',
    depth: 0,
    limit: 50,
    pagination: false,
    overrideAccess: true,
  })

  console.log(`\nCase studies: ${caseStudies.docs.length}`)
  for (const doc of caseStudies.docs) {
    const blocks = (doc.layout ?? []).filter((block) => block.blockType === 'csComments')
    console.log(`\n  ${doc.slug}`)
    if (blocks.length === 0) {
      console.log('    no csComments block')
      continue
    }
    for (const block of blocks) {
      const comments = block.comments ?? []
      const tree = buildCommentTree(comments)
      const measure = measureCommentTree(tree)
      console.log(`    title: ${JSON.stringify(block.case_study_comment_title)}`)
      console.log(`    entries=${comments.length} top=${measure.topLevel} maxDepth=${measure.maxDepth}`)
      for (const root of tree) {
        const expert = root.children.filter((child) => child.isExpert).length
        console.log(
          `      - ${root.author} (d0 expert=${Boolean(root.isExpert)}) replies=${root.children.length} expertKids=${expert}`,
        )
      }
    }
  }

  const posts = await payload.find({
    collection: 'posts',
    depth: 0,
    limit: 20,
    pagination: false,
    overrideAccess: true,
    where: {
      slug: {
        in: [
          'ai-search-optimization-b2b-geo',
          'google-ads-for-manufacturers',
          'linkedin-b2b-manufacturing',
        ],
      },
    },
  })

  console.log(`\nTarget posts: ${posts.docs.length}`)
  for (const doc of posts.docs) {
    const types = (doc.layout ?? []).map((block) => block.blockType)
    const comments = (doc.layout ?? []).filter((block) => block.blockType === 'postCommentsBlock')
    console.log(`  ${doc.slug} id=${doc.id} blocks=${types.join(', ')} commentBlocks=${comments.length}`)
    for (const block of comments) {
      const entries = block.comments ?? []
      const tree = buildCommentTree(entries)
      const measure = measureCommentTree(tree)
      console.log(`    entries=${entries.length} top=${measure.topLevel} maxDepth=${measure.maxDepth}`)
      for (const root of tree) {
        const expert = root.children.filter((child) => child.isExpert).length
        console.log(
          `      - ${root.author} (d0 expert=${Boolean(root.isExpert)}) replies=${root.children.length} expertKids=${expert}`,
        )
      }
    }
  }

  await pool.end()
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
