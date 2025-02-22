import imageCompression from 'browser-image-compression';

export const processImage = async (file: File): Promise<string> => {
  try {
    // First validate the file
    if (!file.type.startsWith('image/')) {
      throw new Error(`O arquivo "${file.name}" não é uma imagem válida`);
    }

    // Compress the image with optimized settings
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 0.2, // Reduced to 200KB max
      maxWidthOrHeight: 800, // Reduced max dimensions
      useWebWorker: true,
      fileType: 'image/webp', // Using WebP for better compression
      initialQuality: 0.7,
      alwaysKeepResolution: false,
    });

    // Convert to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error(`Erro ao processar "${file.name}"`));
      reader.readAsDataURL(compressedFile);
    });
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error(`Falha ao processar "${file.name}": ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};

// Helper function to process images in chunks
export const processBatchImages = async (
  files: FileList,
  onProgress?: (processed: number, total: number) => void
): Promise<string[]> => {
  const total = files.length;
  const results: string[] = [];
  const BATCH_SIZE = 5; // Process 5 images at a time

  for (let i = 0; i < total; i += BATCH_SIZE) {
    const batch = Array.from(files).slice(i, i + BATCH_SIZE);
    const batchPromises = batch.map(processImage);
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    if (onProgress) {
      onProgress(Math.min(i + BATCH_SIZE, total), total);
    }
  }

  return results;
};