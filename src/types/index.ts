export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isSystem: boolean;
  isTemporary?: boolean;
  group?: string; // Add group field to categorize similar categories together
}

export interface PictureCard {
  id: string;
  categoryId: string;
  imageUrl: string;
  label: string;
  voiceLabel?: string;
  isSystem?: boolean;
  order?: number;
  createdAt?: string;
}

export interface CardManagementStore {
  cards: PictureCard[];
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  addCustomCard: (card: Omit<PictureCard, 'id' | 'isSystem'>) => Promise<void>;
  deleteCard: (cardId: string) => Promise<void>;
  reorderCards: (categoryId: string, startIndex: number, endIndex: number) => Promise<void>;
  clearCustomCards: () => Promise<void>;
}

export interface CommunicationStore {
  selectedCards: PictureCard[];
  addCard: (card: PictureCard) => void;
  removeCard: (cardId: string) => void;
  clearCards: () => void;
}