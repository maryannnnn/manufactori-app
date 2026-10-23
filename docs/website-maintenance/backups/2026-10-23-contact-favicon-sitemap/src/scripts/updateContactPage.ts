import 'dotenv/config'

import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'

import { getTiptapExtensions } from '../utilities/richText/extensions'

const rt = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [1, 2, 3, 4] }))

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const run = async () => {
  const payload = await getPayload({ config })

  const contact = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 1,
    pagination: false,
    overrideAccess: true,
    where: { slug: { equals: 'contact' } },
  })
  const contactDoc = contact.docs[0]
  if (!contactDoc) throw new Error('Contact page not found')

  await payload.update({
    collection: 'pages',
    id: contactDoc.id,
    draft: false,
    overrideAccess: true,
    context: { disableRevalidate: true },
    data: {
      title: 'Contact',
      pageLongTitle: 'Contact & Global Operations',
      generateSlug: false,
      _status: 'published',
      hero: {
        type: 'lowImpact',
        richText: rt(`<h1>${escapeHtml('Contact & Global Operations')}</h1>`),
      },
      layout: [
        {
          blockType: 'content',
          columns: [
            {
              size: 'full',
              richText: rt(
                `<h2>${escapeHtml('Business Inquiries')}</h2>` +
                  `<p><a href="mailto:info@neo-lines.com">info@neo-lines.com</a></p>` +
                  `<h2>${escapeHtml('International Communication')}</h2>` +
                  `<p>${escapeHtml('Tell us about your products, markets, or marketing goals. Whether you need help with your website, SEO, technical content, or lead generation, you can contact us directly using your preferred messaging app.')}</p>`,
              ),
            },
          ],
        },
      ],
      meta: {
        title: 'Contact',
        description:
          'Contact the manufacturing marketing agency by email, WhatsApp, or Telegram. No appointment is required.',
      },
    },
  })
  payload.logger.info('Updated contact page')

  const imagePage = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 1,
    pagination: false,
    overrideAccess: true,
    where: { slug: { equals: 'image-editor-check' } },
  })
  const imageDoc = imagePage.docs[0]
  if (imageDoc && imageDoc._status === 'published') {
    await payload.update({
      collection: 'pages',
      id: imageDoc.id,
      draft: false,
      overrideAccess: true,
      context: { disableRevalidate: true },
      data: { _status: 'draft' },
    })
    payload.logger.info('Unpublished image-editor-check page')
  }

  process.exit(0)
}

void run().catch((error) => {
  console.error(error)
  process.exit(1)
})
