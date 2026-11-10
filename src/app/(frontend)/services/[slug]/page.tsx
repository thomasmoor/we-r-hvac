import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { Icon } from '@/components/Icon'
import { PageHero, TrustDetails } from '@/components/Blocks'
import { QuoteForm } from '@/components/QuoteForm'
import { JsonLd } from '@/components/JsonLd'
import { asset, getSite, paragraphs, telHref } from '@/lib/site'

export const dynamicParams = false

export function generateStaticParams() {
  return getSite().services.map((s) => ({ slug: s.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const site = getSite()
  const svc = site.services.find((s) => s.slug === slug)
  if (!svc) return {}
  return {
    title: `${svc.title} in ${site.settings.town}, CA`,
    description: svc.metaDescription || svc.shortDescription,
    alternates: { canonical: `/services/${svc.slug}/` },
  }
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const site = getSite()
  const s = site.settings
  const svc = site.services.find((x) => x.slug === slug)
  if (!svc) notFound()

  return (
    <>
      <PageHero title={svc.title} eyebrow={`${s.companyName} · ${s.town}, CA`} icon={svc.icon} />
      <section className="section">
        <div className="container detail-grid">
          <article className="detail-main">
            {svc.image && (
              <img className="detail-image" src={asset(svc.image.src)} alt={svc.image.alt} width={1200} height={800} />
            )}
            <div className="prose">
              {paragraphs(svc.description).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <h2>Why it matters</h2>
              {paragraphs(svc.whyImportant).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {svc.whatToExpect.length > 0 && (
              <>
                <h2 className="detail-h2">What you can expect</h2>
                <ol className="steps">
                  {svc.whatToExpect.map((step, i) => (
                    <li key={i}>
                      <CheckCircle2 aria-hidden="true" />
                      <div>
                        <strong>{step.title}</strong>
                        <p>{step.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </>
            )}
            <TrustDetails s={s} />
          </article>
          <aside className="detail-aside">
            <QuoteForm
              id="service-form"
              services={site.services.map((x) => x.title)}
              title={`Book ${svc.title.toLowerCase()}`}
              note={s.afterHoursNote}
              phone={s.phone}
              tel={telHref(s.phone)}
              companyName={s.companyName}
              web3formsKey={s.web3formsAccessKey}
            />
            <nav className="side-list" aria-label="Other services">
              <p className="side-list-title">Other services</p>
              <ul>
                {site.services
                  .filter((x) => x.slug !== svc.slug)
                  .map((x) => (
                    <li key={x.slug}>
                      <Link href={`/services/${x.slug}`}>
                        <Icon name={x.icon} size={18} /> {x.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>
          </aside>
        </div>
      </section>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: svc.title,
          description: svc.shortDescription,
          serviceType: svc.title,
          provider: { '@id': `${s.siteUrl}/#business` },
          areaServed: site.areas.map((a) => `${a.name}, ${a.state}`),
        }}
      />
    </>
  )
}
