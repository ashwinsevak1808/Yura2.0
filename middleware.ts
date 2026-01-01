import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    });
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    });
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // Protect Admin Routes
    if (request.nextUrl.pathname.startsWith('/admin')) {

        // Allow access to public admin auth pages
        const publicAdminRoutes = ['/admin/login', '/admin/forgot-password', '/admin/update-password'];
        if (publicAdminRoutes.includes(request.nextUrl.pathname)) {
            // If already logged in, redirect to dashboard (only for login page usually, but maybe forgot password too?)
            // If user is logged in, they shouldn't be on login page.
            if (user && request.nextUrl.pathname === '/admin/login') {
                return NextResponse.redirect(new URL('/admin', request.url));
            }
            return response;
        }

        // Redirect to login if not authenticated
        if (!user) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // Role Check (Optional but Recommended)
        // Checking database in middleware can be slow. 
        // Ideally, use Custom Claims or handle strictly in layout/server components.
        // For now, we rely on the session (authenticated) + the layout.tsx double check.
        // To restrict ONLY to specific email in middleware as a fail-safe:
        // if (user.email !== 'ashwinsevak2091@gmail.com') { // can uncomment if strict email enforcement is desired
        //  return NextResponse.redirect(new URL('/', request.url));
        // }
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
