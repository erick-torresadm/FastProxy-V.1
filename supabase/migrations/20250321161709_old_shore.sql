/*
  # Add Tags System

  1. New Tables
    - tags
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - name (text)
      - color (text)
      - created_at (timestamp)
    
    - proxy_tags
      - proxy_id (uuid, references proxy_fast)
      - tag_id (uuid, references tags)
      - created_at (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own tags
*/

-- Create tags table
CREATE TABLE tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create proxy_tags junction table
CREATE TABLE proxy_tags (
  proxy_id uuid REFERENCES proxy_fast ON DELETE CASCADE,
  tag_id uuid REFERENCES tags ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (proxy_id, tag_id)
);

-- Enable RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE proxy_tags ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own tags"
  ON tags
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own proxy tags"
  ON proxy_tags
  USING (
    EXISTS (
      SELECT 1 FROM tags
      WHERE tags.id = proxy_tags.tag_id
      AND tags.user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX tags_user_id_idx ON tags (user_id);
CREATE INDEX proxy_tags_proxy_id_idx ON proxy_tags (proxy_id);
CREATE INDEX proxy_tags_tag_id_idx ON proxy_tags (tag_id);