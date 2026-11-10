import fs from 'fs'
import path from 'path'
import type { ReviewsData, SiteData } from './siteTypes'

const CONTENT_DIR = path.join(process.cwd(), 'content')

/** Content snapshot written by Payload (content/site.json). Re-read on every request in dev. */
export function getSite(): SiteData {
  return JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'site.json'), 'utf8')) as SiteData
}

/** Google reviews cached by scripts/fetch-reviews.mjs. Null when hidden or unavailable. */
export function getReviews(site: SiteData): ReviewsData | null {
  if (!site.settings.showReviews) return null
  const file = path.join(CONTENT_DIR, 'reviews.json')
  if (!fs.existsSync(file)) return null
  try {
    const r = JSON.parse(fs.readFileSync(file, 'utf8')) as ReviewsData
    return r && r.count ? r : null
  } catch {
    return null
  }
}

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
export const IS_STATIC = process.env.NEXT_PUBLIC_STATIC_EXPORT === '1'

/** Prefix a /public path with the GitHub Pages base path. */
export const asset = (p?: string | null) => (p ? `${BASE_PATH}${p}` : '')

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '').replace(/^(?!\+)/, '+1')}`

export const fullAddress = (s: SiteData['settings']) =>
  s.address ? `${s.address}, ${s.town} ${s.zip}`.trim() : `${s.town} ${s.zip}`.trim()

export const paragraphs = (text?: string) =>
  (text || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

/** Social links that are real (not just a placeholder home page). */
export const isRealSocial = (url: string) => {
  try {
    const u = new URL(url)
    return u.pathname.replace(/\//g, '').length > 0
  } catch {
    return false
  }
}
