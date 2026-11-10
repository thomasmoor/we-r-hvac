import type { GlobalConfig } from 'payload'
import { exportAfterGlobalChange } from '../lib/exportContent'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings & contact',
  admin: { group: 'Settings' },
  access: { read: () => true },
  hooks: { afterChange: [exportAfterGlobalChange] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Company & contact',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'companyName', type: 'text', required: true, defaultValue: 'We R HVAC' },
                { name: 'legalName', type: 'text', defaultValue: 'We R HVAC LLC', admin: { description: 'Used in the privacy policy' } },
              ],
            },
            { name: 'tagline', type: 'text', admin: { description: 'Short line under the company name in the footer' } },
            {
              type: 'row',
              fields: [
                { name: 'phone', type: 'text', required: true },
                { name: 'email', type: 'email', required: true },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'address', type: 'text', admin: { description: 'Street. Leave empty to show only town + ZIP.' } },
                { name: 'town', type: 'text', required: true },
                { name: 'zip', type: 'text', admin: { description: 'e.g. "CA 91203"' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'openHours', type: 'text', required: true, admin: { description: 'Shown on the site, e.g. "Mon-Fri 8am-6pm"' } },
                {
                  name: 'openingHoursSchema',
                  type: 'text',
                  admin: { description: 'Same hours for Google, schema.org format, e.g. "Mo-Fr 08:00-18:00"' },
                },
              ],
            },
            {
              name: 'afterHoursNote',
              type: 'text',
              admin: { description: 'Shown next to the form (e.g. for emergencies outside opening hours)' },
            },
            {
              type: 'row',
              fields: [
                { name: 'googleMapsUrl', type: 'text', admin: { description: 'Google Maps / Business Profile link' } },
                { name: 'mapQuery', type: 'text', admin: { description: 'Address or place used for the map pin on the Contact page' } },
              ],
            },
          ],
        },
        {
          label: 'Trust',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'yearsInBusiness', type: 'number' },
                { name: 'license', type: 'text', admin: { description: 'e.g. "License number(s): 12345678"' } },
              ],
            },
            { name: 'insured', type: 'text' },
            {
              name: 'brands',
              label: 'Brands we install',
              type: 'array',
              fields: [{ name: 'name', type: 'text', required: true }],
            },
          ],
        },
        {
          label: 'Social',
          fields: [
            { name: 'facebook', type: 'text' },
            { name: 'instagram', type: 'text' },
            { name: 'yelp', type: 'text' },
            { name: 'nextdoor', type: 'text' },
          ],
        },
        {
          label: 'Forms',
          fields: [
            {
              name: 'formEmail',
              type: 'email',
              admin: {
                description:
                  'Where live-site submissions go. Note: Web3Forms sends to the email the access key was created with.',
              },
            },
            {
              name: 'web3formsAccessKey',
              type: 'text',
              admin: {
                description:
                  'Free key from https://web3forms.com (created with the form email). Used by the live GitHub Pages site. Local submissions are stored under Leads > Form submissions.',
              },
            },
          ],
        },
        {
          label: 'Google & SEO',
          fields: [
            {
              name: 'siteUrl',
              type: 'text',
              defaultValue: 'https://thomasmoor.github.io/we-r-hvac',
              admin: { description: 'Public URL without trailing slash (canonical links, sitemap, schema)' },
            },
            { name: 'gaMeasurementId', label: 'Google Analytics 4 ID', type: 'text', admin: { description: 'e.g. G-XXXXXXXXXX. Empty = no analytics.' } },
            {
              name: 'googlePlaceId',
              type: 'text',
              admin: { description: 'Google Place ID of the business, used by the daily reviews fetch.' },
            },
            {
              name: 'showReviews',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description:
                  'Show the Google rating summary and testimonials. Keep off until the Place ID points to this business.',
              },
            },
          ],
        },
      ],
    },
  ],
}
