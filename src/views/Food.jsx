import Icon from '../icons.jsx'
import { useMemo, useState } from 'react'
import { summarize, useApp, ZERO } from '../store.jsx'
import { Bar, NutritionTable, Sheet, Stepper } from '../ui.jsx'
import { rp } from '../lib/calc.js'

const SLOTS = ['Sarapan', 'Makan siang', 'Makan malam', 'Camilan']
const defaultSlot = () => { const h = new Date().getHours(); return h < 10 ? 'Sarapan' : h < 15 ? 'Makan siang' : h < 18 ? 'Camilan' : 'Makan malam' }
const scale = (n, m) => Object.fromEntries(Object.keys(ZERO).map(k => [k, Math.round((n[k] || 0) * m * 10) / 10]))

function AddSheet({ item, isPackage, data, date, onClose }) {
  const { addEntry } = useApp()
  const [qty, setQty] = useState(1)
  const [slot, setSlot] = useState(defaultSlot())
  const foodMap = useMemo(() => Object.fromEntries(data.foods.map(f => [f.id, f])), [data])
  const n = item.nutrition

  const add = () => {
    if (isPackage) {
      for (const { foodId, qty: q } of item.items) {
        const f = foodMap[foodId]
        addEntry(date, { type: 'meal', title: f.name, slot, qty: q * qty, nutrition: scale(f.nutrition, q * qty), price: f.price * q * qty, foodId, via: item.name })
      }
    } else {
      addEntry(date, { type: 'meal', title: item.name, slot, qty, nutrition: scale(n, qty), price: item.price * qty, foodId: item.id })
    }
    onClose()
  }
  return (
    <Sheet onClose={onClose}>
      <h2>{item.name}</h2>
      <div className="mut" style={{ marginBottom: 10 }}>{isPackage ? item.items.map(i => `${i.qty}× ${foodMap[i.foodId].name}`).join(' + ') : item.serving}</div>
      <div className="row between" style={{ marginBottom: 12 }}>
        <div className="big green">{Math.round(n.kcal * qty)}<span className="mut" style={{ fontSize: 15 }}> kkal</span></div>
        <div style={{ textAlign: 'right' }}><b>{rp(item.price * qty)}</b>{!isPackage && item.priceMin && <div className="small mut">{rp(item.priceMin)} – {rp(item.priceMax)}</div>}</div>
      </div>
      <div className="grid2" style={{ marginBottom: 12 }}>
        <div className="field" style={{ margin: 0 }}><label>Jumlah porsi</label><Stepper value={qty} onChange={setQty} step={0.5} min={0.5} max={20} /></div>
        <div className="field" style={{ margin: 0 }}><label>Waktu makan</label>
          <select className="input" style={{ padding: '12px 10px', fontSize: 15 }} value={slot} onChange={e => setSlot(e.target.value)}>{SLOTS.map(s => <option key={s}>{s}</option>)}</select>
        </div>
      </div>
      <NutritionTable n={n} mult={qty} />
      {!isPackage && item.ingredients && <p className="note">Resep: {item.ingredients.map(i => `${i.name} ${i.grams} g`).join(', ')}.</p>}
      <button className="btn" onClick={add}>Catat ke hari ini</button>
    </Sheet>
  )
}

function CustomForm({ onClose }) {
  const { addCustomFood } = useApp()
  const [f, setF] = useState({ name: '', kcal: '', protein: '', carbs: '', fat: '', sugar: '', fiber: '', sodium: '', potassium: '', price: '' })
  const inp = (k, label, ph) => <div className="field" key={k}><label>{label}</label><input className="input" inputMode="decimal" placeholder={ph} value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })} /></div>
  return (
    <Sheet onClose={onClose}>
      <h2>Tambah makanan sendiri</h2>
      <div className="field"><label>Nama</label><input className="input" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></div>
      <div className="grid2">{inp('kcal', 'Kalori (kkal)', '0')}{inp('protein', 'Protein (g)', '0')}{inp('carbs', 'Karbo (g)', '0')}{inp('fat', 'Lemak (g)', '0')}
        {inp('sugar', 'Gula (g)', '0')}{inp('fiber', 'Serat (g)', '0')}{inp('sodium', 'Natrium (mg)', '0')}{inp('potassium', 'Kalium (mg)', '0')}</div>
      {inp('price', 'Harga (Rp)', '0')}
      <button className="btn" disabled={!f.name || !Number(f.kcal)} onClick={() => {
        const num = k => Number(f[k]) || 0
        addCustomFood({ name: f.name, category: 'Kustom', serving: '1 porsi', price: num('price'), nutrition: { ...ZERO, kcal: num('kcal'), protein: num('protein'), carbs: num('carbs'), fat: num('fat'), sugar: num('sugar'), fiber: num('fiber'), sodium: num('sodium'), potassium: num('potassium') } })
        onClose()
      }}>Simpan</button>
    </Sheet>
  )
}

function Today({ date }) {
  const { state, removeEntry } = useApp()
  const p = state.profile
  const entries = state.logs[date] || []
  const { eaten, spent } = summarize(entries)
  const meals = entries.filter(e => e.type === 'meal')
  return (
    <>
      <div className="card">
        <div className="row between"><div className="big">{Math.round(eaten.kcal)}<span className="mut" style={{ fontSize: 15 }}> / {p.target} kkal</span></div><b>{rp(spent)}</b></div>
        <div className="gap" /><Bar value={eaten.kcal} max={p.target} cls={eaten.kcal > p.target ? 'r' : ''} />
        <div className="gap" />
        {[['Protein', eaten.protein, p.macros.protein, ''], ['Karbo', eaten.carbs, p.macros.carbs, 'o'], ['Lemak', eaten.fat, p.macros.fat, 'y']].map(([l, v, m, c]) => (
          <div key={l} style={{ marginBottom: 8 }}><div className="row between small"><span>{l}</span><span className="mut">{Math.round(v)} / {m} g</span></div><Bar value={v} max={m} cls={c} /></div>
        ))}
      </div>
      <h2>Nutrisi lengkap hari ini</h2>
      <div className="card"><NutritionTable n={eaten} showRef /><p className="note" style={{ marginBottom: 0 }}>Persentase terhadap acuan harian: natrium 2.000 mg, kalium 3.500 mg, serat 28 g, gula 50 g, kalsium 1.000 mg, besi 13 mg, vitamin C 90 mg, kolesterol 300 mg.</p></div>
      <h2>Yang sudah dimakan</h2>
      {meals.length === 0 && <div className="card mut">Belum ada makanan dicatat.</div>}
      {SLOTS.map(s => {
        const list = meals.filter(m => m.slot === s)
        if (!list.length) return null
        return (
          <div className="card" key={s}>
            <div className="row between"><h3>{s}</h3><span className="mut small">{Math.round(list.reduce((a, m) => a + m.nutrition.kcal, 0))} kkal</span></div>
            {list.map(m => (
              <div className="item" key={m.id}>
                <div className="grow"><div className="t">{m.qty !== 1 ? `${m.qty}× ` : ''}{m.title}</div><div className="s">{Math.round(m.nutrition.kcal)} kkal · P {Math.round(m.nutrition.protein)} · K {Math.round(m.nutrition.carbs)} · L {Math.round(m.nutrition.fat)} · {rp(m.price)}</div></div>
                <button className="iconbtn" style={{ width: 34, height: 34, fontSize: 14 }} onClick={() => removeEntry(date, m.id)}><Icon name="close" size={14} /></button>
              </div>
            ))}
          </div>
        )
      })}
    </>
  )
}

export default function Food({ date }) {
  const { data, state, removeCustomFood } = useApp()
  const [tab, setTab] = useState('menu')
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('Semua')
  const [sort, setSort] = useState('default')
  const [add, setAdd] = useState(null)
  const [custom, setCustom] = useState(false)

  const foods = useMemo(() => data ? [...data.foods, ...state.customFoods] : [], [data, state.customFoods])
  const cats = useMemo(() => ['Semua', ...new Set(foods.map(f => f.category))], [foods])
  const list = useMemo(() => {
    let l = foods.filter(f => (cat === 'Semua' || f.category === cat) && f.name.toLowerCase().includes(q.toLowerCase()))
    if (sort === 'cheap') l = [...l].sort((a, b) => a.price - b.price)
    if (sort === 'protein') l = [...l].sort((a, b) => b.nutrition.protein - a.nutrition.protein)
    if (sort === 'lowcal') l = [...l].sort((a, b) => a.nutrition.kcal - b.nutrition.kcal)
    return l
  }, [foods, q, cat, sort])

  if (!data) return <p className="mut">Memuat data makanan…</p>
  return (
    <>
      <h1>Makan</h1>
      <p className="sub">Menu warteg murah, lengkap dengan gizinya</p>
      <div className="seg" style={{ marginBottom: 14 }}>
        {[['menu', 'Menu'], ['paket', 'Paket'], ['today', 'Hari ini']].map(([k, l]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}
      </div>

      {tab === 'menu' && (
        <>
          <input className="input" placeholder="Cari menu…" value={q} onChange={e => setQ(e.target.value)} />
          <div className="chips" style={{ margin: '12px 0', flexWrap: 'nowrap', overflowX: 'auto' }}>
            {cats.map(c => <button key={c} className={`chip ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>{c}</button>)}
          </div>
          <div className="chips" style={{ marginBottom: 12 }}>
            {[['default', 'Urut awal'], ['cheap', 'Termurah'], ['protein', 'Protein tertinggi'], ['lowcal', 'Kalori terendah']].map(([k, l]) => <button key={k} className={`chip ${sort === k ? 'on' : ''}`} onClick={() => setSort(k)}>{l}</button>)}
          </div>
          <div className="card">
            {list.map(f => (
              <div className="item" key={f.id}>
                <button className="grow" style={{ textAlign: 'left' }} onClick={() => setAdd({ item: f })}>
                  <div className="t">{f.name}</div>
                  <div className="s">{f.serving} · {rp(f.price)}</div>
                  <div className="chips" style={{ marginTop: 5, gap: 5 }}>
                    <span className="pill orange">{Math.round(f.nutrition.kcal)} kkal</span><span className="pill">P {Math.round(f.nutrition.protein)}</span>
                    <span className="pill">K {Math.round(f.nutrition.carbs)}</span><span className="pill">L {Math.round(f.nutrition.fat)}</span><span className="pill">Na {Math.round(f.nutrition.sodium)}</span>
                  </div>
                </button>
                <button className="iconbtn" style={{ background: 'var(--green)', color: '#000', fontWeight: 800 }} onClick={() => setAdd({ item: f })}><Icon name="plus" size={20} stroke={2.6} /></button>
              </div>
            ))}
            {list.length === 0 && <div className="mut">Tidak ada menu cocok.</div>}
          </div>
          <button className="btn sec" onClick={() => setCustom(true)}>+ Tambah makanan sendiri</button>
          {state.customFoods.length > 0 && <button className="link" onClick={() => { if (confirm('Hapus semua makanan kustom?')) state.customFoods.forEach(f => removeCustomFood(f.id)) }}>Hapus makanan kustom</button>}
          <div className="gap" />
          <p className="note">Gizi dihitung dari resep warteg umum (TKPI Kemenkes 2020 + estimasi USDA). Harga kisaran Jabodetabek 2025: tiap warung berbeda.</p>
        </>
      )}

      {tab === 'paket' && data.packages.map(p => (
        <div className="card" key={p.id}>
          <div className="row between"><h3 style={{ margin: 0 }}>{p.name}</h3><span className="tag">{p.tag}</span></div>
          <div className="mut small" style={{ margin: '6px 0 10px' }}>{p.items.map(i => `${i.qty !== 1 ? i.qty + '× ' : ''}${data.foods.find(f => f.id === i.foodId).name}`).join(' + ')}</div>
          <div className="chips" style={{ marginBottom: 12 }}>
            <span className="pill orange">{p.nutrition.kcal} kkal</span><span className="pill">P {Math.round(p.nutrition.protein)} g</span><span className="pill">K {Math.round(p.nutrition.carbs)} g</span><span className="pill">L {Math.round(p.nutrition.fat)} g</span><b>{rp(p.price)}</b>
          </div>
          <button className="btn sec" onClick={() => setAdd({ item: p, pkg: true })}>Lihat & tambah</button>
        </div>
      ))}

      {tab === 'today' && <Today date={date} />}
      {add && <AddSheet item={add.item} isPackage={add.pkg} data={data} date={date} onClose={() => setAdd(null)} />}
      {custom && <CustomForm onClose={() => setCustom(false)} />}
    </>
  )
}
