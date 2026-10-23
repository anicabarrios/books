import { WORDS } from './content.js'
import { HOLIDAYS } from './holidays.js'

export const GAMES = [
  { id: 'words', label: 'Word match' },
  { id: 'holidays', label: 'Which holiday?' },
]

// Put the right answer at a given position among the wrong ones.
function withAnswerAt(answer, wrongOnes, position) {
  const options = [...wrongOnes]
  options.splice(position, 0, answer)
  return options
}

// Rounds are not random: round n always looks the same, so nothing flickers on re-render.
export function buildRound(gameId, n) {
  if (gameId === 'words') {
    const count = WORDS.length
    const i = n % count
    const word = WORDS[i]
    const wrongOnes = [WORDS[(i + 1) % count].sr, WORDS[(i + 3) % count].sr]
    const meaning = `${word.sr} (say it: ${word.say}) means ${word.en.toLowerCase()}.`

    return {
      label: 'Word match',
      prompt: `Which word goes with "${word.en}"?`,
      options: withAnswerAt(word.sr, wrongOnes, n % 3),
      answer: word.sr,
      right: `Yes! ${meaning}`,
      wrong: `Not quite. ${meaning}`,
    }
  }

  const count = HOLIDAYS.length
  const i = n % count
  const holiday = HOLIDAYS[i]
  const wrongOnes = [HOLIDAYS[(i + 1) % count].name, HOLIDAYS[(i + 3) % count].name]

  return {
    label: 'Which holiday?',
    prompt: holiday.clue,
    options: withAnswerAt(holiday.name, wrongOnes, n % 3),
    answer: holiday.name,
    right: `Yes! It's ${holiday.name}, on ${holiday.when}.`,
    wrong: `Not quite. It's ${holiday.name}, on ${holiday.when}.`,
  }
}
