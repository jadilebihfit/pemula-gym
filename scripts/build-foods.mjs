// Menghitung gizi tiap menu dari resep + bahan, menimpa nilai bahan dengan TKPI 2020 bila ada.
// Jalankan: node scripts/build-foods.mjs
import fs from 'node:fs'
import path from 'node:path'
import { ING, DISHES, PACKAGES } from './food-source.mjs'

const KEYS = ['kcal', 'protein', 'fat', 'satFat', 'carbs', 'sugar', 'fiber', 'sodium', 'potassium', 'calcium', 'iron', 'vitC', 'cholesterol']

const tkpiPath = path.resolve('tkpi-src/data/tkpi_2020_pages_15_83.json')
const raw = JSON.parse(fs.readFileSync(tkpiPath, 'utf8'))
const tkpi = Object.fromEntries((Array.isArray(raw) ? raw : raw.records).map(r => [r.code, r]))
// indeks KEYS -> kolom TKPI
const MAP = { 0: 'energy_kcal', 1: 'protein_g', 2: 'fat_g', 4: 'carb_g', 6: 'fiber_g', 7: 'sodium_mg', 8: 'potassium_mg', 9: 'calcium_mg', 10: 'iron_mg', 11: 'vitamin_c_mg' }

const ing = {}
for (const [k, d] of Object.entries(ING)) {
  const v = [...d.v]
  let fromTkpi = 0
  if (d.tkpi) {
    const r = tkpi[d.tkpi]
    if (!r) throw new Error('kode TKPI tidak ada: ' + d.tkpi)
    for (const [i, col] of Object.entries(MAP)) {
      const x = r[col]
      if (typeof x === 'number' && Number.isFinite(x)) { v[i] = x; fromTkpi++ }
    }
  }
  ing[k] = { name: d.n, v, tkpi: d.tkpi || null, tkpiFields: fromTkpi }
}

const round = n => Math.round(n * 10) / 10
const sum = recipe => {
  const t = new Array(KEYS.length).fill(0)
  let grams = 0
  for (const [k, g] of recipe) {
    if (!ing[k]) throw new Error('bahan tidak dikenal: ' + k)
    grams += g
    ing[k].v.forEach((x, i) => { t[i] += (x * g) / 100 })
  }
  return { t, grams }
}
const toNut = t => Object.fromEntries(KEYS.map((k, i) => [k, k === 'kcal' ? Math.round(t[i]) : round(t[i])]))

const foods = DISHES.map(([id, name, category, serving, pMin, pMax, recipe]) => {
  const { t } = sum(recipe)
  return {
    id, name, category, serving, priceMin: pMin, priceMax: pMax,
    price: Math.round((pMin + pMax) / 2 / 500) * 500,
    nutrition: toNut(t),
    ingredients: recipe.map(([k, g]) => ({ name: ing[k].name, grams: g }))
  }
})

const byId = Object.fromEntries(foods.map(f => [f.id, f]))
const packages = PACKAGES.map(([id, name, tag, items]) => {
  const t = new Array(KEYS.length).fill(0)
  let price = 0
  for (const [fid, q] of items) {
    const f = byId[fid]
    if (!f) throw new Error('menu tidak ada: ' + fid)
    KEYS.forEach((k, i) => { t[i] += f.nutrition[k] * q })
    price += f.price * q
  }
  return { id, name, tag, items: items.map(([foodId, qty]) => ({ foodId, qty })), price: Math.round(price / 500) * 500, nutrition: toNut(t) }
})

const out = {
  meta: {
    generated: new Date().toISOString().slice(0, 10),
    sources: [
      'Tabel Komposisi Pangan Indonesia (TKPI) 2020, Kementerian Kesehatan RI (diekstrak oleh github.com/ancxlol/tkpi-2020-database)',
      'USDA FoodData Central (estimasi untuk gula, lemak jenuh, kolesterol, dan nilai yang kosong di TKPI)',
      'Kisaran harga: Kompas, GoFood (menu warteg Jabodetabek 2025)'
    ],
    note: 'Nilai gizi adalah estimasi resep warteg umum. Porsi, minyak, dan garam tiap warung berbeda.'
  },
  foods, packages
}
fs.mkdirSync('public/data', { recursive: true })
fs.writeFileSync('public/data/foods.json', JSON.stringify(out))
fs.mkdirSync('src/generated', { recursive: true }); fs.copyFileSync('public/data/foods.json', 'src/generated/foods.json')
console.log('foods:', foods.length, 'packages:', packages.length)
console.log(foods.slice(0, 8).map(f => `${f.name}: ${f.nutrition.kcal} kkal, P${f.nutrition.protein}, Na${f.nutrition.sodium}`).join('\n'))

