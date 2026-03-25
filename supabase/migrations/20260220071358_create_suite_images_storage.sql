/*
  # Create Storage Bucket for Suite Images

  1. New Storage
    - Creates a public bucket `suite-images` for storing uploaded suite gallery photos
    - Images are publicly readable (no auth needed to view)
    - Only authenticated users can upload/delete

  2. Security
    - Public SELECT: anyone can view images (needed for landing page)
    - Authenticated INSERT/UPDATE/DELETE: only logged-in admins can manage files
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('suite-images', 'suite-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view suite images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'suite-images');

CREATE POLICY "Authenticated users can upload suite images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'suite-images');

CREATE POLICY "Authenticated users can update suite images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'suite-images')
  WITH CHECK (bucket_id = 'suite-images');

CREATE POLICY "Authenticated users can delete suite images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'suite-images');
