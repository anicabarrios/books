import Layout from '../components/Layout.jsx'
import PostList from '../components/PostList.jsx'
import SectionHead from '../components/SectionHead.jsx'
import Breadcrumbs from './Breadcrumbs.jsx'

// The blog list page at /blog/.
export default function BlogIndexPage({ cards, blog }) {
  return (
    <Layout>
      <div className="container">
        <Breadcrumbs trail={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} />
        <header className="blog-hero">
          <h1>{blog.h1}</h1>
          <p>{blog.intro}</p>
        </header>
      </div>
      <section className="section section--blush wave" aria-labelledby="latest-title">
        <div className="container">
          <SectionHead id="latest-title" title="Latest posts" />
          <PostList posts={cards} />
        </div>
      </section>
    </Layout>
  )
}
