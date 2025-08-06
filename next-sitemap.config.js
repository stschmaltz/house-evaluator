/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://TODO.com',
  trailingSlash: true,
  changefreq: 'weekly',
  priority: 0.7,
  autoLastmod: true,
  sitemapSize: 7000,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
};
