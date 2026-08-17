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
          <Link href="/chat" className={styles.link}>Chat</Link>
          <Link href="/properties" className={styles.link}>Properties</Link>
          <Link href="/portfolio" className={styles.link}>Portfolio</Link>
          <Link href="/agent" className={styles.link}>Agent</Link>
        </div>
        <div className={styles.actions}>
          <WalletButton />
        </div>
      </div>
    </nav>
  );
}
