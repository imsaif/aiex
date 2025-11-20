/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has TypeScript errors.
    ignoreBuildErrors: true,
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['framer-motion', 'fuse.js', 'react-syntax-highlighter'],
  },

  // Configure external image domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'commons.wikimedia.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'uxwing.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lobehub.com',
        pathname: '/**',
      },
    ],
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/simulator',
        destination: '/prompts',
        permanent: true,
      },
      {
        source: '/simulator/:path*',
        destination: '/prompts',
        permanent: true,
      },
    ];
  },

  // images: {
  //   // Enable better image formats (WebP, AVIF)
  //   formats: ['image/avif', 'image/webp'],
    
  //   // Common device widths for responsive images
  //   deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    
  //   // Size increments for responsive images
  //   imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
  //   // Minimize image requests by caching aggressively
  //   minimumCacheTTL: 31536000, // 1 year
    
  //   // Disable the blur-up placeholder for large GIFs to improve performance
  //   dangerouslyAllowSVG: true,
  //   contentDispositionType: 'attachment',
    
  //   // Custom loader to handle GIF files more efficiently
  //   loader: 'default',
  // },

  // // Compress responses
  // compress: true,
  
  // // Enable webpack optimizations
  // webpack: (config, { isServer, dev }) => {
  //   if (!dev && !isServer) {
  //     // Split vendor chunks more aggressively
  //     config.optimization.splitChunks = {
  //       chunks: 'all',
  //       cacheGroups: {
  //         default: false,
  //         vendors: false,
  //         // Separate framework bundle
  //         framework: {
  //           chunks: 'all',
  //           name: 'framework',
  //           test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
  //           priority: 40,
  //           enforce: true,
  //         },
  //         // Separate large UI libraries
  //         motion: {
  //           name: 'motion',
  //           test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
  //           priority: 30,
  //           enforce: true,
  //         },
  //         // Separate syntax highlighter
  //         syntaxHighlighter: {
  //           name: 'syntax-highlighter', 
  //           test: /[\\/]node_modules[\\/]react-syntax-highlighter[\\/]/,
  //           priority: 30,
  //           enforce: true,
  //         },
  //         // Separate search functionality
  //         search: {
  //           name: 'search',
  //           test: /[\\/]node_modules[\\/]fuse\.js[\\/]/,
  //           priority: 30,
  //           enforce: true,
  //         },
  //         // Common vendor libraries
  //         vendor: {
  //           name: 'vendor',
  //           test: /[\\/]node_modules[\\/]/,
  //           priority: 20,
  //           enforce: true,
  //         },
  //         // Common components
  //         commons: {
  //           name: 'commons',
  //           minChunks: 2,
  //           priority: 10,
  //           reuseExistingChunk: true,
  //         },
  //       },
  //     };
  //   }
  //   return config;
  // },

  // // Headers for caching
  // async headers() {
  //   return [
  //     {
  //       source: '/images/:path*',
  //       headers: [
  //         {
  //           key: 'Cache-Control',
  //           value: 'public, max-age=31536000, immutable',
  //         },
  //       ],
  //     },
  //     {
  //       source: '/_next/static/:path*',
  //       headers: [
  //         {
  //           key: 'Cache-Control',
  //           value: 'public, max-age=31536000, immutable',
  //         },
  //       ],
  //     },
  //   ];
  // },
};

export default nextConfig;
