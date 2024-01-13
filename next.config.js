/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {hostname: "images.unsplash.com"},
            {hostname: "plus.unsplash.com"},
            {hostname: "lh3.googleusercontent.com"}
    ] //allows importing images from third-party websites
    },
    // experimental: {
    //     serverActions: true //server actuions are still in alpha
    // }
}

module.exports = nextConfig
