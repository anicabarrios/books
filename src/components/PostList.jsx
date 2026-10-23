import PostCard from './PostCard.jsx'

// The newest (or `featured:`) post big, the others in a row under it.
// Used on the home page and on the blog list page.
export default function PostList({ posts }) {
  const featured = posts.find((post) => post.featured) ?? posts[0]
  const others = posts.filter((post) => post !== featured)

  return (
    <div className="blog-list">
      {featured && <PostCard post={featured} />}
      <div className="blog-row">
        {others.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
