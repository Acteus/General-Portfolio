import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  integrations: [react(), sitemap()],
  site: process.env.SITE_URL ?? 'http://localhost:4321',
  trailingSlash: 'never',
});
