/**
 * Devotions beyond the Ordinary of the Mass: the Rosary, the Stations, the Litany of
 * Loreto, and the Latin hymns a parish reaches for at Benediction and funerals.
 *
 * Same rule as `liturgy.ts` — fixed texts in the received wording, split on blank lines
 * where an assembly actually breathes, and editable once they are in the library.
 */

import type { SeedEntry } from "./liturgy";

export const DEVOTION_SEED: SeedEntry[] = [
  {
    title: "Rosario — Pembukaan",
    collection: "Rosario",
    tags: ["rosario", "maria", "devosi"],
    body: `Dalam nama Bapa, dan Putra,
dan Roh Kudus. Amin.

Aku percaya akan Allah,
Bapa yang mahakuasa,
pencipta langit dan bumi.

Dan akan Yesus Kristus,
Putra-Nya yang tunggal, Tuhan kita.

Yang dikandung dari Roh Kudus,
dilahirkan oleh Perawan Maria.

Yang menderita sengsara
dalam pemerintahan Pontius Pilatus,
disalibkan, wafat, dan dimakamkan.

Yang turun ke tempat penantian,
pada hari ketiga bangkit dari antara orang mati.

Yang naik ke surga,
duduk di sisi kanan Allah Bapa yang mahakuasa.

Dari situ Ia akan datang
mengadili orang hidup dan mati.

Aku percaya akan Roh Kudus,
Gereja Katolik yang kudus,
persekutuan para kudus,

pengampunan dosa,
kebangkitan badan,
kehidupan kekal. Amin.`,
  },
  {
    title: "Rosario — Peristiwa Gembira",
    attribution: "Senin dan Sabtu",
    collection: "Rosario",
    tags: ["rosario", "maria", "devosi"],
    body: `Peristiwa Gembira

Peristiwa pertama:
Maria menerima kabar gembira
dari Malaikat Gabriel.

Peristiwa kedua:
Maria mengunjungi Elisabet,
saudarinya.

Peristiwa ketiga:
Yesus dilahirkan di kandang Betlehem.

Peristiwa keempat:
Yesus dipersembahkan
dalam Bait Allah.

Peristiwa kelima:
Yesus ditemukan dalam Bait Allah.`,
  },
  {
    title: "Rosario — Peristiwa Sedih",
    attribution: "Selasa dan Jumat",
    collection: "Rosario",
    tags: ["rosario", "maria", "devosi", "prapaskah"],
    body: `Peristiwa Sedih

Peristiwa pertama:
Yesus berdoa kepada Bapa-Nya
di surga dalam sakratul maut.

Peristiwa kedua:
Yesus didera.

Peristiwa ketiga:
Yesus dimahkotai duri.

Peristiwa keempat:
Yesus memanggul salib-Nya
ke Gunung Kalvari.

Peristiwa kelima:
Yesus wafat di salib.`,
  },
  {
    title: "Rosario — Peristiwa Mulia",
    attribution: "Rabu dan Minggu",
    collection: "Rosario",
    tags: ["rosario", "maria", "devosi", "paskah"],
    body: `Peristiwa Mulia

Peristiwa pertama:
Yesus bangkit dari antara orang mati.

Peristiwa kedua:
Yesus naik ke surga.

Peristiwa ketiga:
Roh Kudus turun
atas para Rasul.

Peristiwa keempat:
Maria diangkat ke surga.

Peristiwa kelima:
Maria dimahkotai di surga.`,
  },
  {
    title: "Rosario — Peristiwa Terang",
    attribution: "Kamis",
    collection: "Rosario",
    tags: ["rosario", "maria", "devosi"],
    body: `Peristiwa Terang

Peristiwa pertama:
Yesus dibaptis di Sungai Yordan.

Peristiwa kedua:
Yesus menyatakan diri-Nya
dalam pesta perkawinan di Kana.

Peristiwa ketiga:
Yesus memberitakan Kerajaan Allah
dan menyerukan pertobatan.

Peristiwa keempat:
Yesus menampakkan kemuliaan-Nya.

Peristiwa kelima:
Yesus menetapkan Ekaristi.`,
  },
  {
    title: "Doa Fatima",
    collection: "Rosario",
    tags: ["rosario", "maria", "devosi"],
    body: `Ya Yesus yang baik,
ampunilah dosa-dosa kami.

Selamatkanlah kami dari api neraka,
dan hantarlah jiwa-jiwa ke dalam surga,

terlebih jiwa-jiwa
yang sangat membutuhkan
kerahiman-Mu. Amin.`,
  },
  {
    title: "Litani Santa Perawan Maria",
    attribution: "Litani Loreto",
    collection: "Rosario",
    tags: ["litani", "maria", "devosi"],
    body: `Tuhan, kasihanilah kami.
Kristus, kasihanilah kami.
Tuhan, kasihanilah kami.

Kristus, dengarkanlah kami.
Kristus, kabulkanlah doa kami.

Allah Bapa di surga,
kasihanilah kami.

Allah Putra, Penebus dunia,
kasihanilah kami.

Allah Roh Kudus,
kasihanilah kami.

Allah Tritunggal Kudus, Tuhan Yang Esa,
kasihanilah kami.

Santa Maria,
doakanlah kami.

Santa Bunda Allah,
doakanlah kami.

Santa Perawan termulia,
doakanlah kami.

Bunda Kristus,
doakanlah kami.

Bunda Gereja,
doakanlah kami.

Bunda rahmat ilahi,
doakanlah kami.

Bunda yang tersuci,
doakanlah kami.

Bunda yang tak bernoda,
doakanlah kami.

Bunda yang pantas dicintai,
doakanlah kami.

Bunda penasihat yang baik,
doakanlah kami.

Bunda Sang Pencipta,
doakanlah kami.

Bunda Sang Penebus,
doakanlah kami.

Perawan yang bijaksana,
doakanlah kami.

Perawan yang perlu dihormati,
doakanlah kami.

Perawan yang setia,
doakanlah kami.

Cermin kekudusan,
doakanlah kami.

Takhta kebijaksanaan,
doakanlah kami.

Sumber kegembiraan kami,
doakanlah kami.

Bejana rohani,
doakanlah kami.

Bunga mawar yang gaib,
doakanlah kami.

Benteng Daud,
doakanlah kami.

Bintang kejora,
doakanlah kami.

Penyembuh orang sakit,
doakanlah kami.

Pelindung orang berdosa,
doakanlah kami.

Penghibur orang berdukacita,
doakanlah kami.

Penolong umat Kristen,
doakanlah kami.

Ratu para malaikat,
doakanlah kami.

Ratu para rasul,
doakanlah kami.

Ratu para martir,
doakanlah kami.

Ratu para pengaku iman,
doakanlah kami.

Ratu para perawan,
doakanlah kami.

Ratu semua orang kudus,
doakanlah kami.

Ratu yang dikandung tanpa noda,
doakanlah kami.

Ratu yang diangkat ke surga,
doakanlah kami.

Ratu Rosario yang amat suci,
doakanlah kami.

Ratu keluarga,
doakanlah kami.

Ratu perdamaian,
doakanlah kami.

Anak domba Allah
yang menghapus dosa dunia,
sayangilah kami.

Anak domba Allah
yang menghapus dosa dunia,
kabulkanlah doa kami.

Anak domba Allah
yang menghapus dosa dunia,
kasihanilah kami.

Doakanlah kami, ya Santa Bunda Allah,
supaya kami dapat menikmati
janji Kristus. Amin.`,
  },
  {
    title: "Jalan Salib — Empat Belas Perhentian",
    collection: "Prapaskah",
    tags: ["jalan salib", "prapaskah", "devosi"],
    body: `Perhentian Pertama
Yesus dijatuhi hukuman mati

Perhentian Kedua
Yesus memanggul salib-Nya

Perhentian Ketiga
Yesus jatuh untuk pertama kalinya

Perhentian Keempat
Yesus berjumpa dengan ibu-Nya

Perhentian Kelima
Simon dari Kirene membantu Yesus
memanggul salib

Perhentian Keenam
Veronika mengusap wajah Yesus

Perhentian Ketujuh
Yesus jatuh untuk kedua kalinya

Perhentian Kedelapan
Yesus menghibur wanita-wanita
yang menangisi-Nya

Perhentian Kesembilan
Yesus jatuh untuk ketiga kalinya

Perhentian Kesepuluh
Pakaian Yesus ditanggalkan

Perhentian Kesebelas
Yesus dipakukan pada salib

Perhentian Kedua Belas
Yesus wafat di salib

Perhentian Ketiga Belas
Yesus diturunkan dari salib

Perhentian Keempat Belas
Yesus dimakamkan`,
  },
  {
    title: "Jalan Salib — Doa Pembuka Perhentian",
    collection: "Prapaskah",
    tags: ["jalan salib", "prapaskah", "devosi"],
    body: `Kami menyembah Dikau, ya Tuhan,
dan bersyukur kepada-Mu.

Sebab dengan salib suci-Mu
Engkau telah menebus dunia.`,
  },
  {
    title: "Ratu Surga",
    attribution: "Regina Caeli — masa Paskah",
    collection: "Doa Harian",
    tags: ["paskah", "maria", "devosi"],
    body: `Ratu surga, bersukacitalah, alleluya.

Sebab Ia yang sudi kaukandung, alleluya,

telah bangkit seperti disabdakan-Nya, alleluya.

Doakanlah kami pada Allah, alleluya.

Bersukacita dan bergembiralah, Perawan Maria, alleluya.
Sebab Tuhan sungguh telah bangkit, alleluya.`,
  },
  {
    title: "Magnificat",
    attribution: "Kidung Maria",
    collection: "Ibadat Harian",
    tags: ["kidung", "maria", "ibadat sore"],
    body: `Jiwaku memuliakan Tuhan,

dan hatiku bergembira
karena Allah, penyelamatku.

Sebab Ia memperhatikan
daku, hamba-Nya yang hina ini.

Mulai sekarang aku disebut bahagia
oleh sekalian bangsa.

Sebab perbuatan besar dikerjakan bagiku
oleh Yang Mahakuasa, kuduslah nama-Nya.

Kasih sayang-Nya turun-temurun
kepada orang yang takwa.

Perkasalah perbuatan tangan-Nya:
dicerai-beraikan-Nya orang yang angkuh hatinya.

Orang yang berkuasa diturunkan-Nya dari takhta,
yang hina-dina diangkat-Nya.

Orang lapar dikenyangkan-Nya dengan kebaikan,
orang kaya diusir-Nya pergi dengan tangan kosong.

Menurut janji-Nya kepada leluhur kita,
Allah telah menolong Israel, hamba-Nya.

Demi kasih sayang-Nya
kepada Abraham dan keturunannya
untuk selama-lamanya.`,
  },
  {
    title: "Doa Persembahan Diri",
    attribution: "Santo Ignatius Loyola",
    collection: "Doa Harian",
    tags: ["persembahan", "devosi"],
    body: `Terimalah, ya Tuhan,
seluruh kebebasanku,

ingatanku, akal budiku,
dan seluruh kehendakku.

Segala yang kumiliki
Engkaulah yang memberi;

semuanya kukembalikan kepada-Mu,
untuk Kaupergunakan
menurut kehendak-Mu.

Berilah aku cinta dan rahmat-Mu,
sebab itu sudah cukup bagiku.`,
  },
  {
    title: "Doa Mohon Terang Roh Kudus",
    collection: "Doa Harian",
    tags: ["roh kudus", "pembuka"],
    body: `Ya Roh Kudus,
terangilah budi kami

agar mengerti
apa yang Engkau kehendaki.

Kuatkanlah hati kami
agar melakukannya dengan setia.

Sebab tanpa Engkau
kami tidak sanggup berbuat apa-apa
yang berkenan kepada Allah. Amin.`,
  },
  {
    title: "Doa untuk Arwah",
    collection: "Doa Harian",
    tags: ["arwah", "requiem"],
    body: `Tuhan, berilah mereka
istirahat kekal,

dan sinarilah mereka
dengan cahaya abadi.

Semoga mereka beristirahat
dalam damai. Amin.`,
  },
  {
    title: "Doa Komuni Batin",
    collection: "Doa Harian",
    tags: ["komuni", "ekaristi"],
    body: `Yesusku, aku percaya
Engkau sungguh hadir
dalam Sakramen Mahakudus.

Aku mengasihi-Mu
melebihi segalanya,

dan aku rindu
menerima-Mu dalam jiwaku.

Karena sekarang aku tidak dapat
menyambut-Mu secara sakramental,

datanglah sekurang-kurangnya
secara rohani ke dalam hatiku.

Aku memeluk-Mu
dan mempersatukan diriku
sepenuhnya dengan-Mu.

Jangan biarkan aku
terpisah dari-Mu. Amin.`,
  },
];

/** Latin hymnody: stable public-domain texts a parish reaches for at Benediction. */
export const LATIN_HYMN_SEED: SeedEntry[] = [
  {
    title: "Veni Creator Spiritus",
    attribution: "Rabanus Maurus, abad ke-9",
    collection: "Himne Latin",
    tags: ["roh kudus", "pentakosta", "latin"],
    body: `Veni, Creator Spiritus,
mentes tuorum visita,
imple superna gratia,
quae tu creasti pectora.

Qui diceris Paraclitus,
altissimi donum Dei,
fons vivus, ignis, caritas,
et spiritalis unctio.

Tu septiformis munere,
digitus paternae dexterae,
tu rite promissum Patris,
sermone ditans guttura.

Accende lumen sensibus,
infunde amorem cordibus,
infirma nostri corporis
virtute firmans perpeti.

Hostem repellas longius
pacemque dones protinus;
ductore sic te praevio
vitemus omne noxium.

Per te sciamus da Patrem,
noscamus atque Filium,
teque utriusque Spiritum
credamus omni tempore. Amen.`,
  },
  {
    title: "O Salutaris Hostia",
    attribution: "Tomas Aquinas",
    collection: "Himne Latin",
    tags: ["ekaristi", "adorasi", "latin"],
    body: `O salutaris Hostia,
quae caeli pandis ostium,
bella premunt hostilia,
da robur, fer auxilium.

Uni trinoque Domino
sit sempiterna gloria,
qui vitam sine termino
nobis donet in patria. Amen.`,
  },
  {
    title: "Panis Angelicus",
    attribution: "Tomas Aquinas",
    collection: "Himne Latin",
    tags: ["ekaristi", "komuni", "latin"],
    body: `Panis angelicus
fit panis hominum;
dat panis caelicus
figuris terminum.

O res mirabilis:
manducat Dominum
pauper, servus et humilis.

Te trina Deitas
unaque poscimus,
sic nos tu visita
sicut te colimus.

Per tuas semitas
duc nos quo tendimus,
ad lucem quam inhabitas. Amen.`,
  },
  {
    title: "Adoro Te Devote",
    attribution: "Tomas Aquinas",
    collection: "Himne Latin",
    tags: ["ekaristi", "adorasi", "latin"],
    body: `Adoro te devote, latens Deitas,
quae sub his figuris vere latitas;
tibi se cor meum totum subicit,
quia te contemplans totum deficit.

Visus, tactus, gustus in te fallitur,
sed auditu solo tuto creditur;
credo quidquid dixit Dei Filius:
nil hoc verbo Veritatis verius.

In cruce latebat sola Deitas,
at hic latet simul et humanitas;
ambo tamen credens atque confitens,
peto quod petivit latro paenitens.

Plagas, sicut Thomas, non intueor,
Deum tamen meum te confiteor;
fac me tibi semper magis credere,
in te spem habere, te diligere.

O memoriale mortis Domini,
panis vivus vitam praestans homini,
praesta meae menti de te vivere
et te illi semper dulce sapere.

Pie pellicane, Iesu Domine,
me immundum munda tuo sanguine,
cuius una stilla salvum facere
totum mundum quit ab omni scelere.`,
  },
  {
    title: "Ave Verum Corpus",
    attribution: "Abad ke-14",
    collection: "Himne Latin",
    tags: ["ekaristi", "komuni", "latin"],
    body: `Ave verum Corpus
natum de Maria Virgine,

vere passum, immolatum
in cruce pro homine,

cuius latus perforatum
fluxit aqua et sanguine,

esto nobis praegustatum
in mortis examine.

O Iesu dulcis,
O Iesu pie,
O Iesu fili Mariae. Amen.`,
  },
  {
    title: "Ubi Caritas",
    attribution: "Antifon Kamis Putih",
    collection: "Himne Latin",
    tags: ["kamis putih", "latin", "cinta kasih"],
    body: `Ubi caritas et amor,
Deus ibi est.

Congregavit nos in unum Christi amor.
Exsultemus et in ipso iucundemur.

Timeamus et amemus Deum vivum.
Et ex corde diligamus nos sincero.

Ubi caritas et amor,
Deus ibi est.

Simul ergo cum in unum congregamur:
ne nos mente dividamur, caveamus.

Cessent iurgia maligna, cessent lites.
Et in medio nostri sit Christus Deus.

Ubi caritas et amor,
Deus ibi est.`,
  },
  {
    title: "Ave Maria",
    attribution: "Doa Salam Maria dalam bahasa Latin",
    collection: "Himne Latin",
    tags: ["maria", "latin", "rosario"],
    body: `Ave Maria, gratia plena,
Dominus tecum.

Benedicta tu in mulieribus,
et benedictus fructus ventris tui, Iesus.

Sancta Maria, Mater Dei,
ora pro nobis peccatoribus,

nunc et in hora mortis nostrae. Amen.`,
  },
  {
    title: "Stabat Mater",
    attribution: "Jacopone da Todi, abad ke-13",
    collection: "Himne Latin",
    tags: ["prapaskah", "maria", "jalan salib", "latin"],
    body: `Stabat Mater dolorosa
iuxta crucem lacrimosa,
dum pendebat Filius.

Cuius animam gementem,
contristatam et dolentem,
pertransivit gladius.

O quam tristis et afflicta
fuit illa benedicta
Mater Unigeniti.

Quae maerebat et dolebat,
pia Mater, dum videbat
Nati poenas incliti.

Quis est homo qui non fleret,
Matrem Christi si videret
in tanto supplicio?

Eia Mater, fons amoris,
me sentire vim doloris
fac, ut tecum lugeam.`,
  },
  {
    title: "Te Deum",
    attribution: "Himne syukur, abad ke-4",
    collection: "Himne Latin",
    tags: ["syukur", "latin", "ibadat"],
    body: `Te Deum laudamus:
te Dominum confitemur.

Te aeternum Patrem
omnis terra veneratur.

Tibi omnes Angeli,
tibi caeli et universae potestates:

tibi Cherubim et Seraphim
incessabili voce proclamant:

Sanctus, Sanctus, Sanctus
Dominus Deus Sabaoth.

Pleni sunt caeli et terra
maiestatis gloriae tuae.

Te gloriosus Apostolorum chorus,
te Prophetarum laudabilis numerus,
te Martyrum candidatus laudat exercitus.

Te per orbem terrarum
sancta confitetur Ecclesia.`,
  },
  {
    title: "Holy, Holy, Holy",
    attribution: "Reginald Heber, 1826",
    collection: "Himne Klasik",
    tags: ["pembuka", "tritunggal", "inggris"],
    body: `Holy, holy, holy! Lord God Almighty!
Early in the morning our song shall rise to Thee.

Holy, holy, holy! Merciful and mighty!
God in three Persons, blessed Trinity!

Holy, holy, holy! All the saints adore Thee,
casting down their golden crowns
around the glassy sea.

Cherubim and seraphim falling down before Thee,
which wert and art and evermore shalt be.

Holy, holy, holy! Lord God Almighty!
All Thy works shall praise Thy name,
in earth and sky and sea.

Holy, holy, holy! Merciful and mighty!
God in three Persons, blessed Trinity!`,
  },
];
