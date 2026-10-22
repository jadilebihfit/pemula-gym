import Icon from './icons.jsx'
import { useState } from 'react'
import { AppProvider, useApp } from './store.jsx'
import { ymd } from './lib/calc.js'
import Onboarding from './views/Onboarding.jsx'
import Home from './views/Home.jsx'
import Plan from './views/Plan.jsx'
import Workout from './views/Workout.jsx'
import Food from './views/Food.jsx'
import Log from './views/Log.jsx'

function Shell() {
  const { state, data, error, startWorkout } = useApp()
  const [tab, setTab] = useState('home')
  const [date, setDate] = useState(ymd())
  const [editing, setEditing] = useState(false)

  if (!state.profile || editing) return <Onboarding editing={!!state.profile} onDone={() => setEditing(false)} />
  if (error) return <div className="app">Gagal memuat data: {error}</div>
  if (!data) return <div className="app mut">Memuat…</div>

  const ongoing = (state.logs[ymd()] || []).some(e => e.type === 'workout' && e.status === 'ongoing')
  // Pindah tab; bila membawa sesi, langsung mulai latihan (tercatat otomatis).
  const go = (t, payload) => {
    if (t === 'workout' && payload?.programId && !ongoing) startWorkout(ymd(), payload.programId, payload.key)
    if (payload?.today) setDate(ymd())
    setTab(t)
    window.scrollTo(0, 0)
  }
  const nav = [['home', 'home', 'Beranda'], ['plan', 'calendar', 'Program'], ['workout', 'dumbbell', ongoing ? 'Latihan' : 'Mulai'], ['food', 'utensils', 'Makan'], ['log', 'chart', 'Aktivitas']]

  return (
    <>
      <div className="app">
        {tab === 'home' && <Home date={date} setDate={setDate} go={go} editProfile={() => setEditing(true)} />}
        {tab === 'plan' && <Plan go={go} />}
        {tab === 'workout' && <Workout go={go} />}
        {tab === 'food' && <Food date={date} />}
        {tab === 'log' && <Log date={date} setDate={setDate} />}
      </div>
      <nav className="nav"><div>
        {nav.map(([k, icon, label]) => (
          <button key={k} className={`${tab === k ? 'on' : ''} ${k === 'workout' ? 'start' : ''} ${k === 'workout' && ongoing ? 'live' : ''}`} onClick={() => go(k)}>
            <span><Icon name={icon} size={k === 'workout' ? 30 : 24} /></span>{label}
          </button>
        ))}
      </div></nav>
    </>
  )
}

export default function App() {
  return <AppProvider><Shell /></AppProvider>
}
