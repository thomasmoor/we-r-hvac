import { CardGrid, ReviewsSummary, TrustDetails } from '@/components/Blocks'
import { HeroVideo } from '@/components/HeroVideo'
import { QuoteForm } from '@/components/QuoteForm'
import { asset, getReviews, getSite, telHref } from '@/lib/site'

export const dynamic = 'force-static'

export default function HomePage() {
  const site = getSite()
  const { settings: s, home } = site
  const reviews = getReviews(site)

  return (
    <>
      <section className="hero">
        <HeroVideo src={asset('/video/hero.mp4')} poster={asset('/video/hero-poster.jpg')} />
        <div className="container hero-grid">
          <div className="hero-copy">
            <h1 className="hero-h1">{home.heroH1}</h1>
            <h2 className="hero-h2">{home.heroH2}</h2>
            {home.heroText && <p className="hero-text">{home.heroText}</p>}
            {reviews && <ReviewsSummary r={reviews} />}
            <TrustDetails s={s} variant="dark" />
          </div>
          <div className="hero-form">
            <QuoteForm
              id="hero-form"
              services={site.services.map((x) => x.title)}
              title={home.formTitle}
              subtitle={home.formSubtitle}
              note={s.afterHoursNote}
              phone={s.phone}
              tel={telHref(s.phone)}
              companyName={s.companyName}
              web3formsKey={s.web3formsAccessKey}
            />
          </div>
        </div>
      </section>

      <section className="section" id="services">
        <div className="container">
          <h2 className="section-title">{home.servicesTitle}</h2>
          {home.servicesIntro && <p className="section-intro">{home.servicesIntro}</p>}
          <CardGrid
            cols={4}
            items={site.services.map((x) => ({
              href: `/services/${x.slug}`,
              title: x.title,
              text: x.shortDescription,
              icon: x.icon,
              image: x.image,
            }))}
          />
        </div>
      </section>

      <section className="section section-alt" id="service-areas">
        <div className="container">
          <h2 className="section-title">{home.areasTitle}</h2>
          {home.areasIntro && <p className="section-intro">{home.areasIntro}</p>}
          <CardGrid
            cols={3}
            items={site.areas.map((x) => ({
              href: `/service-areas/${x.slug}`,
              title: `${x.name}, ${x.state}`,
              text: x.shortDescription,
              icon: x.icon,
              image: x.image,
            }))}
          />
        </div>
      </section>
    </>
  )
}
