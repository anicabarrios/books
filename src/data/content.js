import { cover } from '../lib/cover.js'

// Amazon links (amazon.com, US market). Every button on the site reads from here.
export const AMAZON = {
  cuteAnimals: 'https://www.amazon.com/dp/B0HMFKKKR3',
  learnSerbian: 'https://www.amazon.com/dp/B0HMFMV1XJ',
}

// To add a book, add one more object here. The hero, the book list, the buttons at the bottom,
// the search-engine data and the "ideas to go with it" links all update by themselves.
//
//   id          used in links: (book:cute-animals) in blog posts, and `book:` in a post's front matter
//   ages        written like 'Ages 3–6'. The site reads the numbers from it.
//   tone        card color: 'sky' or 'butter'
//   character   the little drawing used when there is no cover: 'puppy' or 'bear'
//   languages   what the book is written in ('sr' is Serbian)
//   cover       cover('file_name_without_extension', widthInPixels, heightInPixels), or null
export const BOOKS = [
  {
    id: 'cute-animals',
    title: 'Cute Animals & Puppies',
    ages: 'Ages 3–6',
    description:
      'A page-by-page parade of friendly puppies and animal pals, made for little colorists ages 3 to 6.',
    href: AMAZON.cuteAnimals,
    tone: 'sky',
    character: 'puppy',
    languages: ['en'],
    cover: cover('cute_puppies', 1000, 1293),
  },
  {
    id: 'learn-serbian',
    title: 'Learn Serbian with Animals',
    ages: 'Ages 3–7',
    description:
      'Color an animal, then meet its Serbian name. A playful first step into the language for kids ages 3 to 7.',
    href: AMAZON.learnSerbian,
    tone: 'butter',
    character: 'bear',
    languages: ['en', 'sr'],
    cover: cover('learn_serbian', 1000, 1293),
  },
]

// Words for the "Word match" game (Explore section, Games tab).
// Holidays live in src/data/holidays.js. Blog posts live in content/blog/*.md.
export const WORDS = [
  { en: 'Dog', sr: 'pas', say: 'pahs' },
  { en: 'Cat', sr: 'mačka', say: 'MAHCH-kah' },
  { en: 'Bear', sr: 'medved', say: 'MEH-dved' },
  { en: 'Rabbit', sr: 'zec', say: 'zets' },
  { en: 'Bird', sr: 'ptica', say: 'PTEE-tsah' },
  { en: 'Elephant', sr: 'slon', say: 'slawn' },
]
