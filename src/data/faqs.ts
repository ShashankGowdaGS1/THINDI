import { FAQItem } from '../types/faq';

/**
 * FAQ Knowledge Base for THINDI
 * Contains customer questions with editorial tone, regional accuracy,
 * and strict verification status.
 *
 * UNAPPROVED or DRAFT policies must have `published: false` so they never
 * appear in production without sign-off.
 */
export const faqs: FAQItem[] = [
  {
    id: 'origin-hassan',
    question: 'Where is THINDI based?',
    kannadaQuestion: 'ತಿಂಡಿ ಎಲ್ಲಿಂದ ಶುರುವಾಯಿತು?',
    answer: 'THINDI is a Karnataka traditional-food brand originating from Hassan, Karnataka.',
    kannadaAnswer: 'ತಿಂಡಿ ಕರ್ನಾಟಕದ ಹಾಸನದಿಂದ ಶುರುವಾದ ಸಾಂಪ್ರದಾಯಿಕ ಆಹಾರ ಬ್ರ್ಯಾಂಡ್ ಆಗಿದೆ.',
    category: 'origin',
    published: true,
    displayOrder: 1,
    updatedAt: '2026-11-02',
  },
  {
    id: 'delivery-karnataka',
    question: 'Do you deliver across Karnataka?',
    kannadaQuestion: 'ಕರ್ನಾಟಕದಾದ್ಯಂತ ಡೆಲಿವರಿ ಲಭ್ಯವಿದೆಯೇ?',
    answer: 'THINDI plans distribution across Karnataka, with actual delivery availability depending on your destination and products ordered. You can check serviceability for your area using our delivery checker.',
    kannadaAnswer: 'ತಿಂಡಿ ಕರ್ನಾಟಕದಾದ್ಯಂತ ವಿತರಣೆಯನ್ನು ಯೋಜಿಸಿದೆ. ನಿಮ್ಮ ಊರಿಗೆ ಡೆಲಿವರಿ ಲಭ್ಯತೆಯನ್ನು ನಮ್ಮ ಪಿನ್‌ಕೋಡ್ ಪರೀಕ್ಷಕದಲ್ಲಿ ನೋಡಬಹುದು.',
    category: 'shipping',
    published: true,
    displayOrder: 2,
    relatedRoute: '#doorstep-delivery',
    updatedAt: '2026-11-02',
  },
  {
    id: 'ingredients-allergens',
    question: 'How can I check ingredients and allergens?',
    kannadaQuestion: 'ಪದಾರ್ಥಗಳು ಮತ್ತು ಅಲರ್ಜಿನ್ ವಿವರಗಳನ್ನು ಹೇಗೆ ಪರಿಶೀಲಿಸಬಹುದು?',
    answer: 'Ingredient and allergen information is specific to each product. Please check the product details and packaging information before ordering.',
    kannadaAnswer: 'ಪ್ರತಿಯೊಂದು ತಿಂಡಿಯ ಪದಾರ್ಥಗಳು ಮತ್ತು ಅಲರ್ಜಿ ವಿವರಗಳನ್ನು ಆಯಾ ಉತ್ಪನ್ನದ ವಿವರಣೆ ಹಾಗೂ ಪ್ಯಾಕೇಜ್‌ನಲ್ಲಿ ನೀಡಲಾಗಿದೆ.',
    category: 'ingredients',
    published: true,
    displayOrder: 3,
    relatedRoute: '#signature-picks',
    updatedAt: '2026-11-02',
  },
  {
    id: 'storage-guidance',
    question: 'How should I store my THINDI products?',
    kannadaQuestion: 'ತಿಂಡಿಗಳನ್ನು ಹೇಗೆ ಸಂಗ್ರಹಿಸಬೇಕು?',
    answer: 'Storage requirements vary by item. Dry snacks like chakkali and nippattu are best kept in a dry container away from direct sunlight, while traditional pickles require clean, moisture-free spoons. Specific verified storage instructions are printed on each pack.',
    kannadaAnswer: 'ಚಕ್ಕುಲಿ, ನಿಪ್ಪಟ್ಟಿನಂತಹ ಗರಿಗರಿ ತಿಂಡಿಗಳನ್ನು ತೇವಾಂಶವಿಲ್ಲದ ಪಾತ್ರೆಯಲ್ಲಿ ಗಾಳಿಯಾಡದಂತೆ ಇಡಿ. ಪ್ರತಿ ಪ್ಯಾಕ್ ಮೇಲೆ ಸಂಗ್ರಹಣಾ ನಿಯಮಗಳನ್ನು ನೀಡಲಾಗಿದೆ.',
    category: 'storage',
    published: true,
    displayOrder: 4,
    updatedAt: '2026-11-02',
  },
  {
    id: 'delivery-timelines',
    question: 'How long does delivery take?',
    kannadaQuestion: 'ಡೆಲಿವರಿ ಎಷ್ಟು ದಿನಗಳಲ್ಲಿ ತಲುಪುತ್ತದೆ?',
    answer: 'Estimated delivery timelines will be calculated and displayed once specific regional shipping routes and courier partner schedules are activated for your pincode.',
    kannadaAnswer: 'ನಿಮ್ಮ ಪಿನ್‌ಕೋಡ್‌ಗೆ ಕೊರಿಯರ್ ಪಾಲುದಾರರ ಮಾರ್ಗಗಳು ಸಕ್ರಿಯಗೊಂಡ ನಂತರ ನಿಖರವಾದ ಡೆಲಿವರಿ ಸಮಯವನ್ನು ತೋರಿಸಲಾಗುತ್ತದೆ.',
    category: 'shipping',
    published: true,
    displayOrder: 5,
    relatedRoute: '#doorstep-delivery',
    updatedAt: '2026-11-02',
  },
  {
    id: 'damaged-items-policy',
    question: 'What if a product arrives damaged?',
    kannadaQuestion: 'ಉತ್ಪನ್ನ ಹಾನಿಗೊಳಗಾದರೆ ಏನು ಮಾಡುವುದು?',
    answer: '[Draft Policy] A formal damaged-goods replacement and claims policy is currently under internal review by THINDI operations. Details will be published upon approval before live commerce operations commence.',
    kannadaAnswer: '[ಕರಡು ನೀತಿ] ಹಾನಿಗೊಳಗಾದ ಉತ್ಪನ್ನಗಳ ಬದಲಾವಣೆ ನೀತಿಯನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ.',
    category: 'policy',
    published: false, // DRAFT: Awaiting business policy approval - not shown to customers
    displayOrder: 6,
    updatedAt: '2026-11-02',
  },
  {
    id: 'celebration-gifting-boxes',
    question: 'Can I order THINDI boxes for celebrations?',
    kannadaQuestion: 'ಹಬ್ಬ ಅಥವಾ ಸಮಾರಂಭಗಳಿಗೆ ತಿಂಡಿ ಬಾಕ್ಸ್‌ಗಳನ್ನು ಆರ್ಡರ್ ಮಾಡಬಹುದೇ?',
    answer: 'Yes, THINDI Box curated bundles are designed for festive gifting and family celebrations. For large family gatherings or corporate gifting, you can explore our gift bundles or submit a bulk enquiry.',
    kannadaAnswer: 'ಹೌದು, ಹಬ್ಬದ ಸಂಭ್ರಮ ಹಾಗೂ ಉಡುಗೊರೆಗಾಗಿ ವಿಶೇಷ ತಿಂಡಿ ಬಾಕ್ಸ್‌ಗಳನ್ನು ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ. ದೊಡ್ಡ ಸಮಾರಂಭಗಳಿಗೆ ಬಲ್ಕ್ ವಿಚಾರಣೆ ಸಲ್ಲಿಸಬಹುದು.',
    category: 'gifting',
    published: true,
    displayOrder: 7,
    relatedRoute: '#thindi-box',
    updatedAt: '2026-11-02',
  },
  {
    id: 'contact-inquiry',
    question: 'How can I contact THINDI?',
    kannadaQuestion: 'ತಿಂಡಿ ತಂಡವನ್ನು ಹೇಗೆ ಸಂಪರ್ಕಿಸಬಹುದು?',
    answer: 'You can reach out through our contact enquiry form right here on the website. As our kitchen and distribution operations are based in Hassan, we respond directly to every genuine enquiry.',
    kannadaAnswer: 'ನೀವು ನಮ್ಮ ವೆಬ್‌ಸೈಟ್ ಮೂಲಕವೇ ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸಬಹುದು. ಹಾಸನದಲ್ಲಿರುವ ನಮ್ಮ ಕೇಂದ್ರ ತಂಡವು ಪ್ರತಿಯೊಂದು ವಿಚಾರಣೆಗೂ ಪ್ರತ್ಯುತ್ತರ ನೀಡುತ್ತದೆ.',
    category: 'contact',
    published: true,
    displayOrder: 8,
    updatedAt: '2026-11-02',
  },
  {
    id: 'payment-methods-accepted',
    question: 'What payment methods do you accept?',
    kannadaQuestion: 'ಯಾವ ಪಾವತಿ ವಿಧಾನಗಳನ್ನು ಸ್ವೀಕರಿಸುತ್ತೀರಿ?',
    answer: 'We accept all major secure payment methods via Razorpay, including UPI (Google Pay, PhonePe, Paytm, BHIM), debit/credit cards, and Net Banking from all Indian banks.',
    kannadaAnswer: 'ನಾವು ಯುಪಿಐ (PhonePe, GPay, Paytm), ಡೆಬಿಟ್/ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್‌ಗಳು ಮತ್ತು ನೆಟ್ ಬ್ಯಾಂಕಿಂಗ್ ಮೂಲಕ ಸುರಕ್ಷಿತ ಪಾವತಿಗಳನ್ನು ಸ್ವೀಕರಿಸುತ್ತೇವೆ.',
    category: 'orders',
    published: true,
    displayOrder: 9,
    updatedAt: '2026-11-03',
  },
  {
    id: 'track-live-shipment',
    question: 'How do I track my delivery status?',
    kannadaQuestion: 'ನನ್ನ ಆರ್ಡರ್‌ನ ಸ್ಥಿತಿಯನ್ನು ಹೇಗೆ ತಿಳಿಯುವುದು?',
    answer: 'You can securely track your order at any time on our Track Order page using your unique order reference (e.g. THN-2026-XXXX) and phone/email verification.',
    kannadaAnswer: 'ನಿಮ್ಮ ಆರ್ಡರ್ ಸಂಖ್ಯೆಯನ್ನು ಬಳಸಿ ನಮ್ಮ ವೆಬ್‌ಸೈಟ್‌ನ "Track Order" ವಿಭಾಗದಲ್ಲಿ ನೇರ ಡೆಲಿವರಿ ಹಂತಗಳನ್ನು ವೀಕ್ಷಿಸಬಹುದು.',
    category: 'orders',
    published: true,
    displayOrder: 10,
    updatedAt: '2026-11-03',
  },
];

/**
 * Returns only verified, published FAQ items ordered by displayOrder.
 * Filters out internal drafts and unverified policy proposals.
 */
export function getPublishedFaqs(): FAQItem[] {
  return faqs
    .filter((item) => item.published === true)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Returns all FAQs, useful for preview or administration interfaces.
 */
export function getAllFaqs(): FAQItem[] {
  return [...faqs].sort((a, b) => a.displayOrder - b.displayOrder);
}

