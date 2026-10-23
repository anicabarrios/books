import AmazonLink from './AmazonLink.jsx'
import { AMAZON } from '../data/content.js'

export default function CtaBand() {
  return (
    <section className="cta">
      <div className="cta__inner">
        <h2>Ready to color?</h2>
        <p>Both books are on Amazon, one click away.</p>
        <div className="cta__actions">
          <AmazonLink className="btn btn--butter btn--lg" href={AMAZON.cuteAnimals}>
            Cute Animals &amp; Puppies
          </AmazonLink>
          <AmazonLink className="btn btn--light btn--lg" href={AMAZON.learnSerbian}>
            Learn Serbian with Animals
          </AmazonLink>
        </div>
      </div>
    </section>
  )
}
