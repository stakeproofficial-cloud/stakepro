import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value
    const role = request.cookies.get('user_role')?.value
    const { pathname } = request.nextUrl

    // Root: send to dashboard if logged in, else to login
    if (pathname === '/') {
        if (token) {
            const target = role === 'admin' ? '/admin' : '/user'
            return NextResponse.redirect(new URL(target, request.url))
        }
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Public routes
    const publicRoutes = ['/login', '/register']
    if (publicRoutes.includes(pathname)) {
        // If already logged in, go to dashboard
        if (token) {
            const target = role === 'admin' ? '/admin' : '/user'
            return NextResponse.redirect(new URL(target, request.url))
        }
        return NextResponse.next()
    }
    // Auth required for all other routes
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Admin route protection
    if (pathname.startsWith('/admin') && role !== 'admin') {
        return NextResponse.redirect(new URL('/user', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}