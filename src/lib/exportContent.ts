import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  Payload,
} from 'payload'
import type { Area, Img, Service, SiteData } from './siteTypes'

const dirname = path.dirname(fileURLToPath(import.meta.url))
export const CONTENT_FILE = path.resolve(dirname, '../../content/site.json')

type AnyDoc = Record<string, any>

const img = (m: unknown): Img => {
  if (!m || typeof m !== 'object') return null
  const d = m as AnyDoc
  if (!d.filename) return null
  return { src: `/media/${d.filename}`, alt: d.alt || '', width: d.width, height: d.height }
}

const s = (v: unknown) => (typeof v === 'string' ? v : '')

/** Reads everything the public site needs from Payload and writes content/site.json. */
export async function exportContent(payload: Payload): Promise<SiteData> {
  const [services, areas, settings, home, about] = await Promise.all([
    payload.find({ collection: 'services', limit: 200, sort: 'order', depth: 1 }),
    payload.find({ collection: 'service-areas', limit: 200, sort: 'order', depth: 1 }),
    payload.findGlobal({ slug: 'site-settings', depth: 0 }),
    payload.findGlobal({ slug: 'home-page', depth: 0 }),
    payload.findGlobal({ slug: 'about-page', depth: 1 }),
  ])
  const st = settings as AnyDoc
  const hm = home as AnyDoc
  const ab = about as AnyDoc

  const data: SiteData = {
    generatedAt: new Date().toISOString(),
    settings: {
      companyName: s(st.companyName),
      legalName: s(st.legalName),
      tagline: s(st.tagline),
      phone: s(st.phone),
      email: s(st.email),
      address: s(st.address),
      town: s(st.town),
      zip: s(st.zip),
      openHours: s(st.openHours),
      openingHoursSchema: s(st.openingHoursSchema),
      afterHoursNote: s(st.afterHoursNote),
      googleMapsUrl: s(st.googleMapsUrl),
      mapQuery: s(st.mapQuery),
      yearsInBusiness: typeof st.yearsInBusiness === 'number' ? st.yearsInBusiness : null,
      license: s(st.license),
      insured: s(st.insured),
      brands: ((st.brands as AnyDoc[]) || []).map((b) => s(b.name)).filter(Boolean),
      social: {
        facebook: s(st.facebook),
        instagram: s(st.instagram),
        yelp: s(st.yelp),
        nextdoor: s(st.nextdoor),
      },
      formEmail: s(st.formEmail),
      web3formsAccessKey: s(st.web3formsAccessKey),
      siteUrl: s(st.siteUrl).replace(/\/$/, ''),
      gaMeasurementId: s(st.gaMeasurementId),
      googlePlaceId: s(st.googlePlaceId),
      showReviews: Boolean(st.showReviews),
    },
    home: {
      heroH1: s(hm.heroH1),
      heroH2: s(hm.heroH2),
      heroText: s(hm.heroText),
      formTitle: s(hm.formTitle),
      formSubtitle: s(hm.formSubtitle),
      servicesTitle: s(hm.servicesTitle),
      servicesIntro: s(hm.servicesIntro),
      areasTitle: s(hm.areasTitle),
      areasIntro: s(hm.areasIntro),
      metaTitle: s(hm.metaTitle),
      metaDescription: s(hm.metaDescription),
    },
    about: {
      image: img(ab.image),
      h1: s(ab.h1),
      h2: s(ab.h2),
      body: s(ab.body),
      brandsTitle: s(ab.brandsTitle),
      metaDescription: s(ab.metaDescription),
    },
    services: services.docs.map(
      (d: AnyDoc): Service => ({
        slug: s(d.slug),
        title: s(d.title),
        icon: s(d.icon) || 'wrench',
        image: img(d.image),
        shortDescription: s(d.shortDescription),
        description: s(d.description),
        whyImportant: s(d.whyImportant),
        whatToExpect: ((d.whatToExpect as AnyDoc[]) || []).map((x) => ({ title: s(x.title), text: s(x.text) })),
        metaDescription: s(d.metaDescription),
      }),
    ),
    areas: areas.docs.map(
      (d: AnyDoc): Area => ({
        slug: s(d.slug),
        name: s(d.name),
        state: s(d.state),
        icon: s(d.icon) || 'map-pin',
        image: img(d.image),
        shortDescription: s(d.shortDescription),
        description: s(d.description),
        localNotes: ((d.localNotes as AnyDoc[]) || []).map((x) => s(x.text)).filter(Boolean),
        metaDescription: s(d.metaDescription),
      }),
    ),
  }

  writeIfChanged(data)
  return data
}

function writeIfChanged(data: SiteData) {
  fs.mkdirSync(path.dirname(CONTENT_FILE), { recursive: true })
  if (fs.existsSync(CONTENT_FILE)) {
    try {
      const prev = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8')) as SiteData
      const strip = (d: SiteData) => JSON.stringify({ ...d, generatedAt: '' })
      if (strip(prev) === strip(data)) return
    } catch {
      /* rewrite */
    }
  }
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(data, null, 2) + '\n', 'utf8')
}

// --- hooks: regenerate content/site.json after every edit (debounced) ---

let timer: NodeJS.Timeout | null = null
function schedule(payload: Payload, context?: Record<string, unknown>) {
  if (context?.skipExport) return
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    timer = null
    exportContent(payload).catch((err) => payload.logger.error({ err }, 'content export failed'))
  }, 800)
}

export const exportAfterChange: CollectionAfterChangeHook = ({ req, doc }) => {
  schedule(req.payload, req.context)
  return doc
}
export const exportAfterDelete: CollectionAfterDeleteHook = ({ req, doc }) => {
  schedule(req.payload, req.context)
  return doc
}
export const exportAfterGlobalChange: GlobalAfterChangeHook = ({ req, doc }) => {
  schedule(req.payload, req.context)
  return doc
}
