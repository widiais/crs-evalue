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

export const assessmentTemplatesPart2: AssessmentTemplate[] = [
  // Level 6: Team Leader 1
  {
    id: "template_team_leader_1",
    level: "Team Leader 1",
    description: "Assessment template untuk Team Leader 1 - memimpin langsung tim dalam shift",
    section1: [
      {
        id: "tl1_fc_1",
        category: "Functional Competency",
        text: "Menguasai seluruh SOP dan alur kerja operasional dalam satu shift"
      },
      {
        id: "tl1_lm_1",
        category: "Leadership & Managerial",
        text: "Memimpin langsung tim dalam shift"
      },
      {
        id: "tl1_ss_1",
        category: "Soft Skills",
        text: "Percaya diri, komunikatif, dan mampu menginspirasi rekan kerja"
      },
      {
        id: "tl1_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Menyelesaikan kendala teknis dan non-teknis di dalam shift secara cepat dan solutif"
      },
      {
        id: "tl1_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Berkomitmen terhadap budaya kerja Sedjati Grup: disiplin waktu, jujur, menjaga fasilitas kerja, dan menjaga nama baik perusahaan"
      },
      {
        id: "tl1_ae_1",
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

  // Level 7: Team Leader 2
  {
    id: "template_team_leader_2",
    level: "Team Leader 2",
    description: "Assessment template untuk Team Leader 2 - pemimpin utama di unit tanpa Supervisor",
    section1: [
      {
        id: "tl2_fc_1",
        category: "Functional Competency",
        text: "Menguasai seluruh aspek operasional unit secara menyeluruh: SOP, SDM, peralatan, stok, laporan, layanan, dan kualitas produk"
      },
      {
        id: "tl2_lm_1",
        category: "Leadership & Managerial",
        text: "Pemimpin utama di unit yang belum memiliki Supervisor"
      },
      {
        id: "tl2_ss_1",
        category: "Soft Skills",
        text: "Percaya diri, komunikatif, dan mampu menginspirasi rekan kerja"
      },
      {
        id: "tl2_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Menjadi pemecah masalah utama di unit"
      },
      {
        id: "tl2_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Berkomitmen terhadap budaya kerja Sedjati Grup: disiplin waktu, jujur, menjaga fasilitas kerja, dan menjaga nama baik perusahaan"
      },
      {
        id: "tl2_ae_1",
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

  // Level 8: Junior Supervisor
  {
    id: "template_junior_supervisor",
    level: "Junior Supervisor",
    description: "Assessment template untuk Junior Supervisor - membina langsung Team Leader",
    section1: [
      {
        id: "jsup_fc_1",
        category: "Functional Competency",
        text: "Menguasai seluruh aspek operasional unit secara menyeluruh: SOP, SDM, peralatan, stok, laporan, layanan, dan kualitas produk"
      },
      {
        id: "jsup_lm_1",
        category: "Leadership & Managerial",
        text: "Membina langsung Team Leader 2 dan Team Leader 1"
      },
      {
        id: "jsup_ss_1",
        category: "Soft Skills",
        text: "Percaya diri, komunikatif, dan mampu menginspirasi rekan kerja"
      },
      {
        id: "jsup_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Menjadi pemecah masalah utama di unit"
      },
      {
        id: "jsup_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Berkomitmen terhadap budaya kerja Sedjati Grup: disiplin waktu, jujur, menjaga fasilitas kerja, dan menjaga nama baik perusahaan"
      },
      {
        id: "jsup_ae_1",
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

  // Level 9: Middle Supervisor
  {
    id: "template_middle_supervisor",
    level: "Middle Supervisor",
    description: "Assessment template untuk Middle Supervisor - membina Junior Supervisor dan TL2",
    section1: [
      {
        id: "msup_fc_1",
        category: "Functional Competency",
        text: "Menguasai seluruh aspek operasional unit secara menyeluruh: SOP, SDM, peralatan, stok, laporan, layanan, dan kualitas produk"
      },
      {
        id: "msup_lm_1",
        category: "Leadership & Managerial",
        text: "Membina Junior Supervisor dan TL2"
      },
      {
        id: "msup_ss_1",
        category: "Soft Skills",
        text: "Percaya diri, komunikatif, dan mampu menginspirasi rekan kerja"
      },
      {
        id: "msup_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Menjadi pemecah masalah utama di unit"
      },
      {
        id: "msup_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Berkomitmen terhadap budaya kerja Sedjati Grup: disiplin waktu, jujur, menjaga fasilitas kerja, dan menjaga nama baik perusahaan"
      },
      {
        id: "msup_ae_1",
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

  // Level 10: Senior Supervisor
  {
    id: "template_senior_supervisor",
    level: "Senior Supervisor",
    description: "Assessment template untuk Senior Supervisor - pembina utama Junior dan Middle Supervisor",
    section1: [
      {
        id: "ssup_fc_1",
        category: "Functional Competency",
        text: "Menguasai seluruh aspek operasional unit secara menyeluruh: SOP, SDM, peralatan, stok, laporan, layanan, dan kualitas produk"
      },
      {
        id: "ssup_lm_1",
        category: "Leadership & Managerial",
        text: "Menjadi pembina utama Junior dan Middle Supervisor"
      },
      {
        id: "ssup_ss_1",
        category: "Soft Skills",
        text: "Percaya diri, komunikatif, dan mampu menginspirasi rekan kerja"
      },
      {
        id: "ssup_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu mengurai dan menangani permasalahan lintas store dengan pendekatan menyeluruh"
      },
      {
        id: "ssup_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Berkomitmen terhadap budaya kerja Sedjati Grup: disiplin waktu, jujur, menjaga fasilitas kerja, dan menjaga nama baik perusahaan"
      },
      {
        id: "ssup_ae_1",
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

  // Level 11: Junior Manager
  {
    id: "template_junior_manager",
    level: "Junior Manager",
    description: "Assessment template untuk Junior Manager - memimpin area kerja dengan amanah dan keterhubungan",
    section1: [
      {
        id: "jmgr_fc_1",
        category: "Functional Competency",
        text: "Menguasai seluruh aspek operasional unit secara menyeluruh: SOP, SDM, peralatan, stok, laporan, layanan, dan kualitas produk"
      },
      {
        id: "jmgr_lm_1",
        category: "Leadership & Managerial",
        text: "Memimpin area kerja dengan amanah dan keterhubungan"
      },
      {
        id: "jmgr_ss_1",
        category: "Soft Skills",
        text: "Komunikatif, sistematis, dan mampu menjaga hubungan vertikal-horisontal"
      },
      {
        id: "jmgr_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Mengatasi hambatan kerja lintas store dengan pendekatan sistemik"
      },
      {
        id: "jmgr_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Berkomitmen terhadap budaya kerja Sedjati Grup: disiplin waktu, jujur, menjaga fasilitas kerja, dan menjaga nama baik perusahaan"
      },
      {
        id: "jmgr_ae_1",
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