import { LogoIcon } from './Icons.jsx'
import { NAV_LINKS, navHref } from '../data/nav.js'
import { SITE } from '../data/site.js'

export default function Footer({ onHome = false }) {
  return (
    <footer className="footer wave">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="brand__mark brand__mark--sm">
            <LogoIcon />
          </span>
          <span className="footer__name">{SITE.name}</span>
        </div>
        <nav className="nav" aria-label="Footer">
          {NAV_LINKS.map((link) => (
            <a key={link.id} className="nav__link" href={navHref(link.id, onHome)}>
              {link.label}
            </a>
          ))}
        </nav>
        {/* The year is the visitor's, so it may differ from the year the page was built */}
        <p className="footer__copy" suppressHydrationWarning>
          © {new Date().getFullYear()} {SITE.author}
        </p>
      </div>
    </footer>
  )
}
