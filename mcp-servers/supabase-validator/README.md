# Supabase Validator MCP Server

> Note: This is a placeholder for the future Supabase Validator MCP server. Implementation will begin once the Supabase backend is fully in use.

## Overview

The Supabase Validator MCP server will provide validation for Supabase-related code and configurations to ensure best practices, security, and schema consistency.

## Planned Features

### Schema-to-Model Consistency
- Verify that database schema matches application models/types
- Automatically generate TypeScript types from Supabase schema
- Compare against committed type definitions
- Flag inconsistencies between code and database schema

### Auth Pattern Enforcement
- Ensure proper use of Supabase authentication
- Verify service_role key is never exposed in client code
- Confirm proper RLS policies are enabled
- Validate client-side vs server-side code separation

### Row-Level Security Policy Checks
- Validate appropriate RLS policies exist for each table
- Ensure correct use of service key for privileged operations only
- Verify application code respects RLS policy constraints
- Detect and flag RLS bypasses

### Schema and Migration Checks
- Track database migrations and their application
- Ensure schema changes are properly reflected in both code and database
- Verify TypeScript types exist for all database tables

### Supabase Settings Validation
- Verify secure configuration of Supabase project
- Check email confirmation settings, password policies, etc.
- Ensure proper environment variable usage for secrets

### Performance and Indexing Analysis
- Flag potential performance issues in database queries
- Suggest indexes for frequently filtered columns
- Detect n+1 query patterns

## Integration

The Supabase Validator will integrate with:
- Windsurf Cascade AI for real-time validation during development
- CI/CD pipeline for automated PR validation
- Local development workflow through npm scripts

## Tools to be Implemented

The server will expose the following tools:

1. `supabase_validate` - Validate all Supabase-related code and configurations
2. `check_schema_consistency` - Verify database schema matches TypeScript types 
3. `validate_rls_policies` - Ensure proper Row Level Security configurations
4. `check_auth_patterns` - Validate authentication and authorization implementation

## Implementation Timeline

1. Initial setup - After Supabase integration begins
2. Basic validation - When core Supabase features are implemented
3. Comprehensive validation - As the Supabase usage matures
4. CI integration - Once validation is stable and reliable
