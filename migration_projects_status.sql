-- Adds `status` tracking to projects

ALTER TABLE projects ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived'));
