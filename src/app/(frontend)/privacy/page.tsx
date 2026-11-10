import type { Metadata } from 'next'
import { PageHero } from '@/components/Blocks'
import { fullAddress, getSite } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  alternates: { canonical: '/privacy/' },
}

const EFFECTIVE = 'December 15, 2025'

export default function PrivacyPage() {
  const { settings: s } = getSite()
  const entity = s.legalName || s.companyName

  return (
    <>
      <PageHero title="Privacy Policy" eyebrow={`Effective ${EFFECTIVE}`} />
      <section className="section">
        <div className="container prose prose-narrow">
          <p>
            This privacy policy explains how {entity} (“{s.companyName}”, “we”, “us”), a California company, collects,
            uses and protects personal information when you visit this website or contact us through it.
          </p>

          <h2>Information we collect</h2>
          <ul>
            <li>
              <strong>Information you give us:</strong> when you submit a service request we receive your name, phone
              number, email address, the service you need, how soon you need it and any message you write.
            </li>
            <li>
              <strong>Communications:</strong> if you call or email us, we keep the information needed to respond and
              provide our services.
            </li>
            <li>
              <strong>Usage data (only with your consent):</strong> if you accept analytics cookies, Google Analytics
              collects information such as pages visited, approximate location, device and browser type.
            </li>
            <li>
              <strong>Technical data:</strong> our website host (GitHub Pages) may log technical information such as
              IP addresses for security and operation of the service.
            </li>
          </ul>

          <h2>How we use your information</h2>
          <ul>
            <li>To respond to your request, schedule appointments and provide HVAC services.</li>
            <li>To communicate with you about your service, quotes and follow-ups.</li>
            <li>To understand and improve how our website is used (analytics, only with consent).</li>
            <li>To protect our website against spam and abuse, and to comply with legal obligations.</li>
          </ul>
          <p>We do not sell your personal information and we do not share it for cross-context behavioral advertising.</p>

          <h2>Service providers</h2>
          <p>We use trusted providers who process information on our behalf:</p>
          <ul>
            <li>
              <strong>Web3Forms</strong> — delivers the contents of our online form to our email inbox.
            </li>
            <li>
              <strong>Google Analytics</strong> — website statistics, loaded only if you accept analytics cookies.
            </li>
            <li>
              <strong>Google Maps</strong> — the map on our Contact page, loaded only if you allow maps.
            </li>
            <li>
              <strong>GitHub Pages</strong> — hosts this website.
            </li>
          </ul>

          <h2>Cookies</h2>
          <p>
            We use a strictly necessary cookie to remember your cookie choices. Analytics and map cookies are only set
            after you agree. You can change your choice at any time using “Cookie settings” in the footer of every page.
          </p>

          <h2>How long we keep information</h2>
          <p>
            We keep service requests and customer records for as long as needed to provide our services, handle
            warranties and meet legal, tax and accounting requirements, and then delete them.
          </p>

          <h2>Your California privacy rights</h2>
          <p>If you are a California resident, you have the right to:</p>
          <ul>
            <li>know what personal information we collect, use and disclose;</li>
            <li>request access to or deletion of your personal information;</li>
            <li>request correction of inaccurate personal information;</li>
            <li>opt out of the sale or sharing of personal information (we do not sell or share it);</li>
            <li>not be discriminated against for exercising these rights.</li>
          </ul>
          <p>
            To make a request, contact us using the details below. We may need to verify your identity before
            responding. You may also use an authorized agent.
          </p>

          <h2>Security</h2>
          <p>
            We use reasonable measures to protect personal information. No method of transmission over the internet is
            completely secure, so we cannot guarantee absolute security.
          </p>

          <h2>Children</h2>
          <p>This website is not directed to children under 16 and we do not knowingly collect their information.</p>

          <h2>Changes to this policy</h2>
          <p>We may update this policy from time to time. The effective date at the top shows when it last changed.</p>

          <h2>Contact us</h2>
          <p>
            {entity}
            <br />
            {fullAddress(s)}
            <br />
            Phone: {s.phone}
            <br />
            Email: <a href={`mailto:${s.email}`}>{s.email}</a>
          </p>
        </div>
      </section>
    </>
  )
}
