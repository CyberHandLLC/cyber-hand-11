"use client";

/**
 * HomepageButtonsClient Component
 *
 * This component contains the interactive buttons for the homepage.
 * It's isolated as a Client Component to keep client-side logic separate
 * from Server Components, following Next.js 15.2.4 best practices.
 *
 * Following Cyber Hand Project Rules:
 * - Proper client component naming with -client suffix
 * - TypeScript return type annotations
 * - Clean implementation of navigation logic
 */

import { useRouter } from "next/navigation";
import { ReactElement } from "react";
import { Button } from "@/components/ui/button";

/**
 * HomepageButtonsClient - Interactive buttons for the homepage
 *
 * @returns {JSX.Element} Rendered button component
 */
export function HomepageButtonsClient(): ReactElement {
  const router = useRouter();

  /**
   * Handle the Get Started button click
   */
  const handleGetStarted = (): void => {
    router.push("/get-started");
  };

  /**
   * Handle the Learn More button click
   */
  const handleLearnMore = (): void => {
    router.push("/services");
  };

  return (
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
  );
}
