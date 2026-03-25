/*
  # Add write policies for suites table

  1. Problem
    - Only a SELECT policy existed, so INSERT/UPDATE/DELETE from authenticated
      admin users were silently blocked by RLS.
    - Images saved in the editor were never actually persisted to the database.

  2. Fix
    - Add INSERT, UPDATE, DELETE policies restricted to authenticated users.
    - Public SELECT policy remains unchanged.
*/

CREATE POLICY "Authenticated users can insert suites"
  ON suites FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update suites"
  ON suites FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete suites"
  ON suites FOR DELETE
  TO authenticated
  USING (true);
