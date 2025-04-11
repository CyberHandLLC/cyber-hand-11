/**
 * Get Started Page - Server Component with Client Component Islands
 *
 * This page leverages Next.js 15's built-in streaming capabilities with:
 * - The page itself as a Server Component
 * - Static content rendered immediately
 * - Interactive form elements isolated to Client Components
 * - Optimized Suspense boundaries for progressive loading
 * - Standardized skeleton components for consistent loading experience
 * - Comprehensive error boundaries for graceful error recovery
 */

import { Suspense } from "react";
import { PageLayout, SectionContainer } from "@/components/custom/page-layout";
import { AuthFormClient } from "./components/auth-form-client";
import { HeadingSkeleton, TextSkeleton, Skeleton } from "@/components/ui/skeleton";
import { ContentErrorBoundaryClient } from "@/components/ui/client/error-boundary-client";

/**
 * Auth Form Skeleton Component
 * Standardized skeleton UI for the auth form while it's loading
 */
function AuthFormSkeleton() {
  return (
    <div className="rounded-xl p-8 w-full max-w-md bg-gray-900/90 border border-gray-800/50">
      <div className="text-center mb-8">
        <HeadingSkeleton level={1} width="60%" className="mx-auto mb-2" />
        <TextSkeleton width="80%" className="mx-auto" />
      </div>

      <div className="space-y-6">
        {/* Email field */}
        <div>
          <TextSkeleton className="h-5 w-16 mb-2" />
          <Skeleton className="h-12 w-full rounded" />
        </div>

        {/* Password field */}
        <div>
          <TextSkeleton className="h-5 w-20 mb-2" animationDelay="0.15s" />
          <Skeleton className="h-12 w-full rounded" animationDelay="0.15s" />
        </div>

        {/* Submit button */}
        <Skeleton className="h-11 w-full rounded mt-6" animationDelay="0.2s" />
      </div>

      {/* Toggle link */}
      <div className="text-center mt-8">
        <TextSkeleton width="60%" className="mx-auto" animationDelay="0.25s" />
      </div>

      {/* Back link */}
      <div className="text-center mt-6">
        <Skeleton className="h-9 w-32 rounded-md mx-auto" animationDelay="0.3s" />
      </div>
    </div>
  );
}

/**
 * Export metadata for SEO
 */
export const metadata = {
  title: "Get Started | Cyber Hand",
  description: "Sign up or log in to your Cyber Hand account to access our services and resources.",
};

/**
 * Get Started page component handling authentication
 * Implements Next.js 15 streaming patterns with Server and Client Components
 */
export default function GetStarted() {
  return (
    <PageLayout>
      <SectionContainer className="min-h-screen flex items-center justify-center py-20">
        <ContentErrorBoundaryClient>
          <Suspense fallback={<AuthFormSkeleton />}>
            <AuthFormClient />
          </Suspense>
        </ContentErrorBoundaryClient>
      </SectionContainer>
    </PageLayout>
  );
}
