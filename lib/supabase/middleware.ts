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
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 1. If not authenticated and on dashboard -> redirect to login
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. If authenticated: check for organization membership
  if (user) {
    // Check if user is already on auth or setup pages
    const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/auth')
    const isSetupPage = request.nextUrl.pathname === '/setup-organization'

    // Fetch membership
    const { data: membership } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', user.id)
      .limit(1)
      .single()

    // 3. If authenticated but No organization -> force redirect to /setup-organization
    if (!membership && !isSetupPage && !request.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL('/setup-organization', request.url))
    }

    // 4. If authenticated + organization -> prevent access to login/signup/setup
    if (membership && (isAuthPage || isSetupPage)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return response
}
