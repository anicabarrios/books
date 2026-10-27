# Adding a book

1. Put the cover JPG in [`public/covers/`](../public/covers/), for example `public/covers/my_book.jpg`.
2. Run `npm run covers`. It makes the small WebP versions and prints the line to paste in the next step. The build runs it too, so a cover can never go live without them.
3. Add the Amazon link to `AMAZON` and one object to `BOOKS` in [`src/data/content.js`](../src/data/content.js). Copy an existing entry; the comments in the file explain each field.

| Field | Meaning |
| --- | --- |
| `id` | Used in links: `(book:cute-animals)` in blog posts and `book:` in a post's front matter |
| `ages` | Written like `Ages 3–6`. The site reads the numbers from it |
| `tone` | Card color: `sky` or `butter` |
| `character` | The little drawing used when there is no cover: `puppy` or `bear` |
| `languages` | What the book is written in (`sr` is Serbian) |
| `cover` | `cover('file_name_without_extension', widthInPixels, heightInPixels)`, or `null` |

The hero shelf, the book cards, the buttons at the bottom, the structured data for Google and the "Ideas to go with it" links all update on their own.
