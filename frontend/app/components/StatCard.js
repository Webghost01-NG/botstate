import styles from './StatCard.module.css';

export default function StatCard({ title, value, subtitle }) {
  return (
    <div className={styles.card}>
      <h4 className={styles.title}>{title}</h4>
      <div className={styles.value}>{value}</div>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
