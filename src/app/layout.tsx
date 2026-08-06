import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/MainLayout";
import ContextProvider from "@/context";
import { headers } from 'next/headers'

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
    default: "Stakepro - USDT Staking Platform",
    template: "%s | stakepro",
  },
  description: "Secure USDT staking platform with balance tracking, staking rewards, and withdrawals.",
  keywords: [
    "USDT staking",
    "staking platform",
    "crypto staking",
    "passive income",
    "daily rewards",
    "referral earnings",
    "Stakepro",
  ],
  authors: [{ name: "Stakepro Team" }],
  creator: "Stakepro",
  publisher: "Stakepro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://stakepro.org'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://stakepro.org',
    siteName: 'Stakepro',
    title: 'Stakepro - USDT Staking Platform',
    description: 'Secure USDT staking platform with balance tracking, staking rewards, and withdrawals.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Stakepro Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stakepro - USDT Staking Platform',
    description: 'Secure USDT staking platform with balance tracking, staking rewards, and withdrawals.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/logo.png' },
      { url: '/logo.png', sizes: '16x16', type: 'image/png' },
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  // themeColor: [
  //   { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  //   { media: '(prefers-color-scheme: dark)', color: '#000000' },
  // ],
};

export const viewport = {
  themeColor: "#000000",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersData = await headers();
  const cookies = headersData.get('cookie');
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ContextProvider cookies={cookies}>
          <MainLayout>
            {children}
          </MainLayout>
        </ContextProvider>
      </body>
    </html>
  );
}
