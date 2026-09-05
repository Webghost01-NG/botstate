import Link from 'next/link';
import PageShell from '../components/PageShell';
export default function Demo() {
  return <PageShell title="Product walkthrough" intro="Illustrative only. These steps do not execute transactions or establish property ownership.">
    <div className="review-grid">{[['1. Discover','Browse sample property records.'],['2. Compare','Use rule-based catalog recommendations.'],['3. Verify','Inspect deployment records and live RPC checks.']].map(([title,body]) => <section className="review-card" key={title}><h2>{title}</h2><p>{body}</p></section>)}</div>
    <section className="review-notice"><p>Purchases, registration and dividend payouts are not available. No transaction hash, signature or payout is simulated as a confirmed result.</p></section>
    <Link href="/proof" className="btn btn-primary">View deployment records</Link>
  </PageShell>;
}
