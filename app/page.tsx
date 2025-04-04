"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CyberLogo } from "@/components/custom/cyber-logo";

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/get-started");
  };

  const handleLearnMore = () => {
    router.push("/services");
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden cyber-circuit-bg">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-black" 
        style={{
          backgroundImage: "url('/images/cyberhand-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />

      {/* Content container */}
      <div className="relative z-20 px-4 py-16 sm:px-6 lg:px-8 w-full max-w-4xl text-center">
        {/* CyberHand Logo */}
        <CyberLogo size="md" className="mb-6 animate-fade-in" />

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl mb-8 animate-fade-in">
          <span className="cyber-gradient-text">
            Next-Gen Digital Agency
          </span>
        </h1>

        {/* Button container */}
        <div className="inline-flex flex-wrap gap-3 sm:gap-4 justify-center mt-6 sm:mt-8 animate-fade-in-delayed">
          <Button 
            variant="primary" 
            size="md"
            onClick={handleGetStarted}
            className="min-w-[120px] sm:min-w-[140px]"
          >
            Get Started
          </Button>
          
          <Button 
            variant="outline" 
            size="md"
            onClick={handleLearnMore}
            className="min-w-[120px] sm:min-w-[140px]"
          >
            Learn More
          </Button>
        </div>

        {/* Circuit elements */}
        <div className="absolute inset-0 z-5 opacity-30 pointer-events-none">
          <div className="absolute h-px w-24 bg-cyan-500 animate-pulse-1" style={{ top: '20%', left: '10%' }} />
          <div className="absolute h-px w-36 bg-cyan-500 animate-pulse-2" style={{ top: '65%', left: '75%' }} />
          <div className="absolute h-px w-20 bg-cyan-500 animate-pulse-3" style={{ top: '40%', left: '85%' }} />
          <div className="absolute h-px w-28 bg-cyan-500 animate-pulse-1" style={{ top: '80%', left: '25%' }} />
          <div className="absolute h-px w-32 bg-cyan-500 animate-pulse-2" style={{ top: '30%', left: '60%' }} />
          <div className="absolute h-px w-16 bg-cyan-500 animate-pulse-3" style={{ top: '70%', left: '15%' }} />
          <div className="absolute h-px w-40 bg-cyan-500 animate-pulse-1" style={{ top: '50%', left: '50%' }} />
          <div className="absolute h-px w-24 bg-cyan-500 animate-pulse-2" style={{ top: '15%', left: '40%' }} />
          <div className="absolute h-px w-20 bg-cyan-500 animate-pulse-3" style={{ top: '90%', left: '70%' }} />
          <div className="absolute h-px w-36 bg-cyan-500 animate-pulse-1" style={{ top: '25%', left: '25%' }} />
          
          {/* Glowing dots */}
          <div className="absolute w-1 h-1 rounded-full bg-cyan-400 shadow-glow animate-pulse-glow" style={{ top: '45%', left: '30%' }} />
          <div className="absolute w-1 h-1 rounded-full bg-cyan-400 shadow-glow animate-pulse-glow-2" style={{ top: '75%', left: '65%' }} />
          <div className="absolute w-1 h-1 rounded-full bg-cyan-400 shadow-glow animate-pulse-glow" style={{ top: '25%', left: '70%' }} />
          <div className="absolute w-1 h-1 rounded-full bg-cyan-400 shadow-glow animate-pulse-glow-2" style={{ top: '55%', left: '15%' }} />
          <div className="absolute w-1 h-1 rounded-full bg-cyan-400 shadow-glow animate-pulse-glow" style={{ top: '85%', left: '45%' }} />
          <div className="absolute w-1 h-1 rounded-full bg-cyan-400 shadow-glow animate-pulse-glow-2" style={{ top: '15%', left: '85%' }} />
          <div className="absolute w-1 h-1 rounded-full bg-cyan-400 shadow-glow animate-pulse-glow" style={{ top: '35%', left: '50%' }} />
          <div className="absolute w-1 h-1 rounded-full bg-cyan-400 shadow-glow animate-pulse-glow-2" style={{ top: '65%', left: '35%' }} />
        </div>
      </div>
    </main>
  );
}
