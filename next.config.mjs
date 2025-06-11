/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // ✅ Static export for GitHub Pages

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // ✅ Important for static export
  },

  // Optional: If you use base paths or assetPrefix, for username page, you can keep them as ''
  basePath: '',
  assetPrefix: '',
};

export default nextConfig;
