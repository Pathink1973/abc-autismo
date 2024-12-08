import { openDB } from 'idb';
import { PictureCard } from '../types';

const DB_NAME = 'abc-autismo-db';
const STORE_NAME = 'custom-cards';
const DB_VERSION = 1; // Reset to version 1

export const initDB = async () => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion) {
        // If the store exists, delete it to start fresh
        if (db.objectStoreNames.contains(STORE_NAME)) {
          db.deleteObjectStore(STORE_NAME);
        }

        // Create store with all required indexes
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('categoryId', 'categoryId', { unique: false });
        store.createIndex('order', 'order', { unique: false });
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
    console.error('Database initialization failed:', error);
    throw error;
  }
};

export const getAllCards = async (): Promise<PictureCard[]> => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const cards = await store.getAll();
    await tx.done;
    return cards;
  } catch (error) {
    console.error('Failed to get cards:', error);
    return [];
  }
};

export const addCard = async (card: Omit<PictureCard, 'id'>): Promise<PictureCard> => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    // Get all cards in the same category to determine the next order
    const categoryCards = await store.index('categoryId').getAll(card.categoryId);
    const maxOrder = Math.max(...categoryCards.map(c => c.order || 0), -1);

    // Create new card with generated ID and order
    const newCard: PictureCard = {
      ...card,
      id: crypto.randomUUID(),
      order: maxOrder + 1,
      createdAt: new Date().toISOString()
    };

    await store.add(newCard);
    await tx.done;
    return newCard;
  } catch (error) {
    console.error('Failed to add card:', error);
    throw error;
  }
};

export const updateCard = async (id: string, updates: Partial<PictureCard>): Promise<void> => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    const existingCard = await store.get(id);
    if (!existingCard) {
      throw new Error('Card not found');
    }

    const updatedCard = { ...existingCard, ...updates };
    await store.put(updatedCard);
    await tx.done;
  } catch (error) {
    console.error('Failed to update card:', error);
    throw error;
  }
};

export const deleteCard = async (id: string): Promise<void> => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    await store.delete(id);
    await tx.done;
  } catch (error) {
    console.error('Failed to delete card:', error);
    throw error;
  }
};

export const clearCards = async (): Promise<void> => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    await store.clear();
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