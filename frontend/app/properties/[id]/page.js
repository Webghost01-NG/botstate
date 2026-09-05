import { notFound } from 'next/navigation';
import PageShell from '../../components/PageShell';
import properties from '../../data/properties.json';
import deployment from '../../data/active-deployment.json';
import JudgeClient from '../../judge/JudgeClient';
export default async function PropertyDetail({ params }) {
  const { id } = await params;
  if (id === String(deployment.sample.propertyId)) return <JudgeClient token={deployment.sample.address} />;
  const property = properties.find(p => p.id === id);
  if (!property) notFound();
  return <PageShell title={property.name} intro={property.location + ', ' + property.country}>
    <section className="review-notice"><strong>Sample property — purchases unavailable</strong><p>This record has no verified mapping to an active on-chain listing. No payment can be sent from this page.</p></section>
    <div className="review-grid"><section className="review-card"><h2>Illustrative listing price</h2><p>${Number(property.price).toLocaleString()}</p></section><section className="review-card"><h2>Illustrative yield</h2><p>{property.yield}% — not a verified return.</p></section><section className="review-card"><h2>Appraisal status</h2><p>No independent valuation, confidence score or deed verification is available.</p></section></div>
    <button className="btn btn-outline" disabled>Purchases unavailable</button>
    <p>No rental income is verified for this catalog entry. Do not send funds directly to token or deployment addresses.</p>
  </PageShell>;
}
