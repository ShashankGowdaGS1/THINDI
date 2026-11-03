import { ThindiBundle } from '@/types/bundle';

export const THINDI_BUNDLES: ThindiBundle[] = [
  {
    id: 'thindi-box-tea-time',
    sku: 'THN-BOX-TEA',
    name: 'The Tea-Time Box',
    kannadaName: 'ನಾಲ್ಕು ಗಂಟೆ ತಿಂಡಿ ಬಾಕ್ಸ್',
    shortDescription:
      'The essential 4 PM Karnataka snack trio. Spiral chakkali, ring kodubale, and crisp masala nippattu.',
    fullDescription:
      'Curated for cozy evening tea moments. Three quintessential Hassan homemade snacks packed in sealed pouches to preserve crispiness. Prepared with roasted stone-ground spices and time-honoured culinary methods.',
    price: 420,
    available: true,
    itemCount: 3,
    totalWeight: '600g net assortment',
    imageSrc: '/images/box/thindi-box.jpg',
    imageAlt: 'The Tea-Time Box: an open cream gift carton featuring sealed packs of Chakkali, Kodubale and Nippattu',
    contents: [
      {
        name: 'Traditional Hassan Chakkali',
        kannadaName: 'ಹಾಸನ ಚಕ್ಕುಲಿ',
        weight: '200g',
        quantity: 1,
        description: 'Golden spiral crisps extruded through star aperture with sesame and cumin.',
      },
      {
        name: 'Crisp Ring Kodubale',
        kannadaName: 'ಗರಿಗರಿ ಕೋಡುಬಳೆ',
        weight: '200g',
        quantity: 1,
        description: 'Crescent rings rolled with fresh coconut, roasted ajwain and black pepper.',
      },
      {
        name: 'Spiced Masala Nippattu',
        kannadaName: 'ಖಾರ ನಿಪ್ಪಟ್ಟು',
        weight: '200g',
        quantity: 1,
        description: 'Flat savory crackers studded with roasted whole peanuts and curry leaves.',
      },
    ],
    highlights: [
      '3 Signature Snack Packs (600g total)',
      'Curated trio of regional Karnataka savouries',
      'Airtight pouches to preserve crispness',
      'Prepared with traditional Hassan recipes',
    ],
    allergens: 'Contains Sesame, Peanuts. Naturally vegetarian.',
  },
  {
    id: 'thindi-box-family',
    sku: 'THN-BOX-FAM',
    name: 'The Family Thindi Box',
    kannadaName: 'ಕುಟುಂಬದ ತಿಂಡಿ ಬಾಕ್ಸ್',
    shortDescription:
      'A generous pantry curation for the entire family. Savouries, rings, and sun-dried crunch.',
    fullDescription:
      'Designed for family gatherings, weekend snacking, and unexpected guests. Features generous 400g packs of our three signature savouries plus artisanal sun-dried rice and sago sandige ready to fry.',
    price: 780,
    available: true,
    itemCount: 4,
    totalWeight: '1.4kg net assortment',
    imageSrc: '/images/box/thindi-box.jpg',
    imageAlt: 'The Family Thindi Box: a large gift box containing family packs of Karnataka traditional savouries',
    contents: [
      {
        name: 'Traditional Hassan Chakkali',
        kannadaName: 'ಹಾಸನ ಚಕ್ಕುಲಿ',
        weight: '400g',
        quantity: 1,
        description: 'Full family pack of crisp, star-ridged spirals.',
      },
      {
        name: 'Crisp Ring Kodubale',
        kannadaName: 'ಗರಿಗರಿ ಕೋಡುಬಳೆ',
        weight: '400g',
        quantity: 1,
        description: 'Generous pack of coconut and ajwain rings.',
      },
      {
        name: 'Spiced Masala Nippattu',
        kannadaName: 'ಖಾರ ನಿಪ್ಪಟ್ಟು',
        weight: '400g',
        quantity: 1,
        description: 'Crunchy peanut and curry-leaf flat crackers.',
      },
      {
        name: 'Artisanal Puffed Sandige',
        kannadaName: 'ಊಟದ ಸಂಡಿಗೆ',
        weight: '200g',
        quantity: 1,
        description: 'Sun-dried Karnataka fryums ready to crisp.',
      },
    ],
    highlights: [
      '4 Generous Family Packs (1.4kg total)',
      'Perfect for household snacking & pantry reserves',
      'Hand-pressed in Hassan kitchens',
      'Kraft gifting box with divider packaging',
    ],
    allergens: 'Contains Sesame, Peanuts. Naturally vegetarian.',
  },
  {
    id: 'thindi-box-celebration',
    sku: 'THN-BOX-CEL',
    name: 'The Celebration Box',
    kannadaName: 'ಹಬ್ಬದ ಸಂಭ್ರಮ ಬಾಕ್ಸ್',
    shortDescription:
      'A festive assortment balancing golden crunch, traditional sweets, and aged mango pickle.',
    fullDescription:
      'A complete celebratory gifting curation. Combines the crunch of Hassan savouries with a jar of raw mango pickle aged in ceramic bharani and traditional long-shelf-life kajjaya sweets.',
    price: 950,
    available: true,
    itemCount: 5,
    totalWeight: '1.15kg net assortment',
    imageSrc: '/images/box/thindi-box.jpg',
    imageAlt: 'The Celebration Box: a festive assortment of sweets, pickles, and savouries',
    contents: [
      {
        name: 'Traditional Hassan Chakkali',
        kannadaName: 'ಹಾಸನ ಚಕ್ಕುಲಿ',
        weight: '200g',
        quantity: 1,
        description: 'Signature crispy spiral savouries.',
      },
      {
        name: 'Crisp Ring Kodubale',
        kannadaName: 'ಗರಿಗರಿ ಕೋಡುಬಳೆ',
        weight: '200g',
        quantity: 1,
        description: 'Traditional coconut-ajwain rings.',
      },
      {
        name: 'Spiced Masala Nippattu',
        kannadaName: 'ಖಾರ ನಿಪ್ಪಟ್ಟು',
        weight: '200g',
        quantity: 1,
        description: 'Crushed peanut flat crackers.',
      },
      {
        name: 'Mavinkayi Mango Pickle (Jar)',
        kannadaName: 'ಮಾವಿನಕಾಯಿ ಉಪ್ಪಿನಕಾಯಿ',
        weight: '250g Jar',
        quantity: 1,
        description: 'Aged in ceramic bharani with traditional sesame oil.',
      },
      {
        name: 'Traditional Festive Kajjaya',
        kannadaName: 'ಪಾರಂಪರಿಕ ಕಜ್ಜಾಯ',
        weight: '250g',
        quantity: 1,
        description: 'Ghee-fried jaggery and rice flour celebration sweet.',
      },
    ],
    highlights: [
      '5 Festive Curations (1.15kg total)',
      'Includes Ceramic Jar of Mavinkayi Uppinakai',
      'Balanced sweet, spicy & crunchy profile',
      'Festive gift packaging with auspicious turmeric notes',
    ],
    allergens: 'Contains Sesame, Peanuts, Ghee. Naturally vegetarian.',
  },
];

