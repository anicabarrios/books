import { CHARACTERS } from '../components/Characters.jsx'
import AmazonLink from '../components/AmazonLink.jsx'

// The one book that fits the post, shown after the article. The post's `book` field picks it.
export default function BookPromo({ book }) {
  const Character = CHARACTERS[book.character]

  return (
    <aside className={`book-promo book--${book.tone}`} aria-label={`About the book ${book.title}`}>
      <div className="book-promo__art" aria-hidden="true">
        <Character className="char" />
      </div>
      <div className="book-promo__body">
        <span className="eyebrow">Keep the coloring going</span>
        <p className="book-promo__title">{book.title}</p>
        <p>{book.description}</p>
        <div className="badges">
          <span className="badge">{book.ages}</span>
          <span className="badge">Coloring book</span>
        </div>
        <AmazonLink href={book.href} label={`View ${book.title} on Amazon`}>
          View on Amazon
        </AmazonLink>
      </div>
    </aside>
  )
}
