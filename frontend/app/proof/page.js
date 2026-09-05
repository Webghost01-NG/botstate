'use client';
import { useState } from 'react';
import PageShell from '../components/PageShell';
import { deployments, EXPLORER } from '../utils/chain.mjs';
export default function Proof() {
  const [records,setRecords] = useState(deployments);
  const [status,setStatus] = useState('Repository records — not yet checked against RPC.');
  const [busy,setBusy] = useState(false);
  async function verify() {
    setBusy(true); setRecords(deployments); setStatus('Checking mainnet receipts and deployed code…');
    try {
      const response = await fetch('/api/protocol', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setRecords(data.records); setStatus('Check complete. Receipt and code presence do not constitute a security audit or prove a token purchase.');
    } catch (error) { setStatus(error.message); }
    finally { setBusy(false); }
  }
  return <PageShell title="Deployment records" intro="BOT Chain mainnet · Chain 677. Original transaction records are preserved.">
    <button className="btn btn-primary" onClick={verify} disabled={busy}>{busy ? 'Checking…' : 'Verify with mainnet RPC'}</button><p role="status">{status}</p>
    <div className="review-grid">{records.map(r => <section className="review-card" key={r.name}><h2>{r.name}</h2><p>{r.status || 'Repository record — unverified'}</p><p>{r.address}</p><p>Recorded block: {r.block}</p><a href={EXPLORER + '/tx/' + r.txHash} target="_blank" rel="noreferrer">Open original transaction</a></section>)}</div>
  </PageShell>;
}
