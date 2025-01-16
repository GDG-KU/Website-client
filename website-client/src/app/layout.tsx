/*app/layout.tsx*/
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { Providers } from './providers';
import { Metadata } from 'next';
import { wantedSans, wantedSansVariable } from '@/fonts';

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
    <html lang="en" className={`${wantedSans.variable} ${wantedSansVariable.variable}`}>
      <body style={{ display: 'flex' }}>
        <Providers>
          {/* 사이드바 */}
          <Sidebar />

          {/* 메인 컨텐츠 영역 */}
          <main style={{ flex: 1 }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}