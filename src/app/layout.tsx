import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { Suspense } from 'react';
import PageTransition from "@/components/ui/PageTransition";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PatternProvider } from "@/contexts";
import AnalyticsProvider from "@/components/providers/AnalyticsProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "aiexd | AI Design Patterns and Inspiration",
  description: "Discover AI design inspiration and learn from real use cases",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="bg-white text-gray-900 antialiased font-sans min-h-screen">
        <PatternProvider>
          <AnalyticsProvider>
            <Suspense fallback={<div className="page-loading" />}>
              <PageTransition>
                {children}
              </PageTransition>
            </Suspense>
            <ScrollToTop />
            <SpeedInsights />
          </AnalyticsProvider>
        </PatternProvider>
      </body>
    </html>
  );
}
