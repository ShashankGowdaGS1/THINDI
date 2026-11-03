export interface BehindEveryBiteItem {
  id: string;
  number: string;
  name: string;
  kannadaName: string;
  editorialDescription: string;
  imageSrc: string;
  imageAlt: string;
  productId: string;
  verifiedDetails: {
    textureProfile: string;
    kannadaTexture: string;
    keyIngredients: string[];
    packSizes: string[];
    storageGuidance: string;
    origin: string;
  };
}

export const BEHIND_EVERY_BITE_ITEMS: BehindEveryBiteItem[] = [
  {
    id: 'chakkali',
    number: '01',
    name: 'Chakkali',
    kannadaName: 'ಚಕ್ಕಲಿ',
    editorialDescription:
      'The unmistakable spiral and ridged shape of a Karnataka favourite.',
    imageSrc: '/images/behind/macro-chakkali.jpg',
    imageAlt: 'Macro photograph of authentic golden-brown chakkali spiral with fine star-ridged crispy surface',
    productId: 'thindi-chakkali-01',
    verifiedDetails: {
      textureProfile: 'Continuous concentric ridges extruded through star apertures; delicate crisp snap',
      kannadaTexture: 'ನಕ್ಷತ್ರ ಮೊಗ್ಗು · ಗರಿಗರಿ ಸುತ್ತು',
      keyIngredients: [
        'Heirloom rice flour',
        'Roasted gram (hurigadale)',
        'Toasted white sesame',
        'Cumin seeds',
        'Vegetable oil',
        'Rock salt',
      ],
      packSizes: ['200g', '400g', '1kg Family Tin'],
      storageGuidance: 'Keep in an airtight container away from direct sunlight after opening',
      origin: 'Hassan, Karnataka',
    },
  },
  {
    id: 'kodubale',
    number: '02',
    name: 'Kodubale',
    kannadaName: 'ಕೋಡುಬಳೆ',
    editorialDescription:
      'A familiar ring-shaped savoury snack with a distinctive golden finish.',
    imageSrc: '/images/behind/macro-kodubale.jpg',
    imageAlt: 'Macro photograph of golden-brown ring-shaped kodubale showing roasted ajwain and crushed black pepper',
    productId: 'thindi-kodubale-02',
    verifiedDetails: {
      textureProfile: 'Firm, crunchy crescent ring with roasted coconut and cracked pepper aroma',
      kannadaTexture: 'ಬಳೆ ಆಕಾರ · ಘಮಘಮಿಸುವ ಅಜ್ವಾನ',
      keyIngredients: [
        'Stone-ground rice flour',
        'Fresh grated coconut',
        'Ajwain (carom seeds)',
        'Crushed black pepper',
        'Hing (asafoetida)',
        'Vegetable oil',
        'Sea salt',
      ],
      packSizes: ['200g', '400g'],
      storageGuidance: 'Store in a cool, dry place in a sealed container to retain crunch',
      origin: 'Hassan, Karnataka',
    },
  },
  {
    id: 'nippattu',
    number: '03',
    name: 'Nippattu',
    kannadaName: 'ನಿಪ್ಪಟ್ಟು',
    editorialDescription:
      'A traditional flat savoury cracker with a characteristically textured surface.',
    imageSrc: '/images/behind/macro-nippattu.jpg',
    imageAlt: 'Macro photograph of artisanal flat nippattu cracker studded with roasted whole peanuts and curry leaves',
    productId: 'thindi-nippattu-03',
    verifiedDetails: {
      textureProfile: 'Hand-flattened crispy disc with uneven artisanal edges and whole roasted peanut crunch',
      kannadaTexture: 'ಕೈಯಿಂದ ತಟ್ಟಿದ ಹಪ್ಪಳ · ಕಡಲೆಕಾಯಿ ಗರಿಗರಿ',
      keyIngredients: [
        'Rice & roasted gram flour',
        'Whole roasted peanuts',
        'Fresh curry leaves',
        'Byadagi chilli powder',
        'White sesame',
        'Vegetable oil',
        'Salt',
      ],
      packSizes: ['200g', '400g'],
      storageGuidance: 'Reseal tightly after opening to preserve the roasted peanut crunch',
      origin: 'Hassan, Karnataka',
    },
  },
];

