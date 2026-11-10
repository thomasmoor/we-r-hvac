import type { MetadataRoute } from 'next'
import { getSite } from '@/lib/site'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  const { settings } = getSite()
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    sitemap: `${settings.siteUrl}/sitemap.xml`,
  }
}
