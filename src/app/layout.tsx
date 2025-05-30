import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TM AI Day 2025 - Powered by AI Centre of Exellence",
  description: "Join us for TM AI Day 2025 on July 2nd, 2025. Experience the future of artificial intelligence with Telekom Malaysia. Connect with our AI assistant to learn more, register, and get personalized recommendations.",
  keywords: "TM, Telekom Malaysia, AI Day, Artificial Intelligence, Technology, Innovation, 2025",
  authors: [{ name: "Telekom Malaysia" }],
  creator: "Telekom Malaysia",
  publisher: "Telekom Malaysia",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ai.tm.com.my",
    title: "TM AI Day 2025",
    description: "Experience the future of AI with Telekom Malaysia",
    siteName: "TM AI Day 2025",
  },
  twitter: {
    card: "summary_large_image",
    title: "TM AI Day 2025",
    description: "Experience the future of AI with Telekom Malaysia",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=yes",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0066cc" },
    { media: "(prefers-color-scheme: dark)", color: "#3385d6" },
  ],
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TM AI Day 2025" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0066cc" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="theme-color" content="#0066cc" />
        
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://llm.nnoc.cloud" />
        <link rel="preconnect" href="https://ai.tm.com.my" />
        
        {/* Preload TM Logo for better performance */}
        <link rel="preload" href="/tm-logo.png" as="image" type="image/png" />
        
        {/* iOS PWA meta tags */}
        <meta name="apple-touch-fullscreen" content="yes" />
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" />
        
        {/* Prevent zoom on iOS */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        
        {/* PWA Install Button (hidden by default) */}
        <button
          id="pwa-install-button"
          style={{ display: 'none' }}
          className="fixed bottom-20 right-6 z-40 px-4 py-2 bg-tm-blue text-white rounded-full shadow-lg ios-transition hover:scale-105"
        >
          Install App
        </button>
      </body>
    </html>
  );
}