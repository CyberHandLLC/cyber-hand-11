/**
 * Animation utilities for centralized animation definitions
 */
import { motion, Variant, Variants } from "framer-motion";
import React from "react";

// Common animation variants that can be reused across components
export const animations = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  slideIn: {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  },
  slideOut: {
    visible: { x: 0, opacity: 1 },
    hidden: { x: 100, opacity: 0 },
  },
  pulse: {
    initial: { opacity: 0.6 },
    animate: { opacity: 1 },
  },
  bounce: {
    initial: { y: 0 },
    animate: { y: -10 },
  },
  hover: {
    initial: {},
    hover: { y: -5, transition: { duration: 0.3 } },
  },
  staggerChildren: {
    visible: { transition: { staggerChildren: 0.1 } },
  }
};

// Common transition presets
export const transitions = {
  fast: { duration: 0.3 },
  medium: { duration: 0.5 },
  slow: { duration: 0.8 },
  bounce: { type: "spring", stiffness: 300, damping: 15 },
  smooth: { type: "tween", ease: "easeInOut" },
};

// Animation utility components
interface AnimatedElementProps {
  children: React.ReactNode;
  animation: keyof typeof animations;
  transition?: any;
  delay?: number;
  className?: string;
  once?: boolean;
  custom?: any;
}

/**
 * AnimatedElement component for easily applying animations
 */
export const AnimatedElement: React.FC<AnimatedElementProps> = ({
  children,
  animation,
  transition = transitions.medium,
  delay = 0,
  className = "",
  once = true,
  custom = null,
}) => {
  const selectedAnimation = animations[animation];
  
  if (!selectedAnimation) {
    console.warn(`Animation '${animation}' not found`);
    return <div className={className}>{children}</div>;
  }
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={selectedAnimation}
      transition={{ ...transition, delay }}
      viewport={{ once }}
      className={className}
      custom={custom}
    >
      {children}
    </motion.div>
  );
};

/**
 * Creates a staggered animation group for lists and grids
 */
export const StaggeredGroup: React.FC<{
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}> = ({ children, className = "", staggerDelay = 0.1 }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className={className}
      variants={{
        visible: { 
          transition: { 
            staggerChildren: staggerDelay,
            delayChildren: 0.1
          } 
        }
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Staggered item to be used inside a StaggeredGroup
 */
export const StaggeredItem: React.FC<{
  children: React.ReactNode;
  animation?: keyof typeof animations;
  className?: string;
}> = ({ children, animation = "fadeInUp", className = "" }) => {
  return (
    <motion.div
      variants={animations[animation]}
      className={className}
    >
      {children}
    </motion.div>
  );
};
