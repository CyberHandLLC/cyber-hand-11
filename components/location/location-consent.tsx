"use client";

/**
 * Location Consent Component
 *
 * Displays a notification that allows users to approve or deny geolocation.
 * Uses react-cookie-consent library for a standardized consent UI.
 * Auto-dismisses after a timeout if not interacted with.
 */

import React, { useState, useEffect } from "react";
import CookieConsent from "react-cookie-consent";
import { useLocation } from "@/lib/location/location-context";

// Cookie name for storing location consent preference
const LOCATION_CONSENT_COOKIE = "location-consent";

// Timeout for auto-dismiss in milliseconds
const AUTO_DISMISS_TIMEOUT = 15000; // 15 seconds

interface LocationConsentProps {
  // Optional custom styling
  className?: string;
}

/**
 * Client Component: Location Consent Banner
 * Displays a consent notification for location detection
 */
export function LocationConsent({ className }: LocationConsentProps) {
  const { location, overrideLocation } = useLocation();
  const [visible, setVisible] = useState(false);

  // Show consent notification if user hasn't made a decision yet, regardless of location detection state
  useEffect(() => {
    // Check if user has already made a decision
    const hasConsent = document.cookie.includes(`${LOCATION_CONSENT_COOKIE}=true`);
    const hasDenied = document.cookie.includes(`${LOCATION_CONSENT_COOKIE}=false`);

    // Check if we're in production
    const isProduction = process.env.NODE_ENV === "production";

    // In development, only show if location is detected
    // In production, show regardless of detection state if no consent decision exists
    if (
      (!isProduction && location.isDetected && !hasConsent && !hasDenied) ||
      (isProduction && !hasConsent && !hasDenied)
    ) {
      setVisible(true);

      // Auto-dismiss after timeout
      const timer = setTimeout(() => {
        setVisible(false);
      }, AUTO_DISMISS_TIMEOUT);

      return () => clearTimeout(timer);
    }
  }, [location.isDetected]);

  // Handle user denying location use
  const handleDecline = () => {
    // Clear detected location data by using an empty override
    overrideLocation({
      isDetected: false,
      lastUpdated: Date.now(),
    });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      declineButtonText="Decline"
      enableDeclineButton
      onDecline={handleDecline}
      cookieName={LOCATION_CONSENT_COOKIE}
      expires={90} // Expires after 90 days
      style={{
        backgroundColor: "var(--color-background-secondary)",
        padding: "0.75rem 1.5rem",
        alignItems: "center",
        zIndex: 9999,
        borderTop: "1px solid var(--color-border)",
      }}
      buttonStyle={{
        backgroundColor: "var(--color-primary)",
        color: "white",
        fontSize: "14px",
        padding: "0.5rem 1rem",
        borderRadius: "4px",
      }}
      declineButtonStyle={{
        backgroundColor: "transparent",
        color: "var(--color-text)",
        fontSize: "14px",
        padding: "0.5rem 1rem",
        borderRadius: "4px",
        border: "1px solid var(--color-border)",
      }}
      contentStyle={{
        flex: 1,
        margin: 0,
      }}
      buttonWrapperClasses={className}
    >
      <span style={{ fontSize: "14px" }}>
        {location.isDetected ? (
          <>
            We detect your location ({location.city ? `${location.city}, ` : ""}
            {location.country || "Unknown"}) to provide you with relevant content. Do you consent to
            this?
          </>
        ) : (
          <>
            We use location data to provide you with region-specific content and improve your
            experience. Do you consent to this?
          </>
        )}
      </span>
    </CookieConsent>
  );
}
