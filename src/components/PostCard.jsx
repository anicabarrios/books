import { CHARACTERS } from './Characters.jsx'
import AmazonLink from './AmazonLink.jsx'

// `compact` forces the small card layout, so cards that sit side by side always match
// (used under an article; the featured post is only wide when it is shown on its own).
export default function PostCard({ post, compact = false }) {
  const Art = CHARACTERS[post.art]
  const layout = post.featured && !compact ? 'post--featured' : 'post--card'

  return (
    <article className={`post ${layout} tone-${post.tone}`}>
      <div className="post__panel">
        <Art className="post__art" />
      </div>
      <div className="post__body">
        <span className="tag">{post.tag}</span>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <div className="post__actions">
          <a className="read-more" href={post.href}>Read the post →</a>
          <AmazonLink className="btn btn--butter" href={post.bookHref}>
            {post.bookLabel}
          </AmazonLink>
        </div>
      </div>
    </article>
  )
}
