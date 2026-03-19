export type ActivityType = 'fabrication' | 'delivery' | 'erection' | 'inspection'
export type ProjectStatus = 'active' | 'completed' | 'archived'
export type Role = 'owner' | 'admin' | 'manager' | 'supervisor_shop' | 'supervisor_construction' | 'inspector_quality' | 'viewer'

export interface Organization {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface OrganizationMember {
  id: string
  user_id: string
  organization_id: string
  role: Role
  created_at: string
}

export interface Project {
  id: string
  organization_id: string
  name: string
  status: ProjectStatus
  created_at: string
  updated_at: string
}

export interface Subcontractor {
  id: string
  project_id: string
  organization_id: string
  name: string
  contact_info?: string | null
  created_at: string
  updated_at: string
}

export interface Drawing {
  id: string
  subcontractor_id: string
  organization_id: string
  name: string
  status: string
  created_at: string
  updated_at: string
}

export interface Assembly {
  id: string
  drawing_id: string
  subcontractor_id: string
  organization_id: string
  name: string
  created_at: string
  updated_at: string
}

export interface Element {
  id: string
  assembly_id: string
  subcontractor_id: string
  organization_id: string
  mark: string
  profile: string
  length: number
  weight: number
  created_at: string
  updated_at: string
}

export interface Activity {
  id: string
  element_id: string
  subcontractor_id: string
  organization_id: string
  name: string
  type: ActivityType
  status: string
  progress: number
  planned_start?: string | null
  planned_end?: string | null
  actual_start?: string | null
  actual_end?: string | null
  created_at: string
  updated_at: string
}

export interface Resource {
  id: string
  activity_id: string
  subcontractor_id: string
  organization_id: string
  name: string
  type: string
  cost: number
  created_at: string
  updated_at: string
}
