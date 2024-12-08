import { openDB } from 'idb';
import { PictureCard } from '../types';

const DB_NAME = 'abc-autismo-db';
const STORE_NAME = 'custom-cards';
const DB_VERSION = 2; // Increased version number to match existing DB

export const initDB = async () => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion) {
        // Handle different database versions
        if (oldVersion < 1) {
          // Create initial store
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('categoryId', 'categoryId', { unique: false });
          store.createIndex('order', 'order', { unique: false });
        }
        
        if (oldVersion < 2) {
          // Add new indexes or modify structure for version 2
          const store = db.objectStoreNames.contains(STORE_NAME)
            ? db.transaction(STORE_NAME).objectStore(STORE_NAME)
            : db.createObjectStore(STORE_NAME, { keyPath: 'id' });

          if (!store.indexNames.contains('order')) {
            store.createIndex('order', 'order', { unique: false });
          }
          if (!store.indexNames.contains('categoryId')) {
            store.createIndex('categoryId', 'categoryId', { unique: false });
          }
        }
      },
      blocked() {
        console.warn('Database upgrade blocked. Please close other tabs.');
      },
      blocking() {
        console.warn('Database blocking other connections. Please reload.');
      },
      terminated() {
        console.error('Database connection terminated unexpectedly.');
      },
    });

    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

export const getAllCards = async (): Promise<PictureCard[]> => {
  try {
    const db = await initDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const cards = await store.getAll();
    return cards;
  } catch (error) {
    console.error('Failed to get cards:', error);
    return [];
  }
};

export const addCard = async (card: PictureCard): Promise<void> => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    await tx.store.add(card);
    await tx.done;
  } catch (error) {
    console.error('Failed to add card:', error);
    throw error;
  }
};

export const updateCard = async (card: PictureCard): Promise<void> => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    await tx.store.put(card);
    await tx.done;
  } catch (error) {
    console.error('Failed to update card:', error);
    throw error;
  }
};

export const deleteCard = async (id: string): Promise<void> => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    await tx.store.delete(id);
    await tx.done;
  } catch (error) {
    console.error('Failed to delete card:', error);
    throw error;
  }
};

export const clearCards = async (): Promise<void> => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    await tx.store.clear();
    await tx.done;
  } catch (error) {
    console.error('Failed to clear cards:', error);
    throw error;
  }
};

// Initialize database when module loads
initDB().catch(error => {
  console.error('Failed to initialize database:', error);
});