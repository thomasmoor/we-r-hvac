// Publishes content edits: commits content/site.json + public/media and pushes.
// GitHub Actions then rebuilds and deploys the site to GitHub Pages (about 2 minutes).
import { execSync } from 'node:child_process'

const run = (cmd) => execSync(cmd, { stdio: 'inherit' })
const quiet = (cmd) => execSync(cmd).toString().trim()

run('git add content/site.json public/media')
if (!quiet('git diff --cached --name-only')) {
  console.log('No content changes to publish.')
  process.exit(0)
}
const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ')
run(`git commit -m "Content update ${stamp}"`)
run('git push')
console.log('\nPushed. The live site updates in a couple of minutes (see the Actions tab on GitHub).')
