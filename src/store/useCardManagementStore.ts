import { create } from 'zustand';
import * as db from '@/utils/db';
import { Card, Category } from '@/types';
import { categories as defaultCategories } from '@/data/categories';
import { loadPublicImages } from '@/utils/publicImageLoader';

// Mark default categories as system categories
const systemCategories = defaultCategories.map(category => ({
  ...category,
  isSystem: true
}));

interface CardManagementState {
  cards: Card[];
  categories: Category[];
  temporaryCategory: Category | null;
  isLoading: boolean;
  error: string | null;
}

interface CardManagementActions {
  setTemporaryCategory: (category: Category | null) => void;
  addCustomCard: (card: Omit<Card, 'id'>) => Promise<Card>;
  addCustomCards: (cards: Omit<Card, 'id'>[]) => Promise<Card[]>;
  addCustomCategory: (category: Omit<Category, 'id'>) => Promise<Category>;
  deleteCategory: (categoryId: string) => Promise<void>;
  initialize: () => Promise<void>;
}

type CardManagementStore = CardManagementState & CardManagementActions;

export const useCardManagementStore = create<CardManagementStore>((set, get) => ({
  cards: [],
  categories: [...systemCategories],
  temporaryCategory: null,
  isLoading: true,
  error: null,

  setTemporaryCategory: (category) => {
    set({ temporaryCategory: category });
  },

  initialize: async () => {
    try {
      set({ isLoading: true, error: null });

      // Load public images first
      const publicImages = await loadPublicImages();
      console.log('Loaded public images:', publicImages.length);

      // Load custom data from IndexedDB
      const [dbCategories, dbCards] = await Promise.all([
        db.getCategories(),
        db.getCards(),
      ]);

      set({
        categories: [...systemCategories, ...dbCategories],
        cards: [...publicImages, ...dbCards], // Combine public and custom cards
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to initialize store:', error);
      set({ 
        error: 'Falha ao carregar dados. Por favor, recarregue a página.',
        isLoading: false 
      });
    }
  },

  addCustomCard: async (card) => {
    try {
      const newCard = await db.addCard(card);
      set(state => ({
        cards: [...state.cards, newCard]
      }));
      return newCard;
    } catch (error) {
      console.error('Failed to add custom card:', error);
      throw new Error('Falha ao adicionar cartão');
    }
  },

  addCustomCards: async (cards) => {
    try {
      const newCards = await Promise.all(cards.map(card => db.addCard(card)));
      set(state => ({
        cards: [...state.cards, ...newCards]
      }));
      return newCards;
    } catch (error) {
      console.error('Failed to add custom cards:', error);
      throw new Error('Falha ao adicionar cartões');
    }
  },

  addCustomCategory: async (category) => {
    try {
      // Create the category directory in public/images if it doesn't exist
      const categoryId = category.name.toLowerCase().replace(/\s+/g, '-');
      const newCategory = await db.addCategory({
        ...category,
        id: categoryId, // Use the name as the ID for consistency
        isSystem: false
      });

      set(state => ({
        categories: [...state.categories, newCategory],
        temporaryCategory: null // Clear temporary category after successful creation
      }));

      // Reload public images to include the new category
      const publicImages = await loadPublicImages();
      set(state => ({
        cards: [...publicImages, ...state.cards.filter(card => !card.isSystem)]
      }));

      return newCategory;
    } catch (error) {
      console.error('Failed to add custom category:', error);
      throw new Error('Falha ao adicionar categoria');
    }
  },

  deleteCategory: async (categoryId: string) => {
    const { categories } = get();
    const categoryToDelete = categories.find(c => c.id === categoryId);

    if (!categoryToDelete) {
      throw new Error('Categoria não encontrada');
    }

    if (categoryToDelete.isSystem) {
      throw new Error('Não é possível excluir categorias do sistema');
    }

    try {
      await db.deleteCategory(categoryId);

      set(state => ({
        categories: state.categories.filter(c => c.id !== categoryId),
        cards: state.cards.filter(c => c.categoryId !== categoryId)
      }));
    } catch (error) {
      console.error('Failed to delete category:', error);
      throw new Error('Falha ao excluir categoria');
    }
  }
}));

// Initialize the store when the module loads
useCardManagementStore.getState().initialize();