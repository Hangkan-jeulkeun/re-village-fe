import type { Metadata } from 'next';

import { QueryProvider } from '@/components/QueryProvider';
import { LOOKUP_THUMBNAIL_PRELOADS } from '@/features/lookup/thumbnailAssets';
import './globals.css';

export const metadata: Metadata = {
  title: '한집줄클',
  description: '한집줄클 - 관리자 대시보드',
  icons: {
    icon: '/images/home-type1-damBat.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {LOOKUP_THUMBNAIL_PRELOADS.map((href) => (
          <link key={href} rel="preload" as="image" href={href} />
        ))}
      </head>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
