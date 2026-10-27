# Adding a blog post

Add a Markdown file to [`content/blog/`](../content/blog/), for example `content/blog/my-new-post.md`. Copy the front matter (the block between the `---` lines) from an existing post and change it.

| Field | Meaning |
| --- | --- |
| `title` | The page heading |
| `seoTitle` | Title in the browser tab and in search results (up to 60 characters) |
| `description` | Search result snippet (120 to 160 characters) |
| `excerpt` | Short text on the blog card |
| `slug` | Optional. The address is `/blog/<slug>/`. Defaults to the file name. Lowercase letters, numbers and dashes only |
| `date`, `updated` | Like `2026-10-21`. Change `updated` when you edit a post later |
| `tag` | The label on the card |
| `tone` | Card color: `mint`, `blush` or `blue` |
| `art` | Card drawing: `puppy`, `bear` or `pumpkin` |
| `imageAlt` | Text description of the card drawing |
| `book` | The `id` of the book to promote under the post |
| `keyword` | The one phrase the post should rank for |
| `featured` | Optional. `true` shows the post as the big card on top. Without it, the newest post is shown big |

## Links inside a post

- Another post: `[text](/blog/other-post-slug/)`
- A book: `[text](book:cute-animals)`. It uses that book's Amazon link.

## Share picture

Optional: `public/og/<slug>.png`, 1200 x 630 pixels. Without it, [`public/og/default.png`](../public/og/default.png) is used.

## Build checks

`npm run build` prints "SEO notes": short warnings if a title is too long, the keyword is missing from the first 100 words, and so on. The build still works with them.

Mistakes that would break a page stop the build with a clear message: missing fields, an unknown book, or a link to a post that does not exist.
