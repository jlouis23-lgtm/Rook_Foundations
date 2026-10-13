import { defineConfig } from 'vitest/config'

// Database tests for the school clubs booking migrations (supabase/migrations).
// Kept apart from vitest.config.js so `npm test` stays fast and unchanged; run
// these with `npm run test:db`. Each test file starts its own in-memory
// PostgreSQL (PGlite) and applies every migration to it. Nothing connects to
// Supabase or any other external service.
//
// The PostgreSQL version is chosen with BOOKING_TEST_PG (16, 17 or 18; the
// default is 17, the version new Supabase projects use). `npm run test:db:all`
// runs the whole suite on all three. There is no local engine for
// PostgreSQL 15.
export default defineConfig({
  test: {
    include: ['supabase/tests/**/*.test.js'],
    environment: 'node',
    testTimeout: 60000,
    hookTimeout: 120000
  }
})
