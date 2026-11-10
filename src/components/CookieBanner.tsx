'use client'

import { useEffect } from 'react'
import 'vanilla-cookieconsent/dist/cookieconsent.css'
import * as CookieConsent from 'vanilla-cookieconsent'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

function loadGA(id: string) {
  if (!id || document.getElementById('ga4')) return
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments)
  }
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'granted',
  })
  window.gtag('js', new Date())
  window.gtag('config', id)
  const s = document.createElement('script')
  s.id = 'ga4'
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
  document.head.appendChild(s)
}

export function CookieBanner({ gaId, privacyHref }: { gaId: string; privacyHref: string }) {
  useEffect(() => {
    const apply = () => {
      if (CookieConsent.acceptedCategory('analytics')) loadGA(gaId)
    }
    CookieConsent.run({
      guiOptions: {
        consentModal: { layout: 'box inline', position: 'bottom left' },
        preferencesModal: { layout: 'box' },
      },
      categories: {
        necessary: { enabled: true, readOnly: true },
        functionality: {},
        analytics: {
          autoClear: { cookies: [{ name: /^_ga/ }, { name: '_gid' }], reloadPage: true },
        },
      },
      onConsent: apply,
      onChange: apply,
      language: {
        default: 'en',
        translations: {
          en: {
            consentModal: {
              title: 'Cookies on this site',
              description: `We use necessary cookies to make the site work. With your permission we also use analytics to understand how the site is used, and load Google Maps. <a href="${privacyHref}">Privacy policy</a>`,
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              showPreferencesBtn: 'Manage preferences',
            },
            preferencesModal: {
              title: 'Cookie preferences',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              savePreferencesBtn: 'Save preferences',
              closeIconLabel: 'Close',
              sections: [
                {
                  title: 'Strictly necessary',
                  description: 'Required for the site to work, such as remembering your cookie choice.',
                  linkedCategory: 'necessary',
                },
                {
                  title: 'Maps',
                  description: 'Loads the embedded Google Map on the Contact page. Google may set its own cookies.',
                  linkedCategory: 'functionality',
                },
                {
                  title: 'Analytics',
                  description: 'Google Analytics helps us understand how visitors use the site. No advertising cookies.',
                  linkedCategory: 'analytics',
                },
              ],
            },
          },
        },
      },
    })
  }, [gaId, privacyHref])

  return null
}
