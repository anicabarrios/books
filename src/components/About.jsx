import { SITE } from '../data/site.js'
import { StarIcon } from './Icons.jsx'

export default function About() {
  return (
    <section id="about" className="container about" aria-labelledby="about-title">
      <div className="about__avatar" aria-hidden="true">
        <div className="about__avatar-circle">{SITE.author.charAt(0)}</div>
        <StarIcon className="about__star about__star--top" color="#FF8F7A" />
        <StarIcon className="about__star about__star--bottom" color="#7FB7F5" />
      </div>
      <div className="about__copy">
        <h2 id="about-title">Hi, I&rsquo;m Anica</h2>
        <p>
          I&rsquo;m {SITE.author}, the author behind these books. I love making things that are simple, colorful and a
          little bit silly.
        </p>
        <p>
          Here on the blog I share holiday ideas, games and little discoveries for curious kids, plus easy ways to bring a
          few words of Serbian into your day.
        </p>
        <a className="btn btn--primary" href="#books">
          See the books
        </a>
      </div>
    </section>
  )
}
