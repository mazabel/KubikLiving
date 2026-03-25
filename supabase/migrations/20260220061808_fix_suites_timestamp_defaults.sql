/*
  # Fix timestamp columns in suites table

  Ensures created_at and updated_at always use server-side defaults
  and cannot be set to empty strings from client inserts.

  Changes:
  - Set created_at to NOT NULL with DEFAULT now()
  - Set updated_at to NOT NULL with DEFAULT now()
  - Add trigger to auto-update updated_at on row changes
*/

ALTER TABLE suites
  ALTER COLUMN created_at SET NOT NULL,
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN updated_at SET NOT NULL,
  ALTER COLUMN updated_at SET DEFAULT now();

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_suites_updated_at'
  ) THEN
    CREATE TRIGGER update_suites_updated_at
      BEFORE UPDATE ON suites
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
