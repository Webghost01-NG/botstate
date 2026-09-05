import PageShell from '../components/PageShell';
export default function Agent() {
  return <PageShell title="Catalog assistant" intro="Rule-based recommendations over sample data."><section className="review-card"><h2>Model status</h2><p>No independently evaluated appraisal model, accuracy statistic or reputation score is available.</p><h2>Oracle status</h2><p>Signing is disabled. The exposed fallback key must not be reused.</p><h2>Verification</h2><p>The existing AgentActionLog authorizes callers but does not verify typed valuation signatures. New contract features require a separately authorized deployment.</p></section></PageShell>;
}
