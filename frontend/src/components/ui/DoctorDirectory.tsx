'use client';

import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Search, Star, X } from 'lucide-react';
import { Button } from './Button';
import { mockDoctors } from '../../data/mockDoctors';
import styles from './DoctorDirectory.module.css';

export function DoctorDirectory() {
  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState('All specialties');
  const [location, setLocation] = useState('All locations');
  const [rating, setRating] = useState('Any rating');
  const specialties = ['All specialties', ...Array.from(new Set(mockDoctors.map((doctor) => doctor.speciality)))];
  const locations = ['All locations', ...Array.from(new Set(mockDoctors.map((doctor) => doctor.location)))];
  const filteredDoctors = mockDoctors.filter((doctor) => {
    const matchesQuery = `${doctor.name} ${doctor.speciality}`.toLowerCase().includes(query.toLowerCase());
    const matchesSpecialty = specialty === 'All specialties' || doctor.speciality === specialty;
    const matchesLocation = location === 'All locations' || doctor.location === location;
    const matchesRating = rating === 'Any rating' || doctor.rating >= Number(rating);
    return matchesQuery && matchesSpecialty && matchesLocation && matchesRating;
  });
  const clearFilters = () => { setQuery(''); setSpecialty('All specialties'); setLocation('All locations'); setRating('Any rating'); };

  return <div className={styles.directory}><div className={styles.searchBar}><Search size={19} /><input aria-label="Search doctors" placeholder="Search by doctor or specialty" value={query} onChange={(event) => setQuery(event.target.value)} /></div><div className={styles.filters}><select aria-label="Filter by specialty" value={specialty} onChange={(event) => setSpecialty(event.target.value)}>{specialties.map((item) => <option key={item}>{item}</option>)}</select><select aria-label="Filter by location" value={location} onChange={(event) => setLocation(event.target.value)}>{locations.map((item) => <option key={item}>{item}</option>)}</select><select aria-label="Filter by rating" value={rating} onChange={(event) => setRating(event.target.value)}><option>Any rating</option><option value="4.9">4.9+ rating</option><option value="4.8">4.8+ rating</option></select>{(query || specialty !== 'All specialties' || location !== 'All locations' || rating !== 'Any rating') && <button className={styles.clear} onClick={clearFilters}><X size={15} /> Clear filters</button>}</div><p className={styles.resultCount}>{filteredDoctors.length} providers available</p>{filteredDoctors.length ? <div className={styles.grid}>{filteredDoctors.map((doctor) => <article className={styles.card} key={doctor.id}><div className={styles.image}><Image src={doctor.imageUrl} alt={doctor.name} fill sizes="(max-width: 700px) 90vw, 260px" /><span><Star size={14} fill="currentColor" /> {doctor.rating}</span></div><div className={styles.cardBody}><div><h2>{doctor.name}</h2><p className={styles.specialty}>{doctor.speciality}</p></div><p className={styles.meta}><MapPin size={15} /> {doctor.location}</p><p className={styles.availability}>Next available <strong>{doctor.availability}</strong></p><div className={styles.cardActions}><Link href={`/doctor/${doctor.id}`}>View profile</Link><Link href="/patient/appointments"><Button size="sm">Book</Button></Link></div></div></article>)}</div> : <div className={styles.empty}><Search size={28} /><h2>No doctors found</h2><p>Try a different name, specialty, or location.</p><Button variant="outline" onClick={clearFilters}>Clear filters</Button></div>}</div>;
}