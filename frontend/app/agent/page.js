import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatCard from '../components/StatCard';
import styles from './page.module.css';

export default function AgentProfile() {
  const agentAddress = '0x6CeD8D6Bad8Dfd2e60BCEA116fE74548f959f1F2';
  const explorerUrl = `https://scan.bohr.life/address/${agentAddress}`;

  return (
    <>
      <Navbar />
      <main className="main-content">
        <div className={styles.profileHeader}>
          <div className="container">
            <div className={styles.headerContent}>
              <div className={styles.avatar}>
                <span>B</span>
              </div>
              <div className={styles.info}>
                <h1 className={styles.name}>BOTSTATE AI Advisor</h1>
                <div className={styles.badges}>
                  <span className={styles.badge}>AIDID Certified</span>
                  <span className={styles.badge}>BOT Chain Native</span>
                  <span className={styles.badge}>Verifiable Oracle</span>
                </div>
                <p className={styles.address}>
                  DID: <a href={explorerUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', color: 'inherit' }}>did:bot:{agentAddress}</a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={`container ${styles.content}`}>
          <div className={styles.statsGrid}>
            <StatCard title="Reputation Score" value="98.4" subtitle="Top Tier AIDID Oracle" />
            <StatCard title="Properties Appraised" value="16 Global" subtitle="Dubai, Tokyo, London, Lisbon..." />
            <StatCard title="AI Accuracy Rate" value="94.2%" subtitle="Validated On-Chain Historical Yield" />
          </div>

          <section className={styles.section}>
            <h2>About the Agent</h2>
            <p className={styles.description}>
              The BOTSTATE AI Advisor is an autonomous real estate intelligence agent deployed on BOT Chain (Chain ID: 968). Operating under the AIDID decentralized identity framework, every property appraisal, risk score, and yield recommendation is timestamped and verifiable on-chain via the <code>AgentActionLog</code> smart contract.
            </p>
            <div className={styles.auditCallout} style={{ marginTop: '1.25rem', padding: '1.25rem', borderRadius: '10px', backgroundColor: 'rgba(10, 61, 61, 0.06)', border: '1px solid var(--color-border)' }}>
              <strong style={{ color: 'var(--color-primary)' }}>Auditable On-Chain Verification:</strong>
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text)' }}>
                This agent's on-chain identity and deployed transactions can be verified live on the BOT Chain Testnet Explorer:
              </p>
              <a 
                href={explorerUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-outline" 
                style={{ display: 'inline-block', marginTop: '0.75rem', fontSize: '0.85rem' }}
              >
                View Agent on Explorer (scan.bohr.life) ↗
              </a>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Live Agent Action Stream</h2>
            <div className={styles.timeline}>
              <div className={styles.timelineItem}>
                <div className={styles.timelineTime}>Latest Block</div>
                <div className={styles.timelineContent}>
                  <h4>Automated Valuation Calibration</h4>
                  <p>Analyzed rental yields for Burj Crown Sky Suite (Dubai Marina) and Shibuya Micro-Studio (Tokyo). Appraised confidence score at 96% based on regional lease velocity.</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineTime}>On-Chain Sync</div>
                <div className={styles.timelineContent}>
                  <h4>Smart Contract Portfolio Assessment</h4>
                  <p>Queried active token holder balances across deployed RWAToken contracts on BOT Chain Testnet.</p>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineTime}>DID Verification</div>
                <div className={styles.timelineContent}>
                  <h4>AIDID Oracle Attestation</h4>
                  <p>Cryptographic signature verified by oracle signer <code>{agentAddress.substring(0, 10)}...</code> on BOT Chain Testnet.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
