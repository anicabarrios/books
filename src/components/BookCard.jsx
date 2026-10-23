import { CHARACTERS } from './Characters.jsx'
import AmazonLink from './AmazonLink.jsx'

export default function BookCard({ book }) {
  const Character = CHARACTERS[book.character]

  return (
    <article className={`book-card book--${book.tone}`}>
      <div className="book-stage">
        {book.cover ? (
          <img className="book-cover-img" src={book.cover} alt={`Cover of ${book.title}`} />
        ) : (
          <div className="book-cover">
            <div className="book-cover__head">
              <span className="book-cover__kind">Coloring book</span>
              <span className="book-cover__title">{book.title}</span>
            </div>
            <Character className="book-cover__art" />
            <span className="book-cover__author">Anica Barrios</span>
          </div>
        )}
        <div className="book-shelf" />
      </div>

      <div className="book-info">
        <div className="badges">
          <span className="badge">{book.ages}</span>
          <span className="badge">Coloring book</span>
        </div>
        <h3>{book.title}</h3>
        <p>{book.description}</p>
        <AmazonLink href={book.href} label={`View ${book.title} on Amazon`}>
          View on Amazon
        </AmazonLink>
      </div>
    </article>
  )
}
