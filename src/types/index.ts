export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface PictureCard {
  id: string;
  categoryId: string;
  imageUrl: string;
  label: string;
  isSystem?: boolean; // New field to identify system cards
}

export interface CardManagementStore {
  cards: PictureCard[];
  addCustomCard: (card: Omit<PictureCard, 'id'>) => void;
  deleteCard: (cardId: string) => void;
}