import { useEffect, useMemo, useState } from 'react'
import { HOLIDAYS, countdownLabel, getUpcomingHolidays } from '../data/holidays.js'
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
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1)

// A row of buttons where exactly one is "pressed". `look` is the CSS class: 'tab' or 'chip'.
function ToggleGroup({ label, look, items, value, onChange }) {
  return (
    <div className={`${look}s`} role="group" aria-label={label}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={look}
          aria-pressed={item.id === value}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

// `today` is null on the server and during the first paint in the browser. The countdown needs the
// visitor's own date, so it appears a moment later; everything else is already on the page.
function HolidayCard({ holiday, today }) {
  return (
    <div className="word-card pop" aria-live="polite">
      <p className="word-card__label">Coming up</p>
      <p className="word-card__name">{holiday.name}</p>
      <div className="word-card__when-slot">
        {today && <span className="word-card__when">{countdownLabel(holiday.daysAway)}</span>}
      </div>
      <p className="word-card__date">
        {today ? holiday.nextDate.toLocaleDateString('en-US', dateFormat) : capitalize(holiday.when)}
      </p>
      <p className="word-card__text">{holiday.text}</p>
    </div>
  )
}

export default function Discover() {
  const [today, setToday] = useState(null)
  useEffect(() => setToday(new Date()), [])

  const holidays = useMemo(
    () => (today ? getUpcomingHolidays(today) : HOLIDAYS),
    [today],
  )
  const [topicId, setTopicId] = useState('holidays')
  const [holidayName, setHolidayName] = useState(HOLIDAYS[0].name)
  const [gameId, setGameId] = useState(GAMES[0].id)

  const topic = TOPICS.find((t) => t.id === topicId)
  // Once the real dates are known the list is re-sorted, so the soonest holiday comes first
  const holiday = holidays.find((h) => h.name === holidayName) ?? holidays[0]

  return (
    <section id="explore" className="container discover" aria-labelledby="explore-title">
      <div className="discover__box">
        <div className="discover__copy">
          <h2 id="explore-title">Play a little, learn a little</h2>
          <ToggleGroup label="Topic" look="tab" items={TOPICS} value={topicId} onChange={setTopicId} />
          <p>{topic.hint}</p>
          {topicId === 'holidays' ? (
            <ToggleGroup
              label="Holidays"
              look="chip"
              items={holidays.map((h) => ({ id: h.name, label: h.name }))}
              value={holiday.name}
              onChange={setHolidayName}
            />
          ) : (
            <ToggleGroup label="Games" look="chip" items={GAMES} value={gameId} onChange={setGameId} />
          )}
        </div>

        <div className="discover__result">
          {topicId === 'holidays' ? <HolidayCard holiday={holiday} today={today} /> : <GameCard key={gameId} gameId={gameId} />}
        </div>
      </div>
    </section>
  )
}
