import { Card, Category } from '@/types';

let db: IDBDatabase | null = null;

export const openDB = async () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('abcAutismo', 3); // Incrementing version to force upgrade

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create or update stores
      if (!db.objectStoreNames.contains('categories')) {
        db.createObjectStore('categories', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('cards')) {
        db.createObjectStore('cards', { keyPath: 'id' });
      }

      // Create images store if it doesn't exist
      if (!db.objectStoreNames.contains('images')) {
        const imagesStore = db.createObjectStore('images', { keyPath: 'id' });
        imagesStore.createIndex('categoryId', 'categoryId', { unique: false });
      }
    };
  });
};

export const getDB = async (): Promise<IDBDatabase> => {
  if (db) return db;
  db = await openDB();
  return db;
};

export const addCategory = async (category: Omit<Category, 'id'>): Promise<Category> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction('categories', 'readwrite');
      const store = tx.objectStore('categories');

      // Generate a unique ID for the category
      const newCategory: Category = {
        ...category,
        id: `category-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      const request = store.add(newCategory);

      request.onsuccess = () => {
        resolve(newCategory);
      };

      request.onerror = () => {
        reject(new Error('Falha ao adicionar categoria ao banco de dados'));
      };
    } catch (error) {
      reject(error);
    }
  });
};

export const getCategories = async (): Promise<Category[]> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction('categories', 'readonly');
      const store = tx.objectStore('categories');
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error('Falha ao buscar categorias'));
      };
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteCategory = async (categoryId: string): Promise<void> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(['categories', 'cards', 'images'], 'readwrite');
      
      // Delete the category
      const categoryStore = tx.objectStore('categories');
      categoryStore.delete(categoryId);

      // Delete all cards in this category
      const cardsStore = tx.objectStore('cards');
      cardsStore.openCursor().onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          const card = cursor.value;
          if (card.categoryId === categoryId) {
            cardsStore.delete(cursor.key);
          }
          cursor.continue();
        }
      };

      // Delete all images in this category
      const imagesStore = tx.objectStore('images');
      const categoryIndex = imagesStore.index('categoryId');
      categoryIndex.openCursor(categoryId).onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          imagesStore.delete(cursor.primaryKey);
          cursor.continue();
        }
      };

      tx.oncomplete = () => {
        resolve();
      };

      tx.onerror = () => {
        reject(new Error('Falha ao excluir categoria'));
      };
    } catch (error) {
      reject(error);
    }
  });
};

export const addCard = async (card: Omit<Card, 'id'>): Promise<Card> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction('cards', 'readwrite');
      const store = tx.objectStore('cards');

      // Generate a unique ID for the card
      const newCard: Card = {
        ...card,
        id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      const request = store.add(newCard);

      request.onsuccess = () => {
        resolve(newCard);
      };

      request.onerror = () => {
        reject(new Error('Falha ao adicionar cartão'));
      };
    } catch (error) {
      reject(error);
    }
  });
};

export const getCards = async (): Promise<Card[]> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction('cards', 'readonly');
      const store = tx.objectStore('cards');
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error('Falha ao buscar cartões'));
      };
    } catch (error) {
      reject(error);
    }
  });
};