DROP POLICY IF EXISTS "Owners can update their organization" ON organizations;

CREATE POLICY "Owners can update their organization" 
ON organizations FOR UPDATE 
USING (id IN (
  SELECT organization_id FROM organization_members 
  WHERE user_id = auth.uid() AND role = 'owner'
));
