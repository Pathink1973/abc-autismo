import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useCardManagementStore } from '@/store/useCardManagementStore';

interface CategoryFormState {
  name: string;
  icon: string;
  color: string;
}

const EMOJI_OPTIONS = [
  '📁', '📚', '🎮', '🎨', '🎵', '🎬', '📱', '💡', '🌟', '🎯',
  '🏆', '🎪', '🎭', '🎪', '🎨', '🎼', '📷', '🎲', '🎯', '🎪'
];

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose }) => {
  const {
    addCustomCategory,
    temporaryCategory,
    setTemporaryCategory,
    categories,
  } = useCardManagementStore();

  const [formState, setFormState] = useState<CategoryFormState>({
    name: temporaryCategory?.name || '',
    icon: temporaryCategory?.icon || '📁',
    color: temporaryCategory?.color || '#808080',
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    if (isOpen && temporaryCategory) {
      setFormState({
        name: temporaryCategory.name,
        icon: temporaryCategory.icon,
        color: temporaryCategory.color,
      });
    }
  }, [isOpen, temporaryCategory]);

  const handleClose = () => {
    setTemporaryCategory(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formState.name.trim()) {
      setError('Por favor, insira um nome para a categoria');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Find similar system category to determine group
      const similarCategory = categories.find(cat => 
        cat.isSystem && 
        (cat.name.toLowerCase().includes(formState.name.toLowerCase()) ||
         formState.name.toLowerCase().includes(cat.name.toLowerCase()))
      );

      await addCustomCategory({
        name: formState.name,
        icon: formState.icon,
        color: formState.color,
        isSystem: false,
        group: similarCategory?.group || 'general' // Use similar category's group or default to 'general'
      });
      
      handleClose();
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Erro ao criar categoria. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Nova Categoria</h2>
          <button
            onClick={handleClose}
            type="button"
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-16 h-16 text-3xl bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center justify-center"
                disabled={isSubmitting}
              >
                {formState.icon}
              </button>
              {showEmojiPicker && (
                <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-2">
                  <div className="grid grid-cols-5 gap-2">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setFormState({ ...formState, icon: emoji });
                          setShowEmojiPicker(false);
                        }}
                        className="w-8 h-8 text-xl hover:bg-gray-100 rounded flex items-center justify-center"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex-1">
              <Input
                type="text"
                label="Nome da Categoria"
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                placeholder="Digite o nome da categoria"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Criando...' : 'Criar Categoria'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
