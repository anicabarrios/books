import { BOOKS } from '../data/content.js'
import { everyBook } from '../lib/books.js'
import BookCard from './BookCard.jsx'
import SectionHead from './SectionHead.jsx'

export default function Books({ posts }) {
  return (
    <section id="books" className="section section--paper wave" aria-labelledby="books-title">
      <div className="container">
        <SectionHead id="books-title" title="Pick a book, grab your crayons">
          {everyBook(BOOKS.length)} {BOOKS.length === 1 ? 'is' : 'are'} on the shelf right now, and each one opens on Amazon.
        </SectionHead>
        <div className="book-grid">
          {BOOKS.map((book) => (
            <BookCard key={book.id} book={book} posts={posts} />
          ))}
        </div>
      </div>
    </section>
  )
}
