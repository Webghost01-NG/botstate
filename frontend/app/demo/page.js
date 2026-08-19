'use client';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './page.module.css';

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepData, setStepData] = useState({
    property: 'Burj Crown Sky Suite, Dubai Marina',
    valuation: '$45,000 (8.4% APY)',
    tokens: 900,
    tokenPrice: '0.05 tBOT',
    investorBuyTokens: 10,
    txHash: '0x61e325c54dbe6b5faf600a96f74cb5bdb3fdb354e7400ffed808996ec7dfe994',
    payout: '0.042 tBOT quarterly yield',
    blockNumber: '20214536'
  });

  const steps = [
    {
      id: 1,
      title: '1. Autonomous AI Valuation',
      subtitle: 'BOTSTATE AI Advisor queries registry deeds, local rental rates, and historical appreciation.',
      actionLabel: 'Execute AI Appraisal →',
      details: {
        'Asset': 'Burj Crown Sky Suite (Dubai Marina, UAE)',
        'Model Engine': 'BOTSTATE AIDID Valuation Oracle v1.4',
        'Appraised Value': '$45,000 USD / ~45,000 BOT',
        'Projected APY': '8.4% Net Rental Yield',
        'AIDID Confidence': '96% (Low Risk Tier 2)',
        'EIP-712 Signature': '0x7b2f4c919fa76f55a29c1286f77b3fcfeb0c53c9545943dba22605e5ad9d8f'
      }
    },
    {
      id: 2,
      title: '2. Deploy Fractional RWA Contract',
      subtitle: 'RWATokenFactory deploys an ERC-20 contract locking 100% of the deed into 900 fractional shares.',
      actionLabel: 'Deploy RWAToken Contract →',
      details: {
        'Contract': 'RWAToken (ERC-20 Compliant)',
        'Supply': '900 BURJ-RWA Tokens',
        'Token Price': '0.05 tBOT / Token',
        'Dividend Escrow': 'Quarterly Payout Smart Contract Enabled',
        'Factory Address': '0xbb42F96B7Dd1FC127f7A9729C178EFE15ADa8F0a',
        'Network': 'BOT Chain Testnet (Chain ID 968)'
      }
    },
    {
      id: 3,
      title: '3. Investor On-Chain Settlement',
      subtitle: 'Investor purchases 10 fractional tokens via native tBOT payment on Marketplace.sol.',
      actionLabel: 'Settle On-Chain Purchase →',
      details: {
        'Investor Wallet': '0x6CeD8D6Bad8Dfd2e60BCEA116fE74548f959f1F2',
        'Purchased': '10 BURJ-RWA Tokens (~1.11% property ownership)',
        'Total Cost': '0.50 tBOT',
        'Marketplace Fee': '1% (0.005 tBOT to Protocol Treasury)',
        'Transaction Hash': '0x61e325c54dbe6b5faf600a96f74cb5bdb3fdb354e7400ffed808996ec7dfe994',
        'Block Status': 'Mined in Block 20214536'
      }
    },
    {
      id: 4,
      title: '4. Automated Dividend Yield Distribution',
      subtitle: 'Smart contract automatically disburses rental revenue to all fractional token holders on-chain.',
      actionLabel: 'Trigger Dividend Disbursement →',
      details: {
        'Total Rental Inflow': '3.78 tBOT (Quarterly)',
        'Investor Dividend': '0.042 tBOT (Direct wallet credit)',
        'Disbursement Function': 'RWAToken.distributeDividends()',
        'Gas Overhead': '42,100 Gas units',
        'Verification': 'Zero custodial middleman'
      }
    },
    {
      id: 5,
      title: '5. Verifiable Proof & Audit on BOT Chain',
      subtitle: 'The full asset lifecycle is immutably recorded and auditable on the BOT Chain Block Explorer.',
      actionLabel: 'View Complete On-Chain Proof ↗',
      details: {
        'Lifecycle State': '100% Reconciled & Audited',
        'Explorer Status': 'Live on scan.bohr.life',
        'Proof Route': '/proof',
        'Total Time to Settle': '< 3 seconds on BOT Chain EVM'
      }
    }
  ];

  const currentStepInfo = steps[currentStep - 1];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      window.location.href = '/proof';
    }
  };

  return (
    <>
      <Navbar />
      <main className="main-content">
        <div className={`container ${styles.header}`}>
          <span className={styles.badge}>Interactive Judge Walkthrough</span>
          <h1 className={styles.title}>BOTSTATE Guided Demo</h1>
          <p className={styles.subtitle}>
            Experience the complete 5-step lifecycle of an AI-appraised, fractionalized real-world property on BOT Chain in 45 seconds.
          </p>
        </div>

        <div className="container">
          <div className={styles.stepperNav}>
            {steps.map((s) => (
              <button
                key={s.id}
                className={`${styles.stepBtn} ${currentStep === s.id ? styles.activeStep : currentStep > s.id ? styles.completedStep : ''}`}
                onClick={() => setCurrentStep(s.id)}
              >
                <span className={styles.stepNum}>{currentStep > s.id ? '✓' : s.id}</span>
                <span className={styles.stepTitle}>{s.title.split('. ')[1]}</span>
              </button>
            ))}
          </div>

          <div className={styles.stageCard}>
            <div className={styles.cardHeader}>
              <div>
                <h2>{currentStepInfo.title}</h2>
                <p className={styles.cardSubtext}>{currentStepInfo.subtitle}</p>
              </div>
              <span className={styles.stepBadge}>Step {currentStep} of 5</span>
            </div>

            <div className={styles.detailsGrid}>
              {Object.entries(currentStepInfo.details).map(([key, val], idx) => (
                <div key={idx} className={styles.detailItem}>
                  <span className={styles.detailKey}>{key}</span>
                  <strong className={styles.detailVal}>
                    {val.startsWith('0x') ? <code>{val.substring(0, 14)}...</code> : val}
                  </strong>
                </div>
              ))}
            </div>

            <div className={styles.actionRow}>
              {currentStep > 1 && (
                <button className="btn btn-outline" onClick={() => setCurrentStep(currentStep - 1)}>
                  ← Previous Step
                </button>
              )}
              <button className="btn btn-primary" onClick={handleNext} style={{ marginLeft: 'auto' }}>
                {currentStepInfo.actionLabel}
              </button>
            </div>
          </div>

          <div className={styles.infoBanner}>
            💡 <strong>Hackathon Judge Tip:</strong> You can also connect your real MetaMask wallet anytime on the{' '}
            <a href="/properties/prop-1" style={{ textDecoration: 'underline', color: 'var(--color-primary)' }}>
              Live Properties Marketplace
            </a>{' '}
            to execute live transactions with <code>tBOT</code> on BOT Chain Testnet.
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
