import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CardManagementStore, PictureCard } from '../types';
import { pictureCards as defaultCards } from '../data/pictureCards';

export const useCardManagementStore = create<CardManagementStore>()(
  persist(
    (set) => ({
      cards: defaultCards,
      addCustomCard: (card) =>
        set((state) => ({
          cards: [...state.cards, { ...card, id: crypto.randomUUID(), isSystem: false }],
        })),
      deleteCard: (cardId) =>
        set((state) => ({
          cards: state.cards.filter((card) => !card.isSystem && card.id !== cardId),
        })),
    }),
    {
      name: 'card-management-storage',
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        ...persistedState,
        // Ensure system cards are always present
        cards: [
          ...defaultCards,
          ...(persistedState.cards || []).filter(
            (card: PictureCard) => !card.isSystem
          ),
        ],
      }),
    }
  )
);