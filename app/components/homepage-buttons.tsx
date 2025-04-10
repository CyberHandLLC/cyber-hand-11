"use client";

/**
 * HomepageButtons - Client Component
 *
 * This component contains the interactive buttons for the homepage.
 * It's isolated as a Client Component to keep client-side logic separate
 * from Server Components, following Next.js 15 best practices.
 */

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function HomepageButtons() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/get-started");
  };

  const handleLearnMore = () => {
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
