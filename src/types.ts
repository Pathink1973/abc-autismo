export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isSystem?: boolean;
}

export interface PictureCard {
  id: string;
  categoryId: string;
  label: string;
  voiceLabel?: string;
  imageUrl: string;
  order?: number;
  isSystem?: boolean;
  createdAt?: string;
}

export interface CardManagementStore {
  cards: PictureCard[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  addCustomCard: (card: Omit<PictureCard, 'id' | 'order' | 'isSystem'>) => Promise<PictureCard>;
  addCustomCategory: (category: Omit<Category, 'id' | 'isSystem'>) => Promise<Category>;
  deleteCard: (id: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  reorderCards: (sourceCategory: string, targetCategory: string, sourceIndex: number, targetIndex: number) => Promise<void>;
  clearCustomCards: () => Promise<void>;
}
