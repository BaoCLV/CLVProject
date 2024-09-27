/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,  // Enable React Strict Mode
    swcMinify: true,        
    experimental: {       
      middleware: true,     // Ensure middleware is enabled (optional, as it's usually enabled by default)
    },
  };
  
  export default nextConfig;
  