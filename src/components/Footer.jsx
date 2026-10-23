import { LogoIcon } from './Icons.jsx'

// `base` is '' on the home page and '/' on the separate blog pages (see Header.jsx).
export default function Footer({ base = '' }) {
  const hrefFor = (href) => (base && href === '#blog' ? `${base}blog/` : `${base}${href}`)

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="brand__mark brand__mark--sm">
            <LogoIcon />
          </span>
          <span className="footer__name">Anica's Little Bookshelf</span>
        </div>
        <nav className="nav" aria-label="Footer">
          <a className="nav__link" href={hrefFor('#books')}>Books</a>
          <a className="nav__link" href={hrefFor('#explore')}>Explore</a>
          <a className="nav__link" href={hrefFor('#blog')}>Blog</a>
          <a className="nav__link" href={hrefFor('#about')}>About</a>
        </nav>
        <span className="footer__copy">© {new Date().getFullYear()} Anica Barrios</span>
      </div>
    </footer>
  )
}
