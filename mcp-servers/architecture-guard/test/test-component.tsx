// Test component for architecture validation
// Contains deliberate architectural issues to test our enhanced validator

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { fetchProductData } from '@/lib/data';

// Missing 'use client' directive despite using client features
export default function ProductCard({ productId }) {
  // Using React hooks without 'use client' directive
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Missing dependency array in useEffect
  useEffect(() => {
    // Missing React cache() for data fetching
    const fetchData = async () => {
      try {
        // Sequential fetches creating waterfall
        const data = await fetch(`/api/products/${productId}`);
        const details = await fetch(`/api/products/${productId}/details`);
        
        // Missing Next.js 15.2.4 fetch options
        setProduct({
          ...await data.json(),
          details: await details.json()
        });
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  });
  
  // Browser API usage without proper client component setup
  const handleAddToCart = () => {
    localStorage.setItem('cart', JSON.stringify([...(JSON.parse(localStorage.getItem('cart') || '[]')), productId]));
    window.dispatchEvent(new CustomEvent('cart-update'));
  };
  
  // Missing Suspense boundary
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!product) {
    return <div>Product not found</div>;
  }
  
  return (
    <div className="border rounded-md p-4">
      <h2 className="text-xl font-bold">{product.name}</h2>
      <p className="text-gray-600">{product.description}</p>
      <div className="flex items-center mt-4">
        <Badge>{product.category}</Badge>
        <span className="ml-auto font-bold">${product.price}</span>
      </div>
      <Button 
        onClick={handleAddToCart}
        className="w-full mt-4"
      >
        Add to Cart
      </Button>
    </div>
  );
}
