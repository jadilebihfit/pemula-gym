import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { PROGRAMS, EX_META } from './data/plans.js'
import { exerciseKcal, uid, ymd } from './lib/calc.js'

const KEY = 'jadilebihfit-v1'
const INIT = { profile: null, plan: null, logs: {}, customFoods: [] }
const load = () => { try { return { ...INIT, ...JSON.parse(localStorage.getItem(KEY) || '{}') } } catch { return INIT } }

const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)

import exercisesJson from './generated/exercises.json'
import foodsJson from './generated/foods.json'

const DATA = { exercises: exercisesJson, ...foodsJson }
const base = './'
export const still = id => `${base}media/still/${id}.webp`
export const clip = id => `${base}media/clip/${id}.mp4`

export const findRoutine = (programId, key) => PROGRAMS.find(p => p.id === programId)?.routines.find(r => r.key === key)

// hitung ulang kkal workout dari set yang sudah dicentang
const recompute = (entry, weightKg) => {
  const exercises = entry.exercises.map(ex => {
    const done = ex.sets.filter(s => s.done)
    return { ...ex, kcal: exerciseKcal(EX_META[ex.exId] || { compound: false }, done, weightKg) }
  })
  return { ...entry, exercises, kcal: exercises.reduce((s, e) => s + e.kcal, 0) }
}

export function AppProvider({ children }) {
  const [state, setState] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch (e) {
      console.warn('Gagal menyimpan ke localStorage:', e)
    }
  }, [state])

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.storage?.persist) {
      navigator.storage.persist().then(granted => {
        if (granted) console.log('Penyimpanan lokal permanen aktif di perangkat.')
      }).catch(() => {})
    }
  }, [])
  const data = DATA
  const error = null

  const weight = state.profile?.weight || 70

  const addEntry = useCallback((date, entry) => setState(s => ({
    ...s, logs: { ...s.logs, [date]: [...(s.logs[date] || []), { id: uid(), ts: Date.now(), ...entry }] }
  })), [])

  const removeEntry = useCallback((date, id) => setState(s => ({
    ...s, logs: { ...s.logs, [date]: (s.logs[date] || []).filter(e => e.id !== id) }
  })), [])

  const api = useMemo(() => ({
    saveProfile: profile => setState(s => ({ ...s, profile })),

    choosePlan: (programId, schedule) => {
      setState(s => ({ ...s, plan: { programId, schedule } }))
      const p = PROGRAMS.find(x => x.id === programId)
      addEntry(ymd(), { type: 'plan', title: `Memilih program ${p.name}`, detail: `${schedule.length} hari latihan per minggu` })
    },

    addEntry, removeEntry,

    // Mulai sesi latihan: otomatis tercatat di kegiatan hari itu.
    startWorkout: (date, programId, routineKey) => {
      const r = findRoutine(programId, routineKey)
      const id = uid()
      const exercises = r.ex.map(([exId, sets, reps]) => ({
        exId, kcal: 0, sets: Array.from({ length: sets }, () => ({ reps, weight: 0, done: false }))
      }))
      setState(s => {
        // beban & reps terakhir per gerakan, diambil dari riwayat terbaru
        const last = {}
        for (const d of Object.keys(s.logs).sort()) for (const e of s.logs[d]) if (e.type === 'workout') for (const x of e.exercises) {
          const done = x.sets.filter(t => t.done)
          if (done.length) last[x.exId] = done[done.length - 1]
        }
        const withLast = exercises.map(x => last[x.exId] ? { ...x, sets: x.sets.map(t => ({ ...t, weight: last[x.exId].weight, reps: t.reps })) } : x)
        return { ...s, logs: { ...s.logs, [date]: [...(s.logs[date] || []), {
          id, ts: Date.now(), type: 'workout', title: r.name, programId, routineKey, status: 'ongoing', exercises: withLast, kcal: 0
        }] } }
      })
      return id
    },

    // Mutasi latihan; kkal dihitung ulang otomatis.
    updateWorkout: (date, id, fn) => setState(s => ({
      ...s, logs: { ...s.logs, [date]: (s.logs[date] || []).map(e => e.id === id ? recompute(fn(e), s.profile?.weight || 70) : e) }
    })),

    addCustomFood: food => setState(s => ({ ...s, customFoods: [...s.customFoods, { id: 'c-' + uid(), custom: true, ...food }] })),
    removeCustomFood: id => setState(s => ({ ...s, customFoods: s.customFoods.filter(f => f.id !== id) })),
    exportData: () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `jadilebihfit-cadangan-${ymd()}.json`
      a.click()
      URL.revokeObjectURL(url)
    },
    importData: jsonStr => {
      try {
        const parsed = JSON.parse(jsonStr)
        if (!parsed || typeof parsed !== 'object') throw new Error('Format tidak valid')
        const merged = { ...INIT, ...parsed }
        setState(merged)
        localStorage.setItem(KEY, JSON.stringify(merged))
        return true
      } catch (err) {
        alert('Gagal memulihkan data: ' + err.message)
        return false
      }
    },
    reset: () => { localStorage.removeItem(KEY); location.reload() }
  }), [addEntry, removeEntry, state])

  const value = useMemo(() => ({ state, data, error, weight, ...api }), [state, data, error, weight, api])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// ---------- ringkasan harian ----------
export const ZERO = { kcal: 0, protein: 0, fat: 0, satFat: 0, carbs: 0, sugar: 0, fiber: 0, sodium: 0, potassium: 0, calcium: 0, iron: 0, vitC: 0, cholesterol: 0 }

export function summarize(entries = []) {
  const eaten = { ...ZERO }
  let burned = 0, spent = 0, workouts = 0
  for (const e of entries) {
    if (e.type === 'meal') {
      for (const k of Object.keys(ZERO)) eaten[k] += e.nutrition?.[k] || 0
      spent += e.price || 0
    } else if (e.type === 'workout') {
      burned += e.kcal || 0
      if (e.exercises.some(x => x.sets.some(s => s.done))) workouts++
    }
  }
  return { eaten, burned, spent, workouts }
}
