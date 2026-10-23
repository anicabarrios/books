import { Fragment } from 'react'
import Layout from '../components/Layout.jsx'
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

// 'A', 'A and B', 'A, B and C', with every title in italics
function BookTitles({ books }) {
  return books.map((book, index) => (
    <Fragment key={book.id}>
      {index > 0 && (index === books.length - 1 ? ' and ' : ', ')}
      <em>{book.title}</em>
    </Fragment>
  ))
}

// One blog article. Rendered to static HTML by scripts/build-blog.mjs, so it ships no JavaScript
// except the small menu script in src/menu.js.
export default function ArticlePage({ post, related, book, books, site }) {
  const Art = CHARACTERS[post.art]
  const wasUpdated = post.updated && post.updated !== post.date

  return (
    <Layout>
      <div className="container">
        <Breadcrumbs trail={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog/' }, { label: post.title }]} />

        <article className={`article tone-${post.tone}`}>
          <header className="article__head">
            <p className="tag">{post.tag}</p>
            <h1>{post.title}</h1>
            <p className="article__meta">
              By <a href="/#about">{site.author}</a>. Published{' '}
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              {wasUpdated && (
                <>
                  , updated <time dateTime={post.updated}>{formatDate(post.updated)}</time>
                </>
              )}
              . {post.readingMinutes} min read.
            </p>
          </header>

          <div className="article__hero" role="img" aria-label={post.imageAlt}>
            <Art className="article__art" />
          </div>

          {post.toc.length >= 3 && (
            <nav className="toc" aria-labelledby="toc-title">
              <p className="toc__title" id="toc-title">
                In this article
              </p>
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
              {site.author.charAt(0)}
            </span>
            <p>
              Written by <strong>{site.author}</strong>, author of the coloring books <BookTitles books={books} />.{' '}
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
    </Layout>
  )
}
