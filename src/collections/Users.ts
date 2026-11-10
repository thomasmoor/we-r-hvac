import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Admin user', plural: 'Admin users' },
  admin: {
    group: 'Settings',
    useAsTitle: 'email',
  },
  auth: true,
  fields: [],
}
