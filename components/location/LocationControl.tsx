'use client';

import { useState } from 'react';
import { useLocation } from '@/lib/location/location-context';
import styles from './LocationControl.module.css';

/**
 * Location Control Component
 * 
 * A small, persistent control that allows users to view and manage 
 * their location settings at any time
 */
export default function LocationControl() {
  const { location, overrideLocation, resetLocation } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  // Format location for display
  const locationText = location.city || location.region || location.country || 'Unknown location';
  const isDetected = location.isDetected;
  
  // Toggle dropdown
  const toggleDropdown = () => setIsOpen(prev => !prev);
  
  // Close dropdown
  const closeDropdown = () => setIsOpen(false);
  
  // Reset to detected location
  const handleReset = () => {
    resetLocation();
    localStorage.setItem('geo-consent', 'accepted');
    closeDropdown();
  };
  
  // Decline location usage
  const handleDecline = () => {
    // Reset with empty data
    overrideLocation({
      isDetected: false,
      lastUpdated: Date.now()
    });
    localStorage.setItem('geo-consent', 'denied');
    closeDropdown();
  };
  
  return (
    <div className={styles.container}>
      <button 
        onClick={toggleDropdown}
        className={styles.trigger}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className={styles.locationIcon}>📍</span>
        <span className={styles.locationText}>{locationText}</span>
      </button>
      
      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <h3 className={styles.title}>Location Settings</h3>
            <button className={styles.closeButton} onClick={closeDropdown}>×</button>
          </div>
          
          <div className={styles.content}>
            <p className={styles.status}>
              {isDetected 
                ? 'We detected your location to provide relevant content.'
                : 'You have opted out of location detection.'}
            </p>
            
            <div className={styles.details}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Location:</span>
                <span className={styles.detailValue}>{locationText}</span>
              </div>
              {location.country && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Country:</span>
                  <span className={styles.detailValue}>{location.country}</span>
                </div>
              )}
              {location.region && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Region:</span>
                  <span className={styles.detailValue}>{location.region}</span>
                </div>
              )}
            </div>
            
            <div className={styles.actions}>
              {!isDetected && (
                <button 
                  className={styles.actionButton}
                  onClick={handleReset}
                >
                  Enable Location
                </button>
              )}
              {isDetected && (
                <button 
                  className={styles.actionButton}
                  onClick={handleDecline}
                >
                  Disable Location
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
