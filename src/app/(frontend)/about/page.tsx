import type { Metadata } from 'next'
import Link from 'next/link'
import { Testimonials, TrustDetails } from '@/components/Blocks'
import { asset, getReviews, getSite, paragraphs } from '@/lib/site'

export function generateMetadata(): Metadata {
  const { about, settings } = getSite()
  return {
    title: `About Us – ${settings.town} HVAC Contractor`,
    description: about.metaDescription,
    alternates: { canonical: '/about/' },
  }
}

export default function AboutPage() {
  const site = getSite()
  const { about, settings: s } = site
  const reviews = getReviews(site)

  return (
    <>
      <section className="section about-top">
        <div className="container about-grid">
          <div className="about-image">
            {about.image && <img src={asset(about.image.src)} alt={about.image.alt} width={1600} height={1066} />}
          </div>
          <div className="about-copy">
            <h1 className="about-h1">{about.h1}</h1>
            <h2 className="about-h2">{about.h2}</h2>
            <div className="prose">
              {paragraphs(about.body).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <TrustDetails s={s} />
            <Link href="/contact" className="btn btn-accent">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {reviews && <Testimonials r={reviews} />}

      {s.brands.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <h2 className="section-title">{about.brandsTitle}</h2>
            <ul className="brands">
              {s.brands.map((b) => (
                <li key={b} className="brand-badge">
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
