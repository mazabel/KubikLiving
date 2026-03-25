/*
  # Create artists and artworks tables

  ## Summary
  Adds support for the art gallery section showcasing local artists.

  ## New Tables

  ### `artists`
  - `id` (uuid, primary key)
  - `name` (text) — artist full name
  - `bio` (text) — short biography
  - `origin` (text) — city or region of origin
  - `display_order` (int) — manual ordering
  - `created_at`, `updated_at` (timestamps)

  ### `artworks`
  - `id` (uuid, primary key)
  - `artist_id` (uuid, FK → artists)
  - `title` (text) — artwork title
  - `year` (int) — year created
  - `medium` (text) — technique/medium description
  - `image_url` (text) — full-size image URL
  - `display_order` (int) — ordering within artist
  - `created_at`, `updated_at` (timestamps)

  ## Security
  - RLS enabled on both tables
  - Public read access (gallery is public)
  - Admin write via service role
*/

CREATE TABLE IF NOT EXISTS artists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  bio text,
  origin text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS artworks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id uuid REFERENCES artists(id) ON DELETE CASCADE,
  title text NOT NULL,
  year int,
  medium text,
  image_url text NOT NULL,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read artists"
  ON artists FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can read artworks"
  ON artworks FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Service role can insert artists"
  ON artists FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update artists"
  ON artists FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete artists"
  ON artists FOR DELETE
  TO service_role
  USING (true);

CREATE POLICY "Service role can insert artworks"
  ON artworks FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update artworks"
  ON artworks FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete artworks"
  ON artworks FOR DELETE
  TO service_role
  USING (true);

INSERT INTO artists (name, bio, origin, display_order) VALUES
  ('Camila Restrepo', 'Pintora bogotana que explora la tensión entre lo urbano y lo orgánico a través del óleo y la acuarela.', 'Bogotá, Colombia', 1),
  ('Sebastián Mora', 'Fotógrafo documental cuyo lente captura la intimidad de los barrios históricos de Bogotá.', 'Medellín, Colombia', 2),
  ('Valentina Cruz', 'Artista textil que fusiona técnicas ancestrales con geometrías contemporáneas.', 'Cali, Colombia', 3)
ON CONFLICT DO NOTHING;
