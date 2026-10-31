# Audit fitur Introit terhadap EasyWorship, ProPresenter, dan OpenLP

Disusun 1 November 2026. Ukurannya bukan "sama dengan ProPresenter", melainkan kebutuhan
satu paroki Katolik yang menayangkan misa dari peramban, tanpa internet dan tanpa server.
Fitur pesaing yang butuh perangkat keras siaran atau layanan berbayar dicatat terpisah,
supaya tidak menipu skor.

Nilai sekarang: **74/100**. Rinciannya di bagian akhir.

## Yang sudah setara

| Fitur | Di pesaing | Di Introit |
|---|---|---|
| Pustaka lagu dengan pencarian sampai baris lirik | semua | ada |
| Bagian lagu dan urutan nyanyi (arrangement) | ProPresenter *Arrangements* | ada: bait, reff, pra-reff, jembatan, urutan bebas |
| Tata ibadat dengan seret-lepas dan catatan operator | *Playlists* | ada |
| Tema yang mengubah semua salindia sekaligus, dan tema per butir | *Themes* | ada |
| Latar foto dan video | semua | ada, disimpan di IndexedDB |
| Monitor panggung: bait sekarang, bait berikutnya, jam | *Current/Next Text* | ada di `/stage` |
| Pengumuman mendadak | OpenLP *Alerts* | Teks cepat dan warta berjalan |
| Hitung mundur | *Timers and Clocks* | hanya hitung mundur pra-ibadat |
| Peralihan antar salindia | semua | ada, durasi per tema |
| Gelapkan, bersihkan, kosongkan teks | semua | `B`, `C`, `L` |
| Keluaran untuk siaran langsung | *Alpha Key*, NDI | kunci hijau/biru/magenta untuk OBS dan vMix |
| Impor dan ekspor lagu | OpenLyrics di OpenLP | OpenLyrics dan teks biasa, plus cadangan penuh |
| Bekerja tanpa internet | OpenLP (aplikasi desktop) | PWA dengan service worker |
| Teks liturgi siap pakai | tidak ada di pesaing mana pun | Ordinarium TPE 2020, jawaban umat, Rosario, Litani, Jalan Salib, himne Latin |

## Yang belum ada dan bisa dibuat

Diurutkan dari manfaat terbesar per usaha.

1. **Pesan khusus monitor panggung.** ProPresenter punya *Stage Messages*: teks yang hanya
   muncul di layar pemusik dan lektor, misalnya "ulangi reff" atau "lektor kedua bersiap".
   Usaha kecil, karena jalur ke `/stage` sudah ada.
2. **Impor PDF menjadi salindia gambar.** Pengumuman paroki sering datang sebagai PDF atau
   PowerPoint yang diekspor ke PDF. pdf.js bisa merender setiap halaman tanpa server.
   PowerPoint asli (`.pptx`) tidak masuk rencana, karena perenderannya di peramban tidak
   akan setia.
3. **Salindia gambar di tata ibadat.** Prasyarat untuk nomor 2, dan berguna sendiri untuk
   poster kegiatan.
4. **Cetak teks misa untuk lektor dan pemazmur.** Tata ibadat dicetak sebagai lembar A4,
   lengkap dengan catatan operator.
5. **Catatan pemakaian lagu.** OpenLP *SongUsage*: lagu apa ditayangkan pada tanggal berapa,
   bisa diekspor. Berguna untuk laporan dan untuk tim musik yang ingin variasi.
6. **Pengatur waktu homili dan waktu berjalan** di monitor panggung, selain hitung mundur
   pra-ibadat.
7. **Sunting cepat dari kisi salindia.** ProPresenter *Quick Edit*: perbaiki salah ketik
   di salindia yang sedang dilihat tanpa membuka penyunting penuh.
8. **Batalkan hapus.** Butir atau entri tata ibadat yang terhapus tidak bisa dikembalikan
   selain lewat cadangan.
9. **Warna masa liturgi.** Adven ungu, Natal putih, Prapaskah ungu, Paskah putih, biasa hijau:
   tema mengikuti tanggal kalau operator mengizinkan. Tidak ada pesaing yang memilikinya.

## Yang sengaja tidak dibuat

| Fitur pesaing | Alasan |
|---|---|
| Remote dari ponsel (OpenLP Web Remote, ProPresenter Remote) | Ponsel dan laptop adalah dua perangkat; menghubungkannya butuh server atau perantara jaringan. Introit berjalan tanpa server. |
| Basis data Alkitab bawaan | Terjemahan Baru milik LAI dan berhak cipta. Penyusun bacaan menerima teks yang ditempel dari sumber berlisensi milik paroki. |
| OBS *Browser Source* dan keluaran alfa sejati | Peramban OBS terpisah dari peramban operator; tanpa server keduanya tidak bisa bicara. Kunci warna menggantikannya. |
| NDI, SDI, MIDI, DMX, timecode, Stream Deck, makro | Butuh akses perangkat keras yang tidak diberikan peramban, atau alat yang jarang dimiliki paroki kecil. |
| SongSelect CCLI, MultiTracks, Planning Center | Layanan berbayar dengan akun; bertentangan dengan janji tanpa biaya dan tanpa jaringan. |
| Edge blend, beberapa proyektor sekaligus | Peramban hanya bisa membuka jendela tambahan; menyatukan beberapa proyektor menjadi satu kanvas tidak bisa dikendalikan dari sana. |

## Rincian nilai

| Bagian | Bobot | Nilai | Catatan |
|---|---|---|---|
| Menayangkan lirik dan liturgi saat misa | 30 | 28 | lengkap; kurang sunting cepat |
| Isi bawaan siap pakai | 15 | 13 | kuat untuk misa; belum ada lagu Indonesia bebas hak cipta |
| Monitor panggung dan pengumuman | 15 | 10 | belum ada pesan panggung dan pengatur waktu homili |
| Media dan siaran | 15 | 10 | belum ada salindia gambar dan impor PDF |
| Persiapan dan arsip | 15 | 8 | belum ada cetak, catatan pemakaian, batalkan hapus |
| Keandalan dan bukti | 10 | 5 | berjalan tanpa jaringan dan teruji di peramban, tetapi uji itu masih di luar repo, jadi orang lain belum bisa mengulanginya |
| **Jumlah** | **100** | **74** | |

Seratus penuh tidak jujur dijanjikan: butir di tabel "sengaja tidak dibuat" tetap kosong
selama Introit memegang prinsip tanpa server dan tanpa biaya.

## Sumber

- ProPresenter, daftar fitur resmi: https://renewedvision.com/propresenter/all-features
- OpenLP, manual resmi rilis 3.0: https://manual.openlp.org/introduction.html
- OpenLP, daftar plugin: https://manual.openlp.org/_sources/plugin_list.rst.txt
- EasyWorship, catatan rilis: https://easyworship.com/software/whatsnew
- EasyWorship, ringkasan fitur di G2: https://g2.com/products/easyworship/features
