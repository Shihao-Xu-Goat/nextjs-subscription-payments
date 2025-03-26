/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // i18n configuration removed as it's not compatible with App Router
  // Internationalization is now handled through middleware.ts and app/[locale] directory
  // Disabled standalone output due to Windows symlink permission issues
  // output: 'standalone',
  // Ensure public directory files are included in the build
  outputFileTracing: true,
  // Explicitly include public directory and its subdirectories (including locales)
  experimental: {
    outputFileTracingIncludes: {
      '**': ['./public/**/*']
    }
  }
};

module.exports = nextConfig;