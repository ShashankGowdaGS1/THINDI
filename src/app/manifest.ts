import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'THINDI | Traditional Karnataka Snacks',
    short_name: 'THINDI',
    description:
      'A little crunch. A lot of Karnataka. Authentic chakkali, kodubale, nippattu, obbattu and traditional homemade flavours originating from Hassan, Karnataka.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F0E3',
    theme_color: '#F7F0E3',
    icons: [
      {
        src: '/images/favicon-32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/images/favicon-48.png',
        sizes: '48x48',
        type: 'image/png',
      },
      {
        src: '/images/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}

