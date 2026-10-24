import 'dotenv/config'

import config from '@payload-config'
import { getPayload } from 'payload'

const POSITION = 'Founder and Director'

const people = [
  { slug: 'testimonial-laser-made', clientName: 'Mila Laser Made' },
  { slug: 'testimonial-pnevmomachta', clientName: 'Henrik Pnevmomachta' },
  { slug: 'testimonial-merkan-invest-stroy', clientName: 'Leon Merkan Invest Stroy' },
  { slug: 'testimonial-aleks-sf', clientName: 'Freya Aleks SF' },
  { slug: 'testimonial-alumatrix', clientName: 'Nico Alumatrix' },
  { slug: 'testimonial-geotermal', clientName: 'Ines Geotermal' },
  { slug: 'testimonial-siblux', clientName: 'Oscar Siblux' },
  { slug: 'testimonial-areks', clientName: 'Lina AREKS' },
  { slug: 'testimonial-ivicom', clientName: 'Hugo Ivicom' },
]

const run = async () => {
  const payload = await getPayload({ config })

  for (const person of people) {
    const found = await payload.find({
      collection: 'testimonials',
      depth: 0,
      draft: false,
      limit: 1,
      overrideAccess: true,
      where: { slug: { equals: person.slug } },
      select: { id: true, slug: true },
    })
    const doc = found.docs[0]
    if (!doc) throw new Error(`Missing testimonial ${person.slug}`)

    await payload.update({
      collection: 'testimonials',
      id: doc.id,
      draft: false,
      overrideAccess: true,
      context: { disableRevalidate: true },
      data: {
        clientName: person.clientName,
        clientPosition: POSITION,
      },
    })
    payload.logger.info(`${person.slug} ${person.clientName} / ${POSITION}`)
  }

  process.exit(0)
}

void run().catch((error) => {
  console.error(error)
  process.exit(1)
})
