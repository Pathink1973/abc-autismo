import { PictureCard } from '../types';

const CATEGORIES = [
  'actions', 'animals', 'body', 'clothes', 'colors', 'emotions',
  'food', 'general', 'numbers', 'objects', 'places', 'weather'
];

export async function loadPublicImages(): Promise<PictureCard[]> {
  const cards: PictureCard[] = [];

  console.log('Starting to load public images...');

  try {
    // Import all images from the public directory
    const images = Object.entries(
      import.meta.glob('/public/images/**/*.{png,jpg,jpeg,webp}', {
        eager: true,
        as: 'url'
      })
    );

    console.log('Found images:', images.map(([path]) => path));

    for (const category of CATEGORIES) {
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
            const label = fileName.replace(/-/g, ' ');
            console.log(`Creating card for image: ${path} -> ${url}`);
            
            return {
              id: `public-${category}-${fileName}`,
              categoryId: category,
              imageUrl: url as string,
              label,
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
        console.error(`Failed to process category ${category}:`, error);
      }
    }
  } catch (error) {
    console.error('Failed to load image module:', error);
    // Return an empty array instead of throwing to prevent app crash
    return [];
  }

  console.log(`Total cards loaded: ${cards.length}`);
  if (cards.length === 0) {
    console.warn('No cards were loaded. This might indicate a problem with the image paths or categories.');
  }
  return cards;
}
