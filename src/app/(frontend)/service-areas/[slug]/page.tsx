import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2, MapPin } from 'lucide-react'
import { Icon } from '@/components/Icon'
import { PageHero, TrustDetails } from '@/components/Blocks'
import { QuoteForm } from '@/components/QuoteForm'
import { asset, getSite, paragraphs, telHref } from '@/lib/site'

export const dynamicParams = false

export function generateStaticParams() {
  return getSite().areas.map((a) => ({ slug: a.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const area = getSite().areas.find((a) => a.slug === slug)
  if (!area) return {}
  return {
    title: `HVAC Services in ${area.name}, ${area.state}`,
    description: area.metaDescription || area.shortDescription,
    alternates: { canonical: `/service-areas/${area.slug}/` },
  }
}

export default async function AreaPage({ params }: Props) {
  const { slug } = await params
  const site = getSite()
  const s = site.settings
  const area = site.areas.find((x) => x.slug === slug)
  if (!area) notFound()

  return (
    <>
      <PageHero title={`HVAC Services in ${area.name}, ${area.state}`} eyebrow="Service area" icon={area.icon} />
      <section className="section">
        <div className="container detail-grid">
          <article className="detail-main">
            {area.image && (
              <img className="detail-image" src={asset(area.image.src)} alt={area.image.alt} width={1200} height={800} />
            )}
            <div className="prose">
              {paragraphs(area.description).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {area.localNotes.length > 0 && (
              <>
                <h2 className="detail-h2">Local HVAC considerations</h2>
                <ul className="steps">
                  {area.localNotes.map((n, i) => (
                    <li key={i}>
                      <CheckCircle2 aria-hidden="true" />
                      <div>
                        <p>{n}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <h2 className="detail-h2">Services available in {area.name}</h2>
            <ul className="chip-list">
              {site.services.map((x) => (
                <li key={x.slug}>
                  <Link href={`/services/${x.slug}`} className="chip">
                    <Icon name={x.icon} size={18} /> {x.title}
                  </Link>
                </li>
              ))}
            </ul>
            <TrustDetails s={s} />
          </article>
          <aside className="detail-aside">
            <QuoteForm
              id="area-form"
              services={site.services.map((x) => x.title)}
              title={`Request service in ${area.name}`}
              note={s.afterHoursNote}
              phone={s.phone}
              tel={telHref(s.phone)}
              companyName={s.companyName}
              web3formsKey={s.web3formsAccessKey}
            />
            <nav className="side-list" aria-label="Other service areas">
              <p className="side-list-title">Other areas we serve</p>
              <ul>
                {site.areas
                  .filter((x) => x.slug !== area.slug)
                  .map((x) => (
                    <li key={x.slug}>
                      <Link href={`/service-areas/${x.slug}`}>
                        <MapPin size={18} aria-hidden="true" /> {x.name}, {x.state}
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>
          </aside>
        </div>
      </section>
    </>
  )
}
