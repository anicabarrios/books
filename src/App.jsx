import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Books from './components/Books.jsx'
import Discover from './components/Discover.jsx'
import Blog from './components/Blog.jsx'
import CtaBand from './components/CtaBand.jsx'
import About from './components/About.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <div id="top">
      <Header />
      <main>
        <Hero />
        <Books />
        <Discover />
        <Blog />
        <CtaBand />
        <About />
      </main>
      <Footer />
    </div>
  )
}
