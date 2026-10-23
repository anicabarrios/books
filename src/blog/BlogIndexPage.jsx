import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import PostCard from '../components/PostCard.jsx'
import Breadcrumbs from './Breadcrumbs.jsx'

// The blog list page at /blog/.
export default function BlogIndexPage({ cards, blog }) {
  const featured = cards.find((card) => card.featured) ?? cards[0]
  const others = cards.filter((card) => card !== featured)

  return (
    <div id="top">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header base="/" />
      <main id="main">
        <div className="container">
          <Breadcrumbs trail={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} />
          <header className="blog-hero">
            <span className="eyebrow">The Little Bookshelf blog</span>
            <h1>{blog.h1}</h1>
            <p>{blog.intro}</p>
          </header>
        </div>
        <section className="section section--blush" aria-label="All posts">
          <div className="container">
            <div className="section-head">
              <h2>Latest posts</h2>
            </div>
            <div className="blog-list">
              {featured && <PostCard post={featured} />}
              <div className="blog-row">
                {others.map((card) => (
                  <PostCard key={card.id} post={card} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer base="/" />
    </div>
  )
}
