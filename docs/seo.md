# SEO and AI crawlers

## What every page gets

- Real text in the HTML (the site is prerendered at build time), one `<h1>` per page, headings in order.
- Unique title, description, canonical link, Open Graph and Twitter tags.
- Structured data (JSON-LD): website, publisher and author, the book list (`CollectionPage` + `Book`), `Blog`, `BlogPosting` and breadcrumbs.
- `sitemap.xml`, `robots.txt` and an RSS feed (`feed.xml`), all written by the build.
- Fast loading: fonts served from the site itself, covers as small WebP files with sizes set, only the first covers load eagerly.
- Links to other sites open in a new tab with `rel="noopener noreferrer"`. Amazon links that carry an affiliate `tag=` also get `sponsored`, which is what Google asks for.

## AI assistants

There is no meta tag that makes an AI assistant find a site. What counts is that crawlers may read the pages and that the content is clear and original.

[`robots.txt`](../scripts/lib/outputs.mjs) names the crawlers:

| Crawlers | Purpose | Default |
| --- | --- | --- |
| `OAI-SearchBot`, `ChatGPT-User`, `Claude-SearchBot`, `Claude-User` | AI search and assistants, so pages can be found and linked in answers | Allowed |
| `GPTBot`, `ClaudeBot` | Training of AI models | Allowed. Set `allowAiTraining: false` in [`src/data/site.js`](../src/data/site.js) to block them |

OpenAI needs about a day to pick up changes to `robots.txt`.

No `llms.txt` file is included: Google says it does not use one, and neither OpenAI nor Anthropic has confirmed that it reads one.

## Author identity

`sameAs` in [`src/data/site.js`](../src/data/site.js) takes the full addresses of the Amazon Author Central page and social profiles. They go into the structured data so search engines and AI assistants can tell that the profiles and the site belong to the same author.

## Search Console

1. Add the domain as a **Domain** property in [Google Search Console](https://search.google.com/search-console) and verify it with the TXT record at the domain registrar.
2. Submit `https://www.anicasbookshelf.com/sitemap.xml` under **Sitemaps**.
3. Use **URL Inspection, Request indexing** for the home page and each post.
