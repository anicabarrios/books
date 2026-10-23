import { LogoIcon, MenuIcon } from './Icons.jsx'
import { NAV_LINKS, navHref } from '../data/nav.js'
import { SITE } from '../data/site.js'

// No React state in here on purpose. The phone menu is opened and closed by src/menu.js, which
// works the same on the home page and on the blog pages (those ship no React at all).
export default function Header({ onHome = false }) {
  return (
    <header className="container site-header">
      <a className="brand" href={onHome ? '#top' : '/'}>
        <span className="brand__mark">
          <LogoIcon />
        </span>
        <span className="brand__name">{SITE.name}</span>
      </a>

      <button type="button" className="nav-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="Menu">
        <MenuIcon />
      </button>

      <nav id="main-nav" className="nav nav--main" aria-label="Main">
        {NAV_LINKS.map((link) => (
          <a key={link.id} className="nav__link" href={navHref(link.id, onHome)}>
            {link.label}
          </a>
        ))}
        <a className="btn btn--primary btn--sm" href={navHref('books', onHome)}>
          Shop the books
        </a>
      </nav>
    </header>
  )
}
