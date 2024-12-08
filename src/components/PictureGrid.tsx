import React, { useState } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import { PictureCard } from './PictureCard';
import { useStore } from '../store/useStore';
import { useCardManagementStore } from '../store/useCardManagementStore';
import { CardManagementModal } from './card-management/CardManagementModal';
import { BulkUploadModal } from './card-management/BulkUploadModal';
import { processBatchImages } from '../utils/imageProcessor';

interface PictureGridProps {
  categoryId: string | null;
}

export const PictureGrid: React.FC<PictureGridProps> = ({ categoryId }) => {
  const { selectedCards, addCard } = useStore();
  const { cards, addCustomCard, deleteCard, isLoading, error } = useCardManagementStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const filteredCards = categoryId
    ? cards.filter((card) => card.categoryId === categoryId)
    : cards;

  const handleBulkUpload = async (
    files: FileList,
    selectedCategoryId: string,
    labels: Map<string, string>
  ) => {
    try {
      const processedImages = await processBatchImages(files, (current, total) => {
        console.log(`Processing image ${current}/${total}`);
      });

      for (let i = 0; i < processedImages.length; i++) {
        const fileName = files[i].name;
        const label = labels.get(fileName) || fileName.replace(/\.[^/.]+$/, '');
        
        await addCustomCard({
          categoryId: selectedCategoryId,
          label,
          voiceLabel: label,
          imageUrl: processedImages[i],
        });
      }
    } catch (error) {
      console.error('Bulk upload failed:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Carregando imagens...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
        <div className="col-span-2 grid grid-cols-2 gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="aspect-square flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Plus className="w-8 h-8 text-gray-400" />
            <span className="text-sm text-gray-600">Adicionar Imagem</span>
          </button>
          
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="aspect-square flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Upload className="w-8 h-8 text-gray-400" />
            <span className="text-sm text-gray-600">Upload em Massa</span>
          </button>
        </div>
        
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

      <BulkUploadModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onUpload={handleBulkUpload}
      />
    </>
  );
};