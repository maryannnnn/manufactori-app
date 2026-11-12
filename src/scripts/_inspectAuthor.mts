import 'dotenv/config'
import config from '@payload-config'
import { getPayload } from 'payload'

const payload = await getPayload({ config })
const user = await payload.findByID({
  collection: 'users',
  id: 1,
  depth: 0,
  overrideAccess: true,
})
console.log('USER_KEYS', Object.keys(user))
console.log(
  JSON.stringify(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      ...(user as Record<string, unknown>),
    },
    null,
    2,
  ),
)

const posts = await payload.find({
  collection: 'posts',
  depth: 1,
  limit: 100,
  overrideAccess: true,
  pagination: false,
  where: { _status: { equals: 'published' } },
  select: {
    slug: true,
    title: true,
    authors: true,
    populatedAuthors: true,
    primary_category: true,
  },
})
console.log('POST_COUNT', posts.docs.length)
for (const doc of posts.docs) {
  const authors = doc.populatedAuthors || doc.authors
  console.log(
    JSON.stringify({
      id: doc.id,
      slug: doc.slug,
      authors,
    }),
  )
}
process.exit(0)
