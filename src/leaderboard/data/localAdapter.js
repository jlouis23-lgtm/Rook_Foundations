// Phase 2 storage: everything lives in this browser's localStorage, on this
// device only. It is prototype storage — not a secure or backed-up database.
//
// The adapter exposes a small table-style interface (list / insert / update)
// so a Supabase adapter with the same methods can replace it later. Nothing
// outside this file touches localStorage.

const STORAGE_KEY = 'rf.leaderboard.v1';
const CHANNEL_NAME = 'rf.leaderboard';
const SCHEMA_VERSION = 1;

export const COLLECTIONS = ['players', 'groups', 'sessions', 'sessionPlayers', 'results', 'transactions'];
// Collections every backup file must contain; newer ones may be absent in
// backups saved by an earlier version.
const REQUIRED_IN_BACKUP = ['players', 'sessions', 'sessionPlayers', 'results', 'transactions'];

function emptyState() {
  const state = { schemaVersion: SCHEMA_VERSION };
  for (const name of COLLECTIONS) state[name] = [];
  return state;
}

function normalise(raw) {
  const state = emptyState();
  if (!raw || typeof raw !== 'object') return state;
  for (const name of COLLECTIONS) {
    if (Array.isArray(raw[name])) state[name] = raw[name];
  }
  return state;
}

function matches(row, where) {
  return Object.entries(where).every(([key, value]) => row[key] === value);
}

export function createLocalAdapter(storage = globalThis.localStorage) {
  const listeners = new Set();
  // Used only if the browser refuses storage (private mode, blocked data).
  let memory = null;
  let persistent = true;

  const channel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel(CHANNEL_NAME);
  const notify = () => listeners.forEach((listener) => listener());
  if (channel) channel.onmessage = notify;
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
      if (event.key === STORAGE_KEY) notify();
    });
  }

  function read() {
    if (memory) return memory;
    try {
      const text = storage.getItem(STORAGE_KEY);
      return normalise(text ? JSON.parse(text) : null);
    } catch {
      persistent = false;
      memory = emptyState();
      return memory;
    }
  }

  function write(state) {
    try {
      if (!memory) storage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      persistent = false;
      memory = state;
    }
    if (memory) memory = state;
    notify();
    channel?.postMessage('changed');
  }

  return {
    kind: 'local',
    isPersistent: () => {
      read();
      return persistent;
    },

    async list(collection, where = {}) {
      return read()[collection].filter((row) => matches(row, where));
    },

    async insert(collection, rows) {
      const state = read();
      write({ ...state, [collection]: [...state[collection], ...rows] });
      return rows;
    },

    async update(collection, id, patch) {
      const state = read();
      let updated = null;
      const next = state[collection].map((row) => {
        if (row.id !== id) return row;
        updated = { ...row, ...patch };
        return updated;
      });
      if (!updated) throw new Error(`No ${collection} record with id ${id}`);
      write({ ...state, [collection]: next });
      return updated;
    },

    async exportAll() {
      return { exportedAt: new Date().toISOString(), ...read() };
    },

    async importAll(data) {
      if (!data || !REQUIRED_IN_BACKUP.every((name) => Array.isArray(data[name]))) {
        throw new Error('This file is not a Rook Foundations leaderboard backup.');
      }
      write(normalise(data));
    },

    // Removes every leaderboard record from this device.
    async clearAll() {
      write(emptyState());
    },

    // Fires when data changes in this window or another window on this device.
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}
