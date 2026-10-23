import AmazonLink from '../components/AmazonLink.jsx'
import BookBadges from '../components/BookBadges.jsx'
import Cover from '../components/Cover.jsx'

// The one book that fits the post, shown after the article. The post's `book` field picks it.
export default function BookPromo({ book }) {
  return (
    <aside className={`book-promo pop book--${book.tone}`} aria-label={`About the book ${book.title}`}>
      <div className="book-promo__art">
        <Cover book={book} sizes="120px" />
      </div>
      <div className="book-promo__body">
        <p className="book-promo__lead">Keep the coloring going</p>
        <p className="book-promo__title">{book.title}</p>
        <p>{book.description}</p>
        <BookBadges book={book} />
        <AmazonLink href={book.href} srText={`: ${book.title}`} />
      </div>
    </aside>
  )
}
