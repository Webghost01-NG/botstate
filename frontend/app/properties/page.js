import PageShell from '../components/PageShell';
import PropertyCard from '../components/PropertyCard';
import properties from '../data/properties.json';
import Link from 'next/link';
export default function Properties() {
  return <PageShell title="Sample property catalog" intro="Illustrative data. These entries are not verified investments and cannot be purchased."><section className="review-card"><h2>BOTSTATE Sample Residence — mainnet sample</h2><p>Claim 10 free SAMPLE-RWA tokens once per wallet. Gas applies; no real property rights or promised returns.</p><Link className="btn btn-primary" href="/properties/900001">Open sample asset</Link></section><div className="review-grid">{properties.map(p => <PropertyCard key={p.id} property={p} />)}</div></PageShell>;
}
