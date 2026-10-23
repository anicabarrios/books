import { StarIcon } from './Icons.jsx'

export default function About() {
  return (
    <section id="about" className="container about">
      <div className="about__avatar" aria-hidden="true">
        <div className="about__avatar-circle">A</div>
        <StarIcon className="about__star about__star--top" color="#FF8F7A" />
        <StarIcon className="about__star about__star--bottom" color="#7FB7F5" />
      </div>
      <div className="about__copy">
        <span className="eyebrow">About the author</span>
        <h2>Hi, I'm Anica</h2>
        <p>
          I'm Anica Barrios, the author behind these books. I love making things that are simple,
          colorful and a little bit silly. Here on the blog I share holiday ideas, games and little
          discoveries for curious kids.
        </p>
        <a className="btn btn--primary" href="#books">See the books</a>
      </div>
    </section>
  )
}
