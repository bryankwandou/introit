# Introit

Perangkat lunak proyeksi untuk gereja yang berjalan di dalam peramban. Lirik, liturgi,
dan doa naik ke layar tanpa pemasangan, tanpa langganan, dan tanpa tanda air.

Introit dibuat untuk orang yang duduk di bilik proyektor setiap minggu: sukarelawan yang
punya laptop seadanya, jaringan yang kadang mati, dan misa yang tetap harus jalan.

## Yang sudah bekerja

- **Meja operator dua jendela.** Satu tombol melempar jendela keluaran ke proyektor lewat
  Window Management API, dengan jendela biasa sebagai cadangan.
- **Tanpa jaringan.** Seluruh pustaka duduk di IndexedDB peramban. Tidak ada satu pun
  permintaan ke server di jalur penayangan.
- **Ordinarium Misa bawaan.** Tanda Salib sampai Berkat dalam bahasa Indonesia, sudah
  terpotong per salindia.
- **Pustaka yang bisa dicari sampai ke baris lirik**, lengkap dengan label dan koleksi.
- **Tata ibadat** dengan penyusunan ulang lewat seret-lepas dan catatan khusus operator.
- **Tema per butir**: satu lagu boleh tampil di atas fotonya sendiri sementara sisa
  ibadat tetap polos. Pilihan tema tersimpan di tata ibadat, jadi masih ada minggu
  depan.
- **Tema** yang ukurannya dihitung sebagai persen tinggi layar, jadi pratinjau kecil sama
  persis dengan hasil di dinding gereja.
- **Penyusun bacaan** yang membaca nomor ayat dari teks yang ditempel, memotong satu
  ayat per salindia, dan memenggal kalimat kepanjangan di titik terdekat. Teks Alkitab
  tidak ikut dibundel: paroki menempel terjemahan yang memang boleh mereka tayangkan.
- **Latar foto dan video** yang disimpan sebagai blob di IndexedDB dan dipasang ke tema;
  jendela keluaran membaca berkasnya sendiri, jadi tidak ada video yang menyeberangi
  BroadcastChannel.
- **Monitor panggung** di `/stage` untuk pemusik dan lektor: bait yang tayang, bait
  berikutnya, jam dinding, dan tidak ada satu pun kendali.
- **Peralihan salindia** yang menyilangkan bait lama dan baru, panjangnya diatur per
  tema dan bisa dimatikan sama sekali untuk potong langsung.
- **Hitung mundur pra-ibadat** yang memakai warna tema yang sedang dipakai.
- **Impor dan ekspor OpenLyrics**, format terbuka yang dibaca OpenLP, ditambah cadangan
  lengkap dalam satu berkas JSON.
- **Pintasan papan tik** ala perangkat lunak desktop: spasi maju, panah mundur, `B`
  menggelapkan, `C` membersihkan, `?` membuka daftar pintasan.
- **Dapat dipasang sebagai aplikasi** lewat manifest dan service worker.

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

- `/` — halaman depan
- `/studio` — meja operator
- `/output` — layar yang dilihat umat
- `/stage` — monitor yang menghadap pemusik

## Bentuk kode

```
src/lib/types.ts     kosakata data, mengikuti OpenLyrics
src/lib/db.ts        skema IndexedDB (Dexie)
src/lib/slides.ts    penguraian bagian menjadi salindia
src/lib/stage.ts     jembatan operator ke layar (BroadcastChannel + localStorage)
src/lib/io.ts        impor/ekspor OpenLyrics dan cadangan
src/lib/media.ts     penyimpanan blob latar dan object URL-nya
src/lib/scripture.ts penguraian bacaan yang ditempel menjadi salindia
src/lib/seed/        Ordinarium, doa harian, dan himne domain publik
src/components/      SlideCanvas, meja operator, halaman depan
```

`SlideCanvas` memakai satuan `cqh` (persentase tinggi kontainernya sendiri), sehingga satu
tema tampil identik pada gambar kecil 120 piksel maupun proyektor 4K tanpa perlu
mengoper faktor skala yang gampang salah.

## Soal perangkat lunak lain

Introit ditulis dari nol. Tidak ada kode, berkas, aset, atau kunci lisensi milik
ProPresenter, EasyWorship, MediaShout, maupun produk lain di dalam repositori ini. Yang
dipakai ulang hanya OpenLyrics — format terbuka yang memang dibuat supaya pustaka jemaat
bisa berpindah antar perangkat lunak — dan kebiasaan kerja yang sudah dikenal operator.

Teks liturgi dan himne bawaan berada dalam domain publik.

## Lisensi

MIT.
