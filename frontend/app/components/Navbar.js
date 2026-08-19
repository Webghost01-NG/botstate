import Link from 'next/link';
import WalletButton from './WalletButton';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          BOTSTATE
        </Link>
        <div className={styles.links}>
          <Link href="/properties" className={styles.link}>Properties</Link>
          <Link href="/properties/new" className={styles.link} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>+ Tokenize</Link>
          <Link href="/chat" className={styles.link}>AI Advisor</Link>
          <Link href="/portfolio" className={styles.link}>Portfolio</Link>
          <Link href="/agent" className={styles.link}>AIDID Agent</Link>
          <Link href="/proof" className={styles.link}>Proof ⛓️</Link>
          <Link href="/demo" className={styles.link} style={{ color: 'var(--color-gold)', fontWeight: 600 }}>Demo 🎮</Link>
        </div>
        <div className={styles.actions}>
          <WalletButton />
        </div>
      </div>
    </nav>
  );
}
