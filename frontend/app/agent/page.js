import PageShell from '../components/PageShell';
export default function Agent() {
  return <PageShell title="Catalog assistant" intro="Rule-based recommendations over sample data."><section className="review-card"><h2>Model status</h2><p>No independently evaluated appraisal model, accuracy statistic or reputation score is available.</p><h2>Oracle status</h2><p>Automated signing remains disabled.</p><h2>Verification</h2><p>The newly deployed AgentActionLog supports EIP-712 v2 valuation signatures with chain and contract binding, expiry and replay protection. This capability is not evidence of an independently verified appraisal or a submitted attestation.</p></section></PageShell>;
}
