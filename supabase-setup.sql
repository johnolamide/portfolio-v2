-- Supabase SQL Setup for Username Tracking
-- Run this in your Supabase SQL Editor

-- Create username_usage table
CREATE TABLE username_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  usage_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_username_usage_username ON username_usage(username);
CREATE INDEX idx_username_usage_count ON username_usage(usage_count DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE username_usage ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts and updates (public access for this demo)
-- In production, you might want to restrict this
CREATE POLICY "Allow all operations" ON username_usage
  FOR ALL USING (true);

-- Optional: Create a function to increment usage count
CREATE OR REPLACE FUNCTION increment_username_usage(user_name TEXT)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO username_usage (username, usage_count, created_at, updated_at)
  VALUES (LOWER(user_name), 1, NOW(), NOW())
  ON CONFLICT (username)
  DO UPDATE SET
    usage_count = username_usage.usage_count + 1,
    updated_at = NOW();
END;
$$;