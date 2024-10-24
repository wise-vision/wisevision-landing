/* eslint-disable @typescript-eslint/no-var-requires */

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
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
    ];
  },
};

// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

// module.exports = {
//   /**
//    * Custom Webpack Config
//    * https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config
//    */
//   webpack(config, options) {
//     const { dev, isServer } = options;

//     // Do not run type checking twice:
//     if (dev && isServer) {
//       config.plugins.push(new ForkTsCheckerWebpackPlugin());
//     }

//     return config;
//   },

//   /**
//    * Rewrites to redirect /docs to /static/doc and handle documentation routing cleanly
//    * https://nextjs.org/docs/api-reference/next.config.js/rewrites
//    */
//   async rewrites() {
//     return [
//       // Rewrite /docs to /static/doc/index.html to load the main documentation page
//       {
//         source: '/docs',
//         destination: '/static/doc/index.html',
//       },
//       // Rewrite /docs/:slug* to serve all other documentation pages
//       {
//         source: '/docs/:slug*',
//         destination: '/static/doc/:slug*',
//       },
//     ];
//   },
// };
