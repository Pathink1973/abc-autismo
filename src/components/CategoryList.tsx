import React from 'react';
import { categories } from '../data/categories';
import { motion } from 'framer-motion';

interface CategoryListProps {
  onSelect: (categoryId: string) => void;
  selectedCategory: string | null;
}

export const CategoryList: React.FC<CategoryListProps> = ({ onSelect, selectedCategory }) => {
  return (
    <div className="py-6">
      <div className="grid grid-cols-5 gap-4">
        {categories.slice(0, 5).map((category) => (
          <CategoryButton
            key={category.id}
            category={category}
            isSelected={selectedCategory === category.id}
            onClick={() => onSelect(category.id)}
          />
        ))}
      </div>
      <div className="grid grid-cols-5 gap-4 mt-4">
        {categories.slice(5).map((category) => (
          <CategoryButton
            key={category.id}
            category={category}
            isSelected={selectedCategory === category.id}
            onClick={() => onSelect(category.id)}
          />
        ))}
      </div>
    </div>
  );
};

interface CategoryButtonProps {
  category: { id: string; name: string; icon: string; color: string };
  isSelected: boolean;
  onClick: () => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ category, isSelected, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl transition-all
        ${isSelected 
          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' 
          : 'bg-white hover:bg-gray-50 text-gray-700 shadow-sm hover:shadow-md'}`}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <span className="text-3xl mb-1">{category.icon}</span>
      <span className="font-medium text-sm text-center leading-tight">
        {category.name}
      </span>
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-2xl ring-4 ring-blue-500 ring-offset-2"
          layoutId="categoryHighlight"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </motion.button>
  );
};