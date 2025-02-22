import React, { useState, useRef, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { Button } from '../ui/Button';
import { CategorySelect } from './CategorySelect';
import { Textarea } from '../ui/Textarea';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: FileList, categoryId: string, cardData: CardData) => void;
  categoryId: string | null;
}

interface CardData {
  description: string;
  audioDescription: string;
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  categoryId,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId || '');
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cardData, setCardData] = useState<CardData>({
    description: '',
    audioDescription: '',
  });

  useEffect(() => {
    if (isOpen) {
      setSelectedCategoryId(categoryId || '');
      setError(null);
      setCardData({
        description: '',
        audioDescription: '',
      });
    }
  }, [isOpen, categoryId]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    setError(null);

    if (!selectedCategoryId) {
      setError('Por favor, selecione uma categoria');
      return;
    }

    if (files.length === 0) {
      setError('Por favor, selecione pelo menos uma imagem');
      return;
    }

    // Check if all files are images
    const validFiles = Array.from(files).every(file => 
      file.type.startsWith('image/')
    );

    if (!validFiles) {
      setError('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    onUpload(files, selectedCategoryId, cardData);
    handleClose();
  };

  const handleClose = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setError(null);
    setIsDragging(false);
    setCardData({
      description: '',
      audioDescription: '',
    });
    onClose();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCardData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Upload em Lote</h2>
          <button
            onClick={handleClose}
            type="button"
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}

          <CategorySelect
            value={selectedCategoryId}
            onChange={(value) => setSelectedCategoryId(value)}
          />

          <div className="space-y-4">
            <Textarea
              placeholder="Descrição dos cartões (opcional)"
              value={cardData.description}
              onChange={(e) => setCardData({ ...cardData, description: e.target.value })}
            />

            <Textarea
              placeholder="Descrição em áudio dos cartões (opcional)"
              value={cardData.audioDescription}
              onChange={(e) => setCardData({ ...cardData, audioDescription: e.target.value })}
            />
          </div>

          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Arraste e solte suas imagens aqui ou clique para selecionar
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Você pode selecionar várias imagens de uma vez
            </p>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (fileInputRef.current?.files) {
                  handleFiles(fileInputRef.current.files);
                } else {
                  setError('Por favor, selecione pelo menos uma imagem');
                }
              }}
            >
              Enviar Cartões
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};