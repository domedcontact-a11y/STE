import { redirect } from 'next/navigation'

export default function Home() {
  // The middleware will handle redirecting unauthenticated users to /login 
  // or authenticated users without an org to /setup-organization.
  redirect('/dashboard')
}
