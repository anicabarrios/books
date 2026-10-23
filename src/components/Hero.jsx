import { BOOKS } from '../data/content.js'
import { agesPhrase, countBooks } from '../lib/books.js'
import { Bear, Puppy } from './Characters.jsx'
import Cover from './Cover.jsx'
import { StarIcon } from './Icons.jsx'
import Wobble from './Wobble.jsx'

const STARS = [
  { left: '2%', top: '30%', width: '8%', color: '#FF8F7A', delay: '0.9s' },
  { left: '88%', top: '14%', width: '7%', color: '#7FB7F5', delay: '1.1s' },
  { left: '92%', top: '58%', width: '6%', color: '#F2A900', delay: '1.3s' },
]

const CRAYONS = [
  { left: '22%', color: '#FF8F7A', rotate: -6 },
  { left: '40%', color: '#7FB7F5', rotate: 3 },
  { left: '60%', color: '#8FD6AE', rotate: -4 },
]

// The first two books of the list, standing on a little shelf. The puppy and the bear peek over
// the top. The covers are links to the book cards further down the page.
function Shelf() {
  const books = BOOKS.slice(0, 2)

  return (
    <div className="shelf">
      <Puppy className="shelf__pal shelf__pal--puppy" />
      <Bear className="shelf__pal shelf__pal--bear" />

      {books.map((book, index) => (
        <a
          key={book.id}
          className={`shelf__book shelf__book--${index === 0 ? 'left' : 'right'}`}
          href={`#book-${book.id}`}
          aria-label={`See ${book.title}`}
        >
          <Cover book={book} alt="" sizes="(min-width: 960px) 250px, 40vw" priority />
        </a>
      ))}

      <div className="shelf__plank" aria-hidden="true" />
      {CRAYONS.map(({ left, color, rotate }) => (
        <span key={left} className="shelf__crayon" aria-hidden="true" style={{ left, background: color, rotate: `${rotate}deg` }} />
      ))}
      {STARS.map(({ left, top, width, color, delay }) => (
        <StarIcon key={left} className="shelf__star" color={color} style={{ left, top, width, animationDelay: delay }} />
      ))}
    </div>
  )
}

export default function Hero() {
  return (
    <section className="container hero" aria-labelledby="hero-title">
      <div className="hero__copy">
        <p className="pill">
          <StarIcon />
          {countBooks(BOOKS.length)} now on Amazon
        </p>
        <h1 id="hero-title" className="wobble">
          <Wobble text="Coloring books and first Serbian words for curious little hands" />
        </h1>
        <p className="hero__lead">
          Meet friendly puppies and animal pals, then color a few Serbian words into the mix. Made for kids{' '}
          {agesPhrase(BOOKS)}, and for the grown-ups who can&rsquo;t resist grabbing a crayon too.
        </p>
        <div className="hero__actions">
          <a className="btn btn--primary btn--lg" href="#books">
            Meet the books
          </a>
          <a className="btn btn--ghost btn--lg" href="/blog/">
            Read the blog
          </a>
        </div>
        <p className="hero__meta">By Anica Barrios. Sold on Amazon.</p>
      </div>

      <div className="hero__art">
        <Shelf />
      </div>
    </section>
  )
}
