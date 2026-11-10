import path from 'path'
import { fileURLToPath } from 'url'
import type { CollectionConfig } from 'payload'
import { exportAfterChange, exportAfterDelete } from '../lib/exportContent'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Content' },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [exportAfterChange],
    afterDelete: [exportAfterDelete],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'credit',
      type: 'text',
      admin: { description: 'Photo source / credit, e.g. "Unsplash – https://unsplash.com/photos/…"' },
    },
  ],
  upload: {
    // Stored inside /public so the static export ships the files as-is: /media/<filename>
    staticDir: path.resolve(dirname, '../../public/media'),
    mimeTypes: ['image/*'],
  },
}
