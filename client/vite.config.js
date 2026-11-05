import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import prerenderStatic from 'vite-plugin-prerender-static';

const staticRoutes = [
  {
    path: '/',
    tags: {
      title: 'HDM Technologies — Building Digital Solutions for Africa',
      description:
        'Web apps, mobile apps, AI solutions, and SmartGen document generation. HDM Technologies builds digital products for African businesses.',
    },
  },
  {
    path: '/services',
    tags: {
      title: 'Services — HDM Technologies',
      description:
        'Web development, mobile apps, AI solutions, and document automation from HDM Technologies.',
    },
  },
  {
    path: '/apps',
    tags: {
      title: 'Apps — HDM Technologies',
      description: 'Explore the apps built by HDM Technologies, including SmartGen and FarmVexa.',
    },
  },
  {
    path: '/apps/smartgen',
    tags: {
      title: 'SmartGen — HDM Technologies',
      description: 'SmartGen is an AI document generation app built by HDM Technologies.',
    },
  },
  {
    path: '/apps/farmvexa',
    tags: {
      title: 'FarmVexa — HDM Technologies',
      description: 'FarmVexa is an AI-powered farm intelligence app built by HDM Technologies.',
    },
  },
  {
    path: '/projects',
    tags: {
      title: 'Projects — HDM Technologies',
      description: 'Selected projects and case studies from HDM Technologies.',
    },
  },
  {
    path: '/gallery',
    tags: {
      title: 'Gallery — HDM Technologies',
      description: 'A visual gallery of products, designs, and work from HDM Technologies.',
    },
  },
  {
    path: '/contact',
    tags: {
      title: 'Contact HDM Technologies',
      description: 'Get in touch with HDM Technologies about your next web, mobile, or AI project.',
    },
  },
  {
    path: '/smartgen',
    tags: {
      title: 'SmartGen — AI Document Generation by HDM Technologies',
      description:
        'SmartGen generates professional documents in seconds using AI. Built by HDM Technologies.',
    },
  },
  {
    path: '/smartgen/templates',
    tags: {
      title: 'SmartGen Templates',
      description: 'Browse AI-powered document templates on SmartGen.',
    },
  },
  {
    path: '/smartgen/login',
    tags: {
      title: 'Login — SmartGen',
      description: 'Sign in to your SmartGen account.',
    },
  },
  {
    path: '/smartgen/register',
    tags: {
      title: 'Register — SmartGen',
      description: 'Create your SmartGen account.',
    },
  },
];

export default defineConfig({
  plugins: [
    react(),
    prerenderStatic({
      routes: staticRoutes,
      render: () => '<div id="root"></div>',
    }),
  ],
  server: {
    port: 3000,
    proxy: {
      '/hdm/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/smartgen/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});