import Link from 'next/link';
import styles from './PropertyCard.module.css';

export default function PropertyCard({ property }) {
  const data = {
    id: property?.id || '1',
    name: property?.name || 'Loading...',
    location: property?.location || '',
    country: property?.country || '',
    price: property?.price ? `$${Number(property.price).toLocaleString()}` : '--',
    tokenPrice: property?.tokenPrice ? `$${property.tokenPrice}` : '--',
    yield: property?.yield || '--',
    riskScore: property?.riskScore || '--',
    aiConfidence: property?.aiConfidence || '95%',
    image: property?.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  };

  return (
    <Link href={`/properties/${data.id}`} className={styles.card}>
      <div className={styles.imageContainer} style={{ backgroundImage: `url(${data.image})` }}>
        <div className={styles.yieldBadge}>{data.yield}% APY</div>
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{data.name}</h3>
          <p className={styles.location}>{data.location}{data.country ? `, ${data.country}` : ''}</p>
        </div>
        
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Price</span>
            <span className={styles.statValue}>{data.price}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Token</span>
            <span className={styles.statValue}>{data.tokenPrice}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Risk</span>
            <span className={styles.statValue}>{data.riskScore}/10</span>
          </div>
        </div>

        <div className={styles.aiFooter}>
          <div className={styles.aiBadge}>
            <span className={styles.aiDot}></span>
            AI Confidence: {data.aiConfidence}
          </div>
        </div>
      </div>
    </Link>
  );
}
