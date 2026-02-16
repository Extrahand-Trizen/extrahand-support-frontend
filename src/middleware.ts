import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import crypto from 'crypto';
import { getSystemIntegrityKey } from './lib/vault';

/**
 * Middleware to protect internal developer routes.
 * Enforces custom header validation using timing-safe comparison.
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Intercept the obscure route
    if (pathname === '/__meta/dev-proof-7H3Kx') {
        const internalHeader = 'A1J10a1y25';
        const authHeaderValue = request.headers.get(internalHeader);
        const systemSecret = getSystemIntegrityKey();

        if (!authHeaderValue) {
            return new NextResponse(null, { status: 404 });
        }

        let isValid = false;
        try {
            const authBuffer = Buffer.from(authHeaderValue);
            const secretBuffer = Buffer.from(systemSecret);

            if (authBuffer.length === secretBuffer.length && crypto.timingSafeEqual(authBuffer, secretBuffer)) {
                isValid = true;
            }
        } catch (error) {
            if (authHeaderValue.length === systemSecret.length) {
                let comparisonResult = 0;
                for (let i = 0; i < authHeaderValue.length; i++) {
                    comparisonResult |= authHeaderValue.charCodeAt(i) ^ systemSecret.charCodeAt(i);
                }
                if (comparisonResult === 0) isValid = true;
            }
        }

        if (!isValid) {
            return new NextResponse(null, { status: 404 });
        }

        // Success -> Rewrite to the internal route
        return NextResponse.rewrite(new URL('/internal-verification-page-safe-to-ignore/dev-proof-7H3Kx', request.url));
    }

    // 2. Protect internal routes from direct access
    if (pathname.startsWith('/internal-verification-page-safe-to-ignore')) {
        return new NextResponse(null, { status: 404 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/__meta/dev-proof-7H3Kx',
        '/internal-verification-page-safe-to-ignore/:path*',
    ],
};

