// The <head> tags every page shares: title, description, canonical link, icons, social cards and
// structured data. The home page (scripts/home-seo.mjs) and every blog page (scripts/build-blog.mjs)
// both call headTags(), so the SEO tags are written once.
import { SITE } from '../../src/data/site.js'
import { esc, jsonForHtml } from './html.mjs'

export const absoluteUrl = (urlPath) => `${SITE.url}${urlPath}`

// Tells the CSS that JavaScript is running, before the first paint. The phone menu starts collapsed
// only when it can be opened again, so the page works (and does not jump) either way.
const JS_FLAG = `<script>document.documentElement.classList.add('js')</script>`

/**
 * @param title        text in the browser tab and in Google results (60 characters or less)
 * @param ogTitle      title on social cards (defaults to `title`)
 * @param description  120 to 160 characters
 * @param path         the page's address without the domain, like '/blog/my-post/'.
 *                     Leave it out (the 404 page) and the page gets no canonical link,
 *                     no social cards and no structured data.
 * @param image        full address of the 1200x630 share picture
 * @param article      for blog posts: { published, modified, section, tags }
 * @param jsonLd       the structured data object for this page
 * @param robots       what to tell search engines. Default: index the page.
 *                     Pass 'noindex, follow' to keep a page out of Google (the 404 page).
 */
export function headTags({ title, ogTitle = title, description, path, image, imageAlt, type = 'website', article, jsonLd, robots }) {
  const canonical = path ? absoluteUrl(path) : ''
  // Test copies of the site (Netlify deploy previews) are never indexed, whatever the page asks for.
  const robotsContent = SITE.indexable ? (robots ?? 'index, follow, max-image-preview:large') : 'noindex, nofollow'

  const articleTags = article
    ? [
        `<meta property="article:published_time" content="${article.published}" />`,
        `<meta property="article:modified_time" content="${article.modified}" />`,
        `<meta property="article:author" content="${esc(SITE.author)}" />`,
        `<meta property="article:section" content="${esc(article.section)}" />`,
        ...article.tags.map((tag) => `<meta property="article:tag" content="${esc(tag)}" />`),
      ]
    : []

  const socialTags = canonical
    ? [
        `<meta property="og:type" content="${type}" />`,
        `<meta property="og:site_name" content="${esc(SITE.name)}" />`,
        `<meta property="og:locale" content="${SITE.locale}" />`,
        `<meta property="og:title" content="${esc(ogTitle)}" />`,
        `<meta property="og:description" content="${esc(description)}" />`,
        `<meta property="og:url" content="${esc(canonical)}" />`,
        `<meta property="og:image" content="${esc(image)}" />`,
        `<meta property="og:image:width" content="1200" />`,
        `<meta property="og:image:height" content="630" />`,
        `<meta property="og:image:alt" content="${esc(imageAlt)}" />`,
        ...articleTags,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:title" content="${esc(ogTitle)}" />`,
        `<meta name="twitter:description" content="${esc(description)}" />`,
        `<meta name="twitter:image" content="${esc(image)}" />`,
        `<meta name="twitter:image:alt" content="${esc(imageAlt)}" />`,
      ]
    : []

  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    canonical && `<link rel="canonical" href="${esc(canonical)}" />`,
    `<meta name="robots" content="${robotsContent}" />`,
    // Says the page handles dark mode itself (by looking the same, see tokens.css), so phone
    // browsers do not force a dark version of it.
    `<meta name="color-scheme" content="light dark" />`,
    `<meta name="author" content="${esc(SITE.author)}" />`,
    `<meta name="theme-color" content="${SITE.themeColor}" />`,
    `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />`,
    `<link rel="apple-touch-icon" href="/apple-touch-icon.png" />`,
    `<link rel="alternate" type="application/rss+xml" title="${esc(SITE.name)} blog" href="${esc(absoluteUrl('/feed.xml'))}" />`,
    JS_FLAG,
    ...socialTags,
    jsonLd && `<script type="application/ld+json">${jsonForHtml(jsonLd)}</script>`,
  ]
    .filter(Boolean)
    .join('\n    ')
}
