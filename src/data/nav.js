// The links in the header and the footer. `id` is the section on the home page.
export const NAV_LINKS = [
  { id: 'books', label: 'Books' },
  { id: 'explore', label: 'Explore' },
  { id: 'blog', label: 'Blog' },
  { id: 'about', label: 'About' },
]

// On the home page the links jump to a section. On the blog pages they lead back to the home page,
// and "Blog" goes to the blog list.
export function navHref(id, onHome) {
  if (onHome) return `#${id}`
  return id === 'blog' ? '/blog/' : `/#${id}`
}
