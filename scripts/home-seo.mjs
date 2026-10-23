// Head tags for the home page (index.html): title, description, canonical, social cards and
// JSON-LD. vite.config.js calls this and drops the result between the <!-- home-seo --> markers.
// Text comes from src/data/site.js, links from src/data/content.js, so nothing is written twice.
import { SITE } from '../src/data/site.js'
import { BOOKS } from '../src/data/content.js'

const esc = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const jsonForHtml = (value) => JSON.stringify(value).replace(/</g, '\\u003c')

export function homeHead() {
  const { home } = SITE
  const canonical = `${SITE.url}/`
  const image = `${SITE.url}/og/default.png`

  const author = { '@type': 'Person', '@id': `${SITE.url}/#author`, name: SITE.author, url: canonical }
  const website = {
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: canonical,
    name: SITE.name,
    description: home.description,
    inLanguage: SITE.language,
    publisher: { '@id': author['@id'] },
  }
  const books = BOOKS.map((book) => {
    const ages = book.ages.match(/(\d+)\D+(\d+)/)
    return {
      '@type': 'Book',
      name: book.title,
      description: book.description,
      url: book.href,
      author: { '@id': author['@id'] },
      inLanguage: 'en',
      ...(ages && {
        audience: { '@type': 'PeopleAudience', suggestedMinAge: Number(ages[1]), suggestedMaxAge: Number(ages[2]) },
      }),
      ...(book.cover && { image: `${SITE.url}${book.cover}` }),
    }
  })
  const page = {
    '@type': 'CollectionPage',
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: home.seoTitle,
    description: home.description,
    isPartOf: { '@id': website['@id'] },
    about: { '@id': author['@id'] },
    primaryImageOfPage: { '@type': 'ImageObject', url: image },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: books.map((book, index) => ({ '@type': 'ListItem', position: index + 1, item: book })),
    },
  }
  const jsonLd = { '@context': 'https://schema.org', '@graph': [website, author, page] }

  return `<title>${esc(home.seoTitle)}</title>
    <meta name="description" content="${esc(home.description)}" />
    <link rel="canonical" href="${esc(canonical)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${esc(SITE.name)}" />
    <meta property="og:locale" content="${esc(SITE.locale)}" />
    <meta property="og:title" content="${esc(home.seoTitle)}" />
    <meta property="og:description" content="${esc(home.description)}" />
    <meta property="og:url" content="${esc(canonical)}" />
    <meta property="og:image" content="${esc(image)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${esc(home.imageAlt)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(home.seoTitle)}" />
    <meta name="twitter:description" content="${esc(home.description)}" />
    <meta name="twitter:image" content="${esc(image)}" />
    <meta name="twitter:image:alt" content="${esc(home.imageAlt)}" />
    <script type="application/ld+json">${jsonForHtml(jsonLd)}</script>`
}
