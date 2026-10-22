// Program latihan. Pilihan gerakan & set/rep diambil dari starter plan openGym
// (opengym-src/frontend/src/lib/starter.js). Tiap routine = [exerciseId, sets, reps].
// Jadwal: hari 1 = Senin ... 7 = Minggu.

export const PROGRAMS = [
  {
    id: 'ppl',
    name: 'Push / Pull / Legs',
    tagline: 'Dorong, tarik, kaki. 3 hari per minggu.',
    level: 'Pemula – Menengah',
    desc: 'Latihan dibagi per pola gerak. Push melatih dada, bahu, trisep. Pull melatih punggung dan bisep. Legs melatih seluruh otot kaki.',
    schedule: [[1, 'push'], [3, 'pull'], [5, 'legs']],
    routines: [
      { key: 'push', name: 'Push Day (Dada, Bahu, Trisep)', focus: 'Dada, Bahu Depan, Trisep', ex: [['0025', 4, 8], ['0047', 3, 10], ['0426', 3, 10], ['0334', 3, 12], ['0241', 3, 12], ['0251', 3, 10]] },
      { key: 'pull', name: 'Pull Day (Punggung & Bisep)', focus: 'Punggung Sayap, Punggung Atas, Bisep', ex: [['2330', 4, 10], ['0027', 4, 8], ['1323', 3, 10], ['0031', 3, 10], ['0313', 3, 12]] },
      { key: 'legs', name: 'Leg Day (Kaki Lengkap)', focus: 'Paha Depan, Paha Belakang, Bokong, Betis', ex: [['0043', 4, 8], ['0085', 3, 10], ['0739', 3, 12], ['0585', 3, 12], ['0586', 3, 12], ['0605', 4, 15]] }
    ]
  },
  {
    id: 'upper-lower',
    name: 'Upper / Lower',
    tagline: 'Badan atas dan bawah bergantian. 4 hari per minggu.',
    level: 'Menengah',
    desc: 'Tiap bagian otot dilatih 2 kali seminggu dengan rotasi seimbang. Ideal untuk percepatan progres otot.',
    schedule: [[1, 'upper-a'], [2, 'lower-a'], [4, 'upper-b'], [5, 'lower-b']],
    routines: [
      { key: 'upper-a', name: 'Upper A (Tubuh Atas - Fokus Dada)', focus: 'Dada, Punggung, Bahu, Lengan', ex: [['0025', 3, 8], ['2330', 3, 10], ['0047', 2, 10], ['1323', 2, 10], ['0334', 2, 12], ['0241', 2, 12], ['0031', 2, 12]] },
      { key: 'lower-a', name: 'Lower A (Tubuh Bawah - Fokus Squat)', focus: 'Paha Depan (Squat), Bokong, Betis', ex: [['0043', 3, 8], ['0085', 3, 8], ['0739', 2, 10], ['0586', 2, 12], ['0605', 3, 15]] },
      { key: 'upper-b', name: 'Upper B (Tubuh Atas - Fokus Punggung)', focus: 'Punggung, Bahu, Dada, Lengan', ex: [['0047', 3, 8], ['0027', 3, 8], ['0426', 2, 10], ['2330', 2, 10], ['0334', 2, 12], ['0241', 2, 12], ['0313', 2, 12]] },
      { key: 'lower-b', name: 'Lower B (Tubuh Bawah - Fokus Deadlift)', focus: 'Paha Belakang (RDL), Paha Depan, Betis', ex: [['0739', 3, 10], ['0085', 2, 10], ['0585', 2, 12], ['0586', 3, 12], ['0605', 3, 15]] }
    ]
  },
  {
    id: 'full-body',
    name: 'Full Body',
    tagline: 'Seluruh badan tiap sesi. 3 hari per minggu.',
    level: 'Pemula',
    desc: 'Sangat cocok untuk pemula dan kesibukan tinggi. Setiap sesi mengaktifkan seluruh kelompok otot utama.',
    schedule: [[1, 'fb-a'], [3, 'fb-b'], [5, 'fb-c']],
    routines: [
      { key: 'fb-a', name: 'Full Body A (Sesi 1)', focus: 'Seluruh Tubuh: Squat, Dada, Punggung Sayap', ex: [['0043', 3, 8], ['0025', 3, 8], ['2330', 3, 10], ['0586', 3, 12], ['0334', 2, 12], ['0031', 2, 12]] },
      { key: 'fb-b', name: 'Full Body B (Sesi 2)', focus: 'Seluruh Tubuh: RDL, Dada Atas, Dayung Kabel', ex: [['0085', 3, 8], ['0047', 3, 10], ['1323', 3, 10], ['0585', 3, 12], ['0334', 2, 12], ['0241', 2, 12]] },
      { key: 'fb-c', name: 'Full Body C (Sesi 3)', focus: 'Seluruh Tubuh: Leg Press, Dada, Punggung, Bahu', ex: [['0739', 3, 10], ['0025', 2, 10], ['0027', 3, 10], ['0426', 2, 10], ['0586', 3, 12], ['0605', 3, 15]] }
    ]
  }
]

export const DAY_NAMES = ['', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
export const DAY_SHORT = ['', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'MIN']

// Tips singkat Bahasa Indonesia + tipe gerakan. compound = gerakan majemuk (kalori lebih besar).
export const EX_META = {
  '0025': { id: 'Bench press', compound: true, tip: 'Rapatkan tulang belikat, kaki menapak kuat, turunkan bar ke dada tengah lalu dorong lurus ke atas.' },
  '0047': { id: 'Incline bench press', compound: true, tip: 'Bangku miring 30–45°. Turunkan bar ke dada atas, siku sekitar 45° dari badan.' },
  '0426': { id: 'Dumbbell overhead press', compound: true, tip: 'Berdiri tegak, perut kencang, dorong dumbbell lurus ke atas kepala tanpa melengkungkan punggung bawah.' },
  '0334': { id: 'Lateral raise', compound: false, tip: 'Angkat dumbbell ke samping sampai sejajar bahu, siku sedikit menekuk, turun perlahan. Jangan diayun.' },
  '0241': { id: 'Triceps pushdown', compound: false, tip: 'Siku menempel di samping badan, tekan sampai lengan lurus, tahan sebentar, kembali terkontrol.' },
  '0251': { id: 'Chest dip', compound: true, tip: 'Badan sedikit condong ke depan, turunkan sampai siku sekitar 90°, dorong naik. Berhenti kalau bahu terasa nyeri.' },
  '2330': { id: 'Lat pulldown', compound: true, tip: 'Tarik bar ke dada atas dengan siku mengarah ke bawah. Bayangkan menarik dengan siku, bukan tangan.' },
  '0027': { id: 'Bent over row', compound: true, tip: 'Pinggul mundur, punggung lurus, tarik bar ke perut bawah. Jangan menyentak dengan badan.' },
  '1323': { id: 'Seated cable row', compound: true, tip: 'Dada tegak, tarik tali ke perut sambil menjepit tulang belikat. Kembali pelan sampai lengan lurus.' },
  '0031': { id: 'Barbell curl', compound: false, tip: 'Siku tetap di samping badan, angkat bar sampai biceps berkontraksi penuh, turun perlahan.' },
  '0313': { id: 'Hammer curl', compound: false, tip: 'Genggaman netral (telapak saling berhadapan). Angkat tanpa mengayun badan.' },
  '0043': { id: 'Back squat', compound: true, tip: 'Bar di punggung atas, dada tegak, turun sampai paha sejajar lantai atau lebih, lutut searah jari kaki, dorong naik lewat tumit.' },
  '0085': { id: 'Romanian deadlift', compound: true, tip: 'Lutut sedikit menekuk, dorong pinggul ke belakang, bar menempel kaki. Turun sampai hamstring terasa tegang, lalu dorong pinggul ke depan.' },
  '0739': { id: 'Leg press', compound: true, tip: 'Punggung dan pinggul menempel di sandaran. Turun sampai lutut sekitar 90°, jangan kunci lutut di atas.' },
  '0585': { id: 'Leg extension', compound: false, tip: 'Luruskan lutut sampai quads berkontraksi, tahan sebentar, turun pelan.' },
  '0586': { id: 'Lying leg curl', compound: false, tip: 'Tekuk lutut menarik beban ke arah bokong, pinggul tetap menempel, turun terkontrol.' },
  '0605': { id: 'Standing calf raise', compound: false, tip: 'Naik setinggi mungkin di ujung kaki, tahan 1 detik, turun sampai betis meregang penuh.' }
}

export const exerciseIds = () => [...new Set(PROGRAMS.flatMap(p => p.routines.flatMap(r => r.ex.map(e => e[0]))))]
