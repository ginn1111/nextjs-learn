import { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized: ({ request, auth }) => {
      const isLogged = !!auth?.user;
      const isOnDashBoard = request.nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashBoard) {
        if (isLogged) return true;

        return false;
      } else if (isLogged) {
        return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
