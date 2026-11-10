import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="section">
      <div className="container prose prose-narrow" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <h1>Page not found</h1>
        <p>The page you are looking for does not exist or has moved.</p>
        <p>
          <Link href="/" className="btn btn-accent">
            Back to home
          </Link>
        </p>
      </div>
    </section>
  )
}
