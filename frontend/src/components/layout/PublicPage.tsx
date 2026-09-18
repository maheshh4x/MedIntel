import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function PublicPage({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return <><Navbar /><main className="main-content container" style={{ paddingTop: '4rem', paddingBottom: '5rem' }}><div style={{ maxWidth: 760 }}><p style={{ color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.75rem' }}>MedIntel healthcare network</p><h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginTop: '0.75rem' }}>{title}</h1><p style={{ fontSize: '1.1rem', marginTop: '1rem', maxWidth: 620 }}>{intro}</p>{children}</div></main><Footer /></>;
}

export const contactDetails = [{ icon: <Phone size={20} />, label: 'Call us', value: '+1 (800) 555-0199' }, { icon: <Mail size={20} />, label: 'Email', value: 'care@medintel.example' }, { icon: <MapPin size={20} />, label: 'Visit', value: 'MedIntel Central, 24 Health Avenue' }];