// "Ages 3–6" and "Coloring book", shown on the book cards and under blog posts.
export default function BookBadges({ book }) {
  return (
    <ul className="badges">
      <li className="badge">{book.ages}</li>
      <li className="badge">Coloring book</li>
    </ul>
  )
}
