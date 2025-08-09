// /** @type {import('next').NextConfig} */
// const nextConfig = {async rewrites() {
//     return [
//       { source: "/api/backend/:path*", destination: "http://localhost:8000/api/:path*" }
//     ]
//   },};

// export default nextConfig;



/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // .map files ko ignore kare
    config.module.rules.push({
      test: /\.map$/,
      use: 'ignore-loader'
    });
    return config;
  }
};

export default nextConfig;