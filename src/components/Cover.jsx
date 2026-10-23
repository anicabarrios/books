import { CHARACTERS } from './Characters.jsx'
import { coverAlt } from '../lib/books.js'

// A book cover as a real picture: WebP for browsers that can, JPG for the rest, and the size
// written into the HTML so the page does not jump while it loads. If the book has no `cover`
// in src/data/content.js, a drawn placeholder takes its place.
//
//   sizes     how wide the picture is shown on screen, so phones pick a small file
//   priority  true for the first pictures on the page: they load right away instead of lazily
//   alt       pass '' when the picture sits inside a link that already has a label
export default function Cover({ book, sizes, priority = false, alt, className = 'cover' }) {
  const { cover } = book
  if (!cover) return <PlaceholderCover book={book} className={className} />

  return (
    <picture>
      <source type="image/webp" srcSet={cover.srcSet} sizes={sizes} />
      <img
        className={className}
        src={cover.src}
        width={cover.width}
        height={cover.height}
        alt={alt ?? coverAlt(book)}
        decoding="async"
        loading={priority ? 'eager' : 'lazy'}
        // lowercase on purpose: React 18 only knows this attribute in lowercase
        {...(priority ? { fetchpriority: 'high' } : {})}
      />
    </picture>
  )
}

function PlaceholderCover({ book, className }) {
  const Character = CHARACTERS[book.character]
  return (
    <div className={`${className} cover--placeholder`} role="img" aria-label={coverAlt(book)}>
      <span className="cover--placeholder__kind">Coloring book</span>
      <span className="cover--placeholder__title">{book.title}</span>
      {Character && <Character className="cover--placeholder__art" />}
    </div>
  )
}
