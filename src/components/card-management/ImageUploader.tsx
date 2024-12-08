import React from 'react';
import { Link, Upload } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface ImageUploaderProps {
  uploadMethod: 'url' | 'file';
  imageUrl: string;
  onUrlChange: (url: string) => void;
  onFileChange: (dataUrl: string) => void;
  onMethodChange: (method: 'url' | 'file') => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  previewUrl: string;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  uploadMethod,
  imageUrl,
  onUrlChange,
  onFileChange,
  onMethodChange,
  fileInputRef,
  previewUrl,
  disabled,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onFileChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={uploadMethod === 'url' ? 'primary' : 'secondary'}
          onClick={() => onMethodChange('url')}
          className="flex-1"
          disabled={disabled}
        >
          <Link className="w-4 h-4" />
          URL
        </Button>
        <Button
          type="button"
          variant={uploadMethod === 'file' ? 'primary' : 'secondary'}
          onClick={() => onMethodChange('file')}
          className="flex-1"
          disabled={disabled}
        >
          <Upload className="w-4 h-4" />
          Arquivo
        </Button>
      </div>

      {uploadMethod === 'url' ? (
        <Input
          type="url"
          label="URL da Imagem"
          value={imageUrl}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://exemplo.com/imagem.jpg"
          required={uploadMethod === 'url'}
          disabled={disabled}
        />
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
            disabled={disabled}
          />
        </div>
      )}

      {(previewUrl || imageUrl) && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Pré-visualização:
          </p>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-gray-50">
            <img
              src={previewUrl || imageUrl}
              alt="Preview"
              className="h-full w-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://via.placeholder.com/400x300?text=Imagem+Inválida';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};