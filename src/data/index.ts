import { assessmentTemplates } from './assessment-templates';
import { assessmentTemplatesPart2 } from './assessment-templates-part2';
import { assessmentTemplatesPart3 } from './assessment-templates-part3';
import { AssessmentTemplate } from './assessment-templates';

// Combine all assessment templates
export const allAssessmentTemplates: AssessmentTemplate[] = [
  ...assessmentTemplates,      // Levels 1-5: Magang, Training, Member, Star, All Star
  ...assessmentTemplatesPart2, // Levels 6-11: Team Leader 1, Team Leader 2, Junior Supervisor, Middle Supervisor, Senior Supervisor, Junior Manager
  ...assessmentTemplatesPart3  // Levels 12-15: Middle Manager, Senior Manager, Regional Manager, Division Head
];

// Export individual parts for flexibility
export { assessmentTemplates, assessmentTemplatesPart2, assessmentTemplatesPart3 };

// Export types
export type { AssessmentTemplate, Question } from './assessment-templates';

// Helper functions
export const getTemplateByLevel = (level: string): AssessmentTemplate | undefined => {
  return allAssessmentTemplates.find(template => template.level === level);
};

export const getTemplateById = (id: string): AssessmentTemplate | undefined => {
  return allAssessmentTemplates.find(template => template.id === id);
};

export const getActiveTemplates = (): AssessmentTemplate[] => {
  return allAssessmentTemplates.filter(template => template.isActive);
};

export const getAllLevels = (): string[] => {
  return allAssessmentTemplates.map(template => template.level);
};

// Template summary for reference
export const templateSummary = {
  totalTemplates: allAssessmentTemplates.length,
  levels: [
    "Magang",
    "Training", 
    "Member",
    "Star",
    "All Star",
    "Team Leader 1",
    "Team Leader 2", 
    "Junior Supervisor",
    "Middle Supervisor",
    "Senior Supervisor",
    "Junior Manager",
    "Middle Manager",
    "Senior Manager",
    "Regional Manager",
    "Division Head"
  ],
  competencyDimensions: [
    "Functional Competency",
    "Leadership & Managerial", 
    "Soft Skills",
    "Problem Solving & Analytical Thinking",
    "Culture Fit & Organizational Commitment",
    "Akhlak & Etika Kerja Islami"
  ],
  semangatSedjati: [
    "Semangat Belajar",
    "Semangat Membangun",
    "Semangat Memperbaiki", 
    "Semangat Menguatkan Sesama",
    "Semangat Bertanggung Jawab",
    "Semangat Menjadi Teladan",
    "Semangat Ibadah dalam Bekerja"
  ],
  recommendationOptions: [
    "Dipertahankan di Level Sekarang",
    "Layak Dipromosikan",
    "Perlu Pembinaan Lebih Lanjut", 
    "Perlu Rotasi / Penyesuaian Posisi"
  ]
}; 