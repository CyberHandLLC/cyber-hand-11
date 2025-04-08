# Font Optimization Guide

This document explains the font optimization strategies implemented for the Cyber Hand website and how to use them in your components.

## Implemented Optimizations

We've implemented the following font optimizations to improve Core Web Vitals metrics (particularly LCP and CLS):

1. **Font Subsetting**: Reduced font file sizes by loading only the characters we use
2. **Font Display Strategies**: Using `font-display: swap` for critical text
3. **Font Fallbacks**: Implemented metric-adjusted fallback fonts to reduce layout shifts
4. **Preloading**: Preloading critical fonts in the document head
5. **Font Size Adjustments**: Applied size-adjust and metrics overrides for fallback fonts

## Using Optimized Text Components

We've created specialized components to make it easy to use the optimized fonts:

### OptimizedText Component

The base component for all text rendering with optimized fonts:

```tsx
import OptimizedText from '@/components/ui/optimized-text';

// Basic usage
<OptimizedText>This is regular body text</OptimizedText>

// With variant and weight
<OptimizedText variant="heading" weight="bold">
  This is bold heading text
</OptimizedText>

// With custom element and additional classes
<OptimizedText as="span" className="text-cyan-500">
  This is styled span text
</OptimizedText>
```

### Heading Component

A specialized component for headings:

```tsx
import { Heading } from '@/components/ui/optimized-text';

// Default h2
<Heading>This is an h2 heading</Heading>

// Specific heading level
<Heading level={1}>This is an h1 heading</Heading>

// With custom weight and classes
<Heading level={3} weight="semibold" className="mb-4">
  This is a semibold h3 with margin
</Heading>
```

### BodyText Component

A specialized component for body text:

```tsx
import { BodyText } from '@/components/ui/optimized-text';

// Default paragraph
<BodyText>This is a paragraph</BodyText>

// As a different element
<BodyText as="div">This is a div with body text styling</BodyText>

// With custom weight and classes
<BodyText weight="medium" className="mt-2">
  This is medium weight text with margin top
</BodyText>
```

## CSS Classes for Font Optimization

You can also use the predefined CSS classes directly:

- `.text-body` - Applies the body font (Inter)
- `.text-heading` - Applies the heading font (Orbitron)
- `.font-adjustment-active` - Enables font metric adjustments (applied at the body level)

## Developer Guidelines

1. **Use Semantic HTML**: Always use the appropriate heading levels (h1-h6) for proper document structure
2. **Prefer Components**: Use the optimized text components instead of raw HTML elements
3. **Font Weights**: Only use the available weights to avoid fake bold/italics
4. **Performance Impact**: Monitor the performance impact of fonts using Lighthouse
5. **Font Loading**: Check the Web Vitals metrics to ensure fonts aren't blocking rendering

## Technical Implementation Details

Our font optimization is implemented through:

1. **Next.js Font Module**: Using the Next.js Font module with optimized settings
2. **Font Metrics Overrides**: Implementing `size-adjust`, `ascent-override`, etc.
3. **Font Display Properties**: Setting appropriate `font-display` values
4. **CSS Variable Integration**: Using CSS variables for font family definitions

## Fallback Strategy

We use a multi-layered fallback strategy:

1. Web fonts (Inter, Orbitron)
2. Metric-adjusted local fonts (Inter Fallback, Orbitron Fallback)
3. System fonts (var(--font-sans), var(--font-display))

This ensures text is always visible with minimal layout shift during font loading.
