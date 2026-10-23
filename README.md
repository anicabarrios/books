# Anica's Little Bookshelf

A one-page website for the children's books published on Amazon KDP (coloring books and Learn Serbian), with a small blog next to it. Built with React and Vite.

Every page is turned into real HTML when you build, so Google and social networks read the actual text, not an empty page. React then wakes the page up in the browser.

## Start

```bash
npm install
npm run dev        # opens the site on http://localhost:5173
```

Other commands:

| Command | What it does |
| --- | --- |
| `npm run build` | Makes the finished site in `dist/` (upload that folder to your host) |
| `npm run preview` | Shows `dist/` locally, to check the finished site |
| `npm run covers` | Makes small WebP copies of every cover in `public/covers/` |
| `npm run blog` | Builds only the blog pages, sitemap, robots.txt and RSS feed (build and dev already run it) |

Node 20 or newer.

## Before you deploy: set your web address

Canonical links, social previews, the sitemap and the RSS feed all need your real domain. The build stops with a clear message while the placeholder `https://example.com` is still in place.

Two ways to set it, pick one:

- Edit `DEFAULT_URL` at the top of `src/data/site.js` (no slash at the end), or
- Set `SITE_URL` on your host, for example `SITE_URL=https://yourdomain.com` in Netlify, Vercel or Cloudflare Pages.

For a local test build with the placeholder, run `SITE_URL=http://localhost:4173 npm run build`.

## Add a book

1. Put the cover JPG in `public/covers/`, for example `public/covers/my_book.jpg`.
2. Run `npm run covers`. It makes the small WebP versions and prints the line to paste in the next step.
3. Add the Amazon link to `AMAZON` and one object to `BOOKS` in `src/data/content.js`. Copy an existing one, the comments in the file explain each field.

The hero shelf, the book cards, the buttons at the bottom, the structured data for Google and the "Ideas to go with it" links all update on their own.

## Add a blog post

Add a Markdown file to `content/blog/`, for example `content/blog/my-new-post.md`. Copy the top block (between the `---` lines) from an existing post and change it:

- `title`, `seoTitle` (up to 60 characters), `description` (120 to 160 characters), `excerpt`
- `date` like `2026-10-21` (and `updated` when you change a post later)
- `tag`, `tone` (`mint`, `blush` or `blue`), `art` (`puppy`, `bear` or `pumpkin`), `imageAlt`
- `book`: the `id` of the book to promote under the post
- `keyword`: the one phrase the post should rank for

When you build, the terminal prints "SEO notes": short warnings if a title is too long, the keyword is missing from the first 100 words, and so on. Fix them if you want, the build still works. Mistakes that would break a page (missing fields, unknown book, broken link to another post) stop the build with a clear message.

Optional: a share picture for the post at `public/og/<slug>.png` (1200 x 630). Without it, `public/og/default.png` is used.

Link to another post with a normal path, like `[text](/blog/other-post-slug/)`, and to a book with `[text](book:cute-animals)` (it uses that book's Amazon link). The build checks that every post link points at a post that exists.

## What search engines get

- Real text in the HTML of every page, one `<h1>` per page, headings in order.
- Unique title, description, canonical link, Open Graph and Twitter tags on every page.
- Structured data (JSON-LD): website, publisher and author, the book list (`CollectionPage` + `Book`), `Blog`, `BlogPosting`, breadcrumbs.
- `sitemap.xml`, `robots.txt` and an RSS feed (`feed.xml`), all written by the build.
- Fast loading: fonts served from the site itself, covers as small WebP files with sizes set, only the first covers load eagerly.
- Links to other sites open in a new tab with `rel="noopener noreferrer"`. Amazon links that carry an affiliate `tag=` also get `sponsored`, which is what Google asks for. Screen readers hear which book the button is for and that it opens in a new tab.

## Where things live

```
content/blog/        the posts, one Markdown file each
public/              files copied as they are: covers, og pictures, favicon, sitemap...
scripts/             build steps (blog pages, sitemap, covers); scripts/lib has the small helpers
src/data/            the text and data: site.js, content.js (books), holidays.js, games.js, nav.js
src/components/      the React pieces of the home page
src/blog/            the article and blog list pages
src/styles/          the CSS, one file per area; tokens.css has the colors and sizes
src/render.jsx       what the build uses to turn React into HTML
src/menu.js          the phone menu (the same script on the home page and the blog pages)
```

`blog/` and `src/data/posts.generated.json` are made by the build. Don't edit them by hand.

## Change the look

Colors, fonts, spacing, line colors and shadows are variables at the top of `src/styles/tokens.css`. The main button color is `--coral`. Cards are `.pop` in `src/styles/motifs.css`: flat color with a soft shadow and no outline.

## Check these before launch

- The copy about holidays and Serbian words (`src/data/holidays.js`, `WORDS` in `src/data/content.js`, the posts). Read it once and fix anything you would say differently.
- Amazon links in `AMAZON` (`src/data/content.js`).
- Your domain (see above).
