import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { categories } from '../../data/categories';
import { ImageUploader } from './ImageUploader';
import { CategorySelect } from './CategorySelect';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface CardManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCard: (card: { categoryId: string; imageUrl: string; label: string }) => void;
}

export const CardManagementModal: React.FC<CardManagementModalProps> = ({
  isOpen,
  onClose,
  onAddCard,
}) => {
  const initialState = {
    categoryId: categories[0].id,
    label: '',
    imageUrl: '',
    previewUrl: '',
    uploadMethod: 'url' as const,
  };

  const [formState, setFormState] = useState(initialState);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFormState(initialState);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { categoryId, label, imageUrl, previewUrl, uploadMethod } = formState;
    
    if (categoryId && label && (imageUrl || previewUrl)) {
      onAddCard({
        categoryId,
        label,
        imageUrl: uploadMethod === 'url' ? imageUrl : previewUrl,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setFormState(initialState);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState(prev => ({
          ...prev,
          previewUrl: reader.result as string || '',
          imageUrl: '',
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormState(prev => ({ ...prev, previewUrl: '' }));
    }
  };

  const handleUrlChange = (newUrl: string) => {
    setFormState(prev => ({
      ...prev,
      imageUrl: newUrl,
      previewUrl: '',
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Adicionar Nova Imagem</h2>
          <button
            onClick={handleClose}
            type="button"
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <CategorySelect
            value={formState.categoryId}
            onChange={(value) =>
              setFormState((prev) => ({ ...prev, categoryId: value }))
            }
          />

          <Input
            type="text"
            label="Nome da Imagem"
            value={formState.label}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, label: e.target.value }))
            }
            placeholder="Digite o nome da imagem"
            required
          />

          <ImageUploader
            uploadMethod={formState.uploadMethod}
            imageUrl={formState.imageUrl}
            onUrlChange={handleUrlChange}
            onFileChange={handleFileChange}
            onMethodChange={(method) =>
              setFormState((prev) => ({
                ...prev,
                uploadMethod: method,
                imageUrl: '',
                previewUrl: '',
              }))
            }
            fileInputRef={fileInputRef}
            previewUrl={formState.previewUrl}
          />

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
            >
              Adicionar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};