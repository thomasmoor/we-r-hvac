import type { CollectionConfig } from 'payload'
import { iconOptions } from '../lib/iconOptions'
import { exportAfterChange, exportAfterDelete } from '../lib/exportContent'
import { slugField } from '../lib/slugField'

export const ServiceAreas: CollectionConfig = {
  slug: 'service-areas',
  labels: { singular: 'Service area', plural: 'Service areas' },
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'order', 'slug'],
    description: 'Each area gets a card on the home page and its own page (/service-areas/<slug>).',
  },
  defaultSort: 'order',
  access: { read: () => true },
  hooks: {
    afterChange: [exportAfterChange],
    afterDelete: [exportAfterDelete],
  },
  fields: [
    { name: 'name', type: 'text', required: true, admin: { description: 'e.g. "Burbank"' } },
    slugField('name'),
    {
      type: 'row',
      fields: [
        { name: 'state', type: 'text', defaultValue: 'CA' },
        { name: 'icon', type: 'select', options: iconOptions, defaultValue: 'map-pin', required: true },
        { name: 'order', type: 'number', defaultValue: 10 },
      ],
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'shortDescription', type: 'textarea', required: true },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: { description: 'Area page text. Separate paragraphs with a blank line.' },
    },
    {
      name: 'localNotes',
      label: 'Local HVAC considerations',
      type: 'array',
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    { name: 'metaDescription', type: 'textarea' },
  ],
}
