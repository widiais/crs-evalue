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
        text: "Memahami SOP dasar kerja"
      },
      {
        id: "magang_fc_2",
        category: "Functional Competency",
        text: "Mengikuti instruksi kerja dengan baik"
      },
      {
        id: "magang_fc_3",
        category: "Functional Competency",
        text: "Menguasai alat kerja dasar"
      },
      {
        id: "magang_fc_4",
        category: "Functional Competency",
        text: "Disiplin dan hadir tepat waktu"
      },
      {
        id: "magang_fc_5",
        category: "Functional Competency",
        text: "Bertanya saat tidak paham"
      },
      {
        id: "magang_lm_1",
        category: "Leadership & Managerial",
        text: "Mampu bekerja sama dalam tim"
      },
      {
        id: "magang_lm_2",
        category: "Leadership & Managerial",
        text: "Menerima arahan dengan sikap positif"
      },
      {
        id: "magang_lm_3",
        category: "Leadership & Managerial",
        text: "Menunjukkan sikap hormat pada atasan dan rekan"
      },
      {
        id: "magang_lm_4",
        category: "Leadership & Managerial",
        text: "Bersikap aktif dalam tugas kelompok"
      },
      {
        id: "magang_lm_5",
        category: "Leadership & Managerial",
        text: "Menunjukkan tanggung jawab pribadi terhadap tugas"
      },
      {
        id: "magang_ss_1",
        category: "Soft Skills",
        text: "Berkomunikasi dengan sopan dan jelas"
      },
      {
        id: "magang_ss_2",
        category: "Soft Skills",
        text: "Mampu mendengarkan instruksi dengan baik"
      },
      {
        id: "magang_ss_3",
        category: "Soft Skills",
        text: "Tidak mudah tersinggung saat ditegur"
      },
      {
        id: "magang_ss_4",
        category: "Soft Skills",
        text: "Ramah dalam berinteraksi dengan tim"
      },
      {
        id: "magang_ss_5",
        category: "Soft Skills",
        text: "Menghindari konflik personal di tempat kerja"
      },
      {
        id: "magang_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Mengenali kesalahan kecil dalam pekerjaan"
      },
      {
        id: "magang_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Bertanya saat menemui kendala"
      },
      {
        id: "magang_ps_3",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu mencari solusi dasar dengan bantuan"
      },
      {
        id: "magang_ps_4",
        category: "Problem Solving & Analytical Thinking",
        text: "Tidak mengulangi kesalahan yang sama"
      },
      {
        id: "magang_ps_5",
        category: "Problem Solving & Analytical Thinking",
        text: "Bersikap terbuka terhadap perbaikan"
      },
      {
        id: "magang_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Mematuhi SOP dan peraturan kerja dasar"
      },
      {
        id: "magang_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Menunjukkan sikap sopan dan hormat sesuai budaya perusahaan"
      },
      {
        id: "magang_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Hadir tepat waktu dan bertanggung jawab pada jadwal"
      },
      {
        id: "magang_cf_4",
        category: "Culture Fit & Organizational Commitment",
        text: "Mau mengikuti arahan tanpa membantah"
      },
      {
        id: "magang_cf_5",
        category: "Culture Fit & Organizational Commitment",
        text: "Menunjukkan ketertarikan terhadap nilai-nilai perusahaan"
      },
      {
        id: "magang_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Bersikap jujur dalam menjalankan tugas kecil"
      },
      {
        id: "magang_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Mengucapkan salam dan beradab kepada atasan dan rekan"
      },
      {
        id: "magang_ae_3",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjaga kebersihan diri dan area kerja"
      },
      {
        id: "magang_ae_4",
        category: "Akhlak & Etika Kerja Islami",
        text: "Tidak berkata kasar atau menyebar gosip"
      },
      {
        id: "magang_ae_5",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menunjukkan rasa hormat kepada sesama"
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
        text: "Memahami alur kerja dan tugas utama"
      },
      {
        id: "training_fc_2",
        category: "Functional Competency",
        text: "Mampu menjalankan tugas dengan supervisi"
      },
      {
        id: "training_fc_3",
        category: "Functional Competency",
        text: "Menunjukkan kemauan belajar tinggi"
      },
      {
        id: "training_fc_4",
        category: "Functional Competency",
        text: "Melakukan simulasi kerja dengan benar"
      },
      {
        id: "training_fc_5",
        category: "Functional Competency",
        text: "Mengenali standar kualitas produk/jasa"
      },
      {
        id: "training_lm_1",
        category: "Leadership & Managerial",
        text: "Mengatur waktu kerja pribadi dengan baik"
      },
      {
        id: "training_lm_2",
        category: "Leadership & Managerial",
        text: "Mulai menunjukkan inisiatif dalam membantu rekan"
      },
      {
        id: "training_lm_3",
        category: "Leadership & Managerial",
        text: "Berani menyampaikan ide di lingkungan kecil"
      },
      {
        id: "training_lm_4",
        category: "Leadership & Managerial",
        text: "Responsif terhadap instruksi supervisor"
      },
      {
        id: "training_lm_5",
        category: "Leadership & Managerial",
        text: "Mau menerima dan belajar dari umpan balik"
      },
      {
        id: "training_ss_1",
        category: "Soft Skills",
        text: "Menunjukkan empati kepada rekan kerja"
      },
      {
        id: "training_ss_2",
        category: "Soft Skills",
        text: "Mau menerima kritik dan saran dengan sikap positif"
      },
      {
        id: "training_ss_3",
        category: "Soft Skills",
        text: "Bekerja sama dengan berbagai karakter orang"
      },
      {
        id: "training_ss_4",
        category: "Soft Skills",
        text: "Mampu menyampaikan pendapat sederhana secara asertif"
      },
      {
        id: "training_ss_5",
        category: "Soft Skills",
        text: "Memiliki kontrol emosi dasar saat tertekan"
      },
      {
        id: "training_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Menjelaskan kendala yang dihadapi secara jelas"
      },
      {
        id: "training_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Mengusulkan solusi sederhana atas masalah harian"
      },
      {
        id: "training_ps_3",
        category: "Problem Solving & Analytical Thinking",
        text: "Belajar dari contoh atau instruksi supervisor"
      },
      {
        id: "training_ps_4",
        category: "Problem Solving & Analytical Thinking",
        text: "Menyadari hubungan sebab-akibat dasar"
      },
      {
        id: "training_ps_5",
        category: "Problem Solving & Analytical Thinking",
        text: "Menunjukkan keinginan memahami akar masalah"
      },
      {
        id: "training_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjalankan tugas sesuai arahan dan etika kerja"
      },
      {
        id: "training_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Mampu beradaptasi dengan lingkungan dan ritme kerja"
      },
      {
        id: "training_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga sikap profesional meski masih belajar"
      },
      {
        id: "training_cf_4",
        category: "Culture Fit & Organizational Commitment",
        text: "Tertib dan rapi dalam penampilan sesuai standar"
      },
      {
        id: "training_cf_5",
        category: "Culture Fit & Organizational Commitment",
        text: "Antusias mengikuti arahan serta pelatihan"
      },
      {
        id: "training_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjalankan instruksi kerja dengan amanah"
      },
      {
        id: "training_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menepati waktu dan janji saat diberikan tugas"
      },
      {
        id: "training_ae_3",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menghindari sikap malas atau menunda pekerjaan"
      },
      {
        id: "training_ae_4",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjaga tutur kata sesuai adab Islam"
      },
      {
        id: "training_ae_5",
        category: "Akhlak & Etika Kerja Islami",
        text: "Berusaha menjalankan nilai kerja Islami dalam kegiatan harian"
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
        text: "Mengerjakan tugas mandiri sesuai SOP"
      },
      {
        id: "member_fc_2",
        category: "Functional Competency",
        text: "Konsisten menjaga standar kerja harian"
      },
      {
        id: "member_fc_3",
        category: "Functional Competency",
        text: "Bisa menyelesaikan tugas tanpa diawasi terus-menerus"
      },
      {
        id: "member_fc_4",
        category: "Functional Competency",
        text: "Bisa membantu rekan kerja"
      },
      {
        id: "member_fc_5",
        category: "Functional Competency",
        text: "Memahami fungsi kerja antar divisi"
      },
      {
        id: "member_lm_1", 
        category: "Leadership & Managerial",
        text: "Disiplin dan konsisten dalam menyelesaikan tugas"
      },
      {
        id: "member_lm_2", 
        category: "Leadership & Managerial",
        text: "Menjadi contoh positif dalam kedisiplinan dan etika kerja"
      },
      {
        id: "member_lm_3", 
        category: "Leadership & Managerial",
        text: "Menunjukkan inisiatif dalam tugas tambahan"
      },
      {
        id: "member_lm_4", 
        category: "Leadership & Managerial",
        text: "Berkontribusi dalam menjaga kekompakan tim"
      },
      {
        id: "member_lm_5", 
        category: "Leadership & Managerial",
        text: "Mulai menunjukkan kepemimpinan di lingkup kecil"
      },
      {
        id: "member_ss_1",
        category: "Soft Skills",
        text: "Mampu menjaga komunikasi yang baik dalam tim"
      },
      {
        id: "member_ss_2",
        category: "Soft Skills",
        text: "Berinisiatif membantu tanpa diminta"
      },
      {
        id: "member_ss_3",
        category: "Soft Skills",
        text: "Menyampaikan pendapat dengan sikap sopan"
      },
      {
        id: "member_ss_4",
        category: "Soft Skills",
        text: "Tidak menyebarkan gosip atau hal negatif"
      },
      {
        id: "member_ss_5",
        category: "Soft Skills",
        text: "Menerapkan etika kerja dasar dalam berinteraksi"
      },
      {
        id: "member_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu menyelesaikan masalah rutin secara mandiri"
      },
      {
        id: "member_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Menggunakan logika sederhana dalam mengambil tindakan"
      },
      {
        id: "member_ps_3",
        category: "Problem Solving & Analytical Thinking",
        text: "Tidak mudah panik saat menghadapi kendala"
      },
      {
        id: "member_ps_4",
        category: "Problem Solving & Analytical Thinking",
        text: "Menyampaikan ide solusi kepada rekan kerja"
      },
      {
        id: "member_ps_5",
        category: "Problem Solving & Analytical Thinking",
        text: "Belajar dari kesalahan untuk perbaikan berkelanjutan"
      },
      {
        id: "member_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Menunjukkan komitmen terhadap standar kerja harian"
      },
      {
        id: "member_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga nama baik perusahaan di dalam dan luar kerja"
      },
      {
        id: "member_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Mengikuti budaya kerja seperti briefing, absensi, evaluasi"
      },
      {
        id: "member_cf_4",
        category: "Culture Fit & Organizational Commitment",
        text: "Konsisten menerapkan nilai-nilai budaya kerja"
      },
      {
        id: "member_cf_5",
        category: "Culture Fit & Organizational Commitment",
        text: "Bersikap positif dan menjaga suasana tim"
      },
      {
        id: "member_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Bekerja dengan tanggung jawab dan niat ibadah"
      },
      {
        id: "member_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Jujur dalam laporan dan pelaksanaan tugas"
      },
      {
        id: "member_ae_3",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjaga lisan dari ghibah, fitnah, atau adu domba"
      },
      {
        id: "member_ae_4",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menunaikan tugas tanpa banyak alasan"
      },
      {
        id: "member_ae_5",
        category: "Akhlak & Etika Kerja Islami",
        text: "Bersikap sabar dan tidak reaktif terhadap tekanan kerja"
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
        text: "Mampu melakukan multitasking pekerjaan dasar"
      },
      {
        id: "star_fc_2",
        category: "Functional Competency",
        text: "Memberikan hasil kerja yang konsisten"
      },
      {
        id: "star_fc_3",
        category: "Functional Competency",
        text: "Menyampaikan ide atau saran untuk efisiensi kerja"
      },
      {
        id: "star_fc_4",
        category: "Functional Competency",
        text: "Menjadi contoh kedisiplinan bagi member lain"
      },
      {
        id: "star_fc_5",
        category: "Functional Competency",
        text: "Memahami dampak kerja terhadap kepuasan pelanggan"
      },
      {
        id: "star_lm_1",
        category: "Leadership & Managerial",
        text: "Menjadi panutan bagi rekan setim dalam sikap kerja"
      },
      {
        id: "star_lm_2",
        category: "Leadership & Managerial",
        text: "Mampu mengambil alih tugas saat tim kekurangan orang"
      },
      {
        id: "star_lm_3",
        category: "Leadership & Managerial",
        text: "Menyelesaikan konflik kecil antar rekan dengan bijak"
      },
      {
        id: "star_lm_4",
        category: "Leadership & Managerial",
        text: "Membimbing rekan baru secara informal"
      },
      {
        id: "star_lm_5",
        category: "Leadership & Managerial",
        text: "Mengatur ritme kerja pribadi dan tim kecil"
      },
      {
        id: "star_ss_1",
        category: "Soft Skills",
        text: "Menjadi contoh dalam komunikasi santun di tim"
      },
      {
        id: "star_ss_2",
        category: "Soft Skills",
        text: "Menunjukkan kepedulian saat ada rekan dalam kesulitan"
      },
      {
        id: "star_ss_3",
        category: "Soft Skills",
        text: "Berani menyampaikan ide secara efektif"
      },
      {
        id: "star_ss_4",
        category: "Soft Skills",
        text: "Menahan emosi dan menyampaikan ketidaksetujuan secara baik"
      },
      {
        id: "star_ss_5",
        category: "Soft Skills",
        text: "Menjaga semangat kerja tim lewat interaksi positif"
      },
      {
        id: "star_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu menganalisis masalah teknis ringan"
      },
      {
        id: "star_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Mencari penyebab dari kendala yang berulang"
      },
      {
        id: "star_ps_3",
        category: "Problem Solving & Analytical Thinking",
        text: "Mencari referensi atau bertanya untuk solusi"
      },
      {
        id: "star_ps_4",
        category: "Problem Solving & Analytical Thinking",
        text: "Membuat alternatif solusi berdasarkan pengalaman"
      },
      {
        id: "star_ps_5",
        category: "Problem Solving & Analytical Thinking",
        text: "Mengusulkan perbaikan operasional kecil"
      },
      {
        id: "star_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi contoh dalam disiplin dan kepatuhan SOP"
      },
      {
        id: "star_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Menunjukkan kesetiaan terhadap perusahaan saat tim dalam tekanan"
      },
      {
        id: "star_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Berperan aktif dalam kegiatan budaya perusahaan (outing, pelatihan, dll.)"
      },
      {
        id: "star_cf_4",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi penyemangat saat tim mengalami penurunan performa"
      },
      {
        id: "star_cf_5",
        category: "Culture Fit & Organizational Commitment",
        text: "Membantu menjaga kestabilan kerja tim"
      },
      {
        id: "star_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi contoh dalam adab dan perilaku baik di tim"
      },
      {
        id: "star_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Memberikan nasihat yang baik dan santun kepada rekan"
      },
      {
        id: "star_ae_3",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjaga amanah pekerjaan dari awal hingga akhir"
      },
      {
        id: "star_ae_4",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menghindari praktik manipulatif dalam bekerja"
      },
      {
        id: "star_ae_5",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjalankan tugas dengan penuh integritas"
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
        text: "Mahir menguasai seluruh proses kerja divisinya"
      },
      {
        id: "allstar_fc_2",
        category: "Functional Competency",
        text: "Menjadi role model dalam keterampilan teknis"
      },
      {
        id: "allstar_fc_3",
        category: "Functional Competency",
        text: "Memberikan kontribusi pada pencapaian target tim"
      },
      {
        id: "allstar_fc_4",
        category: "Functional Competency",
        text: "Melatih dan membimbing anggota baru"
      },
      {
        id: "allstar_fc_5",
        category: "Functional Competency",
        text: "Mengidentifikasi area perbaikan di area kerja"
      },
      {
        id: "allstar_lm_1",
        category: "Leadership & Managerial",
        text: "Dapat memimpin kerja kelompok kecil"
      },
      {
        id: "allstar_lm_2",
        category: "Leadership & Managerial",
        text: "Memberikan arahan teknis secara jelas dan tepat"
      },
      {
        id: "allstar_lm_3",
        category: "Leadership & Managerial",
        text: "Menjadi penghubung antara anggota tim dan atasan"
      },
      {
        id: "allstar_lm_4",
        category: "Leadership & Managerial",
        text: "Membangun suasana kerja positif di tim"
      },
      {
        id: "allstar_lm_5",
        category: "Leadership & Managerial",
        text: "Memberikan umpan balik kepada rekan secara bijak"
      },
      {
        id: "allstar_ss_1",
        category: "Soft Skills",
        text: "Menjadi penghubung komunikasi antar rekan"
      },
      {
        id: "allstar_ss_2",
        category: "Soft Skills",
        text: "Menunjukkan sikap bijak dalam merespons konflik kecil"
      },
      {
        id: "allstar_ss_3",
        category: "Soft Skills",
        text: "Aktif mendorong kekompakan tim"
      },
      {
        id: "allstar_ss_4",
        category: "Soft Skills",
        text: "Memberikan feedback yang membangun"
      },
      {
        id: "allstar_ss_5",
        category: "Soft Skills",
        text: "Dapat membangun hubungan positif lintas shift"
      },
      {
        id: "allstar_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu memecahkan masalah tanpa menunggu instruksi"
      },
      {
        id: "allstar_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Membandingkan beberapa solusi sebelum bertindak"
      },
      {
        id: "allstar_ps_3",
        category: "Problem Solving & Analytical Thinking",
        text: "Memberikan saran perbaikan berbasis pengalaman"
      },
      {
        id: "allstar_ps_4",
        category: "Problem Solving & Analytical Thinking",
        text: "Mendeteksi potensi masalah sebelum terjadi"
      },
      {
        id: "allstar_ps_5",
        category: "Problem Solving & Analytical Thinking",
        text: "Memberikan kontribusi pada peningkatan sistem kerja tim"
      },
      {
        id: "allstar_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi agen budaya kerja yang positif"
      },
      {
        id: "allstar_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Mempromosikan nilai-nilai perusahaan dalam keseharian"
      },
      {
        id: "allstar_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Membantu rekan baru memahami budaya kerja"
      },
      {
        id: "allstar_cf_4",
        category: "Culture Fit & Organizational Commitment",
        text: "Menolak praktik negatif (gosip, manipulasi, dll.)"
      },
      {
        id: "allstar_cf_5",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga keharmonisan dan moral kerja tim"
      },
      {
        id: "allstar_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menunjukkan akhlak terpuji meski dalam tekanan"
      },
      {
        id: "allstar_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Memberikan keteladanan dalam beribadah di waktu kerja"
      },
      {
        id: "allstar_ae_3",
        category: "Akhlak & Etika Kerja Islami",
        text: "Tidak mengambil keuntungan pribadi dari tugas tim"
      },
      {
        id: "allstar_ae_4",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjaga hubungan kerja tanpa unsur permusuhan"
      },
      {
        id: "allstar_ae_5",
        category: "Akhlak & Etika Kerja Islami",
        text: "Mengingatkan rekan dengan cara yang hikmah dan lembut"
      }
    ],
    section2: semangatSedjatiQuestions,
    section3: recommendationOptions,
    isActive: true,
    version: "2.1",
    createdAt: new Date().toISOString()
  }
];

// Template assessment telah lengkap untuk semua level 1-5 dengan bullet points yang sesuai rumus.md