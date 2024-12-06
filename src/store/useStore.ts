import { create } from 'zustand';
import { PictureCard } from '../types';

interface CommunicationStore {
  selectedCards: PictureCard[];
  addCard: (card: PictureCard) => void;
  removeCard: (cardId: string) => void;
  clearCards: () => void;
}

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