// Menyalin hasil build (dist) ke root repo supaya index.html di root = aplikasi jadi.
// Dengan begitu GitHub Pages (branch main, folder root) langsung menyajikannya.
import fs from 'node:fs'

fs.copyFileSync('dist/app.html', 'index.html')
for (const dir of ['assets', 'media']) {
  fs.rmSync(dir, { recursive: true, force: true })
  fs.cpSync(`dist/${dir}`, dir, { recursive: true })
}
console.log('index.html, assets/, media/ diperbarui di root')
