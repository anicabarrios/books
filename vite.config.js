import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SITE } from './src/data/site.js'
import { homeHead } from './scripts/home-seo.mjs'
import { loadRenderer } from './scripts/lib/renderer.mjs'

const root = path.dirname(fileURLToPath(import.meta.url))

// The one-page site (index.html), the 404 page and the blog pages in blog/, which
// scripts/build-blog.mjs generates from content/blog/*.md (it runs before `npm run dev` and `npm run build`).
// Every blog page is its own HTML entry, so it is built as a real, separate page.
function pages() {
  const input = { main: path.join(root, 'index.html') }
  if (existsSync(path.join(root, '404.html'))) input.notFound = path.join(root, '404.html')
  const blogDir = path.join(root, 'blog')

  if (existsSync(path.join(blogDir, 'index.html'))) {
    input.blog = path.join(blogDir, 'index.html')
  }
  if (existsSync(blogDir)) {
    for (const entry of readdirSync(blogDir, { withFileTypes: true })) {
      const file = path.join(blogDir, entry.name, 'index.html')
      if (entry.isDirectory() && existsSync(file)) input[`blog-${entry.name}`] = file
    }
  }
  return input
}

const HEAD_MARKERS = /<!-- home-seo:[\s\S]*?<!-- \/home-seo -->/
const EMPTY_ROOT = '<div id="root"></div>'

// Home page, two jobs:
//  1. Adds the SEO tags (title, description, canonical, social cards, structured data).
//  2. In a production build, writes the whole page into the HTML (not only an empty <div>), so
//     search engines, link previews and slow phones get real text. The browser then "hydrates" it
//     (src/main.jsx), which only attaches the clicks and keeps everything else as it is.
// It also refuses to build while the website address is still the placeholder: every canonical
// link would point at example.com and Google would ignore your pages.
// (Only for testing: ALLOW_PLACEHOLDER_URL=1 npm run build.)
function homePage() {
  let isBuild = false
  return {
    name: 'home-page',
    configResolved(config) {
      isBuild = config.command === 'build'
      if (isBuild && SITE.urlIsPlaceholder && !process.env.ALLOW_PLACEHOLDER_URL) {
        console.error(
          '\nYour website address is not set yet. Canonical links and sitemap.xml would point at ' +
            SITE.url +
            '.\nSet DEFAULT_URL in src/data/site.js, or SITE_URL on your host (for example https://yourname.com), then build again.\n',
        )
        process.exit(1)
      }
    },
    transformIndexHtml: {
      order: 'pre',
      async handler(html) {
        if (!HEAD_MARKERS.test(html)) return html // a blog page: already complete
        let page = html.replace(HEAD_MARKERS, homeHead())

        if (isBuild) {
          const { renderHome } = await loadRenderer()
          const posts = JSON.parse(readFileSync(path.join(root, 'src', 'data', 'posts.generated.json'), 'utf8'))
          page = page.replace(EMPTY_ROOT, `<div id="root">${renderHome({ posts })}</div>`)
        }
        return page
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), homePage()],
  build: { rollupOptions: { input: pages() } },
})
