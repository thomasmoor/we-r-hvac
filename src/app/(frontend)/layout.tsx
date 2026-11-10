import type { Metadata, Viewport } from 'next'
import { Oswald, Source_Sans_3 } from 'next/font/google'
import { Phone } from 'lucide-react'
import React from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CookieBanner } from '@/components/CookieBanner'
import { JsonLd, businessSchema } from '@/components/JsonLd'
import { asset, BASE_PATH, getSite, telHref } from '@/lib/site'
import './styles.css'

const oswald = Oswald({ subsets: ['latin'], variable: '--font-heading', display: 'swap' })
const sourceSans = Source_Sans_3({ subsets: ['latin'], variable: '--font-body', display: 'swap' })

export async function generateMetadata(): Promise<Metadata> {
  const site = getSite()
  const { settings: s, home } = site
  return {
    metadataBase: s.siteUrl ? new URL(s.siteUrl + '/') : undefined,
    title: { default: home.metaTitle || s.companyName, template: `%s | ${s.companyName}` },
    description: home.metaDescription,
    icons: {
      icon: [{ url: `${BASE_PATH}/favicon-32.png`, sizes: '32x32', type: 'image/png' }],
      apple: `${BASE_PATH}/apple-touch-icon.png`,
    },
    openGraph: {
      type: 'website',
      siteName: s.companyName,
      images: [{ url: `${BASE_PATH}/video/hero-poster.jpg` }],
    },
  }
}

export const viewport: Viewport = { themeColor: '#0B2545', width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const site = getSite()
  const s = site.settings
  const tel = telHref(s.phone)

  return (
    <html lang="en" className={`${oswald.variable} ${sourceSans.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header companyName={s.companyName} phone={s.phone} tel={tel} logo={asset('/brand/logo.png')} />
        <main id="main">{children}</main>
        <Footer site={site} />
        <a href={tel} className="mobile-call" aria-label={`Call ${s.companyName} at ${s.phone}`}>
          <Phone size={20} aria-hidden="true" /> Call now
        </a>
        <CookieBanner gaId={s.gaMeasurementId} privacyHref={`${BASE_PATH}/privacy`} />
        <JsonLd data={businessSchema(site)} />
      </body>
    </html>
  )
}
