import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Link } from 'lucide-react';
import { categories } from '../data/categories';

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
  const [categoryId, setCategoryId] = useState(categories[0].id);
  const [label, setLabel] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen) {
      setCategoryId(categories[0].id);
      setLabel('');
      setImageUrl('');
      setPreviewUrl('');
      setUploadMethod('url');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryId && label && (imageUrl || previewUrl)) {
      onAddCard({ 
        categoryId, 
        label, 
        imageUrl: uploadMethod === 'url' ? imageUrl : previewUrl
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setCategoryId(categories[0].id);
    setLabel('');
    setImageUrl('');
    setPreviewUrl('');
    setUploadMethod('url');
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
        const result = reader.result as string;
        setPreviewUrl(result || '');
        setImageUrl(''); // Clear URL input when file is selected
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl('');
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setImageUrl(newUrl);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setPreviewUrl('');
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border rounded-md p-2"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Imagem
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full border rounded-md p-2"
              placeholder="Digite o nome da imagem"
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setUploadMethod('url');
                  setPreviewUrl('');
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 ${
                  uploadMethod === 'url'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <Link className="w-4 h-4" />
                URL
              </button>
              <button
                type="button"
                onClick={() => {
                  setUploadMethod('file');
                  setImageUrl('');
                }}
                className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 ${
                  uploadMethod === 'file'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <Upload className="w-4 h-4" />
                Arquivo
              </button>
            </div>

            {uploadMethod === 'url' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL da Imagem
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={handleUrlChange}
                  className="w-full border rounded-md p-2"
                  placeholder="https://exemplo.com/imagem.jpg"
                  required={uploadMethod === 'url'}
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selecionar Arquivo
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full border rounded-md p-2"
                  required={uploadMethod === 'file'}
                />
              </div>
            )}

            {(previewUrl || imageUrl) && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Pré-visualização:</p>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-gray-50">
                  <img
                    src={previewUrl || imageUrl}
                    alt="Preview"
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Imagem+Inválida';
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};