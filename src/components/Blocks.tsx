import Link from 'next/link'
import { BadgeCheck, CalendarClock, ShieldCheck, Star } from 'lucide-react'
import { Icon } from './Icon'
import { asset } from '@/lib/site'
import type { Img, ReviewsData, Settings } from '@/lib/siteTypes'

export function TrustDetails({ s, variant = 'light' }: { s: Settings; variant?: 'light' | 'dark' }) {
  return (
    <ul className={`trust trust-${variant}`}>
      {s.yearsInBusiness ? (
        <li>
          <CalendarClock aria-hidden="true" />
          <span>
            <strong>{s.yearsInBusiness} years</strong> in business
          </span>
        </li>
      ) : null}
      {s.license && (
        <li>
          <BadgeCheck aria-hidden="true" />
          <span>{s.license}</span>
        </li>
      )}
      {s.insured && (
        <li>
          <ShieldCheck aria-hidden="true" />
          <span>{s.insured}</span>
        </li>
      )}
    </ul>
  )
}

export function Stars({ value }: { value: number }) {
  return (
    <span className="stars" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={18} aria-hidden="true" className={i <= Math.round(value) ? 'on' : ''} />
      ))}
    </span>
  )
}

export function ReviewsSummary({ r }: { r: ReviewsData }) {
  return (
    <a className="reviews-summary" href={r.mapsUri} target="_blank" rel="noopener">
      <Stars value={r.rating} />
      <span>
        <strong>{r.rating.toFixed(1)}</strong> on Google · {r.count} reviews
      </span>
    </a>
  )
}

export function Testimonials({ r }: { r: ReviewsData }) {
  if (!r.reviews.length) return null
  return (
    <section className="section section-alt">
      <div className="container">
        <h2 className="section-title">What our customers say</h2>
        <div className="testimonials">
          {r.reviews.map((rev, i) => (
            <figure key={i} className="testimonial">
              <Stars value={rev.rating} />
              <blockquote>{rev.text}</blockquote>
              <figcaption>
                {rev.author} · <span>{rev.relativeTime}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="reviews-attr">
          Reviews from Google. <a href={r.mapsUri} target="_blank" rel="noopener">See all reviews</a>
        </p>
      </div>
    </section>
  )
}

export type CardItem = { href: string; title: string; text: string; icon: string; image: Img }

export function CardGrid({ items, cols }: { items: CardItem[]; cols: 3 | 4 }) {
  return (
    <div className={`card-grid cols-${cols}`}>
      {items.map((it) => (
        <Link key={it.href} href={it.href} className="card">
          <div className="card-media">
            {it.image && <img src={asset(it.image.src)} alt={it.image.alt} loading="lazy" width={600} height={400} />}
            <span className="card-icon">
              <Icon name={it.icon} size={26} />
            </span>
          </div>
          <div className="card-body">
            <h3>{it.title}</h3>
            <p>{it.text}</p>
            <span className="card-more">Learn more →</span>
          </div>
        </Link>
      ))}
    </div>
  )
}

export function PageHero({ title, eyebrow, icon }: { title: string; eyebrow?: string; icon?: string }) {
  return (
    <section className="page-hero">
      <div className="container">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>
          {icon && (
            <span className="page-hero-icon">
              <Icon name={icon} size={34} />
            </span>
          )}
          {title}
        </h1>
      </div>
    </section>
  )
}
