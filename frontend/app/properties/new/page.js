import PageShell from '../../components/PageShell';
export default function NewProperty() {
  return <PageShell title="Property registration" intro="Registration is temporarily unavailable.">
    <section className="review-notice"><h2>No registration fee is collected</h2><p>The previous payment flow did not register a property or create tokens. It has been removed.</p></section>
    <section className="review-card"><h2>Before registration can reopen</h2><p>A verified property record, authorized registry transaction, token-factory receipt and secure administration must be connected. The current registry and factory restrict creation to their owner.</p><button className="btn btn-outline" disabled>Registration unavailable</button></section>
  </PageShell>;
}
