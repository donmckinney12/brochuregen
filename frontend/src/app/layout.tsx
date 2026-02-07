import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";
import { AuthProvider } from '@/context/AuthContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <ChatWidget />
      </body>
    </html>
  );
}
