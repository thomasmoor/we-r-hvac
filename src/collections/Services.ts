import type { CollectionConfig } from 'payload'
import { iconOptions } from '../lib/iconOptions'
import { exportAfterChange, exportAfterDelete } from '../lib/exportContent'
import { slugField } from '../lib/slugField'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Service', plural: 'Services' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'slug'],
    description: 'Each service gets a card on the home page and its own page (/services/<slug>).',
  },
  defaultSort: 'order',
  access: { read: () => true },
  hooks: {
    afterChange: [exportAfterChange],
    afterDelete: [exportAfterDelete],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    {
      type: 'row',
      fields: [
        { name: 'icon', type: 'select', options: iconOptions, defaultValue: 'wrench', required: true },
        { name: 'order', type: 'number', defaultValue: 10, admin: { description: 'Lower numbers show first' } },
      ],
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      admin: { description: 'One sentence for the card and the footer list.' },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: { description: 'Service page intro. Separate paragraphs with a blank line.' },
    },
    {
      name: 'whyImportant',
      label: 'Why it matters',
      type: 'textarea',
      required: true,
      admin: { description: 'Separate paragraphs with a blank line.' },
    },
    {
      name: 'whatToExpect',
      label: 'What to expect',
      type: 'array',
      labels: { singular: 'Step', plural: 'Steps' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea', required: true },
      ],
    },
    { name: 'metaDescription', type: 'textarea', admin: { description: 'SEO description (optional).' } },
  ],
}
