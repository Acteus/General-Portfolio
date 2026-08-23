import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  integrations: [react()],
  site: process.env.SITE_URL ?? 'http://localhost:4321',
  trailingSlash: 'never',
});
