import { getToken } from 'next-auth/jwt';
import { NextResponse, NextRequest } from 'next/server';
export { default } from 'next-auth/middleware';

//default from next-auth/middleware
//jwt from next-auth/jwt

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    //get current url
    const url = request.nextUrl;
    //redirect strategy
    if (
        token &&
        (url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify') ||
            url.pathname.startsWith('/'))
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    if(!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/dashboard/:path*',
        '/verify/:path*',
    ],
};
