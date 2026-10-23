// Original cartoon characters drawn as inline SVG.

export function Puppy({ className }) {
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true">
      <ellipse cx="46" cy="92" rx="25" ry="46" fill="#B07A52" transform="rotate(16 46 92)" />
      <ellipse cx="154" cy="92" rx="25" ry="46" fill="#B07A52" transform="rotate(-16 154 92)" />
      <circle cx="100" cy="106" r="62" fill="#F3C58F" />
      <ellipse cx="128" cy="68" rx="15" ry="11" fill="#E0A66C" transform="rotate(-20 128 68)" />
      <ellipse cx="100" cy="130" rx="34" ry="26" fill="#FFF4E4" />
      <circle cx="78" cy="100" r="6.5" fill="#26314F" />
      <circle cx="122" cy="100" r="6.5" fill="#26314F" />
      <circle cx="80" cy="98" r="2" fill="#FFFFFF" />
      <circle cx="124" cy="98" r="2" fill="#FFFFFF" />
      <ellipse cx="100" cy="118" rx="11" ry="8" fill="#26314F" />
      <path d="M92 133 q8 15 16 0 z" fill="#FF7A8A" />
      <path
        d="M100 126 v7 M100 133 q-9 8 -19 1 M100 133 q9 8 19 1"
        fill="none"
        stroke="#26314F"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse cx="64" cy="122" rx="9" ry="6" fill="#FF9DA8" opacity="0.6" />
      <ellipse cx="136" cy="122" rx="9" ry="6" fill="#FF9DA8" opacity="0.6" />
    </svg>
  )
}

export function Bear({ className }) {
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="52" cy="54" r="24" fill="#B9835A" />
      <circle cx="148" cy="54" r="24" fill="#B9835A" />
      <circle cx="52" cy="54" r="12" fill="#F0C9A4" />
      <circle cx="148" cy="54" r="12" fill="#F0C9A4" />
      <circle cx="100" cy="108" r="66" fill="#B9835A" />
      <ellipse cx="100" cy="130" rx="32" ry="25" fill="#F6DFC4" />
      <circle cx="76" cy="98" r="6.5" fill="#26314F" />
      <circle cx="124" cy="98" r="6.5" fill="#26314F" />
      <circle cx="78" cy="96" r="2" fill="#FFFFFF" />
      <circle cx="126" cy="96" r="2" fill="#FFFFFF" />
      <ellipse cx="100" cy="118" rx="10" ry="7" fill="#26314F" />
      <path
        d="M100 125 v6 M100 131 q-8 8 -17 1 M100 131 q8 8 17 1"
        fill="none"
        stroke="#26314F"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse cx="62" cy="120" rx="9" ry="6" fill="#FF9DA8" opacity="0.6" />
      <ellipse cx="138" cy="120" rx="9" ry="6" fill="#FF9DA8" opacity="0.6" />
    </svg>
  )
}

export function Pumpkin({ className }) {
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true">
      <path d="M96 56 q-2 -20 16 -28 q3 16 -3 28 z" fill="#4E8A3E" />
      <ellipse cx="62" cy="118" rx="40" ry="56" fill="#F28C28" />
      <ellipse cx="138" cy="118" rx="40" ry="56" fill="#F28C28" />
      <ellipse cx="100" cy="118" rx="44" ry="60" fill="#FFA43D" />
      <path
        d="M70 66 q-26 52 -2 106 M130 66 q26 52 2 106"
        fill="none"
        stroke="#E07414"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="78" cy="112" r="7" fill="#26314F" />
      <circle cx="122" cy="112" r="7" fill="#26314F" />
      <circle cx="80" cy="110" r="2" fill="#FFFFFF" />
      <circle cx="124" cy="110" r="2" fill="#FFFFFF" />
      <path
        d="M76 138 q24 26 48 0"
        fill="none"
        stroke="#26314F"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <ellipse cx="64" cy="132" rx="9" ry="6" fill="#FF8A8A" opacity="0.6" />
      <ellipse cx="136" cy="132" rx="9" ry="6" fill="#FF8A8A" opacity="0.6" />
    </svg>
  )
}

export function Crayons() {
  return (
    <div className="crayons" aria-hidden="true">
      <span style={{ left: 8, top: 22, background: '#FF8F7A', transform: 'rotate(-14deg)' }} />
      <span style={{ left: 24, top: 58, background: '#7FB7F5', transform: 'rotate(4deg)' }} />
      <span style={{ left: 12, top: 92, background: '#8FD6AE', transform: 'rotate(-6deg)' }} />
    </div>
  )
}

export const CHARACTERS = {
  puppy: Puppy,
  bear: Bear,
  pumpkin: Pumpkin,
  crayons: Crayons,
}
