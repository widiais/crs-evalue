// Assessment Template Categories for Section 1: 6 Dimensi Kompetensi
export const COMPETENCY_CATEGORIES = [
  'Functional Competency',
  'Leadership & Managerial',
  'Soft Skills',
  'Problem Solving & Analytical Thinking',
  'Culture Fit & Organizational Commitment',
  'Akhlak & Etika Kerja Islami'
] as const;

// Assessment Scale Labels
export const ASSESSMENT_SCALE = [
  { value: 1, label: 'Kurang Sekali' },
  { value: 2, label: 'Kurang' },
  { value: 3, label: 'Cukup' },
  { value: 4, label: 'Baik' },
  { value: 5, label: 'Baik Sekali' }
] as const;

// Fixed Recommendation Options for Section 3
export const RECOMMENDATION_OPTIONS = [
  'Dipertahankan di Level Sekarang',
  'Layak Dipromosikan', 
  'Perlu Pembinaan Lebih Lanjut',
  'Perlu Rotasi / Penyesuaian Posisi'
] as const;

// Template Names
export const TEMPLATE_NAMES = [
  'template_supervisor',
  'template_team_leader',
  'template_all_star',
  'template_general',
  'template_middle_manager'
] as const;

export type CompetencyCategory = typeof COMPETENCY_CATEGORIES[number];
export type RecommendationOption = typeof RECOMMENDATION_OPTIONS[number];
export type TemplateName = typeof TEMPLATE_NAMES[number]; 