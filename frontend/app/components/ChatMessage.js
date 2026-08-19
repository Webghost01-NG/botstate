import Link from 'next/link';
import styles from './ChatMessage.module.css';

export default function ChatMessage({ message }) {
  const isAgent = message.role === 'agent';

  // Format simple markdown into JSX paragraphs and bold highlights
  const renderFormattedContent = (content) => {
    if (!content) return null;
    return content.split('\n\n').map((paragraph, pIdx) => {
      const lines = paragraph.split('\n');
      return (
        <div key={pIdx} className={styles.paragraph}>
          {lines.map((line, lIdx) => {
            const formattedLine = line.split(/(\*\*.*?\*\*)/).map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i}>{part.slice(2, -2)}</strong>;
              }
              return part;
            });

            return (
              <p key={lIdx} className={line.startsWith('•') || line.startsWith('-') ? styles.bulletItem : styles.textLine}>
                {formattedLine}
              </p>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className={`${styles.messageWrapper} ${isAgent ? styles.agentWrapper : styles.userWrapper}`}>
      {isAgent && (
        <div className={styles.avatar}>
          <div className={styles.avatarInner}>B</div>
        </div>
      )}
      <div className={`${styles.bubble} ${isAgent ? styles.agentBubble : styles.userBubble}`}>
        {renderFormattedContent(message.content)}

        {message.properties && message.properties.length > 0 && (
          <div className={styles.propertyGrid}>
            {message.properties.map((prop, idx) => (
              <div key={idx} className={styles.attachedCard}>
                <div className={styles.cardTop}>
                  <h4>{prop.name}</h4>
                  <span className={styles.yieldTag}>{prop.yield}% APY</span>
                </div>
                <p className={styles.cardLocation}>📍 {prop.location}, {prop.country}</p>
                <div className={styles.cardMeta}>
                  <span>Price: ${prop.price?.toLocaleString()}</span>
                  <span>Token: {prop.tokenPrice} tBOT</span>
                </div>
                <Link href={`/properties/${prop.id}`} className={styles.cardAction}>
                  Inspect & Invest →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
