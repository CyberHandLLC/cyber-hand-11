"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CyberLogo } from "@/components/custom/cyber-logo";

// Define types for circuit elements
interface CircuitLineProps {
  width: string;
  animation: string;
  position: {
    top: string;
    left: string;
  };
}

interface GlowingDotProps {
  animation: string;
  position: {
    top: string;
    left: string;
  };
}

// Component for circuit line
const CircuitLine = ({ width, animation, position }: CircuitLineProps) => (
  <div 
    className={`absolute h-px bg-cyan-500 animate-${animation}`} 
    style={{ 
      width, 
      top: position.top, 
      left: position.left 
    }} 
  />
);

// Component for glowing dot
const GlowingDot = ({ animation, position }: GlowingDotProps) => (
  <div 
    className={`absolute w-1 h-1 rounded-full bg-cyan-400 shadow-glow animate-${animation}`} 
    style={{ 
      top: position.top, 
      left: position.left 
    }} 
  />
);

// Circuit elements data
const circuitLines: CircuitLineProps[] = [
  { width: '24px', animation: 'pulse-1', position: { top: '20%', left: '10%' } },
  { width: '36px', animation: 'pulse-2', position: { top: '65%', left: '75%' } },
  { width: '20px', animation: 'pulse-3', position: { top: '40%', left: '85%' } },
  { width: '28px', animation: 'pulse-1', position: { top: '80%', left: '25%' } },
  { width: '32px', animation: 'pulse-2', position: { top: '30%', left: '60%' } },
  { width: '16px', animation: 'pulse-3', position: { top: '70%', left: '15%' } },
  { width: '40px', animation: 'pulse-1', position: { top: '50%', left: '50%' } },
  { width: '24px', animation: 'pulse-2', position: { top: '15%', left: '40%' } },
  { width: '20px', animation: 'pulse-3', position: { top: '90%', left: '70%' } },
  { width: '36px', animation: 'pulse-1', position: { top: '25%', left: '25%' } },
];

const glowingDots: GlowingDotProps[] = [
  { animation: 'pulse-glow', position: { top: '45%', left: '30%' } },
  { animation: 'pulse-glow-2', position: { top: '75%', left: '65%' } },
  { animation: 'pulse-glow', position: { top: '25%', left: '70%' } },
  { animation: 'pulse-glow-2', position: { top: '55%', left: '15%' } },
  { animation: 'pulse-glow', position: { top: '85%', left: '45%' } },
  { animation: 'pulse-glow-2', position: { top: '15%', left: '85%' } },
  { animation: 'pulse-glow', position: { top: '35%', left: '50%' } },
  { animation: 'pulse-glow-2', position: { top: '65%', left: '35%' } },
];

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

        {/* Circuit elements container */}
        <div className="absolute inset-0 z-5 opacity-30 pointer-events-none">
          {/* Circuit lines */}
          {circuitLines.map((line, index) => (
            <CircuitLine
              key={`line-${index}`}
              width={line.width}
              animation={line.animation}
              position={line.position}
            />
          ))}
          
          {/* Glowing dots */}
          {glowingDots.map((dot, index) => (
            <GlowingDot
              key={`dot-${index}`}
              animation={dot.animation}
              position={dot.position}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
