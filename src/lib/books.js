// Small helpers that read the BOOKS list, so no text on the site says "two" by hand.

// 'Ages 3–6' -> { min: 3, max: 6 }
export function agesOf(book) {
  const match = book.ages.match(/(\d+)\D+(\d+)/)
  return match ? { min: Number(match[1]), max: Number(match[2]) } : null
}

// The age range that covers every book: 3 and 7 for 'Ages 3–6' plus 'Ages 3–7'.
export function ageSpan(books) {
  const ranges = books.map(agesOf).filter(Boolean)
  if (!ranges.length) return null
  return {
    min: Math.min(...ranges.map((r) => r.min)),
    max: Math.max(...ranges.map((r) => r.max)),
  }
}

export const agesPhrase = (books) => {
  const span = ageSpan(books)
  return span ? `ages ${span.min} to ${span.max}` : 'little kids'
}

const NUMBER_WORDS = ['no', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten']

// 2 -> 'Two books', 1 -> 'One book'
export function countBooks(count) {
  const word = NUMBER_WORDS[count] ?? String(count)
  return `${word} ${count === 1 ? 'book' : 'books'}`
}

// 'Both books', 'All 3 books', 'The book'
export function everyBook(count) {
  if (count === 1) return 'The book'
  if (count === 2) return 'Both books'
  return `All ${count} books`
}

// 'A', 'A and B', 'A, B and C' (for plain strings)
export function joinList(items) {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

export const coverAlt = (book) => `Cover of ${book.title}, a coloring book for ${book.ages.toLowerCase()}`
