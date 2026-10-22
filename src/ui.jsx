import { useEffect } from 'react'
import { clip, still, useApp } from './store.jsx'
import { EX_META } from './data/plans.js'
import { REF } from './lib/calc.js'

export function Sheet({ onClose, children }) {
  useEffect(() => {
    const k = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose])
  return (
    <div className="sheet-bg" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="grab" />
        {children}
      </div>
    </div>
  )
}

export function Bar({ value, max, cls = '' }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return <div className={`bar ${cls}`}><i style={{ width: pct + '%' }} /></div>
}

export function Stepper({ value, onChange, step = 1, min = 0, max = 9999 }) {
  const n = Number(value) || 0
  const set = v => onChange(Math.min(max, Math.max(min, Math.round(v * 100) / 100)))
  return (
    <div className="stepper">
      <button type="button" onClick={() => set(n - step)}>−</button>
      <input inputMode="decimal" value={value} onChange={e => set(parseFloat(e.target.value) || 0)} />
      <button type="button" onClick={() => set(n + step)}>+</button>
    </div>
  )
}

const cap = s => s ? s[0].toUpperCase() + s.slice(1) : s
export const exName = (data, id) => cap(data?.exercises[id]?.name || id)

export function ExerciseSheet({ exId, sets, reps, onClose }) {
  const { data } = useApp()
  const ex = data?.exercises[exId]
  const meta = EX_META[exId]
  if (!ex) return null
  return (
    <Sheet onClose={onClose}>
      <video className="media" src={clip(exId)} poster={still(exId)} autoPlay loop muted playsInline />
      <div className="gap" />
      <h2>{cap(ex.name)}</h2>
      <div className="chips">
        <span className="tag">{cap(ex.target)}</span>
        <span className="pill">{cap(ex.equipment)}</span>
        {ex.secondary.map(s => <span key={s} className="pill">{cap(s)}</span>)}
        {sets && <span className="pill">{sets} set × {reps} reps</span>}
      </div>
      {meta && <div className="card accent" style={{ marginTop: 14 }}><h3 className="green">Tips singkat</h3><div style={{ lineHeight: 1.5 }}>{meta.tip}</div></div>}
      <p className="mut" style={{ lineHeight: 1.5 }}>{ex.description}</p>
      <h3>Tutorial langkah demi langkah</h3>
      <ol className="steps">{ex.instructions.map((s, i) => <li key={i}>{s}</li>)}</ol>
      <p className="note">Tutorial dan panduan teknik gerakan 100% Bahasa Indonesia. Animasi gerakan dilisensikan dari Gym visual untuk penggunaan non-komersial.</p>
      <button className="btn sec" onClick={onClose}>Tutup</button>
    </Sheet>
  )
}

// Daftar lengkap makro & mikro nutrisi
export const NUT_ROWS = [
  ['kcal', 'Energi', 'kkal'], ['protein', 'Protein', 'g'], ['carbs', 'Karbohidrat', 'g'], ['sugar', 'Gula', 'g'], ['fiber', 'Serat', 'g'],
  ['fat', 'Lemak total', 'g'], ['satFat', 'Lemak jenuh', 'g'], ['cholesterol', 'Kolesterol', 'mg'],
  ['sodium', 'Natrium', 'mg'], ['potassium', 'Kalium', 'mg'], ['calcium', 'Kalsium', 'mg'], ['iron', 'Zat besi', 'mg'], ['vitC', 'Vitamin C', 'mg']
]

export function NutritionTable({ n, mult = 1, showRef = false }) {
  return (
    <div>
      {NUT_ROWS.map(([k, label, unit]) => {
        const v = (n[k] || 0) * mult
        const ref = REF[k]
        return (
          <div className="metr" key={k}>
            <span>{label}</span>
            <b>{k === 'kcal' ? Math.round(v) : v.toFixed(1)} {unit}</b>
            {showRef && ref ? <span className="mut small">{Math.round((v / ref) * 100)}%</span> : <span />}
          </div>
        )
      })}
    </div>
  )
}
