import { CHARACTERS } from './Characters.jsx'
import AmazonLink from './AmazonLink.jsx'
import { ArrowIcon } from './Icons.jsx'

// The whole card is clickable: the title link stretches over it (see .post__link in the CSS), so
// the link text is the post's title. The book button sits above it and goes to Amazon.
//
// `compact` forces the small card layout, so cards that sit side by side always match
// (used under an article; the featured post is only wide when it is shown on its own).
export default function PostCard({ post, compact = false }) {
  const Art = CHARACTERS[post.art]
  const layout = post.featured && !compact ? 'post--featured' : 'post--card'

  return (
    <article className={`post pop ${layout} tone-${post.tone}`}>
      <div className="post__panel">
        <Art className="post__art" />
      </div>
      <div className="post__body">
        <p className="tag">{post.tag}</p>
        <h3>
          <a className="post__link" href={post.href}>
            {post.title}
          </a>
        </h3>
        <p>{post.excerpt}</p>
        <div className="post__actions">
          <span className="read-more" aria-hidden="true">
            Read the post <ArrowIcon />
          </span>
          <AmazonLink className="btn btn--butter btn--sm" href={post.bookHref}>
            {post.bookLabel}
          </AmazonLink>
        </div>
      </div>
    </article>
  )
}
