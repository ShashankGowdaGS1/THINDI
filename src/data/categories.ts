export interface CravingCategory {
  id: string;
  number: string;
  title: string;
  kannadaTitle: string;
  description: string;
  items: string[];
  imageSrc: string;
  imageAlt: string;
  badge: string;
  kannadaBadge: string;
  accentColor: string;
}

export const CRAVING_CATEGORIES: CravingCategory[] = [
  {
    id: 'kuruk-thindi',
    number: '01',
    title: 'Kuruk Thindi',
    kannadaTitle: 'ಕುರುಕ್ ತಿಂಡಿ',
    description: 'Crunchy favourites.',
    items: ['Chakkali', 'Kodubale', 'Nippattu'],
    imageSrc: '/images/categories/kuruk-thindi.jpg',
    imageAlt: 'Authentic Karnataka crispy savouries: spiral chakkali, ring kodubale, and nippattu crackers',
    badge: 'Crunchy Savouries',
    kannadaBadge: 'ಗರಿಗರಿ ಖಾರ',
    accentColor: '#A43D2E', // Chilli red
  },
  {
    id: 'sihi-thindi',
    number: '02',
    title: 'Sihi Thindi',
    kannadaTitle: 'ಸಿಹಿ ತಿಂಡಿ',
    description: 'A little sweetness.',
    items: ['Obbattu', 'Kajjaya', 'Traditional sweets'],
    imageSrc: '/images/categories/sihi-thindi.jpg',
    imageAlt: 'Karnataka traditional sweets: golden ghee-brushed obbattu and deep golden kajjaya on banana leaf',
    badge: 'Festive & Sweet',
    kannadaBadge: 'ಪಾರಂಪರಿಕ ಸಿಹಿ',
    accentColor: '#E8B54B', // Turmeric yellow
  },
  {
    id: 'uppinakai',
    number: '03',
    title: 'Uppinakai',
    kannadaTitle: 'ಉಪ್ಪಿನಕಾಯಿ',
    description: 'Spice and everything nice.',
    items: ['Mango pickle', 'Lemon pickle', 'Traditional pickles'],
    imageSrc: '/images/categories/uppinakai.jpg',
    imageAlt: 'Handmade Karnataka mango and lemon pickles in traditional ceramic bharani jars',
    badge: 'Bharani Pickles',
    kannadaBadge: 'ಮನೆ ಉಪ್ಪಿನಕಾಯಿ',
    accentColor: '#A43D2E', // Chilli red
  },
  {
    id: 'appala-sandige',
    number: '04',
    title: 'Appala & Sandige',
    kannadaTitle: 'ಅಪ್ಪಳ & ಸಂಡಿಗೆ',
    description: 'The perfect side.',
    items: ['Appala', 'Sandige', 'Traditional fryums'],
    imageSrc: '/images/categories/appala-sandige.jpg',
    imageAlt: 'Sun-dried crisp sandige fryums and blistered appala accompaniments',
    badge: 'Sun-Dried Crisps',
    kannadaBadge: 'ಊಟದ ಜೊತೆ',
    accentColor: '#365541', // Leaf green
  },
];

export function getCategoryBySlug(slug: string): CravingCategory | undefined {
  if (!slug) return undefined;
  const normalized = slug.toLowerCase().trim();
  return CRAVING_CATEGORIES.find((c) => c.id.toLowerCase() === normalized);
}

export function getAllCategorySlugs(): string[] {
  return CRAVING_CATEGORIES.map((c) => c.id);
}

