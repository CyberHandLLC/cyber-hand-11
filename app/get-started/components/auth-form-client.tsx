"use client";

/**
 * Authentication Form Component
 *
 * Client-side component that handles the interactive login/signup form.
 * Manages form state and navigation upon submission.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";

export function AuthFormClient() {
  const router = useRouter();
  const { theme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle authentication
    // Form data would be processed here in a production environment
    // For development, we're redirecting without actual authentication
    router.push("/");
  };

  // Theme-based styling for form elements
  const cardClass =
    theme === "light"
      ? "bg-white border border-gray-200 shadow-xl"
      : "bg-[#161e29]/90 backdrop-blur-sm border border-gray-800 cyber-shadow-md";

  const textClass = theme === "light" ? "text-gray-800" : "text-white";

  const subtitleClass = theme === "light" ? "text-gray-600" : "text-gray-300";

  const labelClass = theme === "light" ? "text-gray-700" : "text-cyan-300";

  const inputClass =
    theme === "light"
      ? "bg-white border border-gray-200 text-gray-900 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
      : "bg-gray-900/70 border border-gray-700 text-white focus:outline-none focus:border-cyan-500";

  const linkClass =
    theme === "light" ? "text-cyan-600 hover:text-cyan-700" : "text-cyan-400 hover:text-cyan-300";

  return (
    <div className={`rounded-xl p-8 w-full max-w-md ${cardClass}`}>
      <div className="text-center mb-8">
        <h1 className={`text-2xl sm:text-3xl font-bold ${textClass} mb-2`}>
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>
        <p className={`${subtitleClass}`}>
          {isLogin ? "Sign in to access your account" : "Join us and start your digital journey"}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Name field for signup only */}
        {!isLogin && (
          <div className="mb-6">
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

        <div className="mb-6">
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

        <div className="mb-6">
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

        <Button variant="primary" size="md" className="w-full" type="submit">
          {isLogin ? "Log In" : "Sign Up"}
        </Button>
      </form>

      {/* Toggle */}
      <div className="text-center mt-8">
        <button onClick={() => setIsLogin(!isLogin)} className={`text-sm ${linkClass}`}>
          {isLogin ? "Need an account? Sign Up" : "Already have an account? Log In"}
        </button>
      </div>

      {/* Back link */}
      <div className="text-center mt-6">
        <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
          Back to Home
        </Button>
      </div>
    </div>
  );
}
