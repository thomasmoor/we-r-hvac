import type { GlobalConfig } from 'payload'
import { exportAfterGlobalChange } from '../lib/exportContent'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About Us page',
  admin: { group: 'Pages' },
  access: { read: () => true },
  hooks: { afterChange: [exportAfterGlobalChange] },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'h1', label: 'H1 (large text)', type: 'text', required: true },
    { name: 'h2', label: 'H2', type: 'text', required: true },
    { name: 'body', type: 'textarea', admin: { description: 'Separate paragraphs with a blank line.' } },
    { name: 'brandsTitle', type: 'text', defaultValue: 'Brands we install' },
    { name: 'metaDescription', type: 'textarea' },
  ],
}
