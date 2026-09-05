'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import PageShell from '../components/PageShell';
import { connectWallet, getEthereumProvider, switchToBotChainMainnet } from '../utils/web3';
import { estimateStep, EXPOSED_ACCOUNT, readProvider, sameAddress, sendQuotedStep, SOURCE_HASH, STEPS, VERSION, verifyJournal } from '../utils/deployment.mjs';

const STORAGE_KEY = 'botstate-deployment-' + VERSION;
export default function Deploy() {
  const [account, setAccount] = useState('');
  const [journal, setJournal] = useState(null);
  const [verified, setVerified] = useState(null);
  const [quote, setQuote] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('Connect MetaMask, then estimate the first deployment.');
  const [noticeAccepted, setNoticeAccepted] = useState(false);
  const mutex = useRef(false);
  useEffect(() => {
    try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) { setJournal(JSON.parse(saved)); setMessage('Saved transaction references found. Check confirmations to restore verified progress.'); } } catch { setMessage('Saved references could not be read. Import your exported deployment file.'); }
    const changed = () => { setQuote(null); setAccount(''); setNoticeAccepted(false); setMessage('Wallet changed. Reconnect and refresh verification.'); };
    const wallet = getEthereumProvider();
    wallet?.on?.('accountsChanged', changed); wallet?.on?.('chainChanged', changed);
    return () => { wallet?.removeListener?.('accountsChanged', changed); wallet?.removeListener?.('chainChanged', changed); };
  }, []);
  function save(next) {
    setJournal(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { setMessage('Storage unavailable. Download deployment records before leaving.'); }
  }
  async function action(work) {
    if (mutex.current) return;
    mutex.current = true; setBusy(true);
    try { await work(); } catch (error) { setMessage(error.shortMessage || error.message); }
    finally { mutex.current = false; setBusy(false); }
  }
  function connect() { action(async () => {
    const address = await connectWallet();
    await switchToBotChainMainnet();
    setAccount(address); setQuote(null); setVerified(null);
    if (!journal || journal.entries.length === 0) save({ version: VERSION, account: address, entries: [] });
    setMessage('MetaMask connected. Estimate gas to review the next transaction.');
  }); }
  function estimate() { action(async () => {
    setQuote(null); setVerified(null);
    const provider = readProvider();
    try { const result = await estimateStep(journal, provider); setVerified(result.verified); setQuote(result.quote); setMessage(result.quote ? 'Review this zero-value transaction. MetaMask will ask you to confirm the gas fee.' : 'All six transactions are independently confirmed.'); }
    finally { provider.destroy(); }
  }); }
  function check() { action(async () => {
    setVerified(null); setQuote(null);
    const provider = readProvider();
    try { setVerified(await verifyJournal(journal, provider)); setMessage('Saved transactions verified against mainnet.'); }
    finally { provider.destroy(); }
  }); }
  function deploy() { action(async () => {
    if (!noticeAccepted) throw new Error('Read and acknowledge the sample and gas notice first.');
    const provider = readProvider();
    try {
      setMessage('Open MetaMask to review the contract transaction.');
      const tx = await sendQuotedStep(quote, journal, provider);
      const next = { ...journal, entries: [...journal.entries, { step: quote.step, hash: tx.hash }] };
      save(next); setQuote(null); setVerified(null);
      setMessage('Submitted: ' + tx.hash + '. Use Check confirmations before the next step.');
    } finally { provider.destroy(); }
  }); }
  function download() {
    const blob = new Blob([JSON.stringify({ ...journal, verified }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'botstate-mainnet-deployment.json'; link.click(); URL.revokeObjectURL(url);
  }
  async function restore(event) {
    const file = event.target.files?.[0]; if (!file) return;
    if (file.size > 20000) { setMessage('Deployment file is too large.'); return; }
    action(async () => { const value = JSON.parse(await file.text()); if (value.version !== VERSION || !Array.isArray(value.entries)) throw new Error('Invalid deployment file.'); save({ version: value.version, account: value.account, entries: value.entries }); setVerified(null); setQuote(null); setMessage('Imported references are unverified. Check confirmations.'); });
  }
  const sample = verified?.addresses?.SamplePropertyToken;
  return <PageShell title="Deploy with MetaMask" intro="Six transactions, one confirmation at a time. BOT Chain mainnet · Chain 677.">
    <section className="review-notice"><strong>Sample assets only</strong><p>No real property, ownership rights or promised returns. Sample tokens are free; deployment and judge claims cost real BOT gas. Existing mainnet contracts are not modified.</p><p>No wallet password, seed phrase or private key is requested by this page.</p></section>
    <div className="review-actions"><button className="btn btn-primary" disabled={busy} onClick={connect}>Connect MetaMask</button>{journal && <button className="btn btn-outline" disabled={busy} onClick={check}>Check confirmations</button>}</div>
    <p>Connected account: {account || 'Not connected'}</p>
    {sameAddress(account, EXPOSED_ACCOUNT) && <section className="review-notice" role="alert"><strong>This account’s private key was exposed in the repository.</strong><p>Other people can control contracts owned by it. Select a fresh MetaMask account before deploying if you need secure ownership. This page never uses the exposed key.</p></section>}
    {journal && <p>Deployment account: {journal.account}</p>}
    <label><input type="checkbox" checked={noticeAccepted} onChange={e => setNoticeAccepted(e.target.checked)} /> I understand these are sample assets and each confirmed transaction spends mainnet gas.</label>
    <ol>{STEPS.map((step, index) => <li key={step} style={{margin:'1rem 0'}}>{step} — {verified && index < verified.completed ? 'Confirmed' : journal?.entries[index] ? 'Submitted; verification required' : 'Not submitted'}{journal?.entries[index] && <p><a href={'https://scan.botchain.ai/tx/' + journal.entries[index].hash} target="_blank" rel="noreferrer">View transaction</a></p>}</li>)}</ol>
    <div className="review-actions"><button className="btn btn-outline" disabled={busy || !account || !journal} onClick={estimate}>Estimate next transaction</button>{journal && <button className="btn btn-outline" onClick={download}>Download deployment records</button>}</div>
    {quote && <section className="review-card"><h2>{STEPS[quote.step]}</h2><p>Transaction value: 0 BOT. Estimated gas budget: {quote.maxFee} BOT. MetaMask shows the final fee.</p><p>Owner / authorized agent: {quote.account}</p><p>Destination: {quote.transaction.to || 'New contract creation'}</p><details><summary>Review deployment calldata</summary><textarea readOnly aria-label="Transaction calldata" value={quote.transaction.data} style={{width:'100%',height:120}} /></details><button className="btn btn-primary" disabled={busy || !noticeAccepted} onClick={deploy}>Open MetaMask to confirm</button></section>}
    <p role="status" aria-live="polite">{message}</p>
    {sample && <section className="review-card"><h2>Sample token ready</h2><p>{sample}</p><Link className="btn btn-primary" href={'/judge?token=' + sample}>Open judge testing page</Link><p>Share the judge link and download the deployment records. The original public deployment registry stays unchanged until these receipts are reviewed.</p></section>}
    <details><summary>Resume from deployment records</summary><input type="file" accept="application/json" onChange={restore} disabled={busy} /><p>Imported data is only a hint. Receipts, calldata and contract bytecode are checked again before continuing.</p></details>
    <p>Release {VERSION} · Source fingerprint: {SOURCE_HASH}</p>
  </PageShell>;
}
