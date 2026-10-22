// Perhitungan kalori & utilitas tanggal.

export const ACTIVITY = [
  { id: 'sedentary', label: 'Jarang olahraga', hint: 'Kerja duduk, nyaris tanpa olahraga', f: 1.2 },
  { id: 'light', label: 'Ringan', hint: 'Olahraga 1–3 hari per minggu', f: 1.375 },
  { id: 'moderate', label: 'Sedang', hint: 'Olahraga 3–5 hari per minggu', f: 1.55 },
  { id: 'active', label: 'Aktif', hint: 'Olahraga 6–7 hari per minggu', f: 1.725 },
  { id: 'very', label: 'Sangat aktif', hint: 'Latihan berat tiap hari atau kerja fisik', f: 1.9 }
]

export const GOALS = [
  { id: 'cutting', label: 'Cutting', hint: 'Turun lemak' },
  { id: 'maintain', label: 'Maintain', hint: 'Jaga berat badan' },
  { id: 'bulking', label: 'Bulking', hint: 'Naik otot' }
]

// Pace: persen penyesuaian dari TDEE
export const PACE = {
  cutting: [{ id: 'ringan', label: 'Ringan (−10%)', pct: -0.10 }, { id: 'sedang', label: 'Sedang (−20%)', pct: -0.20 }],
  bulking: [{ id: 'ringan', label: 'Lean (+10%)', pct: 0.10 }, { id: 'sedang', label: 'Agresif (+15%)', pct: 0.15 }],
  maintain: [{ id: 'ringan', label: 'Tetap', pct: 0 }]
}

// Mifflin-St Jeor
export const bmr = ({ gender, weight, height, age }) =>
  10 * weight + 6.25 * height - 5 * age + (gender === 'male' ? 5 : -161)

export function computeProfile(p) {
  const act = ACTIVITY.find(a => a.id === p.activity) || ACTIVITY[1]
  const b = bmr(p)
  const tdee = b * act.f
  const pace = (PACE[p.goal] || PACE.maintain).find(x => x.id === p.pace) || (PACE[p.goal] || PACE.maintain)[0]
  const floor = p.gender === 'male' ? 1500 : 1200
  let target = tdee * (1 + pace.pct)
  if (p.goal === 'cutting') target = Math.max(target, floor)
  target = Math.round(target / 10) * 10
  const protPerKg = p.goal === 'cutting' ? 2.2 : p.goal === 'bulking' ? 1.8 : 1.6
  const protein = Math.round(protPerKg * p.weight)
  const fat = Math.round((target * 0.25) / 9)
  const carbs = Math.max(0, Math.round((target - protein * 4 - fat * 9) / 4))
  return { bmr: Math.round(b), tdee: Math.round(tdee), target, delta: target - Math.round(tdee), macros: { protein, fat, carbs } }
}

// Kalori terbakar (net di atas istirahat): (MET - 1) x berat x jam, MET dihitung
// untuk seluruh durasi set termasuk jeda (Compendium of Physical Activities: resistance training).
// Majemuk MET 5.0, isolasi MET 3.5.
export function exerciseKcal({ compound }, doneSets, weightKg) {
  if (!doneSets.length) return 0
  const net = (compound ? 5.0 : 3.5) - 1
  const rest = compound ? 120 : 75
  const sec = doneSets.reduce((s, x) => s + (Number(x.reps) || 0) * 3.5 + rest, 0)
  return (net * weightKg * sec) / 3600
}

export const REF = {
  // Acuan harian umum (Kemenkes AKG / WHO)
  sodium: 2000, potassium: 3500, fiber: 28, sugar: 50, calcium: 1000, iron: 13, vitC: 90, cholesterol: 300
}

// ---------- tanggal ----------
export const ymd = (d = new Date()) => {
  const x = new Date(d)
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`
}
export const fromYmd = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) }
export const isoDay = s => { const d = fromYmd(s).getDay(); return d === 0 ? 7 : d } // 1=Senin..7=Minggu
export const addDays = (s, n) => { const d = fromYmd(s); d.setDate(d.getDate() + n); return ymd(d) }
export const weekStart = s => addDays(s, 1 - isoDay(s))
export const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
export const longDate = s => { const d = fromYmd(s); return `${['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}` }
export const timeOf = ts => new Date(ts).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
export const rp = n => 'Rp' + Math.round(n).toLocaleString('id-ID')
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
