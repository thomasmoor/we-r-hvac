'use client'

import { useEffect, useState } from 'react'
import * as CookieConsent from 'vanilla-cookieconsent'
import { MapPin } from 'lucide-react'

/** Google Map, loaded only after the visitor allows "Maps" in the cookie banner. */
export function MapEmbed({ query, label }: { query: string; label: string }) {
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const check = () => setAllowed(CookieConsent.acceptedCategory('functionality'))
    check()
    window.addEventListener('cc:onConsent', check)
    window.addEventListener('cc:onChange', check)
    return () => {
      window.removeEventListener('cc:onConsent', check)
      window.removeEventListener('cc:onChange', check)
    }
  }, [])

  const allow = () => {
    const current = CookieConsent.getUserPreferences().acceptedCategories || []
    CookieConsent.acceptCategory([...new Set([...current, 'necessary', 'functionality'])])
    setAllowed(true)
  }

  if (!allowed) {
    return (
      <div className="map-placeholder">
        <MapPin size={36} aria-hidden="true" />
        <p>
          <strong>{label}</strong>
        </p>
        <p>The map is provided by Google and may set cookies.</p>
        <button type="button" className="btn btn-primary" onClick={allow}>
          Show map
        </button>
      </div>
    )
  }

  return (
    <iframe
      className="map-frame"
      title={`Map: ${label}`}
      src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  )
}
