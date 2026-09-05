'use client';
import { useState, useRef } from 'react';
import { Contract, formatEther, formatUnits, isAddress } from 'ethers';
import PageShell from '../components/PageShell';
import { connectWallet, switchToBotChainMainnet } from '../utils/web3';
import { artifact, readProvider, requireChain, requireRuntime, sameAddress, walletContext } from '../utils/deployment.mjs';

export default function JudgeClient({ token }) {
  const [account, setAccount] = useState('');
  const [state, setState] = useState(null);
  const [quote, setQuote] = useState(null);
  const [message, setMessage] = useState('Connect MetaMask to verify the sample contract and check your claim eligibility.');
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  async function action(work) {
    if (lock.current) return; lock.current = true; setBusy(true);
    try { await work(); } catch (error) { setMessage(error.shortMessage || error.message); }
    finally { setBusy(false); lock.current = false; }
  }
  async function read(readAccount) {
    if (!isAddress(token)) throw new Error('A valid deployed sample token address is required.');
    const provider = readProvider();
    try {
      await requireChain(provider); await requireRuntime(provider, token, 'SamplePropertyToken');
      const contract = new Contract(token, artifact('SamplePropertyToken').abi, provider);
      const [notice, balance, claimed, amount] = await Promise.all([contract.sampleNotice(), contract.balanceOf(readAccount), contract.hasClaimedSample(readAccount), contract.faucetAmount()]);
      setState({ notice, account: readAccount, balance: formatUnits(balance, 18), claimed });
      return { claimed, amount };
    } finally { provider.destroy(); }
  }
  function connect() { action(async () => {
    setQuote(null); setState(null);
    const address = await connectWallet(); await switchToBotChainMainnet(); setAccount(address);
    await read(address); setMessage('Sample contract bytecode and token balance verified on mainnet.');
  }); }
  function estimate() { action(async () => {
    setQuote(null); setState(null);
    const wallet = await walletContext();
    if (!sameAddress(wallet.account, account)) throw new Error('Wallet changed. Connect again.');
    const result = await read(account);
    if (result.claimed) throw new Error('This wallet has already claimed its free sample tokens.');
    const provider = readProvider();
    try {
      const contract = new Contract(token, artifact('SamplePropertyToken').abi, provider);
      const tx = await contract.claimSample.populateTransaction();
      const gas = await provider.estimateGas({ ...tx, from: account, value: 0n });
      const { gasPrice } = await provider.getFeeData(); if (!gasPrice) throw new Error('Gas price unavailable.');
      const gasLimit = (gas * 120n + 99n) / 100n;
      if (await provider.getBalance(account) < gasLimit * gasPrice) throw new Error('You need BOT for the network gas fee. The sample tokens themselves are free.');
      setQuote({ account, tx, gasLimit, gasPrice, fee: formatEther(gasLimit * gasPrice), createdAt: Date.now() });
      setMessage('Review the gas estimate, then confirm in MetaMask.');
    } finally { provider.destroy(); }
  }); }
  function claim() { action(async () => {
    if (!quote || Date.now() - quote.createdAt > 120000) throw new Error('Refresh the gas estimate.');
    const wallet = await walletContext();
    if (!sameAddress(wallet.account, quote.account)) throw new Error('Wallet changed. Connect again.');
    const result = await read(wallet.account);
    if (result.claimed) throw new Error('Sample already claimed.');
    const contract = new Contract(token, artifact('SamplePropertyToken').abi, wallet.signer);
    setMessage('Review the zero-value sample claim in MetaMask.');
    const transaction = await contract.claimSample({ value: 0n, gasLimit: quote.gasLimit, gasPrice: quote.gasPrice });
    setQuote(null); setMessage('Submitted: ' + transaction.hash + '. Waiting for confirmation…');
    const receipt = await transaction.wait(1);
    if (!receipt || receipt.status !== 1) throw new Error('Claim has not succeeded. Refresh your balance to check before retrying.');
    const event = receipt.logs.filter(log => sameAddress(log.address, token)).map(log => { try { return contract.interface.parseLog(log); } catch { return null; } }).find(log => log?.name === 'SampleClaimed' && sameAddress(log.args.recipient, wallet.account) && log.args.amount === result.amount);
    if (!event) throw new Error('Expected sample claim event not found.');
    await read(wallet.account); setMessage('Confirmed sample claim: ' + transaction.hash);
  }); }
  return <PageShell title="BOTSTATE Sample Residence" intro="Free sample tokens on BOT Chain mainnet. No real property or promised rental returns.">
    <section className="review-notice"><strong>Sample only — real gas fees apply</strong><p>You receive 10 SAMPLE-RWA tokens once per wallet. This is a test asset with no property rights or promised value. You never approve a token allowance or pay a purchase price.</p></section>
    <p>Sample contract: <a href={'https://scan.botchain.ai/address/' + token} target="_blank" rel="noreferrer">{token}</a></p>
    <div className="review-actions"><button className="btn btn-primary" onClick={connect} disabled={busy || !isAddress(token)}>Connect MetaMask and verify</button><button className="btn btn-outline" onClick={estimate} disabled={busy || !account}>Estimate free claim</button>{account && <button className="btn btn-outline" disabled={busy} onClick={() => action(() => read(account))}>Refresh verified balance</button>}</div>
    {state && <section className="review-card"><h2>{state.balance} SAMPLE-RWA</h2><p>Account: {state.account}</p><p>{state.notice}</p><p>{state.claimed ? 'Free sample claim already used.' : 'Free sample claim available.'}</p></section>}
    {quote && <section className="review-card"><p>Token price: 0 BOT. Estimated network gas budget: {quote.fee} BOT.</p><button className="btn btn-primary" onClick={claim} disabled={busy}>Open MetaMask to claim samples</button></section>}
    <p role="status" aria-live="polite">{message}</p>
  </PageShell>;
}
