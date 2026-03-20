import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },

      },
    }
  )


  // --- PHASE 3 HARDENING: Primary Auth Check ---
  let { data: { user }, error: authError } = await supabase.auth.getUser()

  // --- PHASE 3 HARDENING: getSession Fallback ---
  if (authError || !user) {
    console.warn(`[Middleware] [${request.nextUrl.pathname}] getUser() failed. Attempting getSession()...`)
    const { data: sessionData } = await supabase.auth.getSession()
    if (sessionData?.session?.user) {
      console.log(`[Middleware] [${request.nextUrl.pathname}] getSession() RESCUED THE USER!`)
      user = sessionData.session.user
    }
  }

  const { pathname } = request.nextUrl

  console.log(`[Middleware] [${pathname}] Cookies:`, request.cookies.getAll().map(c => c.name).join(', '))
  console.log(`[Middleware] [${pathname}] User ID:`, user?.id || 'NONE')
  if (authError && !user) console.error(`[Middleware] [${pathname}] Final Auth Error:`, authError.message)

  // Always allow these routes through without any auth checks
  const isPublicRoute =
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/auth') ||         // covers /auth/callback
    pathname.startsWith('/setup-organization') // allow setup page freely

  // 1. Unauthenticated on a protected route → send to login
  if (!user && pathname.startsWith('/dashboard')) {
    console.warn(`[Middleware] [${pathname}] REDIRECT -> /login (No Session)`)
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }







  // 2. Authenticated user on a public/auth route → send them straight to dashboard
  if (user && (pathname.startsWith('/login') || pathname === '/')) {
    const dashUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(dashUrl)
  }

  // 3. For all other routes with an authenticated user: allow through.
  // The /setup-organization page handles its own logic server-side.
  // We intentionally do NOT query organization_members here to avoid
  // race conditions immediately after signup (trigger may still be committing).

  return response
}

