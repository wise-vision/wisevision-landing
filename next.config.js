/* eslint-disable @typescript-eslint/no-var-requires */

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Enable the new export mode:
  output: 'export',
  /**
   * Custom Webpack Config
   * https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config
   */
  webpack(config, options) {
    const { dev, isServer } = options;

    // Do not run type checking twice:
    if (dev && isServer) {
      config.plugins.push(new ForkTsCheckerWebpackPlugin());
    }

    return config;
  },

  /**
   * Rewrites to redirect /static/doc to /static/doc/index.html
   * https://nextjs.org/docs/api-reference/next.config.js/rewrites
   */
  async rewrites() {
    return [
      {
        source: '/static/doc',
        destination: '/static/doc/index.html',
      },
      {
        source: '/static/doc/docs/intro',
        destination: '/static/doc/docs/intro/index.html',
      },
      { source: '/static/doc/blog', destination: '/static/doc/blog/index.html' },
      // {
      //   source: '/docs/:slug*',        // Match any subpath after /docs/ and rewrite it to /static/doc/:slug* but does not work
      //   destination: '/static/doc/:slug*',
      // },
    ];
  },
};

module.exports = nextConfig;
