import type { Metadata } from 'next'
import { PageHero } from '@/components/Blocks'
import { ContactList } from '@/components/Footer'
import { MapEmbed } from '@/components/MapEmbed'
import { QuoteForm } from '@/components/QuoteForm'
import { fullAddress, getSite, telHref } from '@/lib/site'

export function generateMetadata(): Metadata {
  const { settings: s } = getSite()
  return {
    title: 'Contact Us',
    description: `Contact ${s.companyName} in ${s.town}, CA. Call ${s.phone} or send a service request online.`,
    alternates: { canonical: '/contact/' },
  }
}

export default function ContactPage() {
  const site = getSite()
  const s = site.settings

  return (
    <>
      <PageHero title="Contact Us" eyebrow={s.companyName} />
      <section className="section">
        <div className="container contact-grid">
          <div>
            <h2 className="detail-h2">Get in touch</h2>
            <p>Call us, send an email or use the form — we will get back to you as soon as possible.</p>
            <ContactList s={s} className="contact-list-lg" />
            {s.afterHoursNote && <p className="form-note">{s.afterHoursNote}</p>}
          </div>
          <QuoteForm
            id="contact-form"
            services={site.services.map((x) => x.title)}
            title="Request service"
            phone={s.phone}
            tel={telHref(s.phone)}
            companyName={s.companyName}
            web3formsKey={s.web3formsAccessKey}
          />
        </div>
        <div className="container">
          <div className="map-wrap">
            <MapEmbed query={s.mapQuery || fullAddress(s)} label={`${s.companyName} – ${fullAddress(s)}`} />
          </div>
        </div>
      </section>
    </>
  )
}
