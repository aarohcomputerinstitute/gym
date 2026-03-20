import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register') || request.nextUrl.pathname.startsWith('/forgot-password');
  const isPublicRoute = request.nextUrl.pathname === '/' || isAuthRoute;
  const isExpiredPage = request.nextUrl.pathname === '/expired';
  const isBillingPage = request.nextUrl.pathname.startsWith('/settings/billing');
  
  // 1. Redirect unauthenticated users
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 2. Handle authenticated users
  if (user) {
    // Fetch base user data
    const { data: userData } = await supabase
      .from('users')
      .select('role, gym_id')
      .eq('id', user.id)
      .single();

    // 2a. Guard: Trial Expiration Check (Only for protected App routes)
    if (!isPublicRoute && userData && userData.role !== 'super_admin' && !isExpiredPage && !isBillingPage && userData.gym_id) {
      // Fetch gym status
      const { data: gymData } = await supabase
        .from('gyms')
        .select('status, trial_ends_at')
        .eq('id', userData.gym_id)
        .single();

      if (gymData?.status === 'trial' && gymData.trial_ends_at) {
        const trialEndDate = new Date(gymData.trial_ends_at);
        if (trialEndDate < new Date()) {
          // Trial expired! Lock them out
          const url = request.nextUrl.clone();
          url.pathname = '/expired';
          return NextResponse.redirect(url);
        }
      }
    }

    // 2b. Redirect logged-in users away from auth pages
    if (isAuthRoute) {
      const url = request.nextUrl.clone();
      if (userData?.role === 'super_admin') {
        url.pathname = '/super-admin/dashboard';
      } else {
        url.pathname = '/dashboard';
      }
      return NextResponse.redirect(url);
    }

    // 2c. Protect Super Admin routes
    if (request.nextUrl.pathname.startsWith('/super-admin') && userData?.role !== 'super_admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
