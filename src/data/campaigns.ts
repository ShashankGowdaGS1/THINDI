import { FestivalCampaign, CampaignId } from '@/types/campaign';

export const FESTIVAL_CAMPAIGNS: FestivalCampaign[] = [
  {
    id: 'ugadi',
    slug: 'ugadi',
    indexNumber: '01',
    name: 'Ugadi',
    kannadaName: 'ಯುಗಾದಿ',
    eyebrow: 'SPRING RENEWAL · ವಸಂತ ಋತು',
    headlineLine1: 'New beginnings.',
    headlineLine2: 'Familiar flavours.',
    description:
      'Spring brings the sweet warmth of obbattu and fresh beginnings. Celebrated with traditional Karnataka sweetness, loved ones, and the simple joy of sharing.',
    kannadaAccent: 'ಯುಗಾದಿ ಹಬ್ಬದ ಶುಭಾಶಯಗಳು',
    ctaText: 'Explore Festive Sweets',
    ctaLink: '#shop-by-craving',
    heroImage: '/images/festivals/festive-ugadi.jpg',
    imageAlt: 'Golden traditional obbattu holige on banana leaf with brass bowl and jaggery',
    startDate: '2027-03-20',
    endDate: '2027-04-10',
    isEvergreen: false,
    statusText: 'Seasonal Spring Festival',
    theme: {
      bgClass: 'bg-cream text-jaggery',
      cardBgClass: 'bg-cream-light border-leaf/30',
      textHeading: 'text-leaf',
      textMuted: 'text-jaggery-muted',
      accentColor: '#365541',
      badgeBg: 'bg-leaf/15 border-leaf/25',
      badgeText: 'text-leaf',
      borderClass: 'border-leaf/20',
    },
  },
  {
    id: 'deepavali',
    slug: 'deepavali',
    indexNumber: '02',
    name: 'Deepavali',
    kannadaName: 'ದೀಪಾವಳಿ',
    eyebrow: 'FESTIVAL OF LIGHTS · ಬೆಳಕಿನ ಹಬ್ಬ',
    headlineLine1: 'More joy in',
    headlineLine2: 'every bite.',
    description:
      'The festival of lights meets the unmistakable crunch of Hassan chakkali, kodubale, and nippattu shared warmly across generations.',
    kannadaAccent: 'ದೀಪಾವಳಿ ಹಬ್ಬದ ಶುಭಾಶಯಗಳು',
    ctaText: 'Explore Deepavali Savouries',
    ctaLink: '#signature-picks',
    heroImage: '/images/festivals/festive-deepavali.jpg',
    imageAlt: 'Golden spiral chakkali and savoury snacks in brass vessels with warm festive lamps',
    startDate: '2026-10-25',
    endDate: '2026-11-15',
    isEvergreen: false,
    statusText: 'Festive Season Feature',
    theme: {
      bgClass: 'bg-chilli text-cream',
      cardBgClass: 'bg-cream-light text-jaggery border-jaggery/15',
      textHeading: 'text-cream',
      textMuted: 'text-cream/80',
      accentColor: '#E8B54B',
      badgeBg: 'bg-cream/15 border-cream/25',
      badgeText: 'text-turmeric',
      borderClass: 'border-cream/20',
    },
  },
  {
    id: 'everyday',
    slug: 'every-celebration',
    indexNumber: '03',
    name: 'Every Celebration',
    kannadaName: 'ನಿತ್ಯ ಸಂಭ್ರಮ',
    eyebrow: 'THINDI CELEBRATIONS · ಹಬ್ಬದ ಸಂಭ್ರಮ',
    headlineLine1: 'Every habba',
    headlineLine2: 'deserves good thindi.',
    description:
      'The familiar flavours, the happy gatherings, and the little things we love sharing. From Sunday tea to family celebrations across Karnataka.',
    kannadaAccent: 'ಹಬ್ಬದ ಸಂಭ್ರಮ, ತಿಂಡಿಯ ಸವಿ.',
    ctaText: 'Explore Festive Favourites',
    ctaLink: '#signature-picks',
    heroImage: '/images/festivals/festive-everyday.jpg',
    imageAlt: 'Authentic Karnataka traditional snack assortment in warm home dining setting',
    isEvergreen: true,
    statusText: 'Year-Round Celebration',
    theme: {
      bgClass: 'bg-cream text-jaggery',
      cardBgClass: 'bg-cream-light border-jaggery/15',
      textHeading: 'text-jaggery',
      textMuted: 'text-jaggery-muted',
      accentColor: '#A43D2E',
      badgeBg: 'bg-cream-dark border-jaggery/20',
      badgeText: 'text-chilli',
      borderClass: 'border-jaggery/15',
    },
  },
];

/**
 * Evaluates current date in Asia/Kolkata timezone to determine active seasonal campaign.
 * Defaults reliably to 'everyday' if no seasonal campaign is active.
 */
export function determineActiveCampaign(currentDate: Date = new Date()): CampaignId {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const kolkataDateStr = formatter.format(currentDate); // YYYY-MM-DD

    for (const campaign of FESTIVAL_CAMPAIGNS) {
      if (!campaign.isEvergreen && campaign.startDate && campaign.endDate) {
        if (kolkataDateStr >= campaign.startDate && kolkataDateStr <= campaign.endDate) {
          return campaign.id;
        }
      }
    }
  } catch {
    // ignore formatting errors
  }

  return 'everyday';
}

