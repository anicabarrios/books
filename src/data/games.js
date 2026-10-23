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

// The two wrong answers for round `i` come from other items in the same list.
const wrongFrom = (list, i, pick) => [list[(i + 1) % list.length], list[(i + 3) % list.length]].map(pick)

// Rounds are not random: round n always looks the same, so nothing flickers on re-render.
// A round is { label, prompt, options, optionLang, answer, right, wrong }.
const BUILDERS = {
  words(n) {
    const word = WORDS[n % WORDS.length]
    const meaning = `${word.sr} (say it: ${word.say}) means ${word.en.toLowerCase()}.`

    return {
      label: 'Word match',
      prompt: `Which word goes with “${word.en}”?`,
      options: withAnswerAt(word.sr, wrongFrom(WORDS, n % WORDS.length, (w) => w.sr), n % 3),
      optionLang: 'sr-Latn', // the answers are Serbian words
      answer: word.sr,
      right: `Yes! ${meaning}`,
      wrong: `Not quite. ${meaning}`,
    }
  },

  holidays(n) {
    const holiday = HOLIDAYS[n % HOLIDAYS.length]

    return {
      label: 'Which holiday?',
      prompt: holiday.clue,
      options: withAnswerAt(holiday.name, wrongFrom(HOLIDAYS, n % HOLIDAYS.length, (h) => h.name), n % 3),
      optionLang: undefined,
      answer: holiday.name,
      right: `Yes! It's ${holiday.name}, on ${holiday.when}.`,
      wrong: `Not quite. It's ${holiday.name}, on ${holiday.when}.`,
    }
  },
}

export const buildRound = (gameId, n) => BUILDERS[gameId](n)
