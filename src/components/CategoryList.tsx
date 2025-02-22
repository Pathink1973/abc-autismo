import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Upload, FolderPlus, Trash2 } from 'lucide-react';
import { CardManagementModal } from './card-management/CardManagementModal';
import { BulkUploadModal } from './card-management/BulkUploadModal';
import { CategoryModal } from './card-management/CategoryModal';
import { Button } from './ui/Button';
import { useCardManagementStore } from '@/store/useCardManagementStore';
import { Category } from '@/types';

interface CategoryListProps {
  selectedCategory: string | null;
  onSelect: (categoryId: string) => void;
}

const SELECT_CATEGORY_ID = 'select-category';

export const CategoryList: React.FC<CategoryListProps> = ({
  selectedCategory,
  onSelect,
}) => {
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const {
    addCustomCard,
    categories,
    deleteCategory,
    temporaryCategory,
    setTemporaryCategory,
  } = useCardManagementStore();

  // Check if there are any custom categories or temporary category
  const hasCustomCategories = useMemo(() => {
    return categories.some(category => !category.isSystem) || temporaryCategory !== null;
  }, [categories, temporaryCategory]);

  // Sort categories by group and name
  const displayCategories = useMemo(() => {
    let allCategories = [...categories];
    if (temporaryCategory) {
      // Find similar system category to determine group
      const similarCategory = categories.find(cat => 
        cat.isSystem && 
        (cat.name.toLowerCase().includes(temporaryCategory.name.toLowerCase()) ||
         temporaryCategory.name.toLowerCase().includes(cat.name.toLowerCase()))
      );
      
      // Add temporary category with the same group as similar category
      allCategories.push({
        ...temporaryCategory,
        group: similarCategory?.group || 'general'
      });
    }

    if (!hasCustomCategories) return allCategories;

    const selectCategory: Category = {
      id: SELECT_CATEGORY_ID,
      name: 'Selecione uma categoria',
      icon: '📋',
      color: '#gray',
      isSystem: true,
      group: 'general'
    };

    // Sort categories by group and then by name
    return [selectCategory, ...allCategories].sort((a, b) => {
      if (a.group === b.group) {
        return a.name.localeCompare(b.name);
      }
      return (a.group || '').localeCompare(b.group || '');
    });
  }, [categories, hasCustomCategories, temporaryCategory]);

  const handleBulkUpload = async (files: FileList, categoryId: string, cardData: any) => {
    if (!categoryId || categoryId === SELECT_CATEGORY_ID) {
      alert('Por favor, selecione uma categoria válida');
      return;
    }

    try {
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        reader.onloadend = () => {
          const base64 = reader.result as string;
          addCustomCard({
            id: `custom-${Date.now()}-${i}`,
            categoryId,
            name: `${cardData.name} ${i + 1}`,
            description: cardData.description,
            audioDescription: cardData.audioDescription,
            imageUrl: base64,
          });
        };
        
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Erro ao fazer upload das imagens');
    }
  };

  const handleDeleteCategory = async (categoryId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (window.confirm('Tem certeza que deseja excluir esta categoria? Todos os cartões desta categoria serão excluídos.')) {
      try {
        await deleteCategory(categoryId);
        if (selectedCategory === categoryId) {
          onSelect(SELECT_CATEGORY_ID);
        }
      } catch (error: any) {
        console.error('Erro ao excluir categoria:', error);
        alert(error.message || 'Não foi possível excluir a categoria. Por favor, tente novamente.');
      }
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    // Don't allow selection of the "Select a category" option
    if (categoryId === SELECT_CATEGORY_ID) {
      return;
    }
    onSelect(categoryId);
  };

  const handleCreateCategory = () => {
    // Create a temporary category
    const tempCategory: Category = {
      id: `temp-${Date.now()}`,
      name: 'Nova Categoria',
      icon: '📁',
      color: '#808080',
      isSystem: false,
      isTemporary: true,
      // Group will be assigned when the category is saved based on its name
    };
    setTemporaryCategory(tempCategory);
    setIsCategoryModalOpen(true);
  };

  return (
    <div className="py-6">
      <div className="grid grid-cols-5 gap-4">
        {displayCategories.map((category) => (
          <CategoryButton
            key={category.id}
            category={category}
            isSelected={selectedCategory === category.id}
            onClick={() => handleCategorySelect(category.id)}
            onDelete={!category.isSystem && category.id !== SELECT_CATEGORY_ID ? 
              (e) => handleDeleteCategory(category.id, e) : undefined}
            isSelectCategory={category.id === SELECT_CATEGORY_ID}
          />
        ))}

        <motion.button
          onClick={handleCreateCategory}
          className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-100 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FolderPlus className="w-8 h-8 text-gray-400" />
          <span className="mt-2 text-sm text-gray-600">Nova Categoria</span>
        </motion.button>
      </div>

      <CardManagementModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        categoryId={selectedCategory}
      />

      <BulkUploadModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onUpload={handleBulkUpload}
        categoryId={selectedCategory}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </div>
  );
};

interface CategoryButtonProps {
  category: Category;
  isSelected: boolean;
  onClick: () => void;
  onDelete?: (e: React.MouseEvent) => void;
  isSelectCategory?: boolean;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ 
  category, 
  isSelected, 
  onClick, 
  onDelete,
  isSelectCategory 
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={`
        relative
        flex flex-col items-center justify-center p-4
        bg-white rounded-lg shadow-sm
        ${isSelected ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'}
        ${isSelectCategory ? 'bg-gray-50 border-2 border-dashed border-gray-300' : ''}
        transition-colors
      `}
      whileHover={{ scale: isSelectCategory ? 1 : 1.02 }}
      whileTap={{ scale: isSelectCategory ? 1 : 0.98 }}
    >
      <span className="text-3xl mb-2">{category.icon}</span>
      <span className="text-sm font-medium text-gray-900">{category.name}</span>
      
      {onDelete && (
        <button
          onClick={onDelete}
          className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors z-10"
          title="Excluir categoria"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
      
      {isSelected && !isSelectCategory && (
        <motion.div
          className="absolute inset-0 ring-2 ring-blue-500 rounded-lg"
          layoutId="outline"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </motion.button>
  );
};