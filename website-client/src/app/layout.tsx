import './globals.css';
import Sidebar from '@/components/Sidebar';
import { Providers } from './providers';
import { Metadata } from 'next';
import { wantedSans, wantedSansVariable } from '@/fonts';
import React, { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'GDG KU',
  description: 'GDG KU official page',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${wantedSans.variable} ${wantedSansVariable.variable}`}
    >
      <body style={{ display: 'flex' }}>
        <Suspense fallback={<p>Loading...</p>}>
          <Providers>
            <Sidebar />
            <main style={{ flex: 1 }}>
              {children}
            </main>
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
