import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import PostCard from '../components/PostCard.jsx'
import { CHARACTERS } from '../components/Characters.jsx'
import BookPromo from './BookPromo.jsx'
import Breadcrumbs from './Breadcrumbs.jsx'

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })

// One blog article. Rendered to static HTML by scripts/build-blog.mjs, so it ships no JavaScript
// except the small menu script in src/blog-menu.js.
export default function ArticlePage({ post, related, book, site }) {
  const Art = CHARACTERS[post.art]
  const wasUpdated = post.updated && post.updated !== post.date

  return (
    <div id="top">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header base="/" />
      <main id="main">
        <div className="container">
          <Breadcrumbs
            trail={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog/' },
              { label: post.title },
            ]}
          />

          <article className={`article tone-${post.tone}`}>
            <header className="article__head">
              <span className="tag">{post.tag}</span>
              <h1>{post.title}</h1>
              <p className="article__meta">
                By <a href="/#about">{site.author}</a>
                <span aria-hidden="true"> · </span>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                {wasUpdated && (
                  <>
                    <span aria-hidden="true"> · </span>Updated{' '}
                    <time dateTime={post.updated}>{formatDate(post.updated)}</time>
                  </>
                )}
                <span aria-hidden="true"> · </span>
                {post.readingMinutes} min read
              </p>
            </header>

            <div className="article__hero" role="img" aria-label={post.imageAlt}>
              <Art className="article__art" />
            </div>

            {post.toc.length >= 3 && (
              <nav className="toc" aria-label="Table of contents">
                <p className="toc__title">In this article</p>
                <ul>
                  {post.toc.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`}>{item.text}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            <div className="prose" dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />

            <aside className="author-box" aria-label="About the author">
              <span className="author-box__avatar" aria-hidden="true">
                A
              </span>
              <p>
                Written by <strong>{site.author}</strong>, author of the coloring books{' '}
                <em>Cute Animals &amp; Puppies</em> and <em>Learn Serbian with Animals</em>.{' '}
                <a href="/#about">More about me</a>
              </p>
            </aside>

            <BookPromo book={book} />
          </article>

          {related.length > 0 && (
            <section className="related" aria-labelledby="related-title">
              <h2 id="related-title">More from the blog</h2>
              <div className="blog-row">
                {related.map((item) => (
                  <PostCard key={item.id} post={item} compact />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer base="/" />
    </div>
  )
}
