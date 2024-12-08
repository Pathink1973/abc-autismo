import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { PictureCard as PictureCardType } from '../../types';
import { PictureCard } from '../PictureCard';
import { Trash2 } from 'lucide-react';

interface DraggableCardProps {
  card: PictureCardType;
  index: number;
  onCardClick: () => void;
  onDeleteCard: () => void;
  isSelected: boolean;
}

export const DraggableCard: React.FC<DraggableCardProps> = ({
  card,
  index,
  onCardClick,
  onDeleteCard,
  isSelected,
}) => {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            gridColumn: 'span 1'
          }}
          className={`relative group ${
            snapshot.isDragging ? 'z-50' : ''
          }`}
        >
          <PictureCard
            card={card}
            onClick={onCardClick}
            isSelected={isSelected}
          />
          {!card.isSystem && (
            <button
              onClick={onDeleteCard}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </Draggable>
  );
};