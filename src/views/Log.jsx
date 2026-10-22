import { useState } from 'react'
import Icon from '../icons.jsx'
import { summarize, useApp } from '../store.jsx'
import { Bar, exName } from '../ui.jsx'
import { addDays, fromYmd, isoDay, longDate, rp, timeOf, weekStart, ymd } from '../lib/calc.js'
import { DAY_SHORT } from '../data/plans.js'

export default function Log({ date, setDate }) {
  const { state, data, removeEntry } = useApp()
  const entries = [...(state.logs[date] || [])].sort((a, b) => a.ts - b.ts)
  const { eaten, burned, spent } = summarize(entries)
  const target = state.profile.target
  const ws = weekStart(date)
  const days = Array.from({ length: 7 }, (_, i) => addDays(ws, i))
  const stats = days.map(d => ({ d, ...summarize(state.logs[d]) }))
  const maxV = Math.max(500, ...stats.map(s => Math.max(s.eaten.kcal, s.burned)))
  const net = eaten.kcal - burned
  const [mode, setMode] = useState('day')

  const history = Object.keys(state.logs).sort().reverse().flatMap(d =>
    (state.logs[d] || []).filter(e => e.type === 'workout' && e.exercises.some(x => x.sets.some(s => s.done))).map(e => ({ ...e, d }))
  )

  if (mode === 'history') {
    const totalK = history.reduce((s, e) => s + e.kcal, 0)
    return (
      <>
        <h1>Riwayat</h1>
        <p className="sub">{history.length} sesi latihan · {Math.round(totalK)} kkal terbakar total</p>
        <div className="seg" style={{ marginBottom: 14 }}>
          <button onClick={() => setMode('day')}>Per hari</button><button className="on">Riwayat latihan</button>
        </div>
        {history.length === 0 && <div className="card mut">Belum ada latihan yang tercatat. Centang minimal satu set saat latihan.</div>}
        {history.map(e => (
          <button key={e.id} className="card" style={{ display: 'block', width: '100%', textAlign: 'left' }} onClick={() => { setDate(e.d); setMode('day') }}>
            <div className="row between"><b>{e.title}</b><span className="pill orange">{Math.round(e.kcal)} kkal</span></div>
            <div className="mut small" style={{ margin: '3px 0 8px' }}>{longDate(e.d)} · {timeOf(e.ts)}</div>
            <div className="chips">
              {e.exercises.filter(x => x.sets.some(s => s.done)).map((x, i) => (
                <span className="pill" key={i}>{exName(data, x.exId)} · {x.sets.filter(s => s.done).length} set</span>
              ))}
            </div>
          </button>
        ))}
      </>
    )
  }

  return (
    <>
      <h1>Aktivitas</h1>
      <p className="sub">{longDate(date)}</p>
      <div className="seg" style={{ marginBottom: 14 }}>
        <button className="on">Per hari</button><button onClick={() => setMode('history')}>Riwayat latihan</button>
      </div>
      <div className="row" style={{ marginBottom: 14 }}>
        <button className="iconbtn" onClick={() => setDate(addDays(date, -1))}><Icon name="left" size={20} /></button>
        <button className="btn sec grow" onClick={() => setDate(ymd())}>Hari ini</button>
        <button className="iconbtn" onClick={() => setDate(addDays(date, 1))}><Icon name="right" size={20} /></button>
      </div>

      <div className="card">
        <div className="grid3">
          <div className="stat"><b className="green">{Math.round(eaten.kcal)}</b><span>Kalori masuk</span></div>
          <div className="stat"><b className="orange">{Math.round(burned)}</b><span>Terbakar (latihan)</span></div>
          <div className="stat"><b>{Math.round(net)}</b><span>Netto</span></div>
        </div>
        <div className="gap" />
        <div className="row between small"><span className="mut">Target {target} kkal</span><span className={target + burned - eaten.kcal < 0 ? 'red' : 'green'}>{Math.round(target + burned - eaten.kcal)} sisa</span></div>
        <div className="gap" /><Bar value={eaten.kcal - burned} max={target} />
        <p className="note" style={{ marginBottom: 0 }}>Pengeluaran makan: {rp(spent)}</p>
      </div>

      <h2>Minggu ini</h2>
      <div className="card">
        <div className="chart">
          {stats.map(s => (
            <div key={s.d}>
              <div className="cols"><i className="g" style={{ height: (s.eaten.kcal / maxV) * 100 + '%' }} /><i style={{ height: (s.burned / maxV) * 100 + '%' }} /></div>
              <span style={{ color: s.d === date ? 'var(--green)' : undefined, fontWeight: s.d === date ? 700 : 400 }}>{DAY_SHORT[isoDay(s.d)][0]}{fromYmd(s.d).getDate()}</span>
            </div>
          ))}
        </div>
        <div className="chips small" style={{ marginTop: 10 }}><span className="green">● Makan</span><span className="orange">● Terbakar</span></div>
      </div>

      <h2>Kegiatan</h2>
      {entries.length === 0 && <div className="card mut">Belum ada kegiatan. Pilih program, mulai latihan, atau catat makanan, semuanya muncul di sini otomatis.</div>}
      <div className="tl">
        {entries.map(e => (
          <div className={`ev ${e.type}`} key={e.id}>
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="row between">
                <div className="grow">
                  <div className="mut small">{timeOf(e.ts)} · {e.type === 'plan' ? 'Program' : e.type === 'workout' ? 'Latihan' : e.slot}</div>
                  <div style={{ fontWeight: 700 }}>{e.type === 'meal' && e.qty !== 1 ? `${e.qty}× ` : ''}{e.title}</div>
                </div>
                <button className="iconbtn" style={{ width: 32, height: 32, fontSize: 13 }} onClick={() => { if (confirm('Hapus catatan ini?')) removeEntry(date, e.id) }}><Icon name="close" size={13} /></button>
              </div>
              {e.type === 'plan' && <div className="mut small">{e.detail}</div>}
              {e.type === 'meal' && <div className="mut small" style={{ marginTop: 4 }}>{Math.round(e.nutrition.kcal)} kkal · P {Math.round(e.nutrition.protein)} g · K {Math.round(e.nutrition.carbs)} g · L {Math.round(e.nutrition.fat)} g · Na {Math.round(e.nutrition.sodium)} mg · {rp(e.price)}</div>}
              {e.type === 'workout' && (
                <>
                  <div className="chips" style={{ margin: '6px 0' }}>
                    <span className="pill orange">{Math.round(e.kcal)} kkal terbakar</span>
                    <span className="tag">{e.status === 'ongoing' ? 'Berlangsung' : 'Selesai'}</span>
                  </div>
                  {e.exercises.map((x, i) => {
                    const done = x.sets.filter(s => s.done)
                    return (
                      <div className="metr" key={i} style={{ gridTemplateColumns: '1fr auto' }}>
                        <span>{exName(data, x.exId)} <span className="mut small">· {done.length}/{x.sets.length} set{done.length ? ` · ${done.map(s => (s.weight ? `${s.weight}kg×` : '') + s.reps).join(', ')}` : ''}</span></span>
                        <b className={x.kcal ? 'orange' : 'mut'}>{Math.round(x.kcal)}</b>
                      </div>
                    )
                  })}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
