'use client';

import { FormEvent, useState } from 'react';
import { Activity, Bot, CheckCircle2, ChevronRight, Eraser, MessageCircle, Send, ShieldAlert, User } from 'lucide-react';
import { Button } from './Button';
import { DashboardLayout } from '../layout/DashboardLayout';
import { ProtectedRoute } from '../layout/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';
import styles from './AIWorkbench.module.css';

const navItems = [
  { label: 'Dashboard', href: '/patient/dashboard' },
  { label: 'Appointments', href: '/patient/appointments' },
  { label: 'AI Symptom Checker', href: '/patient/ai-symptom-checker' },
  { label: 'Medical Reports', href: '/patient/reports' },
  { label: 'Health Trends', href: '/patient/trends' },
  { label: 'AI Assistant', href: '/patient/assistant' },
];

function SymptomChecker() {
  const [step, setStep] = useState(1);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleSymptom = (symptom: string) =>
    setSymptoms((current) =>
      current.includes(symptom) ? current.filter((item) => item !== symptom) : [...current, symptom]
    );

  const analyze = (selectedDuration: string) => {
    setDuration(selectedDuration);
    setIsLoading(true);
    window.setTimeout(() => {
      setIsLoading(false);
      setStep(4);
    }, 900);
  };

  return (
    <div className={styles.aiPage}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Guided assessment</p>
          <h1 className={styles.title}>AI Symptom Checker</h1>
          <p className={styles.subtitle}>A short guided check to help you decide what kind of care may be useful.</p>
        </div>
      </div>
      <div className={styles.progress}>
        {['Welcome', 'Symptoms', 'Details', 'Guidance'].map((label, index) => (
          <span className={step >= index + 1 ? styles.progressActive : ''} key={label}>
            {index + 1}. {label}
          </span>
        ))}
      </div>
      <section className={styles.aiPanel}>
        {step === 1 && (
          <div className={styles.centerState}>
            <div className={styles.aiIcon}>
              <Activity size={30} />
            </div>
            <h2>Let&apos;s understand how you&apos;re feeling</h2>
            <p>
              This assistant can organize your symptoms and suggest an appropriate next step. It cannot diagnose conditions or replace a clinician.
            </p>
            <Button onClick={() => setStep(2)}>
              Begin assessment <ChevronRight size={17} />
            </Button>
          </div>
        )}
        {step === 2 && (
          <div>
            <h2>What are you experiencing?</h2>
            <p>Select all that apply.</p>
            <div className={styles.symptoms}>
              {['Fever', 'Cough', 'Fatigue', 'Headache', 'Chest discomfort', 'Shortness of breath', 'Sore throat', 'Nausea'].map((symptom) => (
                <button
                  key={symptom}
                  className={symptoms.includes(symptom) ? styles.choiceActive : ''}
                  onClick={() => toggleSymptom(symptom)}
                >
                  {symptom}
                </button>
              ))}
            </div>
            <Button disabled={!symptoms.length} onClick={() => setStep(3)}>
              Continue <ChevronRight size={17} />
            </Button>
          </div>
        )}
        {step === 3 && (
          <div>
            <h2>One more detail</h2>
            <p>How long have you had these symptoms?</p>
            <div className={styles.symptoms}>
              {['Less than 24 hours', '1–3 days', '4–7 days', 'More than a week'].map((duration) => (
                <button key={duration} onClick={() => analyze(duration)}>
                  {duration}
                </button>
              ))}
            </div>
            <button className={styles.backButton} onClick={() => setStep(2)}>
              Back to symptoms
            </button>
          </div>
        )}
        {step === 4 &&
          (isLoading ? (
            <div className={styles.centerState}>
              <div className={styles.loader}>
                <span />
                <span />
                <span />
              </div>
              <h2>Reviewing your answers</h2>
              <p>Organizing helpful next steps...</p>
            </div>
          ) : (
            <div className={styles.result}>
              <div className={styles.resultHeader}>
                <CheckCircle2 size={25} />
                <div>
                  <h2>Your guidance is ready</h2>
                  <p>Based on the information you provided</p>
                </div>
              </div>
              <div className={styles.resultBlock}>
                <strong>Suggested next step</strong>
                <p>
                  {symptoms.includes('Chest discomfort') || symptoms.includes('Shortness of breath')
                    ? 'Seek urgent medical assessment now, especially if these symptoms are severe, sudden, or worsening.'
                    : `Consider scheduling a General Medicine appointment to discuss your ${symptoms.join(', ').toLowerCase()} symptoms, present for ${duration.toLowerCase()}.`}
                </p>
              </div>
              <div className={styles.resultBlock}>
                <strong>Watch for warning signs</strong>
                <p>Seek urgent care for severe chest pain, serious difficulty breathing, confusion, or sudden weakness. Call local emergency services for an emergency.</p>
              </div>
              <div className={styles.disclaimer}>
                <ShieldAlert size={18} />
                <span>This is general health information, not a diagnosis. A qualified healthcare professional should evaluate your symptoms.</span>
              </div>
              <Button
                onClick={() => {
                  setStep(1);
                  setSymptoms([]);
                  setDuration('');
                }}
              >
                Start new check
              </Button>
            </div>
          ))}
      </section>
    </div>
  );
}

function Assistant({ userName }: { userName: string }) {
  const [messages, setMessages] = useState([
    {
      from: 'ai',
      text: `Hello ${userName}. I can help you prepare for appointments, understand health information, and organize questions for your care team.`,
    },
  ]);
  const [value, setValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const send = (event: FormEvent) => {
    event.preventDefault();
    if (!value.trim()) return;
    const question = value.trim();
    setValue('');
    setMessages((current) => [...current, { from: 'user', text: question }]);
    setIsTyping(true);
    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          from: 'ai',
          text: 'I can help you prepare a clear question for your clinician. For personal medical advice, please use your next appointment or contact your care team.',
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className={styles.aiPage}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Private care companion</p>
          <h1 className={styles.title}>AI Health Assistant</h1>
          <p className={styles.subtitle}>A calm place to prepare, reflect, and ask better health questions.</p>
        </div>
        <Button variant="ghost" onClick={() => setMessages([])}>
          <Eraser size={16} /> Clear conversation
        </Button>
      </div>
      <section className={styles.chatPanel}>
        <div className={styles.chatHeader}>
          <span className={styles.aiIconSmall}>
            <Bot size={18} />
          </span>
          <div>
            <strong>MedIntel assistant</strong>
            <small>Educational support · not medical advice</small>
          </div>
        </div>
        <div className={styles.messages}>
          {!messages.length && (
            <div className={styles.emptyChat}>
              <MessageCircle size={28} />
              <strong>Start a conversation</strong>
              <p>Ask about preparing for a visit or understanding a report.</p>
            </div>
          )}
          {messages.map((message, index) => (
            <div
              className={`${styles.message} ${message.from === 'user' ? styles.userMessage : ''}`}
              key={`${message.text}-${index}`}
            >
              <span className={styles.messageIcon}>
                {message.from === 'user' ? <User size={15} /> : <Bot size={15} />}
              </span>
              <p>{message.text}</p>
            </div>
          ))}
          {isTyping && (
            <div className={styles.typing}>
              <span />
              <span />
              <span /> Assistant is thinking
            </div>
          )}
        </div>
        <form className={styles.chatForm} onSubmit={send}>
          <input
            aria-label="Message the health assistant"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Ask a health question..."
          />
          <Button aria-label="Send message" type="submit">
            <Send size={17} />
          </Button>
        </form>
      </section>
    </div>
  );
}

export function AIWorkbench({ mode }: { mode: 'symptoms' | 'assistant' }) {
  const { profile } = useAuth();
  return (
    <ProtectedRoute allowedRoles={['PATIENT']}>
      <DashboardLayout
        navItems={navItems.map((item) => ({
          ...item,
          icon: mode === 'symptoms' ? <Activity size={20} /> : <MessageCircle size={20} />,
          active: item.href === `/patient/${mode === 'symptoms' ? 'ai-symptom-checker' : 'assistant'}`,
        }))}
        userRole="Patient"
        userName={profile?.name || 'Patient'}
      >
        {mode === 'symptoms' ? <SymptomChecker /> : <Assistant userName={profile?.name || 'Patient'} />}
      </DashboardLayout>
    </ProtectedRoute>
  );
}