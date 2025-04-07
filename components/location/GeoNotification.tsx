'use client';

import { useState, useEffect } from 'react';
import CookieConsent from 'react-cookie-consent';
import { useLocation } from '@/lib/location/location-context';

/**
 * Geolocation Notification Component
 * 
 * Displays a dismissable notification about location detection
 * that automatically disappears after a timeout if not interacted with
 */
export default function GeoNotification() {
  const { location, resetLocation } = useLocation();
  const [showNotification, setShowNotification] = useState(false);
  
  // Only show notification after component mount (client-side only)
  useEffect(() => {
    // Check if we haven't shown this notification before
    const hasSeenNotification = localStorage.getItem('geo-notification-seen');
    
    if (!hasSeenNotification) {
      setShowNotification(true);
      
      // Auto-dismiss after 10 seconds if user doesn't interact
      const timer = setTimeout(() => {
        setShowNotification(false);
        localStorage.setItem('geo-notification-seen', 'true');
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  // If user denies location usage, reset to minimal data
  const handleDeny = () => {
    resetLocation();
    localStorage.setItem('geo-consent', 'denied');
    localStorage.setItem('geo-notification-seen', 'true');
    setShowNotification(false);
  };
  
  // If user accepts, mark as seen and continue using detected location
  const handleAccept = () => {
    localStorage.setItem('geo-consent', 'accepted');
    localStorage.setItem('geo-notification-seen', 'true');
    setShowNotification(false);
  };
  
  if (!showNotification) return null;
  
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      declineButtonText="Decline"
      enableDeclineButton
      onDecline={handleDeny}
      onAccept={handleAccept}
      cookieName="geo-consent"
      expires={365}
      buttonStyle={{ 
        background: 'var(--color-accent)', 
        color: 'white', 
        fontSize: '14px',
        borderRadius: '4px',
        padding: '8px 16px'
      }}
      declineButtonStyle={{
        background: 'transparent',
        border: '1px solid var(--color-text)',
        color: 'var(--color-text)',
        fontSize: '14px',
        borderRadius: '4px',
        padding: '8px 16px'
      }}
      contentStyle={{ flex: '1 0 300px' }}
      style={{
        background: 'var(--color-background)',
        color: 'var(--color-text)',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
        zIndex: 999,
        padding: '12px 20px',
        alignItems: 'center',
      }}
    >
      <span style={{ fontSize: '14px' }}>
        We use your location ({location.city || location.region || location.country || 'unknown'}) to customize content. 
        This helps us provide region-specific information and services. You can change this later in site settings.
      </span>
    </CookieConsent>
  );
}
