// Builds the blog.
//
//   content/blog/*.md   ->  blog/<slug>/index.html   one real HTML page per post
//                           blog/index.html          the blog list page (/blog/)
//                           public/sitemap.xml, public/robots.txt, public/feed.xml
//                           src/data/posts.generated.json   post cards for the home page
//
// Run with `npm run blog`. It also runs by itself before `npm run dev` and `npm run build`.
// Do not edit anything inside blog/ by hand: it is rebuilt from content/blog/ every time.
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { BOOKS } from '../src/data/content.js'
import { SITE } from '../src/data/site.js'
import { COVER_WIDTHS } from '../src/lib/cover.js'
import { lengthOf } from './lib/html.mjs'
import { absoluteUrl, headTags } from './lib/head.mjs'
import { feedXml, robotsTxt, sitemapXml } from './lib/outputs.mjs'
import { at } from './lib/paths.mjs'
import { checkSeo, readPosts } from './lib/posts.mjs'
import { loadRenderer } from './lib/renderer.mjs'
import { createReport } from './lib/report.mjs'
import { authorEntity, breadcrumbList, ids, publisherEntity } from './lib/schema.mjs'

const report = createReport()

// ---------- read and check ----------

const posts = readPosts({ books: BOOKS, report })
checkSeo(posts, report)

if (!existsSync(at('public', 'og', 'default.png'))) {
  report.warn('public/og/default.png is missing. Social previews need a 1200x630 image.')
}
for (const book of BOOKS) {
  if (!book.cover) continue
  const base = book.cover.src.replace(/\.jpg$/, '')
  const missing = [book.cover.src, ...COVER_WIDTHS.map((w) => `${base}-${w}.webp`)].filter(
    (file) => !existsSync(at('public', file)),
  )
  if (missing.length) {
    report.warn(`cover of "${book.title}": missing ${missing.join(', ')}. Put the JPG in public/covers/ and run: npm run covers`)
  }
}
if (SITE.urlIsPlaceholder) {
  report.warn(
    `Your website address is not set. Canonical links, social previews, sitemap.xml and the feed use ${SITE.url}.\n` +
      '   Set DEFAULT_URL in src/data/site.js (or SITE_URL on your host) before you deploy.',
  )
}

if (report.errors.length) {
  console.error('\nBlog build stopped:\n' + report.errors.map((message) => `  x ${message}`).join('\n') + '\n')
  process.exit(1)
}

// ---------- page template ----------

function pageHtml({ head, body }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    ${head}
    <link rel="stylesheet" href="/src/styles/index.css" />
  </head>
  <body>
${body}
    <script type="module" src="/src/menu.js"></script>
  </body>
</html>
`
}

const blogId = absoluteUrl('/blog/#blog')
const defaultImage = absoluteUrl('/og/default.png')

// ---------- render with the site's React components ----------

const { renderArticle, renderBlogIndex } = await loadRenderer()

const cards = posts.map((post) => ({
  id: post.slug,
  featured: post.featured,
  tag: post.tag,
  tone: post.tone,
  art: post.art,
  title: post.title,
  excerpt: post.excerpt,
  href: post.path,
  bookId: post.book.id,
  bookLabel: `Get ${post.book.title}`,
  bookHref: post.book.href,
}))
const cardOf = (slug) => cards.find((card) => card.id === slug)

// ---------- write the pages ----------

rmSync(at('blog'), { recursive: true, force: true })

for (const post of posts) {
  const relatedPosts = post.related
    ? post.related.map((slug) => posts.find((other) => other.slug === slug)).filter(Boolean)
    : posts.filter((other) => other.slug !== post.slug).slice(0, 2)

  // React writes dateTime; HTML attribute names are lowercase.
  const body = renderArticle({
    post,
    related: relatedPosts.map((other) => cardOf(other.slug)),
    book: post.book,
    books: BOOKS,
    site: { author: SITE.author },
  }).replace(/ dateTime="/g, ' datetime="')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${post.url}#article`,
        mainEntityOfPage: { '@type': 'WebPage', '@id': post.url },
        headline: post.title,
        description: post.description,
        image: [post.image],
        datePublished: post.date,
        dateModified: post.updated,
        author: { '@id': ids.author },
        publisher: { '@id': ids.publisher },
        isPartOf: { '@type': 'Blog', '@id': blogId, name: `${SITE.name} Blog`, url: absoluteUrl('/blog/') },
        articleSection: post.tag,
        keywords: post.keywords.join(', '),
        inLanguage: SITE.language,
        wordCount: post.words,
      },
      authorEntity(),
      publisherEntity(),
      breadcrumbList([
        { name: 'Home', url: absoluteUrl('/') },
        { name: 'Blog', url: absoluteUrl('/blog/') },
        { name: post.title, url: post.url },
      ]),
    ],
  }

  const head = headTags({
    title: post.seoTitle,
    ogTitle: post.title,
    description: post.description,
    path: post.path,
    image: post.image,
    imageAlt: post.imageAlt,
    type: 'article',
    article: { published: post.date, modified: post.updated, section: post.tag, tags: post.keywords },
    jsonLd,
  })

  mkdirSync(at('blog', post.slug), { recursive: true })
  writeFileSync(path.join(at('blog', post.slug), 'index.html'), pageHtml({ head, body }))
}

// The blog list page
{
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': blogId,
        url: absoluteUrl('/blog/'),
        name: `${SITE.name} Blog`,
        description: SITE.blog.description,
        inLanguage: SITE.language,
        publisher: { '@id': ids.publisher },
        blogPost: posts.map((post) => ({
          '@type': 'BlogPosting',
          headline: post.title,
          url: post.url,
          datePublished: post.date,
        })),
      },
      publisherEntity(),
      breadcrumbList([
        { name: 'Home', url: absoluteUrl('/') },
        { name: 'Blog', url: absoluteUrl('/blog/') },
      ]),
    ],
  }

  const head = headTags({
    title: SITE.blog.seoTitle,
    description: SITE.blog.description,
    path: '/blog/',
    image: defaultImage,
    imageAlt: SITE.blog.imageAlt,
    jsonLd,
  })

  mkdirSync(at('blog'), { recursive: true })
  writeFileSync(at('blog', 'index.html'), pageHtml({ head, body: renderBlogIndex({ cards, blog: SITE.blog }) }))

  const titleLength = lengthOf(SITE.blog.seoTitle)
  const descriptionLength = lengthOf(SITE.blog.description)
  if (titleLength > 60) report.warn(`src/data/site.js: blog seoTitle is ${titleLength} characters (aim for 60 or less)`)
  if (descriptionLength > 160) report.warn(`src/data/site.js: blog description is ${descriptionLength} characters (aim for 160 or less)`)
}

// ---------- sitemap, robots, feed, post list for the home page ----------

mkdirSync(at('public'), { recursive: true })
writeFileSync(at('public', 'sitemap.xml'), sitemapXml(posts))
writeFileSync(at('public', 'robots.txt'), robotsTxt())
writeFileSync(at('public', 'feed.xml'), feedXml(posts))
writeFileSync(at('src', 'data', 'posts.generated.json'), JSON.stringify(cards, null, 2) + '\n')

// ---------- report ----------

console.log(`\nBlog: ${posts.length} posts built into blog/  (site address: ${SITE.url})`)
for (const post of posts) {
  console.log(
    `  ${post.path}  ${post.words} words, ${post.readingMinutes} min, ` +
      `title ${lengthOf(post.seoTitle)} / description ${lengthOf(post.description)} characters`,
  )
}
if (report.warnings.length) {
  console.log('\nSEO notes:\n' + report.warnings.map((message) => `  ! ${message}`).join('\n'))
}
console.log('')
