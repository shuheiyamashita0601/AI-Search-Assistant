/** @type {import('next').NextConfig} */
const nextConfig = {
  // React 19の実験的機能を有効にする
  experimental: {
    // React 19の新機能を有効化
    reactCompiler: false,
  },
  
  // TypeScript設定
  typescript: {
    // 本番ビルド時もTypeScriptエラーを無視しない
    ignoreBuildErrors: false,
  },

  // ESLint設定
  eslint: {
    // 本番ビルド時もESLintエラーを無視しない
    ignoreDuringBuilds: false,
  },

  // 出力設定
  output: 'standalone',

  // パワードバイヘッダーを削除（セキュリティ向上）
  poweredByHeader: false,

  // gzip圧縮を有効化
  compress: true,

  // 画像最適化設定
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // セキュリティヘッダー
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
    ];
  },

  // 環境変数設定
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // APIルートの設定
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:3001/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
