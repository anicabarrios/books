// Head tags for the home page (index.html): title, description, canonical, social cards and
// JSON-LD. vite.config.js calls this and drops the result between the <!-- home-seo --> markers.
// Text comes from src/data/site.js, links from src/data/content.js, so nothing is written twice.
import { BOOKS } from '../src/data/content.js'
import { SITE } from '../src/data/site.js'
import { absoluteUrl, headTags } from './lib/head.mjs'
import { authorEntity, bookEntity, ids, publisherEntity } from './lib/schema.mjs'

export function homeHead() {
  const { home } = SITE
  const homeUrl = absoluteUrl('/')
  const image = absoluteUrl('/og/default.png')
  const books = BOOKS.map(bookEntity)

  const website = {
    '@type': 'WebSite',
    '@id': ids.website,
    url: homeUrl,
    name: SITE.name,
    description: home.description,
    inLanguage: SITE.language,
    publisher: { '@id': ids.publisher },
  }
  const page = {
    '@type': 'CollectionPage',
    '@id': `${homeUrl}#webpage`,
    url: homeUrl,
    name: home.seoTitle,
    description: home.description,
    isPartOf: { '@id': ids.website },
    about: { '@id': ids.author },
    primaryImageOfPage: { '@type': 'ImageObject', url: image, width: 1200, height: 630 },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: books.map((book, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: { '@id': book['@id'] },
      })),
    },
  }

  return headTags({
    title: home.seoTitle,
    description: home.description,
    path: '/',
    image,
    imageAlt: home.imageAlt,
    jsonLd: { '@context': 'https://schema.org', '@graph': [website, publisherEntity(), authorEntity(), page, ...books] },
  })
}
