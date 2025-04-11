/**
 * Supabase Client Configuration
 *
 * Properly configured Supabase clients for both server and client components
 * Following Next.js 15.2.4 and React 19 best practices
 */

import { createClient } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Define proper type interfaces for Supabase tables
// This follows the strict type safety requirements in the Cyber Hand Project Rules
interface Database {
  public: {
    Tables: {
      case_studies: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          slug: string;
          description: string;
          content: unknown;
          thumbnail: string;
          industry: string;
          featured: boolean;
          technologies: string[];
          client_name: string;
          published: boolean;
        };
        Insert: Partial<Database["public"]["Tables"]["case_studies"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["case_studies"]["Row"]>;
      };
      contacts: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          email: string;
          phone: string;
          message: string;
          services_interested: string[];
          status: "new" | "contacted" | "completed";
          location: string | null;
        };
        Insert: Partial<
          Omit<Database["public"]["Tables"]["contacts"]["Row"], "id" | "created_at">
        > & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["contacts"]["Row"]>;
      };
      services: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          slug: string;
          description: string;
          features: string[];
          icon: string;
          is_active: boolean;
        };
        Insert: Partial<
          Omit<Database["public"]["Tables"]["services"]["Row"], "id" | "created_at">
        > & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["services"]["Row"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}

// Create a single instance of the server client to reuse
// This should only be used in Server Components or Server Actions
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Client component version - only use this in components with "use client" directive
// This properly handles auth token refresh and session persistence
export const createClientSupabase = () => {
  return createClientComponentClient<Database>();
};

// Cache helper for server components to deduplicate requests
import { cache } from "react";

export const getServerSupabaseClient = cache(() => {
  return createServerSupabaseClient();
});
