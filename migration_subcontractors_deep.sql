-- Migration: Deep Subcontractor Blanket Linking
-- WARNING: This migration enforces NOT NULL on new subcontractor_id foreign keys.
-- For a safe structural upgrade in the dev environment, volatile relational data is wiped.
DELETE FROM assemblies;

-- 1. Add contact_info to subcontractors
ALTER TABLE subcontractors ADD COLUMN IF NOT EXISTS contact_info TEXT;

-- 2. Add subcontractor_id to assemblies
ALTER TABLE assemblies ADD COLUMN subcontractor_id UUID NOT NULL REFERENCES subcontractors(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_assemblies_subcontractor ON assemblies(subcontractor_id);

-- 3. Add subcontractor_id to elements
ALTER TABLE elements ADD COLUMN subcontractor_id UUID NOT NULL REFERENCES subcontractors(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_elements_subcontractor ON elements(subcontractor_id);

-- 4. Add subcontractor_id to activities
ALTER TABLE activities ADD COLUMN subcontractor_id UUID NOT NULL REFERENCES subcontractors(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_activities_subcontractor ON activities(subcontractor_id);

-- 5. Add subcontractor_id to resources
ALTER TABLE resources ADD COLUMN subcontractor_id UUID NOT NULL REFERENCES subcontractors(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_resources_subcontractor ON resources(subcontractor_id);
