import Link from 'next/link';
import styles from './PropertyCard.module.css';
export default function PropertyCard({ property }) {
  return <Link href={'/properties/' + property.id} className={styles.card}><div className={styles.imageContainer} style={{backgroundImage:'url(' + (property.imageUrl || '') + ')'}}><div className={styles.yieldBadge}>Sample asset</div></div><div className={styles.content}><h3 className={styles.title}>{property.name}</h3><p>{property.location}, {property.country}</p><p>Illustrative price: ${Number(property.price).toLocaleString()}</p><p>Illustrative yield: {property.yield}% — unverified</p><p>Purchases unavailable</p></div></Link>;
}
