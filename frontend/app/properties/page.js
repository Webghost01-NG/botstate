import PageShell from '../components/PageShell';
import PropertyCard from '../components/PropertyCard';
import properties from '../data/properties.json';
export default function Properties() {
  return <PageShell title="Sample property catalog" intro="Illustrative data. These entries are not verified token listings and cannot be purchased."><div className="review-grid">{properties.map(p => <PropertyCard key={p.id} property={p} />)}</div></PageShell>;
}
