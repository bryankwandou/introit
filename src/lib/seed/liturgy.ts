/**
 * Ordinarium Missae and the common prayers, in the Indonesian received text.
 *
 * These are fixed liturgical texts, not authored content, so they ship with the app
 * and are editable afterwards — a parish that uses a slightly different wording just
 * edits the item, the same way it would in OpenLP.
 *
 * Each entry is broken into slides on blank lines. The breaks are deliberate: they are
 * placed where an assembly actually draws breath, not at an arbitrary line count.
 */

export interface SeedEntry {
  title: string;
  attribution?: string;
  collection: string;
  tags: string[];
  /** Blank-line separated; each block becomes one slide. */
  body: string;
}

export const LITURGY_SEED: SeedEntry[] = [
  {
    title: "Tanda Salib dan Salam",
    collection: "Ordinarium",
    tags: ["misa", "pembuka"],
    body: `Dalam nama Bapa, dan Putra,
dan Roh Kudus.

Amin.

Rahmat Tuhan kita Yesus Kristus,
cinta kasih Allah,
dan persekutuan Roh Kudus
bersamamu.

Dan bersama rohmu.`,
  },
  {
    title: "Pernyataan Tobat — Saya Mengaku",
    attribution: "Confiteor",
    collection: "Ordinarium",
    tags: ["misa", "tobat"],
    body: `Saya mengaku kepada Allah yang mahakuasa
dan kepada Saudara sekalian,
bahwa saya telah berdosa
dengan pikiran dan perkataan,
dengan perbuatan dan kelalaian.

Saya berdosa, saya berdosa,
saya sungguh berdosa.

Oleh sebab itu saya mohon
kepada Santa Perawan Maria,
kepada para malaikat dan orang kudus,
dan kepada Saudara sekalian,
supaya mendoakan saya
pada Allah, Tuhan kita.`,
  },
  {
    title: "Tuhan Kasihanilah Kami",
    attribution: "Kyrie eleison",
    collection: "Ordinarium",
    tags: ["misa", "kyrie"],
    body: `Tuhan, kasihanilah kami.

Tuhan, kasihanilah kami.

Kristus, kasihanilah kami.

Kristus, kasihanilah kami.

Tuhan, kasihanilah kami.

Tuhan, kasihanilah kami.`,
  },
  {
    title: "Kemuliaan",
    attribution: "Gloria in excelsis Deo",
    collection: "Ordinarium",
    tags: ["misa", "gloria"],
    body: `Kemuliaan kepada Allah di surga,
dan damai di bumi
kepada orang yang berkenan pada-Nya.

Kami memuji Dikau,
kami meluhurkan Dikau,
kami menyembah Dikau,
kami memuliakan Dikau.

Kami bersyukur kepada-Mu,
karena kemuliaan-Mu yang besar.

Ya Tuhan Allah, Raja surgawi,
Allah Bapa yang mahakuasa.

Ya Tuhan Yesus Kristus, Putra yang tunggal,
ya Tuhan Allah, Anak Domba Allah, Putra Bapa.

Engkau yang menghapus dosa dunia,
kasihanilah kami.

Engkau yang menghapus dosa dunia,
kabulkanlah doa kami.

Engkau yang duduk di sisi Bapa,
kasihanilah kami.

Karena hanya Engkaulah Kudus,
hanya Engkaulah Tuhan,
hanya Engkaulah Mahatinggi, ya Yesus Kristus,

bersama dengan Roh Kudus,
dalam kemuliaan Allah Bapa. Amin.`,
  },
  {
    title: "Syahadat Para Rasul",
    attribution: "Symbolum Apostolorum",
    collection: "Ordinarium",
    tags: ["misa", "syahadat", "credo"],
    body: `Aku percaya akan Allah,
Bapa yang mahakuasa,
pencipta langit dan bumi.

Dan akan Yesus Kristus,
Putra-Nya yang tunggal, Tuhan kita,

yang dikandung dari Roh Kudus,
dilahirkan oleh Perawan Maria;

yang menderita sengsara
dalam pemerintahan Pontius Pilatus,
disalibkan, wafat, dan dimakamkan;

yang turun ke tempat penantian,
pada hari ketiga bangkit
dari antara orang mati;

yang naik ke surga,
duduk di sebelah kanan Allah Bapa
yang mahakuasa;

dari situ Ia akan datang
mengadili orang yang hidup dan yang mati.

Aku percaya akan Roh Kudus,
Gereja Katolik yang kudus,
persekutuan para kudus,

pengampunan dosa,
kebangkitan badan,
kehidupan kekal. Amin.`,
  },
  {
    title: "Syahadat Nikea-Konstantinopel",
    attribution: "Symbolum Nicaenum",
    collection: "Ordinarium",
    tags: ["misa", "syahadat", "credo"],
    body: `Aku percaya akan satu Allah,
Bapa yang mahakuasa,
pencipta langit dan bumi,
dan segala sesuatu yang kelihatan
dan tak kelihatan.

Dan akan satu Tuhan Yesus Kristus,
Putra Allah yang tunggal.

Ia lahir dari Bapa sebelum segala abad,
Allah dari Allah, Terang dari Terang,
Allah benar dari Allah benar.

Ia dilahirkan, bukan dijadikan,
sehakikat dengan Bapa;
segala sesuatu dijadikan oleh-Nya.

Ia turun dari surga untuk kita manusia
dan untuk keselamatan kita.

Ia dikandung dari Roh Kudus,
dilahirkan oleh Perawan Maria,
dan menjadi manusia.

Ia pun disalibkan untuk kita,
waktu Pontius Pilatus;
Ia menderita sampai wafat
dan dimakamkan.

Pada hari ketiga Ia bangkit
menurut Kitab Suci.

Ia naik ke surga,
duduk di sisi Bapa.

Ia akan kembali dengan mulia
mengadili orang yang hidup dan yang mati;
kerajaan-Nya takkan berakhir.

Aku percaya akan Roh Kudus,
Ia Tuhan yang menghidupkan;
Ia berasal dari Bapa dan Putra.

Yang serta Bapa dan Putra,
disembah dan dimuliakan;
Ia bersabda dengan perantaraan para nabi.

Aku percaya akan Gereja
yang satu, kudus, katolik, dan apostolik.

Aku mengakui satu pembaptisan
akan penghapusan dosa.

Aku menantikan kebangkitan orang mati
dan hidup di akhirat. Amin.`,
  },
  {
    title: "Kudus",
    attribution: "Sanctus",
    collection: "Ordinarium",
    tags: ["misa", "sanctus", "ekaristi"],
    body: `Kudus, kudus, kuduslah Tuhan,
Allah segala kuasa.

Surga dan bumi penuh kemuliaan-Mu.
Terpujilah Engkau di surga.

Diberkatilah yang datang
dalam nama Tuhan.
Terpujilah Engkau di surga.`,
  },
  {
    title: "Bapa Kami",
    attribution: "Pater Noster",
    collection: "Ordinarium",
    tags: ["misa", "doa", "bapakami"],
    body: `Bapa kami yang ada di surga,
dimuliakanlah nama-Mu.

Datanglah kerajaan-Mu.
Jadilah kehendak-Mu
di atas bumi seperti di dalam surga.

Berilah kami rezeki pada hari ini,
dan ampunilah kesalahan kami,
seperti kami pun mengampuni
yang bersalah kepada kami.

Dan janganlah masukkan kami
ke dalam pencobaan,
tetapi bebaskanlah kami dari yang jahat.

Sebab Engkaulah Raja
yang mulia dan berkuasa
untuk selama-lamanya. Amin.`,
  },
  {
    title: "Anak Domba Allah",
    attribution: "Agnus Dei",
    collection: "Ordinarium",
    tags: ["misa", "agnus", "komuni"],
    body: `Anak Domba Allah,
yang menghapus dosa dunia,
kasihanilah kami.

Anak Domba Allah,
yang menghapus dosa dunia,
kasihanilah kami.

Anak Domba Allah,
yang menghapus dosa dunia,
berilah kami damai.`,
  },
  {
    title: "Berkat dan Pengutusan",
    collection: "Ordinarium",
    tags: ["misa", "penutup"],
    body: `Tuhan bersamamu.

Dan bersama rohmu.

Semoga Saudara sekalian dilindungi,
dibimbing, dan diberkati
oleh Allah yang mahakuasa:
Bapa, dan Putra, dan Roh Kudus.

Amin.

Saudara sekalian,
Perayaan Ekaristi sudah selesai.

Marilah pergi, kita diutus.

Syukur kepada Allah.`,
  },

  // ── Doa harian ─────────────────────────────────────────────────────────────
  {
    title: "Salam Maria",
    attribution: "Ave Maria",
    collection: "Doa Harian",
    tags: ["doa", "maria"],
    body: `Salam Maria, penuh rahmat,
Tuhan sertamu.

Terpujilah engkau di antara wanita,
dan terpujilah buah tubuhmu, Yesus.

Santa Maria, Bunda Allah,
doakanlah kami yang berdosa ini,
sekarang dan waktu kami mati. Amin.`,
  },
  {
    title: "Kemuliaan kepada Bapa",
    attribution: "Gloria Patri",
    collection: "Doa Harian",
    tags: ["doa", "doksologi"],
    body: `Kemuliaan kepada Bapa
dan Putra dan Roh Kudus.

Seperti pada permulaan,
sekarang, selalu,
dan sepanjang segala abad. Amin.`,
  },
  {
    title: "Doa Malaikat Tuhan",
    attribution: "Angelus",
    collection: "Doa Harian",
    tags: ["doa", "angelus", "maria"],
    body: `Maria diberi kabar oleh malaikat Tuhan,
bahwa ia mengandung dari Roh Kudus.

Salam Maria, penuh rahmat…

Aku ini hamba Tuhan,
terjadilah padaku menurut perkataanmu.

Salam Maria, penuh rahmat…

Sabda sudah menjadi daging,
dan tinggal di antara kita.

Salam Maria, penuh rahmat…

Doakanlah kami, ya Santa Bunda Allah,
supaya kami dapat menikmati janji Kristus.

Marilah berdoa.
Ya Allah, karena kabar malaikat
kami mengetahui bahwa Yesus Kristus Putra-Mu
menjadi manusia.

Curahkanlah rahmat-Mu ke dalam hati kami,
supaya karena sengsara dan salib-Nya
kami dibawa kepada kebangkitan yang mulia.
Sebab Dialah Tuhan, pengantara kami. Amin.`,
  },
  {
    title: "Doa Mohon Roh Kudus",
    attribution: "Veni Sancte Spiritus",
    collection: "Doa Harian",
    tags: ["doa", "rohkudus"],
    body: `Datanglah, ya Roh Kudus,
penuhilah hati umat-Mu,
dan nyalakanlah di dalamnya
api cinta-Mu.

Utuslah Roh-Mu,
maka semuanya akan dijadikan baru,
dan Engkau akan membaharui muka bumi.

Marilah berdoa.
Ya Allah, Engkau telah mengajar hati umat-Mu
dengan penerangan Roh Kudus.

Berilah supaya berkat Roh Kudus itu juga
kami selalu berpikir benar
serta gembira karena penghiburan-Nya.

Dengan pengantaraan Kristus, Tuhan kami. Amin.`,
  },
  {
    title: "Doa Sebelum dan Sesudah Makan",
    collection: "Doa Harian",
    tags: ["doa", "makan"],
    body: `Sebelum makan.

Ya Tuhan, berkatilah kami
dan rezeki yang kami terima
dari kemurahan-Mu.

Dengan pengantaraan Kristus, Tuhan kami. Amin.

Sesudah makan.

Kami bersyukur kepada-Mu, ya Tuhan,
atas segala kebaikan-Mu.

Engkau yang hidup dan berkuasa,
kini dan sepanjang masa. Amin.`,
  },
  {
    title: "Doa Damai Santo Fransiskus",
    attribution: "St. Fransiskus dari Assisi",
    collection: "Doa Harian",
    tags: ["doa", "damai"],
    body: `Tuhan, jadikanlah aku
pembawa damai-Mu.

Bila terjadi kebencian,
jadikanlah aku pembawa cinta kasih.

Bila terjadi penghinaan,
jadikanlah aku pembawa pengampunan.

Bila terjadi perselisihan,
jadikanlah aku pembawa kerukunan.

Bila terjadi kesesatan,
jadikanlah aku pembawa kebenaran.

Bila terjadi kebimbangan,
jadikanlah aku pembawa kepastian.

Bila terjadi keputusasaan,
jadikanlah aku pembawa harapan.

Bila terjadi kegelapan,
jadikanlah aku pembawa terang.

Bila terjadi kesedihan,
jadikanlah aku sumber kegembiraan.

Tuhan, semoga aku lebih ingin
menghibur daripada dihibur,
memahami daripada dipahami,
mencintai daripada dicintai.

Sebab dengan memberi
kita menerima,
dengan mengampuni
kita diampuni,

dan dengan mati
kita bangkit lagi
untuk hidup selama-lamanya. Amin.`,
  },
];

/**
 * Public-domain hymns only. Nothing here is under a live CCLI licence, so a parish can
 * project it without a reporting obligation. Anything newer belongs in the parish's own
 * library, imported under whatever licence it already holds.
 */
export const HYMN_SEED: SeedEntry[] = [
  {
    title: "Malam Kudus",
    attribution: "F. Gruber / J. Mohr, 1818 — domain publik",
    collection: "Natal",
    tags: ["natal", "himne"],
    body: `Malam kudus, sunyi senyap,
dunia terlelap.

Hanya dua berjaga terus,
ayah bunda mesra dan kudus.

Anak tidur tenang,
Anak tidur tenang.

Malam kudus, sunyi senyap,
kabar baik menggegap.

Bala surga menyanyikannya,
kaum gembala menyaksikannya.

Lahir Raja Syalom,
lahir Raja Syalom.

Malam kudus, sunyi senyap,
kurnia dan berkat.

Terpancar bagi kami terus,
di wajah-Mu, ya Anak kudus.

Cinta kasih kekal,
cinta kasih kekal.`,
  },
  {
    title: "Adeste Fideles",
    attribution: "J. F. Wade, ±1751 — domain publik",
    collection: "Natal",
    tags: ["natal", "latin", "himne"],
    body: `Adeste fideles,
laeti triumphantes.

Venite, venite in Bethlehem.

Natum videte
Regem angelorum.

Venite adoremus,
venite adoremus,
venite adoremus Dominum.

Cantet nunc io
chorus angelorum.

Cantet nunc aula caelestium.

Gloria, gloria
in excelsis Deo.

Venite adoremus,
venite adoremus,
venite adoremus Dominum.`,
  },
  {
    title: "Tantum Ergo",
    attribution: "St. Thomas Aquinas, ±1264 — domain publik",
    collection: "Adorasi",
    tags: ["adorasi", "latin", "sakramen"],
    body: `Tantum ergo Sacramentum
veneremur cernui,

et antiquum documentum
novo cedat ritui;

praestet fides supplementum
sensuum defectui.

Genitori, Genitoque
laus et iubilatio,

salus, honor, virtus quoque
sit et benedictio;

procedenti ab utroque
compar sit laudatio. Amen.`,
  },
  {
    title: "Salve Regina",
    attribution: "Abad ke-11 — domain publik",
    collection: "Maria",
    tags: ["maria", "latin", "antifon"],
    body: `Salve, Regina,
Mater misericordiae,

vita, dulcedo,
et spes nostra, salve.

Ad te clamamus,
exsules filii Hevae.

Ad te suspiramus,
gementes et flentes
in hac lacrimarum valle.

Eia ergo, advocata nostra,
illos tuos misericordes oculos
ad nos converte.

Et Iesum, benedictum
fructum ventris tui,
nobis post hoc exsilium ostende.

O clemens, o pia,
o dulcis Virgo Maria.`,
  },
  {
    title: "Amazing Grace",
    attribution: "John Newton, 1779 — domain publik",
    collection: "Umum",
    tags: ["himne", "english"],
    body: `Amazing grace, how sweet the sound
that saved a wretch like me.

I once was lost, but now am found,
was blind but now I see.

'Twas grace that taught my heart to fear,
and grace my fears relieved.

How precious did that grace appear
the hour I first believed.

Through many dangers, toils and snares
I have already come.

'Tis grace hath brought me safe thus far,
and grace will lead me home.

When we've been there ten thousand years,
bright shining as the sun,

we've no less days to sing God's praise
than when we'd first begun.`,
  },
];
