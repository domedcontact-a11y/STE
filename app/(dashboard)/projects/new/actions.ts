'use server'

import { createProject } from '@/lib/services/projects'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function submitProject(formData: FormData) {
  const name = formData.get('name') as string

  if (!name || name.trim() === '') {
    redirect('/projects/new?error=Project name is required')
  }

  try {
    await createProject(name.trim())
  } catch (error: any) {
    redirect(`/projects/new?error=${encodeURIComponent(error.message || 'Failed to create project')}`)
  }

  // Revalidate the dashboard layout to ensure fresh data fetch
  revalidatePath('/dashboard', 'layout')
  
  // Optionally, we could redirect to the specific project page (e.g., /projects/[id]) 
  // but for now, returning to the unified dashboard is standard.
  redirect('/dashboard')
}
