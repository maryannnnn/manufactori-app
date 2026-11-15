/**
 * Ensures the primary CMS author profile matches AUTHOR_IDENTITY.
 * Run: npx tsx --tsconfig tsconfig.json src/scripts/syncAuthorIdentity.mts
 */
import 'dotenv/config'
import config from '@payload-config'
import { getPayload } from 'payload'
import { AUTHOR_IDENTITY } from '../utilities/authorIdentity'

const payload = await getPayload({ config })

const users = await payload.find({
  collection: 'users',
  depth: 0,
  limit: 20,
  overrideAccess: true,
})

let updated = 0
for (const user of users.docs) {
  const name = (user.name || '').trim()
  if (name && name !== AUTHOR_IDENTITY.name) continue

  const needsUpdate =
    user.name !== AUTHOR_IDENTITY.name ||
    user.jobTitle !== AUTHOR_IDENTITY.jobTitle ||
    user.professionalFocus !== AUTHOR_IDENTITY.professionalFocus

  if (!needsUpdate) {
    console.log(`OK user ${user.id}: ${user.name}`)
    continue
  }

  await payload.update({
    collection: 'users',
    id: user.id,
    overrideAccess: true,
    data: {
      name: AUTHOR_IDENTITY.name,
      jobTitle: AUTHOR_IDENTITY.jobTitle,
      professionalFocus: AUTHOR_IDENTITY.professionalFocus,
    },
  })
  updated += 1
  console.log(`Updated user ${user.id} to AUTHOR_IDENTITY`)
}

if (updated === 0 && users.docs.length) {
  const first = users.docs[0]!
  if (first.name !== AUTHOR_IDENTITY.name) {
    await payload.update({
      collection: 'users',
      id: first.id,
      overrideAccess: true,
      data: {
        name: AUTHOR_IDENTITY.name,
        jobTitle: AUTHOR_IDENTITY.jobTitle,
        professionalFocus: AUTHOR_IDENTITY.professionalFocus,
      },
    })
    console.log(`Forced user ${first.id} to AUTHOR_IDENTITY`)
    updated += 1
  }
}

console.log(`Done. Updated ${updated} user(s).`)
process.exit(0)
