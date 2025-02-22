import { create } from 'zustand';
import { CommunicationStore, PictureCard } from '../types';

export const useStore = create<CommunicationStore>((set) => ({
  selectedCards: [],
  addCard: (card) =>
    set((state) => ({
      selectedCards: [...state.selectedCards, card],
    })),
  removeCard: (cardId) =>
    set((state) => ({
      selectedCards: state.selectedCards.filter((card) => card.id !== cardId),
    })),
  clearCards: () => set({ selectedCards: [] }),
}));