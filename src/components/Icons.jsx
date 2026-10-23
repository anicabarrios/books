const STAR_PATH =
  'M12 2 l2.9 6.9 7.1 .6 -5.4 4.7 1.7 7 -6.3 -3.8 -6.3 3.8 1.7 -7 -5.4 -4.7 7.1 -.6 z'

// Logo mark: a crayon scribbling a blue wave, with a little sparkle. The same drawing is in
// public/favicon.svg, so change both if you change one.
export function LogoIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3.5 21.2 q2.2 -3.2 4.4 0 t4.4 0 t4.4 0 t4.4 0"
        fill="none"
        stroke="#3F86E8"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <g
        transform="rotate(40 12 12)"
        stroke="#26314F"
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path d="M9 4 H15 V16.5 L13.2 21 H10.8 L9 16.5 Z" fill="#FF6F5B" />
        <rect x="9" y="7.5" width="6" height="5.5" fill="#FFFFFF" />
      </g>
      <path
        d="M4.6 1.6 L5.5 3.9 L7.8 4.8 L5.5 5.7 L4.6 8 L3.7 5.7 L1.4 4.8 L3.7 3.9 Z"
        fill="#FFFFFF"
        stroke="#26314F"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function StarIcon({ color = '#F2A900', className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" aria-hidden="true">
      <path d={STAR_PATH} fill={color} />
    </svg>
  )
}

export function ExternalIcon() {
  return (
    <svg className="icon-external" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 17 L17 7 M8 7 h9 v9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
