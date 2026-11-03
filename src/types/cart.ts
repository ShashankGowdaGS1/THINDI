import { Product, ProductVariant } from './product';
import { ThindiBundle } from './bundle';

export interface CartItem {
  id: string; // unique item id: `${product.id}-${variant.id}` or `${bundle.id}`
  product: {
    id: string;
    name: string;
    kannadaName: string;
    imageSrc: string;
  };
  variant: {
    id: string;
    sku: string;
    weight: string;
    price: number;
    available: boolean;
  };
  quantity: number;
  isBundle?: boolean;
  bundleItemCount?: number;
}

export interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  totalCount: number;
  subtotal: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  addBundle: (bundle: ThindiBundle, quantity?: number) => void;
  incrementItem: (itemId: string) => void;
  decrementItem: (itemId: string) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}
