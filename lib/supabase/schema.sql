/**
 * Supabase Schema for Location Data
 * 
 * This file contains SQL statements to set up the database schema
 * for storing user location data in Supabase with proper security.
 * 
 * Execute this in the Supabase SQL Editor when setting up your database.
 */

-- Enable the PostGIS extension for geospatial functionality
CREATE EXTENSION IF NOT EXISTS postgis;

-- User preferences table to store consent status
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  location_consent_status TEXT NOT NULL DEFAULT 'prompt',
  location_consent_timestamp TIMESTAMPTZ,
  should_prompt_again BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User locations table with PostGIS point type
CREATE TABLE IF NOT EXISTS user_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  location GEOGRAPHY(POINT) NOT NULL,
  accuracy FLOAT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add index for faster spatial queries
CREATE INDEX IF NOT EXISTS user_locations_gix ON user_locations USING GIST (location);

-- Set up Row Level Security (RLS) for proper data protection
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own preferences
CREATE POLICY "Users can read own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can update their own preferences
CREATE POLICY "Users can update own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: System can insert user preferences
CREATE POLICY "System can insert user preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only read their own location data
CREATE POLICY "Users can read own locations" ON user_locations
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: System can insert user locations 
CREATE POLICY "System can insert user locations" ON user_locations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update the updated_at column
CREATE TRIGGER update_user_preferences_updated_at
BEFORE UPDATE ON user_preferences
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Stored procedure to find locations within a radius
CREATE OR REPLACE FUNCTION get_locations_within_radius(
  lat FLOAT,
  lng FLOAT,
  radius_meters FLOAT
) 
RETURNS TABLE (
  id UUID,
  user_id UUID,
  distance FLOAT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ul.id,
    ul.user_id,
    ST_Distance(
      ul.location::geography, 
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    ) as distance,
    ul.created_at
  FROM user_locations ul
  WHERE ST_DWithin(
    ul.location::geography,
    ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
    radius_meters
  )
  ORDER BY distance;
END;
$$ LANGUAGE plpgsql;