/**
 * Data Kurikulum Mata Kuliah Sistem Digital (14 Minggu)
 * Berisi informasi silabus, capaian pembelajaran, dan submenu per minggu.
 */
const CURRICULUM_DATA = [
  {
    id: "week1",
    number: 1,
    title: "Sistem Bilangan & Konversi Biner Sentral",
    badge: "Aktif & Interaktif",
    status: "active",
    category: "Fondasi Digital",
    description:
      "Memahami sistem bilangan Desimal, Biner, Oktal, dan Heksadesimal dengan metode Biner Sentral sebagai jembatan konversi utama.",
    objectives: [
      "Menjelaskan pengertian dan karakteristik basis bilangan (Radix 2, 8, 10, 16).",
      "Menerapkan metode pembagian bertingkat untuk konversi Desimal ke Biner.",
      "Melakukan konversi langsung antara Biner dan Oktal melalui pengelompokan 3-bit.",
      "Melakukan konversi langsung antara Biner dan Heksadesimal melalui pengelompokan 4-bit.",
      "Menghitung konversi Biner ke Desimal menggunakan metode pembobotan posisi pangkat 2.",
    ],
    submenus: [
      {
        id: "w1-konsep",
        title: "Konsep & Teori Biner Sentral",
        icon: "book-open",
      },
      {
        id: "w1-universal",
        title: "Konversi Semua Bilangan",
        icon: "arrows-rotate",
      },
      {
        id: "w1-simulator",
        title: "Simulator Konversi Sentral",
        icon: "microchip",
      },
      {
        id: "w1-visualizer",
        title: "Visualisator Pengelompokan Bit",
        icon: "layer-group",
      },
      {
        id: "w1-switcher",
        title: "Playground Konversi Bilangan",
        icon: "sliders",
      },
      {
        id: "w1-kuis",
        title: "Latihan & Kuis Interaktif",
        icon: "check-circle",
      },
    ],
  },
  {
    id: "week2",
    number: 2,
    title: "Kode Bilangan & Representasi Data",
    badge: "Materi Minggu ke-2",
    status: "upcoming",
    category: "Fondasi Digital",
    description:
      "Studi mendalam tentang representasi data digital, binary codes, serta penanganan bilangan bertanda pada sistem komputasi.",
    objectives: [
      "Membedakan Binary Coded Decimal (BCD 8421) dengan Biner murni.",
      "Menjelaskan karakteristik kode reflektif Gray Code dan Excess-3.",
      "Menganalisis representasi bilangan negatif (Sign-Magnitude, 1's Complement, 2's Complement).",
      "Memahami standar karakter ASCII dan skema deteksi kesalahan Parity Bit.",
    ],
    submenus: [
      { id: "w2-m1", title: "BCD (8421) vs Biner Murni", icon: "file-text" },
      { id: "w2-m2", title: "Excess-3 & Gray Code", icon: "file-text" },
      {
        id: "w2-m3",
        title: "Bilangan Bertanda & 2's Complement",
        icon: "file-text",
      },
      { id: "w2-m4", title: "Kode Karakter ASCII & Parity", icon: "file-text" },
    ],
  },
  {
    id: "week3",
    number: 3,
    title: "Aljabar Boolean & Hukum Logika",
    badge: "Materi Minggu ke-3",
    status: "upcoming",
    category: "Logika Kombinasional",
    description:
      "Dasar-dasar matematis penyederhanaan fungsi biner menggunakan postulat Huntington dan teorema De Morgan.",
    objectives: [
      "Menguasai operasi dasar AND, OR, dan NOT dalam aljabar Boolean.",
      "Membuktikan teorema De Morgan dan prinsip dualitas.",
      "Mengubah representasi tabel kebenaran ke bentuk kanonik SOP (Sum of Products) dan POS (Product of Sums).",
    ],
    submenus: [
      { id: "w3-m1", title: "Postulat Aljabar Boolean", icon: "file-text" },
      {
        id: "w3-m2",
        title: "Hukum De Morgan & Teorema Logika",
        icon: "file-text",
      },
      {
        id: "w3-m3",
        title: "Bentuk Kanonik: Minterm (SOP) & Maxterm (POS)",
        icon: "file-text",
      },
    ],
  },
  {
    id: "week4",
    number: 4,
    title: "Gerbang Logika Dasar & Universal",
    badge: "Materi Minggu ke-4",
    status: "upcoming",
    category: "Logika Kombinasional",
    description:
      "Analisis perangkat keras gerbang logika standar dan implementasi gerbang universal NAND/NOR untuk membuat fungsi apapun.",
    objectives: [
      "Mengidentifikasi simbol, tabel kebenaran, dan ekspresi logika 7 gerbang standar.",
      "Membuktikan sifat universal gerbang NAND dan NOR.",
      "Menganalisis diagram waktu (timing diagram) propagasi gerbang logika.",
    ],
    submenus: [
      { id: "w4-m1", title: "Gerbang Dasar: AND, OR, NOT", icon: "file-text" },
      {
        id: "w4-m2",
        title: "Gerbang Turunan: NAND, NOR, XOR, XNOR",
        icon: "file-text",
      },
      {
        id: "w4-m3",
        title: "Implementasi Universal Gate (NAND & NOR)",
        icon: "file-text",
      },
      {
        id: "w4-m4",
        title: "Laboratorium Simulasi Gerbang Virtual",
        icon: "cpu",
      },
    ],
  },
  {
    id: "week5",
    number: 5,
    title: "Penyederhanaan Rangkaian (K-Map)",
    badge: "Materi Minggu ke-5",
    status: "upcoming",
    category: "Logika Kombinasional",
    description:
      "Teknik grafis Karnaugh Map (K-Map) untuk meminimalkan fungsi logika hingga 4 variabel dengan efisien.",
    objectives: [
      "Memahami tata letak kode Gray pada sel-sel K-Map 2, 3, dan 4 variabel.",
      "Membentuk pengelompokan pasangan (pair), kuadran (quad), dan oktet (octet).",
      "Memanfaatkan kondisi Don't Care (X) untuk mendapatkan ekspresi logika paling minimal.",
    ],
    submenus: [
      {
        id: "w5-m1",
        title: "Prinsip Dasar Gray Code pada K-Map",
        icon: "file-text",
      },
      {
        id: "w5-m2",
        title: "Penyederhanaan K-Map 2 & 3 Variabel",
        icon: "file-text",
      },
      {
        id: "w5-m3",
        title: "Penyederhanaan K-Map 4 Variabel",
        icon: "file-text",
      },
      {
        id: "w5-m4",
        title: "Penanganan Kondisi Don't Care (X)",
        icon: "file-text",
      },
    ],
  },
  {
    id: "week6",
    number: 6,
    title: "Rangkaian Aritmatika Digital",
    badge: "Materi Minggu ke-6",
    status: "upcoming",
    category: "Aritmatika Digital",
    description:
      "Perancangan rangkaian penambah dan pengurang biner sebagai pondasi Arithmetic Logic Unit (ALU).",
    objectives: [
      "Merancang Half Adder dan Full Adder menggunakan gerbang logika dasar.",
      "Membangun rangkaian Half Subtractor dan Full Subtractor.",
      "Menganalisis rangkaian Ripple Carry Adder 4-bit (IC 7483) dan operasi Adder-Subtractor terpadu.",
    ],
    submenus: [
      { id: "w6-m1", title: "Half Adder & Full Adder", icon: "file-text" },
      {
        id: "w6-m2",
        title: "Half Subtractor & Full Subtractor",
        icon: "file-text",
      },
      { id: "w6-m3", title: "Parallel Binary Adder 4-bit", icon: "file-text" },
      {
        id: "w6-m4",
        title: "Rangkaian Gabungan Adder-Subtractor 2's Complement",
        icon: "file-text",
      },
    ],
  },
  {
    id: "week7",
    number: 7,
    title: "Rangkaian MSI: Multiplexer & Demultiplexer",
    badge: "Materi Minggu ke-7",
    status: "upcoming",
    category: "Komponen MSI",
    description:
      "Pemilih data (MUX) dan penyalur data (DEMUX) skala menengah (Medium Scale Integration).",
    objectives: [
      "Menjelaskan fungsi jalur data, jalur pemilih (select lines), dan enable pada MUX.",
      "Merancang implementasi fungsi logika menggunakan Multiplexer 4:1 dan 8:1.",
      "Menganalisis prinsip kerja Demultiplexer dan dekoding jalur.",
    ],
    submenus: [
      {
        id: "w7-m1",
        title: "Arsitektur Multiplexer (2:1, 4:1, 8:1)",
        icon: "file-text",
      },
      {
        id: "w7-m2",
        title: "Implementasi Fungsi Logika dengan MUX",
        icon: "file-text",
      },
      {
        id: "w7-m3",
        title: "Demultiplexer (1:2, 1:4, 1:8)",
        icon: "file-text",
      },
      { id: "w7-m4", title: "Aplikasi Routing Bus Data", icon: "file-text" },
    ],
  },
  {
    id: "week8",
    number: 8,
    title: "Decoder, Encoder & Review UTS",
    badge: "Evaluasi Tengah Semester",
    status: "upcoming",
    category: "Komponen MSI",
    description:
      "Konversi kode perangkat keras, driver tampilan seven segment, serta pemantapan materi persiapan UTS.",
    objectives: [
      "Merancang rangkaian Decoder 3 to 8 line dan BCD to 7-Segment Display (IC 7447/7448).",
      "Memahami perbedaan Encoder standar dan Priority Encoder (IC 74148).",
      "Menyelesaikan studi kasus integrasi rangkaian kombinasional.",
    ],
    submenus: [
      {
        id: "w8-m1",
        title: "Decoder Biner & BCD to 7-Segment",
        icon: "file-text",
      },
      { id: "w8-m2", title: "Encoder & Priority Encoder", icon: "file-text" },
      {
        id: "w8-m3",
        title: "Simulasi Tampilan Digital Seven Segment",
        icon: "cpu",
      },
      {
        id: "w8-m4",
        title: "Review Komprehensif & Bank Soal UTS",
        icon: "check-circle",
      },
    ],
  },
  {
    id: "week9",
    number: 9,
    title: "Rangkaian Sekuensial: Latch & Flip-Flop",
    badge: "Materi Minggu ke-9",
    status: "upcoming",
    category: "Logika Sekuensial",
    description:
      "Elemen penyimpan memori 1-bit, transisi picuan tepi (edge-triggered), dan perbandingan jenis-jenis Flip-Flop.",
    objectives: [
      "Membedakan sifat asinkron Latch dengan sifat sinkron terpicu clock Flip-Flop.",
      "Menganalisis tabel karakteristik dan eksitasi SR, D, JK, dan T Flip-Flop.",
      "Mengatasi kondisi balapan (Race-Around Condition) dengan konfigurasi Master-Slave JK Flip-Flop.",
    ],
    submenus: [
      { id: "w9-m1", title: "SR Latch (NAND & NOR Gate)", icon: "file-text" },
      { id: "w9-m2", title: "D Flip-Flop (Data Latch)", icon: "file-text" },
      { id: "w9-m3", title: "JK Flip-Flop & Master-Slave", icon: "file-text" },
      {
        id: "w9-m4",
        title: "T Flip-Flop & Pembagi Frekuensi",
        icon: "file-text",
      },
    ],
  },
  {
    id: "week10",
    number: 10,
    title: "Pencacah Digital (Counters)",
    badge: "Materi Minggu ke-10",
    status: "upcoming",
    category: "Logika Sekuensial",
    description:
      "Perancangan pencacah naik/turun berbasis Flip-Flop baik secara asinkron (ripple) maupun sinkron.",
    objectives: [
      "Merancang Asynchronous (Ripple) Up/Down Counter.",
      "Merancang Synchronous Counter dengan urutan cacahan bebas menggunakan tabel eksitasi.",
      "Mendesain pencacah Modulo-N (Mod-10 / Decade Counter, Mod-6, Mod-12).",
    ],
    submenus: [
      { id: "w10-m1", title: "Ripple Counter Asinkron", icon: "file-text" },
      { id: "w10-m2", title: "Synchronous Up/Down Counter", icon: "file-text" },
      {
        id: "w10-m3",
        title: "Perancangan Modulo-N Counter",
        icon: "file-text",
      },
      {
        id: "w10-m4",
        title: "Studi Kasus: Desain Jam Digital BCD",
        icon: "cpu",
      },
    ],
  },
  {
    id: "week11",
    number: 11,
    title: "Register & Shift Register",
    badge: "Materi Minggu ke-11",
    status: "upcoming",
    category: "Logika Sekuensial",
    description:
      "Penyimpanan data multi-bit dan konversi transmisi data serial-paralel.",
    objectives: [
      "Mengklasifikasikan mode operasi register geser: SISO, SIPO, PISO, dan PIPO.",
      "Menganalisis prinsip kerja Universal Shift Register (IC 74194).",
      "Merancang generator pola sekuensial Ring Counter dan Johnson Counter.",
    ],
    submenus: [
      {
        id: "w11-m1",
        title: "Buffer Register & Penyimpan Data",
        icon: "file-text",
      },
      {
        id: "w11-m2",
        title: "Klasifikasi 4 Mode Shift Register",
        icon: "file-text",
      },
      {
        id: "w11-m3",
        title: "Universal Shift Register (IC 74194)",
        icon: "file-text",
      },
      {
        id: "w11-m4",
        title: "Ring Counter & Johnson Counter",
        icon: "file-text",
      },
    ],
  },
  {
    id: "week12",
    number: 12,
    title: "Finite State Machine (FSM)",
    badge: "Materi Minggu ke-12",
    status: "upcoming",
    category: "Sistem Sekuensial Lanjut",
    description:
      "Pemodelan sistem logika sekuensial terstruktur menggunakan Finite State Machine model Mealy dan Moore.",
    objectives: [
      "Menggambarkan State Diagram dan menyusun State Table serta Transition Table.",
      "Membandingkan karakteristik model Mealy (output bergantung input dan state) vs Moore (output hanya bergantung state).",
      "Melakukan reduksi state dan perancangan pengontrol urutan (Sequence Detector).",
    ],
    submenus: [
      {
        id: "w12-m1",
        title: "Konsep Dasar & Pemodelan State",
        icon: "file-text",
      },
      { id: "w12-m2", title: "Model Mealy vs Model Moore", icon: "file-text" },
      {
        id: "w12-m3",
        title: "Perancangan Pendeteksi Urutan (Sequence Detector)",
        icon: "file-text",
      },
      {
        id: "w12-m4",
        title: "Studi Kasus: Pengendali Lampu Lalu Lintas Otomatis",
        icon: "cpu",
      },
    ],
  },
  {
    id: "week13",
    number: 13,
    title: "Memori Digital & Logika Terprogram",
    badge: "Materi Minggu ke-13",
    status: "upcoming",
    category: "Arsitektur Perangkat Keras",
    description:
      "Teknologi penyimpanan data semikonduktor serta pengenalan perangkat keras yang dapat diprogram (PLD, FPGA).",
    objectives: [
      "Memahami hierarki dan arsitektur internal RAM (SRAM, DRAM) dan ROM (PROM, EPROM, Flash).",
      "Menghitung kapasitas memori dan merancang ekspansi memori (word expansion & bit expansion).",
      "Mengenal arsitektur PLD (PAL, PLA) dan dasar implementasi FPGA dengan Hardware Description Language.",
    ],
    submenus: [
      {
        id: "w13-m1",
        title: "Arsitektur RAM (SRAM vs DRAM)",
        icon: "file-text",
      },
      {
        id: "w13-m2",
        title: "Arsitektur ROM & Pemetaan Alamat (Address Decoding)",
        icon: "file-text",
      },
      {
        id: "w13-m3",
        title: "Perangkat Logika Terprogram: PLA, PAL, CPLD",
        icon: "file-text",
      },
      {
        id: "w13-m4",
        title: "Pengantar FPGA & Alur Desain HDL",
        icon: "file-text",
      },
    ],
  },
  {
    id: "week14",
    number: 14,
    title: "Aplikasi Terpadu & Review UAS",
    badge: "Evaluasi Akhir Semester",
    status: "upcoming",
    category: "Integrasi & Proyek",
    description:
      "Integrasi seluruh komponen sistem digital ke dalam arsitektur mikrokomputer sederhana dan persiapan komprehensif UAS.",
    objectives: [
      "Mengintegrasikan unit aritmatika, register, memori, dan kontroler ke dalam arsitektur Data Path sederhana.",
      "Mengevaluasi hasil perancangan simulasi rangkaian digital.",
      "Menyelesaikan bank soal komprehensif dari seluruh topik perkuliahan.",
    ],
    submenus: [
      {
        id: "w14-m1",
        title: "Arsitektur Data Path & Simple CPU Model",
        icon: "cpu",
      },
      {
        id: "w14-m2",
        title: "Showcase Proyek Praktikum Mandiri",
        icon: "file-text",
      },
      {
        id: "w14-m3",
        title: "Simulasi Uji Kompetensi Sistem Digital",
        icon: "check-circle",
      },
      {
        id: "w14-m4",
        title: "Bank Soal Latihan & Panduan UAS",
        icon: "book-open",
      },
    ],
  },
];

// Helper untuk mengambil data minggu
function getWeekData(weekId) {
  return CURRICULUM_DATA.find((w) => w.id === weekId);
}
