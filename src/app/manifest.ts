import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Taskkeeper',
    short_name: 'Taskkeeper',
    description: "Know what you're owe.",
    start_url: '/',
    display: 'standalone',
    background_color: '#004952',
    theme_color: '#f7f6f7',
    screenshots: [
      {
        src: '/icons/tk-wide.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
      },
      {
        src: '/icons/tk-tall.png',
        sizes: '393x852',
        type: 'image/png',
        form_factor: 'narrow',
      },
    ],
    icons: [
      {
        src: '/icons/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
