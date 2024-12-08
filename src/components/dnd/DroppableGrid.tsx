import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { DraggableCard } from './DraggableCard';
import { PictureCard } from '../../types';

interface DroppableGridProps {
  categoryId: string;
  cards: PictureCard[];
  onCardClick: (card: PictureCard) => void;
  onDeleteCard: (cardId: string) => void;
  selectedCardIds: Set<string>;
}

export const DroppableGrid: React.FC<DroppableGridProps> = ({
  categoryId,
  cards,
  onCardClick,
  onDeleteCard,
  selectedCardIds,
}) => {
  return (
    <Droppable
      droppableId={`category-${categoryId}`}
      direction="horizontal"
      type="PICTURE_CARD"
    >
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
          style={{ display: 'grid' }}
        >
          {cards.map((card, index) => (
            <DraggableCard
              key={card.id}
              card={card}
              index={index}
              onCardClick={() => onCardClick(card)}
              onDeleteCard={() => onDeleteCard(card.id)}
              isSelected={selectedCardIds.has(card.id)}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};