"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";
import { Navbar } from "@/components/custom/navbar";
import { ServiceCard } from "@/components/custom/service-card";
import { ServiceCarousel } from "@/components/custom/service-carousel";
import { services } from "@/data/services";
import { motion } from "framer-motion";

// Constants
const MOBILE_BREAKPOINT = 768; // px

/**
 * Services page component showing all service offerings with pricing 
 */
export default function Services() {
  const router = useRouter();
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  
  // Use useEffect to safely access window object on client-side only
  useEffect(() => {
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Theme-based styling
  const bgClass = theme === 'light' 
    ? "bg-slate-50" 
    : "bg-[#0c1117]";
    
  const cardClass = theme === 'light'
    ? "bg-white border border-gray-200 shadow-lg"
    : "bg-[#161e29]/90 backdrop-blur-sm border border-gray-800";
    
  const textClass = theme === 'light'
    ? "text-gray-800"
    : "text-white";
    
  const subtitleClass = theme === 'light'
    ? "text-gray-600"
    : "text-gray-300";

  // Handle service selection
  const handleSelectService = (serviceId: string) => {
    console.log(`Selected service: ${serviceId}`);
    router.push(`/contact?service=${serviceId}`);
  };

  return (
    <>
      <Navbar />
      <main className={`min-h-screen ${bgClass}`}>
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute -bottom-40 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        </div>
        
        {/* Hero section with title */}
        <div className="relative z-10 pt-20 lg:pt-28 px-4 max-w-7xl mx-auto text-center">
          <motion.h1 
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 ${textClass}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Our Digital Services
          </motion.h1>
          <motion.p 
            className={`${subtitleClass} max-w-3xl mx-auto text-lg mb-16`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Choose from our range of digital marketing and web services to elevate your online presence. 
            All plans include regular updates and dedicated support.
          </motion.p>
        </div>
        
        <div className="relative z-10 px-4 max-w-7xl mx-auto">
          {/* Desktop Service Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                {...service}
                index={index}
                onSelect={handleSelectService}
              />
            ))}
          </div>
          
          {/* Mobile Service Carousel */}
          <div className="md:hidden">
            <ServiceCarousel 
              services={services} 
              onSelectService={handleSelectService} 
            />
          </div>
          
          {/* CTA Section */}
          <motion.div 
            className={`mt-20 text-center p-8 rounded-xl ${theme === 'light' ? 'bg-white shadow-xl' : 'bg-gray-900/50 border border-gray-800'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2 className={`text-2xl sm:text-3xl font-bold mb-4 ${textClass}`}>Need a custom solution?</h2>
            <p className={`${subtitleClass} max-w-2xl mx-auto mb-6`}>
              We can create a tailored package that perfectly fits your business needs and budget.
            </p>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => router.push('/contact')}
              className="px-8"
            >
              Contact Us
            </Button>
          </motion.div>
          
          {/* Back link */}
          <div className="text-center mt-10 pb-10">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push('/')}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}