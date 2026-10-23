import { useEffect, useState } from 'react'
import { LogoIcon } from './Icons.jsx'

const LINKS = [
  { href: '#books', label: 'Books' },
  { href: '#explore', label: 'Explore' },
  { href: '#blog', label: 'Blog' },
  { href: '#about', label: 'About' },
]

function MenuIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={open ? 'M6 6 L18 18 M18 6 L6 18' : 'M4 7 h16 M4 12 h16 M4 17 h16'}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

// `base` is '' on the one-page home site and '/' on the separate blog pages (src/blog), where
// the section links must point back to the home page and "Blog" to the blog list. The blog pages
// are plain HTML, so the open/close logic below is repeated in src/blog-menu.js. Keep them alike.
export default function Header({ base = '' }) {
  // On small screens the links live in a menu that opens under the logo.
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  const hrefFor = (href) => (base && href === '#blog' ? `${base}blog/` : `${base}${href}`)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="container site-header">
      <a className="brand" href={base || '#top'} onClick={close}>
        <span className="brand__mark">
          <LogoIcon />
        </span>
        <span className="brand__name">Anica's Little Bookshelf</span>
      </a>

      <button
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="main-nav"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((value) => !value)}
      >
        <MenuIcon open={open} />
      </button>

      <nav id="main-nav" className={`nav nav--main${open ? ' is-open' : ''}`} aria-label="Main">
        {LINKS.map((link) => (
          <a key={link.href} className="nav__link" href={hrefFor(link.href)} onClick={close}>
            {link.label}
          </a>
        ))}
        <a className="btn btn--primary btn--sm" href={hrefFor('#books')} onClick={close}>
          Shop the books
        </a>
      </nav>
    </header>
  )
}
