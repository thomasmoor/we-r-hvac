import { APIError, type CollectionConfig } from 'payload'

/**
 * Form submissions made on the LOCAL site (http://localhost:3000).
 * The live GitHub Pages site cannot reach this PC, so live submissions are
 * emailed by Web3Forms instead (see Site Settings > Forms).
 */
export const Submissions: CollectionConfig = {
  slug: 'submissions',
  labels: { singular: 'Form submission', plural: 'Form submissions' },
  admin: {
    group: 'Leads',
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'service', 'when', 'createdAt'],
  },
  defaultSort: '-createdAt',
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Honeypot: real visitors never fill this hidden field
        if (data && (data as Record<string, unknown>).botcheck) {
          throw new APIError('Submission rejected', 400)
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'service', type: 'text' },
    {
      name: 'when',
      label: 'When do you need it?',
      type: 'select',
      options: ['Emergency', 'This week', 'This month'],
    },
    { name: 'message', type: 'textarea' },
    { name: 'page', type: 'text', admin: { readOnly: true, description: 'Page the form was sent from' } },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Booked', value: 'booked' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
