import { useState } from 'react'
import { buildRound } from '../data/games.js'

// One quiz card. Give it a `key` of the game id so switching games starts fresh.
export default function GameCard({ gameId }) {
  const [roundNo, setRoundNo] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState({ correct: 0, played: 0 })

  const round = buildRound(gameId, roundNo)
  const answered = picked !== null

  function choose(option) {
    if (answered) return
    setPicked(option)
    setScore((s) => ({
      correct: s.correct + (option === round.answer ? 1 : 0),
      played: s.played + 1,
    }))
  }

  function next() {
    setRoundNo((n) => n + 1)
    setPicked(null)
  }

  function optionClass(option) {
    if (!answered) return 'option'
    if (option === round.answer) return 'option option--right'
    if (option === picked) return 'option option--wrong'
    return 'option'
  }

  return (
    <div className="word-card pop">
      <p className="word-card__label">{round.label}</p>
      <p className="game__prompt">{round.prompt}</p>
      <div className="game__options">
        {round.options.map((option) => (
          <button
            key={option}
            type="button"
            lang={round.optionLang}
            className={optionClass(option)}
            disabled={answered}
            onClick={() => choose(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <p className="game__feedback" role="status">
        {answered ? (picked === round.answer ? round.right : round.wrong) : 'Tap your answer.'}
      </p>
      <button
        type="button"
        className="btn btn--primary btn--sm"
        style={{ visibility: answered ? 'visible' : 'hidden' }}
        tabIndex={answered ? 0 : -1}
        onClick={next}
      >
        Next one
      </button>
      <p className="game__score">
        Score: {score.correct} of {score.played}
      </p>
    </div>
  )
}
