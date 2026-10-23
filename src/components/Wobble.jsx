import { Fragment } from 'react'

// Puts every word in its own box so the CSS can tilt the words a little, like hand lettering.
// The heading still reads as normal text to search engines and screen readers.
export default function Wobble({ text }) {
  return text.split(' ').map((word, index) => (
    <Fragment key={index}>
      {index > 0 && ' '}
      <span className="wobble__word">{word}</span>
    </Fragment>
  ))
}
