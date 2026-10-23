// Menu button for the generated blog pages (they are plain HTML, no React).
// Does the same as the menu in src/components/Header.jsx. Keep them alike.
const MENU_PATH = 'M4 7 h16 M4 12 h16 M4 17 h16'
const CLOSE_PATH = 'M6 6 L18 18 M18 6 L6 18'

const toggle = document.querySelector('.nav-toggle')
const nav = document.getElementById('main-nav')

if (toggle && nav) {
  const setOpen = (open) => {
    nav.classList.toggle('is-open', open)
    toggle.setAttribute('aria-expanded', String(open))
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
    toggle.querySelector('path')?.setAttribute('d', open ? CLOSE_PATH : MENU_PATH)
  }

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'))
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false)
  })
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false)
  })
}
