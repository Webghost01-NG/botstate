import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PropertyCard from './components/PropertyCard';
import StatCard from './components/StatCard';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={`container ${styles.heroContainer}`}>
            <h1 className={styles.heroTitle}>Your AI Real Estate Agent, On-Chain</h1>
            <p className={styles.heroSubtitle}>
              Democratizing property investment through fractional ownership and intelligent AI recommendations on BOT Chain.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/chat" className="btn btn-primary">Launch App &rarr;</Link>
              <Link href="/properties" className="btn btn-outline">Explore Properties</Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className={styles.statsSection}>
          <div className="container">
            <div className={styles.statsGrid}>
              <StatCard title="Total Value Locked" value="$12.4M" subtitle="Across 42 properties" />
              <StatCard title="Properties Listed" value="42" subtitle="Fully tokenized on-chain" />
              <StatCard title="AI Recommendations" value="8,942" subtitle="Made by BOTSTATE agent" />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className={styles.section}>
          <div className="container">
            <h2 className={styles.sectionTitle}>How It Works</h2>
            <div className={styles.stepsGrid}>
              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>1</div>
                <h3>Chat</h3>
                <p>Discuss your investment goals with your AI advisor.</p>
              </div>
              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>2</div>
                <h3>Discover</h3>
                <p>Review AI-curated property recommendations.</p>
              </div>
              <div className={styles.stepCard}>
                <div className={styles.stepNumber}>3</div>
                <h3>Invest</h3>
                <p>Purchase property tokens securely on BOT Chain.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Properties */}
        <section className={`${styles.section} ${styles.bgLight}`}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Featured Properties</h2>
              <Link href="/properties" className={styles.linkMore}>View All</Link>
            </div>
            <div className={styles.propertyGrid}>
              <PropertyCard property={{ id: '1', name: 'Downtown Penthouse', location: 'Miami, FL', price: '1,000 BOT', yield: '7.2%', riskScore: 'Low', aiConfidence: '95%' }} />
              <PropertyCard property={{ id: '2', name: 'Tech Hub Office', location: 'Austin, TX', price: '500 BOT', yield: '8.5%', riskScore: 'Medium', aiConfidence: '88%' }} />
              <PropertyCard property={{ id: '3', name: 'Luxury Villa', location: 'Bali, ID', price: '2,500 BOT', yield: '12.1%', riskScore: 'High', aiConfidence: '76%' }} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
