import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // Admin Protection
    if (path.startsWith('/admin')) {
        if (path === '/admin') {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url))
        }
        if (!path.startsWith('/admin/login')) {
            const adminSession = request.cookies.get('admin_session')
            if (!adminSession) {
                return NextResponse.redirect(new URL('/admin/login', request.url))
            }
        }
    }

    // Dinas Protection
    if (path.startsWith('/dinas')) {
        if (path === '/dinas') {
            return NextResponse.redirect(new URL('/dinas/dashboard', request.url))
        }
        if (!path.startsWith('/dinas/login')) {
            const dinasSession = request.cookies.get('dinas_session')
            if (!dinasSession) {
                return NextResponse.redirect(new URL('/dinas/login', request.url))
            }
        }
    }

    // API Protection for admin/dinas routes
    if (path.startsWith('/api/admin')) {
        const adminSession = request.cookies.get('admin_session')
        if (!adminSession) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }
    }

    if (path.startsWith('/api/dinas')) {
        const dinasSession = request.cookies.get('dinas_session')
        if (!dinasSession) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/dinas/:path*',
        '/api/admin/:path*',
        '/api/dinas/:path*',
    ],
}
