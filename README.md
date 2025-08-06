# Example Template

This is a Next.js template project that includes a complete GraphQL setup with Auth0 authentication, MongoDB integration, and modern development tooling.

## Features

- **Next.js 15** with App Router
- **GraphQL** API with GraphQL Yoga
- **Authentication** with Auth0
- **Database** with MongoDB integration
- **TypeScript** with strict configuration
- **ESLint & Prettier** for code quality
- **Tailwind CSS** with DaisyUI components
- **PWA** support with next-pwa
- **SEO** optimization with next-seo
- **Dependency Injection** with Inversify

## Getting Started

1. Clone this repository:

```bash
git clone <your-repo-url>
cd example
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.local.example .env.local
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/pages` - Next.js pages and API routes
- `/src/components` - React components
- `/src/context` - React context providers
- `/data/graphql` - GraphQL schema and resolvers
- `/repositories` - Data access layer
- `/types` - TypeScript type definitions
- `/lib` - Utility functions and configurations

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prettier` - Format code with Prettier
- `npm run codegen` - Generate GraphQL types
- `npm run tsc` - Run TypeScript compiler

## Deployment

This template is optimized for deployment on Vercel. You can also deploy to other platforms that support Next.js.

## Customization

1. Update the project name and description in `package.json`
2. Configure your Auth0 settings in environment variables
3. Set up your MongoDB connection
4. Customize the GraphQL schema in `/data/graphql`
5. Update SEO configuration in `next-seo.config.js`
6. Modify styling and components as needed
