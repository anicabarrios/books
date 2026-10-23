// The files search engines and feed readers look for: sitemap.xml, robots.txt and feed.xml.
import { SITE } from '../../src/data/site.js'
import { esc } from './html.mjs'
import { absoluteUrl } from './head.mjs'

export function sitemapXml(posts) {
  const newest = posts.reduce((latest, post) => (post.updated > latest ? post.updated : latest), '')
  const urls = [
    { loc: absoluteUrl('/'), lastmod: newest },
    { loc: absoluteUrl('/blog/'), lastmod: newest },
    ...posts.map((post) => ({ loc: post.url, lastmod: post.updated })),
  ]
  const entries = urls
    .map(({ loc, lastmod }) => `  <url>\n    <loc>${esc(loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`)
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`
}

export const robotsTxt = () => `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap.xml')}\n`

// RSS 2.0, newest post first. Readers and some search tools use it to notice new posts quickly.
export function feedXml(posts) {
  const asRfc822 = (isoDate) => new Date(`${isoDate}T00:00:00Z`).toUTCString()
  const newest = posts[0]?.date ?? new Date().toISOString().slice(0, 10)
  const items = posts
    .map(
      (post) => `    <item>
      <title>${esc(post.title)}</title>
      <link>${esc(post.url)}</link>
      <guid isPermaLink="true">${esc(post.url)}</guid>
      <pubDate>${asRfc822(post.date)}</pubDate>
      <category>${esc(post.tag)}</category>
      <description>${esc(post.excerpt)}</description>
    </item>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE.name)} blog</title>
    <link>${esc(absoluteUrl('/blog/'))}</link>
    <description>${esc(SITE.blog.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${asRfc822(newest)}</lastBuildDate>
    <atom:link href="${esc(absoluteUrl('/feed.xml'))}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`
}
