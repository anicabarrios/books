import { renderToStaticMarkup } from 'react-dom/server'
import ArticlePage from './ArticlePage.jsx'
import BlogIndexPage from './BlogIndexPage.jsx'

// Bundled and called by scripts/build-blog.mjs. Turns the React pages into plain HTML strings.
export const renderArticle = (props) => renderToStaticMarkup(<ArticlePage {...props} />)
export const renderBlogIndex = (props) => renderToStaticMarkup(<BlogIndexPage {...props} />)
