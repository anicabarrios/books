// One place decides how a link to another website is written, for the React pages and for the
// blog posts (scripts/lib/markdown.mjs), so they can never disagree.

export function isExternal(href, ownUrl = '') {
  return /^https?:\/\//i.test(href) && !(ownUrl && href.startsWith(ownUrl))
}

// Links to other websites open in a new tab. Amazon links that carry an affiliate "tag=" are
// marked "sponsored", which is what search engines ask for.
export function outboundProps(href, ownUrl = '') {
  if (!isExternal(href, ownUrl)) return {}
  const sponsored = /amazon\./i.test(href) && /[?&]tag=/.test(href)
  return { target: '_blank', rel: `${sponsored ? 'sponsored ' : ''}noopener noreferrer` }
}
