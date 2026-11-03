export type CampaignId = 'ugadi' | 'deepavali' | 'everyday';

export interface CampaignTheme {
  bgClass: string;
  cardBgClass: string;
  textHeading: string;
  textMuted: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  borderClass: string;
}

export interface FestivalCampaign {
  id: CampaignId;
  slug: string;
  indexNumber: string;
  name: string;
  kannadaName: string;
  eyebrow: string;
  headlineLine1: string;
  headlineLine2: string;
  description: string;
  kannadaAccent: string;
  ctaText: string;
  ctaLink: string;
  heroImage: string;
  imageAlt: string;
  theme: CampaignTheme;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  isEvergreen: boolean;
  statusText: string;
}

