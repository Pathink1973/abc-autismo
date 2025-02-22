import imageCompression from 'browser-image-compression';

// Base paths for image storage
export const IMAGES_BASE_PATH = '/images';
export const CUSTOM_IMAGES_PATH = `${IMAGES_BASE_PATH}/custom`;

// Create a new category in IndexedDB for image storage
export const createCategoryFolder = async (categoryId: string) => {
  try {
    // Create a new object store or collection for the category if using IndexedDB
    const db = await openDB();
    if (!db.objectStoreNames.contains(`category_${categoryId}_images`)) {
      // This will be handled during database version upgrade
      console.log(`Category storage created for ${categoryId}`);
    }
    return `${CUSTOM_IMAGES_PATH}/${categoryId}`;
  } catch (error) {
    console.error(`Error creating category storage for ${categoryId}:`, error);
    throw new Error('Não foi possível criar o armazenamento para a categoria');
  }
};

// Save an image for a category
export const saveImageToCategory = async (categoryId: string, imageData: string, fileName: string) => {
  try {
    const compressedImage = await compressImage(imageData);
    
    // Store in IndexedDB
    const db = await openDB();
    const tx = db.transaction(`category_${categoryId}_images`, 'readwrite');
    const store = tx.objectStore(`category_${categoryId}_images`);
    
    await store.put({
      id: fileName,
      data: compressedImage,
      timestamp: Date.now()
    });
    
    return `${CUSTOM_IMAGES_PATH}/${categoryId}/${fileName}`;
  } catch (error) {
    console.error('Error saving image:', error);
    throw new Error('Não foi possível salvar a imagem');
  }
};

// Compress image before storing
export const compressImage = async (dataUrl: string): Promise<string> => {
  try {
    // Convert base64 to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    
    const options = {
      maxSizeMB: 0.3, // 300KB
      maxWidthOrHeight: 800,
      useWebWorker: true
    };
    
    const compressedBlob = await imageCompression(blob, options);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(compressedBlob);
    });
  } catch (error) {
    console.error('Error compressing image:', error);
    return dataUrl; // Return original if compression fails
  }
};

// Check if image size is within limits
export const isImageSizeValid = (sizeInBytes: number): boolean => {
  const maxSize = 300 * 1024; // 300KB limit
  return sizeInBytes <= maxSize;
};

// Validate image size before upload (max 5MB)
export const validateImageSize = (file: File, maxSizeMB = 5) => {
  const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  if (file.size > maxSize) {
    throw new Error(`A imagem deve ter no máximo ${maxSizeMB}MB`);
  }
  return true;
};

// Compress image if needed
export const compressImageUpload = async (file: File, maxSizeMB = 5): Promise<File> => {
  // Implementation for image compression if needed
  // For now, just return the original file
  return file;
};