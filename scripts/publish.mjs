// Menyalin hasil build (dist) ke root repo supaya index.html di root = aplikasi jadi.
// Dengan begitu GitHub Pages (branch main, folder root) langsung menyajikannya.
import fs from 'node:fs'

fs.copyFileSync('dist/app.html', 'index.html')
fs.copyFileSync('dist/favicon.ico', 'favicon.ico')
for (const dir of ['assets', 'media', 'icons']) {
  fs.rmSync(dir, { recursive: true, force: true })
  fs.cpSync(`dist/${dir}`, dir, { recursive: true })
}
console.log('index.html, favicon.ico, assets/, media/, icons/ diperbarui di root')
