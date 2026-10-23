import AmazonLink from './AmazonLink.jsx'
import BookBadges from './BookBadges.jsx'
import Cover from './Cover.jsx'

// `posts` are the blog post cards. The ones written about this book are linked under the
// description, which gives visitors more to read and gives search engines a path to the posts.
export default function BookCard({ book, posts = [] }) {
  const ideas = posts.filter((post) => post.bookId === book.id)

  return (
    <article id={`book-${book.id}`} className={`book-card pop book--${book.tone}`}>
      <div className="book-card__stage">
        <div className="book-card__cover tape">
          <Cover book={book} sizes="(min-width: 700px) 300px, 70vw" />
        </div>
        <div className="book-card__shelf" aria-hidden="true" />
      </div>

      <div className="book-card__info">
        <BookBadges book={book} />
        <h3>{book.title}</h3>
        <p>{book.description}</p>

        {ideas.length > 0 && (
          <div className="book-card__ideas">
            <h4>Ideas to go with it</h4>
            <ul>
              {ideas.map((post) => (
                <li key={post.id}>
                  <a href={post.href}>{post.title}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <AmazonLink href={book.href} srText={`: ${book.title}`} />
      </div>
    </article>
  )
}
