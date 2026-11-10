// Serves ./out at http://localhost:4000/we-r-hvac/ — mimics GitHub Pages (extensionless URLs -> .html).
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '../out')
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '/we-r-hvac'
const port = Number(process.env.PORT || 4000)
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.txt': 'text/plain', '.xml': 'application/xml', '.ico': 'image/x-icon',
}

http
  .createServer((req, res) => {
    let url = decodeURIComponent((req.url || '/').split('?')[0])
    if (url === '/') return res.writeHead(302, { Location: `${base}/` }).end()
    if (!url.startsWith(base)) return res.writeHead(404).end('Not found')
    url = url.slice(base.length) || '/'
    const candidates = [url, `${url}.html`, path.join(url, 'index.html')]
    for (const c of candidates) {
      const file = path.join(root, c)
      if (file.startsWith(root) && fs.existsSync(file) && fs.statSync(file).isFile()) {
        res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' })
        return fs.createReadStream(file).pipe(res)
      }
    }
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
    fs.createReadStream(path.join(root, '404.html')).pipe(res)
  })
  .listen(port, () => console.log(`Static preview: http://localhost:${port}${base}/`))
