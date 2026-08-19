'use client';
import { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PropertyCard from '../components/PropertyCard';
import Link from 'next/link';
import styles from './page.module.css';

export default function Properties() {
  const [rawProperties, setRawProperties] = useState([]);
  const [locationFilter, setLocationFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [sortBy, setSortBy] = useState('confidence');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/properties')
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.properties || [];
        
        // Merge user-listed properties from localStorage if any
        if (typeof window !== 'undefined') {
          const userListed = JSON.parse(localStorage.getItem('user_listed_properties') || '[]');
          const combined = [...userListed, ...list];
          // Deduplicate by ID
          const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
          setRawProperties(unique);
        } else {
          setRawProperties(list);
        }
      })
      .catch((err) => {
        console.warn('Backend fetch fallback:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const formattedProperties = useMemo(() => {
    return rawProperties.map((p) => ({
      id: p.id,
      name: p.name,
      location: p.location,
      country: p.country,
      price: `${p.price?.toLocaleString()} BOT`,
      rawPrice: p.price,
      tokenPrice: `${p.tokenPrice} BOT`,
      yield: `${p.yield}%`,
      rawYield: p.yield,
      riskScore: p.riskScore <= 2 ? 'Low' : p.riskScore <= 4 ? 'Medium' : 'High',
      rawRisk: p.riskScore,
      aiConfidence: `${Math.min(99, 90 + Math.floor((10 - (p.riskScore || 3)) * 1.1))}%`,
      image: p.imageUrl || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      description: p.description,
      features: p.features || [],
    }));
  }, [rawProperties]);

  const filteredProperties = useMemo(() => {
    return formattedProperties
      .filter((p) => {
        if (locationFilter !== 'All' && !p.location.toLowerCase().includes(locationFilter.toLowerCase()) && !p.country?.toLowerCase().includes(locationFilter.toLowerCase())) {
          return false;
        }
        if (priceFilter === 'under50k' && p.rawPrice >= 50000) return false;
        if (priceFilter === '50kto100k' && (p.rawPrice < 50000 || p.rawPrice > 100000)) return false;
        if (priceFilter === 'over100k' && p.rawPrice <= 100000) return false;

        if (riskFilter !== 'All' && p.riskScore !== riskFilter) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'yield') return b.rawYield - a.rawYield;
        if (sortBy === 'price_asc') return a.rawPrice - b.rawPrice;
        if (sortBy === 'price_desc') return b.rawPrice - a.rawPrice;
        if (sortBy === 'confidence') return parseInt(b.aiConfidence) - parseInt(a.aiConfidence);
        return 0;
      });
  }, [formattedProperties, locationFilter, priceFilter, riskFilter, sortBy]);

  return (
    <>
      <Navbar />
      <main className="main-content">
        <div className={`container ${styles.pageHeader}`}>
          <div className={styles.headerFlex}>
            <div>
              <span className={styles.categoryBadge}>Global RWA Marketplace</span>
              <h1 className={styles.title}>Explore Tokenized Real Estate</h1>
              <p className={styles.subtitle}>
                Discover verified AI-appraised global properties and buy fractional shares natively on BOT Chain.
              </p>
            </div>
            <Link href="/properties/new" className={`btn btn-primary ${styles.tokenizeBtn}`}>
              + Tokenize New Asset
            </Link>
          </div>
        </div>

        <div className={`container ${styles.filterBar}`}>
          <select 
            className={styles.filterSelect}
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="All">All Locations & Regions</option>
            <option value="Dubai">Dubai & UAE</option>
            <option value="Tokyo">Tokyo & Kyoto (Japan)</option>
            <option value="USA">United States (Miami, NY, Austin)</option>
            <option value="Europe">Europe (UK, France, Germany, Spain, Swiss)</option>
            <option value="Asia">Southeast Asia (Bali, Singapore)</option>
          </select>

          <select 
            className={styles.filterSelect}
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
          >
            <option value="All">Any Asset Valuation</option>
            <option value="under50k">Under 50,000 BOT</option>
            <option value="50kto100k">50,000 - 100,000 BOT</option>
            <option value="over100k">Over 100,000 BOT</option>
          </select>

          <select 
            className={styles.filterSelect}
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
          >
            <option value="All">All Risk Profiles</option>
            <option value="Low">Low Risk (Tier 1 Core)</option>
            <option value="Medium">Medium Risk (Growth)</option>
            <option value="High">High Risk (High Yield Alpha)</option>
          </select>

          <select 
            className={styles.filterSelect}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="confidence">Sort: AI Confidence (Highest)</option>
            <option value="yield">Sort: Projected APY (Highest)</option>
            <option value="price_asc">Sort: Price (Lowest)</option>
            <option value="price_desc">Sort: Price (Highest)</option>
          </select>
        </div>

        <div className={`container ${styles.grid}`}>
          {filteredProperties.length > 0 ? (
            filteredProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-secondary)' }}>
              <h3>No properties matching this filter criteria</h3>
              <p style={{ marginTop: '0.5rem' }}>Try resetting filters or tokenize your own property!</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
