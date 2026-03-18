// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'http',
//         hostname: '127.0.0.1',
//         port: '8000',
//         pathname: '/images/**', 
//       },
//     ],
//   },
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'adminwatchshop.hoangphan.info.vn',
        pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig;
