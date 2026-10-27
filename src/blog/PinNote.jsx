import { ExternalIcon } from '../components/Icons.jsx'
import { outboundProps } from '../lib/links.js'

// The post's Pinterest pin, shown after the article when the post has a `pin` in its front matter:
// the embedded pin (when the address is a pinterest.com/pin/<number>/ one) and a "Save" button.
export default function PinNote({ href, pinId, title }) {
  return (
    <aside className="pin-note" aria-label="Save this post on Pinterest">
      {pinId && (
        <div className="pin-note__embed">
          <iframe
            src={`https://assets.pinterest.com/ext/embed.html?id=${pinId}`}
            title={`Pinterest pin for: ${title}`}
            width="345"
            height="618"
            loading="lazy"
            scrolling="no"
          />
        </div>
      )}
      <p className="pin-note__text">Like this post? Save it on Pinterest to find it again.</p>
      <a className="btn btn--primary btn--sm" href={href} {...outboundProps(href)}>
        Save on Pinterest
        <span className="sr-only"> (opens in a new tab)</span>
        <ExternalIcon />
      </a>
    </aside>
  )
}
