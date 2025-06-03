import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // 图片优化配置
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1年缓存
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: [], // 如果需要外部图片域名，在这里添加
    remotePatterns: [
      // 示例：允许特定域名的图片
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      //   port: '',
      //   pathname: '/images/**',
      // },
    ],
  },

  // 性能优化配置
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@/components', '@/lib', '@/stores'],
  },

  // 编译优化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Webpack配置优化
  webpack: (config, { dev, isServer }) => {
    // 生产环境优化
    if (!dev && !isServer) {
      // 代码分割优化
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
          },
          styles: {
            name: 'styles',
            test: /\.(css|scss|sass)$/,
            chunks: 'all',
            enforce: true,
            priority: 20,
          },
        },
      }

      // 压缩优化
      config.optimization.minimize = true
    }

    // 开发环境优化
    if (dev) {
      config.devtool = 'eval-source-map'
    }

    return config
  },

  // 压缩配置
  compress: true,

  // 静态文件优化
  assetPrefix: process.env.NODE_ENV === 'production' ? process.env.CDN_URL : '',

  // 输出配置
  output: 'standalone',

  // 环境变量
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // 重定向配置
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true, // 301重定向
      },
    ]
  },

  // Headers配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
};

export default nextConfig;