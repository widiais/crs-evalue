export interface Question {
  id: string;
  category: string;
  text: string;
}

export interface AssessmentTemplate {
  id: string;
  level: string;
  description: string;
  section1: Question[];
  section2: Question[];
  section3: string[];
  isActive: boolean;
  version: string;
  createdAt: string;
}

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

// Rekomendasi - sama untuk semua level
const recommendationOptions = [
  "Dipertahankan di Level Sekarang",
  "Layak Dipromosikan", 
  "Perlu Pembinaan Lebih Lanjut",
  "Perlu Rotasi / Penyesuaian Posisi"
];

export const assessmentTemplates: AssessmentTemplate[] = [
  // Level 1: Magang
  {
    id: "template_magang",
    level: "Magang",
    description: "Assessment template untuk level Magang - fokus pada observasi, adaptasi, dan pengenalan alat kerja",
    section1: [
      {
        id: "magang_fc_1",
        category: "Functional Competency",
        text: "Memahami alur kerja dan SOP dasar; fokus pada observasi, adaptasi, dan pengenalan alat kerja"
      },
      {
        id: "magang_lm_1",
        category: "Leadership & Managerial",
        text: "Menunjukkan sikap hormat terhadap struktur kerja, siap diarahkan, dan mengikuti instruksi dengan baik"
      },
      {
        id: "magang_ss_1",
        category: "Soft Skills",
        text: "Mendengarkan dengan baik, bersikap sopan, terbuka terhadap koreksi, mampu menyapa dan menjalin komunikasi dasar"
      },
      {
        id: "magang_ss_2",
        category: "Soft Skills",
        text: "Menjaga penampilan rapi dan sopan, serta menunjukkan kemauan belajar"
      },
      {
        id: "magang_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu menyampaikan masalah dasar yang dihadapi kepada atasan dengan jujur dan jelas"
      },
      {
        id: "magang_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Memahami sebab akibat sederhana"
      },
      {
        id: "magang_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Mulai mengikuti budaya kerja dan nilai perusahaan secara umum"
      },
      {
        id: "magang_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Menunjukkan semangat belajar, hadir tepat waktu, dan bersikap kooperatif terhadap rekan kerja"
      },
      {
        id: "magang_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjaga adab dasar dalam berbicara, berpakaian, dan bersikap"
      },
      {
        id: "magang_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Tepat waktu dalam shalat, tidak berkata kasar, serta menjaga kebersihan pribadi dan tempat kerja"
      }
    ],
    section2: semangatSedjatiQuestions,
    section3: recommendationOptions,
    isActive: true,
    version: "2.1",
    createdAt: new Date().toISOString()
  },

  // Level 2: Training
  {
    id: "template_training",
    level: "Training",
    description: "Assessment template untuk level Training - memahami alur kerja dan tanggung jawab pos kerja",
    section1: [
      {
        id: "training_fc_1",
        category: "Functional Competency",
        text: "Memahami alur kerja, peralatan kerja, standar kebersihan, dan tanggung jawab pos kerja yang ditugaskan"
      },
      {
        id: "training_fc_2",
        category: "Functional Competency",
        text: "Menjalankan tugas dasar sesuai SOP dengan pengawasan"
      },
      {
        id: "training_lm_1",
        category: "Leadership & Managerial",
        text: "Menunjukkan sikap hormat terhadap struktur kerja, siap diarahkan, dan mengikuti instruksi dengan baik"
      },
      {
        id: "training_lm_2",
        category: "Leadership & Managerial",
        text: "Menyusun jadwal pribadi, mengenal sistem rotasi kerja, serta disiplin dalam mengikuti arahan dan aturan"
      },
      {
        id: "training_ss_1",
        category: "Soft Skills",
        text: "Menjaga komunikasi sopan dengan semua level, serta menunjukkan penampilan yang rapi, bersih, dan sesuai syariat"
      },
      {
        id: "training_ss_2",
        category: "Soft Skills",
        text: "Menjaga penampilan rapi dan sopan, serta menunjukkan kemauan belajar"
      },
      {
        id: "training_ss_3",
        category: "Soft Skills",
        text: "Mampu bekerja sama, terbuka terhadap masukan, dan mulai menyampaikan pendapat dengan adab"
      },
      {
        id: "training_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu menyelesaikan kendala ringan dengan bantuan atasan"
      },
      {
        id: "training_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu mengenali kesalahan dasar dan menunjukkan inisiatif belajar dari kesalahan"
      },
      {
        id: "training_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Mengikuti budaya kerja dan nilai perusahaan secara umum"
      },
      {
        id: "training_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Mulai menunjukkan komitmen terhadap budaya kerja Sedjati Grup: disiplin waktu, jujur, menjaga fasilitas kerja"
      },
      {
        id: "training_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Memiliki semangat belajar, hadir tepat waktu, dan bersikap kooperatif terhadap rekan kerja"
      },
      {
        id: "training_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjaga adab dasar dalam berbicara, berpakaian, dan bersikap"
      },
      {
        id: "training_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjaga shalat tepat waktu, berinteraksi dengan adab, tidak bergunjing, dan memahami bahwa setiap tugas adalah bagian dari ibadah"
      }
    ],
    section2: semangatSedjatiQuestions,
    section3: recommendationOptions,
    isActive: true,
    version: "2.1",
    createdAt: new Date().toISOString()
  },

  // Level 3: Member
  {
    id: "template_member",
    level: "Member",
    description: "Assessment template untuk level Member - menguasai SOP secara mandiri",
    section1: [
      {
        id: "member_fc_1",
        category: "Functional Competency",
        text: "Memahami alur kerja, peralatan kerja, standar kebersihan, dan tanggung jawab pos kerja yang ditugaskan"
      },
      {
        id: "member_fc_2",
        category: "Functional Competency",
        text: "Menjalankan dan menguasai SOP di bidang kerja secara mandiri dan konsisten"
      },
      {
        id: "member_fc_3",
        category: "Functional Competency",
        text: "Mampu menyelesaikan pekerjaan sesuai target tanpa perlu pengawasan langsung"
      },
      {
        id: "member_lm_1", 
        category: "Leadership & Managerial",
        text: "Menunjukkan sikap hormat terhadap struktur kerja, siap diarahkan, dan mengikuti instruksi dengan baik"
      },
      {
        id: "member_lm_2", 
        category: "Leadership & Managerial",
        text: "Menyusun jadwal pribadi, mengenal sistem rotasi kerja, serta disiplin dalam mengikuti arahan dan aturan"
      },
      {
        id: "member_lm_3", 
        category: "Leadership & Managerial",
        text: "Mulai membantu koordinasi ringan, memberi contoh kedisiplinan, serta bersedia membantu rekan kerja"
      },
      {
        id: "member_ss_1",
        category: "Soft Skills",
        text: "Mampu menyampaikan pendapat dengan baik, menjaga komunikasi dua arah yang sopan dan efektif"
      },
      {
        id: "member_ss_2",
        category: "Soft Skills",
        text: "Penampilan selalu bersih, rapi, sesuai identitas, dan mencerminkan semangat kerja"
      },
      {
        id: "member_ss_3",
        category: "Soft Skills",
        text: "Mampu bekerja sama, terbuka terhadap masukan, dan mulai menyampaikan pendapat dengan adab"
      },
      {
        id: "member_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Dapat menyelesaikan kendala kerja harian secara mandiri"
      },
      {
        id: "member_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu mengidentifikasi penyebab sederhana dari masalah"
      },
      {
        id: "member_ps_3",
        category: "Problem Solving & Analytical Thinking",
        text: "Menyampaikan saran perbaikan dasar kepada atasan"
      },
      {
        id: "member_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Berkomitmen terhadap budaya kerja Sedjati Grup: disiplin waktu, jujur, menjaga fasilitas kerja"
      },
      {
        id: "member_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Aktif menunjukkan perilaku sesuai budaya Sedjati Grup: jujur, bersih, amanah, dan loyal"
      },
      {
        id: "member_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Memiliki semangat belajar, hadir tepat waktu, dan bersikap kooperatif terhadap rekan kerja"
      },
      {
        id: "member_cf_4",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga fasilitas kerja, semangat kebersamaan, dan menjaga reputasi tim"
      },
      {
        id: "member_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjaga adab dasar dalam berbicara, berpakaian, dan bersikap"
      },
      {
        id: "member_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Konsisten dalam menjaga shalat, adab kerja, dan interaksi"
      },
      {
        id: "member_ae_3",
        category: "Akhlak & Etika Kerja Islami",
        text: "Tidak terlibat dalam konflik atau ghibah, dan menjaga niat kerja sebagai bagian dari ibadah"
      }
    ],
    section2: semangatSedjatiQuestions,
    section3: recommendationOptions,
    isActive: true,
    version: "2.1",
    createdAt: new Date().toISOString()
  },

  // Level 4: Star
  {
    id: "template_star",
    level: "Star",
    description: "Assessment template untuk level Star - memimpin secara informal dan menjadi motivator tim",
    section1: [
      {
        id: "star_fc_1",
        category: "Functional Competency",
        text: "Memahami alur kerja, peralatan kerja, standar kebersihan, dan tanggung jawab pos kerja yang ditugaskan"
      },
      {
        id: "star_fc_2",
        category: "Functional Competency",
        text: "Menjalankan dan menguasai SOP di bidang kerja secara mandiri dan konsisten"
      },
      {
        id: "star_fc_3",
        category: "Functional Competency",
        text: "Mampu menyelesaikan pekerjaan sesuai target dengan hasil unggul, efisiensi tinggi, dan minim kesalahan"
      },
      {
        id: "star_fc_4",
        category: "Functional Competency",
        text: "Aktif memberikan masukan dalam perbaikan SOP dan cara kerja"
      },
      {
        id: "star_lm_1",
        category: "Leadership & Managerial",
        text: "Memimpin secara informal"
      },
      {
        id: "star_lm_2",
        category: "Leadership & Managerial",
        text: "Menyusun jadwal pribadi, mengenal sistem rotasi kerja, serta disiplin dalam mengikuti arahan dan aturan"
      },
      {
        id: "star_lm_3",
        category: "Leadership & Managerial",
        text: "Memberi arahan ringan, menjadi teladan kedisiplinan, menjadi tempat bertanya bagi rekan selevel"
      },
      {
        id: "star_ss_1",
        category: "Soft Skills",
        text: "Komunikatif, mampu memotivasi rekan, serta menjaga keharmonisan tim"
      },
      {
        id: "star_ss_2",
        category: "Soft Skills",
        text: "Selalu tampil dengan penampilan rapi, percaya diri, bersih, dan menjaga identitas syar'i sebagai representasi nilai perusahaan"
      },
      {
        id: "star_ss_3",
        category: "Soft Skills",
        text: "Mampu bekerja sama, terbuka terhadap masukan, dan menyampaikan pendapat dengan adab"
      },
      {
        id: "star_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Dapat menyelesaikan kendala kerja harian secara mandiri"
      },
      {
        id: "star_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu menyusun solusi praktis saat kondisi mendesak"
      },
      {
        id: "star_ps_3",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu mengidentifikasi penyebab sederhana dari masalah"
      },
      {
        id: "star_ps_4",
        category: "Problem Solving & Analytical Thinking",
        text: "Aktif menyampaikan saran yang membangun kepada atasan dan membantu menyelesaikan kendala kerja di lapangan"
      },
      {
        id: "star_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Berkomitmen terhadap budaya kerja Sedjati Grup: disiplin waktu, jujur, menjaga fasilitas kerja"
      },
      {
        id: "star_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Aktif menunjukkan perilaku sesuai budaya Sedjati Grup: jujur, bersih, amanah, dan loyal"
      },
      {
        id: "star_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga fasilitas kerja, semangat kebersamaan, dan menjaga reputasi tim"
      },
      {
        id: "star_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi penyejuk tim, tidak menyalahkan orang lain, membiasakan teguran dengan hikmah"
      },
      {
        id: "star_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Konsisten dalam menjaga shalat, adab kerja, dan interaksi"
      },
      {
        id: "star_ae_3",
        category: "Akhlak & Etika Kerja Islami",
        text: "Tidak terlibat dalam konflik atau ghibah, dan menjaga niat kerja sebagai bagian dari ibadah yang diridhai Allah"
      }
    ],
    section2: semangatSedjatiQuestions,
    section3: recommendationOptions,
    isActive: true,
    version: "2.1",
    createdAt: new Date().toISOString()
  },

  // Level 5: All Star
  {
    id: "template_all_star",
    level: "All Star",
    description: "Assessment template untuk level All Star - pemecah masalah dalam tim dan duta budaya kerja",
    section1: [
      {
        id: "allstar_fc_1",
        category: "Functional Competency",
        text: "Memahami alur kerja, peralatan kerja, standar kebersihan, dan tanggung jawab pos kerja yang ditugaskan"
      },
      {
        id: "allstar_fc_2",
        category: "Functional Competency",
        text: "Menjalankan dan menguasai SOP secara mendalam"
      },
      {
        id: "allstar_fc_3",
        category: "Functional Competency",
        text: "Mampu menyelesaikan pekerjaan sesuai target dengan hasil unggul, efisiensi tinggi, dan minim kesalahan"
      },
      {
        id: "allstar_fc_4",
        category: "Functional Competency",
        text: "Menjaga kualitas kerja secara konsisten dalam berbagai kondisi"
      },
      {
        id: "allstar_fc_5",
        category: "Functional Competency",
        text: "Menjadi referensi teknis dalam tim"
      },
      {
        id: "allstar_fc_6",
        category: "Functional Competency",
        text: "Mampu melatih anggota baru"
      },
      {
        id: "allstar_lm_1",
        category: "Leadership & Managerial",
        text: "Memimpin secara informal"
      },
      {
        id: "allstar_lm_2",
        category: "Leadership & Managerial",
        text: "Menyusun jadwal pribadi, mengenal sistem rotasi kerja, serta disiplin dalam mengikuti arahan dan aturan"
      },
      {
        id: "allstar_lm_3",
        category: "Leadership & Managerial",
        text: "Memberi arahan secara informal, menjaga moral tim, dan membina anggota baru"
      },
      {
        id: "allstar_lm_4",
        category: "Leadership & Managerial",
        text: "Siap menjadi calon Team Leader, dengan sikap tanggung jawab dan adab yang kuat"
      },
      {
        id: "allstar_ss_1",
        category: "Soft Skills",
        text: "Percaya diri, komunikatif, dan mampu menginspirasi rekan kerja"
      },
      {
        id: "allstar_ss_2",
        category: "Soft Skills",
        text: "Penampilan selalu profesional, bersih, dan syar'i, menjadi teladan dalam sikap dan presentasi diri"
      },
      {
        id: "allstar_ss_3",
        category: "Soft Skills",
        text: "Mampu bekerja sama, terbuka terhadap masukan, dan menyampaikan pendapat dengan adab"
      },
      {
        id: "allstar_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Dapat menyelesaikan kendala kerja harian secara mandiri"
      },
      {
        id: "allstar_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Menjadi pemecah masalah dalam tim"
      },
      {
        id: "allstar_ps_3",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu mengurai akar masalah, menyusun solusi, dan menyampaikannya dengan bahasa yang logis, tertata, dan mudah dipahami"
      },
      {
        id: "allstar_ps_4",
        category: "Problem Solving & Analytical Thinking",
        text: "Aktif menyampaikan saran yang membangun kepada atasan"
      },
      {
        id: "allstar_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Berkomitmen terhadap budaya kerja Sedjati Grup: disiplin waktu, jujur, menjaga fasilitas kerja"
      },
      {
        id: "allstar_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Aktif menunjukkan perilaku sesuai budaya Sedjati Grup: jujur, bersih, amanah, dan loyal"
      },
      {
        id: "allstar_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi duta budaya kerja unit"
      },
      {
        id: "allstar_cf_4",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga fasilitas kerja, semangat kebersamaan, dan menjaga reputasi tim"
      },
      {
        id: "allstar_cf_5",
        category: "Culture Fit & Organizational Commitment",
        text: "Taat terhadap kebijakan, menjaga nama baik perusahaan, dan aktif dalam kegiatan tim"
      },
      {
        id: "allstar_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi penyejuk tim, tidak menyalahkan orang lain, membiasakan teguran dengan hikmah"
      },
      {
        id: "allstar_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Konsisten dalam menjaga shalat, adab kerja, dan interaksi"
      },
      {
        id: "allstar_ae_3",
        category: "Akhlak & Etika Kerja Islami",
        text: "Tidak terlibat dalam konflik atau ghibah, dan menjaga niat kerja sebagai bagian dari ibadah yang diridhai Allah"
      },
      {
        id: "allstar_ae_4",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi contoh nyata dalam ibadah, akhlak, dan interaksi. Menyampaikan nasihat dengan kelembutan"
      }
    ],
    section2: semangatSedjatiQuestions,
    section3: recommendationOptions,
    isActive: true,
    version: "2.1",
    createdAt: new Date().toISOString()
  },

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
        id: "tl1_fc_2",
        category: "Functional Competency",
        text: "Mampu menyelesaikan pekerjaan sesuai target dengan hasil unggul, efisiensi tinggi, dan minim kesalahan"
      },
      {
        id: "tl1_fc_3",
        category: "Functional Competency",
        text: "Mampu mengatur pembagian tugas, menjaga standar kualitas, efisiensi, dan kebersihan"
      },
      {
        id: "tl1_fc_4",
        category: "Functional Competency",
        text: "Menjadi referensi teknis dalam tim"
      },
      {
        id: "tl1_fc_5",
        category: "Functional Competency",
        text: "Mampu melatih anggota baru"
      },
      {
        id: "tl1_fc_6",
        category: "Functional Competency",
        text: "Bertanggung jawab penuh atas hasil kerja shift"
      },
      {
        id: "tl1_fc_7",
        category: "Functional Competency",
        text: "Mulai berkoordinasi dengan shift lain untuk kesinambungan operasional"
      },
      {
        id: "tl1_lm_1",
        category: "Leadership & Managerial",
        text: "Memimpin langsung tim dalam shift"
      },
      {
        id: "tl1_lm_2",
        category: "Leadership & Managerial",
        text: "Menyusun dan menjalankan jadwal kerja, memberi arahan harian, mengevaluasi kinerja"
      },
      {
        id: "tl1_lm_3",
        category: "Leadership & Managerial",
        text: "Menjadi rujukan utama anggota tim selama operasional berlangsung"
      },
      {
        id: "tl1_ss_1",
        category: "Soft Skills",
        text: "Percaya diri, komunikatif, dan mampu menginspirasi rekan kerja"
      },
      {
        id: "tl1_ss_2",
        category: "Soft Skills",
        text: "Selalu tampil rapi, bersih, percaya diri, dan mencerminkan karakter pemimpin yang tangguh serta berakhlak"
      },
      {
        id: "tl1_ss_3",
        category: "Soft Skills",
        text: "Mampu menyampaikan instruksi, teguran, dan masukan secara jelas dan beradab"
      },
      {
        id: "tl1_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Menyelesaikan kendala teknis dan non-teknis di dalam shift secara cepat dan solutif"
      },
      {
        id: "tl1_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu mengidentifikasi masalah dan menyusun langkah perbaikan"
      },
      {
        id: "tl1_ps_3",
        category: "Problem Solving & Analytical Thinking",
        text: "Menyampaikan perbaikan kepada Supervisor dengan bahasa yang tertata dan sopan"
      },
      {
        id: "tl1_ps_4",
        category: "Problem Solving & Analytical Thinking",
        text: "Aktif menyampaikan saran yang membangun kepada atasan"
      },
      {
        id: "tl1_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Berkomitmen terhadap budaya kerja Sedjati Grup: disiplin waktu, jujur, menjaga fasilitas kerja"
      },
      {
        id: "tl1_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Aktif menunjukkan perilaku sesuai budaya Sedjati Grup: jujur, bersih, amanah, dan loyal"
      },
      {
        id: "tl1_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi contoh dalam menjaga waktu, kerapihan, serta etos kerja tim"
      },
      {
        id: "tl1_cf_4",
        category: "Culture Fit & Organizational Commitment",
        text: "Menegakkan budaya kerja Sedjati Grup di dalam shift: jujur, bersih, amanah, disiplin, kolaboratif, dan loyal"
      },
      {
        id: "tl1_cf_5",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga fasilitas kerja, semangat kebersamaan, dan menjaga reputasi tim"
      },
      {
        id: "tl1_cf_6",
        category: "Culture Fit & Organizational Commitment",
        text: "Taat terhadap kebijakan, menjaga nama baik perusahaan, dan aktif dalam kegiatan tim"
      },
      {
        id: "tl1_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi penyejuk tim, tidak menyalahkan orang lain, membiasakan teguran dengan hikmah"
      },
      {
        id: "tl1_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Konsisten dalam menjaga shalat, adab kerja, dan interaksi"
      },
      {
        id: "tl1_ae_3",
        category: "Akhlak & Etika Kerja Islami",
        text: "Tidak terlibat dalam konflik atau ghibah, dan menjaga niat kerja sebagai bagian dari ibadah"
      },
      {
        id: "tl1_ae_4",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi contoh nyata dalam ibadah, akhlak, dan interaksi. Menyampaikan nasihat dengan kelembutan"
      },
      {
        id: "tl1_ae_5",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi penjaga adab dalam shift"
      },
      {
        id: "tl1_ae_6",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menegur dengan lembut namun tegas, menjaga shalat berjamaah dan ibadah tim, serta memperkuat ukhuwah kerja"
      }
    ],
    section2: semangatSedjatiQuestions,
    section3: recommendationOptions,
    isActive: true,
    version: "2.1",
    createdAt: new Date().toISOString()
  },

  // Level 7: Team Leader 2
  {
    id: "template_team_leader_2",
    level: "Team Leader 2",
    description: "Assessment template untuk Team Leader 2 - pemecah masalah utama di unit",
    section1: [
      {
        id: "tl2_fc_1",
        category: "Functional Competency",
        text: "Menguasai seluruh aspek operasional unit secara menyeluruh: SOP, SDM, peralatan, stok, laporan, layanan, dan kualitas produk"
      },
      {
        id: "tl2_fc_2",
        category: "Functional Competency",
        text: "Mampu menyelesaikan pekerjaan sesuai target dengan hasil unggul, efisiensi tinggi, dan minim kesalahan"
      },
      {
        id: "tl2_fc_3",
        category: "Functional Competency",
        text: "Mampu mengatur pembagian tugas, menjaga standar kualitas, efisiensi, dan kebersihan"
      },
      {
        id: "tl2_fc_4",
        category: "Functional Competency",
        text: "Menjadi referensi teknis dalam tim"
      },
      {
        id: "tl2_fc_5",
        category: "Functional Competency",
        text: "Mampu melatih anggota baru"
      },
      {
        id: "tl2_fc_6",
        category: "Functional Competency",
        text: "Bertanggung jawab atas hasil akhir operasional seluruh shift"
      },
      {
        id: "tl2_fc_7",
        category: "Functional Competency",
        text: "Siap memimpin audit, briefing harian, dan tindak lanjut evaluasi unit"
      },
      {
        id: "tl2_lm_1",
        category: "Leadership & Managerial",
        text: "Pemimpin utama di unit yang belum memiliki Supervisor"
      },
      {
        id: "tl2_lm_2",
        category: "Leadership & Managerial",
        text: "Mengatur koordinasi lintas shift, memimpin TL1, membina kader baru"
      },
      {
        id: "tl2_lm_3",
        category: "Leadership & Managerial",
        text: "Menjadi penentu keputusan teknis dan non-teknis di lapangan"
      },
      {
        id: "tl2_lm_4",
        category: "Leadership & Managerial",
        text: "Menyusun jadwal, monitoring kinerja, dan mengawal pelaksanaan visi harian unit"
      },
      {
        id: "tl2_ss_1",
        category: "Soft Skills",
        text: "Percaya diri, komunikatif, dan mampu menginspirasi rekan kerja"
      },
      {
        id: "tl2_ss_2",
        category: "Soft Skills",
        text: "Selalu tampil profesional, bersih, rapi, dan berwibawa sesuai perannya sebagai leader tertinggi di unit"
      },
      {
        id: "tl2_ss_3",
        category: "Soft Skills",
        text: "Mampu bekerja sama, terbuka terhadap masukan, dan menyampaikan pendapat dengan adab"
      },
      {
        id: "tl2_ss_4",
        category: "Soft Skills",
        text: "Mampu menyampaikan instruksi, evaluasi, dan arahan tim secara terstruktur, sabar, dan tetap tegas"
      },
      {
        id: "tl2_ss_5",
        category: "Soft Skills",
        text: "Membangun komunikasi dua arah yang sehat dengan tim dan atasan"
      },
      {
        id: "tl2_ss_6",
        category: "Soft Skills",
        text: "Menjadi penengah bila terjadi konflik atau perbedaan pandangan antar tim"
      },
      {
        id: "tl2_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Menjadi pemecah masalah utama di unit"
      },
      {
        id: "tl2_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu menganalisis kendala lintas shift dan personel dan menyusun perbaikan teknis"
      },
      {
        id: "tl2_ps_3",
        category: "Problem Solving & Analytical Thinking",
        text: "Menyampaikan laporan evaluatif kepada Area Supervisor/Manager secara rutin dan terukur"
      },
      {
        id: "tl2_ps_4",
        category: "Problem Solving & Analytical Thinking",
        text: "Aktif menyampaikan saran yang membangun kepada atasan"
      },
      {
        id: "tl2_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Berkomitmen terhadap budaya kerja Sedjati Grup: disiplin waktu, jujur, menjaga fasilitas kerja"
      },
      {
        id: "tl2_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Aktif menunjukkan perilaku sesuai budaya Sedjati Grup: jujur, bersih, amanah, dan loyal"
      },
      {
        id: "tl2_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi penguat budaya Qurani dan integritas dalam unit"
      },
      {
        id: "tl2_cf_4",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi contoh dalam menjaga waktu, kerapihan, serta etos kerja tim"
      },
      {
        id: "tl2_cf_5",
        category: "Culture Fit & Organizational Commitment",
        text: "Menegakkan budaya kerja Sedjati Grup di dalam shift: jujur, bersih, amanah, disiplin, kolaboratif, dan loyal"
      },
      {
        id: "tl2_cf_6",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga fasilitas kerja, semangat kebersamaan, dan menjaga reputasi tim"
      },
      {
        id: "tl2_cf_7",
        category: "Culture Fit & Organizational Commitment",
        text: "Taat terhadap kebijakan, menjaga nama baik perusahaan, dan aktif dalam kegiatan tim"
      },
      {
        id: "tl2_cf_8",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga konsistensi antara nilai perusahaan dan praktik kerja lapangan, serta mendorong loyalitas tim"
      },
      {
        id: "tl2_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi penyejuk tim, tidak menyalahkan orang lain, membiasakan teguran dengan hikmah"
      },
      {
        id: "tl2_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Konsisten dalam menjaga shalat, adab kerja, dan interaksi"
      },
      {
        id: "tl2_ae_3",
        category: "Akhlak & Etika Kerja Islami",
        text: "Tidak terlibat dalam konflik atau ghibah, dan menjaga niat kerja sebagai bagian dari ibadah"
      },
      {
        id: "tl2_ae_4",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi contoh nyata dalam ibadah, akhlak, dan interaksi. Menyampaikan nasihat dengan kelembutan"
      },
      {
        id: "tl2_ae_5",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi penjaga adab dalam shift"
      },
      {
        id: "tl2_ae_6",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menegur dengan hikmah, membimbing dengan kelembutan, dan memberi teladan dalam ibadah"
      }
    ],
    section2: semangatSedjatiQuestions,
    section3: recommendationOptions,
    isActive: true,
    version: "2.1",
    createdAt: new Date().toISOString()
  },

  // Level 8: Junior Supervisor
  {
    id: "template_junior_supervisor",
    level: "Junior Supervisor",
    description: "Assessment template untuk Junior Supervisor - pembina langsung Team Leader",
    section1: [
      {
        id: "js_fc_1",
        category: "Functional Competency",
        text: "Menguasai seluruh aspek operasional unit secara menyeluruh: SOP, SDM, peralatan, stok, laporan, layanan, dan kualitas produk"
      },
      {
        id: "js_fc_2",
        category: "Functional Competency",
        text: "Mampu menyelesaikan pekerjaan sesuai target dengan hasil unggul, efisiensi tinggi, dan minim kesalahan"
      },
      {
        id: "js_fc_3",
        category: "Functional Competency",
        text: "Mengawasi pelaksanaan SOP secara lintas shift dan memastikan standar kerja tercapai"
      },
      {
        id: "js_fc_4",
        category: "Functional Competency",
        text: "Menyusun rencana kerja dasar, mengawal realisasi target harian"
      },
      {
        id: "js_fc_5",
        category: "Functional Competency",
        text: "Mampu melatih anggota baru"
      },
      {
        id: "js_fc_6",
        category: "Functional Competency",
        text: "Bertanggung jawab atas hasil akhir operasional seluruh shift"
      },
      {
        id: "js_fc_7",
        category: "Functional Competency",
        text: "Siap memimpin audit, briefing harian, dan tindak lanjut evaluasi unit"
      },
      {
        id: "js_fc_8",
        category: "Functional Competency",
        text: "Membuat laporan evaluatif kepada Manager atau Area Supervisor"
      },
      {
        id: "js_lm_1",
        category: "Leadership & Managerial",
        text: "Membina langsung Team Leader 2 dan Team Leader 1"
      },
      {
        id: "js_lm_2",
        category: "Leadership & Managerial",
        text: "Memberi coaching ringan dan monitoring kinerja"
      },
      {
        id: "js_lm_3",
        category: "Leadership & Managerial",
        text: "Memastikan rotasi, kedisiplinan, dan alur kerja berjalan sesuai arah organisasi"
      },
      {
        id: "js_lm_4",
        category: "Leadership & Managerial",
        text: "Menjadi pemimpin pertama yang membentuk kaderisasi kepemimpinan internal"
      },
      {
        id: "js_ss_1",
        category: "Soft Skills",
        text: "Percaya diri, komunikatif, dan mampu menginspirasi rekan kerja"
      },
      {
        id: "js_ss_2",
        category: "Soft Skills",
        text: "Selalu tampil profesional, bersih, rapi, dan berwibawa sesuai perannya sebagai leader tertinggi di unit"
      },
      {
        id: "js_ss_3",
        category: "Soft Skills",
        text: "Mampu bekerja sama, terbuka terhadap masukan, dan menyampaikan pendapat dengan adab"
      },
      {
        id: "js_ss_4",
        category: "Soft Skills",
        text: "Mampu menyampaikan instruksi, evaluasi, dan arahan tim secara terstruktur, sabar, dan tetap tegas"
      },
      {
        id: "js_ss_5",
        category: "Soft Skills",
        text: "Membangun komunikasi efektif dengan tim dan atasan"
      },
      {
        id: "js_ss_6",
        category: "Soft Skills",
        text: "Menjadi penengah bila terjadi konflik atau perbedaan pandangan antar tim"
      },
      {
        id: "js_ss_7",
        category: "Soft Skills",
        text: "Mampu menyampaikan umpan balik yang membina, menyatukan perbedaan pandangan dalam tim"
      },
      {
        id: "js_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Menjadi pemecah masalah utama di unit"
      },
      {
        id: "js_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu mengidentifikasi pola masalah berulang"
      },
      {
        id: "js_ps_3",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu membaca tren permasalahan operasional dan SDM secara sistemik"
      },
      {
        id: "js_ps_4",
        category: "Problem Solving & Analytical Thinking",
        text: "Menyampaikan solusi yang aplikatif dan realistis, baik secara lisan maupun dalam bentuk laporan harian kepada Area Manager"
      },
      {
        id: "js_ps_5",
        category: "Problem Solving & Analytical Thinking",
        text: "Menganalisis akar penyebab, serta menyusun rekomendasi kebijakan teknis maupun prosedural dengan mempertimbangkan dampak jangka panjang"
      },
      {
        id: "js_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Berkomitmen terhadap budaya kerja Sedjati Grup: disiplin waktu, jujur, menjaga fasilitas kerja"
      },
      {
        id: "js_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Aktif menunjukkan perilaku sesuai budaya Sedjati Grup: jujur, bersih, amanah, dan loyal"
      },
      {
        id: "js_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi penjaga arah budaya Qurani di operasional"
      },
      {
        id: "js_cf_4",
        category: "Culture Fit & Organizational Commitment",
        text: "Menumbuhkan semangat budaya kerja Qurani, disiplin, bersih, dan saling menguatkan"
      },
      {
        id: "js_cf_5",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi contoh dalam menjaga waktu, kerapihan, serta etos kerja tim"
      },
      {
        id: "js_cf_6",
        category: "Culture Fit & Organizational Commitment",
        text: "Menegakkan budaya kerja Sedjati Grup di dalam shift: jujur, bersih, amanah, disiplin, kolaboratif, dan loyal"
      },
      {
        id: "js_cf_7",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga fasilitas kerja, semangat kebersamaan, dan menjaga reputasi tim"
      },
      {
        id: "js_cf_8",
        category: "Culture Fit & Organizational Commitment",
        text: "Taat terhadap kebijakan, menjaga nama baik perusahaan, dan aktif dalam kegiatan tim"
      },
      {
        id: "js_cf_9",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga konsistensi antara nilai perusahaan dan praktik kerja lapangan, serta mendorong loyalitas tim"
      },
      {
        id: "js_cf_10",
        category: "Culture Fit & Organizational Commitment",
        text: "Menyatukan tim lintas shift dan store dalam satu semangat nilai: jujur, amanah, disiplin, bersih, kolaboratif, dan loyal"
      },
      {
        id: "js_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi penyejuk tim, tidak menyalahkan orang lain, membiasakan teguran dengan hikmah"
      },
      {
        id: "js_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Konsisten dalam menjaga shalat, adab kerja, dan interaksi"
      },
      {
        id: "js_ae_3",
        category: "Akhlak & Etika Kerja Islami",
        text: "Tidak terlibat dalam konflik atau ghibah, dan menjaga niat kerja sebagai bagian dari ibadah"
      },
      {
        id: "js_ae_4",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi figur panutan dalam adab interaksi vertikal maupun horizontal"
      },
      {
        id: "js_ae_5",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi pembina adab kerja di berbagai lapisan"
      },
      {
        id: "js_ae_6",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menyampaikan arahan dengan ketegasan yang lembut, menghindari konflik terbuka, dan menjaga ibadah serta ukhuwah"
      }
    ],
    section2: semangatSedjatiQuestions,
    section3: recommendationOptions,
    isActive: true,
    version: "2.1",
    createdAt: new Date().toISOString()
  },

  // Level 9: Middle Supervisor
  {
    id: "template_middle_supervisor",
    level: "Middle Supervisor",
    description: "Assessment template untuk Middle Supervisor - penjaga arah budaya Qurani di operasional",
    section1: [
      {
        id: "ms_fc_1",
        category: "Functional Competency",
        text: "Menguasai seluruh aspek operasional unit secara menyeluruh: SOP, SDM, peralatan, stok, laporan, layanan, dan kualitas produk"
      },
      {
        id: "ms_fc_2",
        category: "Functional Competency",
        text: "Mampu menyelesaikan pekerjaan sesuai target dengan hasil unggul, efisiensi tinggi, dan minim kesalahan"
      },
      {
        id: "ms_fc_3",
        category: "Functional Competency",
        text: "Memastikan efektivitas pelaksanaan SOP lintas unit atau store"
      },
      {
        id: "ms_fc_4",
        category: "Functional Competency",
        text: "Mengelola target harian dan mingguan"
      },
      {
        id: "ms_fc_5",
        category: "Functional Competency",
        text: "Mampu melatih anggota baru"
      },
      {
        id: "ms_fc_6",
        category: "Functional Competency",
        text: "Bertanggung jawab atas hasil akhir operasional seluruh shift"
      },
      {
        id: "ms_fc_7",
        category: "Functional Competency",
        text: "Melakukan analisis performa, validasi laporan harian dari TL dan Junior Supervisor"
      },
      {
        id: "ms_fc_8",
        category: "Functional Competency",
        text: "Membuat laporan evaluatif kepada Manager atau Area Supervisor"
      },
      {
        id: "ms_fc_9",
        category: "Functional Competency",
        text: "Merancang rencana perbaikan yang terstruktur"
      },
      {
        id: "ms_lm_1",
        category: "Leadership & Managerial",
        text: "Membina Junior Supervisor dan TL2"
      },
      {
        id: "ms_lm_2",
        category: "Leadership & Managerial",
        text: "Memberi coaching berkala"
      },
      {
        id: "ms_lm_3",
        category: "Leadership & Managerial",
        text: "Menyusun pola rotasi tim"
      },
      {
        id: "ms_lm_4",
        category: "Leadership & Managerial",
        text: "Mempersiapkan kader untuk naik level"
      },
      {
        id: "ms_lm_5",
        category: "Leadership & Managerial",
        text: "Mengelola tim lintas store"
      },
      {
        id: "ms_lm_6",
        category: "Leadership & Managerial",
        text: "Menjadi koordinator utama dalam implementasi kebijakan area"
      },
      {
        id: "ms_ss_1",
        category: "Soft Skills",
        text: "Percaya diri, komunikatif, dan mampu menginspirasi rekan kerja"
      },
      {
        id: "ms_ss_2",
        category: "Soft Skills",
        text: "Selalu tampil profesional, bersih, rapi, dan berwibawa sesuai perannya sebagai leader tertinggi di unit"
      },
      {
        id: "ms_ss_3",
        category: "Soft Skills",
        text: "Mampu bekerja sama, terbuka terhadap masukan, dan menyampaikan pendapat dengan adab"
      },
      {
        id: "ms_ss_4",
        category: "Soft Skills",
        text: "Mampu menyampaikan instruksi, evaluasi, dan arahan tim secara terstruktur, sabar, dan tetap tegas"
      },
      {
        id: "ms_ss_5",
        category: "Soft Skills",
        text: "Membangun komunikasi efektif dengan tim dan atasan"
      },
      {
        id: "ms_ss_6",
        category: "Soft Skills",
        text: "Menjadi penengah bila terjadi konflik atau perbedaan pandangan antar tim"
      },
      {
        id: "ms_ss_7",
        category: "Soft Skills",
        text: "Mampu menyampaikan umpan balik yang membina, menyatukan perbedaan pandangan dalam tim"
      },
      {
        id: "ms_ss_8",
        category: "Soft Skills",
        text: "Mampu menyatukan banyak gaya kepemimpinan di bawahnya dan menyampaikan evaluasi dengan kejelasan dan hikmah"
      },
      {
        id: "ms_ss_9",
        category: "Soft Skills",
        text: "Mahir dalam manajemen konflik dan negosiasi lintas unit"
      },
      {
        id: "ms_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Menjadi pemecah masalah utama di unit"
      },
      {
        id: "ms_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu mengidentifikasi pola masalah berulang"
      },
      {
        id: "ms_ps_3",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu membaca tren permasalahan operasional dan SDM secara sistemik"
      },
      {
        id: "ms_ps_4",
        category: "Problem Solving & Analytical Thinking",
        text: "Menyampaikan solusi yang aplikatif dan realistis, baik secara lisan maupun dalam bentuk laporan harian kepada Area Manager"
      },
      {
        id: "ms_ps_5",
        category: "Problem Solving & Analytical Thinking",
        text: "Menganalisis akar penyebab, serta menyusun rekomendasi kebijakan teknis maupun prosedural dengan mempertimbangkan dampak jangka panjang"
      },
      {
        id: "ms_ps_6",
        category: "Problem Solving & Analytical Thinking",
        text: "Aktif menyampaikan saran yang membangun kepada atasan"
      },
      {
        id: "ms_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Berkomitmen terhadap budaya kerja Sedjati Grup: disiplin waktu, jujur, menjaga fasilitas kerja"
      },
      {
        id: "ms_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Aktif menunjukkan perilaku sesuai budaya Sedjati Grup: jujur, bersih, amanah, dan loyal"
      },
      {
        id: "ms_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi penjaga arah budaya Qurani di operasional"
      },
      {
        id: "ms_cf_4",
        category: "Culture Fit & Organizational Commitment",
        text: "Menumbuhkan semangat budaya kerja Qurani, disiplin, bersih, dan saling menguatkan"
      },
      {
        id: "ms_cf_5",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi contoh dalam menjaga waktu, kerapihan, serta etos kerja tim"
      },
      {
        id: "ms_cf_6",
        category: "Culture Fit & Organizational Commitment",
        text: "Menegakkan budaya kerja Sedjati Grup di dalam shift: jujur, bersih, amanah, disiplin, kolaboratif, dan loyal"
      },
      {
        id: "ms_cf_7",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga fasilitas kerja, semangat kebersamaan, dan menjaga reputasi tim"
      },
      {
        id: "ms_cf_8",
        category: "Culture Fit & Organizational Commitment",
        text: "Taat terhadap kebijakan, menjaga nama baik perusahaan, dan aktif dalam kegiatan tim"
      },
      {
        id: "ms_cf_9",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga konsistensi antara nilai perusahaan dan praktik kerja lapangan, serta mendorong loyalitas tim"
      },
      {
        id: "ms_cf_10",
        category: "Culture Fit & Organizational Commitment",
        text: "Menyatukan tim lintas shift dan store dalam satu semangat nilai: jujur, amanah, disiplin, bersih, kolaboratif, dan loyal"
      },
      {
        id: "ms_cf_11",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi duta budaya perusahaan di area yang dipimpinnya dan memastikan implementasi nilai-nilai perusahaan secara konsisten"
      },
      {
        id: "ms_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi penyejuk tim, tidak menyalahkan orang lain, membiasakan teguran dengan hikmah"
      },
      {
        id: "ms_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Konsisten dalam menjaga shalat, adab kerja, dan interaksi"
      },
      {
        id: "ms_ae_3",
        category: "Akhlak & Etika Kerja Islami",
        text: "Tidak terlibat dalam konflik atau ghibah, dan menjaga niat kerja sebagai bagian dari ibadah"
      },
      {
        id: "ms_ae_4",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi figur panutan dalam adab interaksi vertikal maupun horizontal"
      },
      {
        id: "ms_ae_5",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi pembina adab kerja di berbagai lapisan"
      },
      {
        id: "ms_ae_6",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menyampaikan arahan dengan ketegasan yang lembut, menghindari konflik terbuka, dan menjaga ibadah serta ukhuwah"
      },
      {
        id: "ms_ae_7",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi teladan dalam penerapan prinsip-prinsip Islam dalam kepemimpinan dan manajemen konflik"
      },
      {
        id: "ms_ae_8",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menerapkan prinsip kepemimpinan Islam yang adil, bijaksana, dan penuh kasih sayang dalam mengelola tim regional"
      }
    ],
    section2: semangatSedjatiQuestions,
    section3: recommendationOptions,
    isActive: true,
    version: "2.1",
    createdAt: new Date().toISOString()
  },

  // Level 10: Senior Supervisor
  {
    id: "template_senior_supervisor",
    level: "Senior Supervisor",
    description: "Assessment template untuk Senior Supervisor - pengelola lintas store dengan kemampuan manajemen konflik",
    section1: [
      {
        id: "ss_fc_1",
        category: "Functional Competency",
        text: "Menguasai seluruh aspek operasional unit secara menyeluruh: SOP, SDM, peralatan, stok, laporan, layanan, dan kualitas produk"
      },
      {
        id: "ss_fc_2",
        category: "Functional Competency",
        text: "Mampu menyelesaikan pekerjaan sesuai target dengan hasil unggul, efisiensi tinggi, dan minim kesalahan"
      },
      {
        id: "ss_fc_3",
        category: "Functional Competency",
        text: "Mengelola operasional lintas store atau unit"
      },
      {
        id: "ss_fc_4",
        category: "Functional Competency",
        text: "Menyusun target bulanan dan mengawal pencapaiannya"
      },
      {
        id: "ss_fc_5",
        category: "Functional Competency",
        text: "Mampu melatih anggota baru"
      },
      {
        id: "ss_fc_6",
        category: "Functional Competency",
        text: "Bertanggung jawab atas hasil akhir operasional seluruh shift"
      },
      {
        id: "ss_fc_7",
        category: "Functional Competency",
        text: "Melakukan analisis performa, validasi laporan harian dari TL dan Junior Supervisor"
      },
      {
        id: "ss_fc_8",
        category: "Functional Competency",
        text: "Membuat laporan evaluatif kepada Manager atau Area Supervisor"
      },
      {
        id: "ss_fc_9",
        category: "Functional Competency",
        text: "Merancang rencana perbaikan yang terstruktur"
      },
      {
        id: "ss_fc_10",
        category: "Functional Competency",
        text: "Mengkoordinasikan berbagai unit untuk mencapai target bersama"
      },
      {
        id: "ss_fc_11",
        category: "Functional Competency",
        text: "Menjadi rujukan teknis untuk area yang dipimpinnya"
      },
      {
        id: "ss_lm_1",
        category: "Leadership & Managerial",
        text: "Membina Middle Supervisor dan Junior Supervisor"
      },
      {
        id: "ss_lm_2",
        category: "Leadership & Managerial",
        text: "Memberi coaching berkala"
      },
      {
        id: "ss_lm_3",
        category: "Leadership & Managerial",
        text: "Menyusun pola rotasi tim"
      },
      {
        id: "ss_lm_4",
        category: "Leadership & Managerial",
        text: "Mempersiapkan kader untuk naik level"
      },
      {
        id: "ss_lm_5",
        category: "Leadership & Managerial",
        text: "Mengelola tim lintas store"
      },
      {
        id: "ss_lm_6",
        category: "Leadership & Managerial",
        text: "Menjadi koordinator utama dalam implementasi kebijakan area"
      },
      {
        id: "ss_ss_1",
        category: "Soft Skills",
        text: "Percaya diri, komunikatif, dan mampu menginspirasi rekan kerja"
      },
      {
        id: "ss_ss_2",
        category: "Soft Skills",
        text: "Selalu tampil profesional, bersih, rapi, dan berwibawa sesuai perannya sebagai leader tertinggi di unit"
      },
      {
        id: "ss_ss_3",
        category: "Soft Skills",
        text: "Mampu bekerja sama, terbuka terhadap masukan, dan menyampaikan pendapat dengan adab"
      },
      {
        id: "ss_ss_4",
        category: "Soft Skills",
        text: "Mampu menyampaikan instruksi, evaluasi, dan arahan tim secara terstruktur, sabar, dan tetap tegas"
      },
      {
        id: "ss_ss_5",
        category: "Soft Skills",
        text: "Membangun komunikasi efektif dengan tim dan atasan"
      },
      {
        id: "ss_ss_6",
        category: "Soft Skills",
        text: "Menjadi penengah bila terjadi konflik atau perbedaan pandangan antar tim"
      },
      {
        id: "ss_ss_7",
        category: "Soft Skills",
        text: "Mampu menyampaikan umpan balik yang membina, menyatukan perbedaan pandangan dalam tim"
      },
      {
        id: "ss_ss_8",
        category: "Soft Skills",
        text: "Mampu menyatukan banyak gaya kepemimpinan di bawahnya dan menyampaikan evaluasi dengan kejelasan dan hikmah"
      },
      {
        id: "ss_ss_9",
        category: "Soft Skills",
        text: "Mahir dalam manajemen konflik dan negosiasi lintas unit"
      },
      {
        id: "ss_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Menjadi pemecah masalah utama di unit"
      },
      {
        id: "ss_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu mengidentifikasi pola masalah berulang"
      },
      {
        id: "ss_ps_3",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu membaca tren permasalahan operasional dan SDM secara sistemik"
      },
      {
        id: "ss_ps_4",
        category: "Problem Solving & Analytical Thinking",
        text: "Menyampaikan solusi yang aplikatif dan realistis, baik secara lisan maupun dalam bentuk laporan harian kepada Area Manager"
      },
      {
        id: "ss_ps_5",
        category: "Problem Solving & Analytical Thinking",
        text: "Menganalisis akar penyebab, serta menyusun rekomendasi kebijakan teknis maupun prosedural dengan mempertimbangkan dampak jangka panjang"
      },
      {
        id: "ss_ps_6",
        category: "Problem Solving & Analytical Thinking",
        text: "Aktif menyampaikan saran yang membangun kepada atasan"
      },
      {
        id: "ss_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Berkomitmen terhadap budaya kerja Sedjati Grup: disiplin waktu, jujur, menjaga fasilitas kerja"
      },
      {
        id: "ss_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Aktif menunjukkan perilaku sesuai budaya Sedjati Grup: jujur, bersih, amanah, dan loyal"
      },
      {
        id: "ss_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi penjaga arah budaya Qurani di operasional"
      },
      {
        id: "ss_cf_4",
        category: "Culture Fit & Organizational Commitment",
        text: "Menumbuhkan semangat budaya kerja Qurani, disiplin, bersih, dan saling menguatkan"
      },
      {
        id: "ss_cf_5",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi contoh dalam menjaga waktu, kerapihan, serta etos kerja tim"
      },
      {
        id: "ss_cf_6",
        category: "Culture Fit & Organizational Commitment",
        text: "Menegakkan budaya kerja Sedjati Grup di dalam shift: jujur, bersih, amanah, disiplin, kolaboratif, dan loyal"
      },
      {
        id: "ss_cf_7",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga fasilitas kerja, semangat kebersamaan, dan menjaga reputasi tim"
      },
      {
        id: "ss_cf_8",
        category: "Culture Fit & Organizational Commitment",
        text: "Taat terhadap kebijakan, menjaga nama baik perusahaan, dan aktif dalam kegiatan tim"
      },
      {
        id: "ss_cf_9",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga konsistensi antara nilai perusahaan dan praktik kerja lapangan, serta mendorong loyalitas tim"
      },
      {
        id: "ss_cf_10",
        category: "Culture Fit & Organizational Commitment",
        text: "Menyatukan tim lintas shift dan store dalam satu semangat nilai: jujur, amanah, disiplin, bersih, kolaboratif, dan loyal"
      },
      {
        id: "ss_cf_11",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi duta budaya perusahaan di area yang dipimpinnya dan memastikan implementasi nilai-nilai perusahaan secara konsisten"
      },
      {
        id: "ss_cf_12",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga fasilitas kerja, semangat kebersamaan, dan menjaga reputasi tim"
      },
      {
        id: "ss_cf_13",
        category: "Culture Fit & Organizational Commitment",
        text: "Taat terhadap kebijakan, menjaga nama baik perusahaan, dan aktif dalam kegiatan tim"
      },
      {
        id: "ss_cf_14",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga konsistensi antara nilai perusahaan dan praktik kerja lapangan, serta mendorong loyalitas tim"
      },
      {
        id: "ss_cf_15",
        category: "Culture Fit & Organizational Commitment",
        text: "Menyatukan tim lintas shift dan store dalam satu semangat nilai: jujur, amanah, disiplin, bersih, kolaboratif, dan loyal"
      },
      {
        id: "ss_cf_16",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi duta budaya perusahaan di area yang dipimpinnya dan memastikan implementasi nilai-nilai perusahaan secara konsisten"
      },
      {
        id: "ss_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi penyejuk tim, tidak menyalahkan orang lain, membiasakan teguran dengan hikmah"
      },
      {
        id: "ss_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Konsisten dalam menjaga shalat, adab kerja, dan interaksi"
      },
      {
        id: "ss_ae_3",
        category: "Akhlak & Etika Kerja Islami",
        text: "Tidak terlibat dalam konflik atau ghibah, dan menjaga niat kerja sebagai bagian dari ibadah"
      },
      {
        id: "ss_ae_4",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi figur panutan dalam adab interaksi vertikal maupun horizontal"
      },
      {
        id: "ss_ae_5",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi pembina adab kerja di berbagai lapisan"
      },
      {
        id: "ss_ae_6",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menyampaikan arahan dengan ketegasan yang lembut, menghindari konflik terbuka, dan menjaga ibadah serta ukhuwah"
      },
      {
        id: "ss_ae_7",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi teladan dalam penerapan prinsip-prinsip Islam dalam kepemimpinan dan manajemen konflik"
      }
    ],
    section2: semangatSedjatiQuestions,
    section3: recommendationOptions,
    isActive: true,
    version: "2.1",
    createdAt: new Date().toISOString()
  },

  // Level 11: Junior Manager
  {
    id: "template_junior_manager",
    level: "Junior Manager",
    description: "Assessment template untuk Junior Manager - strategis operasional regional dengan prinsip kepemimpinan Islam",
    section1: [
      {
        id: "jm_fc_1",
        category: "Functional Competency",
        text: "Menguasai seluruh aspek operasional unit secara menyeluruh: SOP, SDM, peralatan, stok, laporan, layanan, dan kualitas produk"
      },
      {
        id: "jm_fc_2",
        category: "Functional Competency",
        text: "Mampu menyelesaikan pekerjaan sesuai target dengan hasil unggul, efisiensi tinggi, dan minim kesalahan"
      },
      {
        id: "jm_fc_3",
        category: "Functional Competency",
        text: "Mengelola strategi operasional regional"
      },
      {
        id: "jm_fc_4",
        category: "Functional Competency",
        text: "Menyusun target triwulan dan tahunan"
      },
      {
        id: "jm_fc_5",
        category: "Functional Competency",
        text: "Mampu melatih anggota baru"
      },
      {
        id: "jm_fc_6",
        category: "Functional Competency",
        text: "Bertanggung jawab atas hasil akhir operasional seluruh shift"
      },
      {
        id: "jm_fc_7",
        category: "Functional Competency",
        text: "Melakukan analisis performa, validasi laporan harian dari TL dan Junior Supervisor"
      },
      {
        id: "jm_fc_8",
        category: "Functional Competency",
        text: "Membuat laporan evaluatif kepada Manager atau Area Supervisor"
      },
      {
        id: "jm_fc_9",
        category: "Functional Competency",
        text: "Merancang rencana perbaikan yang terstruktur"
      },
      {
        id: "jm_fc_10",
        category: "Functional Competency",
        text: "Mengkoordinasikan berbagai unit untuk mencapai target bersama"
      },
      {
        id: "jm_fc_11",
        category: "Functional Competency",
        text: "Menjadi rujukan teknis untuk area yang dipimpinnya"
      },
      {
        id: "jm_fc_12",
        category: "Functional Competency",
        text: "Mengembangkan sistem operasional yang efisien dan berkelanjutan"
      },
      {
        id: "jm_fc_13",
        category: "Functional Competency",
        text: "Mengelola anggaran operasional dan investasi jangka menengah"
      },
      {
        id: "jm_lm_1",
        category: "Leadership & Managerial",
        text: "Membina Senior Supervisor dan Middle Supervisor"
      },
      {
        id: "jm_lm_2",
        category: "Leadership & Managerial",
        text: "Memberi coaching berkala"
      },
      {
        id: "jm_lm_3",
        category: "Leadership & Managerial",
        text: "Menyusun pola rotasi tim"
      },
      {
        id: "jm_lm_4",
        category: "Leadership & Managerial",
        text: "Mempersiapkan kader untuk naik level"
      },
      {
        id: "jm_lm_5",
        category: "Leadership & Managerial",
        text: "Mengelola tim lintas store"
      },
      {
        id: "jm_lm_6",
        category: "Leadership & Managerial",
        text: "Menjadi koordinator utama dalam implementasi kebijakan area"
      },
      {
        id: "jm_ss_1",
        category: "Soft Skills",
        text: "Percaya diri, komunikatif, dan mampu menginspirasi rekan kerja"
      },
      {
        id: "jm_ss_2",
        category: "Soft Skills",
        text: "Selalu tampil profesional, bersih, rapi, dan berwibawa sesuai perannya sebagai leader tertinggi di unit"
      },
      {
        id: "jm_ss_3",
        category: "Soft Skills",
        text: "Mampu bekerja sama, terbuka terhadap masukan, dan menyampaikan pendapat dengan adab"
      },
      {
        id: "jm_ss_4",
        category: "Soft Skills",
        text: "Mampu menyampaikan instruksi, evaluasi, dan arahan tim secara terstruktur, sabar, dan tetap tegas"
      },
      {
        id: "jm_ss_5",
        category: "Soft Skills",
        text: "Membangun komunikasi efektif dengan tim dan atasan"
      },
      {
        id: "jm_ss_6",
        category: "Soft Skills",
        text: "Menjadi penengah bila terjadi konflik atau perbedaan pandangan antar tim"
      },
      {
        id: "jm_ss_7",
        category: "Soft Skills",
        text: "Mampu menyampaikan umpan balik yang membina, menyatukan perbedaan pandangan dalam tim"
      },
      {
        id: "jm_ss_8",
        category: "Soft Skills",
        text: "Mampu menyatukan banyak gaya kepemimpinan di bawahnya dan menyampaikan evaluasi dengan kejelasan dan hikmah"
      },
      {
        id: "jm_ss_9",
        category: "Soft Skills",
        text: "Mahir dalam manajemen konflik dan negosiasi lintas unit"
      },
      {
        id: "jm_ss_10",
        category: "Soft Skills",
        text: "Mampu membangun tim yang solid dan mengembangkan potensi individu dalam tim"
      },
      {
        id: "jm_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Menjadi pemecah masalah utama di unit"
      },
      {
        id: "jm_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu mengidentifikasi pola masalah berulang"
      },
      {
        id: "jm_ps_3",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu membaca tren permasalahan operasional dan SDM secara sistemik"
      },
      {
        id: "jm_ps_4",
        category: "Problem Solving & Analytical Thinking",
        text: "Menyampaikan solusi yang aplikatif dan realistis, baik secara lisan maupun dalam bentuk laporan harian kepada Area Manager"
      },
      {
        id: "jm_ps_5",
        category: "Problem Solving & Analytical Thinking",
        text: "Menganalisis akar penyebab, serta menyusun rekomendasi kebijakan teknis maupun prosedural dengan mempertimbangkan dampak jangka panjang"
      },
      {
        id: "jm_ps_6",
        category: "Problem Solving & Analytical Thinking",
        text: "Aktif menyampaikan saran yang membangun kepada atasan"
      },
      {
        id: "jm_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Berkomitmen terhadap budaya kerja Sedjati Grup: disiplin waktu, jujur, menjaga fasilitas kerja"
      },
      {
        id: "jm_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Aktif menunjukkan perilaku sesuai budaya Sedjati Grup: jujur, bersih, amanah, dan loyal"
      },
      {
        id: "jm_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi penjaga arah budaya Qurani di operasional"
      },
      {
        id: "jm_cf_4",
        category: "Culture Fit & Organizational Commitment",
        text: "Menumbuhkan semangat budaya kerja Qurani, disiplin, bersih, dan saling menguatkan"
      },
      {
        id: "jm_cf_5",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi contoh dalam menjaga waktu, kerapihan, serta etos kerja tim"
      },
      {
        id: "jm_cf_6",
        category: "Culture Fit & Organizational Commitment",
        text: "Menegakkan budaya kerja Sedjati Grup di dalam shift: jujur, bersih, amanah, disiplin, kolaboratif, dan loyal"
      },
      {
        id: "jm_cf_7",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga fasilitas kerja, semangat kebersamaan, dan menjaga reputasi tim"
      },
      {
        id: "jm_cf_8",
        category: "Culture Fit & Organizational Commitment",
        text: "Taat terhadap kebijakan, menjaga nama baik perusahaan, dan aktif dalam kegiatan tim"
      },
      {
        id: "jm_cf_9",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga konsistensi antara nilai perusahaan dan praktik kerja lapangan, serta mendorong loyalitas tim"
      },
      {
        id: "jm_cf_10",
        category: "Culture Fit & Organizational Commitment",
        text: "Menyatukan tim lintas shift dan store dalam satu semangat nilai: jujur, amanah, disiplin, bersih, kolaboratif, dan loyal"
      },
      {
        id: "jm_cf_11",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi duta budaya perusahaan di area yang dipimpinnya dan memastikan implementasi nilai-nilai perusahaan secara konsisten"
      },
      {
        id: "jm_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi penyejuk tim, tidak menyalahkan orang lain, membiasakan teguran dengan hikmah"
      },
      {
        id: "jm_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Konsisten dalam menjaga shalat, adab kerja, dan interaksi"
      },
      {
        id: "jm_ae_3",
        category: "Akhlak & Etika Kerja Islami",
        text: "Tidak terlibat dalam konflik atau ghibah, dan menjaga niat kerja sebagai bagian dari ibadah"
      },
      {
        id: "jm_ae_4",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi figur panutan dalam adab interaksi vertikal maupun horizontal"
      },
      {
        id: "jm_ae_5",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi pembina adab kerja di berbagai lapisan"
      },
      {
        id: "jm_ae_6",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menyampaikan arahan dengan ketegasan yang lembut, menghindari konflik terbuka, dan menjaga ibadah serta ukhuwah"
      },
      {
        id: "jm_ae_7",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi teladan dalam penerapan prinsip-prinsip Islam dalam kepemimpinan dan manajemen konflik"
      },
      {
        id: "jm_ae_8",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menerapkan prinsip kepemimpinan Islam yang adil, bijaksana, dan penuh kasih sayang dalam mengelola tim regional"
      }
    ],
    section2: semangatSedjatiQuestions,
    section3: recommendationOptions,
    isActive: true,
    version: "2.1",
    createdAt: new Date().toISOString()
  },

  // Level 12: Middle Manager
  {
    id: "template_middle_manager",
    level: "Middle Manager",
    description: "Assessment template untuk Middle Manager - implementator kebijakan lintas lokasi dengan pengembangan sistem strategis",
    section1: [
      {
        id: "mm_fc_1",
        category: "Functional Competency",
        text: "Menguasai seluruh aspek operasional unit secara menyeluruh: SOP, SDM, peralatan, stok, laporan, layanan, dan kualitas produk"
      },
      {
        id: "mm_fc_2",
        category: "Functional Competency",
        text: "Mampu menyelesaikan pekerjaan sesuai target dengan hasil unggul, efisiensi tinggi, dan minim kesalahan"
      },
      {
        id: "mm_fc_3",
        category: "Functional Competency",
        text: "Mengimplementasikan kebijakan lintas lokasi"
      },
      {
        id: "mm_fc_4",
        category: "Functional Competency",
        text: "Mengembangkan sistem strategis jangka menengah"
      },
      {
        id: "mm_fc_5",
        category: "Functional Competency",
        text: "Mampu melatih anggota baru"
      },
      {
        id: "mm_fc_6",
        category: "Functional Competency",
        text: "Bertanggung jawab atas hasil akhir operasional seluruh shift"
      },
      {
        id: "mm_fc_7",
        category: "Functional Competency",
        text: "Melakukan analisis performa, validasi laporan harian dari TL dan Junior Supervisor"
      },
      {
        id: "mm_fc_8",
        category: "Functional Competency",
        text: "Membuat laporan evaluatif kepada Manager atau Area Supervisor"
      },
      {
        id: "mm_fc_9",
        category: "Functional Competency",
        text: "Merancang rencana perbaikan yang terstruktur"
      },
      {
        id: "mm_fc_10",
        category: "Functional Competency",
        text: "Mengkoordinasikan berbagai unit untuk mencapai target bersama"
      },
      {
        id: "mm_fc_11",
        category: "Functional Competency",
        text: "Menjadi rujukan teknis untuk area yang dipimpinnya"
      },
      {
        id: "mm_fc_12",
        category: "Functional Competency",
        text: "Mengembangkan sistem operasional yang efisien dan berkelanjutan"
      },
      {
        id: "mm_fc_13",
        category: "Functional Competency",
        text: "Mengelola anggaran operasional dan investasi jangka menengah"
      },
      {
        id: "mm_fc_14",
        category: "Functional Competency",
        text: "Merancang dan mengimplementasikan inovasi operasional untuk meningkatkan efisiensi dan kualitas layanan"
      },
      {
        id: "mm_lm_1",
        category: "Leadership & Managerial",
        text: "Membina Junior Manager dan Senior Supervisor"
      },
      {
        id: "mm_lm_2",
        category: "Leadership & Managerial",
        text: "Memberi coaching berkala"
      },
      {
        id: "mm_lm_3",
        category: "Leadership & Managerial",
        text: "Menyusun pola rotasi tim"
      },
      {
        id: "mm_lm_4",
        category: "Leadership & Managerial",
        text: "Mempersiapkan kader untuk naik level"
      },
      {
        id: "mm_lm_5",
        category: "Leadership & Managerial",
        text: "Mengelola tim lintas store"
      },
      {
        id: "mm_lm_6",
        category: "Leadership & Managerial",
        text: "Menjadi koordinator utama dalam implementasi kebijakan area"
      },
      {
        id: "mm_ss_1",
        category: "Soft Skills",
        text: "Percaya diri, komunikatif, dan mampu menginspirasi rekan kerja"
      },
      {
        id: "mm_ss_2",
        category: "Soft Skills",
        text: "Selalu tampil profesional, bersih, rapi, dan berwibawa sesuai perannya sebagai leader tertinggi di unit"
      },
      {
        id: "mm_ss_3",
        category: "Soft Skills",
        text: "Mampu bekerja sama, terbuka terhadap masukan, dan menyampaikan pendapat dengan adab"
      },
      {
        id: "mm_ss_4",
        category: "Soft Skills",
        text: "Mampu menyampaikan instruksi, evaluasi, dan arahan tim secara terstruktur, sabar, dan tetap tegas"
      },
      {
        id: "mm_ss_5",
        category: "Soft Skills",
        text: "Membangun komunikasi efektif dengan tim dan atasan"
      },
      {
        id: "mm_ss_6",
        category: "Soft Skills",
        text: "Menjadi penengah bila terjadi konflik atau perbedaan pandangan antar tim"
      },
      {
        id: "mm_ss_7",
        category: "Soft Skills",
        text: "Mampu menyampaikan umpan balik yang membina, menyatukan perbedaan pandangan dalam tim"
      },
      {
        id: "mm_ss_8",
        category: "Soft Skills",
        text: "Mampu menyatukan banyak gaya kepemimpinan di bawahnya dan menyampaikan evaluasi dengan kejelasan dan hikmah"
      },
      {
        id: "mm_ss_9",
        category: "Soft Skills",
        text: "Mahir dalam manajemen konflik dan negosiasi lintas unit"
      },
      {
        id: "mm_ss_10",
        category: "Soft Skills",
        text: "Mampu membangun tim yang solid dan mengembangkan potensi individu dalam tim"
      },
      {
        id: "mm_ss_11",
        category: "Soft Skills",
        text: "Memiliki kemampuan presentasi dan komunikasi publik yang excellent untuk menyampaikan visi dan strategi"
      },
      {
        id: "mm_ss_12",
        category: "Soft Skills",
        text: "Mampu memfasilitasi diskusi strategis dan mengambil keputusan yang tepat dalam situasi kompleks"
      },
      {
        id: "mm_ss_13",
        category: "Soft Skills",
        text: "Membangun jaringan kerja yang kuat dengan stakeholder internal dan eksternal"
      },
      {
        id: "mm_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Menjadi pemecah masalah utama di unit"
      },
      {
        id: "mm_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu mengidentifikasi pola masalah berulang"
      },
      {
        id: "mm_ps_3",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu membaca tren permasalahan operasional dan SDM secara sistemik"
      },
      {
        id: "mm_ps_4",
        category: "Problem Solving & Analytical Thinking",
        text: "Menyampaikan solusi yang aplikatif dan realistis, baik secara lisan maupun dalam bentuk laporan harian kepada Area Manager"
      },
      {
        id: "mm_ps_5",
        category: "Problem Solving & Analytical Thinking",
        text: "Menganalisis akar penyebab, serta menyusun rekomendasi kebijakan teknis maupun prosedural dengan mempertimbangkan dampak jangka panjang"
      },
      {
        id: "mm_ps_6",
        category: "Problem Solving & Analytical Thinking",
        text: "Aktif menyampaikan saran yang membangun kepada atasan"
      },
      {
        id: "mm_ps_7",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu melakukan analisis strategis mendalam untuk mengidentifikasi peluang dan ancaman bisnis"
      },
      {
        id: "mm_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Berkomitmen terhadap budaya kerja Sedjati Grup: disiplin waktu, jujur, menjaga fasilitas kerja"
      },
      {
        id: "mm_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Aktif menunjukkan perilaku sesuai budaya Sedjati Grup: jujur, bersih, amanah, dan loyal"
      },
      {
        id: "mm_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi penjaga arah budaya Qurani di operasional"
      },
      {
        id: "mm_cf_4",
        category: "Culture Fit & Organizational Commitment",
        text: "Menumbuhkan semangat budaya kerja Qurani, disiplin, bersih, dan saling menguatkan"
      },
      {
        id: "mm_cf_5",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi contoh dalam menjaga waktu, kerapihan, serta etos kerja tim"
      },
      {
        id: "mm_cf_6",
        category: "Culture Fit & Organizational Commitment",
        text: "Menegakkan budaya kerja Sedjati Grup di dalam shift: jujur, bersih, amanah, disiplin, kolaboratif, dan loyal"
      },
      {
        id: "mm_cf_7",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga fasilitas kerja, semangat kebersamaan, dan menjaga reputasi tim"
      },
      {
        id: "mm_cf_8",
        category: "Culture Fit & Organizational Commitment",
        text: "Taat terhadap kebijakan, menjaga nama baik perusahaan, dan aktif dalam kegiatan tim"
      },
      {
        id: "mm_cf_9",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga konsistensi antara nilai perusahaan dan praktik kerja lapangan, serta mendorong loyalitas tim"
      },
      {
        id: "mm_cf_10",
        category: "Culture Fit & Organizational Commitment",
        text: "Menyatukan tim lintas shift dan store dalam satu semangat nilai: jujur, amanah, disiplin, bersih, kolaboratif, dan loyal"
      },
      {
        id: "mm_cf_11",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi duta budaya perusahaan di area yang dipimpinnya dan memastikan implementasi nilai-nilai perusahaan secara konsisten"
      },
      {
        id: "mm_cf_12",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga fasilitas kerja, semangat kebersamaan, dan menjaga reputasi tim"
      },
      {
        id: "mm_cf_13",
        category: "Culture Fit & Organizational Commitment",
        text: "Taat terhadap kebijakan, menjaga nama baik perusahaan, dan aktif dalam kegiatan tim"
      },
      {
        id: "mm_cf_14",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga konsistensi antara nilai perusahaan dan praktik kerja lapangan, serta mendorong loyalitas tim"
      },
      {
        id: "mm_cf_15",
        category: "Culture Fit & Organizational Commitment",
        text: "Menyatukan tim lintas shift dan store dalam satu semangat nilai: jujur, amanah, disiplin, bersih, kolaboratif, dan loyal"
      },
      {
        id: "mm_cf_16",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi duta budaya perusahaan di area yang dipimpinnya dan memastikan implementasi nilai-nilai perusahaan secara konsisten"
      },
      {
        id: "mm_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi penyejuk tim, tidak menyalahkan orang lain, membiasakan teguran dengan hikmah"
      },
      {
        id: "mm_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Konsisten dalam menjaga shalat, adab kerja, dan interaksi"
      },
      {
        id: "mm_ae_3",
        category: "Akhlak & Etika Kerja Islami",
        text: "Tidak terlibat dalam konflik atau ghibah, dan menjaga niat kerja sebagai bagian dari ibadah"
      },
      {
        id: "mm_ae_4",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi figur panutan dalam adab interaksi vertikal maupun horizontal"
      },
      {
        id: "mm_ae_5",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi pembina adab kerja di berbagai lapisan"
      },
      {
        id: "mm_ae_6",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menyampaikan arahan dengan ketegasan yang lembut, menghindari konflik terbuka, dan menjaga ibadah serta ukhuwah"
      },
      {
        id: "mm_ae_7",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi teladan dalam penerapan prinsip-prinsip Islam dalam kepemimpinan dan manajemen konflik"
      },
      {
        id: "mm_ae_8",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menerapkan prinsip kepemimpinan Islam yang adil, bijaksana, dan penuh kasih sayang dalam mengelola tim regional"
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
    description: "Assessment template untuk Senior Manager - simbol organisasi dengan kemampuan coaching kepemimpinan tingkat lanjut",
    section1: [
      {
        id: "sm_fc_1",
        category: "Functional Competency",
        text: "Menguasai seluruh aspek operasional unit secara menyeluruh: SOP, SDM, peralatan, stok, laporan, layanan, dan kualitas produk"
      },
      {
        id: "sm_fc_2",
        category: "Functional Competency",
        text: "Mampu menyelesaikan pekerjaan sesuai target dengan hasil unggul, efisiensi tinggi, dan minim kesalahan"
      },
      {
        id: "sm_fc_3",
        category: "Functional Competency",
        text: "Menjadi simbol organisasi dalam bidang keahliannya"
      },
      {
        id: "sm_fc_4",
        category: "Functional Competency",
        text: "Merancang kebijakan strategis jangka panjang"
      },
      {
        id: "sm_fc_5",
        category: "Functional Competency",
        text: "Mampu melatih anggota baru"
      },
      {
        id: "sm_fc_6",
        category: "Functional Competency",
        text: "Bertanggung jawab atas hasil akhir operasional seluruh shift"
      },
      {
        id: "sm_fc_7",
        category: "Functional Competency",
        text: "Melakukan analisis performa, validasi laporan harian dari TL dan Junior Supervisor"
      },
      {
        id: "sm_fc_8",
        category: "Functional Competency",
        text: "Membuat laporan evaluatif kepada Manager atau Area Supervisor"
      },
      {
        id: "sm_fc_9",
        category: "Functional Competency",
        text: "Merancang rencana perbaikan yang terstruktur"
      },
      {
        id: "sm_fc_10",
        category: "Functional Competency",
        text: "Mengkoordinasikan berbagai unit untuk mencapai target bersama"
      },
      {
        id: "sm_fc_11",
        category: "Functional Competency",
        text: "Menjadi rujukan teknis untuk area yang dipimpinnya"
      },
      {
        id: "sm_fc_12",
        category: "Functional Competency",
        text: "Mengembangkan sistem operasional yang efisien dan berkelanjutan"
      },
      {
        id: "sm_fc_13",
        category: "Functional Competency",
        text: "Mengelola anggaran operasional dan investasi jangka menengah"
      },
      {
        id: "sm_fc_14",
        category: "Functional Competency",
        text: "Merancang dan mengimplementasikan inovasi operasional untuk meningkatkan efisiensi dan kualitas layanan"
      },
      {
        id: "sm_fc_15",
        category: "Functional Competency",
        text: "Memimpin transformasi organisasi dan mengembangkan strategi bisnis jangka panjang"
      },
      {
        id: "sm_lm_1",
        category: "Leadership & Managerial",
        text: "Membina Middle Manager dan Junior Manager"
      },
      {
        id: "sm_lm_2",
        category: "Leadership & Managerial",
        text: "Memberi coaching berkala"
      },
      {
        id: "sm_lm_3",
        category: "Leadership & Managerial",
        text: "Menyusun pola rotasi tim"
      },
      {
        id: "sm_lm_4",
        category: "Leadership & Managerial",
        text: "Mempersiapkan kader untuk naik level"
      },
      {
        id: "sm_lm_5",
        category: "Leadership & Managerial",
        text: "Mengelola tim lintas store"
      },
      {
        id: "sm_lm_6",
        category: "Leadership & Managerial",
        text: "Menjadi koordinator utama dalam implementasi kebijakan area"
      },
      {
        id: "sm_lm_7",
        category: "Leadership & Managerial",
        text: "Coaching kepemimpinan tingkat lanjut untuk mengembangkan pemimpin masa depan"
      },
      {
        id: "sm_ss_1",
        category: "Soft Skills",
        text: "Percaya diri, komunikatif, dan mampu menginspirasi rekan kerja"
      },
      {
        id: "sm_ss_2",
        category: "Soft Skills",
        text: "Selalu tampil profesional, bersih, rapi, dan berwibawa sesuai perannya sebagai leader tertinggi di unit"
      },
      {
        id: "sm_ss_3",
        category: "Soft Skills",
        text: "Mampu bekerja sama, terbuka terhadap masukan, dan menyampaikan pendapat dengan adab"
      },
      {
        id: "sm_ss_4",
        category: "Soft Skills",
        text: "Mampu menyampaikan instruksi, evaluasi, dan arahan tim secara terstruktur, sabar, dan tetap tegas"
      },
      {
        id: "sm_ss_5",
        category: "Soft Skills",
        text: "Membangun komunikasi efektif dengan tim dan atasan"
      },
      {
        id: "sm_ss_6",
        category: "Soft Skills",
        text: "Menjadi penengah bila terjadi konflik atau perbedaan pandangan antar tim"
      },
      {
        id: "sm_ss_7",
        category: "Soft Skills",
        text: "Mampu menyampaikan umpan balik yang membina, menyatukan perbedaan pandangan dalam tim"
      },
      {
        id: "sm_ss_8",
        category: "Soft Skills",
        text: "Mampu menyatukan banyak gaya kepemimpinan di bawahnya dan menyampaikan evaluasi dengan kejelasan dan hikmah"
      },
      {
        id: "sm_ss_9",
        category: "Soft Skills",
        text: "Mahir dalam manajemen konflik dan negosiasi lintas unit"
      },
      {
        id: "sm_ss_10",
        category: "Soft Skills",
        text: "Mampu membangun tim yang solid dan mengembangkan potensi individu dalam tim"
      },
      {
        id: "sm_ss_11",
        category: "Soft Skills",
        text: "Memiliki kemampuan presentasi dan komunikasi publik yang excellent untuk menyampaikan visi dan strategi"
      },
      {
        id: "sm_ss_12",
        category: "Soft Skills",
        text: "Mampu memfasilitasi diskusi strategis dan mengambil keputusan yang tepat dalam situasi kompleks"
      },
      {
        id: "sm_ss_13",
        category: "Soft Skills",
        text: "Membangun jaringan kerja yang kuat dengan stakeholder internal dan eksternal"
      },
      {
        id: "sm_ss_14",
        category: "Soft Skills",
        text: "Memiliki charisma dan kemampuan mempengaruhi yang kuat untuk memimpin perubahan organisasi"
      },
      {
        id: "sm_ss_15",
        category: "Soft Skills",
        text: "Mampu menginspirasi dan memotivasi tim dalam skala besar serta membangun budaya kerja yang positif"
      },
      {
        id: "sm_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Menjadi pemecah masalah utama di unit"
      },
      {
        id: "sm_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu mengidentifikasi pola masalah berulang"
      },
      {
        id: "sm_ps_3",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu membaca tren permasalahan operasional dan SDM secara sistemik"
      },
      {
        id: "sm_ps_4",
        category: "Problem Solving & Analytical Thinking",
        text: "Menyampaikan solusi yang aplikatif dan realistis, baik secara lisan maupun dalam bentuk laporan harian kepada Area Manager"
      },
      {
        id: "sm_ps_5",
        category: "Problem Solving & Analytical Thinking",
        text: "Menganalisis akar penyebab, serta menyusun rekomendasi kebijakan teknis maupun prosedural dengan mempertimbangkan dampak jangka panjang"
      },
      {
        id: "sm_ps_6",
        category: "Problem Solving & Analytical Thinking",
        text: "Aktif menyampaikan saran yang membangun kepada atasan"
      },
      {
        id: "sm_ps_7",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu melakukan analisis strategis mendalam untuk mengidentifikasi peluang dan ancaman bisnis"
      },
      {
        id: "sm_ps_8",
        category: "Problem Solving & Analytical Thinking",
        text: "Memiliki kemampuan berpikir sistemik untuk memahami kompleksitas organisasi dan lingkungan bisnis"
      },
      {
        id: "sm_ps_9",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu mengantisipasi tantangan masa depan dan menyusun strategi mitigasi risiko"
      },
      {
        id: "sm_ps_10",
        category: "Problem Solving & Analytical Thinking",
        text: "Menguasai metodologi problem solving tingkat lanjut untuk menyelesaikan masalah kompleks lintas fungsi"
      },
      {
        id: "sm_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Berkomitmen terhadap budaya kerja Sedjati Grup: disiplin waktu, jujur, menjaga fasilitas kerja"
      },
      {
        id: "sm_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Aktif menunjukkan perilaku sesuai budaya Sedjati Grup: jujur, bersih, amanah, dan loyal"
      },
      {
        id: "sm_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi penjaga arah budaya Qurani di operasional"
      },
      {
        id: "sm_cf_4",
        category: "Culture Fit & Organizational Commitment",
        text: "Menumbuhkan semangat budaya kerja Qurani, disiplin, bersih, dan saling menguatkan"
      },
      {
        id: "sm_cf_5",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi contoh dalam menjaga waktu, kerapihan, serta etos kerja tim"
      },
      {
        id: "sm_cf_6",
        category: "Culture Fit & Organizational Commitment",
        text: "Menegakkan budaya kerja Sedjati Grup di dalam shift: jujur, bersih, amanah, disiplin, kolaboratif, dan loyal"
      },
      {
        id: "sm_cf_7",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga fasilitas kerja, semangat kebersamaan, dan menjaga reputasi tim"
      },
      {
        id: "sm_cf_8",
        category: "Culture Fit & Organizational Commitment",
        text: "Taat terhadap kebijakan, menjaga nama baik perusahaan, dan aktif dalam kegiatan tim"
      },
      {
        id: "sm_cf_9",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga konsistensi antara nilai perusahaan dan praktik kerja lapangan, serta mendorong loyalitas tim"
      },
      {
        id: "sm_cf_10",
        category: "Culture Fit & Organizational Commitment",
        text: "Menyatukan tim lintas shift dan store dalam satu semangat nilai: jujur, amanah, disiplin, bersih, kolaboratif, dan loyal"
      },
      {
        id: "sm_cf_11",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi duta budaya perusahaan di area yang dipimpinnya dan memastikan implementasi nilai-nilai perusahaan secara konsisten"
      },
      {
        id: "sm_cf_12",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi champion perubahan budaya dan memimpin inisiatif transformasi organisasi"
      },
      {
        id: "sm_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi penyejuk tim, tidak menyalahkan orang lain, membiasakan teguran dengan hikmah"
      },
      {
        id: "sm_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Konsisten dalam menjaga shalat, adab kerja, dan interaksi"
      },
      {
        id: "sm_ae_3",
        category: "Akhlak & Etika Kerja Islami",
        text: "Tidak terlibat dalam konflik atau ghibah, dan menjaga niat kerja sebagai bagian dari ibadah"
      },
      {
        id: "sm_ae_4",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi figur panutan dalam adab interaksi vertikal maupun horizontal"
      },
      {
        id: "sm_ae_5",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi pembina adab kerja di berbagai lapisan"
      },
      {
        id: "sm_ae_6",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menyampaikan arahan dengan ketegasan yang lembut, menghindari konflik terbuka, dan menjaga ibadah serta ukhuwah"
      },
      {
        id: "sm_ae_7",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi teladan dalam penerapan prinsip-prinsip Islam dalam kepemimpinan dan manajemen konflik"
      },
      {
        id: "sm_ae_8",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menerapkan prinsip kepemimpinan Islam yang adil, bijaksana, dan penuh kasih sayang dalam mengelola tim regional"
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
    description: "Assessment template untuk Regional Manager - duta budaya regional dengan otoritas strategis penuh",
    section1: [
      {
        id: "rm_fc_1",
        category: "Functional Competency",
        text: "Menguasai seluruh aspek operasional unit secara menyeluruh: SOP, SDM, peralatan, stok, laporan, layanan, dan kualitas produk"
      },
      {
        id: "rm_fc_2",
        category: "Functional Competency",
        text: "Mampu menyelesaikan pekerjaan sesuai target dengan hasil unggul, efisiensi tinggi, dan minim kesalahan"
      },
      {
        id: "rm_fc_3",
        category: "Functional Competency",
        text: "Menjadi duta budaya di tingkat regional"
      },
      {
        id: "rm_fc_4",
        category: "Functional Competency",
        text: "Memiliki otoritas strategis penuh dalam wilayah regional"
      },
      {
        id: "rm_fc_5",
        category: "Functional Competency",
        text: "Mampu melatih anggota baru"
      },
      {
        id: "rm_fc_6",
        category: "Functional Competency",
        text: "Bertanggung jawab atas hasil akhir operasional seluruh shift"
      },
      {
        id: "rm_fc_7",
        category: "Functional Competency",
        text: "Melakukan analisis performa, validasi laporan harian dari TL dan Junior Supervisor"
      },
      {
        id: "rm_fc_8",
        category: "Functional Competency",
        text: "Membuat laporan evaluatif kepada Manager atau Area Supervisor"
      },
      {
        id: "rm_fc_9",
        category: "Functional Competency",
        text: "Merancang rencana perbaikan yang terstruktur"
      },
      {
        id: "rm_fc_10",
        category: "Functional Competency",
        text: "Mengkoordinasikan berbagai unit untuk mencapai target bersama"
      },
      {
        id: "rm_fc_11",
        category: "Functional Competency",
        text: "Menjadi rujukan teknis untuk area yang dipimpinnya"
      },
      {
        id: "rm_fc_12",
        category: "Functional Competency",
        text: "Mengembangkan sistem operasional yang efisien dan berkelanjutan"
      },
      {
        id: "rm_fc_13",
        category: "Functional Competency",
        text: "Mengelola anggaran operasional dan investasi jangka menengah"
      },
      {
        id: "rm_fc_14",
        category: "Functional Competency",
        text: "Merancang dan mengimplementasikan inovasi operasional untuk meningkatkan efisiensi dan kualitas layanan"
      },
      {
        id: "rm_fc_15",
        category: "Functional Competency",
        text: "Memimpin transformasi organisasi dan mengembangkan strategi bisnis jangka panjang"
      },
      {
        id: "rm_fc_16",
        category: "Functional Competency",
        text: "Mengelola portofolio bisnis regional dan mengoptimalkan sinergi antar unit bisnis"
      },
      {
        id: "rm_lm_1",
        category: "Leadership & Managerial",
        text: "Membina Senior Manager dan Middle Manager"
      },
      {
        id: "rm_lm_2",
        category: "Leadership & Managerial",
        text: "Memberi coaching berkala"
      },
      {
        id: "rm_lm_3",
        category: "Leadership & Managerial",
        text: "Menyusun pola rotasi tim"
      },
      {
        id: "rm_lm_4",
        category: "Leadership & Managerial",
        text: "Mempersiapkan kader untuk naik level"
      },
      {
        id: "rm_lm_5",
        category: "Leadership & Managerial",
        text: "Mengelola tim lintas store"
      },
      {
        id: "rm_lm_6",
        category: "Leadership & Managerial",
        text: "Menjadi koordinator utama dalam implementasi kebijakan area"
      },
      {
        id: "rm_lm_7",
        category: "Leadership & Managerial",
        text: "Coaching kepemimpinan tingkat lanjut untuk mengembangkan pemimpin masa depan"
      },
      {
        id: "rm_lm_8",
        category: "Leadership & Managerial",
        text: "Memimpin inisiatif strategis regional dan mengelola perubahan organisasi skala besar"
      },
      {
        id: "rm_ss_1",
        category: "Soft Skills",
        text: "Percaya diri, komunikatif, dan mampu menginspirasi rekan kerja"
      },
      {
        id: "rm_ss_2",
        category: "Soft Skills",
        text: "Selalu tampil profesional, bersih, rapi, dan berwibawa sesuai perannya sebagai leader tertinggi di unit"
      },
      {
        id: "rm_ss_3",
        category: "Soft Skills",
        text: "Mampu bekerja sama, terbuka terhadap masukan, dan menyampaikan pendapat dengan adab"
      },
      {
        id: "rm_ss_4",
        category: "Soft Skills",
        text: "Mampu menyampaikan instruksi, evaluasi, dan arahan tim secara terstruktur, sabar, dan tetap tegas"
      },
      {
        id: "rm_ss_5",
        category: "Soft Skills",
        text: "Membangun komunikasi efektif dengan tim dan atasan"
      },
      {
        id: "rm_ss_6",
        category: "Soft Skills",
        text: "Menjadi penengah bila terjadi konflik atau perbedaan pandangan antar tim"
      },
      {
        id: "rm_ss_7",
        category: "Soft Skills",
        text: "Mampu menyampaikan umpan balik yang membina, menyatukan perbedaan pandangan dalam tim"
      },
      {
        id: "rm_ss_8",
        category: "Soft Skills",
        text: "Mampu menyatukan banyak gaya kepemimpinan di bawahnya dan menyampaikan evaluasi dengan kejelasan dan hikmah"
      },
      {
        id: "rm_ss_9",
        category: "Soft Skills",
        text: "Mahir dalam manajemen konflik dan negosiasi lintas unit"
      },
      {
        id: "rm_ss_10",
        category: "Soft Skills",
        text: "Mampu membangun tim yang solid dan mengembangkan potensi individu dalam tim"
      },
      {
        id: "rm_ss_11",
        category: "Soft Skills",
        text: "Memiliki kemampuan presentasi dan komunikasi publik yang excellent untuk menyampaikan visi dan strategi"
      },
      {
        id: "rm_ss_12",
        category: "Soft Skills",
        text: "Mampu memfasilitasi diskusi strategis dan mengambil keputusan yang tepat dalam situasi kompleks"
      },
      {
        id: "rm_ss_13",
        category: "Soft Skills",
        text: "Membangun jaringan kerja yang kuat dengan stakeholder internal dan eksternal"
      },
      {
        id: "rm_ss_14",
        category: "Soft Skills",
        text: "Memiliki charisma dan kemampuan mempengaruhi yang kuat untuk memimpin perubahan organisasi"
      },
      {
        id: "rm_ss_15",
        category: "Soft Skills",
        text: "Mampu menginspirasi dan memotivasi tim dalam skala besar serta membangun budaya kerja yang positif"
      },
      {
        id: "rm_ss_16",
        category: "Soft Skills",
        text: "Memiliki kemampuan komunikasi lintas divisi dan dapat membangun kolaborasi strategis"
      },
      {
        id: "rm_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Menjadi pemecah masalah utama di unit"
      },
      {
        id: "rm_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu mengidentifikasi pola masalah berulang"
      },
      {
        id: "rm_ps_3",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu membaca tren permasalahan operasional dan SDM secara sistemik"
      },
      {
        id: "rm_ps_4",
        category: "Problem Solving & Analytical Thinking",
        text: "Menyampaikan solusi yang aplikatif dan realistis, baik secara lisan maupun dalam bentuk laporan harian kepada Area Manager"
      },
      {
        id: "rm_ps_5",
        category: "Problem Solving & Analytical Thinking",
        text: "Menganalisis akar penyebab, serta menyusun rekomendasi kebijakan teknis maupun prosedural dengan mempertimbangkan dampak jangka panjang"
      },
      {
        id: "rm_ps_6",
        category: "Problem Solving & Analytical Thinking",
        text: "Aktif menyampaikan saran yang membangun kepada atasan"
      },
      {
        id: "rm_ps_7",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu melakukan analisis strategis mendalam untuk mengidentifikasi peluang dan ancaman bisnis"
      },
      {
        id: "rm_ps_8",
        category: "Problem Solving & Analytical Thinking",
        text: "Memiliki kemampuan berpikir sistemik untuk memahami kompleksitas organisasi dan lingkungan bisnis"
      },
      {
        id: "rm_ps_9",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu mengantisipasi tantangan masa depan dan menyusun strategi mitigasi risiko"
      },
      {
        id: "rm_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Berkomitmen terhadap budaya kerja Sedjati Grup: disiplin waktu, jujur, menjaga fasilitas kerja"
      },
      {
        id: "rm_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Aktif menunjukkan perilaku sesuai budaya Sedjati Grup: jujur, bersih, amanah, dan loyal"
      },
      {
        id: "rm_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi penjaga arah budaya Qurani di operasional"
      },
      {
        id: "rm_cf_4",
        category: "Culture Fit & Organizational Commitment",
        text: "Menumbuhkan semangat budaya kerja Qurani, disiplin, bersih, dan saling menguatkan"
      },
      {
        id: "rm_cf_5",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi contoh dalam menjaga waktu, kerapihan, serta etos kerja tim"
      },
      {
        id: "rm_cf_6",
        category: "Culture Fit & Organizational Commitment",
        text: "Menegakkan budaya kerja Sedjati Grup di dalam shift: jujur, bersih, amanah, disiplin, kolaboratif, dan loyal"
      },
      {
        id: "rm_cf_7",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga fasilitas kerja, semangat kebersamaan, dan menjaga reputasi tim"
      },
      {
        id: "rm_cf_8",
        category: "Culture Fit & Organizational Commitment",
        text: "Taat terhadap kebijakan, menjaga nama baik perusahaan, dan aktif dalam kegiatan tim"
      },
      {
        id: "rm_cf_9",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga konsistensi antara nilai perusahaan dan praktik kerja lapangan, serta mendorong loyalitas tim"
      },
      {
        id: "rm_cf_10",
        category: "Culture Fit & Organizational Commitment",
        text: "Menyatukan tim lintas shift dan store dalam satu semangat nilai: jujur, amanah, disiplin, bersih, kolaboratif, dan loyal"
      },
      {
        id: "rm_cf_11",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi duta budaya perusahaan di area yang dipimpinnya dan memastikan implementasi nilai-nilai perusahaan secara konsisten"
      },
      {
        id: "rm_cf_12",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi champion perubahan budaya dan memimpin inisiatif transformasi organisasi"
      },
      {
        id: "rm_cf_13",
        category: "Culture Fit & Organizational Commitment",
        text: "Memastikan keselarasan budaya organisasi di seluruh wilayah regional yang dipimpinnya"
      },
      {
        id: "rm_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi penyejuk tim, tidak menyalahkan orang lain, membiasakan teguran dengan hikmah"
      },
      {
        id: "rm_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Konsisten dalam menjaga shalat, adab kerja, dan interaksi"
      },
      {
        id: "rm_ae_3",
        category: "Akhlak & Etika Kerja Islami",
        text: "Tidak terlibat dalam konflik atau ghibah, dan menjaga niat kerja sebagai bagian dari ibadah"
      },
      {
        id: "rm_ae_4",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi figur panutan dalam adab interaksi vertikal maupun horizontal"
      },
      {
        id: "rm_ae_5",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi pembina adab kerja di berbagai lapisan"
      },
      {
        id: "rm_ae_6",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menyampaikan arahan dengan ketegasan yang lembut, menghindari konflik terbuka, dan menjaga ibadah serta ukhuwah"
      },
      {
        id: "rm_ae_7",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi teladan dalam penerapan prinsip-prinsip Islam dalam kepemimpinan dan manajemen konflik"
      },
      {
        id: "rm_ae_8",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menerapkan prinsip kepemimpinan Islam yang adil, bijaksana, dan penuh kasih sayang dalam mengelola tim regional"
      },
      {
        id: "rm_ae_9",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi rujukan spiritual dan moral bagi seluruh jajaran di wilayah regional"
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
    description: "Assessment template untuk Division Head - otoritas tertinggi organisasi dengan tanggung jawab transformasi divisi",
    section1: [
      {
        id: "dh_fc_1",
        category: "Functional Competency",
        text: "Menguasai seluruh aspek operasional unit secara menyeluruh: SOP, SDM, peralatan, stok, laporan, layanan, dan kualitas produk"
      },
      {
        id: "dh_fc_2",
        category: "Functional Competency",
        text: "Mampu menyelesaikan pekerjaan sesuai target dengan hasil unggul, efisiensi tinggi, dan minim kesalahan"
      },
      {
        id: "dh_fc_3",
        category: "Functional Competency",
        text: "Menjadi otoritas tertinggi dalam organisasi"
      },
      {
        id: "dh_fc_4",
        category: "Functional Competency",
        text: "Bertanggung jawab atas transformasi seluruh divisi"
      },
      {
        id: "dh_fc_5",
        category: "Functional Competency",
        text: "Mampu melatih anggota baru"
      },
      {
        id: "dh_fc_6",
        category: "Functional Competency",
        text: "Bertanggung jawab atas hasil akhir operasional seluruh shift"
      },
      {
        id: "dh_fc_7",
        category: "Functional Competency",
        text: "Melakukan analisis performa, validasi laporan harian dari TL dan Junior Supervisor"
      },
      {
        id: "dh_fc_8",
        category: "Functional Competency",
        text: "Membuat laporan evaluatif kepada Manager atau Area Supervisor"
      },
      {
        id: "dh_fc_9",
        category: "Functional Competency",
        text: "Merancang rencana perbaikan yang terstruktur"
      },
      {
        id: "dh_fc_10",
        category: "Functional Competency",
        text: "Mengkoordinasikan berbagai unit untuk mencapai target bersama"
      },
      {
        id: "dh_fc_11",
        category: "Functional Competency",
        text: "Menjadi rujukan teknis untuk area yang dipimpinnya"
      },
      {
        id: "dh_fc_12",
        category: "Functional Competency",
        text: "Mengembangkan sistem operasional yang efisien dan berkelanjutan"
      },
      {
        id: "dh_fc_13",
        category: "Functional Competency",
        text: "Mengelola anggaran operasional dan investasi jangka menengah"
      },
      {
        id: "dh_fc_14",
        category: "Functional Competency",
        text: "Merancang dan mengimplementasikan inovasi operasional untuk meningkatkan efisiensi dan kualitas layanan"
      },
      {
        id: "dh_fc_15",
        category: "Functional Competency",
        text: "Memimpin transformasi organisasi dan mengembangkan strategi bisnis jangka panjang"
      },
      {
        id: "dh_fc_16",
        category: "Functional Competency",
        text: "Mengelola portofolio bisnis regional dan mengoptimalkan sinergi antar unit bisnis"
      },
      {
        id: "dh_lm_1",
        category: "Leadership & Managerial",
        text: "Membina Regional Manager dan Senior Manager"
      },
      {
        id: "dh_lm_2",
        category: "Leadership & Managerial",
        text: "Memberi coaching berkala"
      },
      {
        id: "dh_lm_3",
        category: "Leadership & Managerial",
        text: "Menyusun pola rotasi tim"
      },
      {
        id: "dh_lm_4",
        category: "Leadership & Managerial",
        text: "Mempersiapkan kader untuk naik level"
      },
      {
        id: "dh_lm_5",
        category: "Leadership & Managerial",
        text: "Mengelola tim lintas store"
      },
      {
        id: "dh_lm_6",
        category: "Leadership & Managerial",
        text: "Menjadi koordinator utama dalam implementasi kebijakan area"
      },
      {
        id: "dh_lm_7",
        category: "Leadership & Managerial",
        text: "Coaching kepemimpinan tingkat lanjut untuk mengembangkan pemimpin masa depan"
      },
      {
        id: "dh_lm_8",
        category: "Leadership & Managerial",
        text: "Memimpin inisiatif strategis regional dan mengelola perubahan organisasi skala besar"
      },
      {
        id: "dh_ss_1",
        category: "Soft Skills",
        text: "Percaya diri, komunikatif, dan mampu menginspirasi rekan kerja"
      },
      {
        id: "dh_ss_2",
        category: "Soft Skills",
        text: "Selalu tampil profesional, bersih, rapi, dan berwibawa sesuai perannya sebagai leader tertinggi di unit"
      },
      {
        id: "dh_ss_3",
        category: "Soft Skills",
        text: "Mampu bekerja sama, terbuka terhadap masukan, dan menyampaikan pendapat dengan adab"
      },
      {
        id: "dh_ss_4",
        category: "Soft Skills",
        text: "Mampu menyampaikan instruksi, evaluasi, dan arahan tim secara terstruktur, sabar, dan tetap tegas"
      },
      {
        id: "dh_ss_5",
        category: "Soft Skills",
        text: "Membangun komunikasi efektif dengan tim dan atasan"
      },
      {
        id: "dh_ss_6",
        category: "Soft Skills",
        text: "Menjadi penengah bila terjadi konflik atau perbedaan pandangan antar tim"
      },
      {
        id: "dh_ss_7",
        category: "Soft Skills",
        text: "Mampu menyampaikan umpan balik yang membina, menyatukan perbedaan pandangan dalam tim"
      },
      {
        id: "dh_ss_8",
        category: "Soft Skills",
        text: "Mampu menyatukan banyak gaya kepemimpinan di bawahnya dan menyampaikan evaluasi dengan kejelasan dan hikmah"
      },
      {
        id: "dh_ss_9",
        category: "Soft Skills",
        text: "Mahir dalam manajemen konflik dan negosiasi lintas unit"
      },
      {
        id: "dh_ss_10",
        category: "Soft Skills",
        text: "Mampu membangun tim yang solid dan mengembangkan potensi individu dalam tim"
      },
      {
        id: "dh_ss_11",
        category: "Soft Skills",
        text: "Memiliki kemampuan presentasi dan komunikasi publik yang excellent untuk menyampaikan visi dan strategi"
      },
      {
        id: "dh_ss_12",
        category: "Soft Skills",
        text: "Mampu memfasilitasi diskusi strategis dan mengambil keputusan yang tepat dalam situasi kompleks"
      },
      {
        id: "dh_ss_13",
        category: "Soft Skills",
        text: "Membangun jaringan kerja yang kuat dengan stakeholder internal dan eksternal"
      },
      {
        id: "dh_ss_14",
        category: "Soft Skills",
        text: "Memiliki charisma dan kemampuan mempengaruhi yang kuat untuk memimpin perubahan organisasi"
      },
      {
        id: "dh_ss_15",
        category: "Soft Skills",
        text: "Mampu menginspirasi dan memotivasi tim dalam skala besar serta membangun budaya kerja yang positif"
      },
      {
        id: "dh_ss_16",
        category: "Soft Skills",
        text: "Memiliki kemampuan komunikasi lintas divisi dan dapat membangun kolaborasi strategis"
      },
      {
        id: "dh_ss_17",
        category: "Soft Skills",
        text: "Mampu menjadi spokesperson perusahaan dan membangun citra positif organisasi"
      },
      {
        id: "dh_ss_18",
        category: "Soft Skills",
        text: "Memiliki kemampuan diplomasi tingkat tinggi dalam mengelola hubungan dengan stakeholder eksternal"
      },
      {
        id: "dh_ss_19",
        category: "Soft Skills",
        text: "Mampu memimpin transformasi budaya organisasi dan menciptakan lingkungan kerja yang inspiratif"
      },
      {
        id: "dh_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Menjadi pemecah masalah utama di unit"
      },
      {
        id: "dh_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu mengidentifikasi pola masalah berulang"
      },
      {
        id: "dh_ps_3",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu membaca tren permasalahan operasional dan SDM secara sistemik"
      },
      {
        id: "dh_ps_4",
        category: "Problem Solving & Analytical Thinking",
        text: "Menyampaikan solusi yang aplikatif dan realistis, baik secara lisan maupun dalam bentuk laporan harian kepada Area Manager"
      },
      {
        id: "dh_ps_5",
        category: "Problem Solving & Analytical Thinking",
        text: "Menganalisis akar penyebab, serta menyusun rekomendasi kebijakan teknis maupun prosedural dengan mempertimbangkan dampak jangka panjang"
      },
      {
        id: "dh_ps_6",
        category: "Problem Solving & Analytical Thinking",
        text: "Aktif menyampaikan saran yang membangun kepada atasan"
      },
      {
        id: "dh_ps_7",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu melakukan analisis strategis mendalam untuk mengidentifikasi peluang dan ancaman bisnis"
      },
      {
        id: "dh_ps_8",
        category: "Problem Solving & Analytical Thinking",
        text: "Memiliki kemampuan berpikir sistemik untuk memahami kompleksitas organisasi dan lingkungan bisnis"
      },
      {
        id: "dh_ps_9",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu mengantisipasi tantangan masa depan dan menyusun strategi mitigasi risiko"
      },
      {
        id: "dh_ps_10",
        category: "Problem Solving & Analytical Thinking",
        text: "Menguasai metodologi problem solving tingkat lanjut untuk menyelesaikan masalah kompleks lintas fungsi"
      },
      {
        id: "dh_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Berkomitmen terhadap budaya kerja Sedjati Grup: disiplin waktu, jujur, menjaga fasilitas kerja"
      },
      {
        id: "dh_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Aktif menunjukkan perilaku sesuai budaya Sedjati Grup: jujur, bersih, amanah, dan loyal"
      },
      {
        id: "dh_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi penjaga arah budaya Qurani di operasional"
      },
      {
        id: "dh_cf_4",
        category: "Culture Fit & Organizational Commitment",
        text: "Menumbuhkan semangat budaya kerja Qurani, disiplin, bersih, dan saling menguatkan"
      },
      {
        id: "dh_cf_5",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi contoh dalam menjaga waktu, kerapihan, serta etos kerja tim"
      },
      {
        id: "dh_cf_6",
        category: "Culture Fit & Organizational Commitment",
        text: "Menegakkan budaya kerja Sedjati Grup di dalam shift: jujur, bersih, amanah, disiplin, kolaboratif, dan loyal"
      },
      {
        id: "dh_cf_7",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga fasilitas kerja, semangat kebersamaan, dan menjaga reputasi tim"
      },
      {
        id: "dh_cf_8",
        category: "Culture Fit & Organizational Commitment",
        text: "Taat terhadap kebijakan, menjaga nama baik perusahaan, dan aktif dalam kegiatan tim"
      },
      {
        id: "dh_cf_9",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga konsistensi antara nilai perusahaan dan praktik kerja lapangan, serta mendorong loyalitas tim"
      },
      {
        id: "dh_cf_10",
        category: "Culture Fit & Organizational Commitment",
        text: "Menyatukan tim lintas shift dan store dalam satu semangat nilai: jujur, amanah, disiplin, bersih, kolaboratif, dan loyal"
      },
      {
        id: "dh_cf_11",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi duta budaya perusahaan di area yang dipimpinnya dan memastikan implementasi nilai-nilai perusahaan secara konsisten"
      },
      {
        id: "dh_cf_12",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi champion perubahan budaya dan memimpin inisiatif transformasi organisasi"
      },
      {
        id: "dh_cf_13",
        category: "Culture Fit & Organizational Commitment",
        text: "Memastikan keselarasan budaya organisasi di seluruh wilayah regional yang dipimpinnya"
      },
      {
        id: "dh_cf_14",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi penjaga visi dan misi organisasi serta memastikan implementasinya di seluruh lini"
      },
      {
        id: "dh_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi penyejuk tim, tidak menyalahkan orang lain, membiasakan teguran dengan hikmah"
      },
      {
        id: "dh_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Konsisten dalam menjaga shalat, adab kerja, dan interaksi"
      },
      {
        id: "dh_ae_3",
        category: "Akhlak & Etika Kerja Islami",
        text: "Tidak terlibat dalam konflik atau ghibah, dan menjaga niat kerja sebagai bagian dari ibadah"
      },
      {
        id: "dh_ae_4",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi figur panutan dalam adab interaksi vertikal maupun horizontal"
      },
      {
        id: "dh_ae_5",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi pembina adab kerja di berbagai lapisan"
      },
      {
        id: "dh_ae_6",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menyampaikan arahan dengan ketegasan yang lembut, menghindari konflik terbuka, dan menjaga ibadah serta ukhuwah"
      },
      {
        id: "dh_ae_7",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi teladan dalam penerapan prinsip-prinsip Islam dalam kepemimpinan dan manajemen konflik"
      },
      {
        id: "dh_ae_8",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menerapkan prinsip kepemimpinan Islam yang adil, bijaksana, dan penuh kasih sayang dalam mengelola tim regional"
      },
      {
        id: "dh_ae_9",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi rujukan spiritual dan moral bagi seluruh jajaran di wilayah regional"
      },
      {
        id: "dh_ae_10",
        category: "Akhlak & Etika Kerja Islami",
        text: "Memimpin dengan keteladanan dalam menjalankan nilai-nilai Islam dan menjadi inspirasi bagi seluruh organisasi"
      }
    ],
    section2: semangatSedjatiQuestions,
    section3: recommendationOptions,
    isActive: true,
    version: "2.1",
    createdAt: new Date().toISOString()
  }
];

// Template assessment telah lengkap untuk semua level 1-15 dengan bullet points yang sesuai rumus.md