import { ExternalIcon } from './Icons.jsx'
import { outboundProps } from '../lib/links.js'

// A link to Amazon. Real URLs open in a new tab; a '#' placeholder stays on the page.
//
// `srText` is extra text that only screen readers hear, added after the visible words. For a
// button that says "Get it on Amazon" it is ': Cute Animals & Puppies', so the link says what it
// leads to. "(opens in a new tab)" is added by itself.
export default function AmazonLink({ href, srText = '', className = 'btn btn--primary', children = 'Get it on Amazon' }) {
  const props = outboundProps(href)
  const hidden = `${srText}${props.target === '_blank' ? ' (opens in a new tab)' : ''}`

  return (
    <a className={className} href={href} {...props}>
      {children}
      {hidden && <span className="sr-only">{hidden}</span>}
      <ExternalIcon />
    </a>
  )
}
