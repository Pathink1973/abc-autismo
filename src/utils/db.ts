import { openDB, IDBPDatabase } from 'idb';
import { PictureCard } from '../types';

const DB_NAME = 'abc-autismo-db';
const STORE_NAME = 'custom-cards';
const DB_VERSION = 2; // Increment version to force upgrade

let dbPromise: Promise<IDBPDatabase> | null = null;

export const initDB = async () => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        // Delete old store if exists
        if (db.objectStoreNames.contains(STORE_NAME)) {
          db.deleteObjectStore(STORE_NAME);
        }
        // Create new store
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      },
      blocked() {
        console.warn('Database upgrade blocked. Please close other tabs/windows.');
      },
      blocking() {
        console.warn('Database blocking other connections. Please reload.');
      },
      terminated() {
        console.error('Database connection terminated unexpectedly.');
        dbPromise = null;
      },
    });
  }
  return dbPromise;
};

export const getAllCards = async (): Promise<PictureCard[]> => {
  try {
    const db = await initDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const cards = await store.getAll();
    await transaction.done;
    return cards;
  } catch (error) {
    console.error('Failed to get cards:', error);
    return []; // Return empty array instead of throwing
  }
};

export const addCard = async (card: PictureCard): Promise<void> => {
  try {
    const db = await initDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    await store.add(card);
    await transaction.done;
  } catch (error) {
    console.error('Failed to add card:', error);
    throw error;
  }
};

export const deleteCard = async (id: string): Promise<void> => {
  try {
    const db = await initDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    await store.delete(id);
    await transaction.done;
  } catch (error) {
    console.error('Failed to delete card:', error);
    throw error;
  }
};

export const clearCards = async (): Promise<void> => {
  try {
    const db = await initDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    await store.clear();
    await transaction.done;
  } catch (error) {
    console.error('Failed to clear cards:', error);
    throw error;
  }
};

// Initialize database on module load
initDB().catch(error => {
  console.error('Failed to initialize database:', error);
});