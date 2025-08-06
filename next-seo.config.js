const title = 'Example Template';
const description =
  'A Next.js template with GraphQL, Auth0 authentication, MongoDB integration, and modern development tooling.';

module.exports = {
  title,
  description,
  canonical: 'https://example.com/',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://example.com/',
    site_name: 'Example Template',
    title,
    description,
    images: [
      {
        url: 'https://example.com/images/share.png',
        width: 1200,
        height: 630,
        alt: 'Example Template – Next.js starter with GraphQL and Auth0',
      },
    ],
  },
  twitter: {
    handle: '@yourtwitter',
    site: '@yourtwitter',
    cardType: 'summary_large_image',
    title,
    description,
    image: 'https://example.com/images/share.png',
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content:
        'Next.js, GraphQL, Auth0, MongoDB, TypeScript, template, starter, React',
    },
  ],
};
