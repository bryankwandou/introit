import Link from "next/link";
import {
  ArrowRight,
  CloudOff,
  FileDown,
  Film,
  Keyboard,
  Layers,
  MonitorPlay,
  MonitorSpeaker,
  Palette,
  ScrollText,
  Search,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { HeroStage } from "@/components/landing/HeroStage";
import { Reveal } from "@/components/landing/Reveal";

const FEATURES = [
  {
    icon: MonitorPlay,
    title: "Dua layar, satu tekan",
    body: "Jendela keluaran dilempar ke proyektor lewat Window Management API. Kalau peramban belum mendukungnya, jendela biasa tetap terbuka dan tinggal ditekan F11.",
  },
  {
    icon: CloudOff,
    title: "Tidak bergantung sinyal",
    body: "Seluruh pustaka duduk di IndexedDB milik peramban. Uplink paroki putus di tengah misa pun, salindia berikutnya tetap muncul.",
  },
  {
    icon: ScrollText,
    title: "Ordinarium siap pakai",
    body: "Ordinarium Misa, Rosario, Jalan Salib, Litani Loreto, dan himne Latin sudah terpotong rapi per salindia. Hari pertama pakai, langsung bisa misa.",
  },
  {
    icon: Search,
    title: "Pencarian sampai ke baris",
    body: "Operator jarang ingat judul lengkap. Kotak cari menyisir judul, penulis, label, dan seluruh badan lirik sekaligus.",
  },
  {
    icon: Film,
    title: "Latar foto dan video",
    body: "Seret berkas ke panel Latar, lalu pasangkan ke tema. Video berputar sendiri di proyektor, dan peredupnya bisa dinaikkan supaya lirik tetap terbaca.",
  },
  {
    icon: MonitorSpeaker,
    title: "Monitor untuk pemusik",
    body: "Jendela terpisah menghadap koor: bait yang sedang tayang, bait berikutnya, dan jam dinding. Umat tidak melihatnya, dan tidak ada tombol yang bisa tersenggol.",
  },
  {
    icon: Timer,
    title: "Hitung mundur sebelum ibadat",
    body: "Lima sampai tiga puluh menit, tampil memakai warna tema yang sama sehingga tidak menyilaukan saat lampu gereja masih redup.",
  },
  {
    icon: Palette,
    title: "Tema yang jujur",
    body: "Ukuran huruf dihitung sebagai persen tinggi layar, jadi pratinjau kecil di meja operator sama persis dengan hasil di dinding gereja.",
  },
  {
    icon: Keyboard,
    title: "Kendali papan tik",
    body: "Spasi maju, panah mundur, B menggelapkan, C membersihkan. Tangan tidak perlu pindah ke tetikus saat umat sudah menyanyi.",
  },
  {
    icon: FileDown,
    title: "Berkas tetap milik paroki",
    body: "Impor dan ekspor OpenLyrics, format yang dibaca OpenLP. Cadangan lengkap keluar sebagai satu berkas JSON yang bisa disalin ke laptop lain.",
  },
  {
    icon: ShieldCheck,
    title: "Tanpa akun, tanpa tagihan",
    body: "Tidak ada pendaftaran, tidak ada masa coba, tidak ada tanda air di sudut layar. Buka alamatnya, langsung bekerja.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Susun tata ibadat",
    body: "Tarik lagu dan doa dari pustaka ke urutan misa. Catatan untuk operator boleh ditempel di tiap butir dan tidak akan pernah ikut tampil.",
  },
  {
    n: "02",
    title: "Lempar layar keluaran",
    body: "Satu tombol membuka jendela untuk proyektor. Jendela itu sengaja dibuat bisu: tidak ada menu, tidak ada pintasan yang bisa tersenggol.",
  },
  {
    n: "03",
    title: "Jalankan ibadat",
    body: "Salindia maju dengan spasi. Kalau imam menyimpang dari urutan, klik ganda butir mana pun di pustaka dan layar langsung menyusul.",
  },
];

const COMPARE: [string, string, string][] = [
  ["Pasang di komputer", "Wajib, per mesin", "Tidak perlu, cukup peramban"],
  ["Biaya lisensi", "Berbayar atau berbatas", "Tidak ada"],
  ["Tanda air di layar", "Ada pada versi gratis", "Tidak ada"],
  ["Bekerja tanpa internet", "Ya", "Ya"],
  ["Sistem operasi", "Terikat Windows atau macOS", "Apa pun yang punya peramban"],
  ["Memindahkan pustaka", "Ekspor khusus", "OpenLyrics dan cadangan JSON"],
  ["Latar video", "Ada", "Ada, diputar dari berkas di perangkat"],
  ["Monitor pemusik", "Umumnya fitur berbayar", "Termasuk"],
];

const FAQ = [
  {
    q: "Data disimpan di mana?",
    a: "Di peramban laptop operator, memakai IndexedDB. Tidak ada server yang menerima salinan lirik paroki. Kalau laptopnya mau diganti, simpan cadangan JSON lalu pulihkan di mesin baru.",
  },
  {
    q: "Apakah ini tiruan perangkat lunak berbayar?",
    a: "Bukan. Tidak ada kode, berkas, atau aset dari ProPresenter, EasyWorship, maupun MediaShout di dalamnya. Yang dipakai ulang hanya kebiasaan kerja yang sudah dikenal operator, dan OpenLyrics sebagai format terbuka.",
  },
  {
    q: "Bisa dipakai gereja non-Katolik?",
    a: "Bisa. Bawaannya memang Ordinarium Misa, tetapi seluruh isi pustaka boleh dihapus, disunting, atau diganti. Struktur bait dan refren mengikuti OpenLyrics, bukan satu tradisi tertentu.",
  },
  {
    q: "Bagaimana dengan proyektor kedua atau layar di balkon?",
    a: "Buka jendela keluaran sebanyak yang dibutuhkan. Semuanya mendengarkan siaran yang sama di dalam peramban, jadi tidak ada jeda antar layar.",
  },
  {
    q: "Aplikasi Android-nya kapan?",
    a: "Halaman ini sudah bisa dipasang sebagai aplikasi lewat menu peramban di Android. Paket APK tersendiri menyusul setelah bagian proyeksi dianggap matang oleh paroki yang memakainya.",
  },
];

export default function Home() {
  return (
    <div className="min-h-dvh bg-ink">
      <header className="sticky top-0 z-40 border-b border-line/60 bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-5">
          <Link href="/" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mark.svg" alt="" className="size-7" />
            <span className="font-display text-xl leading-none">Introit</span>
          </Link>
          <nav className="ml-auto hidden items-center gap-6 text-sm text-muted md:flex">
            <a href="#fitur" className="transition-colors hover:text-fg">
              Fitur
            </a>
            <a href="#cara" className="transition-colors hover:text-fg">
              Cara pakai
            </a>
            <a href="#banding" className="transition-colors hover:text-fg">
              Perbandingan
            </a>
            <a href="#tanya" className="transition-colors hover:text-fg">
              Tanya jawab
            </a>
          </nav>
          <Link
            href="/studio"
            className="ml-auto inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-gold-bright md:ml-6"
          >
            Buka meja operator
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </header>

      <main>
        {/* hero */}
        <section className="relative overflow-hidden border-b border-line">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-[420px] max-w-3xl bg-[radial-gradient(ellipse_at_center,rgba(212,162,76,0.16),transparent_65%)] blur-2xl"
          />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:py-28">
            <div className="rise">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-[10px] tracking-[0.16em] text-gold uppercase">
                <Layers className="size-3" />
                Proyeksi ibadat di dalam peramban
              </p>
              <h1 className="font-display text-5xl leading-[1.05] text-balance sm:text-6xl">
                Lirik dan doa naik ke layar tanpa menunggu siapa pun.
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
                Introit menjalankan tugas yang biasanya dikerjakan perangkat lunak
                seharga jutaan: menyusun tata ibadat, melempar salindia ke
                proyektor, dan tetap hidup ketika jaringan mati. Tidak ada
                pemasangan, tidak ada langganan, tidak ada tanda air.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/studio"
                  className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-3 font-medium text-ink transition-colors hover:bg-gold-bright"
                >
                  Mulai sekarang
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/output"
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-lg border border-line px-5 py-3 text-sm text-fg transition-colors hover:border-muted"
                >
                  Lihat layar keluaran
                </Link>
              </div>
              <p className="mt-5 font-mono text-[11px] text-muted">
                46 doa, teks liturgi, dan himne sudah terpasang · siap dipakai
                misa berikutnya
              </p>
            </div>

            <div className="rise" style={{ animationDelay: "120ms" }}>
              <HeroStage />
            </div>
          </div>
        </section>

        {/* features */}
        <section id="fitur" className="border-b border-line">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <Reveal>
              <h2 className="font-display text-4xl text-balance">
                Yang dikerjakan Introit saat misa berlangsung
              </h2>
              <p className="mt-4 max-w-2xl text-muted">
                Setiap keputusan di sini datang dari satu pertanyaan: apa yang
                paling sering membuat operator panik di menit ketujuh belas?
              </p>
            </Reveal>

            <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f, i) => (
                <Reveal key={f.title} delay={i * 0.04}>
                  <div className="group h-full bg-ink p-6 transition-colors hover:bg-panel">
                    <f.icon className="size-5 text-gold" />
                    <h3 className="mt-4 font-medium text-fg">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {f.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* steps */}
        <section id="cara" className="border-b border-line">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <Reveal>
              <h2 className="font-display text-4xl">Tiga langkah, sekali saja</h2>
            </Reveal>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <Reveal key={s.n} delay={i * 0.08}>
                  <div className="border-t border-line pt-6">
                    <span className="font-mono text-xs text-gold">{s.n}</span>
                    <h3 className="mt-3 font-display text-2xl">{s.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {s.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* comparison */}
        <section id="banding" className="border-b border-line">
          <div className="mx-auto max-w-4xl px-5 py-20">
            <Reveal>
              <h2 className="font-display text-4xl">
                Dibanding perangkat lunak yang biasa dipasang
              </h2>
              <p className="mt-4 text-muted">
                ProPresenter, EasyWorship, MediaShout, dan OpenLP semuanya karya
                yang bagus dan dikerjakan serius. Introit menempuh jalan berbeda:
                tidak masuk ke sistem operasi sama sekali.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="mt-10 overflow-x-auto rounded-xl border border-line">
                <table className="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr className="border-b border-line bg-panel text-left">
                      <th className="px-5 py-3 font-mono text-[10px] tracking-wider text-muted uppercase">
                        Perkara
                      </th>
                      <th className="px-5 py-3 font-mono text-[10px] tracking-wider text-muted uppercase">
                        Perangkat lunak desktop
                      </th>
                      <th className="px-5 py-3 font-mono text-[10px] tracking-wider text-gold uppercase">
                        Introit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARE.map(([label, them, us]) => (
                      <tr key={label} className="border-b border-line last:border-0">
                        <td className="px-5 py-3.5 text-fg/85">{label}</td>
                        <td className="px-5 py-3.5 text-muted">{them}</td>
                        <td className="px-5 py-3.5 text-fg">{us}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-6 text-xs leading-relaxed text-muted">
                Introit ditulis dari nol. Tidak ada berkas, kode, aset, maupun
                kunci lisensi milik produk lain yang ikut dipakai. Yang dipinjam
                hanya OpenLyrics, format terbuka yang memang dibuat supaya
                pustaka jemaat bisa berpindah antar perangkat lunak.
              </p>
            </Reveal>
          </div>
        </section>

        {/* faq */}
        <section id="tanya" className="border-b border-line">
          <div className="mx-auto max-w-3xl px-5 py-20">
            <Reveal>
              <h2 className="font-display text-4xl">Tanya jawab</h2>
            </Reveal>
            <div className="mt-10 divide-y divide-line border-y border-line">
              {FAQ.map((f, i) => (
                <Reveal key={f.q} delay={i * 0.05}>
                  <details className="group py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                      <span className="font-medium text-fg">{f.q}</span>
                      <span className="shrink-0 font-mono text-lg text-muted transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                      {f.a}
                    </p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* cta */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-64 max-w-2xl bg-[radial-gradient(ellipse_at_bottom,rgba(212,162,76,0.14),transparent_70%)] blur-2xl"
          />
          <div className="relative mx-auto max-w-3xl px-5 py-24 text-center">
            <Reveal>
              <h2 className="font-display text-4xl text-balance sm:text-5xl">
                Misa berikutnya sudah bisa memakainya.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-muted">
                Tidak ada yang perlu dipasang dan tidak ada yang perlu didaftarkan.
                Buka meja operator, periksa tata ibadat bawaan, lalu ganti isinya
                dengan milik paroki sendiri.
              </p>
              <Link
                href="/studio"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3.5 font-medium text-ink transition-colors hover:bg-gold-bright"
              >
                Buka meja operator
                <ArrowRight className="size-4" />
              </Link>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mark.svg" alt="" className="size-5" />
            <span className="font-display">Introit</span>
          </div>
          <p className="font-mono text-[11px] text-muted sm:ml-auto">
            Dibuat untuk ruang koor dan bilik proyektor. Sumber terbuka, lisensi MIT.
          </p>
        </div>
      </footer>
    </div>
  );
}
