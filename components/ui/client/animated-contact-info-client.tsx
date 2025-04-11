"use client";

/**
 * AnimatedContactInfoClient Component
 *
 * This component handles the animated display of contact information
 * and reasons to contact. It's a Client Component because it uses
 * animations and interactive elements.
 *
 * Following Cyber Hand Project Rules:
 * - Proper client component naming with -client suffix
 * - TypeScript return type annotations
 * - Placed in the /ui/client directory for better organization
 */

import React, { ReactElement } from "react";
import { useTheme } from "@/lib/theme-context";
import { getThemeStyle } from "@/lib/theme-utils";
import { AnimatedElement } from "@/lib/animation-utils";
import { Icons } from "@/components/ui/icons";

/**
 * Contact information item structure
 */
interface ContactInfoItem {
  icon: keyof typeof Icons;
  label: string;
  value: string;
  href: string;
}

/**
 * Component props interface
 */
interface AnimatedContactInfoClientProps {
  reasons: string[];
  contactInfo: ContactInfoItem[];
}

/**
 * Animated contact info component with reasons to contact and contact information
 *
 * @param {AnimatedContactInfoClientProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
export function AnimatedContactInfoClient({
  reasons,
  contactInfo,
}: AnimatedContactInfoClientProps): ReactElement {
  const { theme } = useTheme();

  return (
    <div className="space-y-8">
      {/* Why contact us */}
      <AnimatedElement animation="fadeIn" delay={0.3}>
        <div className="rounded-lg border border-gray-800/30 bg-gradient-to-br from-black/60 to-transparent backdrop-blur-sm p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Why Contact Us</h2>

          <div className="space-y-4">
            {reasons.map((item, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500/50 flex items-center justify-center mt-1 mr-3">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                </div>
                <p className={getThemeStyle("text-secondary", theme)}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedElement>

      {/* Contact info */}
      <AnimatedElement animation="fadeIn" delay={0.5}>
        <div className="rounded-lg border border-gray-800/30 bg-gradient-to-br from-black/60 to-transparent backdrop-blur-sm p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>

          <div className="space-y-4">
            {contactInfo.map((item, index) => {
              const Icon = Icons[item.icon];
              return (
                <div key={index} className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center mr-4">
                    <Icon className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">{item.label}</p>
                    <a
                      href={item.href}
                      className="text-white hover:text-cyan-400 transition-colors"
                    >
                      {item.value}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AnimatedElement>
    </div>
  );
}
