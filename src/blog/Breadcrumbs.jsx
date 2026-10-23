// The last item is the current page, so it is plain text instead of a link.
export default function Breadcrumbs({ trail }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1
          return (
            <li key={item.label} {...(isLast ? { 'aria-current': 'page' } : {})}>
              {isLast || !item.href ? item.label : <a href={item.href}>{item.label}</a>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
