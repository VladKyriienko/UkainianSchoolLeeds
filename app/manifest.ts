import type { MetadataRoute } from 'next';

const THEME_COLOR = '#2563EB';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ukrainian Saturday School of Leeds',
    short_name: 'Ukrainia School',
    description:
      'Ukrainian Saturday School of Leeds — school for Ukrainian children.',
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: THEME_COLOR,
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png'
      },
      {
        src: '/icons/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ]
  };
}
