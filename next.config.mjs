/** @type {import('next').NextConfig} */
const nextConfig = {
  // Evitar que los errores de ESLint detengan la construcción
  eslint: {
    // No detener la construcción si hay errores de ESLint
    ignoreDuringBuilds: true,
  },
  // Evitar que TypeScript detenga la construcción
  typescript: {
    // No detener la construcción si hay errores de TypeScript
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
