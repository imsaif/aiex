import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { defaultMetadata, siteConfig } from "@/config/seo";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const satoshi = localFont({
  src: [
    { path: "../../public/fonts/satoshi-300.woff2", weight: "300", style: "normal" },
    { path: "../../public/fonts/satoshi-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/satoshi-500.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/satoshi-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  ...defaultMetadata,
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: '/favicon.svg',
  },
  metadataBase: new URL(siteConfig.url),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={satoshi.variable}>
      <head>
        {/* ChunkLoadError recovery — auto-reload on stale chunk after deploy */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                var msg = (e.message || '').toLowerCase();
                if (msg.indexOf('chunk') !== -1 || msg.indexOf('loading') !== -1 || msg.indexOf('dynamically imported module') !== -1) {
                  if (!sessionStorage.getItem('chunk_reload')) {
                    sessionStorage.setItem('chunk_reload', '1');
                    window.location.reload();
                  }
                }
              });
              setTimeout(function() { sessionStorage.removeItem('chunk_reload'); }, 10000);
            `,
          }}
        />
        {/* Hotjar Tracking Code for aiuxdesign.guide */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:6596133,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />
      </head>
      <body className="bg-background-primary text-text-primary antialiased font-sans min-h-screen">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
