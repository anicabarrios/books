// Builds the blog.
//
//   content/blog/*.md   ->  blog/<slug>/index.html   one real HTML page per post
//                           blog/index.html          the blog list page (/blog/)
//                           public/sitemap.xml, public/robots.txt
//                           src/data/posts.generated.json   post cards for the home page
//
// Run with `npm run blog`. It also runs by itself before `npm run dev` and `npm run build`.
// Do not edit anything inside blog/ by hand: it is rebuilt from content/blog/ every time.

import { build as bundle } from 'esbuild'
import matter from 'gray-matter'
import { Marked } from 'marked'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { BOOKS } from '../src/data/content.js'
import { SITE } from '../src/data/site.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const at = (...parts) => path.join(root, ...parts)

const errors = []
const warnings = []

// ---------- small helpers ----------

const esc = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

// JSON for a <script type="application/ld+json"> tag. "<" is escaped so text can never close the tag.
const jsonForHtml = (value) => JSON.stringify(value).replace(/</g, '\\u003c')

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

function isoDate(value, label, file) {
  const text = value instanceof Date ? value.toISOString().slice(0, 10) : String(value ?? '')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    errors.push(`${file}: "${label}" must look like 2026-10-21 (got "${text}")`)
  }
  return text
}

const plainWords = (markdown) =>
  markdown
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`|\-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)

// ---------- Markdown -> HTML ----------

function renderMarkdown(markdown, file, slugs) {
  const marked = new Marked({ gfm: true })
  const tokens = marked.lexer(markdown)

  // Give every heading a unique id (for the table of contents and "jump to" links).
  const used = new Set()
  const toc = []
  const headings = []
  for (const token of tokens) {
    if (token.type !== 'heading') continue
    const plain = token.text.replace(/[*_`]/g, '')
    // "1. Color place cards" -> "color-place-cards". An id may not start with a digit.
    let id = slugify(plain.replace(/^\d+\.\s+/, '')) || 'section'
    if (/^\d/.test(id)) id = `section-${id}`
    while (used.has(id)) id += '-2'
    used.add(id)
    token.id = id
    headings.push({ depth: token.depth, text: plain })
    if (token.depth === 1) {
      errors.push(`${file}: do not use "# Heading" in the text. The page title is the H1 already; start with "##".`)
    }
    if (token.depth === 2) toc.push({ id, text: plain })
  }

  marked.use({
    renderer: {
      heading(token) {
        const inner = this.parser.parseInline(token.tokens)
        return `<h${token.depth} id="${token.id}">${inner}</h${token.depth}>\n`
      },
      link(token) {
        const inner = this.parser.parseInline(token.tokens)
        let href = token.href

        // [text](book:learn-serbian) uses the Amazon link from src/data/content.js
        if (href.startsWith('book:')) {
          const book = BOOKS.find((item) => item.id === href.slice(5))
          if (!book) {
            errors.push(`${file}: unknown book in link "${href}". Use one of: ${BOOKS.map((b) => b.id).join(', ')}`)
            href = '#'
          } else {
            href = book.href
          }
        }

        const title = token.title ? ` title="${esc(token.title)}"` : ''
        const isExternal = /^https?:\/\//i.test(href) && !href.startsWith(SITE.url)
        let attrs = ''
        if (isExternal) {
          // Affiliate links (Amazon "tag=") are marked sponsored, as search engines ask
          const sponsored = /amazon\./i.test(href) && /[?&]tag=/.test(href)
          attrs = ` target="_blank" rel="${sponsored ? 'sponsored ' : ''}noopener noreferrer"`
        }
        return `<a href="${esc(href)}"${title}${attrs}>${inner}</a>`
      },
    },
  })

  let html = marked.parser(tokens)

  // Wide tables scroll inside their own box instead of stretching the page on phones.
  html = html
    .replace(
      /<table>/g,
      '<section class="table-wrap" aria-label="Table, scrolls sideways on small screens" tabindex="0"><table>',
    )
    .replace(/<\/table>/g, '</table></section>')

  // Every link to another post must point at a post that exists.
  for (const match of html.matchAll(/href="(\/blog\/[^"#?]*)/g)) {
    const target = match[1]
    const targetSlug = target.replace(/^\/blog\//, '').replace(/\/$/, '')
    if (targetSlug && !slugs.has(targetSlug)) {
      errors.push(`${file}: link to "${target}" does not match any post in content/blog/`)
    }
  }

  return { html, toc, headings }
}

// ---------- read the posts ----------

const contentDir = at('content', 'blog')
if (!existsSync(contentDir)) {
  console.error('Missing folder content/blog/ (the Markdown posts live there).')
  process.exit(1)
}

const files = readdirSync(contentDir)
  .filter((name) => name.endsWith('.md'))
  .sort()
const parsed = files.map((file) => {
  const { data, content } = matter(readFileSync(path.join(contentDir, file), 'utf8'))
  return { file, data, content }
})
const slugs = new Set(parsed.map(({ file, data }) => String(data.slug || file.replace(/\.md$/, ''))))

const REQUIRED = ['title', 'description', 'date', 'tag', 'tone', 'art', 'book', 'excerpt', 'imageAlt']

const posts = parsed.map(({ file, data, content }) => {
  for (const field of REQUIRED) {
    if (!data[field]) errors.push(`${file}: missing "${field}" in the front matter (the --- block at the top)`)
  }

  const slug = String(data.slug || file.replace(/\.md$/, ''))
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    errors.push(`${file}: slug "${slug}" should use only lowercase letters, numbers and hyphens`)
  }

  const book = BOOKS.find((item) => item.id === data.book)
  if (!book) errors.push(`${file}: unknown book "${data.book}". Use one of: ${BOOKS.map((b) => b.id).join(', ')}`)

  const { html, toc, headings } = renderMarkdown(content, file, slugs)
  const words = plainWords(content).length
  const date = isoDate(data.date, 'date', file)
  const updated = data.updated ? isoDate(data.updated, 'updated', file) : date

  const hasOwnImage = existsSync(at('public', 'og', `${slug}.png`))
  const keywords = Array.isArray(data.keywords) ? data.keywords.map(String) : []

  return {
    file,
    slug,
    path: `/blog/${slug}/`,
    url: `${SITE.url}/blog/${slug}/`,
    title: String(data.title ?? ''),
    seoTitle: String(data.seoTitle || data.title || ''),
    description: String(data.description ?? ''),
    excerpt: String(data.excerpt ?? ''),
    tag: String(data.tag ?? ''),
    tone: data.tone,
    art: data.art,
    imageAlt: String(data.imageAlt ?? ''),
    image: `${SITE.url}/og/${hasOwnImage ? slug : 'default'}.png`,
    featured: Boolean(data.featured),
    keyword: data.keyword ? String(data.keyword) : '',
    keywords,
    related: Array.isArray(data.related) ? data.related.map(String) : null,
    book,
    date,
    updated,
    words,
    readingMinutes: Math.max(1, Math.ceil(words / 200)),
    toc,
    headings,
    bodyHtml: html,
  }
})

posts.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))

if (!posts.some((post) => post.featured) && posts[0]) posts[0].featured = true

// ---------- SEO checks (warnings only) ----------

const lengthOf = (text) => [...text].length
for (const post of posts) {
  const where = post.file
  const titleLength = lengthOf(post.seoTitle)
  const descriptionLength = lengthOf(post.description)
  if (titleLength > 60) warnings.push(`${where}: seoTitle is ${titleLength} characters. Google usually cuts titles after about 60.`)
  if (titleLength < 30) warnings.push(`${where}: seoTitle is only ${titleLength} characters. Aim for 40-60.`)
  if (descriptionLength > 160) warnings.push(`${where}: description is ${descriptionLength} characters. Aim for 120-160.`)
  if (descriptionLength < 70) warnings.push(`${where}: description is only ${descriptionLength} characters. Aim for 120-160.`)
  if (post.words < 600) warnings.push(`${where}: only ${post.words} words. Posts under about 600 words rarely rank.`)
  if (post.headings.filter((h) => h.depth === 2).length < 3) warnings.push(`${where}: fewer than 3 "##" sections. Use headings to break up the text.`)

  if (post.keyword) {
    const keyword = post.keyword.toLowerCase()
    const intro = plainWords(post.bodyHtml.replace(/<h[1-6][^>]*>.*?<\/h[1-6]>/g, ' ')).slice(0, 100).join(' ').toLowerCase()
    const missing = []
    if (!post.seoTitle.toLowerCase().includes(keyword)) missing.push('title')
    if (!post.title.toLowerCase().includes(keyword)) missing.push('H1')
    if (!post.description.toLowerCase().includes(keyword)) missing.push('description')
    if (!post.slug.includes(slugify(keyword))) missing.push('URL')
    if (!intro.includes(keyword)) missing.push('first 100 words')
    if (missing.length) warnings.push(`${where}: main keyword "${post.keyword}" is not in the ${missing.join(', ')}`)
  } else {
    warnings.push(`${where}: no "keyword" in the front matter. Add the one phrase this post should rank for.`)
  }
}

if (!existsSync(at('public', 'og', 'default.png'))) {
  warnings.push('public/og/default.png is missing. Social previews need a 1200x630 image.')
}
if (SITE.urlIsPlaceholder) {
  warnings.push(
    `Your website address is not set. Canonical links, social previews and sitemap.xml use ${SITE.url}.\n` +
      '   Set DEFAULT_URL in src/data/site.js (or SITE_URL on your host) before you deploy.',
  )
}

if (errors.length) {
  console.error('\nBlog build stopped:\n' + errors.map((message) => `  x ${message}`).join('\n') + '\n')
  process.exit(1)
}

// ---------- page template ----------

const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700&display=swap'

function pageHtml({ seoTitle, ogTitle, description, urlPath, image, imageAlt, type, extraMeta = '', jsonLd, body }) {
  const canonical = `${SITE.url}${urlPath}`
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>${esc(seoTitle)}</title>
    <meta name="description" content="${esc(description)}" />
    <link rel="canonical" href="${esc(canonical)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="author" content="${esc(SITE.author)}" />
    <meta name="theme-color" content="${SITE.themeColor}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

    <meta property="og:type" content="${type}" />
    <meta property="og:site_name" content="${esc(SITE.name)}" />
    <meta property="og:locale" content="${SITE.locale}" />
    <meta property="og:title" content="${esc(ogTitle)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${esc(canonical)}" />
    <meta property="og:image" content="${esc(image)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${esc(imageAlt)}" />${extraMeta}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(ogTitle)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${esc(image)}" />
    <meta name="twitter:image:alt" content="${esc(imageAlt)}" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="${FONTS_URL}" rel="stylesheet" />
    <link rel="stylesheet" href="/src/styles.css" />

    <script type="application/ld+json">${jsonForHtml(jsonLd)}</script>
  </head>
  <body>
${body}
    <script type="module" src="/src/blog-menu.js"></script>
  </body>
</html>
`
}

const publisher = {
  '@type': 'Organization',
  name: SITE.name,
  url: `${SITE.url}/`,
  logo: { '@type': 'ImageObject', url: `${SITE.url}/logo-512.png`, width: 512, height: 512 },
}

const breadcrumbList = (trail) => ({
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
})

// ---------- render with the site's React components ----------

const renderFile = at('node_modules', '.cache', 'blog', 'render.mjs')
await bundle({
  entryPoints: [at('src', 'blog', 'render.jsx')],
  outfile: renderFile,
  bundle: true,
  platform: 'node',
  format: 'esm',
  jsx: 'automatic',
  packages: 'external',
  logLevel: 'error',
})
const { renderArticle, renderBlogIndex } = await import(pathToFileURL(renderFile).href)

const cards = posts.map((post) => ({
  id: post.slug,
  featured: post.featured,
  tag: post.tag,
  tone: post.tone,
  art: post.art,
  title: post.title,
  excerpt: post.excerpt,
  href: post.path,
  bookLabel: `Get ${post.book.title}`,
  bookHref: post.book.href,
}))
const cardOf = (slug) => cards.find((card) => card.id === slug)

// ---------- write the pages ----------

rmSync(at('blog'), { recursive: true, force: true })

for (const post of posts) {
  const others = posts.filter((other) => other.slug !== post.slug)
  const relatedPosts = post.related
    ? post.related.map((slug) => posts.find((other) => other.slug === slug)).filter(Boolean)
    : others.slice(0, 2)
  const related = relatedPosts.map((other) => cardOf(other.slug))

  // React writes dateTime; HTML attribute names are lowercase.
  const body = renderArticle({
    post: { ...post, bodyHtml: post.bodyHtml },
    related,
    book: post.book,
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
        author: { '@type': 'Person', name: SITE.author, url: `${SITE.url}/#about` },
        publisher,
        isPartOf: { '@type': 'Blog', name: `${SITE.name} Blog`, url: `${SITE.url}/blog/` },
        articleSection: post.tag,
        keywords: post.keywords.join(', '),
        inLanguage: SITE.language,
        wordCount: post.words,
      },
      breadcrumbList([
        { name: 'Home', url: `${SITE.url}/` },
        { name: 'Blog', url: `${SITE.url}/blog/` },
        { name: post.title, url: post.url },
      ]),
    ],
  }

  const extraMeta = [
    `\n    <meta property="article:published_time" content="${post.date}" />`,
    `\n    <meta property="article:modified_time" content="${post.updated}" />`,
    `\n    <meta property="article:author" content="${esc(SITE.author)}" />`,
    `\n    <meta property="article:section" content="${esc(post.tag)}" />`,
    ...post.keywords.map((keyword) => `\n    <meta property="article:tag" content="${esc(keyword)}" />`),
  ].join('')

  const dir = at('blog', post.slug)
  mkdirSync(dir, { recursive: true })
  writeFileSync(
    path.join(dir, 'index.html'),
    pageHtml({
      seoTitle: post.seoTitle,
      ogTitle: post.title,
      description: post.description,
      urlPath: post.path,
      image: post.image,
      imageAlt: post.imageAlt,
      type: 'article',
      extraMeta,
      jsonLd,
      body,
    }),
  )
}

// The blog list page
{
  const blogImage = `${SITE.url}/og/default.png`
  const body = renderBlogIndex({ cards, blog: SITE.blog })
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': `${SITE.url}/blog/#blog`,
        url: `${SITE.url}/blog/`,
        name: `${SITE.name} Blog`,
        description: SITE.blog.description,
        inLanguage: SITE.language,
        publisher,
        blogPost: posts.map((post) => ({
          '@type': 'BlogPosting',
          headline: post.title,
          url: post.url,
          datePublished: post.date,
        })),
      },
      breadcrumbList([
        { name: 'Home', url: `${SITE.url}/` },
        { name: 'Blog', url: `${SITE.url}/blog/` },
      ]),
    ],
  }
  mkdirSync(at('blog'), { recursive: true })
  writeFileSync(
    at('blog', 'index.html'),
    pageHtml({
      seoTitle: SITE.blog.seoTitle,
      ogTitle: SITE.blog.seoTitle,
      description: SITE.blog.description,
      urlPath: '/blog/',
      image: blogImage,
      imageAlt: SITE.blog.imageAlt,
      type: 'website',
      jsonLd,
      body,
    }),
  )

  const blogTitleLength = lengthOf(SITE.blog.seoTitle)
  const blogDescriptionLength = lengthOf(SITE.blog.description)
  if (blogTitleLength > 60) warnings.push(`src/data/site.js: blog seoTitle is ${blogTitleLength} characters (aim for 60 or less)`)
  if (blogDescriptionLength > 160) warnings.push(`src/data/site.js: blog description is ${blogDescriptionLength} characters (aim for 160 or less)`)
}

// ---------- sitemap, robots, post list for the home page ----------

const newest = posts.reduce((latest, post) => (post.updated > latest ? post.updated : latest), '')
const sitemapUrls = [
  { loc: `${SITE.url}/`, lastmod: newest },
  { loc: `${SITE.url}/blog/`, lastmod: newest },
  ...posts.map((post) => ({ loc: post.url, lastmod: post.updated })),
]
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls
  .map(({ loc, lastmod }) => `  <url>\n    <loc>${esc(loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`)
  .join('\n')}
</urlset>
`
mkdirSync(at('public'), { recursive: true })
writeFileSync(at('public', 'sitemap.xml'), sitemap)
writeFileSync(at('public', 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`)
writeFileSync(at('src', 'data', 'posts.generated.json'), JSON.stringify(cards, null, 2) + '\n')

// ---------- report ----------

console.log(`\nBlog: ${posts.length} posts built into blog/  (site address: ${SITE.url})`)
for (const post of posts) {
  console.log(
    `  ${post.path}  ${post.words} words, ${post.readingMinutes} min, ` +
      `title ${lengthOf(post.seoTitle)} / description ${lengthOf(post.description)} characters`,
  )
}
if (warnings.length) {
  console.log('\nSEO notes:\n' + warnings.map((message) => `  ! ${message}`).join('\n'))
}
console.log('')
