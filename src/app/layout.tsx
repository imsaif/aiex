import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
