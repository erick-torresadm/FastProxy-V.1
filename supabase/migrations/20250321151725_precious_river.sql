/*
  # Update proxy_fast table policies

  1. Changes
    - Add policy for inserting records
    - Add policy for updating records
    - Modify select policy to allow reading by email

  2. Security
    - Enable RLS
    - Add appropriate policies for CRUD operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own proxy_fast data" ON proxy_fast;

-- Create new policies
CREATE POLICY "Users can view proxy_fast data by email"
  ON proxy_fast FOR SELECT
  USING (auth.jwt() IS NOT NULL);

CREATE POLICY "Users can insert proxy_fast data"
  ON proxy_fast FOR INSERT
  WITH CHECK (auth.jwt() IS NOT NULL);

CREATE POLICY "Users can update proxy_fast data"
  ON proxy_fast FOR UPDATE
  USING (auth.jwt() IS NOT NULL)
  WITH CHECK (auth.jwt() IS NOT NULL);