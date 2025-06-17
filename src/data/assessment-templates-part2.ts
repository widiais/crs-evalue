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
        text: "Mampu menyusun dan membagi tugas operasional"
      },
      {
        id: "tl1_fc_2",
        category: "Functional Competency",
        text: "Menyelesaikan masalah teknis harian"
      },
      {
        id: "tl1_fc_3",
        category: "Functional Competency",
        text: "Melakukan kontrol kualitas hasil kerja tim"
      },
      {
        id: "tl1_fc_4",
        category: "Functional Competency",
        text: "Membuat laporan operasional sederhana"
      },
      {
        id: "tl1_fc_5",
        category: "Functional Competency",
        text: "Menjadi rujukan teknis bagi tim"
      },
      {
        id: "tl1_lm_1",
        category: "Leadership & Managerial",
        text: "Membagi tugas dan mengatur tim secara efisien"
      },
      {
        id: "tl1_lm_2",
        category: "Leadership & Managerial",
        text: "Mengontrol hasil kerja dan memberi evaluasi ke tim"
      },
      {
        id: "tl1_lm_3",
        category: "Leadership & Managerial",
        text: "Menyelesaikan konflik internal tim secara dewasa"
      },
      {
        id: "tl1_lm_4",
        category: "Leadership & Managerial",
        text: "Mendorong semangat dan motivasi anggota tim"
      },
      {
        id: "tl1_lm_5",
        category: "Leadership & Managerial",
        text: "Mengelola shift atau jadwal kerja tim"
      },
      {
        id: "tl1_ss_1",
        category: "Soft Skills",
        text: "Menyampaikan instruksi dengan jelas dan lugas"
      },
      {
        id: "tl1_ss_2",
        category: "Soft Skills",
        text: "Menjadi pendengar aktif bagi anggota tim"
      },
      {
        id: "tl1_ss_3",
        category: "Soft Skills",
        text: "Mampu membaca suasana dan karakter rekan kerja"
      },
      {
        id: "tl1_ss_4",
        category: "Soft Skills",
        text: "Menyampaikan kritik dengan cara membangun"
      },
      {
        id: "tl1_ss_5",
        category: "Soft Skills",
        text: "Mengelola tekanan sambil tetap menjaga interaksi positif"
      },
      {
        id: "tl1_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Menganalisis kendala tim dan menemukan solusi tepat"
      },
      {
        id: "tl1_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Membuat keputusan cepat dalam situasi mendesak"
      },
      {
        id: "tl1_ps_3",
        category: "Problem Solving & Analytical Thinking",
        text: "Menyusun langkah perbaikan teknis jangka pendek"
      },
      {
        id: "tl1_ps_4",
        category: "Problem Solving & Analytical Thinking",
        text: "Menyusun laporan kendala dan solusi kepada atasan"
      },
      {
        id: "tl1_ps_5",
        category: "Problem Solving & Analytical Thinking",
        text: "Menyusun solusi berdasar masukan tim"
      },
      {
        id: "tl1_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga budaya kerja di lingkup tim"
      },
      {
        id: "tl1_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Mengingatkan anggota tim jika melenceng dari nilai budaya"
      },
      {
        id: "tl1_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Memberikan contoh komitmen dan loyalitas kerja"
      },
      {
        id: "tl1_cf_4",
        category: "Culture Fit & Organizational Commitment",
        text: "Mendorong suasana kerja penuh semangat dan sinergi"
      },
      {
        id: "tl1_cf_5",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga kerjasama dan semangat kebersamaan"
      },
      {
        id: "tl1_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Membimbing anggota tim untuk menjaga adab kerja"
      },
      {
        id: "tl1_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menyampaikan teguran dengan cara islami dan santun"
      },
      {
        id: "tl1_ae_3",
        category: "Akhlak & Etika Kerja Islami",
        text: "Tidak berlaku pilih kasih dalam pembagian tugas"
      },
      {
        id: "tl1_ae_4",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjaga keadilan dan transparansi dalam kepemimpinan"
      },
      {
        id: "tl1_ae_5",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menunaikan amanah sebagai pemimpin kecil"
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
    description: "Assessment template untuk Team Leader 2 - pemimpin utama di unit tanpa Supervisor",
    section1: [
      {
        id: "tl2_fc_1",
        category: "Functional Competency",
        text: "Mengembangkan SOP kerja berdasarkan kebutuhan lapangan"
      },
      {
        id: "tl2_fc_2",
        category: "Functional Competency",
        text: "Menganalisis kendala operasional harian"
      },
      {
        id: "tl2_fc_3",
        category: "Functional Competency",
        text: "Memberikan coaching teknis kepada tim"
      },
      {
        id: "tl2_fc_4",
        category: "Functional Competency",
        text: "Membuat evaluasi harian dan mingguan"
      },
      {
        id: "tl2_fc_5",
        category: "Functional Competency",
        text: "Mengelola tools, stok, dan peralatan kerja secara efisien"
      },
      {
        id: "tl2_lm_1",
        category: "Leadership & Managerial",
        text: "Melakukan coaching harian kepada anggota tim"
      },
      {
        id: "tl2_lm_2",
        category: "Leadership & Managerial",
        text: "Menilai performa individu dalam tim"
      },
      {
        id: "tl2_lm_3",
        category: "Leadership & Managerial",
        text: "Mengelola dinamika tim dengan bijak dan adil"
      },
      {
        id: "tl2_lm_4",
        category: "Leadership & Managerial",
        text: "Memberikan pelaporan dan rekomendasi kepada atasan"
      },
      {
        id: "tl2_lm_5",
        category: "Leadership & Managerial",
        text: "Menjalankan fungsi kepemimpinan operasional"
      },
      {
        id: "tl2_ss_1",
        category: "Soft Skills",
        text: "Menjadi jembatan komunikasi antara tim dan atasan"
      },
      {
        id: "tl2_ss_2",
        category: "Soft Skills",
        text: "Melakukan briefing dengan gaya komunikatif yang menyenangkan"
      },
      {
        id: "tl2_ss_3",
        category: "Soft Skills",
        text: "Menyelesaikan konflik antar anggota secara profesional"
      },
      {
        id: "tl2_ss_4",
        category: "Soft Skills",
        text: "Mampu meredakan situasi yang menegangkan"
      },
      {
        id: "tl2_ss_5",
        category: "Soft Skills",
        text: "Menjadi teladan etika komunikasi tim"
      },
      {
        id: "tl2_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Melakukan evaluasi kendala berulang dan merumuskan solusi"
      },
      {
        id: "tl2_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Mengarahkan tim untuk menghindari kesalahan umum"
      },
      {
        id: "tl2_ps_3",
        category: "Problem Solving & Analytical Thinking",
        text: "Membuat sistem kerja preventif sederhana"
      },
      {
        id: "tl2_ps_4",
        category: "Problem Solving & Analytical Thinking",
        text: "Melibatkan anggota tim dalam proses problem solving"
      },
      {
        id: "tl2_ps_5",
        category: "Problem Solving & Analytical Thinking",
        text: "Mampu membaca pola masalah dari data harian"
      },
      {
        id: "tl2_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Menumbuhkan kebiasaan kerja sesuai budaya perusahaan"
      },
      {
        id: "tl2_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Menyelesaikan konflik internal tanpa merusak nilai tim"
      },
      {
        id: "tl2_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Membina karakter kerja anggota agar sesuai budaya"
      },
      {
        id: "tl2_cf_4",
        category: "Culture Fit & Organizational Commitment",
        text: "Mengintegrasikan nilai perusahaan dalam SOP harian"
      },
      {
        id: "tl2_cf_5",
        category: "Culture Fit & Organizational Commitment",
        text: "Melakukan penilaian attitude berbasis budaya"
      },
      {
        id: "tl2_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi penengah adil dalam konflik tim"
      },
      {
        id: "tl2_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menerapkan prinsip syura (musyawarah) dalam keputusan kecil"
      },
      {
        id: "tl2_ae_3",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjaga niat dan tujuan kerja agar tetap lurus"
      },
      {
        id: "tl2_ae_4",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menegur pelanggaran etika dengan pendekatan Islami"
      },
      {
        id: "tl2_ae_5",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menunjukkan konsistensi antara ucapan dan perbuatan"
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
    description: "Assessment template untuk Junior Supervisor - membina langsung Team Leader",
    section1: [
      {
        id: "jsup_fc_1",
        category: "Functional Competency",
        text: "Memonitor performa kerja tim dan individu"
      },
      {
        id: "jsup_fc_2",
        category: "Functional Competency",
        text: "Menerapkan perbaikan berkelanjutan (continuous improvement)"
      },
      {
        id: "jsup_fc_3",
        category: "Functional Competency",
        text: "Menyusun perencanaan shift mingguan"
      },
      {
        id: "jsup_fc_4",
        category: "Functional Competency",
        text: "Melakukan evaluasi pekerjaan berbasis data"
      },
      {
        id: "jsup_fc_5",
        category: "Functional Competency",
        text: "Membuat rencana tindak lanjut dari hasil evaluasi"
      },
      {
        id: "jsup_lm_1",
        category: "Leadership & Managerial",
        text: "Mampu menjadi pemimpin operasional harian"
      },
      {
        id: "jsup_lm_2",
        category: "Leadership & Managerial",
        text: "Menyusun perencanaan kerja tim mingguan"
      },
      {
        id: "jsup_lm_3",
        category: "Leadership & Managerial",
        text: "Menyampaikan arahan dan kebijakan dengan jelas"
      },
      {
        id: "jsup_lm_4",
        category: "Leadership & Managerial",
        text: "Melakukan evaluasi performa tim"
      },
      {
        id: "jsup_lm_5",
        category: "Leadership & Managerial",
        text: "Mendorong budaya kerja yang sehat dan produktif"
      },
      {
        id: "jsup_ss_1",
        category: "Soft Skills",
        text: "Menjalin komunikasi dua arah dengan tim dan atasan"
      },
      {
        id: "jsup_ss_2",
        category: "Soft Skills",
        text: "Mampu menyusun laporan dengan bahasa yang efektif"
      },
      {
        id: "jsup_ss_3",
        category: "Soft Skills",
        text: "Membimbing rekan dalam cara berkomunikasi profesional"
      },
      {
        id: "jsup_ss_4",
        category: "Soft Skills",
        text: "Menyampaikan evaluasi secara diplomatis"
      },
      {
        id: "jsup_ss_5",
        category: "Soft Skills",
        text: "Menjaga keseimbangan komunikasi formal & informal"
      },
      {
        id: "jsup_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Menyusun analisis performa mingguan tim"
      },
      {
        id: "jsup_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Membuat keputusan berdasar data dan observasi"
      },
      {
        id: "jsup_ps_3",
        category: "Problem Solving & Analytical Thinking",
        text: "Menggunakan metode sederhana untuk identifikasi akar masalah"
      },
      {
        id: "jsup_ps_4",
        category: "Problem Solving & Analytical Thinking",
        text: "Menyusun dan mengawasi pelaksanaan rencana perbaikan"
      },
      {
        id: "jsup_ps_5",
        category: "Problem Solving & Analytical Thinking",
        text: "Membuat laporan analitik yang jelas dan terstruktur"
      },
      {
        id: "jsup_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Membina budaya disiplin, sinergi, dan positif di unit kerja"
      },
      {
        id: "jsup_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Mendorong loyalitas dan semangat melalui pendekatan personal"
      },
      {
        id: "jsup_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga semangat tim saat menghadapi tekanan kerja"
      },
      {
        id: "jsup_cf_4",
        category: "Culture Fit & Organizational Commitment",
        text: "Membangun rasa bangga terhadap perusahaan"
      },
      {
        id: "jsup_cf_5",
        category: "Culture Fit & Organizational Commitment",
        text: "Menyusun agenda kegiatan budaya kerja (outbound, dll.)"
      },
      {
        id: "jsup_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menegakkan nilai kejujuran dan keadilan dalam evaluasi kerja"
      },
      {
        id: "jsup_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi contoh dalam menjalankan ibadah di waktu kerja"
      },
      {
        id: "jsup_ae_3",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menghindari praktek manipulasi data atau laporan"
      },
      {
        id: "jsup_ae_4",
        category: "Akhlak & Etika Kerja Islami",
        text: "Membangun suasana kerja yang penuh akhlak mulia"
      },
      {
        id: "jsup_ae_5",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menanamkan rasa tanggung jawab sebagai amanah"
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
    description: "Assessment template untuk Middle Supervisor - membina Junior Supervisor dan TL2",
    section1: [
      {
        id: "msup_fc_1",
        category: "Functional Competency",
        text: "Menyusun program peningkatan efisiensi kerja"
      },
      {
        id: "msup_fc_2",
        category: "Functional Competency",
        text: "Mengontrol penggunaan bahan/material dengan efisien"
      },
      {
        id: "msup_fc_3",
        category: "Functional Competency",
        text: "Menguasai sistem operasional digital yang digunakan perusahaan"
      },
      {
        id: "msup_fc_4",
        category: "Functional Competency",
        text: "Melakukan analisis performa berdasarkan KPI"
      },
      {
        id: "msup_fc_5",
        category: "Functional Competency",
        text: "Menangani insiden dan kendala kerja secara sistematis"
      },
      {
        id: "msup_lm_1",
        category: "Leadership & Managerial",
        text: "Memimpin tim dalam menjalankan target divisi"
      },
      {
        id: "msup_lm_2",
        category: "Leadership & Managerial",
        text: "Mengidentifikasi dan menyelesaikan kendala SDM"
      },
      {
        id: "msup_lm_3",
        category: "Leadership & Managerial",
        text: "Memberikan coaching mingguan dan evaluasi performa"
      },
      {
        id: "msup_lm_4",
        category: "Leadership & Managerial",
        text: "Menyusun jadwal, pembagian tugas, dan evaluasi hasil kerja"
      },
      {
        id: "msup_lm_5",
        category: "Leadership & Managerial",
        text: "Membina budaya kolaboratif antar bagian"
      },
      {
        id: "msup_ss_1",
        category: "Soft Skills",
        text: "Membina komunikasi lintas tim dan antar departemen"
      },
      {
        id: "msup_ss_2",
        category: "Soft Skills",
        text: "Membangun relasi kerja yang saling menghargai"
      },
      {
        id: "msup_ss_3",
        category: "Soft Skills",
        text: "Menjadi penengah yang objektif dalam konflik"
      },
      {
        id: "msup_ss_4",
        category: "Soft Skills",
        text: "Memberikan saran dan kritik secara solutif"
      },
      {
        id: "msup_ss_5",
        category: "Soft Skills",
        text: "Menjadi mentor dalam pengembangan soft skill rekan kerja"
      },
      {
        id: "msup_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Mengolah data operasional untuk deteksi tren negatif"
      },
      {
        id: "msup_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Mengembangkan sistem kerja berdasarkan hasil analisis"
      },
      {
        id: "msup_ps_3",
        category: "Problem Solving & Analytical Thinking",
        text: "Menyusun strategi perbaikan jangka menengah"
      },
      {
        id: "msup_ps_4",
        category: "Problem Solving & Analytical Thinking",
        text: "Membedakan masalah struktural dan insidental"
      },
      {
        id: "msup_ps_5",
        category: "Problem Solving & Analytical Thinking",
        text: "Mengelola proses pengambilan keputusan berbasis bukti"
      },
      {
        id: "msup_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Menyelaraskan budaya kerja tim dengan target perusahaan"
      },
      {
        id: "msup_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi penghubung budaya antara staf dan manajemen"
      },
      {
        id: "msup_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Membimbing TL dan staf tentang pentingnya budaya kerja"
      },
      {
        id: "msup_cf_4",
        category: "Culture Fit & Organizational Commitment",
        text: "Menegakkan budaya kerja dalam penilaian kinerja"
      },
      {
        id: "msup_cf_5",
        category: "Culture Fit & Organizational Commitment",
        text: "Membina loyalitas tim melalui pendekatan nilai"
      },
      {
        id: "msup_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadikan etika Islam sebagai dasar dalam keputusan"
      },
      {
        id: "msup_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Meluruskan niat kerja tim agar tidak hanya mengejar target duniawi"
      },
      {
        id: "msup_ae_3",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menyusun aturan kerja yang menjaga akhlak dan adab"
      },
      {
        id: "msup_ae_4",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menegur pelanggaran besar dengan cara profesional dan islami"
      },
      {
        id: "msup_ae_5",
        category: "Akhlak & Etika Kerja Islami",
        text: "Mendorong budaya mengingatkan dalam kebaikan di tim"
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
    description: "Assessment template untuk Senior Supervisor - pembina utama Junior dan Middle Supervisor",
    section1: [
      {
        id: "ssup_fc_1",
        category: "Functional Competency",
        text: "Merancang dan mengimplementasikan program kerja area"
      },
      {
        id: "ssup_fc_2",
        category: "Functional Competency",
        text: "Memberikan pelatihan teknis lintas divisi"
      },
      {
        id: "ssup_fc_3",
        category: "Functional Competency",
        text: "Membuat evaluasi dan rekomendasi kebijakan teknis"
      },
      {
        id: "ssup_fc_4",
        category: "Functional Competency",
        text: "Mengelola target dan performa outlet/tim secara menyeluruh"
      },
      {
        id: "ssup_fc_5",
        category: "Functional Competency",
        text: "Berkontribusi dalam pengembangan sistem operasional"
      },
      {
        id: "ssup_lm_1",
        category: "Leadership & Managerial",
        text: "Mempimpin unit kerja dalam skala lebih luas"
      },
      {
        id: "ssup_lm_2",
        category: "Leadership & Managerial",
        text: "Mengelola tim lintas shift atau cabang kecil"
      },
      {
        id: "ssup_lm_3",
        category: "Leadership & Managerial",
        text: "Menyusun perencanaan kerja bulanan"
      },
      {
        id: "ssup_lm_4",
        category: "Leadership & Managerial",
        text: "Menjadi role model dalam kepemimpinan yang adil dan efektif"
      },
      {
        id: "ssup_lm_5",
        category: "Leadership & Managerial",
        text: "Menerapkan sistem reward and punishment sederhana"
      },
      {
        id: "ssup_ss_1",
        category: "Soft Skills",
        text: "Memimpin forum dan rapat kecil secara efektif"
      },
      {
        id: "ssup_ss_2",
        category: "Soft Skills",
        text: "Mampu menyampaikan gagasan strategis secara meyakinkan"
      },
      {
        id: "ssup_ss_3",
        category: "Soft Skills",
        text: "Membangun budaya komunikasi positif di unit kerja"
      },
      {
        id: "ssup_ss_4",
        category: "Soft Skills",
        text: "Menjadi model interaksi sehat dan terbuka"
      },
      {
        id: "ssup_ss_5",
        category: "Soft Skills",
        text: "Menangani perbedaan pendapat secara dewasa"
      },
      {
        id: "ssup_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Mengidentifikasi masalah antar tim/departemen"
      },
      {
        id: "ssup_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Membuat evaluasi performa dan rekomendasi kebijakan"
      },
      {
        id: "ssup_ps_3",
        category: "Problem Solving & Analytical Thinking",
        text: "Mengelola proyek improvement teknis tim"
      },
      {
        id: "ssup_ps_4",
        category: "Problem Solving & Analytical Thinking",
        text: "Membuat analisa SWOT sederhana untuk unit kerja"
      },
      {
        id: "ssup_ps_5",
        category: "Problem Solving & Analytical Thinking",
        text: "Menjadi referensi solusi untuk TL dan Supervisor lain"
      },
      {
        id: "ssup_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjaga konsistensi budaya kerja di beberapa unit"
      },
      {
        id: "ssup_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Menginternalisasi nilai perusahaan dalam rencana kerja"
      },
      {
        id: "ssup_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi teladan dalam menjaga nilai budaya organisasi"
      },
      {
        id: "ssup_cf_4",
        category: "Culture Fit & Organizational Commitment",
        text: "Membuat program penguatan budaya tim"
      },
      {
        id: "ssup_cf_5",
        category: "Culture Fit & Organizational Commitment",
        text: "Melakukan monitoring sikap dan loyalitas kerja"
      },
      {
        id: "ssup_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menginternalisasi nilai Islam dalam kebijakan unit kerja"
      },
      {
        id: "ssup_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi teladan akhlak kerja islami untuk bawahan dan rekan"
      },
      {
        id: "ssup_ae_3",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menolak praktik kerja yang melanggar prinsip agama"
      },
      {
        id: "ssup_ae_4",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjaga hak-hak anggota tim dalam setiap keputusan"
      },
      {
        id: "ssup_ae_5",
        category: "Akhlak & Etika Kerja Islami",
        text: "Mengajak tim untuk menjaga ibadah dan akhlak di sela kesibukan"
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
    description: "Assessment template untuk Junior Manager - memimpin area kerja dengan amanah dan keterhubungan",
    section1: [
      {
        id: "jmgr_fc_1",
        category: "Functional Competency",
        text: "Membuat strategi peningkatan performa tim"
      },
      {
        id: "jmgr_fc_2",
        category: "Functional Competency",
        text: "Menyusun anggaran operasional (budgeting) teknis"
      },
      {
        id: "jmgr_fc_3",
        category: "Functional Competency",
        text: "Menilai kebutuhan training teknis tim"
      },
      {
        id: "jmgr_fc_4",
        category: "Functional Competency",
        text: "Membangun sinergi antar departemen dalam aspek teknis"
      },
      {
        id: "jmgr_fc_5",
        category: "Functional Competency",
        text: "Menganalisis tren performa operasional untuk improvement"
      },
      {
        id: "jmgr_lm_1",
        category: "Leadership & Managerial",
        text: "Memimpin satuan kerja secara menyeluruh"
      },
      {
        id: "jmgr_lm_2",
        category: "Leadership & Managerial",
        text: "Membangun strategi tim berdasarkan target perusahaan"
      },
      {
        id: "jmgr_lm_3",
        category: "Leadership & Managerial",
        text: "Menyusun sistem evaluasi dan pelatihan SDM"
      },
      {
        id: "jmgr_lm_4",
        category: "Leadership & Managerial",
        text: "Membina calon pemimpin (talent development)"
      },
      {
        id: "jmgr_lm_5",
        category: "Leadership & Managerial",
        text: "Mengatur sinergi antar unit dalam satuan kerja"
      },
      {
        id: "jmgr_ss_1",
        category: "Soft Skills",
        text: "Menyampaikan arahan dan keputusan dengan penuh wibawa"
      },
      {
        id: "jmgr_ss_2",
        category: "Soft Skills",
        text: "Memberi motivasi verbal yang menyentuh tim"
      },
      {
        id: "jmgr_ss_3",
        category: "Soft Skills",
        text: "Menangani keluhan tim dengan pendekatan komunikatif"
      },
      {
        id: "jmgr_ss_4",
        category: "Soft Skills",
        text: "Memfasilitasi diskusi untuk mencari solusi bersama"
      },
      {
        id: "jmgr_ss_5",
        category: "Soft Skills",
        text: "Meningkatkan kepercayaan diri tim melalui pendekatan manusiawi"
      },
      {
        id: "jmgr_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Menyusun strategi solusi berbasis data lintas tim"
      },
      {
        id: "jmgr_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Menganalisis performa tim dengan alat evaluasi manajerial"
      },
      {
        id: "jmgr_ps_3",
        category: "Problem Solving & Analytical Thinking",
        text: "Menyusun target berbasis masalah riil di lapangan"
      },
      {
        id: "jmgr_ps_4",
        category: "Problem Solving & Analytical Thinking",
        text: "Menyusun alur pengambilan keputusan tim"
      },
      {
        id: "jmgr_ps_5",
        category: "Problem Solving & Analytical Thinking",
        text: "Menyusun sistem monitoring berbasis indikator"
      },
      {
        id: "jmgr_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Menyusun sistem kerja dan evaluasi berbasis nilai budaya"
      },
      {
        id: "jmgr_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Mempromosikan nilai perusahaan ke seluruh staf di unitnya"
      },
      {
        id: "jmgr_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Mendorong ketaatan budaya di seluruh rantai manajerial bawahannya"
      },
      {
        id: "jmgr_cf_4",
        category: "Culture Fit & Organizational Commitment",
        text: "Menyelaraskan budaya kerja dengan target kinerja"
      },
      {
        id: "jmgr_cf_5",
        category: "Culture Fit & Organizational Commitment",
        text: "Memberikan intervensi budaya saat tim mulai melenceng"
      },
      {
        id: "jmgr_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menanamkan nilai-nilai Islam dalam kepemimpinan sehari-hari"
      },
      {
        id: "jmgr_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Mengedepankan etika dalam pengambilan keputusan manajerial"
      },
      {
        id: "jmgr_ae_3",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi pendamai dalam konflik kerja secara hikmah"
      },
      {
        id: "jmgr_ae_4",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menyusun aturan atau sistem kerja berbasis nilai amanah dan adil"
      },
      {
        id: "jmgr_ae_5",
        category: "Akhlak & Etika Kerja Islami",
        text: "Memberikan reward & punishment dengan pendekatan etis"
      }
    ],
    section2: semangatSedjatiQuestions,
    section3: recommendationOptions,
    isActive: true,
    version: "2.1",
    createdAt: new Date().toISOString()
  }
]; 