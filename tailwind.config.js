/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["var(--font-orbitron)"],
      },
      colors: {
        primary: "#06b6d4", // cyan-500
        secondary: "#0ea5e9", // sky-500
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "fade-in-delayed": "fadeIn 0.8s ease-out 0.2s forwards",
        "pulse-1": "pulseWidth 3s ease-in-out infinite",
        "pulse-2": "pulseWidth 4s ease-in-out 1s infinite",
        "pulse-3": "pulseWidth 5s ease-in-out 2s infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "pulse-glow-2": "pulseGlow 4s ease-in-out 1.5s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseWidth: {
          "0%, 100%": { width: "0px", opacity: "0" },
          "50%": { opacity: "0.8" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.2", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.5)" },
        },
      },
      boxShadow: {
        glow: "0 0 8px 2px rgba(34, 211, 238, 0.7)",
      },
    },
  },
  plugins: [],
};
