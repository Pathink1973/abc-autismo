import { create } from 'zustand';
import { CardManagementStore, PictureCard } from '../types';
import * as db from '../utils/db';
import { loadPublicImages } from '../utils/publicImageLoader';

export const useCardManagementStore = create<CardManagementStore>()((set, get) => ({
  cards: [],
  isLoading: true,
  error: null,

  initialize: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Load public images first
      let publicImages: PictureCard[] = [];
      try {
        publicImages = await loadPublicImages();
        console.log('Loaded public images:', publicImages.length);
        
        // Set initial state with public images
        set({
          cards: publicImages,
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error('Failed to load public images:', error);
        set({
          cards: [],
          isLoading: false,
          error: 'Failed to load images'
        });
      }

      // Then load custom cards
      try {
        const customCards = await db.getAllCards();
        console.log('Loaded custom cards:', customCards.length);
        
        if (customCards.length > 0) {
          // Sort custom cards by order within their categories
          const sortedCustomCards = customCards.sort((a, b) => {
            if (a.categoryId === b.categoryId) {
              return (a.order || 0) - (b.order || 0);
            }
            return a.categoryId.localeCompare(b.categoryId);
          });

          // Add custom cards to existing public images
          set(state => ({
            cards: [...state.cards, ...sortedCustomCards]
          }));
        }
      } catch (error) {
        console.error('Failed to load custom cards:', error);
      }

    } catch (error) {
      console.error('Store initialization failed:', error);
      set({
        isLoading: false,
        error: 'Failed to initialize the card store'
      });
    }
  },

  addCustomCard: async (card) => {
    try {
      const newCard = await db.addCard(card);
      set(state => ({
        cards: [...state.cards, newCard]
      }));
    } catch (error) {
      console.error('Failed to add custom card:', error);
      throw error;
    }
  },

  deleteCard: async (cardId) => {
    try {
      await db.deleteCard(cardId);
      set(state => ({
        cards: state.cards.filter(card => card.id !== cardId)
      }));
    } catch (error) {
      console.error('Failed to delete card:', error);
      throw error;
    }
  },

  reorderCards: async (sourceCategory, targetCategory, sourceIndex, targetIndex) => {
    const state = get();
    
    // Get cards for both source and target categories
    const sourceCards = state.cards
      .filter(card => card.categoryId === sourceCategory)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    
    const targetCards = sourceCategory === targetCategory
      ? sourceCards
      : state.cards
          .filter(card => card.categoryId === targetCategory)
          .sort((a, b) => (a.order || 0) - (b.order || 0));

    // Remove card from source category
    const [movedCard] = sourceCards.splice(sourceIndex, 1);
    
    // Update moved card's category if moving between categories
    const updatedMovedCard = {
      ...movedCard,
      categoryId: targetCategory
    };

    // Insert card at new position
    targetCards.splice(targetIndex, 0, updatedMovedCard);

    try {
      // Update orders in both categories
      const updatePromises: Promise<void>[] = [];

      // Update source category orders
      sourceCards.forEach((card, index) => {
        if (!card.isSystem) {
          updatePromises.push(
            db.updateCard(card.id, { order: index })
          );
        }
      });

      // Update target category orders
      if (sourceCategory !== targetCategory) {
        targetCards.forEach((card, index) => {
          if (!card.isSystem) {
            updatePromises.push(
              db.updateCard(card.id, { 
                order: index,
                categoryId: targetCategory 
              })
            );
          }
        });
      }

      // Wait for all updates to complete
      await Promise.all(updatePromises);

      // Update state
      set(state => ({
        cards: state.cards.map(card => {
          // Card that was moved
          if (card.id === movedCard.id) {
            return {
              ...card,
              categoryId: targetCategory,
              order: targetIndex
            };
          }
          // Cards in source category
          if (card.categoryId === sourceCategory) {
            const newIndex = sourceCards.findIndex(c => c.id === card.id);
            return newIndex !== -1 ? { ...card, order: newIndex } : card;
          }
          // Cards in target category
          if (card.categoryId === targetCategory) {
            const newIndex = targetCards.findIndex(c => c.id === card.id);
            return newIndex !== -1 ? { ...card, order: newIndex } : card;
          }
          return card;
        })
      }));
    } catch (error) {
      console.error('Failed to reorder cards:', error);
      throw error;
    }
  },

  clearCustomCards: async () => {
    try {
      await db.clearCards();
      set(state => ({
        cards: state.cards.filter(card => card.isSystem)
      }));
    } catch (error) {
      console.error('Failed to clear custom cards:', error);
      throw error;
    }
  }
}));

// Initialize the store when the module loads
useCardManagementStore.getState().initialize();