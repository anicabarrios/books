// Site-wide settings. Read by the build scripts (Node) and by a few components (the site name).
//
// Put your real web address on the DEFAULT_URL line (no slash at the end), or set SITE_URL on
// your host (Netlify, Vercel, Cloudflare Pages...). Canonical links, social previews,
// sitemap.xml and the RSS feed all use it, so it has to be right before you deploy.
const DEFAULT_URL = 'https://example.com'

const env = typeof process !== 'undefined' ? process.env : {}
const url = (env.SITE_URL || DEFAULT_URL).replace(/\/+$/, '')

export const SITE = {
  name: "Anica's Little Bookshelf",
  url,
  urlIsPlaceholder: url === 'https://example.com',
  author: 'Anica Barrios',
  language: 'en-US',
  locale: 'en_US',
  themeColor: '#f2f8ff',

  // The home page (/). Title up to 60 characters, description 120 to 160.
  home: {
    seoTitle: "Kids' Coloring Books & Learn Serbian Books",
    description:
      'Cute coloring books for kids ages 3 to 7 by Anica Barrios: friendly puppies and animals, plus a book to learn Serbian. See both on Amazon.',
    imageAlt: 'A cartoon puppy and a bear with crayons on a sunny yellow background',
  },

  // The blog list page (/blog/)
  blog: {
    seoTitle: "Kids' Coloring Ideas & Serbian Learning Blog",
    h1: 'Coloring ideas, holiday fun and Serbian for kids',
    description:
      'Coloring ideas, holiday activities and easy ways to learn Serbian through animals for kids ages 3 to 7, from the author of Cute Animals & Puppies.',
    intro:
      'Simple activities for curious little hands: friendly holiday coloring, calm things to do at the table and playful ways to learn Serbian with animals. Made for kids ages 3 to 7 and the grown-ups who color with them.',
    imageAlt: 'A cartoon puppy and a bear with crayons on a sunny yellow background',
  },
}
