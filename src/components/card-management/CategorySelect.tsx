import React from 'react';
import { useCardManagementStore } from '../../store/useCardManagementStore';

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({ value, onChange }) => {
  const { categories } = useCardManagementStore();

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Categoria
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required
      >
        <option value="">Selecione uma categoria</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};