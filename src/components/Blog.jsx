import PostCard from './PostCard.jsx'
// Written by scripts/build-blog.mjs from the Markdown files in content/blog/ (run: npm run blog)
import POSTS from '../data/posts.generated.json'

export default function Blog() {
  const featured = POSTS.find((post) => post.featured) ?? POSTS[0]
  const others = POSTS.filter((post) => post !== featured)

  return (
    <section id="blog" className="section section--blush">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">From the blog</span>
          <h2>Coloring, learning and little adventures</h2>
        </div>
        <div className="blog-list">
          {featured && <PostCard post={featured} />}
          <div className="blog-row">
            {others.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
        <div className="section-foot">
          <a className="btn btn--ghost" href="/blog/">
            All blog posts
          </a>
        </div>
      </div>
    </section>
  )
}
