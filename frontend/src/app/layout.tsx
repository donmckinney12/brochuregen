import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";
import ConditionalFooter from "@/components/ConditionalFooter";
import { AuthProvider } from '@/context/AuthContext';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | BrochureGen',
    default: 'BrochureGen - AI Brochure Maker',
  },
  description: 'Turn any website URL into a professional, print-ready PDF brochure in seconds using AI. Perfect for Real Estate, Corporate Profiles, and Events.',
  keywords: ['AI', 'Brochure Maker', 'PDF Generator', 'Real Estate Marketing', 'Automated Design'],
  authors: [{ name: 'BrochureGen' }],
  creator: 'BrochureGen',
  openGraph: {
    title: 'BrochureGen - AI Brochure Maker',
    description: 'Turn any website URL into a professional, print-ready PDF brochure in seconds using AI.',
    url: 'https://brochuregen.com',
    siteName: 'BrochureGen',
    images: [
      {
        url: 'https://brochuregen.com/og-image.jpg', // Placeholder
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BrochureGen - AI Brochure Maker',
    description: 'Turn any website URL into a professional, print-ready PDF brochure in seconds using AI.',
    creator: '@brochuregen',
    images: ['https://brochuregen.com/twitter-image.jpg'], // Placeholder
  },
  icons: {
    icon: '/favicon.ico',
  },
};

import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/context/ThemeContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'BrochureGen',
              url: 'https://brochuregen.com',
              description: 'AI-powered brochure generator that turns any URL into a professional PDF.',
              logo: 'https://brochuregen.com/favicon.ico',
              sameAs: ['https://twitter.com/brochuregen'],
            }),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{document.documentElement.classList.add("dark");localStorage.setItem("theme","dark")}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} antialiased selection:bg-[var(--accent-primary)]/30 selection:text-[var(--foreground)] bg-[var(--background)] transition-colors duration-500`}
      >
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[var(--background)]"></div>
          <div className="absolute inset-0 noise-overlay"></div>
          <div className="absolute inset-0 mesh-gradient opacity-40"></div>
          <div className="absolute inset-x-0 top-0 h-screen bg-gradient-to-b from-[var(--accent-primary)]/20 via-[var(--accent-secondary)]/10 to-transparent blur-[140px] opacity-50"></div>
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[var(--accent-primary)]/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[var(--accent-tertiary)]/20 rounded-full blur-[100px] animate-flicker"></div>
          <div className="absolute inset-0 animate-aurora mix-blend-screen opacity-30"></div>
          <div className="scanline opacity-20"></div>
        </div>
        <ClerkProvider
          afterSignOutUrl="/"
        >
          <ThemeProvider>
            <AuthProvider>
              {children}
              <ConditionalFooter />
            </AuthProvider>
          </ThemeProvider>
        </ClerkProvider>
        <ChatWidget />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
