import Header from './Header.jsx'
import Footer from './Footer.jsx'

// The frame every page shares: skip link, header, <main> and footer.
// `onHome` is true on the one-page home site and false on the blog pages (they link back to it).
export default function Layout({ onHome = false, children }) {
  return (
    <div id="top">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header onHome={onHome} />
      <main id="main">{children}</main>
      <Footer onHome={onHome} />
    </div>
  )
}
