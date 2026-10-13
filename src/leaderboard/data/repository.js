import { createLocalAdapter } from './localAdapter';

// The one place that decides where leaderboard data lives. Phase 2 uses the
// local adapter; Phase 6 swaps in a Supabase adapter exposing the same
// methods: list, insert, update, exportAll, importAll, clearAll, subscribe.

let adapter = null;

export function getAdapter() {
  if (!adapter) adapter = createLocalAdapter();
  return adapter;
}
