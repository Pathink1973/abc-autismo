import React, { useState } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useStore } from '../store/useStore';
import { useCardManagementStore } from '../store/useCardManagementStore';
import { CardManagementModal } from './card-management/CardManagementModal';
import { BulkUploadModal } from './card-management/BulkUploadModal';
import { processBatchImages } from '../utils/imageProcessor';
import { DroppableGrid } from './dnd/DroppableGrid';
import { PictureCard } from './PictureCard';

interface PictureGridProps {
  categoryId: string | null;
}

export const PictureGrid: React.FC<PictureGridProps> = ({ categoryId }) => {
  const { selectedCards, addCard } = useStore();
  const { cards, addCustomCard, deleteCard, reorderCards, isLoading, error } = useCardManagementStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const selectedCardIds = new Set(selectedCards.map(card => card.id));

  const filteredCards = categoryId
    ? cards.filter(card => card.categoryId === categoryId)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
    : cards;

  const handleBulkUpload = async (files: FileList, selectedCategoryId: string) => {
    try {
      const processedImages = await processBatchImages(files);
      for (const image of processedImages) {
        await addCustomCard({
          categoryId: selectedCategoryId,
          imageUrl: image.url,
          label: image.name
        });
      }
    } catch (error) {
      console.error('Failed to process images:', error);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceDroppableId = result.source.droppableId;
    const destinationDroppableId = result.destination.droppableId;
    
    const sourceCategory = sourceDroppableId.replace('category-', '');
    const targetCategory = destinationDroppableId.replace('category-', '');
    
    reorderCards(
      sourceCategory,
      targetCategory,
      result.source.index,
      result.destination.index
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!categoryId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Selecione uma categoria para ver os cartões</p>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Plus className="w-5 h-5" />
              Adicionar Cartão
            </button>
            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <Upload className="w-5 h-5" />
              Upload em Lote
            </button>
          </div>
        </div>

        <DroppableGrid
          categoryId={categoryId}
          cards={filteredCards}
          onCardClick={(card) => addCard(card)}
          onDeleteCard={(cardId) => deleteCard(cardId)}
          selectedCardIds={selectedCardIds}
        />

        <CardManagementModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddCard={addCustomCard}
          categoryId={categoryId}
        />

        <BulkUploadModal
          isOpen={isBulkModalOpen}
          onClose={() => setIsBulkModalOpen(false)}
          onUpload={(files) => handleBulkUpload(files, categoryId)}
          categoryId={categoryId}
        />
      </div>
    </DragDropContext>
  );
};