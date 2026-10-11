import 'dotenv/config'
import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * Sets stored Case Study comment titles to "Comments".
 * Public rendering already ignores this field; this keeps admin labels aligned.
 */
const main = async () => {
  const payload = await getPayload({ config })
  const caseStudies = await payload.find({
    collection: 'case-studies',
    depth: 0,
    limit: 50,
    pagination: false,
    overrideAccess: true,
  })

  for (const doc of caseStudies.docs) {
    const layout = [...(doc.layout ?? [])]
    let changed = false
    for (const block of layout) {
      if (block.blockType === 'csComments' && block.case_study_comment_title !== 'Comments') {
        block.case_study_comment_title = 'Comments'
        changed = true
      }
    }
    if (!changed) {
      console.log(`unchanged ${doc.slug}`)
      continue
    }
    await payload.update({
      collection: 'case-studies',
      id: doc.id,
      data: { layout },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    console.log(`updated ${doc.slug}`)
  }

  process.exit(0)
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
