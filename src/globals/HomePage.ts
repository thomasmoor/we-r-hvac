import type { GlobalConfig } from 'payload'
import { exportAfterGlobalChange } from '../lib/exportContent'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home page (hero text)',
  admin: { group: 'Pages' },
  access: { read: () => true },
  hooks: { afterChange: [exportAfterGlobalChange] },
  fields: [
    {
      type: 'collapsible',
      label: 'Hero',
      fields: [
        { name: 'heroH1', label: 'H1 (small text)', type: 'text', required: true },
        { name: 'heroH2', label: 'H2', type: 'text', required: true },
        { name: 'heroText', label: 'Supporting paragraph', type: 'textarea' },
        { name: 'formTitle', type: 'text', defaultValue: 'Request service' },
        { name: 'formSubtitle', type: 'text' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Sections',
      fields: [
        { name: 'servicesTitle', type: 'text', defaultValue: 'Our Services' },
        { name: 'servicesIntro', type: 'textarea' },
        { name: 'areasTitle', type: 'text', defaultValue: 'Service Areas' },
        { name: 'areasIntro', type: 'textarea' },
      ],
    },
    { name: 'metaTitle', type: 'text' },
    { name: 'metaDescription', type: 'textarea' },
  ],
}
