// Site-wide settings. Read by the build scripts (Node) and by a few components (the site name).
//
// The web address is picked in this order:
//   1. SITE_URL, if you set it (on your host or in the terminal)
//   2. On Netlify: the site's main address, which Netlify fills in by itself. It is your custom
//      domain once you add one, and your-site.netlify.app until then.
//   3. DEFAULT_URL below. Put your real address there (no slash at the end) if you deploy
//      somewhere else. Canonical links, social previews, sitemap.xml and the RSS feed all use it.
const DEFAULT_URL = 'https://example.com'

const env = typeof process !== 'undefined' ? process.env : {}
const onNetlify = env.NETLIFY === 'true'
const url = (env.SITE_URL || (onNetlify && env.URL) || DEFAULT_URL).replace(/\/+$/, '')

export const SITE = {
  name: "Anica's Little Bookshelf",
  url,
  urlIsPlaceholder: url === 'https://example.com',
  // Netlify deploy previews and branch deploys are test copies of the site: they get "noindex" so
  // Google does not list them next to the real one.
  indexable: !onNetlify || env.CONTEXT === 'production',
  author: 'Anica Barrios',
  // Links to your other pages that are really you: Amazon Author Central page, Pinterest,
  // Instagram, Facebook page... Put the full addresses in this list. They go into the structured
  // data, which helps search engines and AI assistants see that these pages are the same author.
  sameAs: [],
  // robots.txt: AI assistants and AI search (ChatGPT search, Claude search) are always allowed, so
  // they can find your pages and link to them in answers. This setting is only for AI TRAINING
  // (GPTBot, ClaudeBot): true lets them use your pages to train new models, false asks them not to.
  allowAiTraining: true,
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
