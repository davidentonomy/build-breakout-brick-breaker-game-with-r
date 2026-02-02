import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Breakout - Brick Breaker Game',
  description: 'Classic Breakout arcade game built with React, Next.js, and TypeScript',
  keywords: ['breakout', 'brick breaker', 'game', 'arcade', 'react', 'nextjs'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
