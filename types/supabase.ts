/**
 * Supabase Database Types
 *
 * Type definitions for Supabase tables ensuring type safety between
 * database operations and frontend code.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      case_studies: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          slug: string;
          description: string;
          content: Json;
          thumbnail: string;
          industry: string;
          featured: boolean;
          technologies: string[];
          client_name: string;
          published: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          slug: string;
          description: string;
          content: Json;
          thumbnail: string;
          industry: string;
          featured?: boolean;
          technologies: string[];
          client_name: string;
          published?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          slug?: string;
          description?: string;
          content?: Json;
          thumbnail?: string;
          industry?: string;
          featured?: boolean;
          technologies?: string[];
          client_name?: string;
          published?: boolean;
        };
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
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          email: string;
          phone: string;
          message: string;
          services_interested: string[];
          status?: "new" | "contacted" | "completed";
          location?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          email?: string;
          phone?: string;
          message?: string;
          services_interested?: string[];
          status?: "new" | "contacted" | "completed";
          location?: string | null;
        };
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
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          slug: string;
          description: string;
          features: string[];
          icon: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          slug?: string;
          description?: string;
          features?: string[];
          icon?: string;
          is_active?: boolean;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
  };
}
