/**
 * Skeleton UI Component Library
 * 
 * A collection of skeleton components for loading states that provide consistent
 * visual feedback across the application. These components follow the app's design
 * system and provide proper accessibility attributes for loading states.
 */

import { cn } from "@/lib/utils";

/**
 * Base Skeleton props
 * @typedef {Object} BaseSkeletonProps
 * @property {string} [className] - Additional CSS classes to add
 * @property {React.ReactNode} [children] - Optional children elements
 * @property {string} [animationDelay] - Delay for the animation in seconds (e.g. "0.2s")
 * @property {boolean} [pulse=true] - Whether to use pulse animation
 */
interface BaseSkeletonProps {
  className?: string;
  children?: React.ReactNode;
  animationDelay?: string;
  pulse?: boolean;
}

/**
 * Base skeleton component that other skeleton components extend
 * 
 * @param {BaseSkeletonProps} props - Component properties
 * @returns {JSX.Element} Rendered skeleton component
 */
export function Skeleton({
  className,
  children,
  animationDelay,
  pulse = true,
  ...props
}: BaseSkeletonProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-gray-100 dark:bg-gray-800 rounded",
        pulse && "animate-pulse",
        className
      )}
      style={animationDelay ? { animationDelay } : undefined}
      aria-busy="true"
      aria-live="polite"
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Text line skeleton for paragraphs and text content
 * 
 * @param {BaseSkeletonProps & {width?: string}} props - Component properties
 * @returns {JSX.Element} Rendered text skeleton component
 */
export function TextSkeleton({
  className,
  width = "100%",
  animationDelay,
  ...props
}: BaseSkeletonProps & { width?: string }) {
  return (
    <Skeleton
      className={cn("h-4 my-2", className)}
      style={{ width, ...(animationDelay ? { animationDelay } : {}) }}
      {...props}
    />
  );
}

/**
 * Heading skeleton for titles
 * 
 * @param {BaseSkeletonProps & {level?: 1|2|3|4|5|6, width?: string}} props - Component properties
 * @returns {JSX.Element} Rendered heading skeleton component
 */
export function HeadingSkeleton({
  className,
  level = 2,
  width = "75%",
  animationDelay,
  ...props
}: BaseSkeletonProps & { 
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  width?: string;
}) {
  const heightMap = {
    1: "h-10",
    2: "h-8",
    3: "h-7",
    4: "h-6",
    5: "h-5",
    6: "h-4",
  };

  return (
    <Skeleton
      className={cn(heightMap[level], "mb-4", className)}
      style={{ width, ...(animationDelay ? { animationDelay } : {}) }}
      {...props}
    />
  );
}

/**
 * Image skeleton for visual content placeholders
 * 
 * @param {BaseSkeletonProps & {aspectRatio?: string, height?: string}} props - Component properties
 * @returns {JSX.Element} Rendered image skeleton component
 */
export function ImageSkeleton({
  className,
  aspectRatio = "16/9",
  height,
  animationDelay,
  ...props
}: BaseSkeletonProps & { 
  aspectRatio?: string;
  height?: string;
}) {
  return (
    <Skeleton
      className={cn("w-full", className)}
      style={{ 
        aspectRatio: height ? undefined : aspectRatio,
        height,
        ...(animationDelay ? { animationDelay } : {})
      }}
      {...props}
    />
  );
}

/**
 * Card skeleton for card UI elements
 * 
 * @param {BaseSkeletonProps} props - Component properties
 * @returns {JSX.Element} Rendered card skeleton component
 */
export function CardSkeleton({
  className,
  animationDelay,
  ...props
}: BaseSkeletonProps) {
  return (
    <div 
      className={cn(
        "rounded-lg p-6 space-y-4",
        className
      )}
      style={animationDelay ? { animationDelay } : undefined}
      {...props}
    >
      <ImageSkeleton className="mb-4" />
      <HeadingSkeleton level={3} width="70%" />
      <TextSkeleton width="90%" />
      <TextSkeleton width="60%" />
    </div>
  );
}

/**
 * Card grid skeleton for displaying multiple card skeletons in a grid
 * 
 * @param {BaseSkeletonProps & {count?: number, columns?: number}} props - Component properties
 * @returns {JSX.Element} Rendered card grid skeleton component
 */
export function CardGridSkeleton({
  className,
  count = 6,
  columns = 3,
  ...props
}: BaseSkeletonProps & { 
  count?: number;
  columns?: number;
}) {
  return (
    <div 
      className={cn(
        `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`,
        className
      )}
      {...props}
    >
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton
          key={i}
          animationDelay={`${i * 0.1}s`}
        />
      ))}
    </div>
  );
}

/**
 * Section skeleton for content sections
 * 
 * @param {BaseSkeletonProps} props - Component properties
 * @returns {JSX.Element} Rendered section skeleton component
 */
export function SectionSkeleton({
  className,
  ...props
}: BaseSkeletonProps) {
  return (
    <div 
      className={cn("space-y-6 py-6", className)}
      {...props}
    >
      <HeadingSkeleton level={2} width="50%" />
      <div className="space-y-3">
        <TextSkeleton />
        <TextSkeleton width="95%" />
        <TextSkeleton width="85%" />
      </div>
    </div>
  );
}
