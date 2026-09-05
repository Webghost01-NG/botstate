'use client';
import { useEffect, useState } from 'react';
import PageShell from '../components/PageShell';
import { connectWallet, getAccount, getEthereumProvider } from '../utils/web3';
export default function Portfolio() {
  const [address,setAddress] = useState('');
  const [data,setData] = useState(null);
  const [error,setError] = useState('');
  const [busy,setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    const sync = () => { setData(null); getAccount().then(a => { if(active) setAddress(a || ''); }).catch(() => { if(active) setAddress(''); }); };
    sync();
    const provider = getEthereumProvider();
    provider?.on?.('accountsChanged',sync);
    window.addEventListener('botstate-wallet',sync);
    return () => { active=false; provider?.removeListener?.('accountsChanged',sync); window.removeEventListener('botstate-wallet',sync); };
  },[]);
  async function refresh(event) {
    event.preventDefault(); setData(null); setError(''); setBusy(true);
    try {
      const response = await fetch('/api/portfolio?address=' + encodeURIComponent(address), { cache:'no-store' });
      const result = await response.json();
      if(!response.ok) throw new Error(result.error);
      setData(result);
    } catch(e) { setError(e.message); } finally { setBusy(false); }
  }
  async function connect() {
    try { setAddress(await connectWallet()); setData(null); setError(''); } catch(e) { setError(e.message); }
  }
  return <PageShell title="Mainnet portfolio" intro="Read-only balance checks. Legacy browser-stored purchases are not treated as token ownership.">
    <form onSubmit={refresh}><label htmlFor="wallet-address">Wallet address</label><div className="review-actions"><input id="wallet-address" required value={address} onChange={e => {setAddress(e.target.value);setData(null);}} placeholder="0x…" size="45" /><button disabled={busy} className="btn btn-primary">{busy ? 'Reading…' : 'Read mainnet'}</button><button type="button" className="btn btn-outline" onClick={connect}>Use connected wallet</button></div></form>
    {error && <p role="alert">{error}</p>}
    {data && <section className="review-card"><h2>{data.walletBalance} BOT</h2><p>Address: {data.address} · Chain {data.chainId} · Block {data.blockNumber}</p><p>{data.scope}</p>{data.holdings.length ? data.holdings.map(h => <p key={h.token}>{h.balance} {h.symbol} — {h.token}</p>) : <p>No token holdings found in this registry scope.</p>}</section>}
    <p>No yield or rental payment is assumed from a token balance. The original dividend function does not pay holders.</p>
  </PageShell>;
}
