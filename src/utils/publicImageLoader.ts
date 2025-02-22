import { PictureCard } from '../types';
import { useCardManagementStore } from '../store/useCardManagementStore';

// Default system categories
const DEFAULT_CATEGORIES = [
  'actions', 'animals', 'body', 'clothes', 'colors', 'emotions',
  'food', 'general', 'numbers', 'objects', 'places', 'weather'
];

export async function loadPublicImages(): Promise<PictureCard[]> {
  const cards: PictureCard[] = [];
  
  // Get all categories from the store, including custom ones
  const store = useCardManagementStore.getState();
  const allCategories = store.categories.map(cat => cat.id);
  const categories = [...new Set([...DEFAULT_CATEGORIES, ...allCategories])];

  console.log('Starting to load public images...', { categories });

  try {
    // Import all images from the public directory
    const images = Object.entries(
      import.meta.glob('/public/images/**/*.{png,jpg,jpeg,webp}', {
        eager: true,
        as: 'url'
      })
    );

    console.log('Found images:', images.map(([path]) => path));

    for (const category of categories) {
      try {
        // Filter images for current category
        const categoryImages = images
          .filter(([path]) => {
            const isInCategory = path.toLowerCase().includes(`/${category.toLowerCase()}/`);
            console.log(`Checking path: ${path} for category: ${category} - matches: ${isInCategory}`);
            return isInCategory;
          })
          .map(([path, url]) => {
            const fileName = path.split('/').pop()?.split('.')[0] || '';
            // Format the label: replace hyphens with spaces and capitalize each word
            const label = fileName
              .replace(/-/g, ' ')
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' ');
            console.log(`Creating card for image: ${path} -> ${url}`);
            
            return {
              id: `public-${category}-${fileName}`,
              categoryId: category,
              imageUrl: url as string,
              name: label,
              label: label, // Add label field for display
              description: label,
              audioDescription: label, // Use formatted label for audio
              isSystem: true,
              order: 0,
              createdAt: new Date().toISOString()
            };
          });

        console.log(`Found ${categoryImages.length} images in category ${category}`);
        if (categoryImages.length === 0) {
          console.warn(`No images found for category: ${category}`);
        }

        cards.push(...categoryImages);
      } catch (error) {
        console.error(`Error loading images for category ${category}:`, error);
      }
    }

    console.log(`Total public images loaded: ${cards.length}`);
    return cards;
  } catch (error) {
    console.error('Failed to load public images:', error);
    return [];
  }
}
