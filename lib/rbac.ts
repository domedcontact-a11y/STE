export type Action = 
  | 'manage_members' 
  | 'create_project' 
  | 'edit_project' 
  | 'delete_project'
  | 'create_activity'
  | 'update_activity_status'
  | 'edit_activity_metadata'

const ROLE_PERMISSIONS: Record<string, Action[]> = {
  owner: [
    'manage_members', 'create_project', 'edit_project', 'delete_project',
    'create_activity', 'update_activity_status', 'edit_activity_metadata'
  ],
  admin: [
    'manage_members', 'create_project', 'edit_project', 'delete_project',
    'create_activity', 'update_activity_status', 'edit_activity_metadata'
  ],
  manager: [
    'manage_members', 'create_project', 'edit_project', 'create_activity', 
    'update_activity_status', 'edit_activity_metadata'
  ],
  supervisor_shop: [
    'update_activity_status'
  ],
  supervisor_construction: [
    'update_activity_status'
  ],
  inspector_quality: [
    'update_activity_status'
  ],
  viewer: []
}

/**
 * Checks if a specific role possesses the required action permission.
 */
export function hasPermission(role: string, action: Action): boolean {
  if (!role || !ROLE_PERMISSIONS[role]) return false;
  return ROLE_PERMISSIONS[role].includes(action);
}

/**
 * Normalizes and safely maps an unknown string to a valid Role type.
 */
export function mapToRole(roleString: string | undefined | null): string {
  if (!roleString) return 'viewer'
  if (ROLE_PERMISSIONS[roleString]) return roleString
  return 'viewer'
}
