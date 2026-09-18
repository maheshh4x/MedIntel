import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { Button } from './Button';
import styles from './DoctorCard.module.css';
import Image from 'next/image';

interface DoctorCardProps {
  name: string;
  speciality: string;
  rating: number;
  availability: string;
  location?: string;
  imageUrl?: string;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({
  name,
  speciality,
  rating,
  availability,
  location,
  imageUrl,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {imageUrl ? (
          <Image src={imageUrl} alt={name} layout="fill" objectFit="cover" />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}
        <div className={styles.ratingBadge}>
          <Star size={14} fill="var(--color-warning)" color="var(--color-warning)" />
          <span>{rating.toFixed(1)}</span>
        </div>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.speciality}>{speciality}</p>
        
        {location && (
          <div className={styles.infoRow}>
            <MapPin size={14} />
            <span>{location}</span>
          </div>
        )}
        
        <p className={styles.availability}>
          <span className={styles.bold}>Availability:</span> {availability}
        </p>

        <div className={styles.action}>
          <Button fullWidth variant="primary">Book Now</Button>
        </div>
      </div>
    </div>
  );
};
