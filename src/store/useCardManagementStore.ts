import { create } from 'zustand';
import { CardManagementStore, PictureCard } from '../types';
import { systemCards } from '../data/systemCards';
import * as db from '../utils/db';

export const useCardManagementStore = create<CardManagementStore>()((set, get) => ({
  cards: systemCards,
  isLoading: true,
  error: null,

  initialize: async () => {
    try {
      set({ isLoading: true, error: null });
      await db.initDB(); // Ensure DB is initialized first
      const customCards = await db.getAllCards();
      
      set({
        cards: [...systemCards, ...customCards],
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Failed to initialize store:', error);
      set({ 
        cards: systemCards,
        isLoading: false,
        error: 'Failed to load custom cards. Please refresh the page.'
      });
    }
  },

  addCustomCard: async (card) => {
    try {
      const newCard: PictureCard = {
        ...card,
        id: crypto.randomUUID(),
        isSystem: false
      };

      await db.addCard(newCard);
      
      set((state) => ({
        cards: [...state.cards, newCard],
        error: null
      }));
    } catch (error) {
      console.error('Failed to add card:', error);
      set({ error: 'Failed to add custom card. Please try again.' });
      throw error;
    }
  },

  deleteCard: async (cardId) => {
    const card = get().cards.find(c => c.id === cardId);
    
    if (card?.isSystem) {
      set({ error: 'System cards cannot be deleted' });
      return;
    }

    try {
      await db.deleteCard(cardId);
      
      set((state) => ({
        cards: state.cards.filter(card => card.id !== cardId),
        error: null
      }));
    } catch (error) {
      console.error('Failed to delete card:', error);
      set({ error: 'Failed to delete card. Please try again.' });
    }
  }
}));

// Initialize the store when the module loads
useCardManagementStore.getState().initialize();