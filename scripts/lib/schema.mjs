// Structured data (schema.org JSON-LD) pieces that more than one page uses. Every page repeats the
// full author and publisher, and points to them by "@id", so Google reads them as the same
// person and brand across the whole site.
import { SITE } from '../../src/data/site.js'
import { agesOf } from '../../src/lib/books.js'
import { absoluteUrl } from './head.mjs'

export const ids = {
  website: absoluteUrl('/#website'),
  author: absoluteUrl('/#author'),
  publisher: absoluteUrl('/#publisher'),
}

export const authorEntity = () => ({
  '@type': 'Person',
  '@id': ids.author,
  name: SITE.author,
  url: absoluteUrl('/#about'),
  ...(SITE.sameAs.length > 0 && { sameAs: SITE.sameAs }),
})

export const publisherEntity = () => ({
  '@type': 'Organization',
  '@id': ids.publisher,
  name: SITE.name,
  url: absoluteUrl('/'),
  logo: { '@type': 'ImageObject', url: absoluteUrl('/logo-512.png'), width: 512, height: 512 },
  founder: { '@id': ids.author },
  ...(SITE.sameAs.length > 0 && { sameAs: SITE.sameAs }),
})

export const breadcrumbList = (trail) => ({
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
})

// A book, for the home page.
export function bookEntity(book) {
  const ages = agesOf(book)
  return {
    '@type': 'Book',
    '@id': absoluteUrl(`/#book-${book.id}`),
    name: book.title,
    description: book.description,
    url: book.href,
    author: { '@id': ids.author },
    inLanguage: book.languages,
    genre: "Children's coloring book",
    ...(ages && {
      audience: { '@type': 'PeopleAudience', suggestedMinAge: ages.min, suggestedMaxAge: ages.max },
    }),
    ...(book.cover && {
      image: {
        '@type': 'ImageObject',
        url: absoluteUrl(book.cover.src),
        width: book.cover.width,
        height: book.cover.height,
      },
    }),
  }
}
