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
      const customCards = await db.getAllCards();
      
      // Sort custom cards by order within their categories
      const sortedCustomCards = [...customCards].sort((a, b) => {
        if (a.categoryId === b.categoryId) {
          return (a.order || 0) - (b.order || 0);
        }
        return a.categoryId.localeCompare(b.categoryId);
      });

      set({
        cards: [...systemCards, ...sortedCustomCards],
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
      const categoryCards = get().cards.filter(c => c.categoryId === card.categoryId);
      const maxOrder = Math.max(...categoryCards.map(c => c.order || 0), -1);

      const newCard: PictureCard = {
        ...card,
        id: crypto.randomUUID(),
        isSystem: false,
        order: maxOrder + 1,
        createdAt: new Date().toISOString()
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
      
      // Update order of remaining cards in the same category
      const state = get();
      const categoryCards = state.cards.filter(c => 
        c.categoryId === card?.categoryId && c.id !== cardId
      );
      
      for (let i = 0; i < categoryCards.length; i++) {
        const currentCard = categoryCards[i];
        if (!currentCard.isSystem && currentCard.order !== i) {
          const updatedCard = { ...currentCard, order: i };
          await db.updateCard(updatedCard);
        }
      }

      set((state) => ({
        cards: state.cards
          .filter(c => c.id !== cardId)
          .map(c => {
            if (c.categoryId === card?.categoryId && !c.isSystem) {
              const newOrder = categoryCards.findIndex(cc => cc.id === c.id);
              return { ...c, order: newOrder };
            }
            return c;
          }),
        error: null
      }));
    } catch (error) {
      console.error('Failed to delete card:', error);
      set({ error: 'Failed to delete card. Please try again.' });
    }
  },

  reorderCards: async (categoryId: string, startIndex: number, endIndex: number) => {
    try {
      const currentState = get();
      const newCards = [...currentState.cards];
      const categoryCards = newCards.filter(card => card.categoryId === categoryId);
      
      // Remove card from old position
      const [movedCard] = categoryCards.splice(startIndex, 1);
      // Insert card at new position
      categoryCards.splice(endIndex, 0, movedCard);
      
      // Update order for all cards in category
      const updatedCards = categoryCards.map((card, index) => ({
        ...card,
        order: index
      }));

      // Update IndexedDB for non-system cards
      for (const card of updatedCards) {
        if (!card.isSystem) {
          await db.updateCard(card);
        }
      }

      // Update the main cards array
      set({
        cards: newCards.map(card => {
          if (card.categoryId === categoryId) {
            return updatedCards.find(c => c.id === card.id) || card;
          }
          return card;
        }),
        error: null
      });
    } catch (error) {
      console.error('Failed to reorder cards:', error);
      set({ error: 'Failed to reorder cards. Please try again.' });
    }
  },

  clearCustomCards: async () => {
    try {
      await db.clearCards();
      
      set({
        cards: systemCards,
        error: null
      });
    } catch (error) {
      console.error('Failed to clear cards:', error);
      set({ error: 'Failed to clear custom cards. Please try again.' });
    }
  }
}));

// Initialize the store when the module loads
useCardManagementStore.getState().initialize();