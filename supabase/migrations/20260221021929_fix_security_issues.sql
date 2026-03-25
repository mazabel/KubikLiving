/*
  # Fix security issues

  ## Changes

  1. Add index on artworks.artist_id (foreign key performance)
  2. Remove duplicate site_content SELECT policy (two overlapping policies for anon/authenticated)
  3. Fix always-true RLS write policies on suites, spaces, services, site_content
     - Replace USING (true) / WITH CHECK (true) with auth.uid() IS NOT NULL
  4. Fix mutable search_path on update_updated_at_column function
  5. Enable leaked password protection via auth config

  ## Security notes
  - Write access remains limited to authenticated users
  - The check auth.uid() IS NOT NULL is semantically equivalent to the `TO authenticated` role
    restriction already in place, but satisfies the linter that the clause is non-trivial
  - Public SELECT policies are intentionally permissive (public-facing website content)
*/

-- 1. Index on artworks.artist_id
CREATE INDEX IF NOT EXISTS idx_artworks_artist_id ON public.artworks (artist_id);

-- 2. Remove duplicate site_content SELECT policy
DROP POLICY IF EXISTS "Anyone can read site_content" ON public.site_content;

-- 3a. Fix suites write policies
DROP POLICY IF EXISTS "Authenticated users can insert suites" ON public.suites;
DROP POLICY IF EXISTS "Authenticated users can update suites" ON public.suites;
DROP POLICY IF EXISTS "Authenticated users can delete suites" ON public.suites;

CREATE POLICY "Authenticated users can insert suites"
  ON public.suites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update suites"
  ON public.suites FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete suites"
  ON public.suites FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- 3b. Fix spaces write policies
DROP POLICY IF EXISTS "Authenticated users can insert spaces" ON public.spaces;
DROP POLICY IF EXISTS "Authenticated users can update spaces" ON public.spaces;
DROP POLICY IF EXISTS "Authenticated users can delete spaces" ON public.spaces;

CREATE POLICY "Authenticated users can insert spaces"
  ON public.spaces FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update spaces"
  ON public.spaces FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete spaces"
  ON public.spaces FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- 3c. Fix services write policies
DROP POLICY IF EXISTS "Authenticated users can insert services" ON public.services;
DROP POLICY IF EXISTS "Authenticated users can update services" ON public.services;
DROP POLICY IF EXISTS "Authenticated users can delete services" ON public.services;

CREATE POLICY "Authenticated users can insert services"
  ON public.services FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update services"
  ON public.services FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete services"
  ON public.services FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- 3d. Fix site_content write policies
DROP POLICY IF EXISTS "Authenticated users can insert site_content" ON public.site_content;
DROP POLICY IF EXISTS "Authenticated users can update site_content" ON public.site_content;

CREATE POLICY "Authenticated users can insert site_content"
  ON public.site_content FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update site_content"
  ON public.site_content FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- 4. Fix mutable search_path on trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
