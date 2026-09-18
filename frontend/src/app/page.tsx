import React from 'react';
import Image from 'next/image';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { DoctorCard } from '../components/ui/DoctorCard';
import { Search, MapPin, Calendar, Heart, Activity, SearchIcon, CheckCircle } from 'lucide-react';
import { mockDoctors } from '../data/mockDoctors';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        
        {/* HERO SECTION */}
        <section className={styles.heroSection}>
          <div className={`container ${styles.heroContainer}`}>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                Your Journey to Wellness, Simplified.
              </h1>
              <p className={styles.heroSubtitle}>
                AI-powered appointment booking and clinical intelligence for smarter, faster healthcare.
              </p>
              
              <div className={styles.searchBox}>
                <div className={styles.searchFields}>
                  <Input 
                    icon={<Search size={18} />} 
                    placeholder="Find a Doctor, Speciality or Clinic" 
                    fullWidth
                    style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}
                  />
                  <div className={styles.divider}></div>
                  <Input 
                    icon={<MapPin size={18} />} 
                    placeholder="Location (City/Zip Code)" 
                    style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}
                  />
                  <div className={styles.divider}></div>
                  <Input 
                    icon={<Calendar size={18} />} 
                    type="date"
                    style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}
                  />
                </div>
                <Button size="lg" className={styles.searchButton}>Find & Book</Button>
              </div>
            </div>
            
            <div className={styles.heroImageContainer}>
              <div className={styles.heroIllustration}>
                <div className={styles.illustrationCircle} />
                <Image className={styles.heroPhoto} src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=85" alt="Doctor speaking with a patient in a bright clinic" fill sizes="(max-width: 1023px) 70vw, 34vw" />
                <div className={styles.floatingCard1}>
                  <Heart size={20} color="var(--color-primary)" />
                  <span>Vitals Stable</span>
                </div>
                <div className={styles.floatingCard2}>
                  <CheckCircle size={20} color="var(--color-success)" />
                  <span>Appointment Confirmed</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className={styles.howItWorksSection}>
          <div className="container">
            <h2 className={styles.sectionTitle}>How MedIntel Works</h2>
            <div className={styles.stepsGrid}>
              <div className={styles.stepCard}>
                <div className={styles.stepIconWrapper}>
                  <SearchIcon size={32} color="var(--color-primary)" />
                </div>
                <h3 className={styles.stepTitle}>1. Search</h3>
                <p className={styles.stepDesc}>(Doctor/Speciality)</p>
              </div>
              <div className={styles.stepCard}>
                <div className={styles.stepIconWrapper}>
                  <Calendar size={32} color="var(--color-primary)" />
                </div>
                <h3 className={styles.stepTitle}>2. Choose a Slot</h3>
                <p className={styles.stepDesc}>(Calendar View)</p>
              </div>
              <div className={styles.stepCard}>
                <div className={styles.stepIconWrapper}>
                  <CheckCircle size={32} color="var(--color-primary)" />
                </div>
                <h3 className={styles.stepTitle}>3. Confirm Appointment</h3>
                <p className={styles.stepDesc}>Receive care easily</p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED DOCTORS SECTION */}
        <section className={styles.doctorsSection}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Featured Healthcare Providers</h2>
            <p className={styles.sectionSubtitle}>Book an appointment with top-rated specialists today.</p>
            
            <div className={styles.doctorsGrid}>
              {mockDoctors.map(doctor => (
                <DoctorCard 
                  key={doctor.id}
                  name={doctor.name}
                  speciality={doctor.speciality}
                  rating={doctor.rating}
                  location={doctor.location}
                  availability={doctor.availability}
                  imageUrl={doctor.imageUrl}
                />
              ))}
            </div>
          </div>
        </section>

        {/* AI PREVIEW / AI SYMPTOM SECTION */}
        <section className={styles.aiSection}>
          <div className={`container ${styles.aiContainer}`}>
            <div className={styles.aiContent}>
              <h2 className={styles.sectionTitle} style={{ textAlign: 'left' }}>
                Not sure which doctor you need?
              </h2>
              <p className={styles.aiSubtitle}>
                Describe your symptoms and let MedIntel&apos;s AI help identify the right department and care option.
              </p>
              <div className={styles.aiForm}>
                <textarea 
                  className={styles.aiTextarea} 
                  rows={4} 
                  placeholder="e.g. I have a fever, cough, and fatigue for three days..."
                ></textarea>
                <Button size="lg" className={styles.aiButton}>Analyze Symptoms</Button>
              </div>
            </div>
            <div className={styles.aiGraphic}>
              <div className={styles.aiGraphicCard}>
                <div className={styles.aiAnalysisHeader}>
                  <Activity size={24} color="var(--color-primary)" />
                  <h4>AI Analysis Example</h4>
                </div>
                <div className={styles.aiAnalysisBody}>
                  <div className={styles.aiRow}>
                    <span>Suggested Dept:</span>
                    <strong>General Medicine</strong>
                  </div>
                  <div className={styles.aiRow}>
                    <span>Care Priority:</span>
                    <strong style={{ color: 'var(--color-success)' }}>Normal</strong>
                  </div>
                  <p className={styles.aiNote}>* AI-assisted recommendation. This information does not replace professional medical advice.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
      </main>
      <Footer />
    </>
  );
}
