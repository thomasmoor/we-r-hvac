/**
 * Loads the initial content into the local SQLite database and writes content/site.json.
 *   npm run seed            -> only if the database has no services yet
 *   npm run seed -- --force -> wipe services, areas and media, then reseed
 */
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { exportContent } from '../src/lib/exportContent'
import * as data from '../src/seed/data'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const IMAGES = path.resolve(dirname, '../seed-images')
const force = process.argv.includes('--force')
const context = { skipExport: true }

const payload = await getPayload({ config })

const existing = await payload.count({ collection: 'services' })
if (existing.totalDocs > 0 && !force) {
  payload.logger.info('Services already exist — nothing seeded. Use "npm run seed -- --force" to reseed.')
  await exportContent(payload)
  process.exit(0)
}

if (force) {
  for (const collection of ['services', 'service-areas', 'media'] as const) {
    await payload.delete({ collection, where: { id: { exists: true } }, context })
  }
}

const upload = async (file: string, alt: string, credit?: string) =>
  payload.create({
    collection: 'media',
    data: { alt, credit },
    filePath: path.join(IMAGES, file),
    context,
  })

let order = 10
for (const s of data.services) {
  const media = await upload(s.image, s.imageAlt, s.credit)
  await payload.create({
    collection: 'services',
    context,
    data: {
      title: s.title,
      slug: s.slug,
      icon: s.icon as any,
      order,
      image: media.id,
      shortDescription: s.shortDescription,
      description: s.description,
      whyImportant: s.whyImportant,
      whatToExpect: s.whatToExpect,
      metaDescription: s.metaDescription,
    },
  })
  order += 10
  payload.logger.info(`service: ${s.title}`)
}

order = 10
for (const a of data.areas) {
  const media = await upload(a.image, a.imageAlt, a.credit)
  await payload.create({
    collection: 'service-areas',
    context,
    data: {
      name: a.name,
      slug: a.slug,
      state: 'CA',
      icon: a.icon as any,
      order,
      image: media.id,
      shortDescription: a.shortDescription,
      description: a.description,
      localNotes: a.localNotes.map((text) => ({ text })),
      metaDescription: a.metaDescription,
    },
  })
  order += 10
  payload.logger.info(`area: ${a.name}`)
}

const team = await upload(data.aboutImage.file, data.aboutImage.alt)
await payload.updateGlobal({ slug: 'site-settings', data: data.settings as any, context })
await payload.updateGlobal({ slug: 'home-page', data: data.home as any, context })
await payload.updateGlobal({ slug: 'about-page', data: { ...data.about, image: team.id } as any, context })

await exportContent(payload)
payload.logger.info('Seed complete — content/site.json written.')
process.exit(0)
