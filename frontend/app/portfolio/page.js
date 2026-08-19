'use client';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatCard from '../components/StatCard';
import { 
  getAccount, 
  connectWallet, 
  getEthereumProvider, 
  switchToBotChainMainnet, 
  switchToBotChainTestnet,
  BOT_MAINNET_RPC_URL,
  BOT_TESTNET_RPC_URL 
} from '../utils/web3';
import { JsonRpcProvider, formatEther } from 'ethers';
import styles from './page.module.css';

export default function Portfolio() {
  const [account, setAccount] = useState('');
  const [activeNetwork, setActiveNetwork] = useState('mainnet'); // 'mainnet' | 'testnet'
  const [mainnetBalance, setMainnetBalance] = useState('0.0');
  const [testnetBalance, setTestnetBalance] = useState('0.0');
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalancesAndUserData = async () => {
      try {
        const acc = await getAccount();
        if (acc) {
          setAccount(acc);

          // 1. Fetch Mainnet Balance via RPC (Chain ID 677)
          try {
            const mainnetProvider = new JsonRpcProvider(BOT_MAINNET_RPC_URL, 677);
            const rawMainnet = await mainnetProvider.getBalance(acc);
            setMainnetBalance(parseFloat(formatEther(rawMainnet)).toFixed(4));
          } catch (mErr) {
            console.warn('Mainnet balance error:', mErr);
          }

          // 2. Fetch Testnet Balance via RPC (Chain ID 968)
          try {
            const testnetProvider = new JsonRpcProvider(BOT_TESTNET_RPC_URL, 968);
            const rawTestnet = await testnetProvider.getBalance(acc);
            setTestnetBalance(parseFloat(formatEther(rawTestnet)).toFixed(4));
          } catch (tErr) {
            console.warn('Testnet balance error:', tErr);
          }

          // 3. Read confirmed holdings
          if (typeof window !== 'undefined') {
            const userHoldings = JSON.parse(localStorage.getItem(`holdings_${acc.toLowerCase()}`) || '[]');
            setHoldings(userHoldings);
          }
        }
      } catch (err) {
        console.error('Error loading portfolio:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBalancesAndUserData();
  }, []);

  const handleConnect = async () => {
    try {
      const acc = await connectWallet();
      if (acc) setAccount(acc);
    } catch (err) {
      console.warn('Connect error:', err);
    }
  };

  const handleNetworkSwitch = async (net) => {
    setActiveNetwork(net);
    try {
      if (net === 'mainnet') {
        await switchToBotChainMainnet();
      } else {
        await switchToBotChainTestnet();
      }
    } catch (err) {
      console.warn('Switch network notice:', err);
    }
  };

  if (!account) {
    return (
      <>
        <Navbar />
        <main className={`main-content ${styles.centerContent}`}>
          <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Connect Your Wallet</h2>
            <p className={styles.subtext} style={{ marginBottom: '2rem', color: 'var(--color-text-secondary)' }}>
              Connect your MetaMask wallet to view your real on-chain BOT (Mainnet) and tBOT (Testnet) balances and RWA holdings.
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

  const isMainnet = activeNetwork === 'mainnet';
  const activeBalance = isMainnet ? mainnetBalance : testnetBalance;
  const activeSymbol = isMainnet ? 'BOT' : 'tBOT';
  const activeNetworkName = isMainnet ? 'BOT Chain Mainnet (Chain 677)' : 'BOT Chain Testnet (Chain 968)';

  const totalInvested = holdings.reduce((sum, h) => sum + (h.totalInvested || 0), 0);
  const blendedApy = holdings.length > 0
    ? (holdings.reduce((sum, h) => sum + (h.yield || 0), 0) / holdings.length).toFixed(1)
    : '0.0';

  return (
    <>
      <Navbar />
      <main className="main-content">
        <div className={`container ${styles.pageHeader}`}>
          <div className={styles.headerFlex}>
            <div>
              <h1 className={styles.title}>Your On-Chain Portfolio</h1>
              <p className={styles.subtitle}>
                Connected Wallet: <code style={{ backgroundColor: 'var(--color-bg-secondary)', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.9rem', color: 'var(--color-primary)' }}>{account}</code>
              </p>
            </div>

            {/* Network Switcher Toggle */}
            <div className={styles.networkToggleWrapper}>
              <span className={styles.toggleLabel}>Active Network View:</span>
              <div className={styles.togglePill}>
                <button 
                  className={`${styles.toggleBtn} ${isMainnet ? styles.toggleActiveMainnet : ''}`}
                  onClick={() => handleNetworkSwitch('mainnet')}
                >
                  🟢 Mainnet ({mainnetBalance} BOT)
                </button>
                <button 
                  className={`${styles.toggleBtn} ${!isMainnet ? styles.toggleActiveTestnet : ''}`}
                  onClick={() => handleNetworkSwitch('testnet')}
                >
                  🔵 Testnet ({testnetBalance} tBOT)
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          {/* Dual Network Overview Banner */}
          <div className={styles.dualBanner}>
            <div className={styles.bannerItem}>
              <span className={styles.bannerDotGreen}></span>
              <div>
                <strong>BOT Chain Mainnet:</strong> {mainnetBalance} BOT
              </div>
            </div>
            <div className={styles.bannerDivider}></div>
            <div className={styles.bannerItem}>
              <span className={styles.bannerDotBlue}></span>
              <div>
                <strong>BOT Chain Testnet:</strong> {testnetBalance} tBOT
              </div>
            </div>
          </div>

          <div className={styles.statsGrid}>
            <StatCard 
              title={`${activeSymbol} Wallet Balance`} 
              value={`${activeBalance} ${activeSymbol}`} 
              subtitle={activeNetworkName} 
            />
            <StatCard 
              title="Total Invested RWA" 
              value={`${totalInvested.toFixed(4)} ${activeSymbol}`} 
              subtitle={`${holdings.length} Active Asset Position(s)`} 
            />
            <StatCard 
              title="Blended Yield APY" 
              value={`${blendedApy}% APY`} 
              subtitle="Automated Quarterly Distributions" 
            />
          </div>

          <section className={styles.section}>
            <div className={styles.sectionHeaderFlex}>
              <h2>Active RWA Token Holdings ({activeNetworkName})</h2>
              <button 
                className="btn btn-outline"
                style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}
                onClick={() => handleNetworkSwitch(isMainnet ? 'testnet' : 'mainnet')}
              >
                Switch to {isMainnet ? 'Testnet View' : 'Mainnet View'} →
              </button>
            </div>

            {holdings.length === 0 ? (
              <div className={styles.emptyCard}>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
                  No active tokenized property positions detected on {activeNetworkName} yet.
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
                      <th>Network</th>
                      <th>Transaction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map((h, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{h.name}</td>
                        <td>{h.location}, {h.country}</td>
                        <td>{h.tokens}</td>
                        <td>{h.totalInvested?.toFixed(4)} {activeSymbol}</td>
                        <td style={{ color: 'var(--color-success)', fontWeight: 600 }}>{h.yield}%</td>
                        <td>
                          <span className={isMainnet ? styles.badgeMainnet : styles.badgeTestnet}>
                            {activeSymbol}
                          </span>
                        </td>
                        <td>
                          {h.txHash ? (
                            <a 
                              href={`${isMainnet ? 'https://scan.botchain.ai' : 'https://scan.bohr.life'}/tx/${h.txHash}`} 
                              target="_blank" 
                              rel="noreferrer"
                              style={{ textDecoration: 'underline', color: 'var(--color-primary)', fontSize: '0.85rem' }}
                            >
                              {h.txHash.substring(0, 8)}...{h.txHash.substring(h.txHash.length - 6)} ↗
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
            <h2>AIDID Advisor Portfolio Optimization</h2>
            <div className={styles.recommendationCard}>
              <div className={styles.recHeader}>
                <div className={styles.recType}>Multi-Chain Intelligence</div>
                <div className={styles.recDate}>Live Verification</div>
              </div>
              <p className={styles.recText}>
                Your wallet holds <strong>{mainnetBalance} BOT</strong> on Mainnet and <strong>{testnetBalance} tBOT</strong> on Testnet. 
                {holdings.length === 0 
                  ? ' The BOTSTATE AI advisor recommends allocating across diverse geographical markets (e.g. Dubai, Tokyo, London) to maximize yield while minimizing regulatory risk.'
                  : ` Your active positions yield an average ${blendedApy}% APY. Dividend yields disburse quarterly directly to your connected wallet.`}
              </p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <a href="/chat" className="btn btn-outline">Ask AI Advisor</a>
                <a href="/proof" className="btn btn-primary">View On-Chain Receipts →</a>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
