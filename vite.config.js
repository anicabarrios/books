import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SITE } from './src/data/site.js'
import { homeHead } from './scripts/home-seo.mjs'

const root = path.dirname(fileURLToPath(import.meta.url))

function pages() {
  const input = { main: path.join(root, 'index.html') }
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

function homeSeo() {
  return {
    name: 'home-seo',
    configResolved(config) {
      if (config.command === 'build' && SITE.urlIsPlaceholder && !process.env.ALLOW_PLACEHOLDER_URL) {
        throw new Error(
          'Your website address is not set yet. Canonical links and sitemap.xml would point at ' +
            SITE.url +
            '.\nSet DEFAULT_URL in src/data/site.js, or SITE_URL on your host (for example https://yourname.com), then build again.',
        )
      }
    },
    transformIndexHtml(html) {
      return html.replace(/<!-- home-seo:[\s\S]*?<!-- \/home-seo -->/, homeHead())
    },
  }
}

export default defineConfig({
  plugins: [react(), homeSeo()],
  build: { rollupOptions: { input: pages() } },
})
