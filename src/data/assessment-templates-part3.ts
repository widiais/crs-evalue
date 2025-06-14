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
        text: "Menguasai seluruh aspek operasional unit secara menyeluruh: SOP, SDM, peralatan, stok, laporan, layanan, dan kualitas produk"
      },
      {
        id: "mmgr_lm_1",
        category: "Leadership & Managerial",
        text: "Memimpin area kerja dengan amanah dan keterhubungan"
      },
      {
        id: "mmgr_ss_1",
        category: "Soft Skills",
        text: "Komunikatif, sistematis, dan mampu menjaga hubungan vertikal-horisontal"
      },
      {
        id: "mmgr_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Mengevaluasi pola masalah yang berdampak sistemik"
      },
      {
        id: "mmgr_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Berkomitmen terhadap budaya kerja Sedjati Grup: disiplin waktu, jujur, menjaga fasilitas kerja, dan menjaga nama baik perusahaan"
      },
      {
        id: "mmgr_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi penyejuk tim, tidak menyalahkan orang lain, membiasakan teguran dengan hikmah, dan menjaga adab Islami baik dalam tugas maupun komunikasi harian"
      }
    ],
    section2: semangatSedjatiQuestions,
    section3: recommendationOptions,
    isActive: true,
    version: "1.0",
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
        text: "Menguasai seluruh aspek operasional unit secara menyeluruh: SOP, SDM, peralatan, stok, laporan, layanan, dan kualitas produk"
      },
      {
        id: "smgr_lm_1",
        category: "Leadership & Managerial",
        text: "Memimpin area kerja dengan amanah dan keterhubungan"
      },
      {
        id: "smgr_ss_1",
        category: "Soft Skills",
        text: "Komunikatif, sistematis, dan mampu menjaga hubungan vertikal-horisontal"
      },
      {
        id: "smgr_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Mengevaluasi pola masalah yang berdampak sistemik"
      },
      {
        id: "smgr_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Berkomitmen terhadap budaya kerja Sedjati Grup: disiplin waktu, jujur, menjaga fasilitas kerja, dan menjaga nama baik perusahaan"
      },
      {
        id: "smgr_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi penyejuk tim, tidak menyalahkan orang lain, membiasakan teguran dengan hikmah, dan menjaga adab Islami baik dalam tugas maupun komunikasi harian"
      }
    ],
    section2: semangatSedjatiQuestions,
    section3: recommendationOptions,
    isActive: true,
    version: "1.0",
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
        text: "Menguasai seluruh aspek operasional unit secara menyeluruh: SOP, SDM, peralatan, stok, laporan, layanan, dan kualitas produk"
      },
      {
        id: "rmgr_lm_1",
        category: "Leadership & Managerial",
        text: "Memimpin wilayah dengan amanah penuh sebagai qowwam regional"
      },
      {
        id: "rmgr_ss_1",
        category: "Soft Skills",
        text: "Komunikatif, sistematis, dan mampu menjaga hubungan vertikal-horisontal"
      },
      {
        id: "rmgr_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Mengevaluasi pola masalah yang berdampak sistemik"
      },
      {
        id: "rmgr_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Berkomitmen terhadap budaya kerja Sedjati Grup: disiplin waktu, jujur, menjaga fasilitas kerja, dan menjaga nama baik perusahaan"
      },
      {
        id: "rmgr_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi penyejuk tim, tidak menyalahkan orang lain, membiasakan teguran dengan hikmah, dan menjaga adab Islami baik dalam tugas maupun komunikasi harian"
      }
    ],
    section2: semangatSedjatiQuestions,
    section3: recommendationOptions,
    isActive: true,
    version: "1.0",
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
        text: "Menguasai seluruh aspek operasional unit secara menyeluruh: SOP, SDM, peralatan, stok, laporan, layanan, dan kualitas produk"
      },
      {
        id: "dhead_lm_1",
        category: "Leadership & Managerial",
        text: "Menjadi qowwam divisi — pemegang amanah tertinggi dalam menggerakkan, membina, dan mengarahkan seluruh struktur organisasi di bawahnya"
      },
      {
        id: "dhead_ss_1",
        category: "Soft Skills",
        text: "Komunikatif, sistematis, dan mampu menjaga hubungan vertikal-horisontal"
      },
      {
        id: "dhead_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Mengevaluasi pola masalah yang berdampak sistemik"
      },
      {
        id: "dhead_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Berkomitmen terhadap budaya kerja Sedjati Grup: disiplin waktu, jujur, menjaga fasilitas kerja, dan menjaga nama baik perusahaan"
      },
      {
        id: "dhead_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi penyejuk tim, tidak menyalahkan orang lain, membiasakan teguran dengan hikmah, dan menjaga adab Islami baik dalam tugas maupun komunikasi harian"
      }
    ],
    section2: semangatSedjatiQuestions,
    section3: recommendationOptions,
    isActive: true,
    version: "1.0",
    createdAt: new Date().toISOString()
  }
]; 