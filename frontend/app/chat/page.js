'use client';
import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ChatMessage from '../components/ChatMessage';
import styles from './page.module.css';

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'agent',
      content: "Welcome to BOTSTATE. I'm your AI real estate advisor powered by BOT Chain's AIDID protocol. I can help you discover, analyze, and invest in tokenized properties worldwide. What are you looking for?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          conversationHistory: messages.map(m => ({
            role: m.role === 'agent' ? 'assistant' : 'user',
            content: m.content
          }))
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, {
          id: Date.now() + 1,
          role: 'agent',
          content: data.response || data.reply,
          properties: data.propertyRecommendations || []
        }]);
      } else {
        throw new Error('Service unavailable');
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'agent',
          content: 'I\'m having trouble connecting to the BOTSTATE backend. Please ensure the server is running on port 3001. You can start it with `npm run dev` in the backend directory.'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.chatContainer}>
        <div className={styles.sidebar}>
          <h3>Conversations</h3>
          <ul className={styles.historyList}>
            <li className={styles.historyItemActive}>Current Session</li>
          </ul>
        </div>
        <div className={styles.mainChat}>
          <div className={styles.messagesArea}>
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isTyping && (
              <div className={styles.typingIndicator}>
                <span className={styles.typingDot}></span>
                <span className={styles.typingDot}></span>
                <span className={styles.typingDot}></span>
                BOTSTATE is analyzing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form className={styles.inputArea} onSubmit={handleSend}>
            <input
              type="text"
              className={styles.input}
              placeholder="Ask about properties, yields, locations..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className={`btn btn-primary ${styles.sendBtn}`}>
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
