'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import '@/styles/globals.css';
import { Analytics } from "@vercel/analytics/react"

export default function RootLayout({ children }: { children: ReactNode }) {
    const queryClient = new QueryClient();

    return (
        <html lang="en">
        <body className="bg-gray-50">
        <QueryClientProvider client={queryClient}>
            <main className="container mx-auto p-4">
                {children}
            </main>
            <Analytics />
        </QueryClientProvider>
        </body>
        </html>
    );
}