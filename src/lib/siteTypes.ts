// Shape of content/site.json — the snapshot of Payload content the frontend renders from.

export type Img = { src: string; alt: string; width?: number; height?: number } | null

export type Service = {
  slug: string
  title: string
  icon: string
  image: Img
  shortDescription: string
  description: string
  whyImportant: string
  whatToExpect: { title: string; text: string }[]
  metaDescription?: string
}

export type Area = {
  slug: string
  name: string
  state: string
  icon: string
  image: Img
  shortDescription: string
  description: string
  localNotes: string[]
  metaDescription?: string
}

export type Settings = {
  companyName: string
  legalName: string
  tagline: string
  phone: string
  email: string
  address: string
  town: string
  zip: string
  openHours: string
  openingHoursSchema: string
  afterHoursNote: string
  googleMapsUrl: string
  mapQuery: string
  yearsInBusiness: number | null
  license: string
  insured: string
  brands: string[]
  social: { facebook: string; instagram: string; yelp: string; nextdoor: string }
  formEmail: string
  web3formsAccessKey: string
  siteUrl: string
  gaMeasurementId: string
  googlePlaceId: string
  showReviews: boolean
}

export type Home = {
  heroH1: string
  heroH2: string
  heroText: string
  formTitle: string
  formSubtitle: string
  servicesTitle: string
  servicesIntro: string
  areasTitle: string
  areasIntro: string
  metaTitle: string
  metaDescription: string
}

export type About = {
  image: Img
  h1: string
  h2: string
  body: string
  brandsTitle: string
  metaDescription: string
}

export type SiteData = {
  generatedAt: string
  settings: Settings
  home: Home
  about: About
  services: Service[]
  areas: Area[]
}

export type Review = {
  author: string
  authorPhoto?: string
  rating: number
  text: string
  relativeTime: string
  url?: string
}

export type ReviewsData = {
  fetchedAt: string
  rating: number
  count: number
  mapsUri: string
  reviews: Review[]
}
