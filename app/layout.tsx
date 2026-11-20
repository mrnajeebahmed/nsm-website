import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AdvisorProvider } from '@/components/AdvisorProvider';
import { ChatWidget } from '@/components/ChatWidget';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'NSM Technologies | AI Digital Solutions for Growing Businesses', template: '%s | NSM Technologies' },
  description: 'AI strategy, workflow automation, custom AI agents & RAG, and systems integration. Production systems shipped in weeks, model-agnostic and 100% client-owned.',
  openGraph: { type: 'website', siteName: 'NSM Technologies' },
};
export const viewport: Viewport = { themeColor: '#F8FAFC' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AdvisorProvider>
          <a href="#main" className="sr-only">Skip to content</a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <ChatWidget />
        </AdvisorProvider>
      </body>
    </html>
  );
}
