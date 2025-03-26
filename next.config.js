/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Ensure static files in public directory are properly included
  // This is especially important for the locales directory
  experimental: {
    // Enable static export for public directory files
    outputFileTracingIncludes: {
      '/**': ['./public/**/*']
    }
  },
  // Configure i18n to match our supported locales
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'en'
  }
};

module.exports = nextConfig;