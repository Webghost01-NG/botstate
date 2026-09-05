import Link from 'next/link';
import PageShell from './components/PageShell';
import PropertyCard from './components/PropertyCard';
import properties from './data/properties.json';
export default function Home() {
  return <PageShell title="Explore fractional real estate." intro="BOTSTATE connects a sample property catalog with transparent contract records on BOT Chain.">
    <section className="review-notice"><strong>Prototype — transactions temporarily unavailable</strong><p>Sample properties are not verified investments. Purchases, registration fees and oracle signing are disabled pending verified contract integration and replacement of exposed signing authority.</p></section>
    <div className="review-actions"><Link className="btn btn-primary" href="/properties">Explore sample properties</Link><Link className="btn btn-outline" href="/proof">Check deployment records</Link></div>
    <div className="review-grid"><section className="review-card"><h2>{properties.length} sample entries</h2><p>No verified assets under management or TVL is reported.</p></section><section className="review-card"><h2>Read-only wallet access</h2><p>Portfolio reads mainnet balances. Browser records are not token ownership.</p></section><section className="review-card"><h2>Transparent recommendations</h2><p>The catalog assistant uses rule-based filters.</p></section></div>
    <h2>Sample catalog</h2><div className="review-grid">{properties.slice(0,3).map(p => <PropertyCard key={p.id} property={p} />)}</div>
  </PageShell>;
}
