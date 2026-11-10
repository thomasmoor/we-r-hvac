import { asset } from '@/lib/site'
import type { SiteData } from '@/lib/siteTypes'

export function businessSchema(site: SiteData) {
  const s = site.settings
  const url = s.siteUrl || ''
  const [region, postal] = (s.zip || '').split(/\s+/)
  const sameAs = Object.values(s.social).filter((u) => {
    try {
      return new URL(u).pathname.replace(/\//g, '').length > 0
    } catch {
      return false
    }
  })
  return {
    '@context': 'https://schema.org',
    '@type': 'HVACBusiness',
    '@id': `${url}/#business`,
    name: s.companyName,
    legalName: s.legalName || undefined,
    url: `${url}/`,
    logo: `${url}/brand/logo.png`,
    image: `${url}/brand/logo.png`,
    telephone: s.phone,
    email: s.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: s.address || undefined,
      addressLocality: s.town,
      addressRegion: region || undefined,
      postalCode: postal || undefined,
      addressCountry: 'US',
    },
    openingHours: s.openingHoursSchema || undefined,
    areaServed: site.areas.map((a) => ({ '@type': 'City', name: `${a.name}, ${a.state}` })),
    hasMap: s.googleMapsUrl || undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    knowsAbout: site.services.map((x) => x.title),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'HVAC services',
      itemListElement: site.services.map((x) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: x.title, url: `${url}/services/${x.slug}/` },
      })),
    },
  }
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

export { asset }
