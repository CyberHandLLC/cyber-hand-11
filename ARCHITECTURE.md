# Cyber Hand Website Architecture

This document provides an overview of the file structure, component relationships, and architectural patterns used in the Cyber Hand website. It will be maintained and updated as the codebase evolves.

## Core Architecture Principles

The website follows these key architectural principles:

1. **DRY (Don't Repeat Yourself)**: Components, styles, and logic are abstracted into reusable modules
2. **Modular Component Design**: Components are broken down into smaller, focused parts
3. **Centralized Styling**: Theme-based styling is managed through centralized utilities
4. **Responsive First**: All components adapt to both mobile and desktop views
5. **Type Safety**: TypeScript interfaces ensure consistent data structures

## Directory Structure

```
cyber-hand-11/
├── app/                      # Next.js app directory (pages and routes)
│   ├── case-studies/         # Case studies section
│   │   ├── [slug]/           # Individual case study page
│   │   └── page.tsx          # Case studies list page
│   ├── contact/              # Contact page
│   ├── services/             # Services section
│   ├── layout.tsx            # Root layout (applied to all pages)
│   └── page.tsx              # Homepage
├── components/               # Reusable React components
│   ├── case-studies/         # Case studies specific components
│   │   ├── case-study-content.tsx    # Main content component
│   │   ├── case-study-header.tsx     # Header component
│   │   ├── case-study-types.ts       # TypeScript interfaces
│   │   └── common-elements.tsx       # Shared UI elements
│   ├── custom/               # Site-specific custom components
│   │   ├── case-study-card.tsx       # Card for displaying case studies in lists
│   │   ├── navbar.tsx                # Site navigation
│   │   ├── page-layout.tsx           # Common page layout wrapper
│   │   └── service-card.tsx          # Card for services display
│   └── ui/                   # Generic UI components
│       ├── button.tsx               # Button component
│       └── icons.tsx                # SVG icon components
├── data/                     # Data files that populate the site
│   ├── case-studies.ts       # Case study content
│   └── services.ts           # Service offerings content
├── lib/                      # Utility libraries and helpers
│   ├── animation-utils.tsx   # Animation components and utilities
│   ├── case-study-styles.ts  # Centralized case study styling
│   ├── theme-context.tsx     # Theme provider and context
│   └── theme-utils.tsx       # Theme helper functions
├── public/                   # Static assets
│   └── images/               # Image files
└── scripts/                  # Helper scripts
    └── download-case-study-images.js # Asset preparation script
```

## Key Files and Their Relationships

### Page Structure

- **`app/layout.tsx`**
  - Root layout that wraps all pages
  - Includes `ThemeProvider` to make themes available globally
  - Implements the `Navbar` component for site-wide navigation

- **`app/page.tsx`**
  - Homepage implementation
  - Uses dynamic imports for optimized loading
  - Includes `ServiceCard` components for service previews
  - Features `CaseStudyCard` components for featured projects

### Case Studies System

- **`data/case-studies.ts`**
  - Stores case study data objects
  - Implements the `CaseStudyProps` interface
  - Referenced by both case study pages and cards

- **`app/case-studies/page.tsx`**
  - Displays the list of all case studies
  - Utilizes `CaseStudyCard` components

- **`app/case-studies/[slug]/page.tsx`**
  - Individual case study detail page
  - Acts as a container that imports specialized components
  - Retrieves case study data by slug and passes to components

- **`components/case-studies/case-study-header.tsx`**
  - Implements the responsive header for case study detail pages
  - Has different layouts for mobile and desktop views
  - Uses diagonal clip path for desktop design

- **`components/case-studies/case-study-content.tsx`**
  - Main content section for case study details
  - Organizes approach, results and testimonial sections
  - Implements sidebar with related content

- **`components/case-studies/common-elements.tsx`**
  - Contains reusable UI elements specific to case studies
  - Includes `SectionHeader`, `ApproachStep`, `ResultItem`, etc.
  - Centralizes common patterns across case study pages

- **`lib/case-study-styles.ts`**
  - Defines common styling constants for case study components
  - Ensures visual consistency across the case study system
  - Follows DRY principles for styling reusability

### Theme System

- **`lib/theme-context.tsx`**
  - Implements theme context provider and hook
  - Enables theme toggling site-wide
  - Defines the `Theme` type used throughout the application

- **`lib/theme-utils.tsx`**
  - Contains helper functions for theme-based styling
  - Exports `getThemeStyle()` for consistent conditional styling
  - Used by most components for theme-aware styling

### Component Hierarchy

```
PageLayout
├── Navbar
├── CaseStudyHeader
│   ├── ClientInfo
│   └── ChallengeSection
└── CaseStudyContent
    ├── ServicesBand
    ├── ApproachSection
    │   └── ApproachStep
    ├── ResultsSection
    │   └── ResultItem
    ├── Testimonial
    ├── RelatedCaseStudies
    └── CallToAction
```

## Styling Patterns

The application uses several styling patterns to maintain consistency:

1. **Centralized Constants**
   - Each major feature has its own style constants file
   - Example: `CASE_STUDY_STYLES` in `case-study-styles.ts`

2. **Theme-Based Styling**
   - The `getThemeStyle()` function applies the correct styles based on theme
   - Pattern: `className={getThemeStyle('text-primary', theme)}`

3. **Responsive Design**
   - Mobile-first approach with distinct layouts on larger screens
   - Media queries and conditional rendering based on screen size

4. **Component-Scoped Styling**
   - Each component handles its own styling needs
   - Common elements are styled through shared utilities

## Data Flow

1. **Static Data** in `data/` directory provides content:
   - Case studies, services, etc. flow from data files to components

2. **Theme Context** provides theme information:
   - Components subscribe to theme changes via `useTheme()`
   - Styling adapts to current theme state

3. **Props Passing**:
   - Parent components retrieve data and pass to children
   - Type safety enforced through TypeScript interfaces

## Future Extensions

This architecture is designed to easily accommodate:

1. **New Case Studies**: Just add data to the `case-studies.ts` file
2. **New Pages**: Follow the Next.js app directory structure
3. **New Components**: Place in the appropriate folder based on specificity
4. **Style Updates**: Modify centralized style objects for consistent changes

## Maintenance Guidelines

When adding to the codebase:

1. Follow existing DRY principles and component extraction patterns
2. Add TypeScript interfaces for new data structures
3. Ensure responsive designs for both mobile and desktop
4. Update this document to reflect significant structural changes
5. Centralize styles in appropriate style constants files
