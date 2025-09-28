import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from 'jose';

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.css).*)'],
};

export const publicRoutes = ['/auth/signup', '/auth/signup/verify', '/auth/signup/documents', '/auth/signin', '/auth/verification-pending', '/'];

export async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;
    
    const isPublic = publicRoutes.includes(pathname);

    if (isPublic) {
        return NextResponse.next();
    }

    const token = req.cookies.get('token')?.value;
    
    if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
    }       

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'some-jwt-secret');
        
        await jwtVerify(token, secret, {
          algorithms: ['HS256']
        });
        
        return NextResponse.next();
    } catch (error) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
}