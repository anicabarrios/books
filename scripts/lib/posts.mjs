// Reads content/blog/*.md, checks the front matter, and works out everything a page needs
// (reading time, table of contents, share picture...). Also prints the "SEO notes".
import matter from 'gray-matter'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { SITE } from '../../src/data/site.js'
import { lengthOf } from './html.mjs'
import { plainWords, renderMarkdown, slugify } from './markdown.mjs'
import { at } from './paths.mjs'

const REQUIRED = ['title', 'description', 'date', 'tag', 'tone', 'art', 'book', 'excerpt', 'imageAlt']

function isoDate(value, label, file, report) {
  const text = value instanceof Date ? value.toISOString().slice(0, 10) : String(value ?? '')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    report.error(`${file}: "${label}" must look like 2026-10-21 (got "${text}")`)
  }
  return text
}

export function readPosts({ books, report }) {
  const contentDir = at('content', 'blog')
  if (!existsSync(contentDir)) {
    console.error('Missing folder content/blog/ (the Markdown posts live there).')
    process.exit(1)
  }

  const parsed = readdirSync(contentDir)
    .filter((name) => name.endsWith('.md'))
    .sort()
    .map((file) => {
      const { data, content } = matter(readFileSync(path.join(contentDir, file), 'utf8'))
      return { file, data, content }
    })
  const slugOf = ({ file, data }) => String(data.slug || file.replace(/\.md$/, ''))
  const slugs = new Set(parsed.map(slugOf))

  const posts = parsed.map((entry) => {
    const { file, data, content } = entry
    for (const field of REQUIRED) {
      if (!data[field]) report.error(`${file}: missing "${field}" in the front matter (the --- block at the top)`)
    }

    const slug = slugOf(entry)
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
      report.error(`${file}: slug "${slug}" should use only lowercase letters, numbers and hyphens`)
    }

    const book = books.find((item) => item.id === data.book)
    if (!book) report.error(`${file}: unknown book "${data.book}". Use one of: ${books.map((b) => b.id).join(', ')}`)

    const { html, toc, headings } = renderMarkdown(content, { file, slugs, books, report })
    const words = plainWords(content).length
    const date = isoDate(data.date, 'date', file, report)
    const updated = data.updated ? isoDate(data.updated, 'updated', file, report) : date
    const hasOwnImage = existsSync(at('public', 'og', `${slug}.png`))

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
      keywords: Array.isArray(data.keywords) ? data.keywords.map(String) : [],
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
  return posts
}

// Warnings only: the build still works, but these are the things that help a post rank.
export function checkSeo(posts, report) {
  for (const post of posts) {
    const where = post.file
    const titleLength = lengthOf(post.seoTitle)
    const descriptionLength = lengthOf(post.description)
    if (titleLength > 60) report.warn(`${where}: seoTitle is ${titleLength} characters. Google usually cuts titles after about 60.`)
    if (titleLength < 30) report.warn(`${where}: seoTitle is only ${titleLength} characters. Aim for 40-60.`)
    if (descriptionLength > 160) report.warn(`${where}: description is ${descriptionLength} characters. Aim for 120-160.`)
    if (descriptionLength < 70) report.warn(`${where}: description is only ${descriptionLength} characters. Aim for 120-160.`)
    if (post.words < 600) report.warn(`${where}: only ${post.words} words. Posts under about 600 words rarely rank.`)
    if (post.headings.filter((h) => h.depth === 2).length < 3) {
      report.warn(`${where}: fewer than 3 "##" sections. Use headings to break up the text.`)
    }

    if (!post.keyword) {
      report.warn(`${where}: no "keyword" in the front matter. Add the one phrase this post should rank for.`)
      continue
    }
    const keyword = post.keyword.toLowerCase()
    const intro = plainWords(post.bodyHtml.replace(/<h[1-6][^>]*>.*?<\/h[1-6]>/g, ' '))
      .slice(0, 100)
      .join(' ')
      .toLowerCase()
    const missing = []
    if (!post.seoTitle.toLowerCase().includes(keyword)) missing.push('title')
    if (!post.title.toLowerCase().includes(keyword)) missing.push('H1')
    if (!post.description.toLowerCase().includes(keyword)) missing.push('description')
    if (!post.slug.includes(slugify(keyword))) missing.push('URL')
    if (!intro.includes(keyword)) missing.push('first 100 words')
    if (missing.length) report.warn(`${where}: main keyword "${post.keyword}" is not in the ${missing.join(', ')}`)
  }
}
