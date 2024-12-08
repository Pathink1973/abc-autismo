import React from 'react';
import { motion } from 'framer-motion';
import { PictureCard as PictureCardType } from '../types';

interface PictureCardProps {
  card: PictureCardType;
  onClick?: () => void;
  isSelected?: boolean;
}

export const PictureCard: React.FC<PictureCardProps> = ({
  card,
  onClick,
  isSelected,
}) => {
  return (
    <motion.div
      onClick={onClick}
      className={`relative cursor-pointer rounded-2xl overflow-hidden bg-white
        ${isSelected 
          ? 'ring-4 ring-blue-500 ring-offset-2 shadow-xl shadow-blue-500/25' 
          : 'shadow-sm hover:shadow-xl'}`}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className="aspect-square">
        <img
          src={card.imageUrl}
          alt={card.label}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
        <p className="text-white text-center font-medium">
          {card.label}
        </p>
      </div>
      {isSelected && (
        <motion.div
          className="absolute inset-0 border-4 border-blue-500 rounded-2xl"
          layoutId="cardHighlight"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </motion.div>
  );
};