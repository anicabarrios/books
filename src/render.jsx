import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import App from './App.jsx'
import ArticlePage from './blog/ArticlePage.jsx'
import BlogIndexPage from './blog/BlogIndexPage.jsx'

// Bundled and called by the build scripts (scripts/lib/renderer.mjs). It turns the React pages
// into plain HTML strings, so every page has its real text in the HTML.
//
// The home page uses renderToString because the browser then "hydrates" it (src/main.jsx).
// The blog pages are plain HTML with no React in the browser, so renderToStaticMarkup is enough.
export const renderHome = (props) => renderToString(<App {...props} />)
export const renderArticle = (props) => renderToStaticMarkup(<ArticlePage {...props} />)
export const renderBlogIndex = (props) => renderToStaticMarkup(<BlogIndexPage {...props} />)
