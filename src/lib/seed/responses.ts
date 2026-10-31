import type { SeedEntry } from "./liturgy";

/**
 * The people's parts between the fixed Ordinary: the short exchanges a congregation
 * says from memory but still reads off the wall when the presider moves fast.
 *
 * Wording follows Tata Perayaan Ekaristi 2020, the same text the Ordinary above uses
 * ("Dan bersama rohmu"). Each call and its answer sit on separate slides so the
 * operator can hold the answer back until the presider has finished speaking.
 */
export const MASS_RESPONSES_SEED: SeedEntry[] = [
  {
    title: "Jawaban Sesudah Bacaan",
    collection: "Ordinarium",
    tags: ["misa", "jawaban", "bacaan"],
    body: `Demikianlah sabda Tuhan.

Syukur kepada Allah.`,
  },
  {
    title: "Bait Pengantar Injil",
    attribution: "Alleluya",
    collection: "Ordinarium",
    tags: ["misa", "jawaban", "injil", "alleluya"],
    body: `Alleluya, alleluya, alleluya.`,
  },
  {
    title: "Pewartaan Injil — Pembuka dan Penutup",
    collection: "Ordinarium",
    tags: ["misa", "jawaban", "injil"],
    body: `Tuhan bersamamu.

Dan bersama rohmu.

Inilah Injil Yesus Kristus menurut …

Dimuliakanlah Tuhan.

Demikianlah Injil Tuhan.

Terpujilah Kristus.`,
  },
  {
    title: "Doa Umat — Jawaban",
    collection: "Ordinarium",
    tags: ["misa", "jawaban", "doaumat"],
    body: `Tuhan, dengarkanlah doa kami.

Kabulkanlah doa kami, ya Tuhan.`,
  },
  {
    title: "Ajakan Berdoa atas Persembahan",
    attribution: "Orate, fratres",
    collection: "Ordinarium",
    tags: ["misa", "jawaban", "persembahan"],
    body: `Berdoalah, Saudara-saudari,
supaya persembahanku dan persembahanmu
berkenan pada Allah, Bapa yang mahakuasa.

Semoga persembahan ini diterima
demi kemuliaan Tuhan
dan keselamatan kita
serta seluruh umat Allah yang kudus.`,
  },
  {
    title: "Dialog Prefasi",
    collection: "Ordinarium",
    tags: ["misa", "jawaban", "prefasi", "ekaristi"],
    body: `Tuhan bersamamu.

Dan bersama rohmu.

Marilah mengarahkan hati kepada Tuhan.

Sudah kami arahkan.

Marilah bersyukur kepada Tuhan, Allah kita.

Sudah layak dan sepantasnya.`,
  },
  {
    title: "Aklamasi Anamnesis",
    attribution: "Misteri iman — tiga pilihan, satu per salindia",
    collection: "Ordinarium",
    tags: ["misa", "jawaban", "anamnesis", "ekaristi"],
    body: `Misteri iman.

Wafat-Mu kami kenangkan,
kebangkitan-Mu kami muliakan,
kedatangan-Mu kami rindukan.

Setiap kali kami makan roti ini
dan minum dari piala ini,
kami mewartakan wafat-Mu, ya Tuhan,
sampai Engkau datang.

Selamatkanlah kami, ya Penebus dunia,
yang telah membebaskan kami
dengan salib dan kebangkitan-Mu.`,
  },
  {
    title: "Doksologi Penutup Doa Syukur Agung",
    attribution: "Per ipsum",
    collection: "Ordinarium",
    tags: ["misa", "jawaban", "doksologi", "ekaristi"],
    body: `Dengan perantaraan Kristus,
bersama Dia, dan dalam Dia,
bagi-Mu, Allah Bapa yang mahakuasa,
dalam persekutuan dengan Roh Kudus,
segala hormat dan kemuliaan,
sepanjang segala masa.

Amin.`,
  },
  {
    title: "Salam Damai",
    collection: "Ordinarium",
    tags: ["misa", "jawaban", "damai", "komuni"],
    body: `Damai Tuhan bersamamu selalu.

Dan bersama rohmu.

Marilah kita saling memberikan salam damai.`,
  },
  {
    title: "Ajakan Komuni — Saya Tidak Pantas",
    attribution: "Ecce Agnus Dei",
    collection: "Ordinarium",
    tags: ["misa", "jawaban", "komuni"],
    body: `Inilah Anak Domba Allah,
inilah Dia yang menghapus dosa dunia.
Berbahagialah kita
yang diundang ke perjamuan Anak Domba.

Ya Tuhan, saya tidak pantas
Tuhan datang pada saya,
tetapi bersabdalah saja,
maka saya akan sembuh.`,
  },
];
