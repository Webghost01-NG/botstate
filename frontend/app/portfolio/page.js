'use client';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatCard from '../components/StatCard';
import { getAccount, connectWallet, getEthereumProvider } from '../utils/web3';
import { BrowserProvider, formatEther } from 'ethers';
import styles from './page.module.css';

export default function Portfolio() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0.0');
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const acc = await getAccount();
        if (acc) {
          setAccount(acc);
          
          // Read real on-chain balance via provider
          const ethProvider = getEthereumProvider();
          if (ethProvider) {
            try {
              const bp = new BrowserProvider(ethProvider);
              const rawBal = await bp.getBalance(acc);
              setBalance(parseFloat(formatEther(rawBal)).toFixed(4));
            } catch (balErr) {
              console.warn('Could not read on-chain balance:', balErr);
            }
          }

          // Read real confirmed holdings for this address
          if (typeof window !== 'undefined') {
            const userHoldings = JSON.parse(localStorage.getItem(`holdings_${acc.toLowerCase()}`) || '[]');
            setHoldings(userHoldings);
          }
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleConnect = async () => {
    try {
      const acc = await connectWallet();
      if (acc) {
        setAccount(acc);
        const ethProvider = getEthereumProvider();
        if (ethProvider) {
          const bp = new BrowserProvider(ethProvider);
          const rawBal = await bp.getBalance(acc);
          setBalance(parseFloat(formatEther(rawBal)).toFixed(4));
        }
      }
    } catch (err) {
      console.error('Connect error:', err);
    }
  };

  if (!account) {
    return (
      <>
        <Navbar />
        <main className={`main-content ${styles.centerContent}`}>
          <div className="container" style={{textAlign: 'center', padding: '4rem 1rem'}}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Connect Your Wallet</h2>
            <p className={styles.subtext} style={{ marginBottom: '2rem', color: 'var(--color-text-secondary)' }}>
              Connect your MetaMask wallet to view your real on-chain assets, tBOT balance, and tokenized real estate portfolio on BOT Chain Testnet.
            </p>
            <button className="btn btn-primary" onClick={handleConnect} style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
              Connect MetaMask
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const totalInvested = holdings.reduce((sum, h) => sum + (h.totalInvested || 0), 0);
  const blendedApy = holdings.length > 0
    ? (holdings.reduce((sum, h) => sum + (h.yield || 0), 0) / holdings.length).toFixed(1)
    : '0.0';

  return (
    <>
      <Navbar />
      <main className="main-content">
        <div className={`container ${styles.pageHeader}`}>
          <h1 className={styles.title}>Your On-Chain Portfolio</h1>
          <p className={styles.subtitle}>
            Connected: <code style={{ backgroundColor: 'var(--color-bg-secondary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.9rem', color: 'var(--color-primary)' }}>{account}</code>
          </p>
        </div>

        <div className="container">
          <div className={styles.statsGrid}>
            <StatCard title="Wallet Balance" value={`${balance} tBOT`} subtitle="On BOT Chain Testnet (Chain 968)" />
            <StatCard title="Total Invested" value={`${totalInvested.toFixed(4)} tBOT`} subtitle={`${holdings.length} Active RWA Asset(s)`} />
            <StatCard title="Blended Yield" value={`${blendedApy}% APY`} subtitle="Automated Quarterly Payouts" />
          </div>

          <section className={styles.section}>
            <h2>Active RWA Token Holdings</h2>
            {holdings.length === 0 ? (
              <div style={{ padding: '2.5rem', textAlign: 'center', backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '12px', marginTop: '1rem' }}>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
                  You do not have any tokenized properties in your wallet yet.
                </p>
                <a href="/properties" className="btn btn-primary" style={{ display: 'inline-block' }}>
                  Explore 16 Verified Properties →
                </a>
              </div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Location</th>
                      <th>Tokens Owned</th>
                      <th>Total Invested</th>
                      <th>Yield APY</th>
                      <th>Transaction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map((h, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{h.name}</td>
                        <td>{h.location}, {h.country}</td>
                        <td>{h.tokens}</td>
                        <td>{h.totalInvested?.toFixed(4)} tBOT</td>
                        <td style={{ color: 'var(--color-success)', fontWeight: 600 }}>{h.yield}%</td>
                        <td>
                          {h.txHash ? (
                            <a 
                              href={`https://scan.bohr.life/tx/${h.txHash}`} 
                              target="_blank" 
                              rel="noreferrer"
                              style={{ textDecoration: 'underline', color: 'var(--color-primary)', fontSize: '0.85rem' }}
                            >
                              {h.txHash.substring(0, 8)}...{h.txHash.substring(h.txHash.length - 6)}
                            </a>
                          ) : (
                            'On-Chain'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className={styles.section}>
            <h2>AIDID Advisor Intelligence</h2>
            <div className={styles.recommendationCard}>
              <div className={styles.recHeader}>
                <div className={styles.recType}>Portfolio Optimization</div>
                <div className={styles.recDate}>Live Analysis</div>
              </div>
              <p className={styles.recText}>
                {holdings.length === 0 
                  ? 'Your wallet has available tBOT balance ready for investment. The BOTSTATE AI advisor recommends allocating across diverse geographical markets (e.g. Dubai, Tokyo, London) to maximize yield while minimizing regulatory risk.'
                  : `Your portfolio currently holds ${holdings.length} tokenized property position(s) yielding an average ${blendedApy}% APY. To further enhance your risk-adjusted return, consider re-investing dividend distributions into prime European or Asian commercial assets.`}
              </p>
              <a href="/chat" className="btn btn-outline">Ask BOTSTATE Advisor</a>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
