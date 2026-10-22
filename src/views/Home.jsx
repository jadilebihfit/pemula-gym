import Icon from '../icons.jsx'
import { useState } from 'react'
import { summarize, useApp } from '../store.jsx'
import { Bar } from '../ui.jsx'
import { DAY_SHORT, PROGRAMS } from '../data/plans.js'
import { GOALS, addDays, fromYmd, isoDay, longDate, weekStart, ymd } from '../lib/calc.js'

export default function Home({ date, setDate, go, editProfile }) {
  const { state, reset, exportData, importData } = useApp()
  const p = state.profile
  const [menu, setMenu] = useState(false)
  const today = ymd()
  const ws = weekStart(date)
  const days = Array.from({ length: 7 }, (_, i) => addDays(ws, i))
  const { eaten, burned, spent } = summarize(state.logs[date])
  const planned = state.plan?.schedule.find(s => s[0] === isoDay(date))
  const routine = planned && PROGRAMS.find(x => x.id === state.plan.programId)?.routines.find(r => r.key === planned[1])
  const doneToday = (state.logs[date] || []).filter(e => e.type === 'workout' && e.exercises.some(x => x.sets.some(s => s.done)))
  const remaining = p.target - eaten.kcal + burned
  const weekWorkouts = days.reduce((s, d) => s + summarize(state.logs[d]).workouts, 0)

  const handleImport = e => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const ok = importData(ev.target?.result)
      if (ok) {
        alert('Data berhasil dipulihkan!')
        setMenu(false)
      }
    }
    reader.readAsText(file)
  }

  return (
    <>
      <div className="head">
        <div>
          <h1>{p?.name ? `Halo, ${p.name}!` : 'JadiLebihFit'}</h1>
          <p className="sub">{longDate(date)}</p>
        </div>
        <button className="iconbtn" onClick={() => setMenu(!menu)} aria-label="Pengaturan"><Icon name="settings" size={20} /></button>
      </div>
      {menu && (
        <div className="card">
          <div className="row" style={{ marginBottom: 10 }}>
            <div className="ico" style={{ background: '#14291e', color: 'var(--green)' }}><Icon name="lock" size={18} /></div>
            <div>
              <b className="green" style={{ fontSize: 14 }}>Penyimpanan Lokal HP Aktif (Permanen)</b>
              <div className="mut small" style={{ lineHeight: 1.4, marginTop: 2 }}>
                Data nama, latihan, profil, dan kalori tersimpan permanen di memori HP Anda. Data tidak akan hilang saat web ditutup kecuali Anda menekan tombol Reset di bawah.
              </div>
            </div>
          </div>
          <div className="gap" />
          <button className="btn sec" onClick={() => { setMenu(false); editProfile() }}>Ubah nama, profil & target kalori</button>
          <div className="gap" />
          <button className="btn sec" onClick={() => exportData()}>Cadangkan data (Download file JSON)</button>
          <div className="gap" />
          <label className="btn sec" style={{ display: 'block', textAlign: 'center', cursor: 'pointer' }}>
            Pulihkan data (Unggah file JSON)
            <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
          </label>
          <div className="gap" />
          <button className="btn warn" onClick={() => {
            if (confirm('PERINGATAN: Apakah Anda yakin ingin MENGHAPUS SEMUA DATA latihan, makanan, dan profil dari HP ini? Tindakan ini tidak bisa dibatalkan.')) {
              reset()
            }
          }}>Hapus semua data (Reset)</button>
        </div>
      )}

      <div className="card">
        <div className="week">
          {days.map(d => {
            const s = summarize(state.logs[d])
            const pl = state.plan?.schedule.some(x => x[0] === isoDay(d))
            return (
              <button key={d} className={`${d === date ? 'sel' : ''} ${d === today ? 'today' : ''}`} onClick={() => setDate(d)}>
                <small>{DAY_SHORT[isoDay(d)]}</small><div className="d">{fromYmd(d).getDate()}</div>
                <div className={`dot ${s.workouts ? 'on' : pl ? 'plan' : ''}`} />
              </button>
            )
          })}
        </div>
        <div className="gap" />
        <div className="card" style={{ background: 'var(--card2)', marginBottom: 0 }}>
          {routine ? (
            <div className="row">
              <div className="ico"><Icon name="dumbbell" /></div>
              <div className="grow"><div className="mut small">{date === today ? 'HARI INI' : 'JADWAL'}</div><div style={{ fontWeight: 700, fontSize: 18 }}>{routine.name}</div><div className="mut small">{routine.focus}</div></div>
              {date === today && <button className="btn sm" onClick={() => go('workout', { programId: state.plan.programId, key: routine.key })}>Mulai</button>}
            </div>
          ) : state.plan ? (
            <div className="row"><div className="ico" style={{ background: '#3a3a3c', color: '#fff' }}><Icon name="moon" /></div><div><div style={{ fontWeight: 700 }}>Hari istirahat</div><div className="mut small">Recovery juga bagian dari latihan</div></div></div>
          ) : (
            <div className="row"><div className="ico"><Icon name="calendar" /></div><div className="grow"><div style={{ fontWeight: 700 }}>Belum ada program</div><div className="mut small">Pilih Push/Pull/Legs, Upper/Lower, atau Full Body</div></div><button className="btn sm" onClick={() => go('plan')}>Pilih</button></div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="row between">
          <div className="mut small">KALORI · {GOALS.find(g => g.id === p.goal).label.toUpperCase()}</div>
          <button className="link" onClick={() => go('food')}>+ Makan</button>
        </div>
        <div className="row between" style={{ alignItems: 'flex-end', margin: '8px 0 12px' }}>
          <div className="big">{Math.abs(Math.round(remaining))}<span className="mut" style={{ fontSize: 15 }}> kkal {remaining >= 0 ? 'tersisa' : 'berlebih'}</span></div>
        </div>
        <Bar value={eaten.kcal - burned} max={p.target} cls={remaining < 0 ? 'r' : ''} />
        <div className="gap" />
        <div className="grid3">
          <div className="stat"><b>{p.target}</b><span>Target</span></div>
          <div className="stat"><b className="green">{Math.round(eaten.kcal)}</b><span>Masuk</span></div>
          <div className="stat"><b className="orange">{Math.round(burned)}</b><span>Terbakar</span></div>
        </div>
        <div className="gap" />
        {[['Protein', eaten.protein, p.macros.protein, ''], ['Karbo', eaten.carbs, p.macros.carbs, 'o'], ['Lemak', eaten.fat, p.macros.fat, 'y']].map(([l, v, m, c]) => (
          <div key={l} style={{ marginBottom: 8 }}><div className="row between small"><span>{l}</span><span className="mut">{Math.round(v)} / {m} g</span></div><Bar value={v} max={m} cls={c} /></div>
        ))}
      </div>

      <div className="card row" style={{ cursor: 'pointer' }} onClick={() => go('log')}>
        <div className="ico" style={{ background: '#3a2a10', color: 'var(--orange)' }}><Icon name="flame" /></div>
        <div className="grow"><div style={{ fontWeight: 700 }}>{weekWorkouts} latihan minggu ini</div><div className="mut small">{doneToday.length ? `${doneToday.length} sesi hari ini · ` : ''}Lihat catatan kegiatan</div></div>
      </div>
    </>
  )
}
