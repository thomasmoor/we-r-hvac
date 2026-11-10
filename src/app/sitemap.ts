import type { MetadataRoute } from 'next'
import { getSite } from '@/lib/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSite()
  const base = site.settings.siteUrl
  const now = new Date(site.generatedAt)
  const paths = [
    '/',
    '/about',
    '/contact',
    '/privacy',
    ...site.services.map((s) => `/services/${s.slug}`),
    ...site.areas.map((a) => `/service-areas/${a.slug}`),
  ]
  return paths.map((p) => ({ url: `${base}${p === '/' ? '/' : p + '/'}`, lastModified: now }))
}
