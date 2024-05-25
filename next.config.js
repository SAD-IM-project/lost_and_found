/** @type {import('next').NextConfig} */
const nextConfig = { images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'okrjiftennxipohnrbbw.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/images/**',
      },
    ],
    domains: ['okrjiftennxipohnrbbw.supabase.co'],
  },};

module.exports = nextConfig;
