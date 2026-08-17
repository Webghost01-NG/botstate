import styles from './ChatMessage.module.css';

export default function ChatMessage({ message }) {
  const isAgent = message.role === 'agent';
  
  return (
    <div className={`${styles.messageWrapper} ${isAgent ? styles.agentWrapper : styles.userWrapper}`}>
      {isAgent && (
        <div className={styles.avatar}>
          <div className={styles.avatarInner}>B</div>
        </div>
      )}
      <div className={`${styles.bubble} ${isAgent ? styles.agentBubble : styles.userBubble}`}>
        <p>{message.content}</p>
        {message.property && (
          <div className={styles.propertyAttachment}>
            {/* We would render a miniature PropertyCard here, or just basic details */}
            <div className={styles.attachedCard}>
              <h4>{message.property.name}</h4>
              <p>{message.property.price}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
