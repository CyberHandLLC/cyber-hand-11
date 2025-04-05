"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";
import { PageLayout, SectionContainer } from "@/components/custom/page-layout";
import { motion } from "framer-motion";

export default function GetStarted() {
  const router = useRouter();
  const { theme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle authentication
    console.log("Form submitted", { email, password, name });
    // For now, just redirect to home
    router.push('/');
  };

  // Theme-based styling for form elements
  const cardClass = theme === 'light'
    ? "bg-white border border-gray-200 shadow-xl"
    : "bg-[#161e29]/90 backdrop-blur-sm border border-gray-800 cyber-shadow-md";
    
  const textClass = theme === 'light'
    ? "text-gray-800"
    : "text-white";
    
  const subtitleClass = theme === 'light'
    ? "text-gray-600"
    : "text-gray-300";
    
  const labelClass = theme === 'light'
    ? "text-gray-700"
    : "text-cyan-300";
    
  const inputClass = theme === 'light'
    ? "bg-white border border-gray-200 text-gray-900 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
    : "bg-gray-900/70 border border-gray-700 text-white focus:outline-none focus:border-cyan-500";
    
  const linkClass = theme === 'light'
    ? "text-cyan-600 hover:text-cyan-700"
    : "text-cyan-400 hover:text-cyan-300";

  return (
    <PageLayout>
      <SectionContainer className="min-h-screen flex items-center justify-center py-20">
        <motion.div 
          className={`rounded-xl p-8 w-full max-w-md ${cardClass}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h1 className={`text-2xl sm:text-3xl font-bold ${textClass} mb-2`}>
              {isLogin ? "Welcome Back" : "Join CyberHand"}
            </h1>
            <p className={subtitleClass}>
              {isLogin ? "Sign in to access your account" : "Create an account to get started"}
            </p>
          </div>
        
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className={`block text-sm mb-1 ${labelClass}`}>
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className={`w-full rounded py-3 px-4 ${inputClass}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  placeholder="John Doe"
                />
              </div>
            )}
            
            <div>
              <label htmlFor="email" className={`block text-sm mb-1 ${labelClass}`}>
                Email
              </label>
              <input
                type="email"
                id="email"
                className={`w-full rounded py-3 px-4 ${inputClass}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className={`block text-sm mb-1 ${labelClass}`}>
                Password
              </label>
              <input
                type="password"
                id="password"
                className={`w-full rounded py-3 px-4 ${inputClass}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            
            <Button variant="primary" size="md" className="w-full mt-6" type="submit">
              {isLogin ? "Log In" : "Sign Up"}
            </Button>
          </form>
          
          {/* Toggle */}
          <div className="text-center mt-8">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className={`text-sm ${linkClass}`}
            >
              {isLogin ? "Need an account? Sign Up" : "Already have an account? Log In"}
            </button>
          </div>
          
          {/* Back link */}
          <div className="text-center mt-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push('/')}
            >
              Back to Home
            </Button>
          </div>
        </motion.div>
      </SectionContainer>
    </PageLayout>
  );
}
