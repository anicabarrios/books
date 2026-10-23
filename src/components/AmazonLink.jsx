import { ExternalIcon } from './Icons.jsx'

// A link to Amazon. Real URLs open in a new tab; the '#' placeholder stays on the page.
export default function AmazonLink({ href, className = 'btn btn--primary', label, children }) {
  const isExternal = /^https?:\/\//.test(href)
  return (
    <a
      className={className}
      href={href}
      aria-label={label}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
      <ExternalIcon />
    </a>
  )
}
