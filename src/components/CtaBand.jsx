import { BOOKS } from '../data/content.js'
import { everyBook } from '../lib/books.js'
import AmazonLink from './AmazonLink.jsx'
import { StarIcon } from './Icons.jsx'

export default function CtaBand() {
  return (
    <section className="cta wave" aria-labelledby="cta-title">
      <StarIcon className="cta__star cta__star--one" color="#FFD76A" />
      <StarIcon className="cta__star cta__star--two" color="#FF8F7A" />
      <div className="cta__inner">
        <h2 id="cta-title">Ready to color?</h2>
        <p>
          {everyBook(BOOKS.length)} {BOOKS.length === 1 ? 'is' : 'are'} on Amazon, one click away. Crayons sold separately.
        </p>
        <div className="cta__actions">
          {BOOKS.map((book, index) => (
            <AmazonLink
              key={book.id}
              className={`btn btn--lg ${index === 0 ? 'btn--butter' : 'btn--light'}`}
              href={book.href}
              srText=" on Amazon"
            >
              {book.title}
            </AmazonLink>
          ))}
        </div>
      </div>
    </section>
  )
}
