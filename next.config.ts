import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "www.longhornsimracing.org" },
      // (optional) lock to your account path:
      // { protocol: "https", hostname: "res.cloudinary.com", pathname: "/YOUR_CLOUD_NAME/**" },
    ],
  },
}

export default nextConfig;
