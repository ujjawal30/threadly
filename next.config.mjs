/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["mongoose", "@aws-sdk/client-s3"],
    serverActions: {
      bodySizeLimit: "2mb", // Set desired value here
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
      {
        protocol: "https",
        hostname: "icon-library.com",
      },
      {
        protocol: "https",
        hostname: process.env.AWS_S3_BUCKET_URL,
      },
    ],
  },
};

export default nextConfig;
