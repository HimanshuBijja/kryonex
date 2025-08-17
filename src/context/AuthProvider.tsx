"use client"

import { SessionProvider, SessionProviderProps } from 'next-auth/react';
export default function AuthProvider({
    children
}: {
    children: React.ReactNode;
}) {
    return <SessionProvider>{children}</SessionProvider>;
}
