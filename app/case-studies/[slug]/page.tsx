import { PageLayout, SectionContainer } from "@/components/custom/page-layout";
import { caseStudies } from "@/data/case-studies";

// Import modular components
import { CaseStudyHeader } from "@/components/case-studies/case-study-header";
import { CaseStudyContent } from "@/components/case-studies/case-study-content";
import { CaseStudyClientWrapper } from "@/components/case-studies/case-study-client-wrapper";

// Main Case Study Page component - Server Component
export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await and destructure params
  const { slug } = await params;
  
  // Find the case study by slug
  const caseStudy = caseStudies.find(cs => cs.id === slug || cs.slug === slug);
  
  // Return 404 state if case study not found (handled by server)
  if (!caseStudy) {
    return (
      <PageLayout>
        {/* Ensure children prop is provided to PageLayout */}
        <SectionContainer className="py-24">
          <div className="text-center">
            <p>Case study not found</p>
          </div>
        </SectionContainer>
      </PageLayout>
    );
  }
  
  // Pass the case study to the client wrapper
  // The client wrapper itself contains the PageLayout and all client-side logic
  return <CaseStudyClientWrapper caseStudy={caseStudy} />;
}
