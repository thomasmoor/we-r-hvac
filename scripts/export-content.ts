// Regenerates content/site.json from the local database (normally done automatically on save).
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { exportContent, CONTENT_FILE } from '../src/lib/exportContent'

const payload = await getPayload({ config })
await exportContent(payload)
payload.logger.info(`Wrote ${CONTENT_FILE}`)
process.exit(0)
