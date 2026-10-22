import Icon from '../icons.jsx'
import { useState } from 'react'
import { PROGRAMS, DAY_NAMES, EX_META } from '../data/plans.js'
import { clip, still, useApp } from '../store.jsx'
import { Bar, ExerciseSheet, Sheet, Stepper, exName } from '../ui.jsx'
import { isoDay, ymd } from '../lib/calc.js'

function Picker({ start, preselect }) {
  const { state } = useApp()
  const today = isoDay(ymd())
  const planned = state.plan?.schedule.find(s => s[0] === today)
  const rec = planned ? PROGRAMS.find(p => p.id === state.plan.programId)?.routines.find(r => r.key === planned[1]) : null
  return (
    <>
      <h1>Mulai latihan</h1>
      <p className="sub">{DAY_NAMES[today]}. Pilih sesi, gerakan dan kalori terbakar tercatat otomatis.</p>
      {rec && (
        <div className="card accent">
          <div className="mut small">Jadwal hari ini</div>
          <h2 style={{ margin: '4px 0' }}>{rec.name}</h2>
          <div className="mut" style={{ marginBottom: 12 }}>{rec.focus} · {rec.ex.length} gerakan</div>
          <button className="btn" onClick={() => start(state.plan.programId, rec.key)}>Mulai sekarang</button>
        </div>
      )}
      {!rec && <div className="card"><div className="mut">{state.plan ? 'Hari ini hari istirahat di jadwalmu. Tetap bisa latihan di sesi mana saja.' : 'Belum ada program aktif. Pilih sesi di bawah atau atur di tab Plan.'}</div></div>}
      {PROGRAMS.map(p => (
        <div key={p.id}>
          <h2>{p.name}</h2>
          {p.routines.map(r => (
            <button key={r.key} className="card row" style={{ width: '100%', textAlign: 'left' }} onClick={() => start(p.id, r.key)}>
              <img className="thumb" src={still(r.ex[0][0])} alt="" loading="lazy" />
              <div className="grow"><div style={{ fontWeight: 700 }}>{r.name}</div><div className="mut small">{r.focus} · {r.ex.length} gerakan</div></div>
              <span className="green">Mulai</span>
            </button>
          ))}
        </div>
      ))}
    </>
  )
}

function Runner({ entry, date, go }) {
  const { data, weight, updateWorkout, removeEntry } = useApp()
  const [idx, setIdx] = useState(0)
  const [tut, setTut] = useState(null)
  const [adding, setAdding] = useState(false)
  const ex = entry.exercises[idx]
  const total = entry.exercises.reduce((s, e) => s + e.sets.length, 0)
  const done = entry.exercises.reduce((s, e) => s + e.sets.filter(x => x.done).length, 0)
  const upd = fn => updateWorkout(date, entry.id, fn)
  const patchSet = (si, patch) => upd(e => ({ ...e, exercises: e.exercises.map((x, i) => i !== idx ? x : { ...x, sets: x.sets.map((s, j) => j === si ? { ...s, ...patch } : s) }) }))
  const addSet = () => upd(e => ({ ...e, exercises: e.exercises.map((x, i) => i !== idx ? x : { ...x, sets: [...x.sets, { ...x.sets[x.sets.length - 1], done: false }] }) }))
  const finish = () => { upd(e => ({ ...e, status: 'done', finishedAt: Date.now() })); go('log', { today: true }) }
  const tip = EX_META[ex.exId]?.tip

  return (
    <>
      <div className="head">
        <div>
          <h1 style={{ fontSize: 28 }}>{entry.title}</h1>
          <p className="sub" style={{ margin: 0 }}>{done}/{total} set · <span className="orange">{Math.round(entry.kcal)} kkal</span></p>
        </div>
        <button className="iconbtn" title="Batalkan" onClick={() => { if (confirm('Batalkan sesi ini dan hapus dari catatan?')) removeEntry(date, entry.id) }}><Icon name="close" size={18} /></button>
      </div>
      <div className="gap" /><Bar value={done} max={total} /><div className="gap" />

      <div className="chips" style={{ margin: '12px 0', flexWrap: 'nowrap', overflowX: 'auto' }}>
        {entry.exercises.map((e, i) => {
          const d = e.sets.every(s => s.done)
          return <button key={i} className={`chip ${i === idx ? 'on' : ''}`} onClick={() => setIdx(i)}>{d && <Icon name="check" size={14} stroke={3} />} {i + 1}</button>
        })}
      </div>

      <video className="media" key={ex.exId} src={clip(ex.exId)} poster={still(ex.exId)} autoPlay loop muted playsInline />
      <div className="row between" style={{ margin: '14px 0 6px' }}>
        <h2 style={{ margin: 0 }}>{exName(data, ex.exId)}</h2>
        <button className="btn sec sm" onClick={() => setTut(ex.exId)}>Tutorial</button>
      </div>
      <div className="chips"><span className="tag">{data.exercises[ex.exId].target}</span><span className="pill">{data.exercises[ex.exId].equipment}</span><span className="pill orange">{Math.round(ex.kcal)} kkal</span></div>
      {tip && <p className="mut small" style={{ lineHeight: 1.5 }}>{tip}</p>}

      <div className="card" style={{ marginTop: 10 }}>
        <div className="setrow mut small"><span /><span>BEBAN (KG)</span><span>REPETISI</span><span /></div>
        {ex.sets.map((s, i) => (
          <div className="setrow" key={i}>
            <span className="num">{i + 1}</span>
            <Stepper value={s.weight} step={2.5} onChange={v => patchSet(i, { weight: v })} />
            <Stepper value={s.reps} step={1} onChange={v => patchSet(i, { reps: v })} />
            <button className={`check ${s.done ? 'on' : ''}`} onClick={() => patchSet(i, { done: !s.done })}>{s.done && <Icon name="check" size={20} stroke={3} />}</button>
          </div>
        ))}
        <button className="link" onClick={addSet}>+ Tambah set</button>
      </div>

      <div className="grid2">
        <button className="btn sec" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>Sebelumnya</button>
        <button className="btn sec" disabled={idx === entry.exercises.length - 1} onClick={() => setIdx(idx + 1)}>Selanjutnya</button>
      </div>
      <div className="gap" />
      <button className="btn sec" onClick={() => setAdding(true)}>+ Tambah gerakan</button>
      <div className="gap" />
      <button className="btn" onClick={finish}>Selesai latihan · {Math.round(entry.kcal)} kkal</button>
      <p className="note">Kalori dihitung dari set yang dicentang (METs resistance training × berat badan {weight} kg). Perkiraan, bukan alat ukur.</p>

      {tut && <ExerciseSheet exId={tut} onClose={() => setTut(null)} />}
      {adding && (
        <Sheet onClose={() => setAdding(false)}>
          <h2>Pilih gerakan</h2>
          {Object.keys(data.exercises).map(id => (
            <button className="item" key={id} style={{ width: '100%', textAlign: 'left' }} onClick={() => {
              upd(e => ({ ...e, exercises: [...e.exercises, { exId: id, kcal: 0, sets: Array.from({ length: 3 }, () => ({ reps: 10, weight: 0, done: false })) }] }))
              setIdx(entry.exercises.length); setAdding(false)
            }}>
              <img className="thumb" src={still(id)} alt="" loading="lazy" />
              <div className="grow"><div className="t">{exName(data, id)}</div><div className="s">{data.exercises[id].target} · {data.exercises[id].equipment}</div></div>
              <span className="green"><Icon name="plus" size={18} /></span>
            </button>
          ))}
        </Sheet>
      )}
    </>
  )
}

export default function Workout({ go }) {
  const { state, startWorkout } = useApp()
  const date = ymd()
  const ongoing = (state.logs[date] || []).find(e => e.type === 'workout' && e.status === 'ongoing')
  const start = (programId, key) => startWorkout(date, programId, key)
  if (ongoing) return <Runner entry={ongoing} date={date} go={go} />
  return <Picker start={start} />
}
