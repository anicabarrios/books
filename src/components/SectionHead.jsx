// The centered heading that opens a section. `id` is what the section points at with aria-labelledby.
export default function SectionHead({ id, title, children }) {
  return (
    <div className="section-head">
      <h2 id={id}>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  )
}
