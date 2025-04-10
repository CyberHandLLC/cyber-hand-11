# Accessibility Guide

> This document outlines our approach to accessibility in the Cyber Hand website, following Next.js 15 best practices to ensure our application is usable by everyone, regardless of abilities or disabilities.

## Table of Contents

1. [Introduction](#introduction)
2. [Built-in Next.js 15 Accessibility Features](#built-in-nextjs-15-accessibility-features)
3. [Core Accessibility Principles](#core-accessibility-principles)
4. [Implementation Guidelines](#implementation-guidelines)
5. [Component-Specific Considerations](#component-specific-considerations)
6. [Verification Approach](#verification-approach)
7. [Resources](#resources)

## Introduction

Accessibility is a core consideration in the Cyber Hand project. Our goal is to create an inclusive application that provides a great experience for all users, including those with disabilities. This guide explains how we implement accessibility in our Next.js 15 application.

## Built-in Next.js 15 Accessibility Features

Next.js 15 includes several built-in features that enhance accessibility:

### 1. Route Announcements

When using client-side transitions with `next/link`, Next.js automatically announces route changes to screen readers. The route announcer looks for page names to announce in the following order:

1. `document.title`
2. The content of the `<h1>` element
3. The URL pathname

For optimal accessibility, ensure each page has a unique and descriptive title:

```tsx
// app/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - Cyber Hand",
  description: "Welcome to the Cyber Hand website",
};

export default function HomePage() {
  return (
    <main>
      <h1>Welcome to Cyber Hand</h1>
      {/* Page content */}
    </main>
  );
}
```

### 2. ESLint Accessibility Plugin

Next.js includes the `eslint-plugin-jsx-a11y` by default, which helps catch accessibility issues during development. This plugin warns about:

- Missing `alt` text on images
- Incorrect ARIA attributes
- Improper role attributes
- Inaccessible interactive elements
- Color contrast issues

## Core Accessibility Principles

In the Cyber Hand project, we focus on these key accessibility principles:

### 1. Semantic HTML

- Use appropriate HTML elements for their intended purpose
- Maintain a logical heading structure (`h1` through `h6`)
- Employ proper landmarks (`header`, `nav`, `main`, `footer`, etc.)
- Use `<button>` for interactive elements, `<a>` for navigation

```tsx
// Example of semantic structure
export function PageLayout({ children }) {
  return (
    <>
      <header>
        <nav aria-label="Main navigation">{/* Navigation content */}</nav>
      </header>
      <main>{children}</main>
      <footer>{/* Footer content */}</footer>
    </>
  );
}
```

### 2. Keyboard Navigation

- Ensure all interactive elements are keyboard accessible
- Maintain a logical tab order
- Provide visible focus indicators
- Implement keyboard shortcuts for complex interactions
- Test with keyboard-only navigation

### 3. Screen Reader Support

- Include proper ARIA labels when necessary
- Use ARIA landmarks for major page sections
- Ensure dynamic content changes are announced
- Test with screen readers (NVDA, VoiceOver)

### 4. Visual Considerations

- Support high contrast mode
- Ensure sufficient color contrast (AA compliance)
- Design interfaces that work well with zoom
- Don't rely on color alone to convey information
- Support reduced motion preferences

## Implementation Guidelines

### Server Components and Accessibility

Server Components render on the server and send HTML to the client, providing an inherently accessible foundation. For our Next.js 15 application:

```tsx
// app/products/[id]/page.tsx - Server Component
export default async function ProductPage({ params }) {
  // Data fetching happens on the server
  const product = await getProduct(params.id);

  return (
    <article>
      <h1>{product.name}</h1>
      <img src={product.image} alt={product.imageDescription} />
      <p>{product.description}</p>

      {/* Client component only where interactivity is needed */}
      <AddToCartButton productId={product.id} />
    </article>
  );
}
```

### Client Components and Accessibility

For Client Components, ensure proper accessibility attributes for interactive elements:

```tsx
// components/ui/button.tsx - Client Component
"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Props
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, disabled, type = "button", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        disabled={disabled}
        ref={ref}
        type={type}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
```

### Forms and Accessibility

Form accessibility is crucial. Use these patterns:

```tsx
// Form component with proper accessibility attributes
"use client";

import { useFormState } from "react-dom";
import { submitForm } from "@/app/actions";

export function ContactForm() {
  const [state, formAction] = useFormState(submitForm, { success: false });

  return (
    <form action={formAction} noValidate>
      <div className="form-group">
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          aria-required="true"
          aria-invalid={state.errors?.name ? "true" : "false"}
          aria-describedby={state.errors?.name ? "name-error" : undefined}
          className="mt-1 block w-full rounded-md"
        />
        {state.errors?.name && (
          <p id="name-error" className="text-red-600 text-sm mt-1">
            {state.errors.name}
          </p>
        )}
      </div>

      {/* Other form fields... */}

      <button type="submit" className="mt-4">
        Submit
      </button>
    </form>
  );
}
```

## Component-Specific Considerations

### 1. Skeleton Loading States

Our loading states include proper ARIA attributes:

```tsx
// components/ui/skeleton.tsx
export function ImageSkeleton({ width = "100%", height = 200, className, ...props }) {
  return (
    <div
      className={cn("animate-pulse bg-gray-200 dark:bg-gray-700 rounded", className)}
      style={{ width, height }}
      aria-hidden="true" // Hide from screen readers during loading
      {...props}
    />
  );
}
```

### 2. Modal Dialogs

Modal implementations must trap focus and handle keyboard interactions:

```tsx
// components/ui/modal.tsx
"use client";

import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "./button";

export function Modal({ title, isOpen, onClose, children }) {
  const dialogRef = useRef(null);

  // Handle keyboard navigation and focus trapping
  useEffect(() => {
    if (!isOpen) return;

    const dialogElement = dialogRef.current;
    if (!dialogElement) return;

    // Focus the dialog when it opens
    dialogElement.focus();

    // Handle Escape key
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        tabIndex={-1}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="dialog-title" className="text-xl font-bold mb-4">
          {title}
        </h2>
        {children}
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
```

## Verification Approach

To ensure our app is accessible, we:

1. **Manual keyboard navigation verification**
2. **Visual reviews** with browser extensions like axe DevTools
3. **Screen reader verification** with NVDA (Windows) or VoiceOver (macOS)
4. **Color contrast verification** for WCAG 2.1 AA compliance

## Resources

- [Next.js Accessibility Documentation](https://nextjs.org/docs/architecture/accessibility)
- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
