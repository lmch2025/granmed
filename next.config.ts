import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* Domaines de préversion autorisés à charger les chunks HMR (évite les ChunkLoadError). */
  allowedDevOrigins: ["localhost", "127.0.0.1", "*.space-z.ai"],
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
