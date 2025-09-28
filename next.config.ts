import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "www.longhornsimracing.org" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // (optional) lock to your account path:
      // { protocol: "https", hostname: "res.cloudinary.com", pathname: "/YOUR_CLOUD_NAME/**" },
    ],
  },
}

export default nextConfig;
