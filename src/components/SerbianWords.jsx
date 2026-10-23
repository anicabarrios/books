import { useState } from 'react'
import { WORDS } from '../data/content.js'
import { DownArrowIcon } from './Icons.jsx'

export default function SerbianWords() {
  const [picked, setPicked] = useState(0)
  const current = WORDS[picked]

  return (
    <section id="words" className="container words">
      <div className="words__box">
        <div className="words__copy">
          <span className="eyebrow eyebrow--violet">Try a word</span>
          <h2>Say it in Serbian</h2>
          <p>Tap an animal to see its Serbian name. There are more to color and learn in the book.</p>
          <div className="chips">
            {WORDS.map((word, i) => (
              <button
                key={word.en}
                type="button"
                className="chip"
                aria-pressed={i === picked}
                onClick={() => setPicked(i)}
              >
                {word.en}
              </button>
            ))}
          </div>
        </div>

        <div className="words__result">
          <div className="word-card" aria-live="polite">
            <span className="word-card__label">In English</span>
            <span className="word-card__en">{current.en}</span>
            <DownArrowIcon />
            <span className="word-card__label">In Serbian</span>
            <span className="word-card__sr">{current.sr}</span>
            <span className="word-card__say">say it: {current.say}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
