-- One row per successfully generated environment ZIP. Powers the real
-- "Environments Generated" stat on the homepage (components/hero-section.tsx)
-- instead of the hardcoded placeholder that used to be there, and could later
-- back a real "Top Templates" breakdown in the admin analytics dashboard.
--
-- Note: app/api/generate-deployment/route.ts also creates this table itself
-- (CREATE TABLE IF NOT EXISTS) the first time a generation is logged, so
-- running this script by hand is optional - it's here for documentation and
-- to match the convention of the other scripts/create-*.sql files.
CREATE TABLE IF NOT EXISTS generations (
  id SERIAL PRIMARY KEY,
  language VARCHAR(100),
  framework VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at DESC);
