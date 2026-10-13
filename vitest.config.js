import { defineConfig } from 'vitest/config'

// Kept separate from vite.config.js so tests don't load the site's build plugins.
export default defineConfig({
  test: {
    include: ['src/**/*.test.js'],
    environment: 'node'
  }
})
