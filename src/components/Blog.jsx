import PostList from './PostList.jsx'
import SectionHead from './SectionHead.jsx'

// `posts` are the cards written by scripts/build-blog.mjs from content/blog/*.md (run: npm run blog)
export default function Blog({ posts }) {
  return (
    <section id="blog" className="section section--blush wave" aria-labelledby="blog-title">
      <div className="container">
        <SectionHead id="blog-title" title="Coloring, learning and little adventures">
          Easy ideas for the kitchen table, from holiday coloring to first words in Serbian.
        </SectionHead>
        <PostList posts={posts} />
        <div className="section-foot">
          <a className="btn btn--ghost" href="/blog/">
            All blog posts
          </a>
        </div>
      </div>
    </section>
  )
}
