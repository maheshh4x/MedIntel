'use client';

import { useState } from 'react';
import { Bot, MessageSquare, Send, ShieldAlert, X } from 'lucide-react';
import styles from './FloatingAIAssistant.module.css';

interface Message {
  from: 'ai' | 'user';
  text: string;
}

export function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: 'ai', text: 'Hello! I am your MedIntel AI Assistant. How can I help you navigate your appointments or health reports today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { from: 'user', text }]);
    if (!textToSend) setInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: 'ai',
          text: 'I can help organize your questions for your next clinic visit. For any medical diagnoses or emergency care, please consult your doctor.'
        }
      ]);
    }, 600);
  };

  return (
    <div className={styles.floatingWrapper}>
      {isOpen && (
        <div className={styles.chatDrawer}>
          <div className={styles.drawerHeader}>
            <div className={styles.drawerTitle}>
              <Bot size={18} color="var(--color-primary)" /> MedIntel AI Companion
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={18} color="var(--color-text-muted)" />
            </button>
          </div>

          <div className={styles.messages}>
            {messages.map((m, idx) => (
              <div key={idx} className={m.from === 'ai' ? styles.msgAi : styles.msgUser}>
                {m.text}
              </div>
            ))}
          </div>

          <div className={styles.chips}>
            <button className={styles.chip} onClick={() => handleSend('How to prepare for appointment?')}>
              Visit preparation
            </button>
            <button className={styles.chip} onClick={() => handleSend('Explain my recent blood test')}>
              Lab report help
            </button>
            <button className={styles.chip} onClick={() => handleSend('What is clinic timing?')}>
              Clinic hours
            </button>
          </div>

          <form
            className={styles.inputArea}
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '0.375rem', padding: '0.4rem 0.75rem', cursor: 'pointer' }}>
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      <button className={styles.triggerButton} onClick={() => setIsOpen(!isOpen)} aria-label="Open AI Assistant">
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
}
