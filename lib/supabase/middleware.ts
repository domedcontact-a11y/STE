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

  const url = request.nextUrl.clone()

  // 1. If not authenticated and on dashboard -> redirect to login
  if (!user && url.pathname.startsWith('/dashboard')) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 2. If authenticated: check for organization membership
  if (user) {
    // Check if user is already on auth or setup pages
    const isAuthPage = url.pathname.startsWith('/login') || url.pathname.startsWith('/auth')
    const isSetupPage = url.pathname === '/setup-organization'

    // Fetch membership
    const { data: membership } = await supabase
      .from('memberships')
      .select('organization_id')
      .eq('user_id', user.id)
      .limit(1)
      .single()

    // 3. If authenticated but No organization -> force redirect to /setup-organization
    if (!membership && !isSetupPage && !url.pathname.startsWith('/api')) {
      url.pathname = '/setup-organization'
      return NextResponse.redirect(url)
    }

    // 4. If authenticated + organization -> prevent access to login/signup/setup
    if (membership && (isAuthPage || isSetupPage)) {
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return response
}
