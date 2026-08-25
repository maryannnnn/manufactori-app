import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Initializes Payload with push:true so drizzle creates/updates case-studies tables.
 */
const pushSchema = async () => {
  const payload = await getPayload({ config })
  payload.logger.info('Payload initialized — schema push should be complete for case-studies')
  process.exit(0)
}

void pushSchema().catch((error) => {
  console.error(error)
  process.exit(1)
})
