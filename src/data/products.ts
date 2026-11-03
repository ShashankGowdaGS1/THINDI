import { Product } from '@/types/product';

export const SIGNATURE_PRODUCTS: Product[] = [
  {
    id: 'thindi-chakkali-01',
    slug: 'traditional-hassan-chakkali',
    name: 'Traditional Hassan Chakkali',
    kannadaName: 'ಹಾಸನ ಚಕ್ಕುಲಿ',
    shortDescription:
      'Signature golden-brown spirals pressed through star apertures with toasted sesame, cumin, and cold-pressed oil.',
    fullDescription:
      'Handcrafted in small batches in Hassan using heirloom rice flour and roasted gram. Each spiral is fried gently to achieve a delicate crisp snap that melts cleanly on the palate without oiliness.',
    category: 'kuruk-thindi',
    categoryLabel: 'Signature Savouries',
    imageSrc: '/images/products/chakkali.jpg',
    imageAlt: 'Golden crisp spiral Chakkali arranged on brass platter with terracotta spice vessel',
    galleryImages: [
      '/images/products/chakkali.jpg',
      '/images/behind/macro-chakkali.jpg',
      '/images/categories/kuruk-thindi.jpg',
    ],
    origin: 'Hassan, Karnataka',
    ingredients: [
      'Heirloom rice flour',
      'Roasted gram (hurigadale)',
      'Toasted white sesame',
      'Cumin seeds',
      'Cold-pressed oil',
      'Rock salt',
    ],
    allergens: [
      'Contains Sesame seeds',
      'Processed in a traditional facility that also handles peanuts and tree nuts',
    ],
    storageInstructions:
      'Store in an airtight glass or steel tin in a cool, dry place away from direct sunlight. Do not refrigerate.',
    shelfLife: '60 days from dispatch',
    foodDeclaration:
      '100% Vegetarian artisan snack. Free from palm oil, artificial colors, or chemical preservatives.',
    storyTitle: 'A little story behind the crunch',
    storyContent:
      'In Hassan households, festive mornings always carry the unmistakable aroma of hot oil and roasting sesame. The brass mould—often passed down from grandmother to daughter—presses the dough into concentric star-edged spirals before descending into simmering cold-pressed oil.',
    relatedProductIds: ['thindi-kodubale-02', 'thindi-nippattu-03'],
    inStock: true,
    displayOrder: 1,
    keywords: ['chakkali', 'chakli', 'murukku', 'crunchy', 'savoury', 'hassan', 'sesame'],
    variants: [
      {
        id: 'chk-200g',
        sku: 'THN-CHK-200',
        weight: '200g',
        price: 125,
        available: true,
      },
      {
        id: 'chk-400g',
        sku: 'THN-CHK-400',
        weight: '400g',
        price: 240,
        available: true,
        isPopular: true,
      },
      {
        id: 'chk-1kg',
        sku: 'THN-CHK-1000',
        weight: '1kg Family Tin',
        price: 560,
        available: true,
      },
    ],
  },
  {
    id: 'thindi-kodubale-02',
    slug: 'crisp-ring-kodubale',
    name: 'Crisp Ring Kodubale',
    kannadaName: 'ಗರಿಗರಿ ಕೋಡುಬಳೆ',
    shortDescription:
      'Classic Karnataka snack rings rolled with fresh coconut, roasted ajwain, and crushed black peppercorns.',
    fullDescription:
      'A staple of Karnataka evening snack breaks. Hand-rolled into ring crescents and fried until fragrant, delivering an earthy aroma of ajwain, black pepper, and toasted coconut.',
    category: 'kuruk-thindi',
    categoryLabel: 'Crunchy Rings',
    imageSrc: '/images/products/kodubale.jpg',
    imageAlt: 'Crispy ring Kodubale stacked on a traditional terracotta plate',
    galleryImages: [
      '/images/products/kodubale.jpg',
      '/images/behind/macro-kodubale.jpg',
      '/images/categories/kuruk-thindi.jpg',
    ],
    origin: 'Hassan, Karnataka',
    ingredients: [
      'Stone-ground rice flour',
      'Grated coconut',
      'Ajwain (carom seeds)',
      'Crushed black pepper',
      'Hing (asafoetida)',
      'Cold-pressed oil',
      'Sea salt',
    ],
    allergens: [
      'Contains Coconut and Hing (Asafoetida)',
      'Manufactured in a kitchen handling sesame and peanuts',
    ],
    storageInstructions:
      'Store in a tightly sealed dry container. Protect from humidity to preserve signature snap.',
    shelfLife: '45 days from dispatch',
    foodDeclaration:
      'Traditional vegetarian snack. No synthetic preservatives or leavening agents used.',
    storyTitle: 'The ring that shaped tea-time conversations',
    storyContent:
      'Kodubale gets its name from the Kannada word "kodu" (horn or crescent) and "bale" (bangle). Hand-rolled individually into graceful rings, the secret lies in balancing stone-ground rice dough with freshly grated coconut and freshly crushed black pepper.',
    relatedProductIds: ['thindi-chakkali-01', 'thindi-nippattu-03'],
    inStock: true,
    displayOrder: 2,
    keywords: ['kodubale', 'kodu bale', 'rings', 'coconut', 'ajwain', 'pepper', 'crunchy'],
    variants: [
      {
        id: 'kod-200g',
        sku: 'THN-KOD-200',
        weight: '200g',
        price: 130,
        available: true,
      },
      {
        id: 'kod-400g',
        sku: 'THN-KOD-400',
        weight: '400g',
        price: 250,
        available: true,
        isPopular: true,
      },
    ],
  },
  {
    id: 'thindi-nippattu-03',
    slug: 'spiced-masala-nippattu',
    name: 'Spiced Masala Nippattu',
    kannadaName: 'ಖಾರ ನಿಪ್ಪಟ್ಟು',
    shortDescription:
      'Artisan flat savoury crackers studded with roasted peanuts, gram, and aromatic curry leaves.',
    fullDescription:
      'Hand-flattened with gentle pressure so every cracker holds a generous scattering of whole crunchy peanuts and fried curry leaves. Seasoned with vibrant Byadagi red chilli.',
    category: 'kuruk-thindi',
    categoryLabel: 'Spiced Crackers',
    imageSrc: '/images/products/nippattu.jpg',
    imageAlt: 'Crunchy flat Nippattu crackers with peanuts on fresh banana leaf',
    galleryImages: [
      '/images/products/nippattu.jpg',
      '/images/behind/macro-nippattu.jpg',
      '/images/closing/closing-platter.jpg',
    ],
    origin: 'Hassan, Karnataka',
    ingredients: [
      'Rice and roasted gram flour',
      'Whole roasted peanuts',
      'Fresh curry leaves',
      'Byadagi chilli powder',
      'White sesame',
      'Cold-pressed oil',
      'Salt',
    ],
    allergens: [
      'Contains Peanuts and Sesame seeds',
      'Produced in a facility processing tree nuts',
    ],
    storageInstructions:
      'Keep sealed in an airtight tin. Keep away from heat and moisture.',
    shelfLife: '60 days from dispatch',
    foodDeclaration:
      'Authentic vegetarian cracker snack. Crafted with cold-pressed oils and sun-dried Byadagi chillies.',
    storyTitle: 'Flattened by hand, rich with roasted peanuts',
    storyContent:
      'Unlike factory-extruded crackers, authentic Hassan nippattu requires the delicate touch of an experienced hand. Each round is pressed flat onto oil-smeared parchment, embedding whole roasted peanuts so every single bite yields distinct nutty crunch.',
    relatedProductIds: ['thindi-chakkali-01', 'thindi-kodubale-02'],
    inStock: true,
    displayOrder: 3,
    keywords: ['nippattu', 'chekkalu', 'peanuts', 'spicy', 'curry leaves', 'crackers'],
    variants: [
      {
        id: 'nip-200g',
        sku: 'THN-NIP-200',
        weight: '200g',
        price: 135,
        available: true,
      },
      {
        id: 'nip-400g',
        sku: 'THN-NIP-400',
        weight: '400g',
        price: 260,
        available: true,
        isPopular: true,
      },
    ],
  },
  {
    id: 'thindi-mango-uppinakai-04',
    slug: 'mavinkayi-tender-mango-pickle',
    name: 'Mavinkayi Mango Pickle',
    kannadaName: 'ಮಾವಿನಕಾಯಿ ಉಪ್ಪಿನಕಾಯಿ',
    shortDescription:
      'Hand-cut raw mango steeped in cold-pressed sesame oil, stone-ground mustard, and roasted fenugreek.',
    fullDescription:
      'Aged in traditional glazed ceramic bharani jars under the Hassan sun. Free from synthetic preservatives or vinegar, preserving the signature deep tang and fiery spice of Karnataka home pickle craft.',
    category: 'uppinakai',
    categoryLabel: 'Traditional Pickles',
    imageSrc: '/images/products/mango-uppinakai.jpg',
    imageAlt: 'Vibrant red-spiced green mango pickle glistening with sesame oil in a ceramic bowl',
    galleryImages: [
      '/images/products/mango-uppinakai.jpg',
      '/images/categories/uppinakai.jpg',
    ],
    origin: 'Hassan, Karnataka',
    ingredients: [
      'Raw green mangoes',
      'Cold-pressed sesame oil',
      'Stone-ground mustard (sasive)',
      'Roasted fenugreek (methi)',
      'Byadagi chilli',
      'Turmeric',
      'Sea salt',
    ],
    allergens: ['Contains Mustard and Sesame oil'],
    storageInstructions:
      'Use a clean, moisture-free dry spoon only. Ensure the surface remains coated in sesame oil. Store in a cool pantry.',
    shelfLife: '180 days from dispatch',
    foodDeclaration:
      'Traditional aged pickle. Zero vinegar, synthetic acids, or artificial colourings.',
    storyTitle: 'Bharani jars and sun-drenched verandas',
    storyContent:
      'Every summer in Hassan, firm raw green mangoes are hand-sliced and tossed with sea salt in stone bowls. Cured inside ceramic bharani jars and gently warmed by the sun, the spice blend matures into an intense condiment that elevates everyday curd rice.',
    relatedProductIds: ['thindi-nimbe-uppinakai-09', 'thindi-akki-sandige-07'],
    inStock: true,
    displayOrder: 4,
    keywords: ['mango pickle', 'uppinakai', 'achar', 'mavinkayi', 'tangy', 'sesame oil'],
    variants: [
      {
        id: 'mng-250g',
        sku: 'THN-MNG-250',
        weight: '250g Jar',
        price: 160,
        available: true,
      },
      {
        id: 'mng-500g',
        sku: 'THN-MNG-500',
        weight: '500g Jar',
        price: 300,
        available: true,
        isPopular: true,
      },
    ],
  },
];

export const ADDITIONAL_PRODUCTS: Product[] = [
  {
    id: 'thindi-obbattu-05',
    slug: 'traditional-bele-obbattu',
    name: 'Traditional Bele Obbattu',
    kannadaName: 'ಬೇಳೆ ಒಬ್ಬಟ್ಟು',
    shortDescription:
      'Delicate golden crêpes stuffed with sweet cardamom-infused jaggery and tender chana dal puran.',
    fullDescription:
      'A revered centerpiece of Karnataka festive feasts. Soft thin outer dough kneaded with patience, filled with rich organic jaggery puran and spiced with freshly ground cardamom, lightly pan-roasted with pure ghee.',
    category: 'sihi-thindi',
    categoryLabel: 'Festive Sweets',
    imageSrc: '/images/categories/sihi-thindi.jpg',
    imageAlt: 'Traditional Bele Obbattu golden crêpe lightly brushed with ghee on fresh banana leaf',
    galleryImages: [
      '/images/categories/sihi-thindi.jpg',
      '/images/festivals/festive-ugadi.jpg',
    ],
    origin: 'Hassan, Karnataka',
    ingredients: [
      'Chana dal (kadale bele)',
      'Organic jaggery',
      'Maida & chiroti rava',
      'Green cardamom',
      'Pure ghee',
      'Nutmeg',
    ],
    allergens: [
      'Contains Wheat/Gluten and Milk/Ghee',
      'Prepared in a traditional sweets facility',
    ],
    storageInstructions:
      'Keep in a cool dry place. Consume within 7 days, or warm gently on a tawa with ghee before serving.',
    shelfLife: '10 days from dispatch',
    foodDeclaration:
      'Festive sweet confection. Hand-rolled with pure ghee and chemical-free organic jaggery.',
    storyTitle: 'The crown of festive Karnataka meals',
    storyContent:
      'Obbattu (holige) is the soul of Ugadi, Ganesha Chaturthi, and family weddings across Karnataka. The slow-simmered jaggery and chana dal stuffing is wrapped inside paper-thin dough, roasted patiently, and served warm with a drizzle of melted ghee.',
    relatedProductIds: ['thindi-kajjaya-06', 'thindi-chakkali-01'],
    inStock: true,
    displayOrder: 5,
    keywords: ['obbattu', 'holige', 'sweet', 'jaggery', 'chana dal', 'ghee', 'sihi', 'puran poli'],
    variants: [
      {
        id: 'obb-4pk',
        sku: 'THN-OBB-4PK',
        weight: '4-Pack Box (240g)',
        price: 180,
        available: true,
        isPopular: true,
      },
      {
        id: 'obb-8pk',
        sku: 'THN-OBB-8PK',
        weight: '8-Pack Box (480g)',
        price: 340,
        available: true,
      },
    ],
  },
  {
    id: 'thindi-kajjaya-06',
    slug: 'authentic-rice-kajjaya',
    name: 'Authentic Rice Kajjaya',
    kannadaName: 'ಅಕ್ಕಿ ಕಜ್ಜಾಯ',
    shortDescription:
      'Deep golden traditional discs made with soaked rice flour and aged jaggery syrup, crisp outside with a soft, chewy heart.',
    fullDescription:
      'Prepared using time-tested Hassan confectionery techniques. Raw rice is soaked, pounded fresh, and simmered into bubbling jaggery syrup with white sesame and cardamom before frying into deep mahogany rounds.',
    category: 'sihi-thindi',
    categoryLabel: 'Heritage Confections',
    imageSrc: '/images/festivals/festive-ugadi.jpg',
    imageAlt: 'Authentic golden-brown Kajjaya sweets stacked on brass platter',
    galleryImages: [
      '/images/festivals/festive-ugadi.jpg',
      '/images/categories/sihi-thindi.jpg',
    ],
    origin: 'Hassan, Karnataka',
    ingredients: [
      'Soaked raw rice flour',
      'Aged dark jaggery',
      'White sesame seeds',
      'Green cardamom',
      'Cold-pressed groundnut oil',
    ],
    allergens: ['Contains Sesame seeds and Groundnut oil'],
    storageInstructions:
      'Store in an airtight container at room temperature. Does not require refrigeration.',
    shelfLife: '30 days from dispatch',
    foodDeclaration:
      'Traditional heritage confectionery made with natural unrefined jaggery.',
    storyTitle: 'Deep golden sweets from temple rituals to family teas',
    storyContent:
      'Kajjaya requires mastery of jaggery syrup temperature (paka). When the pounded soaked rice flour meets the aromatic syrup, it rests overnight to develop deep caramelized sweetness before frying to rich mahogany perfection.',
    relatedProductIds: ['thindi-obbattu-05', 'thindi-chakkali-01'],
    inStock: true,
    displayOrder: 6,
    keywords: ['kajjaya', 'athirasam', 'jaggery', 'rice', 'sweet', 'festival', 'sihi'],
    variants: [
      {
        id: 'kaj-250g',
        sku: 'THN-KAJ-250',
        weight: '250g Box',
        price: 160,
        available: true,
      },
      {
        id: 'kaj-500g',
        sku: 'THN-KAJ-500',
        weight: '500g Box',
        price: 300,
        available: true,
        isPopular: true,
      },
    ],
  },
  {
    id: 'thindi-akki-sandige-07',
    slug: 'sun-dried-akki-sandige',
    name: 'Sun-Dried Akki Sandige',
    kannadaName: 'ಅಕ್ಕಿ ಸಂಡಿಗೆ',
    shortDescription:
      'Traditional rice crisps pressed through decorative dies and sun-dried under open skies in Hassan.',
    fullDescription:
      'Cooked rice paste gently spiced with green chillies, cumin, and hing, pressed onto cotton sheets to bake under the warm Karnataka sun. Fries in seconds into feather-light, airy crisps.',
    category: 'appala-sandige',
    categoryLabel: 'Sun-Dried Crisps',
    imageSrc: '/images/categories/appala-sandige.jpg',
    imageAlt: 'Sun-dried Akki Sandige raw discs and fried airy white crisps in a bamboo sieve',
    galleryImages: [
      '/images/categories/appala-sandige.jpg',
      '/images/closing/closing-platter.jpg',
    ],
    origin: 'Hassan, Karnataka',
    ingredients: [
      'Raw rice',
      'Green chillies',
      'Cumin seeds',
      'Asafoetida (hing)',
      'Rock salt',
    ],
    allergens: ['Contains Asafoetida (Hing)'],
    storageInstructions:
      'Keep raw dried crisps in a sealed moisture-tight container. Fry in hot oil for 4–6 seconds before serving.',
    shelfLife: '365 days from dispatch',
    foodDeclaration:
      'Raw sun-dried rice accompaniment. Fry before consumption.',
    storyTitle: 'Sunlight captured on cotton cloth',
    storyContent:
      'Summer terraces in Hassan turn into tapestry of white ribbons as families cook rice paste seasoned with ground green chillies and cumin. Spread across clean white veshtis under the summer heat, the dried sandige blooms like flowers when touched by hot oil.',
    relatedProductIds: ['thindi-urad-appala-08', 'thindi-mango-uppinakai-04'],
    inStock: true,
    displayOrder: 7,
    keywords: ['sandige', 'fryums', 'rice', 'crisps', 'side', 'appala', 'vadam'],
    variants: [
      {
        id: 'snd-200g',
        sku: 'THN-SND-200',
        weight: '200g Pack',
        price: 110,
        available: true,
        isPopular: true,
      },
      {
        id: 'snd-400g',
        sku: 'THN-SND-400',
        weight: '400g Pack',
        price: 200,
        available: true,
      },
    ],
  },
  {
    id: 'thindi-urad-appala-08',
    slug: 'handmade-urad-appala',
    name: 'Handmade Urad Appala',
    kannadaName: 'ಉದ್ದಿನ ಅಪ್ಪಳ',
    shortDescription:
      'Thin spiced black gram discs rolled with cracked black pepper and crushed cumin, cured for delicate dining crunch.',
    fullDescription:
      'A beloved accompaniment to Karnataka bisi bele bath and rasam rice. Hand-kneaded with crushed Tellicherry black pepper and hing, rolled thin and sun-cured naturally without artificial bleaching agents.',
    category: 'appala-sandige',
    categoryLabel: 'Artisan Papadams',
    imageSrc: '/images/categories/appala-sandige.jpg',
    imageAlt: 'Crisp sun-dried Urad Appala discs stacked with whole black pepper corns',
    galleryImages: [
      '/images/categories/appala-sandige.jpg',
      '/images/categories/kuruk-thindi.jpg',
    ],
    origin: 'Hassan, Karnataka',
    ingredients: [
      'Stone-ground urad dal flour',
      'Crushed black peppercorns',
      'Cumin seeds',
      'Asafoetida',
      'Papad khar',
      'Salt',
    ],
    allergens: ['Contains Asafoetida and Black pepper'],
    storageInstructions:
      'Store in a sealed pouch away from air and moisture. Fry or roast over an open flame.',
    shelfLife: '180 days from dispatch',
    foodDeclaration:
      'Sun-cured traditional lentil papadam. Fry or roast before serving.',
    storyTitle: 'The satisfying crackle over lunch plates',
    storyContent:
      'No Karnataka festive lunch or Sunday rasam meal is complete without the snap of a freshly roasted urad appala. Hand-pounded black gram dough studded with coarse Tellicherry peppercorns offers robust, savoury pungency.',
    relatedProductIds: ['thindi-akki-sandige-07', 'thindi-mango-uppinakai-04'],
    inStock: true,
    displayOrder: 8,
    keywords: ['appala', 'happala', 'papad', 'urad dal', 'pepper', 'bisi bele bath'],
    variants: [
      {
        id: 'app-200g',
        sku: 'THN-APP-200',
        weight: '200g Pack',
        price: 115,
        available: true,
        isPopular: true,
      },
      {
        id: 'app-500g',
        sku: 'THN-APP-500',
        weight: '500g Family Pack',
        price: 260,
        available: true,
      },
    ],
  },
  {
    id: 'thindi-nimbe-uppinakai-09',
    slug: 'heritage-nimbe-lemon-pickle',
    name: 'Heritage Nimbe Lemon Pickle',
    kannadaName: 'ನಿಂಬೆಹಣ್ಣಿನ ಉಪ್ಪಿನಕಾಯಿ',
    shortDescription:
      'Plump native country lemons salt-cured in ceramic bharani jars with Byadagi chilli, mustard, and roasted fenugreek.',
    fullDescription:
      'Whole fresh country lemons quartered and cured in mineral salt for months until the rind softens completely. Tossed in hot cold-pressed sesame oil with freshly crushed mustard and fragrant roasted methi seeds.',
    category: 'uppinakai',
    categoryLabel: 'Sun-Matured Pickles',
    imageSrc: '/images/categories/uppinakai.jpg',
    imageAlt: 'Glossy red-spiced Nimbe lemon pickle pieces in traditional ceramic bharani jar',
    galleryImages: [
      '/images/categories/uppinakai.jpg',
      '/images/products/mango-uppinakai.jpg',
    ],
    origin: 'Hassan, Karnataka',
    ingredients: [
      'Native country lemons',
      'Cold-pressed sesame oil',
      'Byadagi chilli powder',
      'Mustard seeds',
      'Roasted fenugreek',
      'Rock salt',
    ],
    allergens: ['Contains Mustard and Sesame oil'],
    storageInstructions:
      'Always use a dry spoon. Keep oil layer intact. Store in cool, dark pantry.',
    shelfLife: '365 days from dispatch',
    foodDeclaration:
      'Aged lemon pickle preserved with pure sesame oil and mineral rock salt.',
    storyTitle: 'Patience, sunshine, and ceramic jars',
    storyContent:
      'Native country lemons with thin golden rinds are hand-selected, quartered, and steeped in rock salt. Over months of peaceful maturation inside ceramic jars, the bitterness mellows into rich tangy complexity that only age can impart.',
    relatedProductIds: ['thindi-mango-uppinakai-04', 'thindi-akki-sandige-07'],
    inStock: true,
    displayOrder: 9,
    keywords: ['pickle', 'uppinakai', 'nimbe', 'lemon', 'tangy', 'spicy', 'bharani'],
    variants: [
      {
        id: 'lmn-250g',
        sku: 'THN-LMN-250',
        weight: '250g Jar',
        price: 150,
        available: true,
        isPopular: true,
      },
      {
        id: 'lmn-500g',
        sku: 'THN-LMN-500',
        weight: '500g Jar',
        price: 280,
        available: true,
      },
    ],
  },
];

export const ALL_SHOP_PRODUCTS: Product[] = [
  ...SIGNATURE_PRODUCTS,
  ...ADDITIONAL_PRODUCTS,
];

export function getAllShopProducts(): Product[] {
  return [...ALL_SHOP_PRODUCTS].sort(
    (a, b) => (a.displayOrder || 99) - (b.displayOrder || 99)
  );
}

/**
 * Resolves a product by slug, ID, or short canonical name.
 * Supports /products/traditional-hassan-chakkali, /products/chakkali, etc.
 */
export function getProductBySlug(slug: string): Product | undefined {
  if (!slug) return undefined;
  const normalized = slug.toLowerCase().trim();

  // 1. Direct slug match
  const directMatch = ALL_SHOP_PRODUCTS.find(
    (p) => p.slug.toLowerCase() === normalized || p.id.toLowerCase() === normalized
  );
  if (directMatch) return directMatch;

  // 2. Short alias match (e.g. "chakkali", "kodubale", "nippattu")
  return ALL_SHOP_PRODUCTS.find((p) => {
    const slugParts = p.slug.split('-');
    const shortName = slugParts[slugParts.length - 1]; // "chakkali", "kodubale", etc.
    if (shortName === normalized) return true;
    if (p.slug.toLowerCase().includes(normalized)) return true;
    return false;
  });
}

/**
 * Returns all valid product slugs for static route generation.
 */
export function getAllProductSlugs(): string[] {
  const slugs: string[] = [];
  ALL_SHOP_PRODUCTS.forEach((p) => {
    slugs.push(p.slug);
    const shortName = p.slug.split('-').pop();
    if (shortName && shortName !== p.slug && !slugs.includes(shortName)) {
      slugs.push(shortName);
    }
  });
  return slugs;
}

/**
 * Resolves related products for complementary discovery
 */
export function getRelatedProducts(product: Product): Product[] {
  if (product.relatedProductIds && product.relatedProductIds.length > 0) {
    const related = ALL_SHOP_PRODUCTS.filter((p) =>
      product.relatedProductIds?.includes(p.id)
    );
    if (related.length > 0) return related;
  }
  // Fallback: items in the same category or overall catalogue, excluding current
  return ALL_SHOP_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);
}
