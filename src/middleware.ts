import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Simple in-memory rate limiter (for production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Rate limit configurations
const RATE_LIMITS = {
    // Mobile API endpoints - stricter limits
    mobile: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 60,     // 60 requests per minute
    },
    // Authentication endpoints - very strict
    auth: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 10,     // 10 requests per minute
    },
    // General API
    api: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 100,    // 100 requests per minute
    },
    // Web pages
    pages: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 200,    // 200 requests per minute
    },
};

function getClientIdentifier(request: NextRequest): string {
    // Get IP from various headers (works with proxies)
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip');

    return forwarded?.split(',')[0]?.trim() ||
        realIp ||
        cfConnectingIp ||
        'unknown';
}

function isRateLimited(
    identifier: string,
    route: string,
    config: { windowMs: number; maxRequests: number }
): { limited: boolean; remaining: number; resetIn: number } {
    const key = `${identifier}:${route}`;
    const now = Date.now();
    const windowData = rateLimitMap.get(key);

    // Clean up old entries periodically
    if (rateLimitMap.size > 10000) {
        for (const [k, v] of rateLimitMap.entries()) {
            if (now > v.resetTime) {
                rateLimitMap.delete(k);
            }
        }
    }

    if (!windowData || now > windowData.resetTime) {
        // New window
        rateLimitMap.set(key, { count: 1, resetTime: now + config.windowMs });
        return { limited: false, remaining: config.maxRequests - 1, resetIn: config.windowMs };
    }

    if (windowData.count >= config.maxRequests) {
        // Rate limited
        return {
            limited: true,
            remaining: 0,
            resetIn: windowData.resetTime - now
        };
    }

    // Increment counter
    windowData.count++;
    return {
        limited: false,
        remaining: config.maxRequests - windowData.count,
        resetIn: windowData.resetTime - now
    };
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const clientId = getClientIdentifier(request);

    // Skip rate limiting for static files
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // Determine rate limit config based on route
    let rateLimitConfig = RATE_LIMITS.pages;
    let routeType = 'pages';

    if (pathname.startsWith('/api/mobile/auth')) {
        rateLimitConfig = RATE_LIMITS.auth;
        routeType = 'auth';
    } else if (pathname.startsWith('/api/mobile')) {
        rateLimitConfig = RATE_LIMITS.mobile;
        routeType = 'mobile';
    } else if (pathname.startsWith('/api/auth')) {
        rateLimitConfig = RATE_LIMITS.auth;
        routeType = 'auth';
    } else if (pathname.startsWith('/api')) {
        rateLimitConfig = RATE_LIMITS.api;
        routeType = 'api';
    }

    // Check rate limit
    const { limited, remaining, resetIn } = isRateLimited(clientId, routeType, rateLimitConfig);

    if (limited) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: 'Too many requests. Please try again later.',
                retryAfter: Math.ceil(resetIn / 1000),
            }),
            {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'X-RateLimit-Limit': rateLimitConfig.maxRequests.toString(),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': Math.ceil(resetIn / 1000).toString(),
                    'Retry-After': Math.ceil(resetIn / 1000).toString(),
                },
            }
        );
    }

    // Protected routes that require authentication
    const protectedRoutes = [
        '/dashboard',
        '/hospital/dashboard',
        '/hospital/appointments',
        '/hospital/doctors',
        '/hospital/patients',
        '/doctor/dashboard',
        '/doctor/appointments',
        '/doctor/patients',
        '/doctor/schedule',
    ];

    const isProtectedRoute = protectedRoutes.some(route =>
        pathname === route || pathname.startsWith(route + '/')
    );

    if (isProtectedRoute) {
        const token = await getToken({ req: request });

        if (!token) {
            // Determine redirect based on route
            if (pathname.startsWith('/hospital')) {
                return NextResponse.redirect(new URL('/hospital/login', request.url));
            } else if (pathname.startsWith('/doctor')) {
                return NextResponse.redirect(new URL('/doctor/login', request.url));
            } else {
                return NextResponse.redirect(new URL('/login', request.url));
            }
        }
    }

    // Add rate limit headers to response
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', rateLimitConfig.maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', Math.ceil(resetIn / 1000).toString());

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
