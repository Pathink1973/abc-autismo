import React, { useState, useRef } from 'react';
import { X, Upload, AlertCircle, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { CategorySelect } from './CategorySelect';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: FileList, categoryId: string, labels: Map<string, string>) => Promise<void>;
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  const [categoryId, setCategoryId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [labels, setLabels] = useState<Map<string, string>>(new Map());
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (files.length > 50) {
      setError('Por favor, selecione no máximo 50 imagens por vez');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Initialize labels map with file names (without extension)
    const newLabels = new Map<string, string>();
    Array.from(files).forEach(file => {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      newLabels.set(file.name, nameWithoutExt);
    });
    setLabels(newLabels);
    setError(null);
  };

  const handleLabelChange = (fileName: string, value: string) => {
    setLabels(prev => new Map(prev).set(fileName, value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const files = fileInputRef.current?.files;
    
    if (!categoryId) {
      setError('Por favor, selecione uma categoria');
      return;
    }

    if (!files || files.length === 0) {
      setError('Por favor, selecione pelo menos uma imagem');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setProgress({ current: 0, total: files.length });
      
      await onUpload(files, categoryId, labels);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload das imagens');
    } finally {
      setIsUploading(false);
      setProgress(null);
    }
  };

  const handleClose = () => {
    setCategoryId('');
    setError(null);
    setLabels(new Map());
    setProgress(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg max-w-2xl w-full p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Upload em Massa</h2>
          <button
            onClick={handleClose}
            type="button"
            className="text-gray-500 hover:text-gray-700"
            disabled={isUploading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <CategorySelect
            value={categoryId}
            onChange={setCategoryId}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Selecionar Imagens
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              className="w-full border rounded-md p-2"
              required
              disabled={isUploading}
              onChange={handleFileChange}
            />
            <p className="mt-1 text-sm text-gray-500">
              Selecione até 50 imagens por vez (máximo 200KB por imagem após compressão)
            </p>
          </div>

          {progress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Processando imagens...</span>
                <span>{progress.current} de {progress.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {labels.size > 0 && (
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-2 text-gray-700">
                <FileText className="w-5 h-5" />
                <h3 className="font-medium">Nomes das Imagens</h3>
              </div>
              
              <div className="max-h-60 overflow-y-auto space-y-3">
                {Array.from(labels).map(([fileName, label]) => (
                  <div key={fileName} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={label}
                      onChange={(e) => handleLabelChange(fileName, e.target.value)}
                      className="flex-1 border rounded-md p-2 text-sm"
                      placeholder="Nome da imagem"
                      disabled={isUploading}
                    />
                    <span className="text-sm text-gray-500 truncate max-w-[200px]" title={fileName}>
                      {fileName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isUploading}
              className="flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <Upload className="w-4 h-4 animate-bounce" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Enviar Imagens
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};