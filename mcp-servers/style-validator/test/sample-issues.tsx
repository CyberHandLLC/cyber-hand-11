// Sample file with common style issues for testing
// This deliberately includes various style violations

// Missing 'use client' despite using browser APIs
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

// 'any' type usage (violation)
function processData(data: any) {
  return data.map((item: any) => {
    return {
      id: item.id,
      name: item.name,
      // More processing
    };
  });
}

// Component with incorrect naming (should be PascalCase)
export const buttonComponent = () => {
  // Browser API in what should be marked as a Client Component
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Unused variable without underscore prefix
  const apiKey = 'abc123';
  
  // Effect with browser API
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <Button onClick={() => alert('Clicked!')}>
      Window width: {windowWidth}px
    </Button>
  );
};

// Default export with same issues
export default buttonComponent;
