// Markdown -> HTML for the blog posts, plus the checks that stop a broken link or a wrong heading
// from reaching the live site.
import { Marked } from 'marked'
import { outboundProps } from '../../src/lib/links.js'
import { SITE } from '../../src/data/site.js'
import { esc } from './html.mjs'

export const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// The words a reader would count (no tags, no link addresses, no Markdown symbols).
export const plainWords = (markdown) =>
  markdown
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`|\-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)

const attributes = (props) => Object.entries(props).map(([name, value]) => ` ${name}="${esc(value)}"`).join('')

/**
 * @param markdown  the post text (without the front matter)
 * @param file      the file name, for error messages
 * @param slugs     every post slug, to check links between posts
 * @param books     BOOKS from src/data/content.js, for [text](book:id) links
 * @param report    where errors go (see report.mjs)
 */
export function renderMarkdown(markdown, { file, slugs, books, report }) {
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
      report.error(`${file}: do not use "# Heading" in the text. The page title is the H1 already; start with "##".`)
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
          const book = books.find((item) => item.id === href.slice(5))
          if (!book) {
            report.error(`${file}: unknown book in link "${href}". Use one of: ${books.map((b) => b.id).join(', ')}`)
            href = '#'
          } else {
            href = book.href
          }
        }

        const title = token.title ? ` title="${esc(token.title)}"` : ''
        return `<a href="${esc(href)}"${title}${attributes(outboundProps(href, SITE.url))}>${inner}</a>`
      },
    },
  })

  let html = marked.parser(tokens)

  // Wide tables scroll inside their own box instead of stretching the page on phones.
  html = html
    .replace(
      /<table>/g,
      '<div class="table-wrap" role="region" aria-label="Table, scrolls sideways on small screens" tabindex="0"><table>',
    )
    .replace(/<\/table>/g, '</table></div>')

  // Every link to another post must point at a post that exists.
  for (const match of html.matchAll(/href="(\/blog\/[^"#?]*)/g)) {
    const target = match[1]
    const targetSlug = target.replace(/^\/blog\//, '').replace(/\/$/, '')
    if (targetSlug && !slugs.has(targetSlug)) {
      report.error(`${file}: link to "${target}" does not match any post in content/blog/`)
    }
  }

  return { html, toc, headings }
}
