import config from '@payload-config'
import { getPayload } from 'payload'

import {
  BLOG_ARCHIVE_PATH,
  CASE_STUDIES_ARCHIVE_PATH,
  getCaseStudyUrl,
  getPostUrl,
  getServiceUrl,
  SERVICES_ARCHIVE_PATH,
} from '@/utilities/getContentUrls'
import { getServerSideURL } from '@/utilities/getURL'
import { ORGANIZATION_DESCRIPTION, ORGANIZATION_NAME, SITE_NAME } from '@/utilities/siteIdentity'

export async function GET() {
  const base = getServerSideURL()
  const payload = await getPayload({ config })

  const [services, caseStudies, posts] = await Promise.all([
    payload.find({
      collection: 'services',
      draft: false,
      limit: 50,
      overrideAccess: false,
      pagination: false,
      select: { title: true, slug: true },
      sort: ['displayOrder', 'title'],
      where: { _status: { equals: 'published' } },
    }),
    payload.find({
      collection: 'case-studies',
      depth: 1,
      draft: false,
      limit: 50,
      overrideAccess: false,
      pagination: false,
      select: { title: true, slug: true, primary_case_study_category: true },
      sort: ['displayOrder', 'title'],
      where: { _status: { equals: 'published' } },
    }),
    payload.find({
      collection: 'posts',
      depth: 1,
      draft: false,
      limit: 50,
      overrideAccess: false,
      pagination: false,
      select: { title: true, slug: true, primary_category: true },
      sort: '-publishedAt',
      where: { _status: { equals: 'published' } },
    }),
  ])

  const serviceLines = services.docs.flatMap((doc) => {
    const path = getServiceUrl(doc)
    return path ? [`- [${doc.title}](${base}${path})`] : []
  })
  const caseStudyLines = caseStudies.docs.flatMap((doc) => {
    const path = getCaseStudyUrl(doc)
    return path ? [`- [${doc.title}](${base}${path})`] : []
  })
  const postLines = posts.docs.flatMap((doc) => {
    const path = getPostUrl(doc)
    return path ? [`- [${doc.title}](${base}${path})`] : []
  })

  const body = [
    `# ${ORGANIZATION_NAME} — ${SITE_NAME}`,
    '',
    `> ${ORGANIZATION_DESCRIPTION}`,
    '',
    '## Site',
    `- [Home](${base}/)`,
    `- [Services](${base}${SERVICES_ARCHIVE_PATH})`,
    `- [Case Studies](${base}${CASE_STUDIES_ARCHIVE_PATH})`,
    `- [Blog](${base}${BLOG_ARCHIVE_PATH})`,
    `- [About](${base}/about)`,
    `- [Contact](${base}/contact)`,
    '',
    '## Services',
    ...serviceLines,
    '',
    '## Case Studies',
    ...caseStudyLines,
    '',
    '## Blog',
    ...postLines,
    '',
  ]
    .filter((item) => item !== null)
    .join('\n')

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
