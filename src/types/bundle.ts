export interface BundleItemDetail {
  name: string;
  kannadaName: string;
  weight: string;
  quantity: number;
  description?: string;
}

export interface ThindiBundle {
  id: string;
  sku: string;
  name: string;
  kannadaName: string;
  shortDescription: string;
  fullDescription: string;
  price: number; // Demo launch pricing in INR
  available: boolean;
  itemCount: number;
  totalWeight: string;
  imageSrc: string;
  imageAlt: string;
  contents: BundleItemDetail[];
  highlights: string[];
  allergens: string;
}

