// Fetches the Google rating + up to 5 reviews (Places API "New") and caches them in content/reviews.json.
// Runs daily at 01:00 UTC in GitHub Actions; can be run locally with GOOGLE_PLACES_API_KEY in .env.
// Skips quietly (and removes the cache) when reviews are switched off or not configured.
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
try {
  for (const line of fs.readFileSync(path.join(root, '.env'), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
  }
} catch {}

const out = path.join(root, 'content/reviews.json')
const site = JSON.parse(fs.readFileSync(path.join(root, 'content/site.json'), 'utf8'))
const placeId = process.env.GOOGLE_PLACE_ID || site.settings.googlePlaceId
const key = process.env.GOOGLE_PLACES_API_KEY

if (!site.settings.showReviews || !placeId || !key) {
  console.log(
    `Reviews skipped (showReviews=${site.settings.showReviews}, placeId=${placeId ? 'set' : 'missing'}, apiKey=${key ? 'set' : 'missing'}).`,
  )
  fs.rmSync(out, { force: true })
  process.exit(0)
}

const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=en`, {
  headers: {
    'X-Goog-Api-Key': key,
    'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri,reviews',
  },
})
if (!res.ok) {
  console.error(`Places API error ${res.status}: ${await res.text()}`)
  process.exit(0) // do not fail the deploy; the site simply builds without reviews
}
const p = await res.json()
const data = {
  fetchedAt: new Date().toISOString(),
  rating: p.rating ?? 0,
  count: p.userRatingCount ?? 0,
  mapsUri: p.googleMapsUri || site.settings.googleMapsUrl,
  reviews: (p.reviews || []).map((r) => ({
    author: r.authorAttribution?.displayName || 'Google user',
    authorPhoto: r.authorAttribution?.photoUri,
    url: r.authorAttribution?.uri,
    rating: r.rating ?? 5,
    text: r.text?.text || r.originalText?.text || '',
    relativeTime: r.relativePublishTimeDescription || '',
  })),
}
fs.writeFileSync(out, JSON.stringify(data, null, 2))
console.log(`Saved ${data.reviews.length} reviews (rating ${data.rating}, ${data.count} total).`)
