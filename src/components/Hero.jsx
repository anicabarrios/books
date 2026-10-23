import { Puppy, Bear } from './Characters.jsx'
import { StarIcon } from './Icons.jsx'

const STARS = [
  { left: '10%', top: '8%', width: '9%', color: '#FF8F7A' },
  { left: '78%', top: '10%', width: '7%', color: '#7FB7F5' },
  { left: '84%', top: '78%', width: '8%', color: '#F2A900' },
]

const CRAYONS = [
  { left: '6%', top: '82%', color: '#FF8F7A', rotate: -12 },
  { left: '14%', top: '88%', color: '#7FB7F5', rotate: 6 },
  { left: '30%', top: '84%', color: '#8FD6AE', rotate: -4 },
]

function HeroArt() {
  return (
    <div className="hero-art" aria-hidden="true">
      <div className="hero-art__blob" />
      <div className="hero-art__puppy">
        <Puppy className="char" />
      </div>
      <div className="hero-art__bear">
        <Bear className="char" />
      </div>
      {STARS.map(({ left, top, width, color }) => (
        <StarIcon
          key={`${left}-${top}`}
          className="hero-art__star"
          color={color}
          style={{ left, top, width }}
        />
      ))}
      {CRAYONS.map(({ left, top, color, rotate }) => (
        <span
          key={`${left}-${top}`}
          className="hero-art__crayon"
          style={{ left, top, background: color, transform: `rotate(${rotate}deg)` }}
        />
      ))}
    </div>
  )
}

export default function Hero() {
  return (
    <section className="container hero">
      <div className="hero__copy">
        <span className="pill">
          <StarIcon />
          Two books now on Amazon
        </span>
        <h1>Coloring books for curious little hands</h1>
        <p className="hero__lead">
          Cute animals and happy puppies to color, plus upcoming holidays and games to explore.
          Made for kids ages 3 to 7.
        </p>
        <div className="hero__actions">
          <a className="btn btn--primary btn--lg" href="#books">See the books</a>
          <a className="btn btn--ghost btn--lg" href="#blog">Read the blog</a>
        </div>
        <p className="hero__meta">By Anica Barrios · Sold on Amazon</p>
      </div>
      <div className="hero__art-wrap">
        <HeroArt />
      </div>
    </section>
  )
}
