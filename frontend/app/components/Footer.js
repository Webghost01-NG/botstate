import styles from './Footer.module.css';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.brand}>
          <h2 className={styles.logo}>BOTSTATE</h2>
          <p className={styles.tagline}>Your AI Real Estate Agent, On-Chain</p>
        </div>
        <div className={styles.links}>
          <div className={styles.linkGroup}>
            <h3>Platform</h3>
            <Link href="/properties">Discover</Link>
            <Link href="/chat">AI Agent</Link>
            <Link href="/portfolio">Portfolio</Link>
          </div>
          <div className={styles.linkGroup}>
            <h3>Resources</h3>
            <a href="#">Documentation</a>
            <a href="#">Whitepaper</a>
            <a href="#">Smart Contracts</a>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} BOTSTATE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
