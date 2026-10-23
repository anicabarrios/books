// Turns the site's own React components into HTML strings, in Node. Used for the blog pages and
// for the home page, so search engines get real text in the HTML instead of an empty <div>.
import { build } from 'esbuild'
import { pathToFileURL } from 'node:url'
import { at } from './paths.mjs'

// Returns { renderHome, renderArticle, renderBlogIndex } (see src/render.jsx).
export async function loadRenderer() {
  const outfile = at('node_modules', '.cache', 'site', 'render.mjs')
  await build({
    entryPoints: [at('src', 'render.jsx')],
    outfile,
    bundle: true,
    platform: 'node',
    format: 'esm',
    jsx: 'automatic',
    packages: 'external', // react etc. are loaded from node_modules, only the site's own files are bundled
    logLevel: 'error',
  })
  // The ?v= part makes Node load the fresh file even when a dev server is already running.
  return import(`${pathToFileURL(outfile).href}?v=${Date.now()}`)
}
