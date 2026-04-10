import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { defaultMetadata, siteConfig } from "@/config/seo";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const satoshi = localFont({
  src: [
    { path: "../../public/fonts/satoshi-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/satoshi-500.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/satoshi-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
  preload: true,
  // Use size-adjusted fallback so fallback font metrics match Satoshi —
  // eliminates layout shift when Satoshi swaps in (fixes CLS on audit/pattern pages).
  adjustFontFallback: "Arial",
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
        {/* Machine-readable product design decisions for AI tools and LLMs */}
        <link rel="gist-design" href="/aiuxdesign.gist.design" type="text/markdown" />
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
        {/* Microsoft Clarity — deferred to idle time to avoid blocking interactions.
            Only loaded in production builds AND only on the production host, so dev
            and preview deploys don't pollute Clarity metrics. */}
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function loadClarity() {
                  // Belt-and-braces: skip on localhost/preview even if NODE_ENV is production
                  var h = location.hostname;
                  if (h === 'localhost' || h === '127.0.0.1' || h.endsWith('.local') || h.endsWith('.vercel.app')) return;
                  function init() {
                    (function(c,l,a,r,i,t,y){
                      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                    })(window,document,"clarity","script","vj7nlmybbm");
                  }
                  if ('requestIdleCallback' in window) {
                    requestIdleCallback(init, { timeout: 2500 });
                  } else {
                    setTimeout(init, 1500);
                  }
                })();
              `,
            }}
          />
        )}
      </head>
      <body className="bg-background-primary text-text-primary antialiased font-sans min-h-screen">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
