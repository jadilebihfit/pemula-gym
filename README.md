# JadiLebihFit (free)

Aplikasi latihan + kalori + menu warteg. Semua data tersimpan lokal di browser (localStorage), tanpa akun.

## Menjalankan

```bash
npm install
npm run dev        # mode dev, buka http://localhost:5173/app.html
npm run build      # build + salin ke root: index.html, assets/, media/
```

`index.html` di root adalah hasil build, bisa dibuka langsung (klik dua kali) dan langsung jalan di GitHub Pages. Kode sumber ada di `app.html` + `src/`. Setelah mengubah kode, jalankan `npm run build` sebelum commit.

Data gerakan dan menu sudah dibuat di `public/data`. Untuk membuat ulang (butuh folder `opengym-src` dan `tkpi-src`):

```bash
git clone https://github.com/TheBlackSide243/openGym.git opengym-src
git clone https://github.com/ancxlol/tkpi-2020-database.git tkpi-src
npm run data
```

## Fitur

1. Kalkulator kalori (Mifflin-St Jeor): gender, usia, TB, BB, aktivitas, tujuan cutting / maintain / bulking. Muncul sebelum fitur utama.
2. Program Push/Pull/Legs, Upper/Lower, Full Body, lengkap dengan gerakan, set/rep, animasi, dan tutorial langkah (`src/data/plans.js`).
3. Mulai latihan: centang set, atur beban dan reps, tambah gerakan. Kalori terbakar dihitung otomatis (MET).
4. Menu warteg dengan harga dan gizi lengkap (kalori, protein, karbo, gula, serat, lemak, lemak jenuh, kolesterol, natrium, kalium, kalsium, besi, vitamin C), paket hemat/cutting/bulking, dan input makanan sendiri.
5. Tab Aktivitas: semua kegiatan (pilih program, latihan, makan) tercatat otomatis, lengkap dengan kalori masuk/terbakar.

## Sumber data dan lisensi

- Teks gerakan, tutorial, animasi: [openGym](https://github.com/DuarteSantos8/openGym) (AGPL-3.0). Animasi © Gym visual, hanya boleh dipakai non-komersial bersama NOTICE openGym. Lihat `NOTICE.md`.
- Gizi bahan: Tabel Komposisi Pangan Indonesia 2020, Kemenkes RI (ekstraksi: ancxlol/tkpi-2020-database). Gula, lemak jenuh, kolesterol, dan nilai yang kosong di TKPI diisi estimasi USDA FoodData Central.
- Harga: kisaran warteg Jabodetabek 2025 (Kompas, GoFood). Berbeda tiap warung dan kota.
- Nilai gizi menu adalah estimasi dari resep umum, bukan hasil uji lab.
