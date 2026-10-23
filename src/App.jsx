import Layout from './components/Layout.jsx'
import Hero from './components/Hero.jsx'
import Books from './components/Books.jsx'
import Discover from './components/Discover.jsx'
import Blog from './components/Blog.jsx'
import CtaBand from './components/CtaBand.jsx'
import About from './components/About.jsx'

// The home page. `posts` are the blog post cards (src/data/posts.generated.json).
export default function App({ posts }) {
  return (
    <Layout onHome>
      <Hero />
      <Books posts={posts} />
      <Discover />
      <Blog posts={posts} />
      <CtaBand />
      <About />
    </Layout>
  )
}
