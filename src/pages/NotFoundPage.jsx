import Layout from '../components/Layout.jsx'
import { Puppy } from '../components/Characters.jsx'

// The 404 page. Netlify (and most hosts) show /404.html whenever an address does not exist.
export default function NotFoundPage() {
  return (
    <Layout>
      <section className="container not-found" aria-labelledby="not-found-title">
        <Puppy className="not-found__art" />
        <h1 id="not-found-title">Oops, this page wandered off</h1>
        <p>We could not find what you were looking for. The puppy has checked under the shelf twice. Try the home page or the blog instead.</p>
        <div className="not-found__actions">
          <a className="btn btn--primary btn--lg" href="/">
            Back to the books
          </a>
          <a className="btn btn--ghost btn--lg" href="/blog/">
            Read the blog
          </a>
        </div>
      </section>
    </Layout>
  )
}
