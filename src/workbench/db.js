import { openDB } from 'https://esm.run/idb';

const VERSION = 1;

export const dbReady = openDB('orbit-kit', VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('tasks')) {
      const store = db.createObjectStore('tasks', { keyPath: 'id' });
      store.createIndex('done', 'done');
      store.createIndex('createdAt', 'createdAt');
    }
    if (!db.objectStoreNames.contains('notes')) {
      db.createObjectStore('notes', { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains('habits')) {
      db.createObjectStore('habits', { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains('boards')) {
      db.createObjectStore('boards', { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains('settings')) {
      db.createObjectStore('settings', { keyPath: 'key' });
    }
  }
});

async function withStore(name, mode, fn) {
  const db = await dbReady;
  const tx = db.transaction(name, mode);
  const store = tx.objectStore(name);
  const result = await fn(store);
  await tx.done;
  return result;
}

export const db = {
  tasks: {
    async getAll() { return withStore('tasks', 'readonly', s => s.getAll()); },
    async get(id) { return withStore('tasks', 'readonly', s => s.get(id)); },
    async put(task) { return withStore('tasks', 'readwrite', s => s.put(task)); },
    async delete(id) { return withStore('tasks', 'readwrite', s => s.delete(id)); }
  },
  notes: {
    async getAll() { return withStore('notes', 'readonly', s => s.getAll()); },
    async get(id) { return withStore('notes', 'readonly', s => s.get(id)); },
    async put(note) { return withStore('notes', 'readwrite', s => s.put(note)); },
    async delete(id) { return withStore('notes', 'readwrite', s => s.delete(id)); }
  },
  habits: {
    async getAll() { return withStore('habits', 'readonly', s => s.getAll()); },
    async get(id) { return withStore('habits', 'readonly', s => s.get(id)); },
    async put(habit) { return withStore('habits', 'readwrite', s => s.put(habit)); },
    async delete(id) { return withStore('habits', 'readwrite', s => s.delete(id)); }
  },
  boards: {
    async getAll() { return withStore('boards', 'readonly', s => s.getAll()); },
    async get(id) { return withStore('boards', 'readonly', s => s.get(id)); },
    async put(card) { return withStore('boards', 'readwrite', s => s.put(card)); },
    async delete(id) { return withStore('boards', 'readwrite', s => s.delete(id)); }
  },
  settings: {
    async get(key) { return withStore('settings', 'readonly', s => s.get(key)); },
    async put(key, value) { return withStore('settings', 'readwrite', s => s.put({ key, value })); }
  }
};

