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
        text: "Mengelola multiple business units dengan P&L responsibility"
      },
      {
        id: "mmgr_fc_2",
        category: "Functional Competency",
        text: "Menyusun long-term strategic planning untuk divisi"
      },
      {
        id: "mmgr_fc_3",
        category: "Functional Competency",
        text: "Mengimplementasikan corporate strategy di level regional"
      },
      {
        id: "mmgr_fc_4",
        category: "Functional Competency",
        text: "Mengelola portfolio project dan investment decision"
      },
      {
        id: "mmgr_fc_5",
        category: "Functional Competency",
        text: "Mengoptimalkan resource allocation lintas business unit"
      },
      {
        id: "mmgr_lm_1",
        category: "Leadership & Managerial",
        text: "Memimpin organizational transformation di level menengah"
      },
      {
        id: "mmgr_lm_2",
        category: "Leadership & Managerial",
        text: "Mengembangkan next-generation leaders untuk posisi strategis"
      },
      {
        id: "mmgr_lm_3",
        category: "Leadership & Managerial",
        text: "Membuat strategic decision dengan impact jangka panjang"
      },
      {
        id: "mmgr_lm_4",
        category: "Leadership & Managerial",
        text: "Mengelola complex stakeholder management"
      },
      {
        id: "mmgr_lm_5",
        category: "Leadership & Managerial",
        text: "Membangun high-performance organization culture"
      },
      {
        id: "mmgr_ss_1",
        category: "Soft Skills",
        text: "Menjalin strategic partnership dengan eksternal stakeholder"
      },
      {
        id: "mmgr_ss_2",
        category: "Soft Skills",
        text: "Membangun influence dan network untuk business development"
      },
      {
        id: "mmgr_ss_3",
        category: "Soft Skills",
        text: "Menyampaikan corporate vision dengan inspiring communication"
      },
      {
        id: "mmgr_ss_4",
        category: "Soft Skills",
        text: "Memfasilitasi strategic dialogue lintas business unit"
      },
      {
        id: "mmgr_ss_5",
        category: "Soft Skills",
        text: "Mengembangkan thought leadership dalam industri"
      },
      {
        id: "mmgr_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Menganalisis market trend dan competitive landscape"
      },
      {
        id: "mmgr_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Mengembangkan strategic framework untuk complex problem"
      },
      {
        id: "mmgr_ps_3",
        category: "Problem Solving & Analytical Thinking",
        text: "Mengelola strategic risk dengan comprehensive approach"
      },
      {
        id: "mmgr_ps_4",
        category: "Problem Solving & Analytical Thinking",
        text: "Menciptakan breakthrough innovation untuk growth"
      },
      {
        id: "mmgr_ps_5",
        category: "Problem Solving & Analytical Thinking",
        text: "Mengoptimalkan business model dengan data-driven insight"
      },
      {
        id: "mmgr_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi culture architect dalam corporate transformation"
      },
      {
        id: "mmgr_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Mengintegrasikan corporate values dalam strategic execution"
      },
      {
        id: "mmgr_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Membangun culture of excellence dan continuous innovation"
      },
      {
        id: "mmgr_cf_4",
        category: "Culture Fit & Organizational Commitment",
        text: "Menyelaraskan local culture dengan global corporate standard"
      },
      {
        id: "mmgr_cf_5",
        category: "Culture Fit & Organizational Commitment",
        text: "Mengukur dan meningkatkan organizational health metrics"
      },
      {
        id: "mmgr_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Memimpin dengan prinsip stewardship dan khalifah dalam bisnis"
      },
      {
        id: "mmgr_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Mengintegrasikan Islamic values dalam corporate governance"
      },
      {
        id: "mmgr_ae_3",
        category: "Akhlak & Etika Kerja Islami",
        text: "Memastikan sustainable business practices sesuai syariat"
      },
      {
        id: "mmgr_ae_4",
        category: "Akhlak & Etika Kerja Islami",
        text: "Membina ecosystem bisnis yang membawa berkah"
      },
      {
        id: "mmgr_ae_5",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi role model dalam leadership Islami di korporasi"
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
        text: "Mengelola enterprise-wide strategic initiative"
      },
      {
        id: "smgr_fc_2",
        category: "Functional Competency",
        text: "Menyusun corporate strategic roadmap jangka panjang"
      },
      {
        id: "smgr_fc_3",
        category: "Functional Competency",
        text: "Mengoptimalkan corporate performance dan shareholder value"
      },
      {
        id: "smgr_fc_4",
        category: "Functional Competency",
        text: "Mengelola merger, acquisition, dan strategic partnership"
      },
      {
        id: "smgr_fc_5",
        category: "Functional Competency",
        text: "Membangun competitive advantage yang sustainable"
      },
      {
        id: "smgr_lm_1",
        category: "Leadership & Managerial",
        text: "Memimpin enterprise transformation dan digital modernization"
      },
      {
        id: "smgr_lm_2",
        category: "Leadership & Managerial",
        text: "Mengembangkan C-level leadership pipeline"
      },
      {
        id: "smgr_lm_3",
        category: "Leadership & Managerial",
        text: "Membuat corporate decision dengan strategic impact"
      },
      {
        id: "smgr_lm_4",
        category: "Leadership & Managerial",
        text: "Mengelola board relationship dan investor communication"
      },
      {
        id: "smgr_lm_5",
        category: "Leadership & Managerial",
        text: "Membangun world-class organization capability"
      },
      {
        id: "smgr_ss_1",
        category: "Soft Skills",
        text: "Menjalin strategic alliance dengan global partner"
      },
      {
        id: "smgr_ss_2",
        category: "Soft Skills",
        text: "Membangun corporate brand dan reputation management"
      },
      {
        id: "smgr_ss_3",
        category: "Soft Skills",
        text: "Menyampaikan corporate message dengan executive presence"
      },
      {
        id: "smgr_ss_4",
        category: "Soft Skills",
        text: "Memfasilitasi strategic conversation dengan key stakeholder"
      },
      {
        id: "smgr_ss_5",
        category: "Soft Skills",
        text: "Mengembangkan industry leadership dan thought influence"
      },
      {
        id: "smgr_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Menganalisis macro environment dan future scenario planning"
      },
      {
        id: "smgr_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Mengembangkan strategic option dan contingency planning"
      },
      {
        id: "smgr_ps_3",
        category: "Problem Solving & Analytical Thinking",
        text: "Mengelola enterprise risk dan crisis management"
      },
      {
        id: "smgr_ps_4",
        category: "Problem Solving & Analytical Thinking",
        text: "Menciptakan disruptive innovation dan new business model"
      },
      {
        id: "smgr_ps_5",
        category: "Problem Solving & Analytical Thinking",
        text: "Mengoptimalkan corporate strategy dengan advanced analytics"
      },
      {
        id: "smgr_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi chief culture officer dalam corporate evolution"
      },
      {
        id: "smgr_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Mengintegrasikan purpose dan values dalam business strategy"
      },
      {
        id: "smgr_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Membangun legacy culture untuk generasi mendatang"
      },
      {
        id: "smgr_cf_4",
        category: "Culture Fit & Organizational Commitment",
        text: "Menyelaraskan stakeholder values dengan corporate mission"
      },
      {
        id: "smgr_cf_5",
        category: "Culture Fit & Organizational Commitment",
        text: "Mengukur dan meningkatkan corporate social impact"
      },
      {
        id: "smgr_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Memimpin dengan filosofi rahmatan lil alameen dalam bisnis"
      },
      {
        id: "smgr_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Mengintegrasikan maqashid syariah dalam corporate strategy"
      },
      {
        id: "smgr_ae_3",
        category: "Akhlak & Etika Kerja Islami",
        text: "Membangun Islamic corporate governance yang exemplary"
      },
      {
        id: "smgr_ae_4",
        category: "Akhlak & Etika Kerja Islami",
        text: "Membina ummah melalui corporate social responsibility"
      },
      {
        id: "smgr_ae_5",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi pioneer dalam Islamic business leadership"
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
        text: "Mengelola regional business portfolio dengan autonomous authority"
      },
      {
        id: "rmgr_fc_2",
        category: "Functional Competency",
        text: "Menyusun regional expansion strategy dan market penetration"
      },
      {
        id: "rmgr_fc_3",
        category: "Functional Competency",
        text: "Mengoptimalkan regional resource dan geographic advantage"
      },
      {
        id: "rmgr_fc_4",
        category: "Functional Competency",
        text: "Mengelola regional regulatory compliance dan government relation"
      },
      {
        id: "rmgr_fc_5",
        category: "Functional Competency",
        text: "Membangun regional competitive positioning yang unik"
      },
      {
        id: "rmgr_lm_1",
        category: "Leadership & Managerial",
        text: "Memimpin regional transformation sebagai mini-CEO"
      },
      {
        id: "rmgr_lm_2",
        category: "Leadership & Managerial",
        text: "Mengembangkan regional leadership bench strength"
      },
      {
        id: "rmgr_lm_3",
        category: "Leadership & Managerial",
        text: "Membuat regional strategic decision dengan entrepreneurial spirit"
      },
      {
        id: "rmgr_lm_4",
        category: "Leadership & Managerial",
        text: "Mengelola regional stakeholder ecosystem"
      },
      {
        id: "rmgr_lm_5",
        category: "Leadership & Managerial",
        text: "Membangun regional excellence dan market leadership"
      },
      {
        id: "rmgr_ss_1",
        category: "Soft Skills",
        text: "Menjalin regional network dan community engagement"
      },
      {
        id: "rmgr_ss_2",
        category: "Soft Skills",
        text: "Membangun regional brand dan market reputation"
      },
      {
        id: "rmgr_ss_3",
        category: "Soft Skills",
        text: "Menyampaikan regional vision dengan charismatic leadership"
      },
      {
        id: "rmgr_ss_4",
        category: "Soft Skills",
        text: "Memfasilitasi regional collaboration dan synergy"
      },
      {
        id: "rmgr_ss_5",
        category: "Soft Skills",
        text: "Mengembangkan regional thought leadership"
      },
      {
        id: "rmgr_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Menganalisis regional market dynamics dan opportunity"
      },
      {
        id: "rmgr_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Mengembangkan regional strategy dan execution roadmap"
      },
      {
        id: "rmgr_ps_3",
        category: "Problem Solving & Analytical Thinking",
        text: "Mengelola regional risk dan business continuity"
      },
      {
        id: "rmgr_ps_4",
        category: "Problem Solving & Analytical Thinking",
        text: "Menciptakan regional innovation dan differentiation"
      },
      {
        id: "rmgr_ps_5",
        category: "Problem Solving & Analytical Thinking",
        text: "Mengoptimalkan regional performance dengan intelligence system"
      },
      {
        id: "rmgr_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi regional culture champion dan values ambassador"
      },
      {
        id: "rmgr_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Mengintegrasikan local wisdom dengan corporate culture"
      },
      {
        id: "rmgr_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Membangun regional pride dan organizational belonging"
      },
      {
        id: "rmgr_cf_4",
        category: "Culture Fit & Organizational Commitment",
        text: "Menyelaraskan regional culture dengan national standard"
      },
      {
        id: "rmgr_cf_5",
        category: "Culture Fit & Organizational Commitment",
        text: "Mengukur dan meningkatkan regional engagement metrics"
      },
      {
        id: "rmgr_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Memimpin regional sebagai qowwam dengan amanah Allah"
      },
      {
        id: "rmgr_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Mengintegrasikan Islamic principles dalam regional governance"
      },
      {
        id: "rmgr_ae_3",
        category: "Akhlak & Etika Kerja Islami",
        text: "Membangun regional ecosystem yang berkah dan halal"
      },
      {
        id: "rmgr_ae_4",
        category: "Akhlak & Etika Kerja Islami",
        text: "Membina regional ummah melalui business platform"
      },
      {
        id: "rmgr_ae_5",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi teladan regional dalam Islamic leadership"
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
        text: "Mengelola divisional enterprise dengan full P&L accountability"
      },
      {
        id: "dhead_fc_2",
        category: "Functional Competency",
        text: "Menyusun divisional vision dan long-term strategic direction"
      },
      {
        id: "dhead_fc_3",
        category: "Functional Competency",
        text: "Mengoptimalkan divisional value creation dan shareholder return"
      },
      {
        id: "dhead_fc_4",
        category: "Functional Competency",
        text: "Mengelola divisional transformation dan future readiness"
      },
      {
        id: "dhead_fc_5",
        category: "Functional Competency",
        text: "Membangun divisional legacy dan sustainable competitive advantage"
      },
      {
        id: "dhead_lm_1",
        category: "Leadership & Managerial",
        text: "Memimpin divisional transformation sebagai visionary leader"
      },
      {
        id: "dhead_lm_2",
        category: "Leadership & Managerial",
        text: "Mengembangkan successor dan next-generation leadership"
      },
      {
        id: "dhead_lm_3",
        category: "Leadership & Managerial",
        text: "Membuat transformational decision dengan legacy impact"
      },
      {
        id: "dhead_lm_4",
        category: "Leadership & Managerial",
        text: "Mengelola enterprise stakeholder dan board governance"
      },
      {
        id: "dhead_lm_5",
        category: "Leadership & Managerial",
        text: "Membangun world-class divisional capability dan reputation"
      },
      {
        id: "dhead_ss_1",
        category: "Soft Skills",
        text: "Menjalin global partnership dan strategic alliance"
      },
      {
        id: "dhead_ss_2",
        category: "Soft Skills",
        text: "Membangun divisional brand dan industry thought leadership"
      },
      {
        id: "dhead_ss_3",
        category: "Soft Skills",
        text: "Menyampaikan divisional mission dengan transformational communication"
      },
      {
        id: "dhead_ss_4",
        category: "Soft Skills",
        text: "Memfasilitasi enterprise dialogue dan stakeholder engagement"
      },
      {
        id: "dhead_ss_5",
        category: "Soft Skills",
        text: "Mengembangkan global influence dan industry recognition"
      },
      {
        id: "dhead_ps_1",
        category: "Problem Solving & Analytical Thinking",
        text: "Menganalisis global trend dan future scenario modeling"
      },
      {
        id: "dhead_ps_2",
        category: "Problem Solving & Analytical Thinking",
        text: "Mengembangkan transformational strategy dan breakthrough solution"
      },
      {
        id: "dhead_ps_3",
        category: "Problem Solving & Analytical Thinking",
        text: "Mengelola enterprise risk dan strategic uncertainty"
      },
      {
        id: "dhead_ps_4",
        category: "Problem Solving & Analytical Thinking",
        text: "Menciptakan paradigm shift dan industry disruption"
      },
      {
        id: "dhead_ps_5",
        category: "Problem Solving & Analytical Thinking",
        text: "Mengoptimalkan divisional intelligence dengan AI-driven insight"
      },
      {
        id: "dhead_cf_1",
        category: "Culture Fit & Organizational Commitment",
        text: "Menjadi chief culture architect dalam enterprise evolution"
      },
      {
        id: "dhead_cf_2",
        category: "Culture Fit & Organizational Commitment",
        text: "Mengintegrasikan divine purpose dalam corporate mission"
      },
      {
        id: "dhead_cf_3",
        category: "Culture Fit & Organizational Commitment",
        text: "Membangun generational culture dan institutional legacy"
      },
      {
        id: "dhead_cf_4",
        category: "Culture Fit & Organizational Commitment",
        text: "Menyelaraskan global values dengan local authenticity"
      },
      {
        id: "dhead_cf_5",
        category: "Culture Fit & Organizational Commitment",
        text: "Mengukur dan meningkatkan enterprise social impact"
      },
      {
        id: "dhead_ae_1",
        category: "Akhlak & Etika Kerja Islami",
        text: "Memimpin divisional sebagai khalifah Allah dalam enterprise"
      },
      {
        id: "dhead_ae_2",
        category: "Akhlak & Etika Kerja Islami",
        text: "Mengintegrasikan divine guidance dalam strategic leadership"
      },
      {
        id: "dhead_ae_3",
        category: "Akhlak & Etika Kerja Islami",
        text: "Membangun enterprise yang menjadi rahmatan lil alameen"
      },
      {
        id: "dhead_ae_4",
        category: "Akhlak & Etika Kerja Islami",
        text: "Membina global ummah melalui enterprise platform"
      },
      {
        id: "dhead_ae_5",
        category: "Akhlak & Etika Kerja Islami",
        text: "Menjadi global pioneer dalam Islamic enterprise leadership"
      }
    ],
    section2: semangatSedjatiQuestions,
    section3: recommendationOptions,
    isActive: true,
    version: "2.1",
    createdAt: new Date().toISOString()
  }
]; 