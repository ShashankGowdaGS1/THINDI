import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/data/siteConfig';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();
  const isPreview = process.env.VERCEL_ENV === 'preview';

  // Prevent preview deployments from competing with production URLs in search index
  if (isPreview) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/checkout/',
        '/order-confirmation/',
        '/orders/',
        '/api/',
        '/cart/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
