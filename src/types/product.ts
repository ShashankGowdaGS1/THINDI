export interface ProductVariant {
  id: string;
  sku: string;
  weight: string; // e.g. "200g", "400g", "1kg"
  price: number; // INR
  available: boolean;
  isPopular?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  kannadaName: string;
  shortDescription: string;
  fullDescription: string;
  category: 'kuruk-thindi' | 'sihi-thindi' | 'uppinakai' | 'appala-sandige';
  categoryLabel: string;
  imageSrc: string;
  imageAlt: string;
  origin: string;
  ingredients: string[];
  variants: ProductVariant[];
  inStock?: boolean;
  displayOrder?: number;
  keywords?: string[];
  active?: boolean;
  galleryImages?: string[];
  storyTitle?: string;
  storyContent?: string;
  allergens?: string[];
  storageInstructions?: string;
  shelfLife?: string;
  relatedProductIds?: string[];
  foodDeclaration?: string;
}

