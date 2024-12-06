import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { PictureCard } from './PictureCard';
import { useStore } from '../store/useStore';
import { useCardManagementStore } from '../store/useCardManagementStore';
import { CardManagementModal } from './card-management/CardManagementModal';

interface PictureGridProps {
  categoryId: string | null;
}

export const PictureGrid: React.FC<PictureGridProps> = ({ categoryId }) => {
  const { selectedCards, addCard } = useStore();
  const { cards, addCustomCard, deleteCard } = useCardManagementStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredCards = categoryId
    ? cards.filter((card) => card.categoryId === categoryId)
    : cards;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="aspect-square flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <Plus className="w-8 h-8 text-gray-400" />
          <span className="text-sm text-gray-600">Adicionar Imagem</span>
        </button>
        
        {filteredCards.map((card) => (
          <div key={card.id} className="relative group">
            <PictureCard
              card={card}
              onClick={() => addCard(card)}
              isSelected={selectedCards.some((c) => c.id === card.id)}
            />
            {!card.isSystem && (
              <button
                onClick={() => deleteCard(card.id)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <CardManagementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddCard={addCustomCard}
      />
    </>
  );
};