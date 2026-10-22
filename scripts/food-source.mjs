// Sumber data gizi menu warteg.
// - Bahan: nilai per 100 g. Bila ada kode `tkpi`, nilai kkal/protein/lemak/karbo/serat/natrium/kalium/
//   kalsium/besi/vit C ditimpa dari Tabel Komposisi Pangan Indonesia 2020 (Kemenkes) dan field yang
//   kosong di TKPI diisi estimasi USDA FoodData Central. Gula & lemak jenuh tidak ada di TKPI -> estimasi USDA.
// - Menu: resep porsi warteg umum (gram bahan mentah/dasar + minyak serap + garam + gula).
// - Harga: kisaran warteg Jabodetabek 2025 (Kompas, GoFood). Harga di daerah lain bisa beda.
//
// Urutan v: kkal, protein, lemak, lemak jenuh, karbo, gula, serat, natrium(mg), kalium(mg), kalsium(mg), besi(mg), vitC(mg), kolesterol(mg)

export const ING = {
  nasi:        { n: 'Nasi putih matang',        v: [175, 3.0, 0.3, 0.1, 39.8, 0.1, 0.3, 2, 40, 5, 0.5, 0, 0] },
  ayam:        { n: 'Ayam (paha, dengan kulit)', v: [211, 17, 15.5, 4.3, 0, 0, 0, 85, 220, 12, 0.9, 0, 95] },
  ayam_dada:   { n: 'Ayam dada tanpa kulit',     v: [120, 22.5, 2.6, 0.7, 0, 0, 0, 45, 330, 5, 0.4, 0, 73] },
  hati:        { n: 'Hati ayam',                 v: [119, 17, 4.8, 1.6, 0.7, 0, 0, 71, 230, 8, 9, 28, 345] },
  ampela:      { n: 'Ampela ayam',               v: [94, 17, 2.1, 0.5, 0, 0, 0, 70, 250, 10, 2.5, 0, 130] },
  telur:       { n: 'Telur ayam',                v: [154, 12.4, 10.8, 3.1, 0.7, 0.4, 0, 142, 118, 56, 1.8, 0, 372], tkpi: 'HR002' },
  tempe:       { n: 'Tempe kedelai',             v: [201, 20.8, 8.8, 1.3, 13.5, 0.5, 1.4, 9, 234, 155, 4.0, 0, 0], tkpi: 'CP077' },
  tahu:        { n: 'Tahu putih',                v: [80, 10.9, 4.7, 0.7, 0.8, 0.5, 0.1, 2, 50, 124, 0.8, 0, 0], tkpi: 'CP061' },
  lele:        { n: 'Ikan lele',                 v: [105, 17, 3, 0.7, 0, 0, 0, 50, 300, 14, 0.4, 0, 60] },
  tongkol:     { n: 'Ikan tongkol',              v: [120, 23, 2.5, 0.7, 0, 0, 0, 50, 390, 8, 1.0, 0, 50] },
  teri:        { n: 'Ikan teri kering',          v: [170, 33, 3, 0.9, 0, 0, 0, 1500, 470, 1300, 3.5, 0, 100] },
  daging:      { n: 'Daging sapi',               v: [190, 19, 12, 5, 0, 0, 0, 70, 330, 8, 2.0, 0, 70] },
  kentang:     { n: 'Kentang',                   v: [77, 2.0, 0.1, 0, 17.5, 0.8, 2.2, 6, 421, 12, 0.8, 19.7, 0] },
  mie:         { n: 'Mie kuning basah',          v: [138, 4.5, 2, 0.4, 25, 0.5, 1.2, 12, 70, 10, 1.0, 0, 0] },
  bihun:       { n: 'Bihun matang',              v: [120, 1.5, 0.1, 0, 28, 0, 0.5, 5, 10, 5, 0.5, 0, 0] },
  kangkung:    { n: 'Kangkung',                  v: [28, 3.4, 0.7, 0.1, 3.9, 0.3, 2.0, 64.9, 250.1, 67, 2.5, 17, 0], tkpi: 'DR100' },
  bayam:       { n: 'Bayam',                     v: [16, 0.9, 0.4, 0.1, 2.9, 0.4, 0.7, 15.8, 456.4, 166, 3.5, 41, 0], tkpi: 'DR008' },
  buncis:      { n: 'Buncis',                    v: [34, 2.4, 0.3, 0.1, 7.2, 1.5, 1.9, 8, 250, 65, 1.1, 19, 0], tkpi: 'DR013' },
  kacang_pjg:  { n: 'Kacang panjang',            v: [31, 2.3, 0.1, 0, 5.3, 1.5, 2.7, 30, 213, 49, 0.7, 18, 0], tkpi: 'DR097' },
  labu_siam:   { n: 'Labu siam',                 v: [30, 0.6, 0.1, 0, 6.7, 1.7, 1.7, 2.7, 167.1, 17, 0.3, 8, 0], tkpi: 'DR123' },
  wortel:      { n: 'Wortel',                    v: [36, 1.0, 0.6, 0.1, 7.9, 4.7, 1.0, 70, 245, 45, 1.0, 6, 0], tkpi: 'DR166' },
  kol:         { n: 'Kubis / kol',               v: [25, 1.3, 0.1, 0, 5.8, 3.2, 2.5, 18, 170, 40, 0.5, 36, 0] },
  sawi:        { n: 'Sawi hijau',                v: [28, 2.3, 0.3, 0, 4, 1.3, 2.5, 21.9, 436.5, 220, 2.9, 25, 0], tkpi: 'DR141' },
  tauge:       { n: 'Tauge',                     v: [30, 3, 0.2, 0, 5.9, 4.1, 1.8, 6, 149, 13, 0.9, 13.2, 0] },
  terong:      { n: 'Terong',                    v: [28, 1.1, 0.2, 0, 5.5, 3.5, 2.1, 8.9, 187, 15, 0.5, 2, 0], tkpi: 'DR154' },
  nangka_muda: { n: 'Nangka muda',               v: [57, 2.0, 0.4, 0.1, 11.3, 5, 8.3, 1.1, 246.5, 45, 0.7, 9, 0], tkpi: 'DR130' },
  tomat:       { n: 'Tomat',                     v: [24, 1.3, 0.5, 0.1, 4.7, 3.2, 1.5, 9.8, 164.9, 5, 0.4, 15, 0], tkpi: 'DR161' },
  cabe:        { n: 'Cabe merah',                v: [40, 1.9, 0.4, 0.1, 8.8, 5.3, 1.5, 9, 322, 14, 1.0, 144, 0] },
  bawang_m:    { n: 'Bawang merah',              v: [46, 1.5, 0.3, 0, 9.2, 4.2, 1.7, 7, 178.6, 36, 0.8, 8, 0], tkpi: 'NR007' },
  bawang_p:    { n: 'Bawang putih',              v: [112, 4.5, 0.2, 0.1, 23.1, 1, 0.6, 46, 665.7, 26, 1.5, 31, 0], tkpi: 'NR008' },
  santan:      { n: 'Santan',                    v: [122, 2, 10, 8.8, 7.6, 2.8, 1.4, 9, 162.4, 10, 1.5, 0, 0], tkpi: 'KP003' },
  minyak:      { n: 'Minyak goreng sawit',       v: [884, 0, 100, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0], tkpi: 'KR012' },
  gula:        { n: 'Gula pasir',                v: [387, 0, 0, 0, 100, 100, 0, 1, 2, 1, 0.1, 0, 0] },
  garam:       { n: 'Garam',                     v: [0, 0, 0, 0, 0, 0, 0, 38758, 8, 24, 0.3, 0, 0] },
  kecap:       { n: 'Kecap manis',               v: [190, 2.0, 0.1, 0, 45, 38, 0.2, 1900, 150, 20, 1.2, 0, 0] },
  terigu:      { n: 'Tepung terigu',             v: [333, 9, 1, 0.2, 77.2, 0.3, 0.3, 2, 107, 20, 1.2, 0, 0], tkpi: 'AP025' },
  kacang:      { n: 'Kacang tanah goreng',       v: [564, 25.5, 44.4, 6.2, 25.5, 4.5, 2.8, 5, 700, 54, 1.3, 0, 0], tkpi: 'CP012' },
  kerupuk:     { n: 'Kerupuk goreng',            v: [470, 4.7, 20.5, 8, 68.5, 2, 1.0, 900, 100, 20, 0.8, 0, 0] },
  pisang:      { n: 'Pisang ambon',              v: [108, 1.0, 0.8, 0.2, 24.3, 12, 1.9, 10, 356.3, 10, 0.6, 9, 0], tkpi: 'ER074' },
  pepaya:      { n: 'Pepaya',                    v: [46, 0.5, 0.1, 0, 12.2, 7, 1.6, 4, 221, 23, 1.7, 78, 0], tkpi: 'ER073' },
  jeruk:       { n: 'Jeruk manis',               v: [45, 0.9, 0.2, 0, 11.2, 9, 1.4, 4, 472.1, 33, 0.4, 49, 0], tkpi: 'ER039' }
}

// [id, nama, kategori, porsi, harga min, harga max, resep [[bahan, gram], ...]]
export const DISHES = [
  // Karbohidrat
  ['nasi-putih', 'Nasi putih', 'Karbo', '1 porsi (150 g)', 4000, 6000, [['nasi', 150]]],
  ['mie-goreng', 'Mie goreng', 'Karbo', '1 porsi (150 g)', 3000, 5000, [['mie', 150], ['minyak', 8], ['kecap', 10], ['bawang_m', 8], ['kol', 20], ['garam', 1]]],
  ['bihun-goreng', 'Bihun goreng', 'Karbo', '1 porsi (130 g)', 3000, 5000, [['bihun', 130], ['minyak', 8], ['kecap', 8], ['sawi', 20], ['wortel', 10], ['garam', 1]]],
  ['perkedel-kentang', 'Perkedel kentang', 'Karbo', '1 buah (60 g)', 2500, 4000, [['kentang', 60], ['telur', 8], ['terigu', 5], ['bawang_m', 3], ['minyak', 8], ['garam', 0.4]]],
  // Lauk hewani
  ['ayam-goreng', 'Ayam goreng', 'Lauk hewani', '1 potong paha (100 g mentah)', 11000, 14000, [['ayam', 100], ['terigu', 8], ['minyak', 12], ['bawang_p', 3], ['garam', 1.2]]],
  ['ayam-dada-goreng', 'Ayam goreng dada (tanpa kulit)', 'Lauk hewani', '1 potong (100 g mentah)', 11000, 14000, [['ayam_dada', 100], ['terigu', 8], ['minyak', 10], ['bawang_p', 3], ['garam', 1.2]]],
  ['ayam-kecap', 'Ayam kecap', 'Lauk hewani', '1 potong (100 g mentah)', 11000, 14000, [['ayam', 100], ['kecap', 15], ['bawang_m', 10], ['minyak', 6], ['gula', 5], ['garam', 1]]],
  ['ayam-balado', 'Ayam balado', 'Lauk hewani', '1 potong (100 g mentah)', 11000, 14000, [['ayam', 100], ['cabe', 30], ['bawang_m', 12], ['tomat', 20], ['minyak', 14], ['gula', 3], ['garam', 1.2]]],
  ['ati-ampela', 'Ati ampela balado', 'Lauk hewani', '1 porsi (70 g mentah)', 5000, 8000, [['hati', 40], ['ampela', 30], ['cabe', 15], ['bawang_m', 8], ['minyak', 8], ['gula', 2], ['garam', 0.8]]],
  ['telur-dadar', 'Telur dadar', 'Lauk hewani', '1 butir', 5000, 7000, [['telur', 55], ['minyak', 8], ['bawang_m', 5], ['garam', 0.5]]],
  ['telur-ceplok', 'Telur ceplok', 'Lauk hewani', '1 butir', 4000, 6000, [['telur', 55], ['minyak', 6], ['garam', 0.4]]],
  ['telur-balado', 'Telur balado', 'Lauk hewani', '1 butir', 5000, 7000, [['telur', 55], ['cabe', 25], ['bawang_m', 10], ['tomat', 15], ['minyak', 10], ['gula', 2], ['garam', 0.8]]],
  ['telur-rebus', 'Telur rebus', 'Lauk hewani', '1 butir', 3000, 4000, [['telur', 55]]],
  ['lele-goreng', 'Ikan lele goreng', 'Lauk hewani', '1 ekor (130 g mentah)', 8000, 10000, [['lele', 130], ['terigu', 6], ['minyak', 12], ['garam', 1]]],
  ['tongkol-balado', 'Ikan tongkol balado', 'Lauk hewani', '1 potong (90 g mentah)', 8000, 10000, [['tongkol', 90], ['cabe', 25], ['bawang_m', 10], ['tomat', 15], ['minyak', 12], ['gula', 2], ['garam', 1]]],
  ['rendang', 'Rendang daging', 'Lauk hewani', '1 potong (70 g mentah)', 12000, 18000, [['daging', 70], ['santan', 50], ['cabe', 10], ['bawang_m', 10], ['bawang_p', 4], ['minyak', 4], ['garam', 1]]],
  // Lauk nabati
  ['tempe-goreng', 'Tempe goreng', 'Lauk nabati', '1 potong (40 g)', 2000, 2500, [['tempe', 40], ['minyak', 6], ['garam', 0.5]]],
  ['tahu-goreng', 'Tahu goreng', 'Lauk nabati', '1 potong (50 g)', 2000, 2500, [['tahu', 50], ['minyak', 7], ['garam', 0.5]]],
  ['orek-tempe', 'Orek tempe', 'Lauk nabati', '1 porsi (50 g)', 3000, 5000, [['tempe', 50], ['kecap', 12], ['bawang_m', 6], ['cabe', 5], ['minyak', 6], ['gula', 4], ['garam', 0.5]]],
  ['orek-tempe-teri', 'Orek tempe teri kacang', 'Lauk nabati', '1 porsi (60 g)', 4000, 6000, [['tempe', 40], ['teri', 8], ['kacang', 8], ['kecap', 10], ['bawang_m', 6], ['cabe', 5], ['minyak', 6], ['gula', 4], ['garam', 0.3]]],
  ['tempe-mendoan', 'Tempe mendoan', 'Lauk nabati', '1 potong (45 g)', 2000, 3000, [['tempe', 35], ['terigu', 12], ['minyak', 10], ['garam', 0.6]]],
  ['bakwan', 'Bakwan sayur', 'Lauk nabati', '1 buah (50 g)', 2000, 3000, [['terigu', 20], ['kol', 20], ['wortel', 10], ['minyak', 12], ['garam', 0.6]]],
  ['sambal-goreng-kentang', 'Sambal goreng kentang', 'Lauk nabati', '1 porsi (100 g)', 3000, 5000, [['kentang', 70], ['santan', 25], ['cabe', 10], ['bawang_m', 8], ['minyak', 8], ['garam', 0.8]]],
  // Sayur
  ['sayur-asem', 'Sayur asem', 'Sayur', '1 mangkuk kecil (200 g)', 3000, 5000, [['labu_siam', 40], ['kacang_pjg', 25], ['nangka_muda', 20], ['tomat', 15], ['bawang_m', 5], ['gula', 3], ['garam', 1.2]]],
  ['sayur-lodeh', 'Sayur lodeh', 'Sayur', '1 mangkuk kecil (200 g)', 3000, 5000, [['labu_siam', 40], ['kacang_pjg', 25], ['terong', 30], ['nangka_muda', 20], ['santan', 60], ['cabe', 5], ['bawang_m', 6], ['garam', 1.2]]],
  ['tumis-kangkung', 'Tumis kangkung', 'Sayur', '1 porsi (110 g)', 3000, 5000, [['kangkung', 100], ['minyak', 8], ['bawang_p', 4], ['cabe', 5], ['garam', 0.8]]],
  ['tumis-buncis', 'Tumis buncis wortel', 'Sayur', '1 porsi (100 g)', 3000, 5000, [['buncis', 80], ['wortel', 20], ['minyak', 7], ['bawang_m', 6], ['garam', 0.8]]],
  ['tumis-tauge', 'Tumis tauge', 'Sayur', '1 porsi (100 g)', 3000, 4000, [['tauge', 100], ['minyak', 6], ['bawang_m', 5], ['cabe', 3], ['garam', 0.8]]],
  ['capcay', 'Capcay', 'Sayur', '1 porsi (130 g)', 4000, 6000, [['sawi', 40], ['kol', 30], ['wortel', 25], ['telur', 15], ['ayam_dada', 15], ['minyak', 8], ['bawang_m', 6], ['garam', 1.2]]],
  ['bayam-bening', 'Sayur bayam bening', 'Sayur', '1 mangkuk kecil (200 g)', 3000, 4000, [['bayam', 80], ['bawang_m', 5], ['garam', 1.0]]],
  ['terong-balado', 'Terong balado', 'Sayur', '1 porsi (130 g)', 3000, 5000, [['terong', 120], ['cabe', 20], ['bawang_m', 10], ['tomat', 15], ['minyak', 10], ['gula', 2], ['garam', 0.8]]],
  // Pelengkap
  ['sambal', 'Sambal', 'Pelengkap', '1 sendok makan (20 g)', 1000, 2000, [['cabe', 20], ['tomat', 15], ['bawang_m', 8], ['minyak', 3], ['gula', 1], ['garam', 0.6]]],
  ['kerupuk', 'Kerupuk', 'Pelengkap', '1 buah (8 g)', 500, 1000, [['kerupuk', 8]]],
  // Minuman & buah
  ['es-teh-manis', 'Es teh manis', 'Minuman', '1 gelas (250 ml)', 3000, 5000, [['gula', 20]]],
  ['teh-tawar', 'Teh tawar', 'Minuman', '1 gelas (250 ml)', 2000, 3000, []],
  ['kopi-manis', 'Kopi hitam manis', 'Minuman', '1 gelas (200 ml)', 3000, 4000, [['gula', 15]]],
  ['es-jeruk', 'Es jeruk', 'Minuman', '1 gelas (250 ml)', 4000, 6000, [['jeruk', 150], ['gula', 15]]],
  ['pisang', 'Pisang ambon', 'Buah', '1 buah (80 g)', 2000, 3000, [['pisang', 80]]],
  ['pepaya', 'Pepaya', 'Buah', '1 potong (100 g)', 3000, 5000, [['pepaya', 100]]]
]

// Paket kombinasi siap pilih. [id, nama, tag, [[dishId, qty], ...]]
export const PACKAGES = [
  ['paket-lengkap', 'Paket lengkap warteg', 'Seimbang', [['nasi-putih', 1], ['ayam-goreng', 1], ['orek-tempe', 1], ['tumis-kangkung', 1]]],
  ['paket-hemat', 'Paket super hemat', 'Hemat', [['nasi-putih', 1], ['telur-dadar', 1], ['tempe-goreng', 1], ['sayur-asem', 1]]],
  ['paket-cutting', 'Paket cutting (protein tinggi, kalori rendah)', 'Cutting', [['nasi-putih', 0.7], ['ayam-dada-goreng', 1], ['tumis-buncis', 1], ['telur-rebus', 1]]],
  ['paket-bulking', 'Paket bulking (kalori & protein tinggi)', 'Bulking', [['nasi-putih', 2], ['ayam-balado', 1], ['telur-balado', 1], ['tempe-goreng', 2], ['sayur-lodeh', 1]]],
  ['paket-ikan', 'Paket ikan', 'Seimbang', [['nasi-putih', 1], ['lele-goreng', 1], ['tahu-goreng', 1], ['terong-balado', 1], ['sambal', 1]]]
]
