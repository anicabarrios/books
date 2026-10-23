import BookCard from './BookCard.jsx'
import { BOOKS } from '../data/content.js'

export default function Books() {
  return (
    <section id="books" className="section section--white">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">The bookshelf</span>
          <h2>Pick a book, grab your crayons</h2>
          <p>Both books are waiting for you on Amazon.</p>
        </div>
        <div className="book-grid">
          {BOOKS.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  )
}
