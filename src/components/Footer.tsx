import Link from 'next/link'
import { Clock, Facebook, House, Instagram, Mail, MapPin, Phone, Star } from 'lucide-react'
import { fullAddress, telHref } from '@/lib/site'
import type { SiteData } from '@/lib/siteTypes'

export function ContactList({ s, className = '' }: { s: SiteData['settings']; className?: string }) {
  return (
    <ul className={`contact-list ${className}`}>
      <li>
        <Phone aria-hidden="true" />
        <a href={telHref(s.phone)}>{s.phone}</a>
      </li>
      <li>
        <Mail aria-hidden="true" />
        <a href={`mailto:${s.email}`}>{s.email}</a>
      </li>
      <li>
        <MapPin aria-hidden="true" />
        <span>{fullAddress(s)}</span>
      </li>
      <li>
        <Clock aria-hidden="true" />
        <span>{s.openHours}</span>
      </li>
      {s.googleMapsUrl && (
        <li>
          <Star aria-hidden="true" />
          <a href={s.googleMapsUrl} target="_blank" rel="noopener">
            Reviews on Google
          </a>
        </li>
      )}
    </ul>
  )
}

export function Footer({ site }: { site: SiteData }) {
  const s = site.settings
  const social = [
    { href: s.social.facebook, label: 'Facebook', icon: <Facebook size={18} aria-hidden="true" /> },
    { href: s.social.instagram, label: 'Instagram', icon: <Instagram size={18} aria-hidden="true" /> },
    { href: s.social.yelp, label: 'Yelp', icon: <Star size={18} aria-hidden="true" /> },
    { href: s.social.nextdoor, label: 'Nextdoor', icon: <House size={18} aria-hidden="true" /> },
  ].filter((x) => x.href)

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-col footer-company">
          <p className="footer-name">{s.companyName}</p>
          {s.tagline && <p className="footer-tagline">{s.tagline}</p>}
          <ContactList s={s} />
          <ul className="social">
            {social.map((x) => (
              <li key={x.label}>
                <a href={x.href} target="_blank" rel="noopener" aria-label={x.label} title={x.label}>
                  {x.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <p className="footer-heading">Services</p>
          <ul>
            {site.services.map((x) => (
              <li key={x.slug}>
                <Link href={`/services/${x.slug}`}>{x.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <p className="footer-heading">Service Areas</p>
          <ul>
            {site.areas.map((x) => (
              <li key={x.slug}>
                <Link href={`/service-areas/${x.slug}`}>
                  {x.name}, {x.state}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <p className="footer-heading">Company</p>
          <ul>
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy policy</Link>
            </li>
            <li>
              <button type="button" className="linklike" data-cc="show-preferencesModal">
                Cookie settings
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          © {new Date().getFullYear()} {s.legalName || s.companyName}. {s.license}.
        </div>
      </div>
    </footer>
  )
}
