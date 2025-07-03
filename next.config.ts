import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Permite build mesmo com alguns avisos do ESLint
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Permite build mesmo com alguns erros de TypeScript em desenvolvimento
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
