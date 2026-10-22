import { useState } from 'react'
import { ACTIVITY, GOALS, PACE, computeProfile } from '../lib/calc.js'
import { useApp } from '../store.jsx'

export default function Onboarding({ onDone, editing }) {
  const { state, saveProfile } = useApp()
  const [f, setF] = useState(state.profile || { name: '', gender: 'male', age: 25, height: 170, weight: 70, activity: 'moderate', goal: 'cutting', pace: 'ringan' })
  const set = (k, v) => setF(x => {
    const n = { ...x, [k]: v }
    if (k === 'goal') n.pace = PACE[v][0].id
    return n
  })
  const valid = f.age >= 12 && f.age <= 90 && f.height >= 120 && f.height <= 230 && f.weight >= 30 && f.weight <= 250
  const r = valid ? computeProfile(f) : null
  const num = (k) => ({ className: 'input', type: 'number', inputMode: 'decimal', value: f[k], onChange: e => set(k, e.target.value === '' ? '' : Number(e.target.value)) })

  return (
    <div className="app" style={{ paddingBottom: 40 }}>
      <h1>{editing ? 'Ubah Profil' : 'Selamat Datang'}</h1>
      <p className="sub">{editing ? 'Perbarui nama dan parameter kalori harianmu.' : 'Isi data dirimu dulu sebelum mulai latihan.'}</p>

      <div className="field">
        <label>Nama panggilan</label>
        <input
          className="input"
          type="text"
          placeholder="Misal: Joko, Budi, Sarah"
          value={f.name || ''}
          onChange={e => set('name', e.target.value)}
        />
      </div>

      <div className="field"><label>Jenis kelamin</label>
        <div className="seg">
          <button className={f.gender === 'male' ? 'on' : ''} onClick={() => set('gender', 'male')}>Pria</button>
          <button className={f.gender === 'female' ? 'on' : ''} onClick={() => set('gender', 'female')}>Wanita</button>
        </div>
      </div>
      <div className="grid3">
        <div className="field"><label>Usia</label><input {...num('age')} /></div>
        <div className="field"><label>Tinggi (cm)</label><input {...num('height')} /></div>
        <div className="field"><label>Berat (kg)</label><input {...num('weight')} /></div>
      </div>

      <div className="field"><label>Tujuan</label>
        <div className="seg">
          {GOALS.map(g => <button key={g.id} className={f.goal === g.id ? 'on' : ''} onClick={() => set('goal', g.id)}>{g.label}</button>)}
        </div>
        <div className="note" style={{ marginTop: 6 }}>{GOALS.find(g => g.id === f.goal).hint}</div>
      </div>
      {PACE[f.goal].length > 1 && (
        <div className="field"><label>Kecepatan</label>
          <div className="seg">{PACE[f.goal].map(p => <button key={p.id} className={f.pace === p.id ? 'on' : ''} onClick={() => set('pace', p.id)}>{p.label}</button>)}</div>
        </div>
      )}
      <div className="field"><label>Aktivitas harian</label>
        <select className="input" value={f.activity} onChange={e => set('activity', e.target.value)}>
          {ACTIVITY.map(a => <option key={a.id} value={a.id}>{a.label} — {a.hint}</option>)}
        </select>
      </div>

      {r && (
        <div className="card accent">
          <div className="mut small">Kalori harian untuk {GOALS.find(g => g.id === f.goal).label.toLowerCase()}</div>
          <div className="row between" style={{ alignItems: 'flex-end', margin: '6px 0 12px' }}>
            <div className="big green">{r.target.toLocaleString('id-ID')} <span style={{ fontSize: 16 }} className="mut">kkal/hari</span></div>
            <div className="small mut">{r.delta === 0 ? 'sama dengan TDEE' : `${r.delta > 0 ? '+' : ''}${r.delta} dari TDEE`}</div>
          </div>
          <div className="grid2" style={{ marginBottom: 10 }}>
            <div className="stat"><b>{r.bmr}</b><span>BMR (kalori istirahat)</span></div>
            <div className="stat"><b>{r.tdee}</b><span>TDEE (total harian)</span></div>
          </div>
          <div className="grid3">
            <div className="stat"><b>{r.macros.protein} g</b><span>Protein</span></div>
            <div className="stat"><b>{r.macros.carbs} g</b><span>Karbo</span></div>
            <div className="stat"><b>{r.macros.fat} g</b><span>Lemak</span></div>
          </div>
          <p className="note" style={{ marginBottom: 0 }}>Rumus Mifflin-St Jeor. Hasil adalah perkiraan awal, sesuaikan tiap 2–3 minggu berdasarkan perkembangan berat badan.</p>
        </div>
      )}
      <button className="btn" disabled={!valid} onClick={() => { saveProfile({ ...f, ...computeProfile(f), updated: Date.now() }); onDone() }}>
        {editing ? 'Simpan' : 'Lanjut ke aplikasi'}
      </button>
      {editing && <><div className="gap" /><button className="btn sec" onClick={onDone}>Batal</button></>}
    </div>
  )
}
