import { useMemo, useState } from 'react'
import { getUpcomingHolidays, countdownLabel } from '../data/holidays.js'
import { GAMES } from '../data/games.js'
import GameCard from './GameCard.jsx'

const TOPICS = [
  {
    id: 'holidays',
    label: 'Upcoming holidays',
    hint: 'The next holidays on the calendar, soonest first. Tap one to see what families do.',
  },
  {
    id: 'games',
    label: 'Games',
    hint: 'Pick a game and see how many you can get right.',
  },
]

const dateFormat = { weekday: 'long', month: 'long', day: 'numeric' }

export default function Discover() {
  const holidays = useMemo(() => getUpcomingHolidays(), [])
  const [topicId, setTopicId] = useState('holidays')
  const [holidayIndex, setHolidayIndex] = useState(0)
  const [gameId, setGameId] = useState(GAMES[0].id)

  const topic = TOPICS.find((t) => t.id === topicId)
  const holiday = holidays[holidayIndex]

  return (
    <section id="explore" className="container discover">
      <div className="discover__box">
        <div className="discover__copy">
          <span className="eyebrow eyebrow--violet">Explore</span>
          <h2>Holidays and games</h2>
          <div className="tabs" role="group" aria-label="Topic">
            {TOPICS.map((t) => (
              <button
                key={t.id}
                type="button"
                className="tab"
                aria-pressed={t.id === topicId}
                onClick={() => setTopicId(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <p>{topic.hint}</p>
          <div className="chips">
            {topicId === 'holidays'
              ? holidays.map((h, i) => (
                  <button
                    key={h.name}
                    type="button"
                    className="chip"
                    aria-pressed={i === holidayIndex}
                    onClick={() => setHolidayIndex(i)}
                  >
                    {h.name}
                  </button>
                ))
              : GAMES.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    className="chip"
                    aria-pressed={g.id === gameId}
                    onClick={() => setGameId(g.id)}
                  >
                    {g.label}
                  </button>
                ))}
          </div>
        </div>

        <div className="discover__result">
          {topicId === 'holidays' ? (
            <div className="word-card" aria-live="polite">
              <span className="word-card__label">Upcoming holiday</span>
              <span className="word-card__name">{holiday.name}</span>
              <span className="word-card__when">{countdownLabel(holiday.daysAway)}</span>
              <span className="word-card__date">
                {holiday.nextDate.toLocaleDateString('en-US', dateFormat)}
              </span>
              <p className="word-card__text">{holiday.text}</p>
            </div>
          ) : (
            <GameCard key={gameId} gameId={gameId} />
          )}
        </div>
      </div>
    </section>
  )
}
