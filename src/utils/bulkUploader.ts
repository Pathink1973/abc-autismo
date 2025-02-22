import { processImage, processImageUrl } from './imageProcessor';
import { addCard } from './db';
import { PictureCard } from '../types';

interface BulkUploadItem {
  categoryId: string;
  label: string;
  imageSource: string | File;
}

export const bulkUpload = async (items: BulkUploadItem[]): Promise<void> => {
  const total = items.length;
  let processed = 0;

  try {
    for (const item of items) {
      const imageUrl = item.imageSource instanceof File
        ? await processImage(item.imageSource)
        : await processImageUrl(item.imageSource as string);

      const card: Omit<PictureCard, 'id'> = {
        categoryId: item.categoryId,
        label: item.label,
        imageUrl,
        isSystem: false,
      };

      await addCard(card as PictureCard);
      processed++;

      // Emit progress (you can add a progress callback if needed)
      console.log(`Processed ${processed}/${total} images`);
    }
  } catch (error) {
    console.error('Bulk upload error:', error);
    throw new Error(`Failed at image ${processed + 1}/${total}`);
  }
};