import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, MapPin, Star } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { PublicPage } from '../../../components/layout/PublicPage';
import { mockDoctors } from '../../../data/mockDoctors';

export default async function DoctorProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doctor = mockDoctors.find((item) => item.id === id) ?? mockDoctors[0];
  return <PublicPage title={doctor.name} intro={`${doctor.speciality} specialist focused on thoughtful, accessible care.`}><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '2rem', marginTop: '2.5rem', alignItems: 'start' }}><div style={{ position: 'relative', height: 320, overflow: 'hidden', borderRadius: 'var(--radius-md)', background: 'var(--color-secondary-light)' }}><Image src={doctor.imageUrl} alt={doctor.name} fill sizes="(max-width: 600px) 100vw, 320px" style={{ objectFit: 'cover' }} /></div><div style={{ display: 'grid', gap: '1rem', minWidth: 0 }}><div style={{ display: 'flex', gap: '.4rem', alignItems: 'center', color: 'var(--color-primary)', fontWeight: 700 }}><Star size={17} fill="currentColor" /> {doctor.rating} patient rating</div><p><MapPin size={16} style={{ verticalAlign: 'middle', marginRight: '.35rem' }} /> {doctor.location}</p><p><CalendarDays size={16} style={{ verticalAlign: 'middle', marginRight: '.35rem' }} /> Next available: <strong>{doctor.availability}</strong></p><div style={{ padding: '1.25rem', marginTop: '.5rem', borderRadius: 'var(--radius-md)', background: 'var(--color-secondary-light)' }}><h2 style={{ fontSize: '1.1rem' }}>About this provider</h2><p style={{ marginTop: '.5rem' }}>Dr. {doctor.name.replace('Dr. ', '')} combines evidence-informed treatment with clear explanations and collaborative care planning.</p></div><Link href="/patient/appointments"><Button>Book an appointment</Button></Link></div></div></PublicPage>;
}