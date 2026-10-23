// The phone menu. One small script for every page (the home page and the blog pages), written
// without React. It works by listening on the whole document, so it does not matter when the
// header appears on the page.
//
// Open and closed are shown with aria-expanded on the button, which is also what tells screen
// readers the state. The CSS does the rest (see styles/header.css).
const wide = window.matchMedia('(min-width: 861px)')

function toggles() {
  return document.querySelectorAll('.nav-toggle')
}

function setOpen(toggle, open) {
  toggle.setAttribute('aria-expanded', String(open))
  document.getElementById(toggle.getAttribute('aria-controls'))?.classList.toggle('is-open', open)
}

function closeAll({ restoreFocus = false } = {}) {
  for (const toggle of toggles()) {
    const wasOpen = toggle.getAttribute('aria-expanded') === 'true'
    setOpen(toggle, false)
    if (wasOpen && restoreFocus) toggle.focus()
  }
}

document.addEventListener('click', (event) => {
  const toggle = event.target.closest('.nav-toggle')
  if (toggle) {
    const open = toggle.getAttribute('aria-expanded') !== 'true'
    closeAll()
    setOpen(toggle, open)
    return
  }
  // A tap on a link, or anywhere outside the open menu, closes it
  if (event.target.closest('.nav--main a') || !event.target.closest('.nav--main')) closeAll()
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeAll({ restoreFocus: true })
})

// Turning a tablet sideways shows the full menu, so there is nothing left to keep open
wide.addEventListener('change', () => closeAll())
