'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, Phone, X } from 'lucide-react'

type Props = { companyName: string; phone: string; tel: string; logo: string }

export function Header({ companyName, phone, tel, logo }: Props) {
  const pathname = usePathname()
  const isHome = pathname === '/' || pathname === ''
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  const solid = !isHome || scrolled || open

  return (
    <header className={`site-header ${solid ? 'is-solid' : 'is-transparent'}`}>
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label={`${companyName} – home`}>
          <img src={logo} alt={`${companyName} logo`} width={62} height={60} />
        </Link>

        <nav className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Main">
          <Link href="/#services">Services</Link>
          <Link href="/#service-areas">Service Areas</Link>
          <Link href="/about">About Us</Link>
          <a href={tel} className="nav-phone-mobile">
            <Phone size={18} aria-hidden="true" /> {phone}
          </a>
        </nav>

        <div className="header-actions">
          <a href={tel} className="header-phone">
            <Phone size={18} aria-hidden="true" />
            <span>{phone}</span>
          </a>
          <Link href="/contact" className="btn btn-accent">
            Contact Us
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>
    </header>
  )
}
