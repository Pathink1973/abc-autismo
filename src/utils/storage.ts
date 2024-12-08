import imageCompression from 'browser-image-compression';

// Compress image before storing
export const compressImage = async (dataUrl: string): Promise<string> => {
  // Convert data URL to Blob
  const response = await fetch(dataUrl);
  const blob = await response.blob();

  try {
    const compressedFile = await imageCompression(blob, {
      maxSizeMB: 0.3, // Reduce max size to 300KB
      maxWidthOrHeight: 800,
      useWebWorker: true,
      fileType: 'image/jpeg',
      initialQuality: 0.7,
    });

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(compressedFile);
    });
  } catch (error) {
    console.error('Image compression failed:', error);
    throw new Error('Failed to compress image. Please try a smaller image.');
  }
};

// Validate image size before storing
export const validateImageSize = (dataUrl: string): boolean => {
  // Calculate approximate size in bytes (base64 is ~33% larger than binary)
  const base64Length = dataUrl.length - (dataUrl.indexOf(',') + 1);
  const sizeInBytes = (base64Length * 3) / 4;
  const maxSize = 300 * 1024; // 300KB limit
  
  return sizeInBytes <= maxSize;
};