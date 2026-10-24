import Icon from '../icons.jsx'

// Nama file APK dipertahankan persis seperti aslinya.
const APK_NAME = 'panduan gym @jadilebihfit.apk'
const APK = './' + encodeURIComponent(APK_NAME)

// Unduh APK tanpa mengubah alamat di address bar.
const downloadApk = () => {
  const a = document.createElement('a')
  a.href = APK
  a.download = APK_NAME
  document.body.appendChild(a)
  a.click()
  a.remove()
}

const FITUR = [
  ['dumbbell', 'Program latihan siap pakai', 'Push/Pull/Legs, Upper/Lower, dan Full Body lengkap dengan tutorial tiap gerakan.'],
  ['flame', 'Hitung kalori harian', 'Target kalori & makro otomatis untuk cutting, maintain, atau bulking.'],
  ['utensils', 'Menu warteg + harga', 'Catat makan dari ratusan menu Indonesia berbasis data TKPI Kemenkes.'],
  ['lock', 'Data aman di HP kamu', 'Tanpa daftar, tanpa login. Semua tersimpan permanen di perangkatmu.']
]

export default function Landing({ onStart }) {
  return (
    <div className="app lp">
      <div className="lp-hero">
        <div className="lp-badge"><Icon name="dumbbell" size={16} /> Gratis untuk pemula</div>
        <h1>Mulai gym tanpa bingung.</h1>
        <p className="sub">
          JadiLebihFit adalah panduan gym untuk pemula: pilih program, ikuti tutorial gerakan,
          catat latihan, dan pantau kalori harian dalam satu aplikasi.
        </p>
      </div>

      <div className="lp-cta">
        <button className="btn lp-btn" onClick={onStart}>
          <Icon name="globe" size={20} /> Akses Gratis via Web
        </button>
        <button className="btn sec lp-btn" onClick={downloadApk}>
          <Icon name="android" size={20} /> Unduh Aplikasi Android
        </button>
        <div className="mut small" style={{ textAlign: 'center' }}>File APK ±760 KB · Gratis</div>
      </div>

      <div className="lp-fitur">
        {FITUR.map(([ic, t, d]) => (
          <div key={t} className="card row" style={{ alignItems: 'flex-start' }}>
            <div className="ico"><Icon name={ic} /></div>
            <div className="grow"><div style={{ fontWeight: 700 }}>{t}</div><div className="mut small" style={{ marginTop: 2, lineHeight: 1.45 }}>{d}</div></div>
          </div>
        ))}
      </div>

      <p className="mut small" style={{ textAlign: 'center', marginTop: 24 }}>© {new Date().getFullYear()} JadiLebihFit</p>
    </div>
  )
}
