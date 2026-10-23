// Holidays shown in the "Upcoming holidays" tab and used as clues in the "Which holiday?" game.
// `date(year)` returns the day the holiday falls on in that year.

// The nth weekday of a month. weekday: 0 = Sunday ... 4 = Thursday. month: 0 = January.
function nthWeekday(year, month, weekday, n) {
  const firstDay = new Date(year, month, 1).getDay()
  const day = 1 + ((weekday - firstDay + 7) % 7) + (n - 1) * 7
  return new Date(year, month, day)
}

// Easter Sunday (Gregorian calendar).
function easterSunday(year) {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month - 1, day)
}

export const HOLIDAYS = [
  {
    name: 'Halloween',
    when: 'October 31',
    text: 'Kids dress up in costumes and go trick-or-treating for candy. Pumpkins and friendly ghosts are everywhere.',
    clue: 'Kids dress up in costumes and go trick-or-treating for candy.',
    date: (year) => new Date(year, 9, 31),
  },
  {
    name: 'Thanksgiving',
    when: 'the fourth Thursday of November',
    text: 'Families gather for a big meal and take a moment to say what they are thankful for.',
    clue: 'Families share a big meal and say what they are thankful for.',
    date: (year) => nthWeekday(year, 10, 4, 4),
  },
  {
    name: 'Christmas',
    when: 'December 25',
    text: 'Many families decorate a tree, exchange gifts and share a special meal together.',
    clue: 'A decorated tree, wrapped gifts and a special family meal.',
    date: (year) => new Date(year, 11, 25),
  },
  {
    name: "Valentine's Day",
    when: 'February 14',
    text: 'Kids trade cards and little treats with friends, classmates and family.',
    clue: 'Kids trade cards and little treats with friends and family.',
    date: (year) => new Date(year, 1, 14),
  },
  {
    name: 'Easter',
    when: 'a Sunday in spring',
    text: 'Many families hide colorful eggs for kids to find on an egg hunt.',
    clue: 'Colorful eggs are hidden and kids go on a hunt to find them.',
    date: easterSunday,
  },
  {
    name: 'Fourth of July',
    when: 'July 4',
    text: 'Independence Day is celebrated with parades, picnics and fireworks.',
    clue: 'Parades, picnics and fireworks in the summer sky.',
    date: (year) => new Date(year, 6, 4),
  },
]

// Every holiday with its next date counting from today, soonest first.
export function getUpcomingHolidays(now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  return HOLIDAYS.map((holiday) => {
    let nextDate = holiday.date(today.getFullYear())
    if (nextDate < today) nextDate = holiday.date(today.getFullYear() + 1)
    const daysAway = Math.round((nextDate - today) / 86400000)
    return { ...holiday, nextDate, daysAway }
  }).sort((a, b) => a.nextDate - b.nextDate)
}

export function countdownLabel(daysAway) {
  if (daysAway === 0) return 'Today!'
  if (daysAway === 1) return 'Tomorrow'
  return `${daysAway} days to go`
}
