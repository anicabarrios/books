// Small text helpers shared by every build script.

// Makes text safe to put inside an HTML attribute or between tags.
export const esc = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// JSON for a <script type="application/ld+json"> tag. "<" is escaped so text can never close the tag.
export const jsonForHtml = (value) => JSON.stringify(value).replace(/</g, '\\u003c')

// Length as a person counts it (an emoji or an accented letter is one character).
export const lengthOf = (text) => [...text].length
