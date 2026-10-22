// Menyalin data gerakan (teks + gambar + klip) yang dipakai program dari katalog openGym.
// Jalankan: node scripts/build-exercises.mjs
import fs from 'node:fs'
import path from 'node:path'
import { exerciseIds } from '../src/data/plans.js'

const SRC = path.resolve('opengym-src/catalogue')
const OUT = path.resolve('public')
fs.mkdirSync(path.join(OUT, 'media/still'), { recursive: true })
fs.mkdirSync(path.join(OUT, 'media/clip'), { recursive: true })
fs.mkdirSync(path.join(OUT, 'data'), { recursive: true })

import { EXERCISES_ID } from '../src/data/exercises-id.js'

const out = {}
for (const id of exerciseIds()) {
  const e = JSON.parse(fs.readFileSync(path.join(SRC, 'exercises', id + '.json'), 'utf8'))
  const idData = EXERCISES_ID[id] || {}
  out[id] = {
    id,
    name: idData.name || e.name,
    bodyPart: idData.bodyPart || e.bodyPart,
    equipment: idData.equipment || e.equipment,
    target: idData.target || e.target,
    secondary: idData.secondary || e.secondaryMuscles || [],
    category: idData.category || e.category,
    description: idData.description || e.description,
    instructions: idData.instructions || e.instructions
  }
  for (const [kind, ext] of [['still', 'webp'], ['clip', 'mp4']]) {
    fs.copyFileSync(path.join(SRC, 'media', kind, `${id}.${ext}`), path.join(OUT, 'media', kind, `${id}.${ext}`))
  }
}
fs.writeFileSync(path.join(OUT, 'data/exercises.json'), JSON.stringify(out, null, 1))
fs.mkdirSync('src/generated', { recursive: true }); fs.copyFileSync('public/data/exercises.json', 'src/generated/exercises.json')
console.log('exercises:', Object.keys(out).length)

