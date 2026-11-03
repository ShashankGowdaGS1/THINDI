export interface FAQItem {
  id: string;
  question: string;
  kannadaQuestion?: string;
  answer: string;
  kannadaAnswer?: string;
  category: 'origin' | 'shipping' | 'ingredients' | 'storage' | 'gifting' | 'contact' | 'policy' | 'orders';
  published: boolean; // Production filter
  displayOrder: number;
  relatedRoute?: string; // Optional anchor link
  updatedAt: string;
}

