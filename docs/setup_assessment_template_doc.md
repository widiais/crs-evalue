# 📝 Assessment Template Setup Guide - CRS Web App

## 📋 Table of Contents
- [Overview](#overview)
- [Accessing Template Management](#accessing-template-management)
- [Understanding Template Structure](#understanding-template-structure)
- [Creating New Templates](#creating-new-templates)
- [Managing Existing Templates](#managing-existing-templates)
- [Job Level Templates](#job-level-templates)
- [Competency Framework](#competency-framework)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Assessment Template Setup adalah komponen krusial dalam CRS yang menentukan struktur dan konten penilaian untuk setiap level jabatan. Templates ini mengatur pertanyaan assessment, kategori kompetensi, dan opsi rekomendasi berdasarkan framework 14 level jabatan dan 6 dimensi kompetensi Sedjati Grup.

### Key Features
- ✅ **14 Job Level Templates**: Dari Magang hingga Division Head
- ✅ **6 Competency Dimensions**: Framework kompetensi komprehensif
- ✅ **Structured Sections**: Section 1 (Kompetensi), Section 2 (Semangat), Section 3 (Rekomendasi)
- ✅ **Question Management**: Add, edit, categorize questions
- ✅ **Template Versioning**: Track changes dan updates
- ✅ **Active Status**: Enable/disable templates

### Prerequisites
- Admin access ke CRS dashboard
- Understanding of Sedjati Grup competency framework
- Knowledge of organizational job levels
- Understanding of assessment methodology

---

## 🔐 Accessing Template Management

### Step 1: Login to Admin Dashboard
1. Buka aplikasi CRS di browser
2. Akses halaman admin dashboard
3. Pilih menu **"Templates"** di sidebar

### Step 2: Template Management Interface
Setelah mengakses menu Templates, Anda akan melihat:
- **Template List**: Daftar semua assessment templates
- **Add New Template**: Tombol untuk membuat template baru
- **Search Bar**: Pencarian berdasarkan level atau description
- **Filter Options**: Filter berdasarkan status atau level

```
┌─────────────────────────────────────────────────────┐
│                Template Management                  │
├─────────────────────────────────────────────────────┤
│  [+ Add New Template]     [Search...]  [Filters▼]  │
├─────────────────────────────────────────────────────┤
│  Level           Description        Status  Actions │
│  Supervisor      Assessment for...  Active  [Edit]  │
│  Team Leader     Assessment for...  Active  [Edit]  │
│  Manager         Assessment for...  Draft   [Edit]  │
│  All Star        Assessment for...  Active  [Edit]  │
└─────────────────────────────────────────────────────┘
```

---

## 📚 Understanding Template Structure

### Template Schema Overview

```typescript
interface CriteriaTemplate {
  id: string;                       // Template ID
  level: string;                    // Job level name
  description?: string;             // Template description
  section1: Question[];             // 6 Dimensi Kompetensi
  section2: Question[];             // 7 Semangat Sedjati
  section3: RecommendationSection;  // Fixed recommendation options
  isActive: boolean;                // Template status
  version: string;                  // Template version
  createdAt: Timestamp;             // Creation date
  createdBy: string;                // Creator admin
}
```

### Three-Section Structure

#### Section 1: 6 Dimensi Kompetensi
- **Purpose**: Menilai kompetensi inti berdasarkan 6 dimensi
- **Structure**: Questions dengan kategori yang sudah ditentukan
- **Scoring**: Scale 1-5 untuk setiap pertanyaan
- **Categories**: 
  1. Functional Competency
  2. Leadership & Managerial
  3. Soft Skills
  4. Problem Solving & Analytical Thinking
  5. Culture Fit & Organizational Commitment
  6. Akhlak & Etika Kerja Islami

#### Section 2: 7 Semangat Sedjati
- **Purpose**: Menilai nilai-nilai dan semangat kerja Sedjati
- **Structure**: 7 pertanyaan standard untuk semua level
- **Scoring**: Scale 1-5 untuk setiap pertanyaan
- **Content**: Values-based questions specific to Sedjati culture

#### Section 3: Rekomendasi Evaluator
- **Purpose**: Kesimpulan dan rekomendasi evaluator
- **Structure**: Fixed options (multiple choice)
- **Options**: 
  - "Dipertahankan di Level Sekarang"
  - "Layak Dipromosikan"
  - "Perlu Pembinaan Lebih Lanjut"
  - "Perlu Rotasi / Penyesuaian Posisi"

---

## ➕ Creating New Templates

### Step 1: Access Template Creation Form
1. Klik tombol **"Add New Template"**
2. Template creation wizard akan terbuka

### Step 2: Basic Template Information

```
┌─────────────────────────────────────────┐
│           Create New Template           │
├─────────────────────────────────────────┤
│ Job Level*:    [Dropdown Select ▼]     │
│ Description:   [Text Area]              │
│ Version:       [1.0] (auto-generated)   │
├─────────────────────────────────────────┤
│ [Cancel]              [Next: Section 1] │
└─────────────────────────────────────────┘
```

#### Field Details:

**1. Job Level*** (Required)
- Dropdown berisi 14 level jabatan
- Setiap level hanya boleh memiliki 1 active template
- Options:
  - Magang
  - Training
  - Member
  - Star
  - All Star
  - Team Leader 1
  - Team Leader 2
  - Junior Supervisor
  - Senior Supervisor
  - Junior Manager
  - Middle Manager
  - Senior Manager
  - Regional Manager
  - Division Head

**2. Description** (Optional)
- Deskripsi template untuk referensi admin
- Example: "Assessment template untuk level Supervisor dengan focus pada leadership skills"
- Max 200 karakter

### Step 3: Section 1 - 6 Dimensi Kompetensi

```
┌─────────────────────────────────────────┐
│        Section 1: 6 Dimensi Kompetensi │
├─────────────────────────────────────────┤
│ Functional Competency                   │
│ [+ Add Question] (2 questions added)    │
│                                         │
│ Leadership & Managerial                 │
│ [+ Add Question] (3 questions added)    │
│                                         │
│ Soft Skills                             │
│ [+ Add Question] (2 questions added)    │
│                                         │
│ ... (continue for all 6 categories)    │
├─────────────────────────────────────────┤
│ [Previous]           [Next: Section 2]  │
└─────────────────────────────────────────┘
```

#### Adding Questions to Categories:

**1. Functional Competency**
- Example questions:
  - "Mampu menyelesaikan tugas sesuai standar kualitas yang ditetapkan"
  - "Menguasai knowledge dan skills yang dibutuhkan untuk posisi saat ini"
  - "Mengikuti prosedur dan aturan kerja dengan konsisten"

**2. Leadership & Managerial**
- Example questions:
  - "Menunjukkan kemampuan memimpin dan mengarahkan tim"
  - "Membuat keputusan yang tepat dalam situasi yang menantang"
  - "Mampu mendelegasikan tugas dengan efektif"

**3. Soft Skills**
- Example questions:
  - "Berkomunikasi dengan jelas dan efektif"
  - "Menunjukkan kemampuan bekerja dalam tim"
  - "Adaptif terhadap perubahan dan situasi baru"

**4. Problem Solving & Analytical Thinking**
- Example questions:
  - "Mengidentifikasi masalah dengan akurat"
  - "Menganalisis situasi dengan logis dan sistematis"
  - "Mengembangkan solusi kreatif untuk mengatasi tantangan"

**5. Culture Fit & Organizational Commitment**
- Example questions:
  - "Menunjukkan komitmen terhadap nilai-nilai perusahaan"
  - "Berkontribusi positif terhadap budaya kerja organisasi"
  - "Loyal terhadap perusahaan dan tujuan bersama"

**6. Akhlak & Etika Kerja Islami**
- Example questions:
  - "Menunjukkan akhlaq yang baik dalam berinteraksi"
  - "Jujur dan amanah dalam menjalankan tugas"
  - "Menerapkan nilai-nilai Islami dalam bekerja"

#### Question Management:
```
┌─────────────────────────────────────────┐
│          Add Question                   │
├─────────────────────────────────────────┤
│ Category: [Functional Competency ▼]     │
│ Question: [Text area for question]       │
│                                         │
│ Example: "Mampu menyelesaikan tugas     │
│ sesuai standar kualitas yang ditetapkan"│
├─────────────────────────────────────────┤
│ [Cancel]                  [Add Question]│
└─────────────────────────────────────────┘
```

### Step 4: Section 2 - 7 Semangat Sedjati

```
┌─────────────────────────────────────────┐
│        Section 2: 7 Semangat Sedjati   │
├─────────────────────────────────────────┤
│ Standard questions (sama untuk semua    │
│ level jabatan):                         │
│                                         │
│ 1. [Question text...]                   │
│ 2. [Question text...]                   │
│ 3. [Question text...]                   │
│ 4. [Question text...]                   │
│ 5. [Question text...]                   │
│ 6. [Question text...]                   │
│ 7. [Question text...]                   │
│                                         │
│ [+ Add Question] [- Remove] [Edit]      │
├─────────────────────────────────────────┤
│ [Previous]           [Next: Section 3]  │
└─────────────────────────────────────────┘
```

**Note**: Section 2 biasanya menggunakan questions yang sama untuk semua level, focusing pada core values Sedjati Grup.

### Step 5: Section 3 - Rekomendasi (Auto-configured)

```
┌─────────────────────────────────────────┐
│        Section 3: Rekomendasi           │
├─────────────────────────────────────────┤
│ Fixed options (automatically configured)│
│                                         │
│ ✓ Dipertahankan di Level Sekarang       │
│ ✓ Layak Dipromosikan                    │
│ ✓ Perlu Pembinaan Lebih Lanjut          │
│ ✓ Perlu Rotasi / Penyesuaian Posisi    │
│                                         │
│ These options are standard for all      │
│ templates and cannot be modified.       │
├─────────────────────────────────────────┤
│ [Previous]              [Save Template] │
└─────────────────────────────────────────┘
```

### Step 6: Template Review and Save

```
┌─────────────────────────────────────────┐
│           Template Review               │
├─────────────────────────────────────────┤
│ Level: Supervisor                       │
│ Description: Assessment template for... │
│                                         │
│ Section 1: 15 questions across 6 cats  │
│ Section 2: 7 standard questions         │
│ Section 3: 4 recommendation options     │
│                                         │
│ Status: [Draft ▼] (Draft/Active)       │
├─────────────────────────────────────────┤
│ [Cancel]               [Save Template]  │
└─────────────────────────────────────────┘
```

---

## ✏️ Managing Existing Templates

### Editing Templates

#### Step 1: Access Edit Mode
1. Di template list, klik tombol **"Edit"** pada template
2. Template editor akan terbuka dengan data existing

#### Step 2: Modify Template Content
- Edit questions dalam Section 1 dan Section 2
- Add/remove questions as needed
- Update template description
- Change status (Draft/Active)

#### Step 3: Version Control
```
Current Version: 1.0
New Version: [1.1] (auto-increment)
Change Notes: [Describe what changed...]
```

### Template Status Management

#### Status Options:
- **Draft**: Template dalam development, tidak bisa digunakan untuk assessment
- **Active**: Template siap digunakan, employees dengan level ini bisa di-assess
- **Inactive**: Template disabled, data tetap tersimpan

#### Status Change Impact:
```
Draft → Active: Template becomes available for assessments
Active → Inactive: New assessments blocked, existing results preserved
Active → Draft: Template pulled from production for editing
```

### Template Duplication

#### Use Cases:
- Creating similar templates for related job levels
- Starting new template based on existing one
- Backup before major changes

#### Process:
1. Select template to duplicate
2. Click **"Duplicate Template"**
3. Modify job level and content
4. Save as new template

---

## 🎯 Job Level Templates

### Level Categories and Complexity

#### Entry Level (Detailed Questions)
- **Magang**: 8-10 questions, focus on basic skills
- **Training**: 10-12 questions, learning assessment
- **Member**: 12-15 questions, core competencies

#### Operational Level (Moderate Complexity)
- **Star**: 15-18 questions, performance excellence
- **All Star**: 18-20 questions, senior contributor
- **Team Leader 1**: 20-22 questions, basic leadership
- **Team Leader 2**: 22-25 questions, advanced leadership

#### Supervisory Level (Leadership Focus)
- **Junior Supervisor**: 25-28 questions, supervisory skills
- **Senior Supervisor**: 28-30 questions, advanced supervision

#### Management Level (Strategic Thinking)
- **Junior Manager**: 30-32 questions, management basics
- **Middle Manager**: 32-35 questions, strategic thinking
- **Senior Manager**: 35-38 questions, advanced management

#### Executive Level (Vision & Strategy)
- **Regional Manager**: 38-40 questions, regional leadership
- **Division Head**: 40+ questions, strategic leadership

### Template Recommendations by Level

#### Junior Levels (Magang - Member)
```
Section 1 Focus:
- Functional Competency: 60%
- Soft Skills: 20%
- Culture Fit: 15%
- Others: 5%

Recommended Questions: 10-15 total
```

#### Mid Levels (Star - Team Leader)
```
Section 1 Focus:
- Functional Competency: 40%
- Leadership & Managerial: 30%
- Soft Skills: 15%
- Problem Solving: 10%
- Others: 5%

Recommended Questions: 18-25 total
```

#### Senior Levels (Supervisor - Manager)
```
Section 1 Focus:
- Leadership & Managerial: 40%
- Functional Competency: 25%
- Problem Solving: 20%
- Soft Skills: 10%
- Others: 5%

Recommended Questions: 25-35 total
```

#### Executive Levels (Regional Manager - Division Head)
```
Section 1 Focus:
- Leadership & Managerial: 50%
- Problem Solving: 25%
- Culture Fit: 15%
- Others: 10%

Recommended Questions: 35-40 total
```

---

## 🧠 Competency Framework

### 6 Dimensi Kompetensi Details

#### 1. Functional Competency
**Definition**: Job-specific technical skills and knowledge
**Key Areas**:
- Technical expertise
- Job knowledge
- Procedural compliance
- Quality standards
- Professional skills

**Sample Questions by Level**:
- **Entry**: "Menguasai basic skills yang dibutuhkan untuk posisi"
- **Mid**: "Mampu menyelesaikan tugas kompleks dengan minimal supervision"
- **Senior**: "Menjadi expert dan resource person untuk technical matters"

#### 2. Leadership & Managerial
**Definition**: Ability to lead, manage, and influence others
**Key Areas**:
- Team leadership
- Decision making
- Delegation
- Strategic thinking
- People management

**Sample Questions by Level**:
- **Entry**: "Menunjukkan potensi kepemimpinan dalam team activities"
- **Mid**: "Memimpin small teams atau projects dengan efektif"
- **Senior**: "Mengembangkan strategi dan memimpin large organizations"

#### 3. Soft Skills
**Definition**: Interpersonal and communication abilities
**Key Areas**:
- Communication
- Teamwork
- Adaptability
- Time management
- Customer service

**Sample Questions by Level**:
- **Entry**: "Berkomunikasi dengan jelas dalam daily interactions"
- **Mid**: "Facilitates meetings dan presentations dengan confident"
- **Senior**: "Influences stakeholders dan builds strategic partnerships"

#### 4. Problem Solving & Analytical Thinking
**Definition**: Ability to analyze situations and develop solutions
**Key Areas**:
- Analytical thinking
- Creative problem solving
- Data analysis
- Strategic analysis
- Innovation

**Sample Questions by Level**:
- **Entry**: "Identifies basic problems dan seeks appropriate help"
- **Mid**: "Analyzes complex situations dan develops practical solutions"
- **Senior**: "Solves strategic challenges dengan innovative approaches"

#### 5. Culture Fit & Organizational Commitment
**Definition**: Alignment with company values and commitment
**Key Areas**:
- Company values
- Organizational commitment
- Cultural adaptation
- Brand advocacy
- Long-term thinking

**Sample Questions by Level**:
- **Entry**: "Demonstrates understanding of company values"
- **Mid**: "Actively promotes company culture dalam team"
- **Senior**: "Shapes organizational culture dan drives cultural transformation"

#### 6. Akhlaq & Etika Kerja Islami
**Definition**: Islamic work ethics and moral character
**Key Areas**:
- Honesty (Amanah)
- Integrity (Sidiq)
- Responsibility (Mas'uliyah)
- Excellence (Ihsan)
- Justice (Adl)

**Sample Questions by Level**:
- **Entry**: "Menunjukkan kejujuran dalam daily work activities"
- **Mid**: "Becomes role model untuk Islamic work ethics"
- **Senior**: "Integrates Islamic values dalam strategic decisions"

---

## ✅ Best Practices

### Template Design Guidelines

#### 1. Question Quality
```
✅ Good: "Mampu menganalisis data penjualan dan memberikan insights yang actionable"
✅ Good: "Menunjukkan consistency dalam menerapkan company values"
❌ Bad: "Bagus dalam bekerja" (too vague)
❌ Bad: "Apakah dia pintar?" (not professional)
```

#### 2. Level Appropriateness
- Match question complexity dengan job level
- Ensure questions relevant untuk role responsibilities
- Consider career progression path

#### 3. Balanced Distribution
```
Target Distribution across 6 Dimensions:
- Functional: 25-35%
- Leadership: 20-30%
- Soft Skills: 15-20%
- Problem Solving: 10-15%
- Culture Fit: 10-15%
- Akhlaq: 10-15%
```

#### 4. Clear Language
- Use clear, specific language
- Avoid jargon or technical terms
- Make questions actionable and observable

### Template Maintenance

#### Regular Review Process:
- [ ] **Quarterly**: Review template effectiveness
- [ ] **Semi-annually**: Update questions based on feedback
- [ ] **Annually**: Major review dan alignment dengan organizational changes
- [ ] **As needed**: Address specific issues atau requirements

#### Quality Assurance:
- [ ] All questions are clear and specific
- [ ] Balanced distribution across competencies
- [ ] Appropriate difficulty for job level
- [ ] No biased or discriminatory language
- [ ] Consistent with company values

### Versioning Strategy

#### Version Numbering:
```
Major.Minor format:
1.0 → Initial template
1.1 → Minor updates (few questions added/modified)
1.2 → Minor updates
2.0 → Major revision (significant changes)
```

#### Change Tracking:
- Document all changes dalam template history
- Keep previous versions for reference
- Track performance impact of changes

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Issue 1: "Job level already has active template" Error
**Problem**: Trying to create template untuk level yang sudah ada

**Solutions**:
1. Check existing templates untuk level tersebut
2. Set existing template to Draft atau Inactive
3. Edit existing template instead of creating new

#### Issue 2: Template Not Available for Assessment
**Problem**: Template tidak muncul dalam assessment options

**Solutions**:
1. ✅ Check template status = Active
2. ✅ Verify job level matches employee position
3. ✅ Ensure template has questions in all sections
4. ✅ Check for template validation errors

#### Issue 3: Question Distribution Imbalance
**Problem**: Too many questions in one competency category

**Solutions**:
1. Review distribution across 6 dimensions
2. Move questions to appropriate categories
3. Add questions to under-represented areas
4. Remove redundant atau duplicate questions

#### Issue 4: Assessment Form Errors
**Problem**: Template causes errors dalam assessment form

**Solutions**:
1. ✅ Validate all sections have content
2. ✅ Check for special characters in questions
3. ✅ Ensure Section 3 has recommendation options
4. ✅ Test template dengan sample assessment

### Error Messages Reference

| Error Code | Message | Solution |
|------------|---------|----------|
| TPL001 | "Job level is required" | Select job level from dropdown |
| TPL002 | "Template already exists for this level" | Edit existing or set to inactive |
| TPL003 | "Section 1 must have questions" | Add questions to competency categories |
| TPL004 | "Section 2 must have questions" | Add semangat questions |
| TPL005 | "Question text cannot be empty" | Fill question text field |
| TPL006 | "Template must be Active to use" | Change status to Active |
| TPL007 | "Invalid competency category" | Select valid category |

### Performance Issues

#### Large Template Loading:
- Optimize template size (recommended max 40 questions)
- Consider splitting very large templates
- Use pagination for question management

#### Assessment Form Speed:
- Monitor template complexity impact on form loading
- Optimize question text length
- Consider caching frequently used templates

---

## 📊 Template Analytics

### Template Usage Metrics

#### Key Metrics to Track:
1. **Usage Frequency**: How often template is used
2. **Assessment Completion Rate**: Success rate untuk assessments using this template
3. **Average Scores**: Performance trends untuk each competency
4. **Time to Complete**: How long assessments take

#### Quality Indicators:
1. **Question Effectiveness**: Which questions provide best insights
2. **Category Balance**: Distribution of scores across competencies
3. **Evaluator Feedback**: Comments tentang template quality
4. **Assessment Outcomes**: Correlation dengan performance results

### Template Optimization

#### Data-Driven Improvements:
- Analyze question performance
- Identify redundant atau ineffective questions
- Optimize question order untuk better flow
- Balance difficulty level based on completion rates

#### Continuous Improvement:
- Regular feedback collection from evaluators
- Monitor assessment quality metrics
- Update templates based on organizational changes
- Benchmark against industry best practices

---

## 📞 Support and Help

### Getting Assistance
- **Template Design**: Contact HR atau Learning & Development team
- **Technical Issues**: Contact System Administrator
- **Content Questions**: Refer to Competency Framework documentation

### Quick Reference

#### Essential Template Components:
```
Job Level ✓ | Section 1 Questions ✓ | Section 2 Questions ✓ | Status = Active ✓
```

#### Template Quality Checklist:
1. ✅ Level-appropriate questions
2. ✅ Balanced competency distribution
3. ✅ Clear, specific language
4. ✅ No biased content
5. ✅ Appropriate question count
6. ✅ All sections complete
7. ✅ Active status for production use

---

**📧 Questions?** Contact the CRS support team or HR department for assistance with assessment template setup and competency framework questions.

---

**📝 Last Updated**: January 2025  
**👤 Document Owner**: CRS Admin Team & HR Department  
**🔄 Review Cycle**: Quarterly