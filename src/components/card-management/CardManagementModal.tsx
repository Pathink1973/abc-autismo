import React, { useState, useRef, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { CategorySelect } from './CategorySelect';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { validateImageSize, compressImage } from '../../utils/storage';
import { useCardManagementStore } from '@/store/useCardManagementStore';

interface CardManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCard: (card: { categoryId: string; imageUrl: string; label: string; voiceLabel?: string }) => Promise<void>;
  categoryId: string | null;
}

export const CardManagementModal: React.FC<CardManagementModalProps> = ({
  isOpen,
  onClose,
  onAddCard,
  categoryId,
}) => {
  const initialState = {
    categoryId: categoryId || '',
    label: '',
    voiceLabel: '',
    imageUrl: '',
    previewUrl: '',
    uploadMethod: 'url' as const,
  };

  const [formState, setFormState] = useState(initialState);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    categories,
    temporaryCategory,
    addCustomCard,
    setTemporaryCategory,
  } = useCardManagementStore();

  // Combine regular categories with temporary category if it exists
  const allCategories = useMemo(() => {
    if (temporaryCategory) {
      return [...categories, temporaryCategory];
    }
    return categories;
  }, [categories, temporaryCategory]);

  const selectedCategoryData = useMemo(() => {
    return allCategories.find((cat) => cat.id === categoryId) || null;
  }, [allCategories, categoryId]);

  useEffect(() => {
    if (isOpen) {
      setFormState(prev => ({
        ...initialState,
        categoryId: categoryId || prev.categoryId || ''
      }));
      setError(null);
      setIsSubmitting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen, categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const { categoryId, label, voiceLabel, imageUrl, previewUrl, uploadMethod } = formState;
    
    if (!categoryId) {
      setError('Por favor, selecione uma categoria');
      return;
    }

    if (!label) {
      setError('Por favor, insira um nome para a imagem');
      return;
    }

    const finalImageUrl = uploadMethod === 'url' ? imageUrl : previewUrl;
    if (!finalImageUrl) {
      setError('Por favor, selecione uma imagem');
      return;
    }

    try {
      setIsSubmitting(true);
      let processedImageUrl = finalImageUrl;

      // Compress image if it's a data URL (file upload)
      if (uploadMethod === 'file' && previewUrl) {
        processedImageUrl = await compressImage(previewUrl);
        if (!validateImageSize(processedImageUrl)) {
          setError('Imagem muito grande. Por favor, use uma imagem menor.');
          setIsSubmitting(false);
          return;
        }
      }

      await onAddCard({
        categoryId,
        label,
        voiceLabel: voiceLabel || label,
        imageUrl: processedImageUrl,
      });
      
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao adicionar imagem');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormState(initialState);
    setError(null);
    setIsSubmitting(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
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
            disabled={isSubmitting}
          />

          <Input
            type="text"
            label="Nome para Voz (opcional)"
            value={formState.voiceLabel}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, voiceLabel: e.target.value }))
            }
            placeholder="Digite como a voz deve pronunciar (opcional)"
            disabled={isSubmitting}
          />

          <ImageUploader
            uploadMethod={formState.uploadMethod}
            imageUrl={formState.imageUrl}
            onUrlChange={(url) =>
              setFormState((prev) => ({
                ...prev,
                imageUrl: url,
                previewUrl: '',
              }))
            }
            onFileChange={(dataUrl) =>
              setFormState((prev) => ({
                ...prev,
                previewUrl: dataUrl,
                imageUrl: '',
              }))
            }
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
            disabled={isSubmitting}
          />

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
              {isSubmitting ? 'Adicionando...' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};