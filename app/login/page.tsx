import LoginForm from '@/components/LoginForm'

export const metadata = {
  title: 'Login | CM App'
}

export default function LoginPage({ searchParams }: { searchParams: { error?: string, success?: string } }) {
  console.log('[LoginPage] Rendering with params:', searchParams)
  
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
        <h1 className="text-3xl font-black text-center text-slate-900 tracking-tight mb-2">
          CM App Access
        </h1>
        <p className="text-center text-slate-500 mb-8 font-medium">
          Sign in to your construction workspace.
        </p>
        
        <LoginForm 
          initialError={searchParams?.error} 
          initialSuccess={searchParams?.success} 
        />
      </div>
    </div>
  )
}
