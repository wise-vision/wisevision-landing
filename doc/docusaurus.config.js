// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'WiseVision Documentation',
  tagline: 'wisevision is cool :D',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://wisevision.tech',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/static/doc/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'wisevision', // Usually your GitHub org/user name.
  projectName: 'wisevision-doc', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    // Dashboard Documentation Plugin
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'Dashboard',
        path: 'Dashboard',
        routeBasePath: 'Dashboard',
        sidebarPath: require.resolve('./sidebarsDashboard.js'),
        // editUrl: 'https://github.com/your-github-username/your-repo-name/edit/main/',
      },
    ],
    // BlackBox Documentation Plugin
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'BlackBox',
        path: 'BlackBox',
        routeBasePath: 'BlackBox',
        sidebarPath: require.resolve('./sidebarsBlackBox.js'),
        // editUrl: 'https://github.com/your-github-username/your-repo-name/edit/main/',
      },
    ],
    // WiseVision Bridge Documentation Plugin
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'Bridge',
        path: 'Bridge',
        routeBasePath: 'Bridge',
        sidebarPath: require.resolve('./sidebarsBridge.js'),
        // editUrl: 'https://github.com/your-github-username/your-repo-name/edit/main/',
      },
    ],
    // WiseVision Develoment Board Documentation Plugin
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'DevBoard',
        path: 'DevBoard',
        routeBasePath: 'DevBoard',
        sidebarPath: require.resolve('./sidebarsDevBoard.js'),
      },
    ],
    // WiseVision Tools Documentation Plugin
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'Tools',
        path: 'Tools',
        routeBasePath: 'Tools',
        sidebarPath: require.resolve('./sidebarsTools.js'),
      },
    ],
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'WiseVision',
        logo: {
          alt: 'WiseVision Logo',
          src: 'img/logo.png',
          href: 'https://wisevision.tech',
          target: '_self',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'right',
            label: 'Documentation',
          },
          {to: '/Dashboard/intro', label: 'Dashboard', position: 'left'},
          {to: '/Bridge/intro', label: 'Bridge', position: 'left'},
          {to: '/BlackBox/intro', label: 'BlackBox', position: 'left'},
          {to: '/DevBoard/intro', label: 'DevBoard', position: 'left'},
          {to: '/Tools/intro', label: 'Tools', position: 'left'},
          {to: '/blog', label: 'Blog', position: 'right'},
          {
            href: 'https://github.com/wise-vision',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Docs',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Linkedin',
                href: 'https://www.linkedin.com/company/wisevision-pl/',
              },
              // {
              //   label: 'Discord',
              //   href: 'https://discordapp.com/invite/docusaurus',
              // },
              // {
              //   label: 'Twitter',
              //   href: 'https://twitter.com/docusaurus',
              // },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/wise-vision',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} wisevision sp. z o.o.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

module.exports = config;
