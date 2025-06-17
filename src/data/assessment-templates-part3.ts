import { AssessmentTemplate, Question } from './assessment-templates';

// 7 Semangat Sedjati - sama untuk semua level
const semangatSedjatiQuestions: Question[] = [
  {
    id: "semangat_1",
    category: "Semangat Sedjati",
    text: "Menunjukkan Semangat Belajar dalam setiap tugas yang diberikan"
  },
  {
    id: "semangat_2", 
    category: "Semangat Sedjati",
    text: "Memiliki Semangat Membangun lingkungan kerja yang positif"
  },
  {
    id: "semangat_3",
    category: "Semangat Sedjati", 
    text: "Berinisiatif dalam Memperbaiki proses atau hasil kerja"
  },
  {
    id: "semangat_4",
    category: "Semangat Sedjati",
    text: "Aktif dalam Menguatkan Sesama rekan kerja"
  },
  {
    id: "semangat_5",
    category: "Semangat Sedjati",
    text: "Menunjukkan Bertanggung Jawab atas tugas dan amanah"
  },
  {
    id: "semangat_6",
    category: "Semangat Sedjati",
    text: "Menjadi Teladan dalam perilaku dan etika kerja"
  },
  {
    id: "semangat_7",
    category: "Semangat Sedjati",
    text: "Menjadikan Ibadah dalam Bekerja sebagai motivasi utama"
  }
];

const recommendationOptions = [
  "Dipertahankan di Level Sekarang",
  "Layak Dipromosikan", 
  "Perlu Pembinaan Lebih Lanjut",
  "Perlu Rotasi / Penyesuaian Posisi"
];

export const assessmentTemplatesPart3: AssessmentTemplate[] = [
  // Level 12: Middle Manager
  {
    id: "template_middle_manager",
    level: "Middle Manager",
    description: "Assessment template untuk Middle Manager - memimpin area kerja dengan amanah dan keterhubungan",
    section1: [
      {
        id: "mmgr_fc_1",
        category: "Functional Competency",
        text: "Menentukan arah kebijakan operasional berdasarkan data"
      },
      {
        id: "mmgr_fc_2",
        category: "Functional Competency",
        text: "Menyusun dan memantau pencapaian target jangka menengah"
      },
      {
        id: "mmgr_fc_3",
        category: "Functional Competency",
        text: "Mengembangkan sistem kerja berbasis teknologi"
      },
      {
        id: "mmgr_fc_4",
        category: "Functional Competency",
        text: "Menganalisis root cause problem yang kompleks"
      },
      {
        id: "mmgr_fc_5",
        category: "Functional Competency",
        text: "Menyusun SOP lintas departemen"
      },
      {
        id: "mmgr_lm_1",
        category: "Leadership & Managerial",
        text: "Menyusun arah pengembangan SDM jangka menengah"
      },
      {
        id: "mmgr_lm_2",
        category: "Leadership & Managerial",
        text: "Mengatur keseimbangan beban kerja tim"
      },
      {
        id: "mmgr_lm_3",
        category: "Leadership & Managerial",
        text: "Menjadi mentor bagi beberapa supervisor atau TL"
      },
      {
        id: "mmgr_lm_4",
        category: "Leadership & Managerial",
        text: "Mengelola perubahan dan transisi organisasi"
      },
      {
        id: "mmgr_lm_5",
        category: "Leadership & Managerial",
        text: "Membangun komunikasi vertikal dan horizontal yang efektif"
      },
      {
        id: "mmgr_ss_1",
        category: "Soft Skills",
        text: "Menjadi narasumber atau pembicara internal dengan kredibilitas"
      },
      {
        id: "mmgr_ss_2",
        category: "Soft Skills",
        text: "Mengelola komunikasi antar departemen dan lintas fungsi"
      },
      {
        id: "mmgr_ss_3",
        category: "Soft Skills",
        text: "Menjadi negosiator yang efektif dalam kebijakan internal"
      },
      {
        id: "mmgr_ss_4",
        category: "Soft Skills",
        text: "Menggunakan komunikasi strategis dalam perubahan organisasi"
      },
      {
        id: "mmgr_ss_5",
        category: "Soft Skills",
        text: "Mengatur flow komunikasi agar tepat sasaran"
      },
      {
        id: "mmgr_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Membuat analisis penyebab utama dari kegagalan strategis"
      },
      {
        id: "mmgr_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Menggabungkan data kuantitatif dan kualitatif untuk keputusan"
      },
      {
        id: "mmgr_ps_3",
        category: "Problem Solving & Analytical Thinking",
        text: "Menyusun kerangka kerja pemecahan masalah regional/divisi"
      },
      {
        id: "mmgr_ps_4",
        category: "Problem Solving & Analytical Thinking",
        text: "Menerapkan metode analisis (5 why's, root cause, dsb.)"
      },
      {
        id: "mmgr_ps_5",
        category: "Problem Solving & Analytical Thinking",
        text: "Menyusun proposal strategis perbaikan sistem"
      },
      {
        id: "mmgr_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Membina sinergi antar unit berdasarkan nilai budaya"
      },
      {
        id: "mmgr_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Mengelola transformasi budaya kerja di lingkup divisi"
      },
      {
        id: "mmgr_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Mengawasi pelaksanaan budaya kerja dan komitmen lintas fungsi"
      },
      {
        id: "mmgr_cf_4",
        category: "Culture Fit & Organizational Commitment",
        text: "Menyusun pelatihan budaya kerja untuk posisi TL/Spv"
      },
      {
        id: "mmgr_cf_5",
        category: "Culture Fit & Organizational Commitment",
        text: "Menerjemahkan nilai perusahaan ke dalam SOP divisi"
      },
      {
        id: "mmgr_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Membimbing TL/Spv tentang kepemimpinan yang amanah dan adil"
      },
      {
        id: "mmgr_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menerapkan etika Islam dalam manajemen SDM"
      },
      {
        id: "mmgr_ae_3",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi role model kepemimpinan etis dan santun"
      },
      {
        id: "mmgr_ae_4",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menyusun sistem kerja yang mendukung lingkungan kerja islami"
      },
      {
        id: "mmgr_ae_5",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menghindari segala bentuk kezhaliman atau manipulasi sistem"
      }
    ],
    section2: semangatSedjatiQuestions,
    section3: recommendationOptions,
    isActive: true,
    version: "2.1",
    createdAt: new Date().toISOString()
  },

  // Level 13: Senior Manager
  {
    id: "template_senior_manager",
    level: "Senior Manager",
    description: "Assessment template untuk Senior Manager - memimpin area kerja dengan amanah dan keterhubungan",
    section1: [
      {
        id: "smgr_fc_1",
        category: "Functional Competency",
        text: "Menginisiasi inovasi dalam proses kerja besar"
      },
      {
        id: "smgr_fc_2",
        category: "Functional Competency",
        text: "Bertanggung jawab atas efektivitas sistem kerja seluruh divisi"
      },
      {
        id: "smgr_fc_3",
        category: "Functional Competency",
        text: "Menyusun roadmap pengembangan operasional"
      },
      {
        id: "smgr_fc_4",
        category: "Functional Competency",
        text: "Menilai dan mengatur ulang struktur kerja bila perlu"
      },
      {
        id: "smgr_fc_5",
        category: "Functional Competency",
        text: "Menetapkan kebijakan teknis strategis perusahaan"
      },
      {
        id: "smgr_lm_1",
        category: "Leadership & Managerial",
        text: "Menyusun strategi pengembangan SDM divisi"
      },
      {
        id: "smgr_lm_2",
        category: "Leadership & Managerial",
        text: "Mengelola tim lintas fungsi dalam proyek atau unit besar"
      },
      {
        id: "smgr_lm_3",
        category: "Leadership & Managerial",
        text: "Melakukan evaluasi kepemimpinan bawahan"
      },
      {
        id: "smgr_lm_4",
        category: "Leadership & Managerial",
        text: "Memberikan coaching dan penguatan budaya kerja"
      },
      {
        id: "smgr_lm_5",
        category: "Leadership & Managerial",
        text: "Memimpin transformasi struktural organisasi di divisinya"
      },
      {
        id: "smgr_ss_1",
        category: "Soft Skills",
        text: "Menyampaikan visi dan strategi dengan bahasa inspiratif"
      },
      {
        id: "smgr_ss_2",
        category: "Soft Skills",
        text: "Menjadi spokesperson divisi secara formal dan informal"
      },
      {
        id: "smgr_ss_3",
        category: "Soft Skills",
        text: "Mendorong budaya feedback terbuka dan positif"
      },
      {
        id: "smgr_ss_4",
        category: "Soft Skills",
        text: "Membina sinergi antar departemen secara harmonis"
      },
      {
        id: "smgr_ss_5",
        category: "Soft Skills",
        text: "Menciptakan suasana kerja yang nyaman melalui komunikasi"
      },
      {
        id: "smgr_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Menganalisis masalah kompleks lintas departemen"
      },
      {
        id: "smgr_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Merancang solusi jangka panjang berbasis risiko dan dampak"
      },
      {
        id: "smgr_ps_3",
        category: "Problem Solving & Analytical Thinking",
        text: "Mengelola program besar berbasis problem mapping"
      },
      {
        id: "smgr_ps_4",
        category: "Problem Solving & Analytical Thinking",
        text: "Menyusun rekomendasi kebijakan makro perusahaan"
      },
      {
        id: "smgr_ps_5",
        category: "Problem Solving & Analytical Thinking",
        text: "Menjadi mentor dalam metode berpikir analitis"
      },
      {
        id: "smgr_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Menentukan arah strategis budaya organisasi di divisinya"
      },
      {
        id: "smgr_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Menciptakan inisiatif budaya kerja untuk skala besar"
      },
      {
        id: "smgr_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi role model budaya organisasi dan moral kerja"
      },
      {
        id: "smgr_cf_4",
        category: "Culture Fit & Organizational Commitment",
        text: "Menyusun evaluasi budaya dalam sistem penilaian kerja"
      },
      {
        id: "smgr_cf_5",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga semangat loyalitas di level menengah ke bawah"
      },
      {
        id: "smgr_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menyusun kebijakan berbasis maqashid syariah dalam dunia kerja"
      },
      {
        id: "smgr_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi pelindung nilai-nilai akhlak dalam organisasi"
      },
      {
        id: "smgr_ae_3",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menolak kebijakan atau sistem yang menyimpang dari prinsip Islam"
      },
      {
        id: "smgr_ae_4",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menginspirasi divisi untuk menjadikan kerja sebagai ibadah"
      },
      {
        id: "smgr_ae_5",
        category: "Akhlak & Etika Kerja Islami",
        text: "Membangun tim dengan semangat ukhuwah dan keadilan"
      }
    ],
    section2: semangatSedjatiQuestions,
    section3: recommendationOptions,
    isActive: true,
    version: "2.1",
    createdAt: new Date().toISOString()
  },

  // Level 14: Regional Manager
  {
    id: "template_regional_manager",
    level: "Regional Manager",
    description: "Assessment template untuk Regional Manager - memimpin wilayah dengan amanah penuh sebagai qowwam regional",
    section1: [
      {
        id: "rmgr_fc_1",
        category: "Functional Competency",
        text: "Merancang strategi regional berbasis performa outlet"
      },
      {
        id: "rmgr_fc_2",
        category: "Functional Competency",
        text: "Mengkoordinasi fungsi teknis lintas wilayah"
      },
      {
        id: "rmgr_fc_3",
        category: "Functional Competency",
        text: "Menentukan prioritas pengembangan SDM regional"
      },
      {
        id: "rmgr_fc_4",
        category: "Functional Competency",
        text: "Mengevaluasi dan merancang perubahan sistem regional"
      },
      {
        id: "rmgr_fc_5",
        category: "Functional Competency",
        text: "Menyediakan insight berbasis data untuk keputusan eksekutif"
      },
      {
        id: "rmgr_lm_1",
        category: "Leadership & Managerial",
        text: "Memimpin lintas wilayah dan unit secara makro"
      },
      {
        id: "rmgr_lm_2",
        category: "Leadership & Managerial",
        text: "Membangun jaringan komunikasi dan pengawasan regional"
      },
      {
        id: "rmgr_lm_3",
        category: "Leadership & Managerial",
        text: "Memberikan pelatihan manajerial kepada middle manager"
      },
      {
        id: "rmgr_lm_4",
        category: "Leadership & Managerial",
        text: "Menentukan arah kebijakan kepemimpinan regional"
      },
      {
        id: "rmgr_lm_5",
        category: "Leadership & Managerial",
        text: "Menjaga stabilitas dan sinergi kerja antar wilayah"
      },
      {
        id: "rmgr_ss_1",
        category: "Soft Skills",
        text: "Membangun jaringan komunikasi regional yang solid"
      },
      {
        id: "rmgr_ss_2",
        category: "Soft Skills",
        text: "Menyampaikan kebijakan dengan empati lintas wilayah"
      },
      {
        id: "rmgr_ss_3",
        category: "Soft Skills",
        text: "Menjadi fasilitator utama komunikasi antara pusat dan daerah"
      },
      {
        id: "rmgr_ss_4",
        category: "Soft Skills",
        text: "Menjaga hubungan kerja dengan pemangku kepentingan eksternal"
      },
      {
        id: "rmgr_ss_5",
        category: "Soft Skills",
        text: "Mengatasi perbedaan budaya kerja dengan diplomasi"
      },
      {
        id: "rmgr_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Membuat analisa tren performa lintas outlet/wilayah"
      },
      {
        id: "rmgr_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Menyusun strategi regional untuk perbaikan performa"
      },
      {
        id: "rmgr_ps_3",
        category: "Problem Solving & Analytical Thinking",
        text: "Menyampaikan insight ke pusat berdasarkan realitas lapangan"
      },
      {
        id: "rmgr_ps_4",
        category: "Problem Solving & Analytical Thinking",
        text: "Menganalisis potensi krisis dan mitigasi risiko"
      },
      {
        id: "rmgr_ps_5",
        category: "Problem Solving & Analytical Thinking",
        text: "Membuat sistem kerja preventif skala regional"
      },
      {
        id: "rmgr_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjamin keselarasan budaya di seluruh wilayah kerja"
      },
      {
        id: "rmgr_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Membina pimpinan cabang/unit dalam penerapan budaya"
      },
      {
        id: "rmgr_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Menyelesaikan konflik budaya antar cabang/area"
      },
      {
        id: "rmgr_cf_4",
        category: "Culture Fit & Organizational Commitment",
        text: "Menguatkan nilai-nilai organisasi melalui kegiatan regional"
      },
      {
        id: "rmgr_cf_5",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi representasi budaya perusahaan ke wilayah"
      },
      {
        id: "rmgr_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menyebarkan nilai akhlak dan kerja islami di seluruh cabang wilayah"
      },
      {
        id: "rmgr_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi contoh pemimpin adil, sabar, dan bijak"
      },
      {
        id: "rmgr_ae_3",
        category: "Akhlak & Etika Kerja Islami",
        text: "Mengelola keputusan sulit dengan pertimbangan syariah"
      },
      {
        id: "rmgr_ae_4",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menyusun pelatihan akhlak kerja untuk para supervisor dan manajer"
      },
      {
        id: "rmgr_ae_5",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menyelesaikan masalah tim dengan adab dan empati"
      }
    ],
    section2: semangatSedjatiQuestions,
    section3: recommendationOptions,
    isActive: true,
    version: "2.1",
    createdAt: new Date().toISOString()
  },

  // Level 15: Division Head
  {
    id: "template_division_head",
    level: "Division Head",
    description: "Assessment template untuk Division Head - qowwam divisi dan pemegang amanah tertinggi",
    section1: [
      {
        id: "dhead_fc_1",
        category: "Functional Competency",
        text: "Menyusun kebijakan teknis jangka panjang"
      },
      {
        id: "dhead_fc_2",
        category: "Functional Competency",
        text: "Memimpin transformasi sistem kerja skala besar"
      },
      {
        id: "dhead_fc_3",
        category: "Functional Competency",
        text: "Menciptakan inovasi fungsional yang berdampak besar"
      },
      {
        id: "dhead_fc_4",
        category: "Functional Competency",
        text: "Bertanggung jawab atas performa seluruh divisi secara nasional"
      },
      {
        id: "dhead_fc_5",
        category: "Functional Competency",
        text: "Menyelaraskan kompetensi fungsional dengan visi perusahaan"
      },
      {
        id: "dhead_lm_1",
        category: "Leadership & Managerial",
        text: "Menjadi pemimpin visioner dalam organisasi"
      },
      {
        id: "dhead_lm_2",
        category: "Leadership & Managerial",
        text: "Menentukan arah strategis kepemimpinan perusahaan"
      },
      {
        id: "dhead_lm_3",
        category: "Leadership & Managerial",
        text: "Membangun sistem pengembangan pemimpin masa depan"
      },
      {
        id: "dhead_lm_4",
        category: "Leadership & Managerial",
        text: "Menjadi role model budaya kerja organisasi"
      },
      {
        id: "dhead_lm_5",
        category: "Leadership & Managerial",
        text: "Mengelola krisis dan pengambilan keputusan strategis lintas divisi"
      },
      {
        id: "dhead_ss_1",
        category: "Soft Skills",
        text: "Menjadi pemimpin komunikasi strategis perusahaan"
      },
      {
        id: "dhead_ss_2",
        category: "Soft Skills",
        text: "Menyampaikan gagasan transformasi dengan pengaruh besar"
      },
      {
        id: "dhead_ss_3",
        category: "Soft Skills",
        text: "Menjadi role model komunikasi, empati, dan inspirasi"
      },
      {
        id: "dhead_ss_4",
        category: "Soft Skills",
        text: "Membangun diplomasi internal dan eksternal yang kuat"
      },
      {
        id: "dhead_ss_5",
        category: "Soft Skills",
        text: "Menyampaikan kebijakan besar dengan pendekatan humanis"
      },
      {
        id: "dhead_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Mengidentifikasi masalah sistemik dan menyusun kebijakan nasional"
      },
      {
        id: "dhead_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Menyusun strategi problem solving untuk transformasi besar"
      },
      {
        id: "dhead_ps_3",
        category: "Problem Solving & Analytical Thinking",
        text: "Menganalisis data strategis dan dampaknya ke seluruh organisasi"
      },
      {
        id: "dhead_ps_4",
        category: "Problem Solving & Analytical Thinking",
        text: "Membuat roadmap pemecahan masalah jangka panjang"
      },
      {
        id: "dhead_ps_5",
        category: "Problem Solving & Analytical Thinking",
        text: "Menjadi pengambil keputusan utama berbasis insight menyeluruh"
      },
      {
        id: "dhead_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi penjaga utama nilai dan budaya organisasi"
      },
      {
        id: "dhead_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Menentukan arah budaya jangka panjang perusahaan"
      },
      {
        id: "dhead_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi wajah dan simbol nilai-nilai perusahaan"
      },
      {
        id: "dhead_cf_4",
        category: "Culture Fit & Organizational Commitment",
        text: "Mendorong konsistensi budaya dari atas ke bawah"
      },
      {
        id: "dhead_cf_5",
        category: "Culture Fit & Organizational Commitment",
        text: "Mengelola perubahan budaya kerja saat ada transformasi organisasi"
      },
      {
        id: "dhead_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi panutan akhlak kerja Islami tingkat nasional"
      },
      {
        id: "dhead_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menentukan arah kebijakan kerja berbasis nilai Islam"
      },
      {
        id: "dhead_ae_3",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi pengawal utama kejujuran dan integritas organisasi"
      },
      {
        id: "dhead_ae_4",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjaga keberlangsungan budaya kerja Islami di seluruh perusahaan"
      },
      {
        id: "dhead_ae_5",
        category: "Akhlak & Etika Kerja Islami",
        text: "Mengambil keputusan strategis berdasarkan keadilan dan amanah"
      }
    ],
    section2: semangatSedjatiQuestions,
    section3: recommendationOptions,
    isActive: true,
    version: "2.1",
    createdAt: new Date().toISOString()
  }
]; 