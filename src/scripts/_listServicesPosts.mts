import 'dotenv/config'
import config from '@payload-config'
import { getPayload } from 'payload'

const run = async () => {
  const payload = await getPayload({ config })
  const services = await payload.find({
    collection: 'services',
    depth: 0,
    limit: 200,
    pagination: false,
    where: { _status: { equals: 'published' } },
  })
  const posts = await payload.find({
    collection: 'posts',
    depth: 0,
    limit: 100,
    pagination: false,
    where: { _status: { equals: 'published' } },
  })
  console.log('SERVICES')
  console.log(services.docs.map((d) => d.slug).sort().join('\n'))
  console.log('POSTS')
  console.log(posts.docs.map((d) => d.slug).sort().join('\n'))
  process.exit(0)
}

void run()
