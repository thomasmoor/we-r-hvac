// Builds the public site as plain HTML into ./out for GitHub Pages.
// The Payload admin/API routes are temporarily moved into a private folder (_payload),
// which Next.js ignores for routing, so `output: 'export'` only sees the frontend.
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const live = path.join(root, 'src/app/(payload)')
const hidden = path.join(root, 'src/app/_payload')

const restore = () => {
  if (fs.existsSync(hidden) && !fs.existsSync(live)) fs.renameSync(hidden, live)
}
process.on('SIGINT', () => {
  restore()
  process.exit(130)
})

if (!fs.existsSync(path.join(root, 'content/site.json'))) {
  console.error('content/site.json is missing — run "npm run seed" (or start the admin) first.')
  process.exit(1)
}

let status = 1
try {
  if (fs.existsSync(live)) fs.renameSync(live, hidden)
  fs.rmSync(path.join(root, 'out'), { recursive: true, force: true })
  const res = spawnSync('npx', ['next', 'build'], {
    cwd: root,
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      STATIC_EXPORT: '1',
      NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH ?? '/we-r-hvac',
      NEXT_DIST_DIR: '.next-static',
      NODE_OPTIONS: '--no-deprecation',
    },
  })
  status = res.status ?? 1
} finally {
  restore()
}

if (status === 0) {
  fs.writeFileSync(path.join(root, 'out/.nojekyll'), '')
  console.log('\nStatic site written to ./out')
}
process.exit(status)
