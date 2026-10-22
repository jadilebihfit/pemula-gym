import Icon from '../icons.jsx'
import { useState } from 'react'
import { PROGRAMS, DAY_NAMES } from '../data/plans.js'
import { still, useApp } from '../store.jsx'
import { ExerciseSheet, exName } from '../ui.jsx'

function ProgramDetail({ program, back, go }) {
  const { state, data, choosePlan } = useApp()
  const active = state.plan?.programId === program.id
  const [sched, setSched] = useState(active ? state.plan.schedule : program.schedule)
  const [open, setOpen] = useState(program.routines[0].key)
  const [sheet, setSheet] = useState(null)
  const dayOf = key => sched.find(s => s[1] === key)?.[0] || 0
  const setDay = (key, day) => setSched(sc => [...sc.filter(s => s[1] !== key), ...(day ? [[day, key]] : [])].sort((a, b) => a[0] - b[0]))
  const dupDay = sched.length !== new Set(sched.map(s => s[0])).size

  return (
    <>
      <button className="link row" style={{ gap: 4 }} onClick={back}><Icon name="left" size={18} />Semua program</button>
      <h1>{program.name}</h1>
      <p className="sub">{program.desc}</p>
      <div className="chips" style={{ marginBottom: 14 }}>
        <span className="tag">{program.level}</span><span className="pill">{program.routines.length} sesi</span>
        {active && <span className="tag">Program aktif</span>}
      </div>

      <h2>Jadwal mingguan</h2>
      <div className="card">
        {program.routines.map(r => (
          <div className="item" key={r.key}>
            <div className="grow"><div className="t">{r.name}</div><div className="s">{r.focus}</div></div>
            <select className="input" style={{ width: 120, padding: '9px 10px', fontSize: 15 }} value={dayOf(r.key)} onChange={e => setDay(r.key, Number(e.target.value))}>
              <option value={0}>Tidak dijadwalkan</option>
              {DAY_NAMES.slice(1).map((d, i) => <option key={d} value={i + 1}>{d}</option>)}
            </select>
          </div>
        ))}
        {dupDay && <div className="small orange" style={{ marginTop: 6 }}>Ada dua sesi di hari yang sama. Boleh, tapi pastikan kuat.</div>}
        <div className="gap" />
        <button className="btn" onClick={() => { choosePlan(program.id, sched); go('home') }}>{active ? 'Simpan perubahan jadwal' : 'Pakai program ini'}</button>
        <p className="note" style={{ marginBottom: 0 }}>Memilih program otomatis tercatat di Aktivitas hari ini.</p>
      </div>

      <h2>Gerakan & tutorial</h2>
      {program.routines.map(r => (
        <div className="card" key={r.key}>
          <button className="row between" style={{ width: '100%', textAlign: 'left' }} onClick={() => setOpen(open === r.key ? null : r.key)}>
            <div><h3 style={{ marginBottom: 2 }}>{r.name}</h3><div className="s mut small">{r.ex.length} gerakan · {r.ex.reduce((s, e) => s + e[1], 0)} set</div></div>
            <span className="mut"><Icon name={open === r.key ? 'up' : 'down'} size={18} /></span>
          </button>
          {open === r.key && (
            <>
              <div style={{ marginTop: 8 }}>
                {r.ex.map(([id, sets, reps], i) => (
                  <button className="item" key={id + i} style={{ width: '100%', textAlign: 'left' }} onClick={() => setSheet({ id, sets, reps })}>
                    <img className="thumb" src={still(id)} alt="" loading="lazy" />
                    <div className="grow"><div className="t">{exName(data, id)}</div><div className="s">{sets} set × {reps} reps · Tutorial</div></div>
                  </button>
                ))}
              </div>
              <div className="gap" />
              <button className="btn sec" onClick={() => go('workout', { programId: program.id, key: r.key })}>Mulai {r.name}</button>
            </>
          )}
        </div>
      ))}
      {sheet && <ExerciseSheet exId={sheet.id} sets={sheet.sets} reps={sheet.reps} onClose={() => setSheet(null)} />}
    </>
  )
}

export default function Plan({ go }) {
  const { state } = useApp()
  const [sel, setSel] = useState(null)
  if (sel) return <ProgramDetail program={PROGRAMS.find(p => p.id === sel)} back={() => setSel(null)} go={go} />
  return (
    <>
      <h1>Program Latihan</h1>
      <p className="sub">Pilih program latihan mingguanmu</p>
      {PROGRAMS.map(p => (
        <button key={p.id} className={`card ${state.plan?.programId === p.id ? 'accent' : ''}`} style={{ display: 'block', width: '100%', textAlign: 'left' }} onClick={() => setSel(p.id)}>
          <div className="row between"><h2 style={{ margin: 0 }}>{p.name}</h2>{state.plan?.programId === p.id && <span className="tag">Aktif</span>}</div>
          <div className="mut" style={{ margin: '4px 0 10px' }}>{p.tagline}</div>
          <div className="chips"><span className="pill">{p.level}</span><span className="pill">{p.schedule.length} hari/minggu</span><span className="pill">{[...new Set(p.routines.flatMap(r => r.ex.map(e => e[0])))].length} gerakan</span></div>
        </button>
      ))}
      <p className="note">Pemilihan gerakan dan set/rep mengikuti starter plan openGym. Semua bisa dilihat tutorialnya.</p>
    </>
  )
}
