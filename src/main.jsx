import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.jsx'
import posts from './data/posts.generated.json'
import './styles/index.css'
import './menu.js'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App posts={posts} />
  </StrictMode>
)

// A production build already has the whole page inside #root (see vite.config.js), so React only
// attaches to it. During `npm run dev` the div is empty and React draws the page itself.
if (root.hasChildNodes()) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
