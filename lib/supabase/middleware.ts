import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Phase 1 Diagnosis: Structured Logging (Not Noisy)
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/login')) {
      console.log(`[Middleware] -> Path: ${pathname}`)
      console.log(`[Middleware] -> Cookies Present:`, request.cookies.getAll().map(c => c.name).join(', ') || 'None')
  }

  // 1. Create initial response object
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Initialize Supabase SSR Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          // Whenever cookies are updated, we must recreate the next response
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. Primary Auth Resolution (triggers internal refresh bounds if expired)
  let { data: { user }, error: authError } = await supabase.auth.getUser()

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/login')) {
      console.log(`[Middleware] -> getUser() Result:`, user ? `Valid User (${user.id})` : 'NULL')
      if (authError && !user) console.warn(`[Middleware] -> getUser() Error:`, authError.message)
  }

  // Defensive Fallback: If getUser fails (e.g. latency, network), check session
  if (authError || !user) {
    const { data: sessionData } = await supabase.auth.getSession()
    if (sessionData?.session?.user) {
      if (pathname.startsWith('/dashboard') || pathname.startsWith('/login')) {
          console.log(`[Middleware] -> getSession() RESCUED session!`)
      }
      user = sessionData.session.user
    }
  }

  // 4. Route-Aware Logic & Redirections
  // Protected Routes
  const isProtectedRoute = pathname.startsWith('/dashboard') && pathname !== '/dashboard-test'
  
  // Public/Auth Routes (users should not see login if already logged in)
  const isAuthRoute = pathname.startsWith('/login') || pathname === '/' || pathname.startsWith('/signup')

  if (isProtectedRoute && !user) {
    // REDIRECT TO LOGIN: Unauthenticated user on protected route
    console.warn(`[Middleware] -> Unauthenticated on protected route. Redirecting to /login.`)
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('error', 'Session expired. Please log in again.')
    const redirectResponse = NextResponse.redirect(redirectUrl)
    
    // CRITICAL FIX: Copy any refreshed cookies onto the new redirect response!
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })
    return redirectResponse
  }

  if (isAuthRoute && user) {
    // REDIRECT TO DASHBOARD: Authenticated user on auth route
    console.log(`[Middleware] -> Authenticated on public route. Redirecting to /dashboard.`)
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    const redirectResponse = NextResponse.redirect(redirectUrl)
    
    // CRITICAL FIX: Copy any refreshed cookies onto the new redirect response!
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })
    return redirectResponse
  }

  // 5. Default Return
  return supabaseResponse
}
