# 🧑‍💻 Dokumentasi Referensi Developer – CRS Web App

Dokumentasi ini ditujukan untuk mempermudah proses coding dengan menyediakan struktur database, rute halaman, enum/konstanta, dan utilitas penting yang reusable.

---

## 📁 1. Struktur Firestore (Collection Plan)

### assessments/
```json
{
  "id": "assessment_001",
  "title": "Evaluasi Q3 Supervisor",
  "templateIds": ["template_supervisor"],
  "pin": "X7KZ3F",
  "isActive": true,
  "createdAt": "timestamp",
  "createdBy": "uid_admin"
}
```

### criteria_templates/
```json
{
  "id": "template_supervisor",
  "level": "Supervisor",
  "section1": [{ "text": "...", "category": "Soft Skill" }],
  "section2": [{ "text": "..." }],
  "section3": {
    "type": "fixed_options",
    "options": ["Dipertahankan", "Promosi", "Rotasi", "Pembinaan"]
  }
}
```

### employees/
```json
{
  "id": "emp_001",
  "name": "Ahmad Fadli",
  "position": "Supervisor",
  "location": "Jakarta Timur"
}
```

### assessment_results/
```json
{
  "assessmentId": "assessment_001",
  "targetUser": { "id": "emp_001", "name": "..." },
  "evaluator": {
    "name": "...", "position": "...", "division": "...", "status": "Atasan Langsung"
  },
  "scores": [{ "category": "Soft Skill", "average": 4.2 }],
  "semangatScores": [4, 4, 5, 3],
  "recommendation": "Promosi",
  "submittedAt": "timestamp"
}
```

### logs/
```json
{
  "id": "log_001",
  "assessmentId": "assessment_001",
  "evaluatorId": "uid_001",
  "targetId": "emp_001",
  "timestamp": "timestamp",
  "action": "submit_assessment"
}
```

---

## 📂 2. Struktur Routing (Next.js / App Router)

```
/pages/
├── index.tsx                 // Input PIN
├── pin/[pin].tsx             // Isi data evaluator + target
├── pin/[pin]/form.tsx        // Form penilaian
├── admin/assessments.tsx     // Buat & kelola assessments
├── admin/templates.tsx       // Setup pertanyaan
├── admin/employees.tsx       // Setup karyawan
├── admin/reports.tsx         // Laporan hasil
```

---

## 🔢 3. Enum & Konstanta Global

### roles.ts
```ts
export const USER_ROLES = ["admin", "assessor", "user"];
```

### status.ts
```ts
export const RELATIONSHIP_STATUS = [
  "Atasan Langsung",
  "Rekan Kerja Setara",
  "Bawahan",
  "Bagian Terkait",
  "Human Capital Development (HCD)"
];
```

### jabatan.ts
```ts
export const POSITIONS = [
  "Top Management", "Division Head", "Regional Manager", "Area Manager",
  "Supervisor", "Team Leader", "All Star", "Star", "Member", "Training"
];
```

---

## ⚙️ 4. Fungsi Utility Penting

### utils/generatePIN.ts
```ts
export const generatePIN = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};
```

### utils/scoreAverage.ts
```ts
export const calculateAverage = (values: number[]) =>
  values.reduce((a, b) => a + b, 0) / values.length;
```

---

## ✅ 5. Validasi Penting

- Cek `targetUser` + `evaluatorId` belum pernah mengisi untuk assessment yang sama
- PIN harus valid dan aktif
- Semua field evaluator wajib diisi sebelum masuk form

---

Dokumentasi ini bisa digunakan sebagai referensi awal setup project atau integrasi AI Cursor.