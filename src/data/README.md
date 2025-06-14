# Assessment Templates - CRS Web App

## 📋 Overview

Koleksi lengkap assessment templates untuk sistem CRS (Competency Review System) berdasarkan framework 15 level jabatan Sedjati Grup dan 6 dimensi kompetensi yang telah disesuaikan dengan dokumen `rumus.md`.

## 🏗️ Struktur Template

### Template Components

Setiap template terdiri dari 3 section utama:

#### Section 1: 6 Dimensi Kompetensi
- **Functional Competency**: Kompetensi teknis dan pengetahuan spesifik jabatan
- **Leadership & Managerial**: Kemampuan memimpin, mengelola, dan mempengaruhi
- **Soft Skills**: Kemampuan interpersonal dan komunikasi
- **Problem Solving & Analytical Thinking**: Kemampuan analisis dan pemecahan masalah
- **Culture Fit & Organizational Commitment**: Kesesuaian dengan budaya dan komitmen organisasi
- **Akhlak & Etika Kerja Islami**: Etika kerja dan karakter Islami

#### Section 2: 7 Semangat Sedjati (Sama untuk semua level)
1. **Semangat Belajar**: Dalam setiap tugas yang diberikan
2. **Semangat Membangun**: Lingkungan kerja yang positif
3. **Semangat Memperbaiki**: Proses atau hasil kerja
4. **Semangat Menguatkan Sesama**: Rekan kerja
5. **Semangat Bertanggung Jawab**: Atas tugas dan amanah
6. **Semangat Menjadi Teladan**: Dalam perilaku dan etika kerja
7. **Semangat Ibadah dalam Bekerja**: Sebagai motivasi utama

#### Section 3: Rekomendasi Evaluator (Fixed untuk semua level)
- Dipertahankan di Level Sekarang
- Layak Dipromosikan
- Perlu Pembinaan Lebih Lanjut
- Perlu Rotasi / Penyesuaian Posisi

## 📊 15 Level Jabatan

### Entry Level (1-3)
1. **Magang**: Observasi, adaptasi, pengenalan alat kerja
2. **Training**: Memahami alur kerja dan tanggung jawab pos kerja
3. **Member**: Menguasai SOP secara mandiri

### Operational Level (4-7)
4. **Star**: Memimpin secara informal dan menjadi motivator tim
5. **All Star**: Memimpin secara informal dengan percaya diri dan menginspirasi
6. **Team Leader 1**: Memimpin langsung tim dalam shift
7. **Team Leader 2**: Pemimpin utama di unit tanpa Supervisor

### Supervisory Level (8-10)
8. **Junior Supervisor**: Membina langsung Team Leader
9. **Middle Supervisor**: Membina Junior Supervisor dan TL2 
10. **Senior Supervisor**: Pembina utama Junior dan Middle Supervisor

### Management Level (11-13)
11. **Junior Manager**: Memimpin area kerja dengan amanah dan keterhubungan
12. **Middle Manager**: Memimpin area kerja dengan amanah dan keterhubungan
13. **Senior Manager**: Memimpin area kerja dengan amanah dan keterhubungan

### Executive Level (14-15)
14. **Regional Manager**: Memimpin wilayah dengan amanah penuh sebagai qowwam regional
15. **Division Head**: Qowwam divisi dan pemegang amanah tertinggi

## 🎯 Template Characteristics

### Simplified Structure
Semua template telah disederhanakan untuk sesuai dengan `rumus.md`:
- **1 pertanyaan per dimensi kompetensi** untuk setiap level
- **Konsistensi terminologi** dengan dokumen rujukan
- **Fokus pada kompetensi inti** sesuai level jabatan

### Level Progression
- **Entry Level**: Fokus pada adaptasi dan pembelajaran dasar
- **Operational Level**: Pengembangan kepemimpinan informal
- **Supervisory Level**: Pembinaan dan pengembangan tim
- **Management Level**: Kepemimpinan area dengan amanah
- **Executive Level**: Kepemimpinan strategis dan qowwam

## 🔧 Cara Penggunaan

### Import Templates

```typescript
import { 
  allAssessmentTemplates,
  getTemplateByLevel,
  getTemplateById,
  getActiveTemplates,
  templateSummary 
} from './data';

// Get template untuk level tertentu
const supervisorTemplate = getTemplateByLevel('Middle Supervisor');

// Get template by ID
const template = getTemplateById('template_member');

// Get semua template yang aktif
const activeTemplates = getActiveTemplates();
```

### Struktur Data Template

```typescript
interface AssessmentTemplate {
  id: string;                    // Unique identifier
  level: string;                 // Job level name
  description: string;           // Template description
  section1: Question[];          // 6 Dimensi Kompetensi questions
  section2: Question[];          // 7 Semangat Sedjati questions
  section3: string[];            // Recommendation options
  isActive: boolean;             // Template status
  version: string;               // Template version
  createdAt: string;             // Creation timestamp
}

interface Question {
  id: string;                    // Question unique ID
  category: string;              // Competency category
  text: string;                  // Question text
}
```

## 📁 File Structure

```
src/data/
├── assessment-templates.ts      # Levels 1-5 (Magang - All Star)
├── assessment-templates-part2.ts # Levels 6-11 (TL1 - Junior Manager)
├── assessment-templates-part3.ts # Levels 12-15 (Middle Manager - Division Head)
├── index.ts                     # Combined exports and helper functions
└── README.md                    # This documentation
```

## 📈 Template Statistics

```typescript
// Template summary information
console.log(templateSummary);
// Output:
// {
//   totalTemplates: 15,
//   levels: ["Magang", "Training", ...],
//   competencyDimensions: ["Functional Competency", ...],
//   semangatSedjati: ["Semangat Belajar", ...],
//   recommendationOptions: ["Dipertahankan di Level Sekarang", ...]
// }
```

## 🔄 Template Versioning

### Version Format: `Major.Minor`
- **1.0**: Initial template sesuai rumus.md
- **1.1**: Minor updates (question modifications)
- **2.0**: Major revision (structural changes)

### Update Process:
1. Create new version dengan incremented version number
2. Set previous version `isActive: false`
3. Set new version `isActive: true`
4. Maintain historical data untuk reporting

## 🎨 Customization

### Template Characteristics per Level

#### Entry Level (1-3)
- **Fokus**: Adaptasi dan pembelajaran dasar
- **Kompetensi Utama**: Functional Competency, Soft Skills
- **Akhlak**: Adab dasar dalam berbicara, berpakaian, dan bersikap

#### Operational Level (4-7)
- **Fokus**: Kepemimpinan informal dan motivasi tim
- **Kompetensi Utama**: Leadership & Managerial, Soft Skills
- **Akhlak**: Menjadi penyejuk tim dengan teguran hikmah

#### Supervisory Level (8-10)
- **Fokus**: Pembinaan dan pengembangan tim
- **Kompetensi Utama**: Leadership & Managerial, Problem Solving
- **Akhlak**: Konsisten dalam teguran hikmah dan adab Islami

#### Management Level (11-13)
- **Fokus**: Kepemimpinan area dengan amanah
- **Kompetensi Utama**: Leadership & Managerial, Problem Solving
- **Soft Skills**: Komunikatif, sistematis, hubungan vertikal-horisontal

#### Executive Level (14-15)
- **Fokus**: Kepemimpinan strategis dan qowwam
- **Kompetensi Utama**: Leadership & Managerial, Problem Solving
- **Tanggung Jawab**: Qowwam regional/divisi

## 🔍 Quality Assurance

### Template Validation Checklist:
- [x] Sesuai dengan dokumen rumus.md
- [x] Semua 6 dimensi kompetensi terwakili
- [x] 1 pertanyaan per dimensi untuk konsistensi
- [x] Terminologi yang konsisten
- [x] Bahasa yang jelas dan spesifik
- [x] Sesuai dengan level jabatan
- [x] Section 2 menggunakan 7 Semangat Sedjati standar
- [x] Section 3 menggunakan opsi rekomendasi standar

### Question Quality Guidelines:
- Menggunakan bahasa yang spesifik dan dapat diamati
- Fokus pada tindakan yang dapat diukur
- Menghindari istilah yang subjektif atau samar
- Memastikan kesesuaian budaya
- Menyesuaikan kompleksitas dengan level jabatan

## 📞 Support

### For Template Issues:
- **Content Questions**: Contact HR atau Learning & Development
- **Technical Issues**: Contact System Administrator
- **Implementation Help**: Refer to this documentation

### Template Maintenance:
- **Quarterly Review**: Content relevance and effectiveness
- **Annual Update**: Major revisions based on organizational changes
- **Continuous Improvement**: Based on user feedback and assessment results

---

**📝 Last Updated**: January 2025  
**👤 Document Owner**: CRS Development Team  
**🔄 Review Cycle**: Quarterly 
**📋 Source Document**: rumus.md 