import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const isStatic = process.env.STATIC_EXPORT === '1'
const basePath = isStatic ? (process.env.NEXT_PUBLIC_BASE_PATH ?? '/we-r-hvac') : ''

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

// Static export for GitHub Pages: frontend only (scripts/build-static.mjs hides the Payload routes).
const staticConfig: NextConfig = {
  ...nextConfig,
  output: 'export',
  basePath,
  trailingSlash: true,
  // Payload routes are hidden during this build, so dev-generated route types would not resolve.
  // Type safety is checked separately with `npm run typecheck`.
  typescript: { ignoreBuildErrors: true },
  env: {
    NEXT_PUBLIC_STATIC_EXPORT: '1',
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
}

export default isStatic ? staticConfig : withPayload(nextConfig, { devBundleServerPackages: false })
